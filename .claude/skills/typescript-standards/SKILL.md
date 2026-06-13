---
name: typescript-standards
description: TypeScript/JavaScript conventions for this repo — toolchain, style, typing, testing, and security. Use when writing, reviewing, or refactoring TS/JS code, or setting up project config (tsconfig, eslint, jest, package.json).
user-invocable: true
---

# TypeScript standards (2026)

## Toolchain

- **Prettier + ESLint** are the formatter + linter: `npm run prettier -- --write .` to format, `npm run lint` (ESLint flat config, `eslint.config.js`) to lint. Run from inside `ui/` or `studio/`.
- **Typecheck**: `tsc --noEmit` is the gate. TypeScript 7's native `tsgo --noEmit` is a drop-in speedup — adopt when the project's targets allow (es2021+, no downlevel emit).
- **Jest** for tests: `npm test` (or `npm run test:coverage`). React Testing Library for components.
- **npm** for packages in `ui/` and `studio/`. Commit the lockfile change when adding deps; keep install scripts disabled.

## tsconfig

- `"strict": true` always; add `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` on new projects.
- `verbatimModuleSyntax: true`; ESM (`"type": "module"`) for anything new.

## Style

- No `any`. Use `unknown` + narrowing; if `any` is truly unavoidable, comment why.
- `interface` for object shapes, `type` for unions/compositions. Discriminated unions over boolean flags.
- Prefer pure functions and immutable data (`readonly`, `as const`). No classes where a function will do.
- Handle every Promise: `await`, `.catch`, or explicit `void` with a comment. No floating promises.
- Named exports only; default exports complicate refactors.

## Testing

- Co-locate tests as `<file>.test.ts` or in `tests/`; follow what the repo already does.
- Test behavior through public APIs, not implementation details. Avoid snapshot tests for logic.
- Mock only the true edges (fetch, fs, timers — Jest fake timers).

## Security

- Validate external data at the boundary with zod (or equivalent) — types are erased at runtime.
- No `eval`/`new Function`/`dangerouslySetInnerHTML` with external strings.
- Secrets via environment at runtime; never committed, never bundled into client code.
- New dependencies: check the exact package name (typosquats), prefer established packages, keep lifecycle scripts disabled.
