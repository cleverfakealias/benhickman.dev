---
id: 2026-06-26-dependency-supply-chain-audit
owner: Zenn
created: 2026-06-26
---

# Dependency supply-chain audit & hardening for ui/ and studio/

## Goal
Bring every dependency in both workspaces (`ui/` SPA, `studio/` Sanity Studio) onto
the latest secure stable releases from the real upstream packages, eliminate the
known CVEs surfaced by audit, retire deprecated packages, and lock down the
supply chain (frozen installs, automated update bot, pinning policy).

## Current state

> Tooling note: this is a **pnpm** workspace (`pnpm-workspace.yaml` → `ui`, `studio`;
> single committed `pnpm-lock.yaml` at root; `lockfileVersion 9.0`). There are **no
> `package-lock.json` files** — `npm audit` fails with `ENOLOCK`, so audit data below
> comes from `pnpm audit` against the committed lockfile. Manifests still document
> npm in AGENTS.md; that doc is stale vs. the actual pnpm setup.

**`pnpm audit` (whole lockfile): 116 vulnerabilities — 1 critical, 37 high, 67 moderate, 11 low.**
**`pnpm audit --prod` (runtime tree): 74 vulnerabilities — 0 critical, 16 high, 49 moderate, 9 low.**

Notable advisories (severity | package | vulnerable → fixed | path):

- **CRITICAL** | handlebars | `<=4.7.8` → `>=4.7.9` | JS injection via AST type confusion | `ui > ts-jest > handlebars` (dev/test only)
- HIGH | vite | `<=6.4.2` → `>=6.4.3` | `server.fs.deny` bypass + arbitrary file read (dev server) | `ui > vite` (also `studio > sanity > vite`)
- HIGH | axios | `<1.16.0` → `>=1.16.0` | prototype pollution / MITM / proxy-auth leak (several CVEs) | `ui > @storybook/test-runner > jest-playwright-preset` (dev only)
- HIGH | js-cookie | `<=3.0.5` → `>=3.0.7` | per-instance prototype hijack in `assign()` | `ui > js-cookie` (**direct runtime dep**)
- HIGH | undici | `<6.27.0` → `>=6.27.0` | WebSocket DoS / overflow / queue poisoning | `studio > sanity > @sanity/cli` (transitive)
- HIGH | ws | `<8.21.0` → `>=8.21.0` | memory-exhaustion DoS | `studio > sanity > @sanity/cli`
- HIGH | tar | `<=7.5.10` → `>=7.5.11` | symlink path traversal | `studio > sanity > @sanity/export`
- HIGH | lodash / lodash-es | `<=4.17.23` → `>=4.18.0` | code injection via `_.template` | `studio > @sanity/vision`, `studio > sanity > @sanity/sdk`
- HIGH | form-data | `<4.0.6` → `>=4.0.6` | CRLF injection | `studio > sanity > form-data`
- HIGH | storybook | `<9.1.19` → `>=9.1.19` | manager bundle env-var exposure + dev-server WebSocket hijack | `ui > storybook`
- HIGH | @babel/plugin-transform-modules-systemjs | `<=7.29.3` → `>=7.29.4` | arbitrary code gen | `studio > sanity > @sanity/cli`
- HIGH | picomatch / flatted | ReDoS / prototype pollution | transitive (eslint, sanity cli)
- LOW | dompurify | `<3.4.9` → `>=3.4.9` | mXSS / SAFE_FOR_TEMPLATES bypass | `ui > monaco-editor`, `studio > sanity > isomorphic-dompurify`

**`pnpm outdated` highlights (Wanted = in-range, Latest = registry head):**

| Package | Workspace | Current range | Wanted | Latest | Note |
|---|---|---|---|---|---|
| @mui/material | ui (dep) | ^6.1.0 | 6.5.0 | **9.1.2** | 3 majors behind; v7 stable = 7.3.11 |
| @mui/icons-material | ui (dep) | ^6.1.0 | 6.5.0 | **9.1.1** | must track @mui/material major |
| @mui/styles | ui (dep) | ^6.1.0 | 6.5.0 | 6.4.8 | **DEPRECATED** (JSS; no React 18/19 support) — remove |
| @mui/system | ui (dev) | ^7.3.9 | 7.3.x | 9.1.2 | **mismatch**: system v7 vs material v6 — must equal material major |
| @hcaptcha/react-hcaptcha | ui (dep) | ^1.13.0 | 1.17.4 | **2.0.2** | major |
| @portabletext/react | ui (dep) | ^4.0.3 | 4.0.3 | **6.2.0** | 2 majors |
| @sanity/image-url | ui (dep) | ^1.1.0 | 1.2.0 | **2.1.1** | major |
| @sanity/visual-editing | ui (dep) | ^4.0.1 | 4.0.3 | **5.4.4** | major |
| @sanity/client | ui (dep) | 7.12.0 (pinned) | 7.23.0 | 7.23.0 | stale exact pin, in-major |
| focus-trap-react | ui (dep) | ^11.0.4 | 11.0.6 | **12.0.3** | major |
| react-router-dom | ui (dep) | ^6.28.0 | 6.30.4 | **7.18.0** | major (v7) |
| monaco-editor | ui (dep) | ^0.54.0 | 0.54.0 | 0.55.1 | minor; clears dompurify advisory |
| js-cookie | ui (dep) | ^3.0.5 | 3.0.8 | 3.0.8 | in-range bump clears CVE |
| vite | ui (dev) | ^6.0.5 | 6.x | **8.1.0** | 2 majors; min secure = 6.4.3 |
| typescript | ui/studio (dev) | ^5.6 / ^5.8 | 5.x | **6.0.3** | major |
| eslint | ui/studio (dev) | ^9.x | 9.x | **10.5.0** | major |
| storybook | ui (dev) | 9.1.13 (pinned) | — | **10.4.6** | major; min secure on v9 = 9.1.19 |
| jest | ui (dev) | ^30.0.5 | 30.4.2 | 30.4.2 | in-range |
| typescript-eslint | ui (dev) | ^8.39.0 | 8.62.0 | 8.62.0 | in-range |
| sanity / @sanity/vision | studio (dep) | ^4.17.0 | 4.22.0 | **6.2.0** | 2 majors |

**Supply-chain hardening status:**

- Lockfile: single `pnpm-lock.yaml` committed at root. Good.
- CI (`.github/workflows/ci.yml`): installs with `pnpm install --frozen-lockfile`. Good — but **no `pnpm audit` / vuln gate**, and CI runs `ui` lint/build/test only (no `studio` lint/build, no typecheck job named explicitly).
- Pinning: mixed — most ranges use `^` (caret); a few exact pins are stale (`@sanity/client 7.12.0`, `storybook 9.1.13`, `@monaco-editor/react 4.7.0`, `eslint-plugin-react-refresh 0.4.20`).
- `overrides` / `pnpm.overrides`: **none** — transitive CVEs (undici, ws, tar, lodash, axios, dompurify, picomatch, flatted, form-data) cannot be force-resolved until upstream (`sanity`, `ts-jest`, `@storybook/test-runner`) ships them or an override is added.
- Automated updates: **no Dependabot and no Renovate config** present.
- `.npmrc` / provenance / `--save-exact`: none configured.
- Existing policy: `.claude/hooks/allowed-run-packages.txt` allowlists one-off remote execution (npx/pnpm dlx) to `@biomejs/biome, typescript, vitest, eslint, prettier`; guard hooks block edits to that file and CI/policy files. Keep and extend this model.

## Success criteria
- [ ] `pnpm audit --prod` reports **0 high and 0 critical** in the runtime tree (moderate/low triaged with documented rationale).
- [ ] `pnpm audit` (full) reports **0 critical** and the handlebars/ts-jest critical is resolved (ts-jest bump or `pnpm.overrides`).
- [ ] `@mui/styles` is **removed** from `ui/package.json` (deprecated; migrate any JSS usage off it).
- [ ] `@mui/material`, `@mui/icons-material`, and `@mui/system` are all on the **same major** (mismatch eliminated).
- [ ] `js-cookie` ≥ 3.0.7, `monaco-editor` ≥ 0.55.1, `vite` ≥ 6.4.3 (CVE-clearing direct/dev bumps applied).
- [ ] Transitive highs with no in-range fix (undici, ws, tar, lodash, form-data, axios, picomatch, flatted, dompurify) are either cleared by upstream major bumps (`sanity` 6, storybook 10) or pinned via `pnpm.overrides` in root `package.json`.
- [ ] A Renovate **or** Dependabot config exists and groups MUI / Sanity / Storybook / type-defs and auto-merges in-range patch/minor security updates.
- [ ] CI adds a `pnpm audit --prod --audit-level=high` gate and runs `studio` lint/typecheck (not just `ui`).
- [ ] Each upgrade PR passes `tsc -b`, ESLint, Jest, and a successful `vite build` for `ui` and `sanity build` for `studio`.
- [ ] AGENTS.md / CLAUDE.md corrected to reflect the actual **pnpm** workflow (currently say npm).

## Scope
- `ui/package.json`, `studio/package.json` (direct dependency ranges).
- Root `pnpm-lock.yaml` and (new) root `package.json` `pnpm.overrides` for transitive pins.
- `.github/workflows/ci.yml` (audit gate, studio steps).
- New Renovate/Dependabot config.
- `.claude/hooks/allowed-run-packages.txt` only if a new tool needs remote execution (human-edited; agent is blocked).

## Out of scope
- Performing the actual version bumps / `pnpm update` / `pnpm install` — those land in follow-up PRs, one logical group per PR. This intent only plans them.
- App feature/behavior changes; runtime refactors beyond what an upgrade's breaking change forces.
- Migrating the repo away from pnpm or changing the deploy target (Vercel).
- Touching the other workspace projects in the parent monorepo.

## Plan

1. **Security-critical first (CVE remediation).**
   1. ui dev/test: bump `ts-jest` to a release pulling `handlebars >=4.7.9` (clears the **critical**); if none in-range, add root `pnpm.overrides: { handlebars: ">=4.7.9" }`.
   2. ui runtime direct: `js-cookie ^3.0.5 → ^3.0.7` (HIGH), `monaco-editor ^0.54.0 → ^0.55.1` (dompurify LOW).
   3. ui dev: `vite ^6.0.5 → ^6.4.3+` (min secure; defer the v8 jump to step 3), `storybook 9.1.13 → 9.1.19` min (defer v10 to step 3).
   4. Transitive-only highs (no direct owner): add root `pnpm.overrides` for `undici >=6.27.0`, `ws >=8.21.0`, `tar >=7.5.11`, `lodash >=4.18.0`, `lodash-es >=4.18.0`, `form-data >=4.0.6`, `axios >=1.16.0`, `picomatch >=4.0.4`, `flatted >=3.4.2`, `dompurify >=3.4.9` — then re-run `pnpm audit` to confirm they resolve without breaking `sanity`/storybook peer ranges.
   5. studio: bump `sanity` + `@sanity/vision` toward latest within v4 first to absorb the undici/ws/tar/form-data/babel/lodash fixes upstream before the v6 major.

2. **Retire deprecated / mismatched packages.**
   1. Remove `@mui/styles` from `ui/package.json`; migrate any remaining JSS `makeStyles`/`withStyles` usage to MUI's `sx` / `styled` (per https://mui.com/material-ui/migration/migrating-from-jss/).
   2. Align `@mui/system` to the same major as `@mui/material` (currently system ^7 vs material ^6 — fix in the MUI major step below).

3. **Routine majors (grouped, each its own PR, behind tests).**
   - MUI group: `@mui/material` + `@mui/icons-material` + `@mui/system` 6 → 7 (7.3.11) as the conservative target; evaluate 9.x separately. Follow the v6→v7 codemod.
   - Sanity group: `sanity` + `@sanity/vision` 4 → 6; `@sanity/visual-editing` 4 → 5; `@sanity/image-url` 1 → 2; `@sanity/client` 7.12.0 → ^7.23.0 (and convert exact pin to caret).
   - react-router-dom 6 → 7 (data-router migration).
   - `@portabletext/react` 4 → 6; `@hcaptcha/react-hcaptcha` 1 → 2; `focus-trap-react` 11 → 12.
   - Tooling majors (lower risk, dev-only): `vite` 6 → 8, `typescript` 5 → 6, `eslint` 9 → 10, `storybook` 9 → 10, `typescript-eslint` to matching latest. Bump together with their plugins/configs.

4. **Hardening baseline.**
   1. Add `pnpm.overrides` block to a root `package.json` for the transitive pins from 1.4 and keep it as the escape hatch.
   2. Add Renovate (`renovate.json`) or Dependabot (`.github/dependabot.yml`) for `ui` + `studio`: weekly, grouped (mui*, @sanity/*, storybook*, @types/*, eslint*), auto-merge patch/minor security; security alerts enabled.
   3. Extend CI: add `pnpm audit --prod --audit-level=high` as a non-blocking-then-blocking gate; add `studio` lint + `tsc` steps; keep `--frozen-lockfile`.
   4. Consider `.npmrc`/`.pnpmrc` with `minimum-release-age` (cooldown) to blunt fresh-publish supply-chain attacks, and enable provenance verification where supported.
   5. Fix the npm→pnpm drift in AGENTS.md / CLAUDE.md command docs.

## Risks / open questions
- **@mui/styles removal** is the highest-touch change: any `makeStyles`/`withStyles`/`ThemeProvider` JSS usage must be ported to `sx`/`styled`; visual regressions need Storybook/Chromatic + manual review. Audit `ui/src` for JSS usage before scheduling.
- **MUI 6 → 7 (or 9)**: breaking theme/Grid (`Grid2`) API changes; v9 is two further majors — recommend landing v7 first, re-baselining, then evaluating v9 as a separate intent.
- **Sanity 4 → 6**: Studio config, schema, and presentation/visual-editing APIs can break across two majors; must verify `sanity build`, deploy preview, and visual editing against the live dataset.
- **react-router 6 → 7**: route-config / data-API migration; check every `<Route>` and loader usage.
- **`pnpm.overrides` for transitive deps** can violate a parent's peer range and break installs (esp. inside `sanity`/storybook) — re-run `pnpm install --frozen-lockfile=false` locally and full audit after each override; prefer upstream majors over overrides where the major already ships the fix.
- **vite 8 / typescript 6 / eslint 10 / storybook 10** are all brand-new majors — config-format churn (flat config, Vite plugin API). Land tooling majors last, one at a time.
- Open: confirm whether `npm` should be reintroduced or the repo standardize fully on pnpm (docs currently disagree with the lockfile/CI).
- Open: no published `node_modules` here, so audit reflects the lockfile's resolved tree; re-confirm counts after a real install in CI.

## Linked
- PRs:
