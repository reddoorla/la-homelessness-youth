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

## 2026-10-20 — The suggestion form is covered by the fleet's form-e2e probe (#37, into `staging`)

The same change as la-homelessness-initiative's on the same day, whose journal carries the full story; the code diff is identical. In short: the fleet's form-e2e probe refuses to submit unless `/health` declares `forms.testMode`, and needs a `<form>` in the DOM on `/contact` or `/`. The suggestion modal now stays in the DOM while closed (invisible and `inert`, a CSS transition replacing `fly`), `/contact` 301s to `/#contact`, which opens it, the client reads the probe's hidden `testMode` input from the form element, `/api/forms` forwards it, `/health` declares it, and "THANK YOU!" carries `role="status"`.

**Beliefs corrected on contact.** This repo's CLAUDE.md said the sibling had a `/health` endpoint and a smoke suite this repo lacks. It has had both since #4 (`3338b1d`); the CLAUDE.md now says so. And here `/health` reports `turnstile: false` (no sitekey), so once the probe covers the site it writes `turnstileWidget: "fail"` where it wrote null; `require_turnstile` is 0 for this site, so no digest alarm follows.

**The probe cannot see a broken forward**, so the smoke suite submits the real form to a local capture ingest and asserts on the body. Each brief mutation turns it red: the server dropping `testMode` (1 of 5), reading it from bound state (1 of 5), no `role="status"` (2 of 5), a broken hash opener (3 of 5).

## 2026-11-03 — main brought into staging, lockfile merged by pnpm (this PR)

`main` (`cd11203`) and `staging` (`028c84a`) conflicted in `pnpm-lock.yaml` and nowhere else, by `git merge-tree --write-tree --name-only`: Renovate's non-major group lands on `main` while lock-file maintenance and majors land on `staging`, and git merges a lockfile as text. That left the promotion #51 dirty. The branch was made with maintenance's `scripts/staging-bring-main.mjs` (reddoorla/reddoor-maintenance#1912): `main` merged into a branch cut from `staging`, `package.json` as git merged it, and the pinned pnpm 12.5.1 merging its own lockfile conflict. `pnpm install --frozen-lockfile` is clean on the result. It lands as a merge commit, never a squash, so `main` is a parent and the promotion has nothing left to merge; the promotion stays the operator's.

## 2026-11-05 — `@types/node` back to the runtime's major, 24 (P1-100, `claude/p1-100-types-node-24`)

`.nvmrc` is 24.22.2, but `@types/node` was `^25`, set by hand on 2026-05-27 when Node 25 was current. Types for a newer Node describe APIs production does not have: code that uses one passes `svelte-check` and then fails at runtime. The operator's rule is that `@types/node` follows the runtime (workspace `decisions/2026-11-04-1736-erp-majors-base-and-node26.md` 2(a)). The nightly deps audit holds `@types/node` only at the runtime major (maintenance P1-98), so at 10:15pm PT 11-04 it recorded `@types/node@25` as this site's one major behind, and the cockpit put the site in Watch. The fix is the pin `^24.19.2`. The lockfile change is only `@types/node` 25.9.9 → 24.19.2, plus the pnpm store hash of the packages that peer on it (kit, vite).

No Renovate change was needed. Renovate already groups `@types/node` with the runtime in `renovate/staging-node-26.x` (Awaiting Schedule on the Dependency Dashboard), so it offers 26 only together with Node 26 itself (maintenance P1-99, held until AWS `nodejs26.x` is GA). It never offers 25 on its own.

**How I know the site uses no Node 25-only type.** I first tried a probe using `QuotaExceededError` (from the ERP recipe), and it could not tell 24 from 25: that name only arrives in types 26, so it failed on both. `node:quic` is in types 25 and not in 24. A file importing it passes `svelte-check` on 25.9.9 and fails on 24.19.2 with `Cannot find name 'node:quic'` (run on CalTex). So a clean check on 24 is evidence. Here: lint, `svelte-check` (0 errors, 0 warnings), build and `pnpm test` (8 of 8) pass on `staging` and on the branch. The site is server-rendered and prerenders nothing, so I compared the whole `.svelte-kit/output` (134 files) instead. After normalising the pnpm store directory names (kit's directory hash includes `@types/node` through vite), the build version, `__sveltekit_<id>` and Rolldown's per-build asset placeholder, all 134 are identical. The same normaliser fails on a one-character change (proved on LA Homelessness Initiative).

**The audit, run locally through its production path** (`loadHoldRules` + `scanOutdated`): on `staging` it lists `behind: ["@types/node@25"]`; on this branch, `behind` no longer names `@types/node`, and `held` lists `@types/node@24` ("runtime Node 24"). Mutation 2 (CalTex): with `.nvmrc` set to 25 and types 24, the audit lists `@types/node@24` as behind.
