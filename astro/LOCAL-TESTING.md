# Local testing — full functionality before deploy

How to exercise the whole site locally, including the **live ⌘K LLM** (NVIDIA NIM)
and the **Turnstile-gated** contact/⌘K flows, without provisioning real Cloudflare
keys. Two secret files (both gitignored, both **owner-created** — the agent can't
write `.env*`/`.dev.vars`):

## 1. `astro/.env` — public, build-time-inlined values

```ini
# Cloudflare Turnstile official TEST site key (always passes, visible widget)
PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA

# Sanity already defaults to the real project (unh13egm/production) — only set
# these to override. PUBLIC_GA_MEASUREMENT_ID optional (leave blank = analytics off).
# PUBLIC_GA_MEASUREMENT_ID=
```

## 2. `astro/.dev.vars` — secrets, loaded by the Worker runtime in dev

```ini
# Cloudflare Turnstile official TEST secret (always passes)
TURNSTILE_SECRET=1x0000000000000000000000000000000AA

# NVIDIA NIM — get a free nvapi-… key at https://build.nvidia.com (1000 credits, 40 rpm)
LLM_API_KEY=nvapi-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# Defaults below are baked in; override only to change model/provider:
# LLM_BASE_URL=https://integrate.api.nvidia.com/v1
# LLM_MODEL=nvidia/nemotron-3-super-120b-a12b
# LLM_ENABLE_THINKING=false        # "true" = let the reasoning model think (slower)

# Contact delivery (optional — without these, a verified submit returns a 503
# "delivery not configured"; Turnstile verification still works):
# RESEND_API_KEY=...                # + CONTACT_TO=you@example.com  CONTACT_FROM=verified@yourdomain
# CONTACT_FORWARD_URL=...           # alt: server-side Formspree endpoint
```

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

> Note: `wrangler dev` resolves `.dev.vars` relative to the **config file's**
> directory. If `npm run preview` doesn't pick up `astro/.dev.vars`, copy it to
> `dist/server/.dev.vars` (gitignored, regenerated each build) or pass the vars
> with `--var`. `npm run dev` (astro dev) has no such caveat — prefer it for
> day-to-day testing.

## 4. What to test

| Flow | How | Expected |
|---|---|---|
| **Pages + nav** | click around / ⌘K → select | view-transition nav, correct active link |
| **⌘K search** | ⌘K, type "zenmind" | grouped results, arrow/Enter navigate |
| **⌘K ask (live LLM)** | ⌘K, type a question, Enter on the Ask row | invisible Turnstile passes (test key) → streamed answer from NVIDIA; "Thinking…" then tokens |
| **Contact** | fill the form, the Turnstile test widget auto-passes, submit | 200 if delivery configured, else 503 "not configured"; bad token → 403 |
| **Consent / analytics** | Accept / Reject / Cookie Preferences | banner hides, cookie set, gtag gated on consent |
| **Quota** | spam ⌘K ask | per-IP/global KV caps return 429 (local KV resets on restart) |

## Notes

- **No live LLM key?** Leave `LLM_API_KEY` unset — ⌘K ask falls back to the
  projects-led stub, and everything else still works.
- **KV** (`CMDK_KV`) runs locally via Miniflare under both dev servers; counters
  reset when the server restarts.
- Secrets never reach the client — `LLM_API_KEY`/`TURNSTILE_SECRET` are read only
  in the `/api/*` Worker endpoints via `cloudflare:workers`.
