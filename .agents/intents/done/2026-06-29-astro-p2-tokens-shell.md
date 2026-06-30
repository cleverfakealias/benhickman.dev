---
id: 2026-06-29-astro-p2-tokens-shell
owner: Zenn
created: 2026-06-29
phase: 2
parent: 2026-06-29-astro-cloudflare-rebuild
---

# Phase 2 — Design tokens + global shell

## Goal
Port the Obsidian Foundry token layer and rebuild the global chrome (base layout, floating nav
pill, mobile bottom tab bar, footer, theme toggle) as Astro components + CSS — the frame every
page renders inside. No MUI.

## Scope
- `astro/src/styles/global.css`, `astro/src/layouts/BaseLayout.astro`,
  `astro/src/components/{Header,Footer,BottomNav}.astro`,
  `astro/src/components/islands/ThemeToggle.tsx`, `astro/src/config/{navLinks,socialLinks}.ts`.

## Tasks
- [x] Copied `tokens.css` → `src/styles/global.css` verbatim; appended a base reset (box-sizing/margin/body/skip-link/container) to replace the dropped MUI CssBaseline. Imported once in BaseLayout.
- [x] `BaseLayout.astro`: `<html data-theme>`, `<head>` with per-page `<slot name="head">`, Google Fonts preconnect + Geist + JetBrains Mono, the **inline pre-paint theme script** (`is:inline`, same `zennlogic-theme-source`/`-mode` keys), skip-link, global.css; body = Header + main + Footer + BottomNav.
- [x] `Header.astro`: floating pill (◉ brand, mono nav from `navLinks`, ⌘K "ask my work" trigger, ThemeToggle). Active link via `Astro.url.pathname` + `isActive()` (prefix-match; no matchPath).
- [x] `BottomNav.astro`: fixed mobile tab bar (Home · Work · ⌘ Ask · Writing · Contact), glyphs `⌂ ▤ ✎︎ ✉︎`, Persimmon active + 2px top indicator, elevated center Ask, `safe-area-inset-bottom`; footer reserves `--bottom-nav-h`. Pure CSS media-query split at 768px.
- [x] `Footer.astro`: © line + "model → agent → UI", quick-links (nav + Privacy + Cookie Preferences placeholder for P4), socials, theme toggle.
- [x] Theme = **tiny inline script** (the intent's allowed alternative, not a React island): document-level `[data-theme-toggle]` delegation (registered once, survives swaps), `matchMedia` subscribe, `astro:after-swap` re-apply. Icon state is pure CSS off `data-theme` (no JS, no flicker). Shell ships **zero React** — islands start in P4.
- [x] Wired `<ClientRouter />` view transitions (`transition:animate="fade"` on main); Astro gates animations on `prefers-reduced-motion` automatically. (Full cross-page nav testable once P3 routes exist.)
- [x] Ported `navLinks` / `bottomNavItems` / `socialLinks`; re-pointed `/experience`→`/work`, `/blog`→`/writing`; dropped Playground; added About to desktop nav (new IA).

## Acceptance criteria
- [x] Shell lives in BaseLayout → renders on every page; visual parity verified (desktop pill + mobile bottom bar) against the Obsidian Foundry design.
- [x] Theme toggle persists across reloads with **no FOUC** (verified: after reload `data-theme` set pre-paint from localStorage); tokens switch purely on `data-theme` (body bg + accent flip confirmed).
- [x] Exactly one `Primary` landmark per breakpoint (desktop: header nav, bottom nav `display:none`; mobile: bottom nav, header nav `display:none` — verified via computed styles); mobile bottom bar clears the footer (`padding-bottom: --bottom-nav-h`).
- [x] View transitions wired via ClientRouter; reduced-motion gating is Astro-default. `astro check` clean (0 errors), `astro build` green.

## Depends on
- Phase 1 (scaffold + adapter).

## Risks
- The pre-paint script must stay inline + render-blocking in `<head>` to avoid FOUC.
- Removing MUI's CssBaseline — re-verify AA contrast holds on the raw tokens.
