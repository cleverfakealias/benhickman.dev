# Content & Blog Plan — benhickman.dev

This file turns the positioning into a concrete site structure and a writeable blog backlog. The Sanity schema
in `benhickman.dev/studio/` already supports `post`, `project`, `homePage` (hero + content modules),
`timelineItem`, `author`, `category`, and `snippet` — so most of this can be entered as content, not new code.

## 1. Recommended site sections

### Home
- **Hero:** headline (pick from `01-positioning-and-narrative.md` §7) + one-sentence subhead naming the three
  pillars (Build · Optimize · Ship) + two CTAs ("See the work" / "Read the writing").
- **Proof strip:** logos/labels — *Enterprise AI at SPS Commerce · Shipped a Rust tool on Scoop & Homebrew ·
  Trains & fine-tunes models locally.*
- **Featured work (3 cards):** zenn_ai, llmfit, ZenMind (or model-training). Each card = one-line framing from
  `02-project-briefs.md`.
- **Skills/stack band:** the scannable strip from positioning §9.
- **Latest writing (3 posts):** pulls from the blog.
- **Contact CTA.**

### Work / Projects
- Grid driven by the Sanity `project` type. Order by tier (Hero → Featured → Supporting).
- Each project card: name, one-line framing, stack tags, links (live/repo/post). Hero projects get a detail page
  with: problem → architecture → the interesting optimization → what shipped → what I'd do next.
- Group or filter by theme: **Agents · RAG/Retrieval · Model Development · Web.**

### Writing / Blog
- The engine of the "AI systems builder" brand. See the backlog in §3.
- Use `category` for: Agents, RAG, Local Models, Web, Engineering Notes.

### About
- The technical bio (positioning §8) + the enterprise↔personal framing line (positioning §6).
- Optional `timelineItem`-driven career timeline (the `DevelopmentExperience` page already exists in the UI).

### Now (optional, high-signal)
- A short "what I'm building this month" page. Cheap to maintain, signals momentum to hiring managers.

## 2. How to prioritize the showcase (do this first)

1. Populate **3 hero project pages**: `zenn_ai`, `llmfit`, `model-training` (or `ZenMind`). These carry the
   "depth across the whole stack" story.
2. Fill the **About** page with the bio + enterprise framing.
3. Publish **2 blog posts** (see §3 — start with #1 and #3). A portfolio with writing converts far better for
   senior/AI roles than one without.
4. Add **Featured** projects as cards (no full page needed yet).
5. Defer WIP items (ai-gateway, claw-code, zendev.pro).

## 3. Blog backlog — ready to draft this weekend

Each entry: working title · angle · why it lands · outline. Pick based on energy; #1 and #3 are the highest-ROI
openers because they showcase rare depth.

### 1. "I trained a transformer from scratch, then fine-tuned a real one on my own notes"
- **Angle:** The full local-model loop, from nanoGPT to QLoRA to GGUF, on consumer hardware (RTX 5070 Ti / Blackwell).
- **Why it lands:** Very few application engineers can credibly write this. Instant depth signal.
- **Outline:** Why bother training from scratch · the char-level model (attention/blocks/LR schedule in plain
  terms) · switching tracks to QLoRA on Obsidian notes · synthetic Q&A via a local teacher · exporting to GGUF and
  running it in LM Studio · what I learned about what fine-tuning can and can't fix.
- **Source:** `model-training` brief.

### 2. "Right-sizing LLMs to your hardware: what I learned building llmfit"
- **Angle:** The mental model for *which* model+quantization actually runs well on a given machine — quality vs.
  speed vs. fit vs. context, MoE expert offloading, bandwidth-based speed estimates.
- **Why it lands:** It's a shipped Rust tool (Scoop/Homebrew) — credibility + genuinely useful to readers.
- **Outline:** The problem (everyone guesses) · how scoring works · why quantization is a quality dial, not a
  switch · MoE: why only active experts cost VRAM · estimating tok/s from memory bandwidth · designing a TUI people
  actually use.
- **Source:** `llmfit` brief.

### 3. "Building an AI agent with guardrails: tools, permission tiers, and graceful fallback"
- **Angle:** What separates a real agent from a prompt — tool registries, per-tier permissions, confidence gating,
  fallback nodes, observability — drawn from zenn_ai + agent-spec-lab.
- **Why it lands:** Directly mirrors enterprise agent work (the "Max" story) without disclosing anything internal.
- **Outline:** "Agent" is doing a lot of work in that sentence · the tool registry + permission tiers · why a weak
  model needs a prose fallback path · confidence assessment: teaching an agent to say "I don't know" · tracing with
  LangSmith · deploying it to run 24/7 (Proxmox/systemd).
- **Source:** `zenn_ai`, `agent-spec-lab` briefs.

### 4. "RAG that actually retrieves: hybrid search, citations, and confidence gating"
- **Angle:** Practical retrieval quality — hybrid (semantic + keyword) retrieval, MMR tuning, citation-backed
  answers, and knowing when not to answer — across Python and Java/Spring.
- **Why it lands:** RAG is the most in-demand skill; showing it in *two* stacks (and pgvector) reads enterprise-ready.
- **Outline:** Naive RAG's failure modes · chunking + metadata · hybrid retrieval and MMR lambda · citation
  extraction · confidence/fallback so the bot doesn't hallucinate · the same pattern in Spring AI + pgvector.
- **Source:** `ZenMind`, `langchain-rag-app`, `java-spring-ai`, `agent-spec-lab` briefs.

### 5. "What my AI usage actually costs: instrumenting Claude Code from raw transcripts"
- **Angle:** LLM cost economics made concrete — cache-read vs. cache-write multipliers, dedup, plan-value framing —
  via the token-counter tool.
- **Why it lands:** "I optimize for cost" proof; relatable to anyone running agents at scale.
- **Outline:** Why token bills are confusing · parsing transcripts · the cache economics nobody explains ·
  building a localhost dashboard · what it changed about how I work.
- **Source:** `token-counter` brief.

### 6. "Local-first AI: running useful assistants without sending your data anywhere"
- **Angle:** The privacy/cost case for local models, and how ZenMind + LM Studio + quantization make it real.
- **Why it lands:** Broad appeal; ties together ZenMind, langchain-rag-app, model-training.
- **Outline:** Why local-first · picking a model that fits (link to llmfit) · embeddings locally (bge-m3) ·
  citation streaming UX · the honest trade-offs vs. frontier APIs.

### 7. (Optional / opinion) "Is legal the same as legitimate? Notes on AI reimplementation"
- **Angle:** Adapt the existing essay in `claw-code` into a thoughtful POV piece.
- **Why it lands:** Shows judgment and perspective, not just code. Good for the "thought leadership" dimension.
- **Caution:** Keep it principled and non-accusatory; it's a perspective piece.

### Web-craft posts (secondary, for breadth)
- **"An AI command bar at the edge: streaming OpenRouter responses in an Astro/Cloudflare site"** (zennlogic.com).
- **"Route-aware 3D backdrops that respect prefers-reduced-motion"** (zengineer.cloud) — accessible WebGL.

## 4. Suggested publishing order (4 weekends)

1. Post #1 (train-from-scratch) + populate zenn_ai & llmfit project pages + About.
2. Post #3 (agents) + ZenMind/model-training pages.
3. Post #4 (RAG) + Featured project cards + Now page.
4. Post #2 (llmfit) or #5 (cost) + web-craft post + polish.

## 5. Notes for the next agent (content entry)
- Most of this is **Sanity content**, not code: create `project` docs for the tiers in §1, `post` docs for §3,
  and `homePage` hero + modules for the Home section. Respect the `organizationId` field for benhickman.dev.
- Pull exact, verified stack tags from `02-project-briefs.md` — don't re-summarize from the stale `PROJECTS.md`.
- Before publishing any copy, read `04-accuracy-and-gaps.md` so claims stay defensible.
