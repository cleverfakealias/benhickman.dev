You are GPT-5 acting as a Staff-level Design Engineer specialized in MUI v6 + Emotion. Audit this app’s VISUAL DESIGN and return a modern, non-derivative design system that replaces our current “Tailwind-purple” look with something cleaner and more original.

STACK CONTEXT
- Framework: React + TypeScript + Vite
- UI: MUI v6 (@mui/material)
- Styling: Emotion (sx prop, theme), plus a few plain CSS files
- Assume pnpm unless the lockfile says otherwise

SCOPE — WHAT TO READ
- package.json, vite.config.*, index.html
- src/theme/** (or equivalent), src/styles/**, any global.css
- src/App.tsx/tsx and the layout shell
- MUI setup: ThemeProvider, CssBaseline, dark mode toggle (if any)
- Components with visual surface: buttons, inputs, navigation, cards, tables, dialogs, toasts/snackbars
- Any direct color literals in sx/Styled components and stray CSS files

OUTPUT FORMAT (STRICT)
1) Executive Summary (6–10 bullets): What’s aesthetically off (color, density, type, elevation, motion, a11y), how it hurts clarity/brand, and the fastest wins.
2) Visual Directions (pick 2 and rank them):
   - 3–5 mood keywords + a one-paragraph brand story
   - Color system defined in **OKLCH** with hex fallback; semantic roles: `accent`, `accent-contrast`, `bg`, `surface`, `overlay`, `border`, `text/primary/secondary/muted`, `success`, `warning`, `danger`, `focus`
   - Typography: variable font pairing (UI + mono), scale (e.g., 1.20 modular), line heights, letter-spacing
   - Density & radii: 4-point spacing scale; radii set (xs/sm/md/lg/2xl); elevation tokens (1–5)
   - Motion tokens: durations (100/150/200/300/500ms) and easing curves (standard/emphasized/exit), reduced-motion rules
3) Theming Architecture:
   - **CSS variables** for tokens at `:root` and `[data-theme="dark"]` (light/dark parity; text contrast ≥ 4.5:1)
   - Map tokens to MUI theme via `createTheme` (palette, shape, shadows, typography, transitions)
   - Component-level overrides in `theme.components` (MuiButton, MuiLink, MuiCard, MuiAppBar, MuiTextField/MuiInputBase, MuiDialog, MuiAlert)
   - Guidance to migrate away from raw hex/sx inline colors to semantic tokens
4) CODE PATCHES (unified diffs, git-applyable):
   - Add `src/theme/tokens.css` with **OKLCH** CSS variables (light & dark)
   - Add/replace `src/theme/theme.ts` that consumes CSS vars into MUI `createTheme`, defines color schemes, typography, shape, shadows, transitions
   - Update `src/main.tsx` or `src/App.tsx` to wire ThemeProvider + CssBaseline and a tiny ThemeToggle (html `data-theme` + localStorage + prefers-color-scheme sync)
   - Component overrides: Buttons (size + variant matrix: solid/soft/outline/ghost/link), Inputs (focus ring, error/success), Card (elevations 1–3), Navbar/AppBar (blurred surface), Link (underline on focus/hover), Dialog (overlay + surface tokens)
   - Remove or neutralize purple-heavy styles: replace hex usage in sx with tokenized `color`, `bgcolor`, `borderColor`
   - OPTIONAL: replace any ad-hoc CSS files by moving rules into sx or `globalStyles` if feasible, otherwise re-tokenize them
5) Accessibility + QA:
   - Show contrast checks for key pairs (body text, buttons, links, inputs)
   - Add a minimal a11y test: Vitest + @testing-library + axe for one page (sample included)
   - Keyboard focus visibility everywhere; no “outline: none” unless replaced by a visible focus ring using `--color-focus`
6) Migration Plan:
   - “Two-day sweep” (quick wins) and “Two-week hardening” (systematic refactor) with checklists
   - Exact pnpm commands to install fonts and recommended deps
7) Asset Guidance:
   - Recolor logos/icons via tokens; update favicon & OpenGraph; example of a neutral, modern gradient background (optional, subtle)

DESIGN DIRECTIONS (HIT THESE)
- Move away from purple. Propose two modern, underused 2025-friendly directions:
  A) “Ink & Lime”: deep ink neutrals, near-white surfaces; high-chroma **lime** accent for action/focus; cyan secondary for data viz
  B) “Mineral Warmth”: warm stone neutrals, **desaturated rust** accent; muted teal secondary
  (You may propose a third if it better fits the current product.)
- OKLCH first, hex fallback. Provide 3 elevation surfaces per theme: `bg`, `surface`, `overlay`.
- Typographic system: variable Sans (e.g., Inter/Geist/Manrope) + mono (JetBrains Mono). Provide @fontsource imports + fallbacks.

MUI-SPECIFIC BEST PRACTICES (VERIFY & FIX)
- Single `ThemeProvider` at root; `CssBaseline` enabled; `color-scheme` set on html/body
- Use `palette` semantic colors (`primary`, `secondary`, `success`, etc.) mapped from tokens; avoid direct hex in sx
- `shape.borderRadius` uses our token scale; avoid mixing px values across components
- `shadows[1..5]` mapped from tokens; avoid default heavy MUI shadow look
- Define `typography` scale and map to variants; ensure `h1..h6`, `subtitle*`, `body*`, `button`, `caption`, `overline` are consistent
- Component overrides in `theme.components` for consistent paddings, radii, focus rings (`MuiFocusVisible`), and interaction states
- Respect `prefers-reduced-motion`; no large parallax/blur transitions by default
- Dark mode: html `data-theme="dark"` toggles CSS vars and MUI palette mode; sync with `matchMedia('(prefers-color-scheme: dark)')`

SEARCH & CITE (use @workspace)
- Find raw color hex in the codebase and list offenders by file:line
- Find purple classes or variables; list them with replacement guidance
- Identify stray CSS files; propose the minimal path to re-tokenize or migrate to sx
- Point out inconsistent spacing/radius and elevation usage with exact file references

CONCRETE PATCH EXAMPLES (REQUIRED)
1) src/theme/tokens.css — CSS variables with OKLCH (light & dark)
2) src/theme/theme.ts — `createTheme` consuming CSS vars; palette/typography/shape/shadows/transitions; `components` overrides for Button/Card/Input/AppBar/Dialog/Link
3) src/App.tsx (or main.tsx) — ThemeProvider + CssBaseline + ThemeToggle (data-theme switch)
4) Example: Button variant matrix implemented via theme overrides (solid/soft/outline/ghost/link)
5) Minimal a11y test (axe) for the Home page

PATCH STYLE
- Provide **unified diffs** that can be `git apply`-ed
- Keep changes surgical; no speculative renames or directory moves
- Where removal is risky, comment “TODO: migrate to tokens” with a follow-up item

COMMANDS (ADAPT IF LOCKFILE DIFFERS)
- pnpm add @fontsource-variable/inter @fontsource-variable/jetbrains-mono
- pnpm add -D @testing-library/react @testing-library/jest-dom vitest jsdom axe-core @axe-core/react
- pnpm exec vite build

DELIVERABLES
Return: Summary, Visual Directions (ranked), Theming Architecture, CODE PATCHES (diffs), Accessibility+QA, Migration Plan, Asset Guidance. Keep explanations crisp and opinionated; avoid hand-wavy design talk—ship working diffs.
