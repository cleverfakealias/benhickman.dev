# ⌘K agentic chat upgrade — status

**State:** implementation + local live verification complete (97/97 tests +
build green; tool loop, verify-step UX, refusals all confirmed live in dev).
Remaining: D4 deploy (owner swaps prod sitekey into `.env`, `npm run deploy`,
swap back) + the production LLM provider decision (NVIDIA trial ToS vs
Workers AI).

## Decisions (owner, 2026-07-01)

- Verify UX: inline verify step inside the chat thread; keep Managed widget mode.
- Tools: `search_site`, `get_project`, `get_post`. No personal-facts file.
- Privacy line: public site content only.
- Quotas: keep 40/IP + 500 global; tool rounds capped at 2.
- History: 6 → 10 exchanges with char-budget trim (owner asked for "ten or so").

## Context for cold resume

- Endpoint: `astro/src/pages/api/cmdk.ts`; island: `astro/src/components/islands/CommandPalette.tsx`.
- Contact form was decoupled from Turnstile earlier on this branch (Formspree +
  hCaptcha, client-direct) — Turnstile is chat-only now.
- Production Worker: `benhickman-dev` (workers.dev live); prod Turnstile
  sitekey goes in `astro/.env` only at deploy time (test key otherwise).
- Model: NVIDIA NIM, nemotron-3-super-120b-a12b, OpenAI-compatible. Tool-call
  support assumed via `tools` param — B4 includes a graceful degrade if the
  provider rejects it; verify live during D2.
- Agent may not read/edit `.env*` files (guard hook) — owner handles those.

## Provider research (2026-07-01)

- NIM tool calling: CONFIRMED — OpenAI-compatible `tools` param, Nemotron
  family follows the format cleanly. Keep the B4 degrade path as insurance.
- **ToS finding:** build.nvidia.com trial credits are licensed for internal
  testing/evaluation only; serving real end-users is "production" and requires
  NVIDIA AI Enterprise. The public chat therefore sits outside trial terms
  TODAY (pre-existing, not caused by this feature). Endpoint stays
  provider-agnostic (LLM_BASE_URL/LLM_MODEL/LLM_API_KEY); recommended
  production-legal free option: Cloudflare Workers AI (OpenAI-compatible,
  function-calling models, free daily allocation). Owner decides at deploy.

## Open questions

- Provider decision for production (NVIDIA gray zone vs Workers AI swap) —
  config-only, does not block implementation.
- If Sanity `getAllPosts` lacks `body`, A1 adds a query field (public content,
  no schema change).

## Next action

Approved 2026-07-01. Phase A (agent) + Phase C (agent) in parallel → Phase B
(main session) → Phase D.
