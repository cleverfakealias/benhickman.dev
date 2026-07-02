---
id: 2026-06-26-playground-modernization
owner: Zenn
created: 2026-06-26
---

# Reframe Playground from generic JS scratchpad into an agentic-engineering showcase

## Goal
Turn the Playground from a generic "run some JavaScript" toy into a focused,
interactive demonstration of agentic-engineering capability (tool-use loops,
prompt/eval sandboxes, runnable code samples) that reinforces Ben's positioning,
while fixing the heavy-bundle, mobile, a11y, and SEO gaps in the current page.

## Current state
`ui/src/pages/Playground.tsx` (lazy-loaded at `/playground` via `App.tsx`)
renders a single Monaco editor (`@monaco-editor/react` 4.7.0, `monaco-editor`
0.54.0) seeded with `console.log('Hello, world!')`, an hCaptcha gate, a **Run**
button, and a `<pre>` output pane. Code runs in a Blob `Worker` with a shadowed
`console` and a 3s timeout. Observations:

- **Positioning mismatch.** Heading reads *"Just a place to play with JavaScript"* —
  generic filler that signals nothing about agentic engineering. It is the only
  page that says nothing about Ben's actual expertise.
- **Bundle weight.** Monaco is ~2 MB+ of JS/workers. The route is `lazy()`-split,
  but Monaco is **not** in a `manualChunks` group in `ui/vite.config.ts` (only
  `react`, `mui`, `sanity` are), and Monaco's own web-worker assets aren't
  explicitly managed. No `loader.config` to slim languages.
- **Mobile.** Monaco is near-unusable on touch/narrow screens; editor is a fixed
  `height="40vh"`, no mobile fallback, no responsive layout.
- **Accessibility.** No `<h1>` / landmark labelling for the page, no label tying
  the editor to its purpose, output `<pre>` is not an `aria-live` region (screen
  readers won't announce results), Run button gives no busy/disabled state, and
  the "verify human" message only appears in the output pane.
- **SEO/metadata.** No per-route title/description/canonical. `updateMetaTags()`
  runs once at app boot with domain-level branding only; `/playground` inherits
  the homepage title and has no unique meta, OG, or JSON-LD.
- **Security note (keep).** The Worker sandbox + 3s timeout + hCaptcha gate is a
  reasonable baseline for arbitrary JS; any new "live agent" demo must NOT call a
  model with a client-exposed key.

## Success criteria
- [ ] Page heading and intro copy explicitly frame the page around agentic
      engineering (no "just play with JavaScript" filler).
- [ ] At least one curated, runnable agentic demo ships (e.g. a mock tool-use
      loop, a prompt→structured-output transform, or an eval/scoring sandbox) with
      a "Reset to example" affordance and pre-seeded code instead of `Hello world`.
- [ ] Monaco is isolated into its own `manualChunks` entry (e.g. `monaco`) in
      `ui/vite.config.ts`; `ANALYZE=1 npm run build` confirms it loads only on
      `/playground` and is not in the initial/home chunk.
- [ ] Monaco language workers are trimmed to only the languages used (JS/TS/JSON)
      via `loader.config` / editor `options`, reducing transferred worker bytes.
- [ ] On viewports < 600px the editor either renders in a touch-friendly reduced
      mode or shows a read-only snippet + "open on desktop" message; page has no
      horizontal scroll at 360px.
- [ ] Output pane is an `aria-live="polite"` region; Run button exposes a
      disabled/busy state; editor has an accessible label; page has a single `<h1>`.
- [ ] `/playground` sets a unique document title, meta description, and canonical
      on mount (reusing/extending the existing meta utility, not a new lib unless
      surfaced for review).
- [ ] Existing Worker sandbox + 3s timeout + hCaptcha gate behavior preserved; no
      model API key is shipped to the client.
- [ ] `npm run lint`, `npm run typecheck` (`tsc -b`), and `npm test` pass.

## Scope
- `ui/src/pages/Playground.tsx` (primary)
- `ui/vite.config.ts` (Monaco chunking)
- `ui/src/config/domainConfig.ts` or a small per-route meta helper (page metadata)
- Possibly new small components/data under `ui/src/components/features/playground/`
  for curated examples (example registry + selector)
- Tests colocated (`Playground.test.tsx`)

## Out of scope
- Building real server-side LLM inference / a hosted agent backend (separate
  intent if pursued; would need a serverless route + secret-managed key).
- Replacing Monaco with a different editor.
- Changing the global routing/SSR model or adding SSR for SEO.
- Sanity schema changes.

## Plan
1. Rewrite heading + intro to position the page as an interactive agentic-
   engineering sandbox; add a single `<h1>` and a one-line value statement.
2. Add a curated example registry (typed `interface`/`type`) with 2-3 seeded,
   runnable demos that run safely client-side in the existing Worker, e.g.:
   - a mock tool-use / ReAct loop (planner → tool stub → observation → answer);
   - a prompt → structured-JSON extraction/validation snippet;
   - a tiny eval harness scoring outputs against assertions.
   Add a selector (tabs/dropdown) + "Reset to example" button.
3. Isolate Monaco: add a `monaco` entry to `manualChunks` in `vite.config.ts`;
   configure `loader.config` and editor `options` to load only JS/TS/JSON
   workers; verify with `ANALYZE=1 npm run build` (rollup-plugin-visualizer).
4. Add a mobile strategy: detect narrow viewport (MUI breakpoint) and render a
   touch-friendly or read-only fallback; make the editor container responsive.
5. Accessibility pass: `aria-live` output region, labelled editor, Run busy/
   disabled states, move the "verify human" hint out of the output stream into a
   visible status, check contrast and keyboard nav (WCAG 2.1 AA).
6. Add per-route metadata for `/playground` (title/description/canonical, OG)
   via the existing meta utility; keep domain-aware branding.
7. Add/extend tests for example switching, run gating by captcha, and a11y roles.
8. Run lint + typecheck + tests; `ANALYZE` build to confirm Monaco is split.

## Risks / open questions
- **Monaco bundle weight** is the biggest risk: even chunked, first load of
  `/playground` is heavy. Mitigate with explicit chunking, worker-language
  trimming, and a loading skeleton; confirm the home/initial bundle does not
  regress.
- **"Live agent" temptation.** A genuinely live LLM demo cannot ship a model key
  to the SPA. Either keep demos fully client-side/mocked (recommended for this
  intent) or scope a separate serverless proxy with rate-limiting, captcha, and a
  server-held key — do not inline a key.
- **Mobile editing UX** for Monaco is inherently poor; the fallback approach
  (read-only snippet vs. degraded editor) needs a product call.
- **SEO ceiling.** This is a client-rendered SPA; per-route meta set on mount
  helps social/crawler snapshots but is weaker than SSR — acceptable for a
  playground, flag if organic discovery of this page matters.
- Open: keep hCaptcha gating for purely client-side demos, or relax it since no
  network call is made? (Lean: keep it; it also throttles abuse of the Worker.)

## Linked
- PRs:
