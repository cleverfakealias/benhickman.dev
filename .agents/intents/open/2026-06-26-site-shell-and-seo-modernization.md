---
id: 2026-06-26-site-shell-and-seo-modernization
owner: Zenn
created: 2026-06-26
---

# Modernize the global site shell, IA, and SEO/meta architecture for an agentic-engineering brand

## Goal

Bring the cross-cutting shell (nav/IA, branding, design system, motion, a11y, SEO/meta, performance) up to 2026 standard and re-point the positioning from "Cloud Architecture and Engineering" to **enterprise-grade agentic engineering** — without touching per-page content (that lives in separate intents).

## Current state

Vite SPA (`ui/`), React 19 + MUI v6 + react-router v6, fully client-rendered. No SSR/SSG/prerender; `index.html` ships an empty `<div id="root">`.

- **Branding/positioning (`ui/src/config/domainConfig.ts`)**: every domain's `subtitle`/`title`/`description` is hardcoded to "Cloud Architecture and Engineering" / "tailored solutions for modern businesses." Three domains in `domainConfigs` (`benhickman.dev`, `zennlogic.com`, `localhost`) — but AGENTS.md names `zengineer.cloud` as a domain and it is **absent** from the map (falls back to benhickman.dev branding). All three share the same `subtitle`, so the multi-domain layer carries almost no real differentiation.
- **Nav/IA**: Header `navLinks` = Home, Experience, Contact, Blog, Playground (`Header.tsx:21`). Footer `navLinks` = Home, Experience, **Career**, Contact, Blog (`Footer.tsx:11`) — **diverges** from the header (adds "Career", drops "Playground"). Footer Quick Links menu renders nav items as raw `<a href>` (`Footer.tsx:81`), causing full-page reloads instead of client routing. Routes expose both `/experience` and `/career` pointing at the same `DevelopmentExperience` page (`App.tsx:64-65`). A dead, unused `NavigationDrawer.tsx` (`features/`) still ships hardcoded Home/Contact list items with `role="presentation"` swallowing keyboard events.
- **Design system**: tokens in `ui/src/theme/tokens.css` ("Northwoods Modern" — evergreen + copper) feed `buildTheme` (`theme.ts`) via `getComputedStyle` `readVar()`. `shape.borderRadius` is set to the **string** `'var(--radius-md)'` cast `as unknown as number` — fragile. Light/dark handled by `html[data-theme]` + a duplicated init script (inline in `index.html` and again in `useTheme.ts`, which also writes `data-theme` during render, a side-effect in the render body).
- **Motion**: route transition `AnimatedPageContainer` (`App.tsx:25-73`) uses a hardcoded inline `transition: opacity/transform 400ms` that does **not** reference the `--motion-*` tokens and is **not** gated on `prefers-reduced-motion` — so reduced-motion users still get the 24px slide/fade. Token-level reduced-motion zeroing in `tokens.css:195` does not reach this inline style.
- **Accessibility**: skip-link exists in `index.html` (`#main-content`), `<main id="main-content">` present, header/footer have landmarks/roles. But **no focus management on route change** (focus is not moved to `#main-content` / `<h1>` after navigation), and the animated container toggles `opacity:0`/`translateY` on every route change. Mobile drawer is solid (focus-trap, Escape, body-scroll lock, 44px targets).
- **SEO/meta**: `index.html` has static OG/Twitter/canonical/JSON-LD (Organization + WebSite) — but **per-route meta does not exist**. `App.tsx:82` only sets `document.title` + `meta[description]` to the home brand on every route. `domainConfig.updateMetaTags()` exists but is never called from `App.tsx`. Crawlers that don't execute JS see only the home `index.html` for every URL. Static `sitemap.xml` is **stale**: lists `/about` (no such route) and omits `/playground` real content + all blog post URLs; `lastmod` frozen at 2025-10-06. `robots.txt` is fine.
- **Performance**: `manualChunks` splits react/mui/sanity (`vite.config.ts:56`). `@monaco-editor/react` + `monaco-editor` are deps (heavy, ~megabytes) used by Playground; Playground is lazy-loaded so Monaco is off the critical path, but it is **not** in its own named manual chunk. Fonts: 4 separate Google/Fontshare `<link rel=stylesheet>` (Orbitron, Pacifico, Geist, Clash Display, JetBrains Mono) — render-blocking, no `font-display` consistency guarantee, and Orbitron/Pacifico are only used by legacy `.fancy-title`/`.subtitle` inline styles that may be dead.

## Success criteria

- [ ] Header and footer share a single source-of-truth `navLinks` array (no divergence); footer Quick Links use react-router `<Link>` (no full reloads).
- [ ] Positioning copy (subtitle/title/description across `domainConfig` + `index.html` defaults + JSON-LD) reflects **enterprise-grade agentic engineering**, not "cloud architecture."
- [ ] `domainConfig` either includes `zengineer.cloud` or the multi-domain layer is documented/justified as intentional; each configured domain has distinct, correct branding.
- [ ] Per-route `<title>`, `meta[description]`, canonical, OG/Twitter tags update on navigation (via `react-helmet-async` or equivalent) — verified by inspecting `document.head` after client-side route change.
- [ ] A `Person` (and per-post `BlogPosting`/`BreadcrumbList`) JSON-LD strategy is defined; existing Organization/WebSite JSON-LD reviewed for accuracy.
- [ ] A decision is recorded on crawlability: either adopt prerendering/SSG (e.g. `vite-plugin-ssr`/`vite-react-ssg`/`@prerenderer`, or migrate routes to a meta-framework) **or** explicitly accept client-only SEO with documented rationale.
- [ ] `sitemap.xml` is regenerated from real routes + Sanity blog slugs (build-time generation preferred), `/about` removed, `lastmod` accurate.
- [ ] Route transition respects `prefers-reduced-motion` (no transform/opacity animation when reduced) and uses `--motion-*` tokens or `useMediaQuery`.
- [ ] Focus moves to a stable target (`#main-content` or page `<h1>`) on each route change; verified with keyboard-only nav.
- [ ] Dead `NavigationDrawer.tsx` removed (or wired in deliberately).
- [ ] `shape.borderRadius` no longer relies on a `string as unknown as number` cast; theme builds without that hack.
- [ ] Font loading audited: unused fonts (Orbitron/Pacifico if dead) removed; remaining fonts use `preconnect` + `display=swap` + (optionally) `preload` for the primary family; render-blocking reduced.
- [ ] Monaco isolated into its own lazy chunk so it never appears in the main/initial bundle (verified via `npm run analyze`).
- [ ] Color-contrast spot-check of secondary/muted text tokens against backgrounds meets WCAG 2.1 AA (4.5:1 body, 3:1 large).

## Scope

- `ui/src/App.tsx` (routing, AnimatedPageContainer, imperative meta), `ui/index.html` (static meta/JSON-LD/fonts/skip-link/theme-init).
- `ui/src/components/layout/{Header,Footer,MobileDrawer,Socials}.tsx`, `ui/src/components/features/NavigationDrawer.tsx` (likely deletion).
- `ui/src/theme/{theme.ts,tokens.css}`, `ui/src/hooks/useTheme.ts`.
- `ui/src/config/domainConfig.ts`.
- `ui/public/{sitemap.xml,robots.txt}`, `ui/vite.config.ts` (chunks/prerender), `ui/package.json` (helmet/prerender deps).

## Out of scope

- Per-page content and layout of Home, Blog, BlogPostDetail, Contact, Playground, DevelopmentExperience, PrivacyPolicy — each has (or should have) its own intent.
- Sanity schema/content modeling (covered by `2026-06-22-sanity-content-infrastructure`).
- Consent/analytics behavior beyond ensuring it cohabits with new meta/SEO wiring.

## Plan

1. **Decide rendering strategy first** (blocks SEO design): evaluate prerender-at-build (static route list + dynamic blog slugs from Sanity) vs. full SSG/meta-framework migration vs. accept-client-only. Record the call as a short ADR; everything below assumes "prerender static + known blog routes" unless overridden.
2. **Positioning pass**: rewrite subtitle/title/description in `domainConfig.ts`, the static defaults + JSON-LD in `index.html` toward agentic-engineering. Add/justify `zengineer.cloud` in the domain map.
3. **Unify nav IA**: extract one `navLinks` constant (shared module), consume in Header + Footer; convert footer Quick Links to `<Link>`; decide whether `/career` alias stays or redirects to `/experience`. Delete `NavigationDrawer.tsx` if unused.
4. **SEO/meta architecture**: add `react-helmet-async` (surface dependency for review), wrap app in `HelmetProvider`, add a `<Seo>` component consumed per route for title/description/canonical/OG/Twitter; remove the imperative `document.title` block from `App.tsx`. Add `Person` JSON-LD; plan per-post `BlogPosting` injection.
5. **Sitemap**: replace static file with a build-time generator (routes + Sanity slugs); drop `/about`; wire into `npm run build`.
6. **Motion + focus**: gate `AnimatedPageContainer` on `prefers-reduced-motion` (via `useMediaQuery('(prefers-reduced-motion: reduce)')` or the `--motion-*` tokens); add route-change focus management to `#main-content`/`<h1>`.
7. **Design-system hardening**: fix `shape.borderRadius` cast; de-duplicate the theme-init script (keep the `index.html` inline boot, make `useTheme` not re-set `data-theme` in render body); contrast-audit muted/secondary tokens.
8. **Performance**: give Monaco its own manual/lazy chunk; audit fonts (remove dead Orbitron/Pacifico + `.fancy-title`/`.subtitle` if unused), add `preload` for the primary family; re-run `npm run analyze` and record before/after initial bundle.

## Risks / open questions

- **SEO on a client-rendered SPA is the central risk.** Without prerender/SSG, Google may render JS but social/link-preview crawlers (Slack, LinkedIn, X, iMessage) generally will **not** — so per-route OG cards via helmet are invisible to them. Prerendering is the only robust fix; it adds build complexity and a Sanity fetch at build time (stale until rebuild) and needs Vercel-side config.
- Meta-framework migration (Next/Remix/TanStack Start) would solve SEO cleanly but is a large rewrite — likely out of scope for this intent; favor a lightweight prerender plugin.
- `react-helmet-async` maintenance status — confirm React 19 compatibility before adopting; alternatives: `@unhead/react`, or React 19's native `<title>`/`<meta>` hoisting (which may make helmet unnecessary).
- Removing `/career` or fonts risks breaking inbound links / page visuals — grep usages before deleting.
- `domainConfig` changes ripple into the (separate) Sanity siteSettings work — coordinate so branding isn't duplicated in two sources of truth.
- Build-time sitemap needs Sanity read access in CI/Vercel build env.

## Linked
- PRs:
