---
id: 2026-06-29-astro-p6-deploy-ci
owner: Ben (Cloudflare dashboard/CLI) + Zenn (CI/code)
created: 2026-06-29
updated: 2026-06-30
phase: 6
parent: 2026-06-29-astro-cloudflare-rebuild
---

# Phase 6 — Deploy `astro/` to Cloudflare (final checklist)

## Status

All agent-doable work is **done**. `astro/` is a complete, verified Astro 7 app on
`@astrojs/cloudflare`: home/work/writing/about/contact/privacy all prerender; Sanity blog renders
at build time; the contact form + the ⌘K command bar (NVIDIA NIM, swapped in from the original
OpenRouter plan) both run as Turnstile-gated Worker endpoints with KV-backed rate limiting and
session-scoped chat history. `npm run verify` (lint + typecheck + test + build) is green —
31 unit tests now cover the previously-untested security/correctness logic (nav active-state,
chat-history pairing, project-matching, contact validation). Full functional verification was
done against the real `workerd`-backed dev runtime: live streaming LLM answers (correctly
grounded, no hallucinated ownership/employer claims), session continuity, history clear, Turnstile
accept/reject, and the contact pipeline's fail-closed states all behave correctly.

**What's left is exclusively yours** — Cloudflare account actions, secrets, and DNS that an agent
cannot and should not perform (the repo's guard hooks block secret/policy file writes by design,
and account/billing actions need your authorization regardless).

## Before you start

Run these once to see today's state for yourself:
```bash
cd astro
npm run verify   # lint + typecheck + test + build — should finish clean
npm run dev      # http://localhost:4321 — full site + live ⌘K/contact if your local
                 # .dev.vars already has an LLM_API_KEY (yours does); Turnstile uses
                 # Cloudflare's official always-pass TEST keys locally, not real ones.
```

## 1. Cloudflare account setup

- [ ] `wrangler login` (opens a browser OAuth flow — interactive, must be you).
- [ ] Confirm the account/zone benhickman.dev should deploy under (`wrangler whoami`).

## 2. Provision the KV namespace (blocks deploy — currently unset)

`astro/wrangler.jsonc` declares the binding but **has no namespace `id` yet**:
```jsonc
"kv_namespaces": [{ "binding": "CMDK_KV" }]
```
- [ ] `wrangler kv namespace create CMDK_KV` (run from `astro/`).
- [ ] Add the returned `id` to that binding in `wrangler.jsonc`, e.g.:
  ```jsonc
  "kv_namespaces": [{ "binding": "CMDK_KV", "id": "<the-id-you-got-back>" }]
  ```
- [ ] The adapter also auto-adds a `SESSION` KV binding (used for `Astro.session`, which the ⌘K
      endpoint relies on). If `wrangler deploy` complains it needs an id for `SESSION` too, run
      `wrangler kv namespace create SESSION` and add its id the same way — `astro build` writes
      the generated config to `dist/server/wrangler.json`, but the **source you edit is the root
      `wrangler.jsonc`** (see the comment block at the top of that file).

## 3. Turnstile — two separate widgets

Create **two** Turnstile widgets in the Cloudflare dashboard (Turnstile → Add widget), both
restricted to your **production hostname(s) only** — do not allow `localhost` on these:

- [ ] **Contact** widget (visible mode) → gives you a site key + secret.
- [ ] **Chat** widget (interaction-only/invisible mode, action `portfolio-chat`) → a *separate*
      site key + secret. The code checks both the hostname and the `portfolio-chat` action
      server-side, so this must be its own widget, not the contact one reused.

## 4. Set production values

**Public** (inlined into the client bundle at **build time** — set these in your CI/build
environment, e.g. GitHub Actions repo variables or Cloudflare's "Build variables" if you wire the
Git integration in step 7; these are NOT `wrangler secret`):
```
PUBLIC_SANITY_PROJECT_ID=unh13egm
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2025-02-19
PUBLIC_TURNSTILE_SITE_KEY=<contact widget site key>
PUBLIC_CMDK_TURNSTILE_SITE_KEY=<chat widget site key>
PUBLIC_GA_MEASUREMENT_ID=<optional — blank disables analytics entirely>
```

**Secrets** (runtime-only, never in a committed file — set with `wrangler secret put <NAME>`
from `astro/`, once per name):
- [ ] `wrangler secret put TURNSTILE_SECRET` — the contact widget's secret.
- [ ] `wrangler secret put CMDK_TURNSTILE_SECRET` — the chat widget's secret.
- [ ] Contact delivery — pick **one** path (without either, a verified submit returns a clean
      503 "delivery not configured," which is safe but means messages go nowhere):
  - Resend: `wrangler secret put RESEND_API_KEY`, plus `CONTACT_TO` and `CONTACT_FROM`
    (a Resend-verified sending domain/address) as secrets or `vars`.
  - or a forward URL: `wrangler secret put CONTACT_FORWARD_URL` (e.g. a server-side Formspree
    endpoint).
- [ ] `LLM_API_KEY` (NVIDIA NIM, **optional**) — get a free key at https://build.nvidia.com if you
      want the live ⌘K agent in production; without it, ⌘K answers via the local projects-led
      stub and everything else (search/navigate) still works. You already have a working dev key
      in `astro/.dev.vars` — reuse it or roll a fresh one for production, your call.
      `wrangler secret put LLM_API_KEY`. Leave `LLM_BASE_URL`/`LLM_MODEL`/`LLM_ENABLE_THINKING`
      at their code defaults unless you want to override them (as Worker `vars`, not secrets).

## 5. First deploy

- [ ] `cd astro && npm run deploy` (this runs `astro build && wrangler deploy`).
- [ ] Fix forward if `wrangler deploy` errors about a missing KV id (see step 2) and re-run.
- [ ] Confirm the Worker is live at the `*.workers.dev` URL `wrangler deploy` prints.

## 6. Custom domain + DNS

- [ ] Cloudflare dashboard → Workers & Pages → your Worker (`benhickman-dev`) → Settings →
      Domains & Routes → **Add Custom Domain** → `benhickman.dev` (and `www.benhickman.dev` if
      you want both). This only works if benhickman.dev's zone is already on Cloudflare's
      nameservers — if it isn't yet, that's a prerequisite step in the dashboard first.
- [ ] **zennlogic.com / zengineer.cloud → redirect to benhickman.dev**, per the locked decision
      that benhickman.dev is the standalone canonical hub. If those zones are also on Cloudflare,
      use Redirect Rules in each zone; otherwise set the redirect at whatever host currently
      serves them.

## 7. Verify in production

- [ ] Load `https://benhickman.dev/` — home, work, writing, about, contact, privacy all render.
- [ ] Hit a couple of legacy paths (`/blog`, `/experience`, `/playground`) and confirm they
      redirect to the new IA.
- [ ] Fill out the contact form for real — with `TURNSTILE_SECRET` + a delivery path configured,
      this should now return 200 and actually deliver, not the dev-mode 503.
- [ ] Open ⌘K, search, and (if you set `LLM_API_KEY`) ask it a real question — confirm the Turnstile
      widget renders for your **production** site key (not the local test key) and the answer
      streams and stays grounded in `astro/src/data/projects.ts`.
- [ ] Spot-check the social card (OG image) and `Person`/`Article` JSON-LD on a post via any link
      debugger/unfurler.

## 8. CI (recommended, not blocking)

- [ ] Wire `npm run verify` (lint + typecheck + test + build) for `astro/` into either GitHub
      Actions or Cloudflare's Git integration (Workers & Pages → connect a GitHub repo → set the
      build command to `npm run build` with root directory `astro/`, build env vars from step 4).
- [ ] If using the Cloudflare Git integration, future pushes to your default branch auto-deploy;
      otherwise add a `wrangler deploy` step gated on the verify job passing.

## 9. Cutover

- [ ] Once production is verified end-to-end, switch DNS/whatever currently points at the Vercel
      `ui/` deployment over to the new Worker (if not already done via step 6's custom domain).
- [ ] Retire the Vercel project for `ui/`. Decide separately whether to delete `ui/` from the repo
      or keep it archived — no rush, it's inert once DNS has moved.

## Depends on
- Phases 1–5 (done — see `.agents/intents/done/2026-06-29-astro-p{1..5}-*.md`).

## Notes
- Nothing here is an agent file-write — every remaining item is a Cloudflare account action,
  secret, or DNS change, which is exactly the boundary the repo's guard hooks enforce (they
  block edits to secret/policy files on purpose). If you want help with the CI workflow file
  itself (step 8), that part *can* be drafted as a normal commit — ask and it'll get written,
  reviewed, and verified like any other change.
