# Local testing — full functionality before deploy

How to exercise the whole site locally, including the **live ⌘K LLM** (NVIDIA NIM),
the **Turnstile-gated** ⌘K flow, and the **hCaptcha + Formspree** contact form,
without provisioning real keys. Bootstrap both gitignored local files from the
committed safe templates:

```bash
npm run setup:local
```

The command creates missing or empty files and preserves any populated local configuration.

## 1. `astro/.env` — public, build-time-inlined values

```ini
# Official always-pass invisible Turnstile key for command-bar chat
PUBLIC_CMDK_TURNSTILE_SITE_KEY=1x00000000000000000000BB

# Contact form: hCaptcha official TEST site key (renders an always-passable
# widget) + your Formspree endpoint. Leave the URL blank to keep submits
# disabled locally — the form then shows "not configured" on submit.
PUBLIC_HCAPTCHA_SITEKEY=10000000-ffff-ffff-ffff-000000000001
PUBLIC_FORMSPREE_URL=

# Shared Sanity project used by the Studio and sibling sites.
PUBLIC_SANITY_PROJECT_ID=unh13egm
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2025-02-19

# Optional (leave blank = analytics off).
PUBLIC_GA_MEASUREMENT_ID=
```

## 2. `astro/.dev.vars` — secrets, loaded by the Worker runtime in dev

```ini
# Cloudflare Turnstile official TEST secret (always passes) — ⌘K chat only
CMDK_TURNSTILE_SECRET=1x0000000000000000000000000000000AA

# NVIDIA NIM — get a free nvapi-… key at https://build.nvidia.com (1000 credits, 40 rpm)
LLM_API_KEY=nvapi-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional: Langfuse chat tracing (leave blank = tracing off, chat unaffected)
# LANGFUSE_PUBLIC_KEY=pk-lf-...
# LANGFUSE_SECRET_KEY=sk-lf-...
# LANGFUSE_BASE_URL=https://us.cloud.langfuse.com
# Defaults below are baked in; override only to change model/provider:
# LLM_BASE_URL=https://integrate.api.nvidia.com/v1
# LLM_MODEL=nvidia/nemotron-3-super-120b-a12b
# LLM_ENABLE_THINKING=false        # "true" = let the reasoning model think (slower)
```

> The contact form needs no `.dev.vars` entries — it posts straight from the
> browser to Formspree (`PUBLIC_FORMSPREE_URL`), and Formspree verifies the
> hCaptcha token with the secret configured in its dashboard.

> Cloudflare's full set of Turnstile test keys (always-pass / always-block /
> force-interactive) is documented at
> developers.cloudflare.com → Turnstile → Testing.

## 3. Run it

```bash
cd astro
npm run dev      # astro dev — reads .env (PUBLIC_*) + .dev.vars (secrets) via the
                 # Cloudflare vite plugin; live ⌘K + Turnstile work. Fast iteration.
```

For a production-faithful pass on the real `workerd` runtime + the generated
config (KV, headers, the SSR/prerender split exactly as deployed):

```bash
npm run preview  # astro build && wrangler dev -c dist/server/wrangler.json
```

`npm run preview` passes `--env-file .dev.vars` explicitly, so the generated
`dist/server/wrangler.json` config still receives the root local bindings.

## 4. What to test

| Flow | How | Expected |
|---|---|---|
| **Pages + nav** | click around / ⌘K → select | view-transition nav, correct active link |
| **⌘K search** | ⌘K, type "zenmind" | grouped results, arrow/Enter navigate |
| **⌘K ask (live LLM)** | ⌘K, type a question, Enter on the Ask row | "Verifying you're human…" step in the pending bubble → streamed answer |
| **⌘K tools** | ask "what does the ZenMind project actually do?" | status line ("Looking up zenmind…") → answer grounded in project detail |
| **⌘K follow-up** | ask "Which project uses hybrid retrieval?", then "What does it use?" | second answer retains the first turn's context |
| **⌘K new chat** | select **New chat**, then ask an unrelated question | transcript and server-side session history are cleared |
| **Contact** | fill the form, pass the hCaptcha test widget, submit | success if `PUBLIC_FORMSPREE_URL` is set (delivers to Formspree), else "not configured" error |
| **Consent / analytics** | Accept / Reject / Cookie Preferences | banner hides, cookie set, gtag gated on consent |
| **Quota** | spam ⌘K ask | per-IP/global KV caps return 429 (local KV resets on restart) |

## Notes

- **No live LLM key?** Leave `LLM_API_KEY` unset — ⌘K ask falls back to the
  projects-led stub, and everything else still works.
- **KV** (`CMDK_KV`) runs locally via Miniflare under both dev servers; counters
  and stored chat history reset when local state is cleared. Chat retains six exchanges for 24h.
- Secrets never reach the client — `LLM_API_KEY`/`CMDK_TURNSTILE_SECRET` are read only
  in the `/api/*` Worker endpoints via `cloudflare:workers`.
