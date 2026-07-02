# AGENTS.md

<!-- Cross-tool contract. Read natively by Cursor, Codex, Copilot, Devin, Zed, and
     most other agents; Claude Code imports it via CLAUDE.md. Keep under ~150 lines. -->

## Project

- **Name**: benhickman.dev
- **Purpose**: Personal portfolio site + blog for Ben Hickman, multi-domain
  (benhickman.dev primary; also zengineer.cloud, zennlogic.com).
- **Stack**: TypeScript (strict) monorepo — Astro 7 site on Cloudflare Workers in
  `astro/` (canonical), legacy React 19 + Vite SPA in `ui/` (Vercel), Sanity v4
  headless CMS in `studio/`.

## Layout

- `astro/` — **the canonical site** (as of 2026-07-01): Astro 7 + Cloudflare Workers,
  Obsidian Foundry design system. Commands live in `astro/README.md`; the gate is
  `npm run verify` (Biome + astro check + Vitest + build).
- `ui/` — LEGACY React 19 + Vite SPA, superseded by `astro/` and pending decommission.
  Do not add features here. Until it is removed, keep the shared consent cookie
  (`benhickman_consent_v1`) and theme localStorage keys compatible across both apps —
  consent/nav/theme logic is intentionally duplicated and must not drift semantically.
- `studio/` — Sanity v4 Studio (schema types, desk structure, presentation).
- Each subproject has its own `package.json`; run commands from inside that folder.

## Commands

```bash
# ui/ (React 19 + Vite SPA) — npm + ESLint + Jest + Prettier
cd ui
npm install
npm run dev                  # Vite dev server (localhost:5173)
npm run build                # tsc -b && vite build
npm run lint                 # ESLint (eslint .)
npm test                     # Jest
npm run test:coverage        # Jest with coverage
npm run storybook            # Storybook on port 6006
npm run prettier -- --write .  # format with Prettier

# studio/ (Sanity v4 CMS)
cd studio
npm install
npm run dev                  # sanity dev
npm run deploy               # sanity deploy
```

> Shell is PowerShell on Windows. `tsc --noEmit` (`npm run typecheck` in `ui/`)
> is the type gate. There is no `any`-free CI yet — keep new code typed.

## Conventions

- TypeScript standards live in `.claude/skills/typescript-standards/SKILL.md` —
  they apply to every agent, not just Claude. Read it before writing TS/JS.
- **TypeScript/React**: strict mode; functional components + hooks. `interface`
  for props/object shapes, `type` for unions. No `any` — use `unknown` + narrowing.
- **File naming**: PascalCase for components (`.tsx`), camelCase for utilities (`.ts`),
  `use`-prefixed camelCase for hooks. Feature-based component folders.
- **Imports**: group React, third-party libs, then internal modules.
- **MUI**: theme tokens in `styles/theme.ts`; use the `sx` prop or styled, avoid
  inline styles. Mobile-first responsive via MUI breakpoints.
- **Accessibility**: target WCAG 2.1 AA — alt text, 4.5:1 contrast, keyboard nav,
  semantic HTML. Respect `prefers-reduced-motion`; keep