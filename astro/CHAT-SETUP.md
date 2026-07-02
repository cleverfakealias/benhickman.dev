# Command-bar chat setup

The ⌘K command bar is a conversational, portfolio-grounded chat running through the Astro
Cloudflare Worker. It streams NVIDIA NIM responses and keeps a short server-side conversation so
follow-up questions work without accepting assistant history from the browser.

## Request flow

1. The React island creates a fresh Turnstile token with action `portfolio-chat`. The widget
   renders *inside* the pending answer bubble under a "Verifying you're human…" label, so a
   Managed-mode challenge appears as a step of the conversation, not a box above it.
2. `POST /api/cmdk` validates that single-use token with Cloudflare Siteverify.
3. The Worker applies per-IP/global limits using `CMDK_KV` (history mutations, including
   `reset`, happen only after every gate has passed).
4. Astro provides a stable session ID; the last **ten** completed exchanges are loaded directly
   from `CMDK_KV` and prepended to the new user turn (stored assistant turns are capped at
   2,000 chars; the replayed history is additionally trimmed to a 12,000-char budget).
5. The Worker runs a bounded agent loop against the OpenAI-compatible chat-completions endpoint:
   the model may call three read-only tools — `search_site` (the ⌘K index), `get_project`
   (bundled project detail), `get_post` (the prerendered `/assistant-corpus.json` built from
   published writing). At most **2 tool rounds** (≤3 executed calls each, results capped at
   2,000 chars), then a forced tool-free call. Every round streams; tool activity is surfaced
   to the browser as `{ type: 'status', text }` SSE frames ("Searching the site…"). If the
   provider rejects the `tools` parameter, the loop degrades once to plain chat.
6. After a complete answer, the Worker stores the exchange for 24 hours. `DELETE /api/cmdk` and
   the UI's **New chat** action clear it.

History is written directly to KV because Astro finalizes its normal session blob when the route
returns the streaming `Response`, before the full assistant answer is available. Tools are fixed
and server-defined: arguments are length/enum-validated, slugs must match real content, and no
tool can fetch a user-supplied URL or write anything.

## Local configuration

Run `npm run setup:local`. The committed templates provide Cloudflare's official test keys:

- `PUBLIC_CMDK_TURNSTILE_SITE_KEY`: always-pass invisible key for Chat.
- `CMDK_TURNSTILE_SECRET`: always-pass test secret.

(Turnstile protects only the chat — the contact form uses hCaptcha + Formspree,
configured separately; see the README.)

Add an NVIDIA API key to `.dev.vars` to enable live answers:

```ini
LLM_API_KEY=nvapi-...
LLM_BASE_URL=https://integrate.api.nvidia.com/v1
LLM_MODEL=nvidia/nemotron-3-super-120b-a12b
LLM_ENABLE_THINKING=false
```

Without `LLM_API_KEY`, the endpoint deliberately uses its local project-search stub.

## Production configuration

Create a Turnstile widget for Chat. Restrict it to the production hostnames; do not allow
`localhost` on production widgets. Put the public sitekey in the deployment environment:

```ini
PUBLIC_CMDK_TURNSTILE_SITE_KEY=<chat-widget-sitekey>
```

Store secrets with Wrangler rather than committed variables:

```bash
wrangler secret put CMDK_TURNSTILE_SECRET
wrangler secret put LLM_API_KEY
```

Set `LLM_BASE_URL`, `LLM_MODEL`, and `LLM_ENABLE_THINKING` as Worker variables or secrets as
appropriate. The chat endpoint validates Turnstile's hostname and `portfolio-chat` action in
production, uses a 10-second Siteverify timeout and idempotency key, and never exposes either
secret to the client.

## Observability (optional)

Two layers, both content-safe by default:

- **Worker logs** (`wrangler tail benhickman-dev`): one line per tool call — name and ok flag
  only, never arguments or user text.
- **Langfuse tracing**: set `LANGFUSE_PUBLIC_KEY` + `LANGFUSE_SECRET_KEY` (and
  `LANGFUSE_BASE_URL` if not Cloud US) to record full traces — the question, each provider
  round (messages, output, latency, degraded flag), each tool call (args + result), and the
  final answer. Sessions are grouped by a salted hash of the session id; the raw session
  cookie value and client IPs are never sent. Blank keys = tracing off; Langfuse errors are
  logged and never affect an answer. Traces exist only for asks that passed every gate —
  rejected requests are never recorded.

## Provider behavior

Nemotron requires alternating user/assistant messages with an optional system message first. The
session store only persists completed pairs, and the new user turn is always last. Requests use
NVIDIA's recommended `temperature: 1` and `top_p: 0.95`, stream with SSE, and cap output at 600
tokens. Thinking is disabled by default for lower latency; `LLM_ENABLE_THINKING=true` enables low
reasoning effort with a 2,048-token reasoning budget.

The prompt is grounded only in the verified project data in `src/data/projects.ts`. It instructs
the model not to invent ownership, metrics, employers, or project maturity.

## Limits and diagnostics

- Per IP: 40 live turns per day.
- Global: 500 live turns per day.
- History: six exchanges, retained for 24 hours.
- User input: 500 characters.
- Provider timeout: 60 seconds.

The UI shows the server's actual safe error message instead of collapsing every failure into a
network error:

- `403`: Turnstile token missing, expired, mismatched, or invalid.
- `429`: local/global chat limit or upstream provider rate limit.
- `503`: chat verification/provider is not configured.
- SSE `error`: provider rejection, timeout, empty response, or interrupted stream.

Locally, server logs print to the `npm run dev` / `npm run preview` terminal while you reproduce an
issue; in production use `npx wrangler tail` (or the dashboard's Workers Logs). Server logs include
provider status and Turnstile error codes, but never credentials or tokens.

## Primary references

- [Cloudflare: embed and execute Turnstile](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/)
- [Cloudflare: validate tokens](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Cloudflare: official test keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/)
- [NVIDIA: Nemotron 3 Super model](https://docs.api.nvidia.com/nim/reference/nvidia-nemotron-3-super-120b-a12b)
- [NVIDIA: chat-completions API](https://docs.api.nvidia.com/nim/reference/nvidia-nemotron-3-super-120b-a12b-infer)
- [Astro Cloudflare sessions](https://docs.astro.build/en/guides/integrations-guide/cloudflare/#sessions)
