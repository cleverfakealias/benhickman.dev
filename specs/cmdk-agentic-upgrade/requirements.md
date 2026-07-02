# ⌘K agentic chat upgrade — intent

## Problem

1. The Turnstile Managed-mode checkbox renders as the first child of the palette
   panel — a raw, unexplained Cloudflare box above the conversation. It looks
   broken/bolted-on (user: "really out of place in the chat").
2. The assistant is not agentic: it answers from a static project dump baked
   into the system prompt. It can't look anything up, so detail answers are
   shallow and the prompt pays for every project on every question.
3. Conversation history caps at 6 exchanges; the owner wants ~10 so visitors
   can have a real back-and-forth.
4. Raising limits and adding tools increases the abuse surface; the owner wants
   an explicit security pass over the whole LLM path (prompting + controls).

## Goals

- **G1 — Verification UX:** the human-check lives *inside* the chat flow: the
  pending assistant bubble shows a styled "Verifying you're human…" step and
  hosts the checkbox when Cloudflare requires interaction. Managed mode stays
  (strongest bot filtering).
- **G2 — Agentic tools (read-only, server-defined):**
  - `search_site(query)` — search the existing site index (pages / projects / writing).
  - `get_project(slug)` — full detail for one project.
  - `get_post(slug)` — title/summary/excerpt of one writing post.
  The model decides when to call them; visitors can never influence *what* is
  fetchable (fixed corpus, validated args, no URLs).
- **G3 — History:** 10 exchanges per session (was 6), with a total-character
  trim so prompt cost stays bounded.
- **G4 — Hardening:** apply the deep-dive findings (reset-before-verify fix,
  stored-answer cap, tool-round cap, prompt-injection rules, off-topic-use
  refusals) and keep every existing gate (Turnstile per ask, burst limiter,
  hashed-IP daily quotas 40/IP + 500 global).

## Non-goals

- No personal facts beyond what the site already publishes (privacy line:
  public site content only — no facts file this round).
- No write-capable or network-fetching tools; no user-supplied URLs.
- No change to daily quota numbers (stay 40/IP, 500 global).
- No provider/model change; no billing-tier change (stays on free tiers).
- Legacy `ui/` SPA untouched.

## Acceptance criteria

- A1: When Cloudflare challenges, the checkbox appears inside the pending
  assistant bubble under a "Verifying you're human…" label, styled to the
  design system; the panel layout above the input does not shift.
- A2: Asking "what does the ZenMind project actually do?" produces an answer
  grounded in the project's detail sections via `get_project` (observable via
  a `status` SSE event, e.g. "Looking up ZenMind…").
- A3: A conversation retains context for 10 exchanges; the 11th oldest pair is
  dropped; stored assistant turns are capped so a full-history prompt stays
  under the configured character budget.
- A4: At most 2 tool rounds per question; the final answer call always streams;
  tool args are validated (length/enum) and tool output is size-capped.
- A5: `reset` performs no KV delete until Turnstile + quota gates have passed
  (live mode).
- A6: Off-topic exploitation (e.g. "write me a poem/marketing copy/code") is
  declined by prompt policy; the assistant redirects to Ben/site topics.
- A7: `npm run verify` passes; new/changed behavior covered by Vitest tests.
