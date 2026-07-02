---
id: 2026-06-29-astro-cloudflare-rebuild
owner: Zenn
created: 2026-06-29
---

# Recreate benhickman.dev as an Astro app on Cloudflare

## Goal

Rebuild the site as a fresh **Astro 7** project in a new `astro/` directory, deployed to
**Cloudflare Workers** (the proven zennlogic.com pattern), replacing the React 19 + Vite SPA in
`ui/` that ships to Vercel. The rebuild recreates the **Obsidian Foundry** design + verified
content "in a different manner": static HTML per route at the edge, React islands only where
genuinely interactive, and Cloudflare-native server endpoints for the contact form and the
signature ⌘K "ask my work" bar.

This is a clean rewrite, but heavily **reuse-driven** — the design tokens, content, copy, and
GROQ queries all carry over; only the component + runtime layer is new.

## Source of truth

- **Design:** Claude Design project `0e4b3492-50aa-4565-b158-d26074cf2f6a` (home-v1, work,
  writing, about, contact, cmdk-v1, nav-system, theme.css) on DS `5406087f-8b93-4219-9f6d-fc73b049a436`.
- **Content:** `.claude/content-plan/05` (locked decisions + home spec) and `06` (AUTHORITATIVE
  verified project set — never feature `llmfit`/`agent-spec-lab`/`java-spring-ai`/`zennlogic_ai`).
- **Reuse from `ui/`:** `theme/tokens.css` (verbatim), `components/features/home/homeContent.ts`
  (verified typed content), the Sanity GROQ queries + image-url builder, consent/analytics logic,
  the pre-paint theme script, JSON-LD/meta values in `config/domainConfig.ts`, all of `public/`.
- **Migration review:** the `astro-cloudflare-migration-review` workflow (2026-06-29) — the
  per-area current-state → rebuild mapping this plan is built on.
- **Pattern reference:** the owner's zennlogic.com (Astro SSR on Cloudflare Workers + KV +
  Turnstile + streaming ⌘K). Its repo is NOT in this workspace, so internals are modeled from
  Cloudflare/Astro docs and confirmed on first deploy.

## Locked decisions

| Area | Choice |
|---|---|
| Directory | `astro/` — sibling to `ui/` and `studio/`. `studio/` stays shared/untouched. |
| Platform | **Cloudflare Workers** via `@astrojs/cloudflare` (not Pages — CF's 2026 path for full-stack Astro). |
| Versions | **Astro 7.0.3** (GA as of 2026-06-29; superseded the planned v6) + `@astrojs/cloudflare@14` + `@astrojs/react@6` + React 19 + wrangler 4. Config: modern `wrangler.jsonc`, `main: "@astrojs/cloudflare/entrypoints/server"`, env via `import { env } from 'cloudflare:workers'`. |
| Rendering | Astro `output: 'server'` + per-route `export const prerender = true`; static pages prerender, only ⌘K/contact endpoints are server. |
| UI | Plain `.astro` + `tokens.css`; **drop MUI/Emotion/react-router/Monaco**. React islands only: theme toggle, consent, contact form, ⌘K palette. |
| Forms | **Cloudflare Worker `/api/contact` + Turnstile** (server-verify, then forward to email/Resend or Formspree). Drops hCaptcha. Supersedes the old "keep Formspree + hCaptcha" decision now that we're on Cloudflare. |
| Captcha | **Cloudflare Turnstile** — shared by contact + ⌘K. |
| Blog/content | Sanity fetched at **build time** (`getStaticPaths`); reuse GROQ verbatim; render Portable Text with `astro-portabletext`. `studio/` schema unchanged. |
| IA / routes | Home / Work / Writing / About / Contact (+ Privacy, 404). **Drop Playground + the old Experience page.** |
| URLs | `/`, `/work`, `/work/[slug]`, `/writing`, `/writing/[slug]`, `/about`, `/contact`, `/privacy`. Redirects: `/blog`→`/writing`, `/blog/post/[slug]`→`/writing/[slug]`, `/experience`→`/work`, `/career`→`/about`, `/playground`→`/`. |
| Domain | **benhickman.dev standalone**; zennlogic.com / zengineer.cloud redirect to it. Static per-page SEO — drop the SPA's runtime `updateMetaTags` DOM-patching. |
| ⌘K scope | **v1 projects-led** (local search over content/Sanity, no LLM) with an optional live agent layered on top. Implemented: a streaming Worker endpoint (KV quota + Turnstile) — built against **NVIDIA NIM** (Nemotron) instead of the originally-planned OpenRouter, swapped during the pre-deploy pass; falls back to the local stub when no LLM key is set. |
| Theme | Inline pre-paint FOUC script verbatim + a tiny toggle island; same localStorage keys (`zennlogic-theme-source` / `-mode`). |
| Cutover | Build `astro/` to parity, THEN flip deploy/DNS. `ui/` stays live until then — do NOT touch `ui/`. |

## Reuse vs rewrite vs drop

- **Reuse verbatim:** `tokens.css`, `homeContent.ts` + `navLinks.ts` + `socialLinks.ts`, GROQ
  (`POSTS_QUERY` / `getPostBySlug` / `getAllPostSlugs`), `@sanity/client` + `@sanity/image-url`,
  consent storage + Consent-Mode-v2 gtag logic, pre-paint theme script, JSON-LD/meta content,
  `public/` (favicons, manifest, monogram), all verified copy.
- **Rewrite (mechanical, voluminous):** every MUI `sx`/Box component → `.astro` + CSS classes
  (`.card`/`.eyebrow`/`.button-*` already exist in tokens.css); the bento/trace/blink are pure
  CSS already; consent banner/modal + theme toggle + contact form → islands; analytics →
  per-page gtag (drop the SPA route-listener).
- **Drop:** MUI/Emotion, react-router, `@monaco-editor/react` + Playground, hCaptcha,
  client-side Sanity `useEffect` fetch, `updateMetaTags` runtime meta-patching, the SPA fallback rewrite.

## Phases (each is an open intent)

1. **Scaffold** (`astro-p1-scaffold`) — create `astro/`, Astro 6 + `@astrojs/cloudflare` + `@astrojs/react`, `wrangler.toml`, hello-world deploy to Workers to prove the pipeline + the prerender/SSR split.
2. **Tokens + shell** (`astro-p2-tokens-shell`) — `global.css` from tokens.css, `BaseLayout.astro`, the nav pill + mobile bottom bar + footer, theme-toggle island, view transitions, fonts/FOUC script.
3. **Static pages** (`astro-p3-static-pages`) — home (6 sections), about, work (index + detail), writing (index + detail), privacy, 404; Sanity at build time; port copy; per-page SEO/JSON-LD + generated sitemap/robots.
4. **Integrations** (`astro-p4-integrations`) — consent + analytics islands, the contact form island + `/api/contact` Worker endpoint with Turnstile.
5. **⌘K command bar** (`astro-p5-cmdk`) — the CommandPalette island; v1 projects-led search; the `/api/cmdk` streaming Worker (KV + Turnstile + OpenRouter) scaffolded for the later live agent.
6. **Deploy + CI** (`astro-p6-deploy-ci`) — Cloudflare prod deploy, custom domains + redirects, `astro/`-scoped CI gate (typecheck/lint/test), then retire `ui/` + Vercel.

## Success criteria

- [ ] `astro/` builds + deploys to a Cloudflare Worker; static pages prerender, `/api/*` run server-side.
- [ ] Home + shell match the Obsidian Foundry design at parity with the `ui/` version (desktop pill + mobile bottom bar), verified-project bento only.
- [ ] Work / About / Writing / Contact / Privacy exist with verified, IP-safe content; old Experience + Playground gone.
- [ ] Blog renders from Sanity at build time (zero client fetch); legacy `/blog/*` redirects resolve.
- [ ] Contact posts through the Turnstile-gated Worker endpoint; consent-gated analytics works as an MPA.
- [ ] ⌘K v1 (projects-led) works; the streaming-agent Worker boundary is designed in.
- [ ] Per-page SEO/JSON-LD render server-side; sitemap/robots regenerated for the new IA.
- [ ] No MUI/react-router/Monaco/Formspree-direct/hCaptcha in the tree.

## Out of scope (for now)

- Scaling the live ⌘K agent beyond the current per-IP/global daily KV quotas — fine for a personal
  portfolio's traffic; revisit if usage grows.
- Sanity Presentation/visual-editing (stega preview) — reassessed; deferred, not built.
- Migrating `ui/` content into Sanity beyond what the Work/About pages need (Work/About are
  currently sourced inline from the content-plan packet, not Sanity `project` docs).

## Risks / open questions

- **zennlogic.com internals not local:** the ⌘K/wrangler specifics were modeled from docs, then
  confirmed working against the real `workerd` dev runtime (live NVIDIA NIM streaming, KV session
  history, Turnstile accept/reject) — not yet confirmed against an actual production deploy.
- **Secrets are a CLI step:** repo guard hooks block edits to secret/policy files (and reading
  them) by design — every remaining Turnstile/LLM/delivery secret is a `wrangler secret put` the
  owner runs; see the Phase 6 intent for the exact list.
- **`CMDK_KV` has no production namespace id yet** — `wrangler.jsonc` declares the binding without
  an `id`; this is the first thing Phase 6 provisions, since `wrangler deploy` needs it.
- **Supersedes** the in-place MUI-reskin open intents (`home/blog/experience/contact/playground/privacy/site-shell-and-seo-modernization`) — those targeted `ui/`; they're now historical. Close or leave as record (owner's call); do not execute them against the Astro target.

## Linked

- Review: `astro-cloudflare-migration-review` workflow.
- Phase intents: P1–P5 **done** (`.agents/intents/done/`), P6 (deploy) **open** — see that file for
  the full, ordered Cloudflare deployment checklist.
- Progress: P1–P5 built + verified, committed in `f9ab10f` (rebuild) and `54b7f7f` (pre-deploy
  security/correctness pass + NVIDIA NIM ⌘K swap) on `feat/obsidian-foundry-redesign`. 2026-06-30:
  closed out remaining gaps before Phase 6 — fixed all Biome lint findings (a systemic `.astro`
  frontmatter/template false-positive class scoped out via override, plus real a11y/exhaustive-deps/
  style fixes), added a `@/*` alias to `vitest.config.ts` (was unset, so no test could import
  aliased modules), and wrote the first unit tests for the repo (31 tests: nav active-state,
  ⌘K chat-history pairing/quota-adjacent helpers, project-matching, contact validation — all
  previously uncovered security/correctness logic). `npm run verify` (lint + typecheck + test +
  build) is green. Manually verified the full live stack against the real dev `workerd` runtime:
  static prerender + redirect routes in the build output, KV-backed session continuity, Turnstile
  accept/reject, live NVIDIA NIM streaming (correctly grounded, no hallucinated claims), and the
  contact pipeline's fail-closed states. Nothing left for an agent to do — Phase 6 is entirely
  owner-side Cloudflare account/secret/DNS actions.
- PRs:
