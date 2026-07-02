# Spec: Astro review remediation

**Status:** COMPLETE — all 5 workstreams + wave 2 landed; adversarial diff
review (3 reviewers + 10 verifiers) found 10 issues, all fixed; full gate green
(Biome, astro check, 84/84 Vitest, build), no data: fonts in built CSS,
canonicals point at 200-serving URLs. Uncommitted on
feat/obsidian-foundry-redesign. Owner tasks listed below remain open.
**Date:** 2026-07-01
**Scope:** `astro/` — fix all findings from the 2026-07-01 deep review (4-dimension
agent review + 10-finding adversarial verification pass; see session report).

## Goals

Fix every confirmed finding that is fixable in-repo, grouped into five parallel
workstreams with exclusive file ownership, then re-run the full verify gate and
an adversarial review of the diff.

## Workstreams

### A — API & platform hardening
Files: `astro/src/pages/api/cmdk.ts`, `cmdk.test.ts`, `contact.ts`,
`contact.test.ts`, `astro/src/lib/apiSecurity.ts` (new), `astro/src/middleware.ts`
(new), `astro/wrangler.jsonc`, `astro/src/env.d.ts`.

- Quota layer: try/catch all KV ops (infra error → fail-open + log; missing
  binding → 503 "not configured", not 429); per-IP check before global; global
  only consumed on per-IP pass; shard the global daily counter (8 shards) to
  clear KV's 1-write/sec/key limit; hash IPs (SHA-256(ip+day+secret), 16 hex)
  for all quota keys.
- Sessions: no session writes on GET/DELETE or before POST validation +
  Turnstile; `saveExchange` via `waitUntil` where available.
- Streaming: break read loop when `sse()` reports a dead stream; final decoder
  flush.
- Body-size guard: reject oversized Content-Length (4 KB cmdk / 32 KB contact)
  with 413.
- contact.ts parity: port cmdk's Turnstile verifier (response.ok, hostname,
  action `contact`, idempotency_key, 10s timeout); 10s timeouts on
  Resend/forward; `nosniff`/`no-store` on json(); log delivery failures
  (provider+status only); cap+sanitize name/phone into the subject.
- `middleware.ts`: baseline security headers on non-prerendered responses.
- `wrangler.jsonc`: bump `compatibility_date` → 2026-06-01; optional burst
  `ratelimits` binding (graceful when absent).
- Tests for: Turnstile verifier (incl. local relaxations), quota ordering,
  IP hashing, body-size guard.

### B — Palette a11y, weight, layout head
Files: `CommandPalette.tsx`, `src/lib/searchIndex.ts` (+ new tests), new
`src/lib/scoreItem.ts`, new `src/pages/search-index.json.ts`,
`BaseLayout.astro`.

- ARIA 1.2 combobox pattern (combobox/listbox/option, `aria-activedescendant`,
  `aria-selected`, results-count live region); Enter hijack guarded on
  activeElement === input; `maxLength={500}`; announce completed answers, not
  per-token stream.
- `client:idle`; drop the `items` prop; fetch `/search-index.json` (new
  prerendered endpoint) on first open.
- Self-host fonts (Fontsource, preinstalled), subset weights, preload primary;
  head adds: RSS alternate link, `theme-color`, manifest/apple-touch-icon if
  assets exist.
- Theme inline script also syncs `aria-pressed` on `[data-theme-toggle]`
  (contract with C).

### C — Design tokens, consent, forms a11y
Files: `global.css`, `ThemeToggle.astro`, `ConsentBanner.tsx`,
`CookieSettings.tsx`, `ContactForm.tsx`, `src/lib/consent.ts` (+ new tests),
`Analytics.astro`, `public/_headers`, `astro/biome.json`.

- Dark-mode filled-button contrast: darker accent fill (verify ≥4.5:1 white
  text, computed); hover state too; applies to button-primary, consent Accept,
  cookie Save, contact submit, bottom-nav Ask pill.
- ThemeToggle initial `aria-pressed`; ConsentBanner `role="region"`;
  ContactForm: focus first invalid field, `role="status"` + focus on success,
  Turnstile `action: 'contact'` (contract with A).
- Consent withdrawal deletes `_ga*` cookies; consent.ts unit tests
  (happy-dom, preinstalled).
- `_headers` CSP `connect-src`: add GA regional hosts.
- biome.json: re-enable `noFocusedTests`.

### D — Sanity freshness & images
Files: `src/lib/sanity.ts`, `writing/index.astro`, `writing/[slug].astro`,
`SanityImage.astro`, `home/WritingTeasers.astro` (if covers used).

- `useCdn: false`; fetch errors THROW (build fails loudly) — empty results
  still render the empty state; `srcset`/`sizes` + `.auto('format')` on all
  Sanity images; LCP cover `fetchpriority="high"` on post pages.
- Must not rename `getAllPosts` (E depends on it).

### E — SEO surfaces
Files: new `src/pages/rss.xml.ts`, `public/robots.txt`, `SEO.astro`,
`src/config/site.ts`.

- RSS feed via `@astrojs/rss` (preinstalled); robots.txt: drop
  `Disallow: /privacy` (noindex stays); canonical trailing-slash
  normalization; `og:locale` + `og:image` dimensions/alt.

### Wave 2 (main thread)
`privacy.astro` (disclose IP-based rate limiting, hardcode Last-updated),
`AGENTS.md` (astro/ canonical note), `CHAT-SETUP.md` log-command fix, this
spec's status.

## Out of scope (owner tasks — cannot or should not be done by agents)

- `.github/workflows` CI for astro/ — **blocked by repo guard hooks** (policy);
  snippet provided in the session report instead.
- Sanity publish → deploy webhook (needs deployed CI + Cloudflare deploy hook).
- Real 1200×630 OG card image (design asset; meta wiring prepared by E).
- Cloudflare account tasks: KV namespace ids, secrets, plan check, custom
  domain/routes.
- Preact swap (explicitly deferred), `ui/` decommission (separate intent).

## Acceptance

- `npm run verify` green in `astro/` (lint + check + tests + build).
- Adversarial review of the final diff finds no confirmed regressions.
- New deps surfaced to the user: `@astrojs/rss`, Fontsource font packages,
  `happy-dom` (dev).
