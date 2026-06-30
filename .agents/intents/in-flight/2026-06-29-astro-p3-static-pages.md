---
id: 2026-06-29-astro-p3-static-pages
owner: Zenn
created: 2026-06-29
phase: 3
parent: 2026-06-29-astro-cloudflare-rebuild
---

# Phase 3 — Static pages (Home, Work, Writing, About, Contact shell, Privacy)

## Goal
Build every content page as prerendered Astro, recreating the Obsidian Foundry design with the
verified content. Sanity is fetched at build time. Per-page SEO is static.

## Scope
- `astro/src/pages/{index,about,privacy,404}.astro`, `pages/work/{index,[slug]}.astro`,
  `pages/writing/{index,[slug]}.astro`, `pages/contact.astro` (form island lands in Phase 4),
  `src/components/home/*.astro`, `src/components/SEO.astro`, `src/data/homeContent.ts`,
  `src/lib/sanity.ts`, `astro.config.mjs` redirects, `public/` assets + `sitemap`/`robots`.

## Tasks
- [x] Ported `homeContent.ts` → `src/data/homeContent.ts` verbatim (verified-only; WORK_HREF/WRITING_HREF re-pointed to /work,/writing).
- [x] `index.astro` composes the 6 section components (`Hero`/`ProofStrip`/`FeaturedWork`/`StackBand`/`WritingTeasers`/`ContactCta`) in `src/components/home/`, driven by the data module. Bento grid + `traceln` trace animation + `blink` cursor ported 1:1 from the SPA CSS values; ⌘K is a static `[data-cmdk-trigger]` (palette in P5). Verified in-browser.
- [x] `about.astro` — technical bio + enterprise↔personal framing + Build/Optimize/Ship pillars (content-plan 01).
- [x] `work/index.astro` — grouped grid (Agents · RAG/Retrieval · Model Development · Web) over verified `src/data/projects.ts` (sourced inline from content-plan 02/06 with corrections applied); `work/[slug].astro` via `getStaticPaths` for the 5 hero/featured projects. Sanity `project` docs not yet populated — inline for now.
- [x] `writing/index.astro` + `writing/[slug].astro` — `src/lib/sanity.ts` reuses `@sanity/client` + GROQ (filtered to `defined(publishedAt)` to drop Studio test docs) + `@sanity/image-url`; `getStaticPaths` over slugs; `astro-portabletext` bodies with custom serializers (SanityImage/CodeBlock/Link). **8 posts prerendered at build time; zero client fetch.** Verified body + cover render.
- [x] `privacy.astro` — ported the legal copy, restyled; updated hCaptcha→Cloudflare Turnstile + Worker contact endpoint for the rebuild; `noindex`.
- [x] `404.astro`.
- [x] Redirects in `astro.config.mjs`: `/blog`→`/writing`, `/blog/post/[slug]`→`/writing/[slug]` (slug carried), `/experience`→`/work`, `/career`→`/about`, `/playground`→`/`. **All 5 verified resolving (200 at destination).**
- [x] `SEO.astro` shared component (wired into BaseLayout) — per-page title/description/canonical/OG/Twitter + `Person`+`WebSite` JSON-LD always, `Article` on posts. Replaces the SPA's runtime `updateMetaTags`. `@astrojs/sitemap` generates `sitemap-index.xml` (privacy/404 filtered out); `robots.txt` added for the new IA.
- [x] Copied `public/images` (favicons, manifest, monogram) into `astro/public/`.
- [x] Contact page shell (`contact.astro`) with a `[data-contact-form-mount]` slot — the Turnstile form island lands in P4.

## Acceptance criteria
- [x] Every route prerenders to static HTML with correct per-page `<head>` (verified server-side on a post: title, canonical, og:type=article, Sanity OG image, `Person`+`WebSite`+`Article` JSON-LD, article:published_time).
- [x] Verified-project guard holds; no forbidden repos (llmfit/agent-spec-lab/zennlogic_ai/etc.) anywhere; java-spring-ai shown as downgraded prototype.
- [x] Blog renders entirely at build time — **zero client Sanity fetch** (8 posts prerendered, no spinner).
- [x] Legacy redirects resolve; sitemap/robots reflect the new IA (verified).
- [x] Visual parity verified in-browser (home 6 sections, work grouped grid, writing post + Portable Text); `astro check` clean, `astro build` green.

## Depends on
- Phase 2 (shell + tokens).

## Risks / notes
- Work/About content may need Sanity population (`project`/`timelineItem` docs) — a content-entry sub-task; until then source inline from content-plan 02/06. Verify every claim against content-plan 06.
- `@sanity/visual-editing` (stega preview) is out of scope unless explicitly wanted.
