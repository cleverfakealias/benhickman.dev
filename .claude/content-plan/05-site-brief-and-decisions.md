# Site Brief & Decisions — benhickman.dev refresh

This file reconciles the verified content packet (`00`–`04`), the **ZennLogic "Obsidian Foundry"
design system** (Claude Design project `5406087f-8b93-4219-9f6d-fc73b049a436`), and the strategic
decisions Ben made on **2026-06-26**. It is the build spec the homepage (and later pages) follow.

## Locked decisions (2026-06-26)

| # | Decision | Choice |
|---|---|---|
| Name | Display identity | **Ben Hickman**; benhickman.dev is the canonical hub (zennlogic.com / zengineer.cloud point back). |
| A | Hero lead | **Agentic, backed by full-stack depth.** Marquee = enterprise-grade agentic engineering; immediate proof = "I train the models, right-size them, and ship the agents that run on them." |
| B | Audience / conversion | **Balance, peers-led.** Proof-of-work for engineers first; "open to senior AI roles" explicit and one-click. |
| C | Primary CTA | **⌘K "chat with my work"** as the signature interaction (ship projects-led first, swap the real agent in when its backend exists). Secondary CTA = "See the work". |
| Avail | Availability | **Open to senior AI roles + select consulting · remote.** |
| Contact | Contact path | **Contact form only** (keep Formspree + hCaptcha; no public email). |
| Social | Featured profiles | GitHub · LinkedIn · X · YouTube. Real URLs: `https://github.benhickman.dev`, `https://linkedin.benhickman.dev`. X/YouTube URLs TBD. |
| Ent | Enterprise disclosure | **Describe the work, do NOT name internal systems.** Public copy: "built AI agents and RAG/retrieval into an enterprise SaaS platform." No "Max" / no employer name. |

## Voice (from design system + packet)

Direct, technical, engineer-to-engineer. Verbs: **ship · wire · build · scale · train · fine-tune ·
right-size · route · checkpoint**. Banned: leverage, seamless, robust, empower, transform, cutting-edge,
revolutionary, "AI-powered". Italic-serif emphasis on the verb in display headlines. Lowercase
`// comment-style` eyebrows. `●` status dots (Persimmon = live, Wasabi = ok).

## Homepage section spec (v1)

1. **Floating nav pill** — ◉ logo · Work / Writing / About / Contact · ⌘K trigger.
2. **Hero** — eyebrow `// agentic engineering`; clickable **⌘K bar above the H1**; H1 *"Agents that ship,
   built from the model up."* (italic "ship"); lede naming agentic depth → model layer; availability dot row;
   secondary button "See the work →".
3. **Proof strip** (3 cols, 1px dividers, no fake numbers — all verified qualitative):
   - Enterprise AI in production — agents + RAG inside a SaaS platform
   - A streaming Cmd-K AI command bar shipped at the edge (zennlogic.com, Astro on Cloudflare)
   - Builds the full local-model loop — from-scratch GPT, QLoRA fine-tune, GGUF export
4. **Featured work bento** (asymmetric, ALL verified Ben's per `06`): `zenn_ai` [2×2 flagship], `ZenMind` [1×2],
   `model-training` [1×2, framed as "built" not "trained"], `token-counter` [1×1], `zennlogic.com` [1×1, real "shipped" badge]. REMOVED: `llmfit` (not his), `agent-spec-lab` (broken). Framings from `06` + `02`.
5. **Stack band** — AI/ML · Languages · Web/Infra rows (from positioning §9).
6. **Writing** — 3 teasers from the blog backlog (`03`): train-from-scratch, agent-with-guardrails, RAG-that-retrieves. Marked upcoming.
7. **Contact CTA** — *"Ready to build agents that think?"* → "Start a conversation" (form). Socials row.
8. **Footer** — © 2026 Ben Hickman · built in an IDE.

## Open data gaps (Ben to supply — placeholdered in mockup, not invented)

- [ ] X / Twitter + YouTube URLs (GitHub & LinkedIn are wired from the existing site).
- [ ] Any **shareable** quantified impact (only numbers Ben can stand behind / is allowed to share).
- [ ] Final wording check on the enterprise sentence before it goes live (IP/comms).

## Build path

Obsidian Foundry reskin of the existing `ui/` pages **+** populate Sanity (`project` / `homePage` /
`timelineItem` docs — the in-flight `2026-06-22-sanity-content-infrastructure` intent). Per-page open
intents in `.agents/intents/open/` carry the how; this brief carries the what.
