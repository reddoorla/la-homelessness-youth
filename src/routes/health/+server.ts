import { json } from "@sveltejs/kit";
import * as privateEnv from "$app/env/private";
import * as publicEnv from "$app/env/public";
import type { RequestHandler } from "./$types";

// A live probe — must never be prerendered.
export const prerender = false;

export const GET: RequestHandler = async () => {
  // This site has no $lib/prismicio module, so there is no CMS to probe: report
  // "skipped" (the gate treats CMS as "never ran", never a false green).
  const prismic = "skipped" as const;
  const forms = {
    ingestUrl: !!privateEnv.FORMS_INGEST_URL,
    ingestToken: !!privateEnv.FORMS_INGEST_TOKEN,
    turnstile: !!publicEnv.PUBLIC_TURNSTILE_SITE_KEY?.trim(),
    // /api/forms forwards the form-e2e probe's `testMode` marker, so the fleet
    // probe may submit here.
    testMode: true,
  };
  // We're inside the handler, so the function ran.
  const ok = true;
  return json({ ok, prismic, forms });
};
