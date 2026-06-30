---
id: 2026-06-29-astro-p1-scaffold
owner: Zenn
created: 2026-06-29
phase: 1
parent: 2026-06-29-astro-cloudflare-rebuild
---

# Phase 1 — Scaffold the Astro + Cloudflare pipeline

## Goal
Stand up `astro/` and prove the end-to-end pipeline: a fresh Astro 6 app with the Cloudflare
Workers adapter that builds, runs both a **prerendered page** and a **server endpoint** locally
under `wrangler dev`, and deploys a hello-world to `*.workers.dev`. Lock known-good versions
before any feature work.

## Scope
- New `astro/` directory (sibling to `ui/`, `studio/`) with its own `package.json`, `tsconfig.json`,
  `astro.config.mjs`, `wrangler.toml`, `.env.example`, `.gitignore`.

## Tasks
- [x] Manual scaffold (avoided interactive `npm create`); pinned **Astro 7.0.3** (v7 went GA after this intent was written — see parent's Versions decision).
- [x] Added `@astrojs/cloudflare@14` + `@astrojs/react@6` + React 19; `@sanity/client`, `@sanity/image-url`, `astro-portabletext` (for later phases).
- [x] `astro.config.mjs`: `output: 'server'`, `adapter: cloudflare({ imageService: 'compile' })`, `integrations: [react()]`; tsconfig `paths` alias `@/* → src/*`. (v14 dropped `platformProxy` — the bundled CF Vite plugin provides dev bindings.)
- [x] `wrangler.jsonc` (modern, allows comments): name, `compatibility_date`, `nodejs_compat`, `assets` binding, commented KV + secret bindings. Adapter rewrites it into `dist/server/wrangler.json` (correct built paths + auto-added SESSION KV); dev/deploy target that generated config.
- [x] TS strict (`astro/tsconfigs/strict`); `src/env.d.ts` types `PUBLIC_*` + `App.Locals` (cfContext). `Env`/`cloudflare:workers` typed by `worker-configuration.d.ts` (gitignored; regenerated via `postinstall: wrangler types`).
- [x] Proved the split: `index.astro` (`prerender = true` → static `dist/client/index.html`) + `api/ping.ts` (server; `now` = request-time, `hasAssetsBinding: true`). Confirmed under `wrangler dev` on real `workerd`.
- [x] Local dev story documented in `astro/README.md`: `astro dev` (fast) + `astro build && wrangler dev` (real bindings).
- [ ] **Deploy hello-world to `*.workers.dev`** — needs `wrangler login` (Cloudflare OAuth, interactive). **Owner CLI step**; everything else is verified.

## Acceptance criteria
- [x] `astro build` succeeds; prerendered page is static HTML (`dist/client/index.html`), endpoint is a server route (`dist/server/entry.mjs`).
- [x] `wrangler dev` serves both the static page and `/api/ping` (curl-verified — static = frozen build stamp; ping = fresh request stamp + reachable ASSETS binding).
- [ ] A hello-world Worker live on `*.workers.dev` — pending owner `wrangler login` + `wrangler deploy`.
- [x] Versions pinned; no Astro/adapter build errors; hybrid split verified; `astro check` clean (0 errors).

## Depends on
- (none — first phase)

## Risks
- Astro 6 + `@astrojs/cloudflare` are recent: known issues with hybrid prerender on Workers + base-prefix assets. Pin versions; verify the split before going wide.
- Astro v6 removed `Astro.locals.runtime.env` — endpoints read env via `import { env } from 'cloudflare:workers'`. Establish this pattern now.
