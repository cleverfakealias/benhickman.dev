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
npm run setup:local # create .env + .dev.vars from safe templates (no overwrite)

npm run dev        # astro dev — fast page iteration with local Cloudflare bindings
npm run preview    # astro build + wrangler dev — real workerd runtime + bindings (/api/*)
npm run build      # astro build — emits ./dist/{client,server} + dist/server/wrangler.json
npm run check      # astro check — typecheck (tsc for .astro/.ts)
npm run deploy     # build + wrangler deploy
npm run cf-typegen # wrangler types — regenerate Worker binding types
```

Requires Node.js 22.12.0 or newer. This package uses npm and its local `package-lock.json`.

## First-time local setup

```bash
cd astro
npm install
npm run setup:local
npm run dev
```

`setup:local` copies `.env.example` to `.env` and `.dev.vars.example` to `.dev.vars`. It fills
in the shared public Sanity project (`unh13egm` / `production`) and always-pass CAPTCHA test
keys (Cloudflare Turnstile for ⌘K, hCaptcha for the contact widget), and never overwrites a
populated local file. Both generated files are gitignored. The site and Sanity-backed writing
work immediately; the command bar uses its local project stub until an LLM key is added, and
the contact form shows "not configured" until the Formspree endpoint is set.

### Local dev story

- **`npm run dev`** (`astro dev`) — fastest for building pages/components. The Cloudflare Vite
  plugin supplies local KV/env bindings.
- **`npm run preview`** (`astro build` + `wrangler dev -c dist/server/wrangler.json --env-file
  .dev.vars`) — runs the
  built Worker on the real `workerd` runtime with actual bindings. The adapter rewrites the root
  `wrangler.jsonc` into `dist/server/wrangler.json` (correct built paths + the auto-added SESSION
  KV). The script explicitly loads the root `.dev.vars`, so local secrets work even though the
  generated config lives under `dist/server`. Use this to exercise `/api/*` (⌘K) before
  deploying.

## Rendering split

- `src/pages/index.astro` — `export const prerender = true` → emitted as static HTML.
- `src/pages/api/ping.ts` — `export const prerender = false` → runs on the Worker per request.

Verify the split after `npm run build`: the build log lists the prerendered route as a `.html`
file under `dist/`, and the endpoint as part of the server bundle.

## Environment variables

Safe templates are committed as `.env.example` and `.dev.vars.example`; bootstrap them with
`npm run setup:local`. Public build-time values belong in `.env`. Worker secrets belong in
`.dev.vars` locally and are set in production with `wrangler secret put` — never put a secret in
`.env`, give it a `PUBLIC_` prefix, or commit it. See [LOCAL-TESTING.md](LOCAL-TESTING.md) for the
full test matrix.

**Public** (`PUBLIC_` prefix → inlined into client bundles):

```ini
PUBLIC_SANITY_PROJECT_ID=unh13egm
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2025-02-19
PUBLIC_GA_MEASUREMENT_ID=          # optional; blank disables local analytics
PUBLIC_CMDK_TURNSTILE_SITE_KEY=    # interaction-only ⌘K chat widget (Turnstile)
PUBLIC_FORMSPREE_URL=              # contact form endpoint (https://formspree.io/f/<id>)
PUBLIC_HCAPTCHA_SITEKEY=           # contact form hCaptcha widget
```

The contact form posts directly from the browser to Formspree, which verifies the hCaptcha
token server-side (enable hCaptcha in the Formspree form settings) — no Worker secrets are
involved. Turnstile now protects only the ⌘K chat.

**Secrets** (`wrangler secret put <NAME>`; local: `.dev.vars`):

```ini
CMDK_TURNSTILE_SECRET=             # chat widget secret (falls back to TURNSTILE_SECRET)
LLM_API_KEY=                       # optional; blank enables the local stub
LLM_BASE_URL=https://integrate.api.nvidia.com/v1
LLM_MODEL=nvidia/nemotron-3-super-120b-a12b
LLM_ENABLE_THINKING=false
# Optional Langfuse tracing (chat observability; off when keys are blank):
LANGFUSE_PUBLIC_KEY=
LANGFUSE_SECRET_KEY=
LANGFUSE_BASE_URL=https://us.cloud.langfuse.com
```

The command-bar assistant keeps the last six user/assistant exchanges for 24 hours in the local
or production `CMDK_KV`, keyed by Astro's session ID. Use **New chat** to clear that history. See
[CHAT-SETUP.md](CHAT-SETUP.md) for the request flow, production provider setup, limits, and
diagnostics.

## Deploy

`wrangler deploy` (after `wrangler login`). Custom domains, KV namespaces, Turnstile, and CI are
provisioned in Phase 6. Worker config lives in `wrangler.jsonc`.
