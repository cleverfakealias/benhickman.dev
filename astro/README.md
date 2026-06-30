# benhickman.dev — Astro 7 on Cloudflare Workers

Rebuild of benhickman.dev as an Astro 7 app deployed to **Cloudflare Workers**, replacing the
React 19 + Vite SPA in `../ui/`. Recreates the **Obsidian Foundry** design as static HTML per
route at the edge, with React islands only where genuinely interactive and Cloudflare-native
endpoints for the contact form and the ⌘K "ask my work" bar.

See the intents in `../.agents/intents/` (`astro-cloudflare-rebuild` + `astro-p1..p6`).

## Stack

| | |
|---|---|
| Framework | Astro 7 (`output: 'server'`, per-route `prerender = true`) |
| Adapter | `@astrojs/cloudflare` 14 → Cloudflare Workers |
| Islands | `@astrojs/react` 6 + React 19 |
| Content | Sanity (`@sanity/client`, `@sanity/image-url`, `astro-portabletext`) at build time |
| Tooling | `wrangler` 4, `astro check` (typecheck) |

## Commands

```bash
npm install

npm run dev        # astro dev — fast page iteration (mock CF bindings via platformProxy)
npm run preview    # astro build + wrangler dev — real workerd runtime + bindings (/api/*)
npm run build      # astro build — emits ./dist/{client,server} + dist/server/wrangler.json
npm run check      # astro check — typecheck (tsc for .astro/.ts)
npm run deploy     # build + wrangler deploy
npm run cf-typegen # wrangler types — regenerate Worker binding types
```

### Local dev story

- **`npm run dev`** (`astro dev`) — fastest for building pages/components. `platformProxy` is
  enabled, so KV/env bindings are mocked locally.
- **`npm run preview`** (`astro build` + `wrangler dev -c dist/server/wrangler.json`) — runs the
  built Worker on the real `workerd` runtime with actual bindings. The adapter rewrites the root
  `wrangler.jsonc` into `dist/server/wrangler.json` (correct built paths + the auto-added SESSION
  KV); both `dev` and `deploy` target that generated config. Use this to exercise `/api/*`
  (contact, ⌘K) before deploying.

## Rendering split

- `src/pages/index.astro` — `export const prerender = true` → emitted as static HTML.
- `src/pages/api/ping.ts` — `export const prerender = false` → runs on the Worker per request.

Verify the split after `npm run build`: the build log lists the prerendered route as a `.html`
file under `dist/`, and the endpoint as part of the server bundle.

## Environment variables

> A `.env.example` file can't be committed — the repo's secret-file guard blocks `.env*` paths.
> Create a local `.env` (gitignored) with the **public** vars below. Secrets go in `.dev.vars`
> for `wrangler dev`, and on the Worker via `wrangler secret put` — never in `.env`, never
> `PUBLIC_`-prefixed, never committed.

**Public** (`PUBLIC_` prefix → inlined into client bundles):

```ini
PUBLIC_SANITY_PROJECT_ID=
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2025-01-01
PUBLIC_GA_MEASUREMENT_ID=          # Phase 4
PUBLIC_TURNSTILE_SITE_KEY=         # Phase 4/5
```

**Secrets** (`wrangler secret put <NAME>`; local: `.dev.vars`):

```ini
TURNSTILE_SECRET=                  # Phase 4 — Turnstile server verify (required)
# Contact delivery — set EITHER the Resend trio OR a server-side forward URL:
RESEND_API_KEY=                    # Phase 4 — email via Resend
CONTACT_TO=                        # Phase 4 — destination address (Resend)
CONTACT_FROM=                      # Phase 4 — verified sender (Resend)
CONTACT_FORWARD_URL=               # Phase 4 — alt: server-side Formspree endpoint
OPENROUTER_API_KEY=                # Phase 5 — ⌘K live agent
OPENROUTER_MODEL=                  # Phase 5 — model id
```

## Deploy

`wrangler deploy` (after `wrangler login`). Custom domains, KV namespaces, Turnstile, and CI are
provisioned in Phase 6. Worker config lives in `wrangler.jsonc`.
