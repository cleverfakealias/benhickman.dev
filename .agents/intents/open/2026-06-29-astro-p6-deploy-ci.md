---
id: 2026-06-29-astro-p6-deploy-ci
owner: Zenn
created: 2026-06-29
phase: 6
parent: 2026-06-29-astro-cloudflare-rebuild
---

# Phase 6 — Deploy, domains, CI, and cutover

## Goal
Ship `astro/` to Cloudflare production on benhickman.dev, stand up an `astro/`-scoped CI gate,
then retire the `ui/` SPA + Vercel once parity is confirmed.

## Scope
- `wrangler.toml` (prod), Cloudflare dashboard config (domains, KV, secrets, Turnstile),
  `public/_headers` + `_redirects`, CI workflow for `astro/`, DNS cutover.

## Tasks
- [ ] **Provision (owner CLI/dashboard steps):** create the KV namespace, a Turnstile site+secret pair, and set secrets (`TURNSTILE_SECRET`, mail/Resend key, later `OPENROUTER_API_KEY`) via `wrangler secret put`. Bind KV in `wrangler.toml`.
- [ ] Production `wrangler deploy`; attach the custom domain **benhickman.dev** (+ `www`) to the Worker.
- [ ] **zennlogic.com / zengineer.cloud → redirect** to benhickman.dev (CF redirect rules) — benhickman.dev is the standalone canonical hub.
- [ ] `public/_headers` (CSP/security + cache-control for static assets) and `_redirects` (legacy `/blog/*`, `/experience`, `/career`, `/playground`).
- [ ] CI: an `astro/`-scoped gate (typecheck + lint + test + `astro build`) on push — GitHub Actions or the Cloudflare Git integration. Add `astro/` to the repo's hook/tooling coverage.
- [ ] Smoke pass: Lighthouse (LCP/CLS), broken-link check, social-card unfurl, the Turnstile-gated contact + ⌘K endpoints under prod.
- [ ] **Cutover:** confirm parity, flip DNS, then retire the Vercel project + delete/retire `ui/` (or keep archived).

## Acceptance criteria
- benhickman.dev is served from the Cloudflare Worker; static assets cached, `/api/*` dynamic.
- Redirects + apex/www + cross-domain redirects all resolve.
- `astro/` CI is green and wired into the repo gate.
- `ui/` + Vercel retired after parity is verified.

## Depends on
- Phases 1–5.

## Risks
- Secret/KV/domain setup is operational (CLI/dashboard), not agent file writes — repo guard hooks block secret/policy edits.
- Vercel→Cloudflare DNS cutover needs coordination across the multi-domain setup; keep `ui/` live until the flip.
