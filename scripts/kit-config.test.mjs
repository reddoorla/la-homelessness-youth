import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfigFromFile } from "vite";
import { variables } from "../src/env.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

async function flatten(option) {
  const value = await option;
  if (!value) return [];
  if (Array.isArray(value)) return (await Promise.all(value.map(flatten))).flat();
  return [value];
}

async function kitOptions() {
  const loaded = await loadConfigFromFile(
    { command: "build", mode: "production" },
    join(repoRoot, "vite.config.ts"),
    repoRoot,
  );
  if (!loaded) throw new Error("vite.config.ts did not load");
  const plugins = await flatten(loaded.config.plugins ?? []);
  const setup = plugins.find((p) => p.name === "vite-plugin-sveltekit-setup");
  if (!setup) throw new Error("vite.config.ts does not register the sveltekit() plugin");
  return setup.api.options;
}

describe("the SvelteKit config reaches the sveltekit() plugin", () => {
  it("has no svelte.config.js or svelte.config.ts, which kit 3 refuses to start beside", () => {
    assert.equal(existsSync(join(repoRoot, "svelte.config.js")), false);
    assert.equal(existsSync(join(repoRoot, "svelte.config.ts")), false);
  });

  it("hands kit the adapter and keeps $lib resolving", async () => {
    const options = await kitOptions();
    assert.equal(options.adapter?.name, "@sveltejs/adapter-netlify");
    assert.equal(options.alias?.$lib, "src/lib");
  });

  it("never sets paths.origin, which would refuse form posts from every other host", async () => {
    const options = await kitOptions();
    assert.equal(options.paths?.origin, undefined);
  });
});

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(svelte|ts|js)$/.test(entry) && !/\.(test|spec)\.ts$/.test(entry)) out.push(full);
  }
  return out;
}

function envReads(source) {
  const reads = [];
  const add = (type, name) => reads.push({ type, name });
  const namespaces = source.matchAll(
    /import\s+\*\s+as\s+(\w+)\s+from\s+["']\$app\/env\/(public|private)["']/g,
  );
  for (const [, binding, type] of namespaces) {
    for (const [, name] of source.matchAll(new RegExp(`\\b${binding}\\.([A-Z][A-Z0-9_]*)`, "g"))) {
      add(type, name);
    }
    for (const [, name] of source.matchAll(
      new RegExp(`\\b${binding}\\[\\s*["'\`]([A-Z][A-Z0-9_]*)["'\`]\\s*\\]`, "g"),
    )) {
      add(type, name);
    }
    for (const [, body] of source.matchAll(
      new RegExp(`\\{([^}]*)\\}\\s*=\\s*${binding}\\b`, "g"),
    )) {
      for (const [, name] of body.matchAll(/(?:^|,)\s*([A-Z][A-Z0-9_]*)\b/g)) add(type, name);
    }
  }
  const named = source.matchAll(
    /import\s*\{([^}]*)\}\s*from\s+["']\$app\/env\/(public|private)["']/g,
  );
  for (const [, body, type] of named) {
    for (const [, name] of body.matchAll(/(?:^|,)\s*([A-Z][A-Z0-9_]*)\b/g)) add(type, name);
  }
  return reads;
}

describe("environment variables (kit 3 exposes only what src/env.ts declares)", () => {
  const files = walk(join(repoRoot, "src"));

  it("finds the reads it is meant to check (the instrument's control)", () => {
    const names = files.flatMap((f) => envReads(readFileSync(f, "utf8")).map((r) => r.name));
    assert.ok(names.includes("FORMS_INGEST_URL"));
    assert.ok(names.includes("PUBLIC_TURNSTILE_SITE_KEY"));
  });

  it("sees every way a file can read one (the instrument's own control)", () => {
    const source = [
      'import * as env from "$app/env/private";',
      'import { NAMED_A, NAMED_B as b } from "$app/env/public";',
      "env.DOTTED;",
      'env["BRACKETED"];',
      "const { DESTRUCTURED, RENAMED: r } = env;",
    ].join("\n");
    assert.deepEqual(
      envReads(source)
        .map((read) => `${read.type}:${read.name}`)
        .sort(),
      [
        "private:BRACKETED",
        "private:DESTRUCTURED",
        "private:DOTTED",
        "private:RENAMED",
        "public:NAMED_A",
        "public:NAMED_B",
      ].sort(),
    );
  });

  it("declares every variable src/ reads, as public exactly when it is read from $app/env/public", () => {
    const missing = files.flatMap((file) =>
      envReads(readFileSync(file, "utf8"))
        .filter(
          ({ type, name }) =>
            !(name in variables) || !!variables[name].public !== (type === "public"),
        )
        .map(({ type, name }) => `${relative(repoRoot, file)}: ${name} from $app/env/${type}`),
    );
    assert.deepEqual(missing, []);
  });

  it("imports nothing from $app/stores, whose stores throw app_stores_removed in kit 3", () => {
    const stores = files.filter((file) =>
      /(?:from|import\s*\()\s*["']\$app\/stores["']/.test(readFileSync(file, "utf8")),
    );
    assert.deepEqual(
      stores.map((f) => relative(repoRoot, f)),
      [],
    );
  });

  it("reads none through $env/*, whose `env` object is now only a view of the declared list", () => {
    const legacy = files.filter((file) =>
      /(?:from|import\s*\()\s*["']\$env\//.test(readFileSync(file, "utf8")),
    );
    assert.deepEqual(
      legacy.map((f) => relative(repoRoot, f)),
      [],
    );
  });
});
