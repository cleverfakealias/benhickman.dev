---
id: 2026-06-29-astro-p4-integrations
owner: Zenn
created: 2026-06-29
phase: 4
parent: 2026-06-29-astro-cloudflare-rebuild
---

# Phase 4 — Integrations: consent/analytics + contact (Turnstile Worker)

## Goal
Wire the interactive integrations as a few tight islands: a consent-gated analytics layer
re-expressed for an MPA, and the contact form posting to a Cloudflare Worker endpoint that
verifies **Turnstile** server-side (replacing Formspree-direct + hCaptcha).

## Scope
- `src/lib/consent.ts`, `src/components/islands/{ConsentBanner,CookieSettings,ContactForm}.tsx`,
  `src/lib/analytics.ts`, `src/pages/api/contact.ts`, env/secrets wiring.

## Tasks
- [x] Consent store: `src/lib/consent.ts` — nanostores `atom` (granted/denied/unknown), cookie `benhickman_consent_v1` (365d, SameSite=Lax, Secure on https), BroadcastChannel `benhickman_consent_updates` cross-tab sync. No React Context. Tiny cookie helpers (dropped js-cookie).
- [x] Analytics: `src/components/Analytics.astro` inline script — **Consent Mode v2** default DENIED (verified in dataLayer) before any load; gtag.js loads only on `consent==='granted'`; **dropped** the SPA route-listener — page views fire on `astro:page-load` (`send_page_view:false` + manual event), the MPA+view-transitions-correct model. No-ops gracefully until `PUBLIC_GA_MEASUREMENT_ID` is set.
- [x] `ConsentBanner` + `CookieSettings` islands (`client:idle`), design-system styled; banner offset above the mobile bottom bar. Verified: accept→cookie+consent-update+banner hides; footer button opens modal (Essential locked + Analytics toggle); Escape closes.
- [x] `ContactForm` island (`client:visible`): ported `validate()` + fields (name/email/phone/message), **Turnstile** widget (explicit render, `PUBLIC_TURNSTILE_SITE_KEY`; graceful note when unset), POST JSON to `/api/contact`, 15s AbortController timeout + error-parsing + SuccessScreen. (Hydration not testable under the headless preview's IntersectionObserver, but no errors + identical setup to the verified consent islands.)
- [x] `src/pages/api/contact.ts` (server, `prerender=false`): verifies Turnstile via `siteverify` with `TURNSTILE_SECRET` (read from `cloudflare:workers` env, `cf-connecting-ip` as remoteip), then forwards via Resend or a server-side Formspree URL. **Fails closed** when the secret is absent. Verified: 400 invalid body, 400 bad fields, 503 fail-closed, server-only (not in client dist).
- [x] Env split: `PUBLIC_*` site keys vs secrets (`TURNSTILE_SECRET`, `RESEND_API_KEY`+`CONTACT_TO`/`CONTACT_FROM`, or `CONTACT_FORWARD_URL`) via `wrangler secret put` — owner CLI step, documented in README, never written by the agent, never `PUBLIC_`.

## Acceptance criteria
- [x] gtag does not load until consent is granted; Consent-Mode default-denied is set before any config call (verified: only `['consent','default','denied']` until accept, then `update granted`).
- [x] Page views fire once per real navigation (`astro:page-load`), no manual SPA dispatching.
- [x] Contact: invalid/absent token rejected server-side; the secret never reaches the client (server-only endpoint, fail-closed verified). Full verify+forward activates once owner sets secrets.
- [x] Consent banner/modal styled to Obsidian Foundry; cross-tab sync wired (BroadcastChannel). `astro check` clean, build green.

## Owner CLI steps (not agent writes)
- `wrangler secret put TURNSTILE_SECRET` + the delivery secrets (Resend trio or `CONTACT_FORWARD_URL`).
- Set `PUBLIC_TURNSTILE_SITE_KEY` + `PUBLIC_GA_MEASUREMENT_ID` in env (`.env` / CF vars) to activate the widget + analytics.

## Depends on
- Phase 1 (server endpoints) + Phase 2/3 (layout + contact page shell). Shares the Turnstile widget with Phase 5.

## Risks
- Captcha/analytics islands are browser-only — never run in SSR frontmatter (guard with client directives).
- hCaptcha→Turnstile is a rewrite of the widget + token flow, not a copy.
