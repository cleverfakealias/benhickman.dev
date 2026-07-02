---
id: 2026-06-26-experience-modernization
owner: Zenn
created: 2026-06-26
---

# Reframe the Experience/Career page around agentic-engineering impact

## Goal

Turn the `/experience` (and `/career`) page from a generic, tab-buried "skills
catalog + dateline" into an outcome-led narrative that proves enterprise-grade
agentic-engineering depth — quantified impact, real agent/LLM systems, and a
mobile- and SEO-correct timeline. Content/UX/SEO/a11y only; data-source changes
defer to the in-flight Sanity intent.

## Current state

Route: `App.tsx` lines 64-65 map **both** `experience` and `career` to the same
`DevelopmentExperience` component — two indexable URLs, identical content (no
canonical, see SEO below).

`ui/src/pages/DevelopmentExperience.tsx` renders three stacked blocks:

1. `SectionHeader` — `<h1>Development Experience</h1>`, subtitle "Modern
   engineering across the stack, focused on reliability, speed, and measurable
   outcomes." (no measurable outcomes actually appear on the page).
2. A 7-tab skills `catalog` (`Frontend | Backend | Platform | AI | Data |
   Practices | Security`) of `CardItem`s — each card is a title, 2-3 generic
   bullets, tag chips, and a collapsed `long` paragraph. The copy is aspirational
   and undated ("Architect modular front-end systems…", "Engineer AI-driven
   architectures…") with **no project, employer, metric, or date** attached. AI
   is one tab of seven and defaults closed — `useState('Frontend')` — so the
   agentic positioning is hidden behind a click.
3. `CareerTimeline` (`ui/src/components/features/CareerTimeline.tsx`) fed by
   hardcoded `timelineData.tsx`.

Timeline specifics worth fixing now (content/UX, not the data-move):

- Sort/group key is `startDate` parsed with `parseInt` and sliced to 4 chars.
  Mixed grain ("2024" vs the prose timestamps) and a real **data bug**: the
  Chisago Lakes project has `timestamp: '2025'` but `startDate: '2024'`, so it
  files under the wrong year. SPS roles are split into four separate cards
  (Engineer / ASE II / ASE I) with two showing `'Present'`/overlapping ranges.
- Only the most senior bullet carries metrics ("error rates ~40%", "QoS routing
  with Valkey"); the agentic/AI work (LangChain/LangGraph/RAG in the AI tab) is
  **not represented in the career timeline at all** — there is no agent project
  with an outcome anywhere on the page.
- Semantics: `<h1>` (page) → timeline `<h2>` → year `<h3>` → card title `<h4>`
  is a sane outline, but each `TimelineCard` is a `Card`/`Chip` cluster with no
  `<article>`/list semantics; the year list is visual divs, not an ordered list.
- `recentYearsToShow = 3` collapses everything older behind "Older entries".

No per-route SEO anywhere in the SPA: no `react-helmet`/head manager, no
`document.title` effect, no JSON-LD. `index.html` ships one static title for all
routes (confirmed: no `<title>`/`Helmet`/`document.title` mechanism in `ui/src`).

## Success criteria

- [ ] `/experience` and `/career` no longer present as duplicate indexable
      content: one canonical URL is chosen and the other 301/canonical-links to
      it (or a `<link rel="canonical">` is emitted), verified in built HTML.
- [ ] The page leads with agentic-engineering positioning above the fold: the
      AI/agents content is visible without a tab click (e.g. AI is the default
      tab, or a top "Agentic systems" highlight strip precedes the tabs).
- [ ] At least 3 case-study-style entries exist that each pair a concrete
      agent/LLM system with a quantified outcome (e.g. "multi-agent ingestion
      eval harness → cut manual review X%", latency/cost/reliability numbers),
      not generic capability prose.
- [ ] Every skills card that claims a capability links to or references a
      concrete artifact (project, role, repo, or blog post) — no orphan
      capability claims.
- [ ] Timeline date bug fixed: Chisago Lakes (and any other entry where
      `timestamp` year ≠ `startDate`) groups under the correct year; SPS roles
      are consolidated or clearly ordered with non-overlapping displayed ranges.
- [ ] Timeline uses list semantics: years as an ordered list, each entry an
      `<article>`/`<li>` with an accessible name; keyboard tab order follows
      visual order; "Older entries" toggle keeps `aria-expanded` (already
      present) and focus stays managed.
- [ ] Mobile (≤480px): tabs scroll without clipping, cards are single-column
      (already `1fr`), the timeline left-rail + dots don't overlap text, and tap
      targets ≥44px. Verified at 360px and 768px.
- [ ] Reduced-motion: hover `translateY` transforms and the page-enter
      transition respect `prefers-reduced-motion` (currently unconditional).
- [ ] Per-route `<title>` + meta description set for the experience page
      (mechanism reusable by other routes), and a `Person`/`ProfilePage` +
      experience JSON-LD block validates.
- [ ] WCAG 2.1 AA: tag-chip text and `--color-text-muted-hex` body copy meet
      4.5:1 against `--color-surface`; tabs expose `aria-selected`/`role`
      correctly (MUI default) and have visible focus.

## Scope

- `ui/src/pages/DevelopmentExperience.tsx` — content reframe (case studies +
  metrics), AI-first ordering, reduced-motion, per-route head/meta + JSON-LD.
- `ui/src/components/features/CareerTimeline.tsx` — list semantics, date-grouping
  fix, role consolidation, reduced-motion on hover.
- `ui/src/components/features/timelineData.tsx` — correct the date bug and add
  the agentic case-study entries (interim, until the Sanity move).
- `ui/src/App.tsx` — resolve the `/experience` vs `/career` duplicate-route SEO.
- A small reusable per-route head mechanism (e.g. a `useDocumentMeta` hook or
  `react-helmet-async`) — surface the dependency choice for review.

## Out of scope

- Moving timeline/projects/snippets/settings into Sanity — owned by
  `2026-06-22-sanity-content-infrastructure` (in-flight). This intent edits the
  hardcoded `timelineData.tsx` only as an **interim** content fix; align the new
  case-study fields (metrics, links, stack) with the planned `timelineItem`/
  `project` schemas so the later migration is a lift-and-shift, not a re-model.
- Blog routing/redirects and the `post` schema.
- Full visual redesign / new design system — reuse existing MUI tokens.
- `/projects` and `/snippets` routes (deferred with the Sanity intent).

## Plan

1. **SEO routing:** pick `/experience` as canonical; make `/career` redirect or
   emit `<link rel="canonical">`. Add the reusable per-route head hook and set
   title/description for this page.
2. **Content reframe:** rewrite the skills tabs from capability prose into
   evidence — each card cites a role/project/metric; promote AI/agents to the
   default tab or a pre-tabs highlight strip. Draft 3+ agentic case studies
   (problem → agent system → measured outcome) with stack + numbers.
3. **Timeline data + semantics:** fix the `startDate`/`timestamp` mismatch,
   consolidate SPS roles, add the agentic entries; convert year/entry markup to
   ordered-list/`<article>` semantics with accessible names.
4. **A11y + responsive + motion:** verify contrast on chips/muted text, gate
   hover and page-enter transforms behind `prefers-reduced-motion`, test 360/768.
5. **Structured data:** add `ProfilePage`/`Person` + experience JSON-LD;
   validate. Run the `ui/` gate (typecheck, lint, Jest) before PR.

## Risks / open questions

- Canonicalizing `/career` may break existing links (Header/Footer both link it).
  Decide redirect vs canonical-only; if redirect, update nav to the canonical URL.
- Per-route meta in a client SPA isn't crawler-ideal (no SSR/prerender). Is a
  helmet-style runtime title acceptable for v1, or should prerendering be a
  follow-up intent? Surfaces a possible new dependency (`react-helmet-async`).
- Real metrics for the agentic case studies need Ben's input — placeholders must
  be flagged, not shipped as fact.
- Keep new `timelineData` fields shaped like the planned Sanity `timelineItem`/
  `project` schemas to avoid a second remodel during migration.

## Linked

- PRs:
