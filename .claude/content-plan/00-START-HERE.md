# benhickman.dev — Website Content Plan (handoff packet)

**Purpose of this folder.** This is a research-and-positioning packet prepared by walking Ben Hickman's
`github_projects` workspace and verifying each project against its actual source and config files. It exists
to hand off to the next agent (or to Ben directly) who will build out the real website content for a full
refresh of **benhickman.dev**. Everything here is grounded in what's actually in the repos as of **2026-06-26**,
with stale/aspirational claims flagged.

**Top-line goal of the site refresh.** Make benhickman.dev read like the portfolio of someone who *builds
AI systems* — not just calls APIs, but designs agentic architectures, develops and fine-tunes local models,
builds RAG and retrieval pipelines, and optimizes them for quality, cost, and reliability. Secondary goal:
support a near-term job search for a higher-level, higher-paid AI engineering role. Audience is mixed
(technical reviewers + recruiters/clients), so content should be layered: accessible at the top, deep
underneath.

## How to use this packet

Read the files in order:

1. **`00-START-HERE.md`** — this file. Orientation + index.
2. **`01-positioning-and-narrative.md`** — the master story. Who Ben is, the through-line that ties the
   work together, value propositions, voice/tone, tagline and bio options, and how his enterprise work
   (SPS Commerce "Max" Agent, RAG pipelines, multimodal image+text embeddings) anchors the personal projects.
3. **`02-project-briefs.md`** — verified, showcase-ready briefs for every relevant AI and web project:
   what it is, the real tech stack, why it's impressive, and a recommended portfolio tier (Hero / Featured /
   Supporting / Omit).
4. **`03-content-and-blog-plan.md`** — recommended site sections (Home, Work/Projects, Writing, About, Now),
   how to prioritize the project showcase, and a ready-to-write blog backlog with titles, angles, and outlines
   — built for Ben to start drafting this weekend.
5. **`04-accuracy-and-gaps.md`** — guardrails. Corrections to the old `PROJECTS.md`, what is shipped vs.
   prototype vs. WIP, claims to avoid overstating, and honest gaps (e.g., true image-embedding code lives in
   the enterprise work, not these repos). Read this before writing any public copy.

## The 60-second version

Ben is an AI/ML engineer with **enterprise production experience** (building the "Max" Agent into the SPS
Commerce platform, RAG pipelines, multimodal image+text embedding & retrieval) plus an unusually deep
**personal portfolio that proves the same skills end-to-end**:

- **Agentic systems** — `zenn_ai` (a production tool-calling Twitch agent with an MCP sidecar, per-tier
  permissions, and local-LLM orchestration), `agent-spec-lab` (spec-driven multi-node LangGraph with
  confidence/fallback nodes), `agents` (a cross-tool agent scaffold).
- **Local model development** — `model-training` (GPT-from-scratch *and* QLoRA fine-tuning on a personal
  knowledge base, with GGUF export for local inference on a Blackwell GPU), `llmfit` (a **shipped** Rust tool,
  distributed via Scoop/Homebrew, that right-sizes models to hardware).
- **RAG & retrieval** — `ZenMind` (a polished local-first Obsidian assistant with citation streaming),
  `langchain-rag-app` (multi-model RAG with 8-bit quantization + hybrid retrieval), `java-spring-ai`
  (enterprise-flavored RAG in Java/Spring AI on pgvector), `zennlogic_ai` (a composable RAG framework).
- **Polished web craft** — four real front-ends (`benhickman.dev`, `zengineer.cloud`, `zennlogic.com`,
  `zendev.pro`) spanning React/Vite, Next.js, and Astro-on-Cloudflare, with 3D (React Three Fiber), an
  AI command bar, and rigorous CI/quality gates.

The narrative writes itself: *"I build, optimize, and ship AI systems — from training the model to deploying
the agent to shipping the front-end."* The rest of this packet turns that into concrete copy and a content plan.
