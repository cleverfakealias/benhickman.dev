@AGENTS.md

## Claude Code specifics

Automation in this repo (configured in `.claude/settings.json`):

- **On every Write/Edit** a hook auto-formats and lints the file (Prettier + ESLint
  for TS/JS). If it reports remaining issues, fix them before moving on — don't
  disable the hook.
- **When you finish a turn**, a Stop hook runs the typecheck and tests for any
  TS/JS files changed this session (`tsc -b` + Jest). If it blocks you, fix the
  failures; it won't loop (it lets you stop on the second attempt).
- **Guard hooks** block: writes to secret files; shell reads of secrets
  (`cat .env`, `~/.ssh`, etc.); env dumps (`printenv`); destructive commands;
  editing policy files (`.claude/settings*`, hooks, `.mcp.json`, `.git/`,
  CI workflows); WebFetch outside `.claude/hooks/allowed-domains.txt`; and
  npx/uvx/pnpm-dlx for packages not in `.claude/hooks/allowed-run-packages.txt`.
  If a guard blocks you, that's policy — tell the user instead of working around it.

This is a m