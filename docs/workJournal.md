# Hearts and Minds — Work Journal

Running log of build work: what was done, why, and where it landed.
Chronological — newest entry at the bottom. The code says what the site does
now; this is the history of getting it there.

The convention is in [CLAUDE.md](../CLAUDE.md) under "The work journal". In
short: every working session appends a dated entry, prose over bullets, why
over what, and history is never edited to be right — a later entry corrects an
earlier one and says so.

---

## 2026-09-05 — Journal opened, 81 commits summarised rather than reconstructed (`chore/work-journal`)

The journal starts today, so this first entry is a **backfill**: a deliberately
coarse summary written from the commit log, not from memory. Detail below this
line is trustworthy; detail above it is not, and nothing here should be cited
as though someone wrote it down at the time. The commit log remains the record
for anything before 2026-09-05.

**What this repo is.** _Hearts and Minds_ — a single-page scrollytelling
awareness site about unhoused youth and their mental health in Los Angeles,
built on SvelteKit 2 / Svelte 5 / Tailwind v4 and deployed to Netlify. There is
no CMS: the whole site, copy and animation alike, is one 2,592-line
`src/routes/+page.svelte`, driven by two stores (`activeFrame`, `bgColor`) that
slide full-viewport `Panel`s in and out.

**The eras.** 81 commits, 2024-05-22 to 2026-07-06. **67 of them are 2024** —
the original build, in terse imperative messages ("first panel", "shattering
first pass", "accordians", "changes with nicole!"): panels and their SVG
scenes through May, myth-shattering and navigation through June, then a single
day, 2024-06-20, carrying seventeen commits of phone polish. July 2024 closes
it out with Apple-toolbar spacing fixes, reCAPTCHA Enterprise and the 211
referral. Then quiet: **one commit in all of 2025** (`robots.txt`,
2025-09-16). **June 2026 is the fleet onboarding** — twelve commits that
migrated the site onto the Svelte 5 stack (#1), the shared CI shim and org
Renovate preset (#3), Node 24 + pnpm 11 (#5), the shared Typekit kit `noj4tji`
loaded async (#6, #7), the contact modal onto central forms ingest, dropping
reCAPTCHA and SendGrid (#8), plus icon-button labels and heading order (#9).

**The split, and what it means for this repo.** Everything above is shared
history with `la-homelessness-initiative`. The only commit unique to here is
HEAD: `dc068b2` (2026-07-06), which renames the package and bumps
`@reddoorla/maintenance` to `^0.69.0`. Nothing has been built on this fork
since. The sibling has moved on — it is at 89 commits with a `/health`
endpoint and a smoke suite this repo does not have — so a fix that exists there
does not exist here. Also unreconciled: `.env.example` still names the fleet
slug `youth-mental-health`, which matches neither repo's name.

**State as of this entry.** Branch `chore/work-journal` off `main` at
`dc068b2`, tree clean, no other branches, nothing in flight. Today's change is
this file and a new `CLAUDE.md`.

## 2026-10-12 — SvelteKit 3 and adapter-netlify 7 on `staging`, and the staging flow (#31, #32; promotion #33)

This repo is the first factory-shaped site in the fleet's kit 3 migration. It is one of the repos the operator moved onto the feature → staging → main flow (reddoor-maintenance Operator decisions 113, #545).
- `staging` was cut from `main` at `dddb216`, and Netlify now builds `staging--la-homelessness-youth.netlify.app`.
- `main-gate` (#31) and the migration (#32) landed on `staging`.
- Only the operator merges the promotion, #33.

**The port was small:**
- `svelte.config.js`'s `createSvelteConfig({ kit: { adapter } })` became `sveltekit.config.js`'s `createKitConfig({ adapter })` from `@reddoorla/maintenance` 0.107.0. The review loaded both in node and found the adapter, aliases and warning filter carried over, with `$lib` added.
- The forms endpoint, `/health` and the dev layout read through `$app/env`, against the starter's `src/env.ts`.

**The gate had to be ported, and its first run proved nothing.** This repo has no unit runner, and adding vitest for one file would have widened the change. So the starter's `kit-config` gate became `scripts/kit-config.test.mjs` on `node:test`, with `pnpm test` running it, which CI's "Test (if present)" step picks up.
- The first `node --test scripts/` treated the directory as a module, so nothing ran.
- With a glob it runs 8 checks. Four mutations each turn one red: the forms endpoint back on `$env/dynamic/private`, `FORMS_INGEST_TOKEN` undeclared, `paths.origin` set, and a `svelte.config.js` restored.
- CI's log on #32 shows `node --test 'scripts/**/*.test.mjs'` running with every case passing.

**The env change, checked where it matters.** Kit 3 turns an undeclared env read into a silent `undefined`. Staging's `/health` reads `ingestUrl: true, ingestToken: true, turnstile: false`, identical to production on kit 2, so the declared variables reach the deployed function. The smoke suite (2 tests) passed on both.

**Left as it was.** This file's `CLAUDE.md` still says the sibling repo has the `/health` endpoint and smoke suite this one lacks. Both exist here now. That predates this change, and the review noted it.
