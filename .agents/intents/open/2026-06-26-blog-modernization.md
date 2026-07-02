---
id: 2026-06-26-blog-modernization
owner: Zenn
created: 2026-06-26
---

# Modernize the blog into an agentic-engineering authority surface

## Goal
Turn the blog list and post-detail pages into a credible, discoverable, fast
reading experience that positions Ben as an enterprise-grade agentic-engineering
authority — with real per-post SEO, taxonomy/filtering, a first-class reading
experience, and accessible, performant rendering.

## Current state
The blog is a client-only React 19 + Vite SPA with no per-route SEO and a flat
list with no taxonomy.

- **Routing** (`ui/src/App.tsx`): `/blog` → `Blog`, `/blog/post/:slug` →
  `BlogPostDetail`; legacy `/blog/:slug` redirects (note: the redirect target is
  the literal string `"/blog/post/:slug"`, so the `:slug` param is **not**
  interpolated — old links 404 to a broken path).
- **List** (`ui/src/pages/Blog.tsx` → `BlogHeader` + `BlogGrid`): `BlogGrid`
  renders a flat `Grid2` of `BlogCard`s (`size={{ xs:12, sm:6, md:4 }}`). No
  filtering, tags, search, featured post, or pagination. `BlogHeader` tagline is
  off-positioning: "software architecture, cloud technologies, and building
  scalable applications".
- **Data** (`ui/src/components/features/sanity/sanityClient.ts`): `POSTS_QUERY`
  selects title/slug/excerpt/publishedAt/mainImage/author name and computes
  `estimatedReadingTime` in GROQ. It does **not** fetch `categories` or `status`,
  even though `studio/schemaTypes/post.ts` defines both — so drafts are queried
  alongside published posts and categories are invisible to the UI.
- **Detail** (`ui/src/components/features/blog/BlogPostDetail.tsx`): fetches via
  `getPostBySlug`, renders title + meta `Chip`s (date, reading time, author name)
  + `BlogBody`. No TOC, share, related posts, author bio/avatar, reading-progress,
  or breadcrumbs. Author is fetched as a bare `name` string (`"author": author->name`).
- **Portable Text** (`ui/src/components/features/blog/BlogBody.tsx`): custom
  components for headings/lists/quote/marks/image/code. Problems: (1) leftover
  `console.log` debug statements in the image and `types.code` renderers;
  (2) code blocks are plain `<pre>` with no syntax highlighting, language label,
  or copy button; (3) headings are not slugged → no anchor links / TOC possible;
  (4) link annotations (`marks.link`) are not rendered — the schema defines a
  `link` annotation but `BlogBody` has no `marks.link` handler, so links render
  as plain text; (5) `marks.link` would also need `rel="noopener"` + external
  handling.
- **Schema mismatch** (`studio/schemaTypes/blockContent.ts`): block content only
  allows `block` + `image`. There is **no `code` type**, so the `types.code`
  branch in `BlogBody` can never fire — authors cannot insert code blocks at all,
  despite an agentic-engineering blog being code-heavy. `lists` only allows
  `bullet` (no numbered lists); no `H5/H6`.
- **Images** (`ui/src/components/features/sanity/imageUrl.ts` + usages): cards and
  hero use `buildImageUrl` with fixed width/height/quality but **no `srcSet`/
  `dpr`, no `loading="lazy"`, no width/height attributes** (CLS risk), and no
  `auto('format')` for AVIF/WebP. `BlogBody` images fall back to raw `asset.url`.
- **SEO**: `ui/src/App.tsx` sets only a global `document.title` and one meta
  description from `branding`. There is **no react-helmet**, no per-post title/
  description, no Open Graph / Twitter cards, no JSON-LD `Article` schema, no
  per-post canonical. `ui/public/sitemap.xml` is hand-written and contains **no
  post URLs** (and references a non-existent `/about`). No RSS/Atom feed. Because
  it's a pure CSR SPA with no prerender/SSG (confirmed: no react-snap / vite-react-ssg),
  crawlers and link unfurlers see an empty shell — the single biggest authority/
  reach gap.
- **A11y**: back button uses `theme.palette.text.secondary` (contrast risk);
  meta data encoded only as decorative `Chip`s (no `<time datetime>`); no
  semantic `<article>`; heading levels jump (post uses `h1` then `BlogBody` can
  emit another `h1`).

## Success criteria
- [ ] Each post route renders a unique `<title>`, meta description, canonical URL,
      Open Graph (`og:title/description/image/type=article`) and Twitter card,
      verifiable in page source (via prerender/SSG, not just runtime DOM).
- [ ] Each post emits valid JSON-LD `Article`/`BlogPosting` (author, datePublished,
      dateModified, image, headline) passing Google Rich Results test.
- [ ] The CSR-vs-crawler gap is closed: posts are prerendered/SSG'd (or moved to
      an SSR/edge function) so view-source contains the article HTML and meta.
- [ ] Legacy `/blog/:slug` redirect interpolates the real slug (301-equivalent),
      not the literal `:slug` string.
- [ ] `POSTS_QUERY` and `getPostBySlug` filter to `status == "published"` and
      fetch `categories[]->{title,slug}`; drafts no longer leak to production.
- [ ] List page supports category/tag filtering and client text search over
      title/excerpt; a featured/most-recent post gets hero treatment.
- [ ] `blockContent` schema adds a `code` object (language + filename), numbered
      lists, and `BlogBody` renders code with syntax highlighting (Shiki/Prism),
      a language label, and a copy-to-clipboard button.
- [ ] `BlogBody` renders `link` annotations as real anchors with
      `rel="noopener noreferrer"` + `target="_blank"` for external links; all
      `console.log`/`console.error` debug calls removed.
- [ ] Post detail includes: a TOC built from slugged `h2/h3` with anchor links,
      reading-progress indicator, share buttons, author bio + avatar block, and a
      related-posts strip (shared category, max 3).
- [ ] Images use responsive `srcSet`/`sizes` + `auto('format')`, `loading="lazy"`
      (hero `eager`/`fetchpriority=high`), and explicit width/height to remove CLS.
- [ ] A valid RSS/Atom feed exists and `sitemap.xml` is generated from Sanity to
      include every published post URL with `lastmod`.
- [ ] Detail page passes WCAG 2.1 AA: semantic `<article>`, single `h1`, correct
      heading order, `<time datetime>`, 4.5:1 contrast on the back button and meta,
      keyboard-reachable TOC/share, `prefers-reduced-motion` respected.
- [ ] Editorial: `BlogHeader` copy and at least an initial content plan reframe the
      blog around agentic engineering (LLM agents, multi-agent systems, agent SDKs,
      evals, reliability/security, AI infra).

## Scope
- `ui/src/pages/Blog.tsx`, `ui/src/components/features/blog/*`
  (`BlogHeader`, `BlogGrid`, `BlogCard`, `BlogBody`, `BlogPostDetail`,
  `BlogEmptyState`, `BlogSkeleton`).
- `ui/src/components/features/sanity/sanityClient.ts`, `imageUrl.ts`,
  `types/index.ts`; `ui/src/hooks/useBlogPosts.ts`.
- `ui/src/App.tsx` (routing fix + SEO head integration), Vite build config for
  prerender/SSG, RSS + sitemap generation.
- `studio/schemaTypes/post.ts`, `blockContent.ts`, and author schema (bio/avatar).

## Out of scope
- Comments, newsletter signup, full-text server search (Algolia), and per-post
  view analytics — defer to a later intent.
- Visual redesign of global theme/typography beyond what the reading experience
  needs.
- Multi-tenant blog behavior for the other domains (zengineer.cloud, zennlogic.com)
  beyond keeping `organizationId` filtering correct.

## Plan
1. Add a SEO/head solution (`react-helmet-async` or React 19 native `<title>`/
   `<meta>` hoisting) and a `<PostSeo>` component emitting title, description,
   canonical, OG/Twitter, and JSON-LD `Article`.
2. Close the crawler gap: add prerender/SSG for `/blog` and each `/blog/post/:slug`
   (e.g. vite-react-ssg or a build step that fetches slugs from Sanity), or move
   detail rendering to an SSR/edge function on Vercel.
3. Fix the legacy redirect to interpolate the real slug; add a route-level 404 for
   unknown slugs (not a silent redirect to `/`).
4. Harden queries: filter `status == "published"`, fetch `categories[]` and author
   `{name, bio, image}`; update `BlogPost`/types accordingly; replace client-side
   re-sort in `useBlogPosts` (already ordered in GROQ).
5. List IA: add category filter chips + text search + a featured hero card; keep
   the responsive grid; add empty/filtered states.
6. Schema: add a `code` object (language, filename, highlightedLines) and numbered
   lists to `blockContent`; extend the author schema with `bio` + `image`.
7. `BlogBody`: remove all debug logs; add syntax highlighting (Shiki) with language
   label + copy button; add `marks.link` (external `rel`/`target`); slug headings
   and expose ids for the TOC.
8. Detail experience: semantic `<article>`, TOC from slugged headings, reading
   progress, share buttons, author bio block, related-posts strip.
9. Images: switch `buildImageUrl`/`urlFor` to emit `srcSet` + `sizes` +
   `auto('format')`; add `loading`/`fetchpriority`/width/height across cards, hero,
   and body images.
10. Generate RSS/Atom + a Sanity-driven `sitemap.xml` at build time.
11. Editorial: rewrite `BlogHeader` copy for agentic-engineering positioning and
    draft an initial post-topic plan (evals, agent reliability, multi-agent
    orchestration, agent SDK patterns, security).
12. A11y + perf pass: contrast, heading order, `prefers-reduced-motion`, Lighthouse.

## Risks / open questions
- SSG/SSR choice is the pivotal decision: prerender at build (simplest, needs a
  rebuild per publish) vs. Vercel edge SSR (fresher, more infra). Build-time
  prerender likely fits this SPA best but couples deploys to content changes —
  consider a Sanity webhook → redeploy.
- Adding a `code` block type changes authored content shape; existing posts have
  no code blocks, so low migration risk, but confirm before deploying schema.
- Shiki adds bundle weight; prefer build-time/SSR highlighting or a lazy-loaded
  highlighter to protect the SPA's TTI.
- Author schema currently fetched as a bare `name` string in two queries — adding
  bio/avatar touches both `POSTS_QUERY` and `getPostBySlug`.
- The `data-sanity-*` Presentation/stega attributes must be preserved through any
  refactor so Studio live-editing keeps working.

## Linked
- PRs:
