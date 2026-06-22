---
id: 2026-06-22-sanity-content-infrastructure
owner: Zenn
created: 2026-06-22
---

# Move portfolio content (projects, timeline, snippets, settings) into Sanity

## Goal

Manage portfolio content — projects, career timeline, code snippets, and global site settings — entirely from the Sanity Studio instead of hardcoded/static data, with the UI rendering it from the CMS.

## Current state

In progress on branch `fix-blog-posts`. Already landed: blog URL redirects (`/blog/:slug` → `/blog/post/:slug`) and the agents scaffold/.mjs migration. Uncommitted WIP (untracked): four new Studio schema types and a timeline migration script — not yet registered or wired to the UI.

## Success criteria

- [ ] New schema types (`project`, `timelineItem`, `snippet`, `siteSettings`) are registered in `studio/schemaTypes/index.ts` and visible in the Studio.
- [ ] The timeline migration script seeds Sanity from the existing hardcoded timeline data.
- [ ] UI fetches and renders projects, timeline, and (optionally) snippets from Sanity via GROQ queries.
- [ ] Global `siteSettings` (title, description, social links) are queried and applied in the UI shell.
- [ ] Existing blog routing/redirects keep working; no change to the `post` schema.

## Scope

- `studio/schemaTypes/{project,timelineItem,snippet,siteSettings}.ts` (WIP — commit first).
- `studio/scripts/migrateTimeline.ts` (WIP — one-time seed).
- `studio/schemaTypes/index.ts` (register new types).
- `ui/src/components/features/sanity/` — GROQ queries + types for the new content.
- UI components to render projects/timeline (replacing hardcoded `timelineData.tsx`).

## Out of scope

- `post.ts` blog schema and author/category refactoring.
- Visual redesign of portfolio/timeline (reuse existing MUI patterns).
- Deploy to Vercel — work stays on the branch until the gate is green.

## Plan

1. Commit the WIP schemas + migration script coherently (`feat(studio): add project/timeline/snippet/siteSettings schemas`).
2. Register the types in `studio/schemaTypes/index.ts`; verify they appear in the Studio.
3. Run the timeline migration to seed Sanity; confirm data round-trips.
4. Add GROQ queries + TS types; build UI components for projects + timeline (retire hardcoded data).
5. Apply `siteSettings` globally; run the ui/ + studio/ gate; open `fix-blog-posts → main` PR.

## Risks / open questions

- Migration needs a write-scoped `SANITY_API_TOKEN` (name only — set in the secret store, document in `.env.example`).
- Are `/projects` and `/snippets` routes in scope for v1, or timeline-first with those deferred?
- Migration is one-time: after first run, Studio data is authoritative — note this in the script.

## Linked

- PRs:
