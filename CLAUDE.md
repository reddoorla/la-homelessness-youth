# CLAUDE.md

_Hearts and Minds_ — a single-page scrollytelling awareness site about unhoused
youth and their mental health in Los Angeles. SvelteKit 2 / Svelte 5 /
Tailwind v4 on Netlify, split from `la-homelessness-initiative` in July 2026.
There is no CMS: the entire site, copy and animation alike, lives in one
2,592-line `src/routes/+page.svelte`, with two stores (`$lib/stores/activeFrame`,
`$lib/stores/colors`) sliding full-viewport `Panel`s in and out.

Commands: `pnpm dev`, `pnpm build`, `pnpm check` (svelte-check), `pnpm lint`
(prettier + eslint), `pnpm format`. There is no `test` script here — CI is the
org's reusable workflow (`reddoorla/.github` `ci.yml`).

Two things worth knowing before you change something:

- **Panel colours and slide transforms are built as dynamic class strings**
  (`bg-{$bgColor}`, `translate-{axis}-full`), so Tailwind cannot see them.
  `src/app.css` keeps them alive with `@source inline(...)` — the v4
  replacement for v3's `safelist`. A new colour must be added to the `@theme`
  block AND that list, or the class silently does not exist.
- **History up to `dc068b2` is shared with `la-homelessness-initiative`, and
  the two have since diverged.** The sibling gained a `/health` endpoint and a
  smoke suite that this repo does not have. Do not assume a fix that landed
  there landed here.

## The work journal

**Every working session appends a dated entry to `docs/workJournal.md`** — what
was done and **why**, newest at the bottom, never corrected in place. Write it
as the last act of the session, not the first act of the next one.

The journal is the history of executing the build. Code says what the system
does now; the journal says what it used to do, what it cost to change, and
which beliefs turned out to be wrong. Nearly everything expensive to rediscover
lives there and nowhere else.

An entry is headed with the date, a short title, and where it landed:

```markdown
## 2026-09-04 — Both runway stages render their final frame without JS (#51, `ce46ae0`)
```

Then prose — not a bullet list of file names, which the diff already tells you.
What to put in, in rough order of value:

- **Why, over what.** The reason a thing was done survives; the diff does not
  need restating.
- **Measured numbers, exactly.** "The comp's open mask is 2696×2352 on an 860px
  band — 2.735× the band's height, so a 390×664 phone needs ~534%" is worth
  keeping. "Fixed the hero on mobile" is not.
- **Defects, named.** What broke, what it looked like, and what made it
  invisible until it wasn't.
- **What was tried and abandoned**, and what it would take to revive it. A dead
  end nobody wrote down gets walked twice.
- **Beliefs corrected on contact.** The design assumption that turned out false
  is usually the most valuable line in the entry.
- **Honest accounting.** If a win came from somewhere other than the change
  that claimed it, say so — that is exactly what someone will otherwise
  over-invest in next.

**History is never edited to be right.** An entry that stops being true is not
rewritten; a later entry corrects it, and says which one it corrects. The
journal is a record of what was believed at the time, and that record is most
useful precisely where it was wrong. Fixing the past in place destroys the only
evidence of how the mistake was made.

The one edit an old entry may take is a **forward pointer**: one line directly
under its heading naming the entry that overturned it — `> Superseded in part by
2026-10-14 — <that entry's title>.` It asserts nothing new and retracts nothing,
so the record of what was believed survives whole; it only stops a reader who
lands on the old paragraph from leaving with the old answer. Without it the rule
above is half a mechanism: the correction exists at the bottom of the file, and
nothing points to it from where a reader actually arrives.

If a session produced nothing worth an entry, that is itself worth one line.
