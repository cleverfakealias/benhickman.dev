# ⌘K chat — Langfuse tracing

## Intent

Full-content LLM observability for `/api/cmdk` in the owner's **Langfuse Cloud
US** project: one trace per live ask (question + final answer), a generation
per provider round (messages in, output, latency, degraded flag), a span per
tool call (args + result + ok). Tracing must be strictly optional — missing
keys or Langfuse outages can never affect the chat.

## Approach

- Official **classic `langfuse` JS SDK** (owner preference for official SDK;
  the v4 OTel line has a known Cloudflare Workers memory issue, the classic
  SDK is edge-native and documented for Workers with
  `waitUntil(flushAsync())`). New dependency: `langfuse`.
- New `astro/src/lib/tracing.ts` wrapper so `api/cmdk.ts` stays clean:
  `startAskTrace(env, opts) → AskTrace | null` (null when
  `LANGFUSE_PUBLIC_KEY`/`LANGFUSE_SECRET_KEY` unset). Every wrapper method
  try/catches — SDK misbehavior is logged, never thrown.
- Privacy: the Astro **session id is a capability (cookie value) — never sent
  raw**; traces carry a salted SHA-256 hash as `sessionId`. No IPs. Full
  message content is sent by owner decision → privacy page gains a Langfuse
  processor entry.
- Wiring: trace created in the live branch after all gates; `runAssistant`
  gains an optional `trace` param; flush rides the existing
  `cfContext.waitUntil` (inline await under vitest/node).
- Secrets: `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY`, optional
  `LANGFUSE_BASE_URL` (default `https://us.cloud.langfuse.com`) via
  `wrangler secret put` / `.dev.vars`.

## Tasks

- [x] T1. `npm install langfuse` (astro/) — 3.38.20
- [x] T2. `src/lib/tracing.ts` (+ salted session hash, no-op guards)
- [x] T3. Wire `api/cmdk.ts` (trace + generations + tool spans + flush via
      waitUntil in the stream's finally; created only after gates pass)
- [x] T4. `src/lib/tracing.test.ts` — 6 tests (unconfigured → null; SDK
      throw/reject swallowed; hash deterministic/salted/no raw id)
- [x] T5. Docs + privacy.astro Langfuse processor entry
- [x] T6. Gate green (103/103 + build). Verified end to end 2026-07-01:
      no-op path with keys absent; with keys, `cmdk-ask` traces confirmed via
      API readback (project cmr2zko1d017zad0jkq8oa8o6) and then visible in the
      owner's dashboard (Cloud US ingestion lagged the API by some minutes —
      normal). SDK debug now opt-in via `LANGFUSE_DEBUG=true`.
      **Remaining for owner at deploy:** `wrangler secret put
      LANGFUSE_PUBLIC_KEY` / `LANGFUSE_SECRET_KEY` on `benhickman-dev`.

## Notes

- Owner decisions (2026-07-01): Cloud US · full content · official SDK.
- Trace only live-mode asks; stub mode is untraced.
- `.dev.vars.example` cannot be edited by the agent (secrets guard) — owner
  adds the three template lines.
