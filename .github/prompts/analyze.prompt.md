You are GPT-5 acting as a senior front-end tech lead. Audit this React + TypeScript + Vite monorepo (or app) end-to-end and produce a prioritized, opinionated issue list WITH CODE PATCHES.

SCOPE
- Analyze only files relevant to the app’s build and runtime:
  - package.json, pnpm-lock.yaml/yarn.lock, .nvmrc/.node-version
  - tsconfig*.json, vite.config*.ts/js, index.html, public/**
  - src/** (components, hooks, pages, routes, styles, assets, env usage)
  - .eslintrc*, .prettierrc*, .editorconfig
  - tests: vitest.config.*, setup*, __tests__/**, *.test.*, playwright/**
  - .github/workflows/** (CI)
- Use @workspace to search, read, and cite exact file paths/line ranges.

OUTPUT FORMAT (STRICT)
1) Summary (5–8 bullets): top risks and why they matter.
2) Prioritized Fix List: table with columns [# | Severity (P0–P3) | Area | File(s) | Problem | Why it’s a problem | Proposed Fix | Est.]
3) Patches: for each P0/P1 item, provide a unified diff (git apply-able) with minimal, surgical changes. Include new/updated config files where needed.
4) Commands: exact CLI to run (pnpm preferred; fall back to npm/yarn) for lint, typecheck, tests, build, bundle analysis.
5) Follow-ups: medium-term refactors and hardening tasks.

CHECKLIST (HIT ALL OF THESE)
React (18+)
- Root API: createRoot, StrictMode enabled in dev.
- Hooks: exhaustive-deps compliance, no state updates in render, no stale closures, stable deps for memo/useCallback.
- Render keys stable; lists don’t use index keys where order can change.
- Suspense/lazy where appropriate, error boundaries for routes and async UI.
- Avoid overusing context; prefer query libraries or local state. Recommend TanStack Query for server cache; consider Zustand/Redux only if global mutation is complex.
- No inline functions in hot paths unless memoized; measure before optimizing.

TypeScript
- "strict": true, "noImplicitAny": true, "noUncheckedIndexedAccess": true.
- Prefer types over interfaces for props; use discriminated unions for variants.
- Enforce exhaustive switch with a `never` helper.
- Avoid `any`/`as` casts; prefer proper typing or type guards.
- Path aliases configured and used (tsconfig + vite resolve.alias).

Vite & Build
- vite.config.ts: define resolve.alias, build.target (es2020+), sourcemap (prod false, CI true), css code-splitting, rollupOptions for manualChunks (vendor splitting), assetsInlineLimit sane.
- Env: use import.meta.env with VITE_*; no secrets committed; document .env*. Add `define: { 'process.env.NODE_ENV': '"production"' }` only if needed.
- optimizeDeps for heavy ESM deps, ensure tree-shaking. Validate that packages ship ESM; replace CommonJS where sensible.

Performance
- Dead code / unused deps removed; bundle size analysis with `rollup-plugin-visualizer` or `vite-bundle-visualizer`.
- Code-split routes; defer non-critical code; prefetch where it materially helps.
- Images: large assets optimized; SVGs as components via SVGR when dynamic.
- Avoid re-renders: memo components with stable props; derive state, don’t duplicate.
- Web vitals: instruct how to add a lightweight report (optional).

Accessibility
- Landmarks present, headings logical, labels/aria for inputs, alt text, keyboard focus order, focus ring not disabled, skip-to-content link.
- Color contrast ≥ 4.5:1 for text; no “div-buttons”; proper semantics.

Security
- No `dangerouslySetInnerHTML` without sanitize; if present, propose DOMPurify wrapper.
- All external links using `target="_blank"` include `rel="noopener noreferrer"`.
- No secrets in repo or import.meta.env at runtime; recommend server proxy when needed.
- Validate user input (client-side) for forms; avoid leaking stack traces.

Testing & QA
- Vitest + React Testing Library in place; at least smoke tests per route and one a11y check (jest-axe or axe-playwright).
- Add Playwright (optional) for a critical user flow if missing.
- CI: typecheck, lint, unit tests, build, and (optional) preview deploy.

Tooling & DX
- ESLint: @typescript-eslint, eslint-plugin-react, eslint-plugin-react-hooks, eslint-config-prettier; enforce import order.
- Prettier integrated; .editorconfig present.
- Husky + lint-staged for pre-commit: typecheck --noEmit, eslint --max-warnings=0, prettier --check.
- Package scripts: "dev", "build", "preview", "typecheck", "lint", "test", "coverage", "analyze".

PROCESS
- Start by scanning with @workspace.find for:
  - "createRoot(", "StrictMode", "dangerouslySetInnerHTML", "target=\"_blank\""
  - "useEffect(" with missing deps, "eslint-disable", any "any" casts
  - tsconfig strict flags, vite.resolve.alias, import.meta.env usage
  - Large imports (e.g., lodash/*), dynamic imports, route code splitting
- Cite exact file paths and lines for each issue. Provide minimal diffs that keep style consistent.

DELIVERABLES
Return: Summary, Prioritized Fix List (table), Patches (diffs), Commands, Follow-ups.
Assume pnpm; if lockfile indicates otherwise, adapt. Keep explanations crisp and opinionated.