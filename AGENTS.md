# AGENTS.md

<!-- Cross-tool contract. Read natively by Cursor, Codex, Copilot, Devin, Zed, and
     most other agents; Claude Code imports it via CLAUDE.md. Keep under ~150 lines. -->

## Project

- **Name**: benhickman.dev
- **Purpose**: Personal portfolio site + blog for Ben Hickman, multi-domain
  (benhickman.dev primary; also zengineer.cloud, zennlogic.com).
- **Stack**: TypeScript (strict) monorepo — React 19 + Vite SPA in `ui/`
  (Material-UI), Sanity v4 headless CMS in `studio/`. Deployed on Vercel.

## Layout

- `ui/` — the React 19 + Vite SPA. MUI theme, react-router, Sanity client for blog data.
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