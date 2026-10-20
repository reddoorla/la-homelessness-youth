import { test, expect, type Page } from "@playwright/test";
import { capturedWith } from "./ingest-capture";

// The fleet's nightly form-e2e probe enters at /contact, needs a <form> in the
// DOM at domcontentloaded, waits for html[data-hydrated], injects a hidden
// `testMode=true` input into the first <form>, fills it, clicks the first
// button[type="submit"], and waits for [role="status"]. Central ingest drops a
// payload carrying top-level boolean `testMode: true` instead of emailing anyone.
// The form here is the suggestion modal on `/`, so /contact → /#contact must open
// it, and the marker must survive the client's JSON (built from bound state) and
// /api/forms. The ingest body lands on the local capture server
// (playwright.config.ts), so nothing leaves the machine.

// The first navigation can meet a cold dev server that compiles for well over
// the default 30 s before it hydrates.
test.describe.configure({ timeout: 90_000 });

async function fillAndSubmit(page: Page, marker: string, { probe }: { probe: boolean }) {
  await page.goto("/contact");
  await page.locator("html[data-hydrated]").waitFor({ state: "attached" });
  const form = page.locator("form").first();
  if (probe) {
    await form.evaluate((f) => {
      const el = document.createElement("input");
      el.type = "hidden";
      el.name = "testMode";
      el.value = "true";
      f.appendChild(el);
    });
  }
  await form.locator('[name="name"]').fill("Reddoor Monitor");
  await form.locator('[name="email"]').fill("monitor+e2e@reddoorla.com");
  await form.locator('[name="subject"]').fill("Smoke test");
  await form.locator('[name="message"]').fill(marker);
  await page.locator('button[type="submit"], input[type="submit"]').first().click();
}

test("the contact form is in the server-rendered DOM, closed", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("form").first().locator('input[name="email"]')).toBeAttached();
  await page.locator("html[data-hydrated]").waitFor({ state: "attached" });
  await expect(page.locator("form").first()).toBeHidden();
});

test("/contact 301s to /#contact, which opens the suggestion modal", async ({ page, request }) => {
  const res = await request.get("/contact?utm_source=x", { maxRedirects: 0 });
  expect(res.status()).toBe(301);
  expect(res.headers().location).toBe("/?utm_source=x#contact");
  await page.goto("/contact");
  expect(new URL(page.url()).hash).toBe("#contact");
  await expect(page.locator("form").first()).toBeVisible();
});

test("a probe submission reaches ingest marked testMode, and shows role=status", async ({
  page,
}, info) => {
  const marker = `smoke probe ${info.testId}`;
  await fillAndSubmit(page, marker, { probe: true });
  await expect(page.locator('[role="status"]').first()).toBeVisible();
  const bodies = await capturedWith(marker);
  expect(bodies).toHaveLength(1);
  expect(bodies[0].testMode).toBe(true);
});

test("a visitor submission reaches ingest without testMode", async ({ page }, info) => {
  const marker = `smoke visitor ${info.testId}`;
  await fillAndSubmit(page, marker, { probe: false });
  await expect(page.locator('[role="status"]').first()).toBeVisible();
  const bodies = await capturedWith(marker);
  expect(bodies).toHaveLength(1);
  expect(bodies[0]).not.toHaveProperty("testMode");
});
