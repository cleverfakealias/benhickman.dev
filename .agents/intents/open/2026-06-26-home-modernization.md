---
id: 2026-06-26-home-modernization
owner: Zenn
created: 2026-06-26
---

# Reposition the Home page around enterprise-grade agentic engineering

## Goal
Re-position the Home page from generic "cloud architecture & engineering" to a sharp,
proof-driven narrative for **enterprise-grade agentic engineering** (LLM agents, multi-agent
systems, agent SDKs, evals, agent reliability/security), and make the page drive one clear
primary conversion while meeting 2026 standards for SEO/social, accessibility, motion, and LCP.

## Current state
The Home page (`ui/src/pages/Home.tsx`) is a 3-section stack inside a single `<Container maxWidth="lg">`:
`HeroBanner` -> `HomeSummary` -> `HomeBlogCTA`. The page renders no `<h1>`-driven SEO/meta of its own;
all meta is global and static.

**Positioning is entirely cloud/infra — zero agentic/AI/LLM signal anywhere:**
- Hero `<h1>` (`HeroBanner.tsx`): *"Systems that scale. Software that lasts."*
- Hero subhead: *"Cloud architecture, platform engineering, and calm reliability."*
- Hero body: *"I help teams go from prototype to production with infrastructure that's cost-aware, resilient, and easy to evolve."*
- Hero CTAs: primary **"Let's design it"** -> `/contact`, secondary **"See experience"** -> `/experience`.
- Hero "proof chips" (`heroSkills.ts`) are 8 generic skills: *Frontend Engineering (React / TypeScript), Backend Engineering (Python / Java / Node), Cloud Architecture, Event-driven systems, Microservices, Kubernetes, CI/CD Pipelines, Observability* — no agents/LLM/evals.
- `HomeSummary.tsx` (heading **"About my work"**) is a 3-paragraph autobiography ("Technology has been the through-line of my life…", "early dot-com operations… SaaS space…", "TypeScript, Python and Java…"). No metrics, no agentic work.
- `HomeBlogCTA.tsx` (**"Latest from the blog"**) shows one featured post (`posts[0]`, not curated/flagged) + a "Read all posts" button.

**Meta / SEO / social** (`index.html` + `domainConfig.ts`):
- Title/description for every domain is *"… | Cloud Architecture and Engineering"* / *"…specializes in cloud architecture and engineering, offering tailored solutions for modern businesses."* — off-target and identical across `benhickman.dev` / `zennlogic.com`.
- OG/Twitter image points at the **monogram logo** (`/images/BH monogram.png`, note the space in the path), not a real social card; `index.html` references `BH monogram.png` while `domainConfig.ts` references `/images/monogram.png` — inconsistent.
- JSON-LD models an **Organization + WebSite** only; no `Person` / `ProfilePage` entity for Ben.
- `<meta name="keywords">` is legacy cloud terms (ignored by search; not agentic).
- Meta is set imperatively via DOM queries in `App.tsx` + `updateMetaTags()`; SPA has no per-route meta and no SSR/prerender, so crawlers/social unfurlers may see only the static `index.html`.

**Design / UX / a11y / perf:**
- Heading order is OK (`h1` in hero, `h2` via `component="h2"` in the two cards) but section headings are rendered as styled `Typography` rather than semantic landmarks with labels.
- Hero image `/images/working.jpg` is `loading="eager" fetchPriority="high"` (good for LCP) but has **no width/height/aspect-ratio** -> CLS risk; alt text *"Architect. Build. Elevate."* is decorative/marketing copy, not descriptive.
- `HomeSummary` hero-adjacent image is a **6000x3376 Sanity CDN JPG with no width param / no `srcset`** ("autumn country road") — large unoptimized download, and the image is decorative/off-theme.
- Page transition in `App.tsx` (`AnimatedPageContainer`) animates opacity+translateY on every route with **no `prefers-reduced-motion` guard**.
- Proof chips are an unlabeled `<ul>`; CTAs use smart quotes ("Let's", "design it") — fine, but copy is vague.
- The whole page funnels two competing CTAs (contact vs experience) with no single dominant action.

## Success criteria
- [ ] Hero `<h1>` names the niche in plain words (contains "agent"/"agentic" + "enterprise"/"production"/"reliability"); subhead states who it's for and the outcome.
- [ ] Hero `heroSkills` chips replaced with agentic-relevant proof terms (e.g. LLM agents, multi-agent orchestration, agent SDKs, evals/observability, agent reliability & security, RAG, tool-use) — sourced from a typed config, still rendered as a labeled list (`aria-label`).
- [ ] Exactly **one** primary CTA above the fold (single dominant action, e.g. "Book a call" / "Start a project" -> `/contact`); any secondary action is visually subordinate (text/outlined, not equal weight).
- [ ] `HomeSummary` rewritten from autobiography to a **value + proof** block: a short positioning paragraph plus 3-4 quantified outcome/credibility points (metrics, scale, or named capabilities), not life story.
- [ ] A "what I do" / capabilities band exists (3 cards or list) covering agent build, eval/reliability, and platform/infra — so the niche is legible without reading prose.
- [ ] Featured blog post is **explicitly curated** (a `featured` flag or `order`), not just `posts[0]`; empty state still handled.
- [ ] All Home images have intrinsic `width`/`height` or `aspectRatio` set to prevent CLS; the LCP image stays `fetchPriority="high"`; the Sanity image uses width/`srcset`/`?w=` params (or is removed if purely decorative).
- [ ] Hero image `alt` is descriptive or the image is marked decorative (`alt=""`) if it carries no information.
- [ ] Route/page transition respects `prefers-reduced-motion` (no transform/opacity animation when reduced motion is requested).
- [ ] Title + meta description for `benhickman.dev` updated to agentic positioning and **distinct per domain**; OG/Twitter image points to a real 1200x630 social card (consistent path, no space-in-filename mismatch).
- [ ] JSON-LD adds a `Person` (and ideally `ProfilePage`) entity for Ben with `jobTitle`, `knowsAbout` (agentic/LLM terms) and `sameAs` (GitHub/LinkedIn) populated.
- [ ] Color contrast for muted/secondary text on surfaces verified >= 4.5:1 (WCAG 2.1 AA); keyboard focus visible on all CTAs.

## Scope
- `ui/src/pages/Home.tsx`
- `ui/src/components/common/HeroBanner.tsx`, `ui/src/components/common/heroSkills.ts`
- `ui/src/components/features/HomeSummary.tsx`, `ui/src/components/features/HomeBlogCTA.tsx`
- `ui/src/config/domainConfig.ts` (branding title/description/subtitle per domain)
- `ui/index.html` (static meta, OG/Twitter image, JSON-LD Person)
- `ui/src/App.tsx` (`AnimatedPageContainer` motion guard; meta wiring)
- New: a typed capabilities config + a Home capabilities component; a real OG social card asset.
- Blog query/schema touchpoint only insofar as needed to surface a curated featured post.

## Out of scope
- Other pages (`/experience`, `/contact`, `/blog`, `/playground`) beyond the links Home points to.
- Full SSR/prerender migration (note it as a follow-up if social unfurling proves inadequate).
- Theme token / color-system overhaul, fonts, and global header/footer.
- Sanity Studio schema changes beyond an optional `featured`/`order` field for blog posts.
- Net-new blog content.

## Plan
1. Lock the positioning: write the new `<h1>`, subhead, and one-line value prop around enterprise-grade agentic engineering (who it's for + outcome). Decide the single primary CTA and its destination.
2. Replace `heroSkills.ts` contents with agentic proof terms; keep it a typed array; render the chip list with an `aria-label`.
3. Restructure Home IA: Hero -> **Capabilities band** (new) -> **Value/proof** (rewritten `HomeSummary`) -> Blog CTA. Add the capabilities component backed by a typed config (3 cards: agent build / eval-reliability / platform-infra).
4. Rewrite `HomeSummary` copy to value + 3-4 quantified proof points; replace or optimize the 6000px Sanity image (add `?w=` + `srcset`, or drop it).
5. Make the featured blog post curated: add a `featured`/`order` field (or query `order(featured desc, publishedAt desc)`) and pass that into `HomeBlogCTA`; keep the empty state.
6. Performance/CLS: set width/height or `aspectRatio` on all Home images; keep hero LCP image eager + high priority; verify nothing above the fold lazy-loads.
7. Motion: gate the `AnimatedPageContainer` transition behind `prefers-reduced-motion` (CSS media query or a `useMediaQuery` guard).
8. SEO/social: update `domainConfig.ts` titles/descriptions to agentic, distinct per domain; fix the OG/Twitter image path (single canonical 1200x630 card, no filename space); add a `Person`/`ProfilePage` JSON-LD block with `knowsAbout` + `sameAs`.
9. A11y pass: contrast check muted/secondary text, visible focus rings on CTAs, semantic section labels; run lint/typecheck/Jest.
10. Verify: build, Lighthouse (LCP/CLS), and social-card preview (or note the SSR follow-up if the SPA can't be unfurled).

## Risks / open questions
- **Real proof needed:** quantified metrics and named agentic projects must come from Ben — without them the rewrite risks vague claims. Decision: what numbers/credentials can we use?
- **Multi-domain divergence:** `zennlogic.com` shares this code; decide whether agentic positioning applies to all domains or only `benhickman.dev`.
- **SPA meta vs crawlers:** imperative DOM meta + no SSR may not be picked up by social unfurlers; a prerender/SSR step may be required to fully satisfy the social-card criterion.
- **Sanity schema change** for `featured`/`order` requires a Studio deploy + content edit; confirm acceptable.
- **CTA destination:** is `/contact` (Formspree + hCaptcha) the intended conversion, or should the primary action be a scheduling link?
- Assets: a designed 1200x630 OG card and an on-theme hero image don't exist yet — who produces them?

## Linked
- PRs:
