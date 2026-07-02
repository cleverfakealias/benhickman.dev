# Accuracy & Gaps — read before writing public copy

> ⚠️ **2026-06-26 ownership + claim audit — [`06-verification-and-ownership-corrections.md`](06-verification-and-ownership-corrections.md) (authoritative).** Verified objectively via `git remote` + commit authorship and a per-repo source audit.
> **NOT Ben's (never feature):** `llmfit` (origin `AlexsJones/llmfit`), `claw-code` (`instructkr`), `skills` (`mattpocock`), `path-of-zenn`/`PathOfBuilding-PoE2` (PoB fork), `luajit` (Mike Pall).
> **Broken as committed:** `agent-spec-lab` (missing modules — doesn't import). **No proven run:** `model-training` (describe as "built", not "trained").

This packet's project briefs were verified against the actual repos on **2026-06-26**. The older
`github_projects/PROJECTS.md` is a useful index but is **partly stale and partly aspirational** — don't copy from
it directly. The goal of this file is to keep public claims defensible, because the primary technical audience
(hiring managers, senior engineers) punishes over-claiming.

## 1. Corrections to the old PROJECTS.md

- **benhickman.dev** is described there as "React 19 | Vite | Sanity." It actually also uses **MUI 6** and ships a
  Monaco editor, Storybook 9, and a multi-domain config. The README in the repo even mislabels MUI version — trust
  `package.json` (MUI **6.1**).
- **java-spring-ai**: PROJECTS.md says "Spring Boot 3.5"; the build is **Spring Boot 3.3** with **Spring AI
  1.0.0-M6** (a milestone release — note "M6", not GA). Don't claim GA Spring AI.
- **zennlogic.com**: PROJECTS.md calls it a "lightweight Astro static site." It's actually **Astro 6 SSR on
  Cloudflare Workers** with an AI command bar, a YouTube feed, and a React Three Fiber game — far more than a static
  site. Use the richer (accurate) description.
- **PROJECTS.md omits the strongest AI work entirely:** `zenn_ai`, `model-training`, `llmfit`, `ZenMind`,
  `zennlogic_ai`, `token-counter`, `agents`. These are the portfolio's best material — make sure they're included.

## 2. Maturity ladder (be honest about each)

- **Shipped / production:** `llmfit` (distributed via Scoop/Homebrew), `zenn_ai` (deployed on Proxmox/systemd,
  runbook), `zennlogic.com`, `zengineer.cloud`, `benhickman.dev` (the platform shell), `token-counter`.
- **Polished prototype (works, tested, not a "product"):** `ZenMind`, `agent-spec-lab`, `langchain-rag-app`,
  `model-training`, `agents`.
- **Minimal but clean:** `java-spring-ai` (a starter; don't imply a large production service).
- **Framework/library (not a standalone app):** `zennlogic_ai` (test coverage unclear — don't claim "fully tested").
- **Early WIP — do not feature as products:** `ai-gateway` (only a ping tool works), `claw-code` (porting study),
  `real-estate-skip-tracer` (scaffold only).
- **Not Ben's authored product:** `skills` (a third-party collection) — don't present it as his work.

Recommended phrasing pattern: lead with what's shipped, and label prototypes plainly ("a working prototype that…").
This reads as confident and credible, not modest.

## 3. The multimodal image+text claim — handle carefully

Ben's **multimodal image + text embedding & retrieval** experience is real but lives in the **enterprise SPS
Commerce work**, not in these public repos. The closest personal repo (`zenn_ai`) does sophisticated **structured**
multimodal parsing (decoding Path of Building JSON + `.pobb.in` build URLs into structured fields for retrieval) —
that's impressive, but it is **not image embeddings**.

Guidance:
- It's fine and accurate to list "multimodal image + text embeddings & retrieval" under **enterprise experience**.
- **Do not** imply a specific public GitHub repo demonstrates image embeddings. If a project page needs a multimodal
  example, use `zenn_ai`'s structured build-decoding and describe it precisely as structured data extraction +
  retrieval, not image embedding.

## 4. Enterprise details to confirm with Ben before publishing

These came from Ben's own description, not the repos — confirm exact wording/permissions before going public:
- The **"Max" agent** name, what it does, and how much can be said publicly (it's "built into the SPS Commerce
  platform"). Check employer comms/IP policy before naming internal systems or metrics.
- Any **quantified impact** (latency, accuracy, adoption) — only publish numbers Ben can stand behind and is allowed
  to share.
- Job title / dates / scope for the About + timeline.

## 5. Things to avoid in copy

- Don't restate the unverified PROJECTS.md tech versions; use `02-project-briefs.md`.
- Don't call milestone/prototype software "production-grade" unless it's in the shipped list above.
- Don't imply image-embedding repos exist publicly (see §3).
- Avoid empty superlatives ("revolutionary," "cutting-edge"); the specifics are stronger.
- For `claw-code`, keep any writing principled and non-accusatory (it touches reimplementation/copyleft debate).

## 6. Verification status of this packet

- Tech stacks, architectures, and maturity were read from repo config + source by exploration agents on 2026-06-26.
- Enterprise claims (SPS Commerce "Max," RAG, multimodal) are **from Ben** and were **not** independently verified
  here — flagged in §4.
- If anything in `02-project-briefs.md` will appear verbatim on the live site, do a quick re-check against the repo
  at publish time, since these are active projects that may have moved.
