---
id: 2026-06-29-astro-p5-cmdk
owner: Zenn
created: 2026-06-29
phase: 5
parent: 2026-06-29-astro-cloudflare-rebuild
---

# Phase 5 — ⌘K "ask my work" command bar

# Goal
Build the signature interaction: a ⌘K command palette opened from the hero bar, the desktop nav
trigger, and the mobile center "Ask" button. **v1 ships projects-led** (local search over
pages/projects/writing, no LLM); the streaming-agent Worker is scaffolded so the live OpenRouter
agent can drop in later without re-architecting.

## Scope
- `src/components/islands/CommandPalette.tsx`, `src/pages/api/cmdk.ts`, the ⌘K trigger wiring in
  Header/Hero/BottomNav, `wrangler.toml` KV + secret bindings.

## Tasks
- [x] `CommandPalette` island (`client:load`) bound to `⌘K`/`Ctrl+K`, `/`, and `[data-cmdk-trigger]` (header pill, hero ⌘K bar, bottom-nav Ask). Overlay built to the Obsidian Foundry spec: grouped results (Pages · Projects · Writing) + an Ask row; selected row = 2px Persimmon left-border + `--color-surface-2`; full keyboard nav (↑/↓/Enter/Esc); reduced-motion-safe cursor. Click interception runs in **capture phase + stopPropagation** to beat ClientRouter's anchor handling.
- [x] **v1 data source:** `src/lib/searchIndex.ts` — build-time index of routes + verified `projects.ts` + Sanity writing (memoized, one fetch/build), serialized into the island. Fuzzy scorer (prefix/substring/subsequence), navigate-on-select via `astro:transitions/client`. No network/LLM for search.
- [x] **Graceful fallback:** triggers are `<a href="/contact">` (no-JS navigates to contact; with JS the palette intercepts).
- [x] `src/pages/api/cmdk.ts` (server, `prerender=false`) — live-agent boundary: KV per-IP daily quota (`cf-connecting-ip`, `CMDK_KV`, best-effort), Turnstile gating (enforced once `OPENROUTER_API_KEY` is set), and a **Web Streams `ReadableStream`** SSE response. Ships a **projects-led stub** in the final event shape (`data: {type:'token',text}` … `{type:'done'}`). Verified end-to-end: the palette streams + renders the stubbed answer.
- [x] Secrets: `OPENROUTER_API_KEY`/`OPENROUTER_MODEL` as `wrangler secret` — owner CLI step; the live branch is marked in the endpoint (consult claude-api skill when wiring). Server-only; nothing secret reaches the island.
- [x] `wrangler.jsonc`: added the `CMDK_KV` binding (local in dev; owner sets the prod id). Regenerated worker types.

## Acceptance criteria
- [x] ⌘K opens from all triggers (header verified; hero + bottom-nav share the mechanism), searches + navigates the local index, fully keyboard-operable, reduced-motion safe — verified in-browser.
- [x] `/api/cmdk` exists with KV + Turnstile wired and streams in the final SSE shape (projects-led stub until the key is added) — verified streaming + parsing.
- [x] OpenRouter/Turnstile key boundary is server-only (endpoint not in client dist); nothing secret reaches the island. `astro check` clean, build green.

## Depends on
- Phase 2 (triggers in the shell) + Phase 4 (shared Turnstile). The live LLM agent is explicitly later (out of scope to fully build now).

## Risks
- Streaming must use Web Streams on the Workers runtime and be tested under `wrangler dev` (the plain `astro dev` server has no bindings).
- KV is eventually consistent — quota is best-effort.
- zennlogic.com's exact backend isn't local — treat the streaming-edge shape as the spec, build internals fresh.
