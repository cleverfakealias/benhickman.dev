# Project Briefs (verified) — for website showcase

> ⚠️ **2026-06-26 ownership + claim audit — [`06-verification-and-ownership-corrections.md`](06-verification-and-ownership-corrections.md) is the AUTHORITATIVE override.**
> Verified via git remote/authorship + a per-repo source audit. Key overrides: **`llmfit` is NOT Ben's** (origin `AlexsJones/llmfit`) — remove everywhere; **`agent-spec-lab` does not import/run as committed** (missing modules); **`model-training` has no proven training run** (say "built", not "trained"). `claw-code`, `skills`, `path-of-zenn`/PoB, `luajit` are also third-party clones, not Ben's.

Each brief is verified against the actual repo (config files + source) as of **2026-06-26**, not the older
`PROJECTS.md`. Use the **Portfolio tier** to decide placement:

- **Hero** — lead the Work section; deserves a full project page.
- **Featured** — strong card on the projects grid; short detail page.
- **Supporting** — listed in a "more work" grid or résumé, light detail.
- **Omit / private** — scaffold, WIP, or not worth public display yet.

A one-line **"Site framing"** is included for each — copy seed for a card.

---

## AI / ML projects

### zenn_ai — Agentic Twitch assistant with local LLM + MCP sidecar  **[Hero]**
**What it is:** A production-grade Node/TypeScript + Python monorepo: an AI Twitch bot with tool-calling
orchestration, per-channel RAG, an MCP sidecar that decodes Path of Building game data, and an OBS overlay.
**Stack (verified):** React 19 + Vite + Framer Motion (overlay); Node 20+ TypeScript, pnpm workspace, libsql
(SQLite); Python 3.13 + uv MCP stdio sidecar; OpenAI-compatible / LM Studio local LLM; local embeddings
(nomic-embed-text). Deployed to Proxmox LXC with systemd, Caddy reverse proxy, SQLite backups.
**Why it's impressive:** Tool-calling LLM pipeline with a **defensive prose fallback** for weaker models;
**per-tier permission gates** (viewer/vip/mod/broadcaster) on tools; **MCP sidecar** spawned over stdio exposing
nine read-only tools; per-channel **vector search** with dedup on `(message.id, requestId)`; managed local-model
lifecycle (`lms server start/load/stop`) with external-API fallback; responsible-use API posture (rate limiting,
conditional requests, cache TTLs). Real-time Twitch EventSub + Helix, optional Discord relay, 12-step setup wizard
storing secrets in the OS keychain.
**Maturity:** Production; deployed with a runbook.
**Site framing:** *"A production AI agent: tool-calling, permission tiers, a local LLM, and an MCP sidecar — running 24/7."*

### model-training — Train from scratch + QLoRA fine-tuning lab  **[Hero]**
**What it is:** A two-track local model-development lab: (1) a char-level GPT built from scratch (nanoGPT-style,
heavily commented) and (2) Unsloth **QLoRA fine-tuning** on a personal Obsidian vault, with synthetic Q&A SFT
generation from a local teacher model and **GGUF export** for local inference.
**Stack (verified):** Python 3.12 via uv, WSL2 Ubuntu 24.04, PyTorch 2.7+ (cu128), Unsloth, TRL, PEFT, accelerate,
datasets. Target GPU: NVIDIA RTX 5070 Ti (Blackwell sm_120, native bf16).
**Why it's impressive:** Demonstrates the *whole* local-model loop — data prep → train → eval → quantized export →
local inference. Track 1 proves first-principles understanding (attention, blocks, LR schedule, bf16 autocast,
grad clipping, best-model checkpointing). Track 2 shows **domain adaptation** (continued pretraining) and
**LLM-as-teacher** synthetic data generation. Privacy-first: personal notes never leave the machine.
**Maturity:** Working prototype with runbooks per track.
**Site framing:** *"I trained a transformer from scratch, then fine-tuned a real model on my own notes — and ran it locally."*

### llmfit — Hardware-aware model right-sizing tool (Rust)  **[❌ NOT BEN'S — REMOVE]**
> **Ownership correction (2026-06-26):** git origin is `AlexsJones/llmfit`; 100% of commits are by Alex Jones. It is a clone in Ben's workspace, **not his work** — do not feature it anywhere. Original (incorrect) brief retained below only for the record.
**What it is:** A Rust CLI/TUI (plus REST API and web dashboard) that detects your hardware and scores 200+ models
across quality, speed, fit, and context to tell you exactly which model and quantization will run well on your machine.
**Stack (verified):** Rust workspace (core + TUI + desktop), sysinfo (hardware), Ratatui/Crossterm (TUI), ureq,
serde. 206 models baked in at compile time. **Distributed via Scoop (Windows) and Homebrew/MacPorts (macOS).**
**Why it's impressive:** Multi-dimensional scoring; **dynamic quantization** selection (best quality that fits);
**MoE expert-offloading** awareness (Mixtral/DeepSeek — only active experts use VRAM); bandwidth-based **speed
estimation** validated against llama.cpp; hardware **simulation** to test fit on other machines; runtime integration
with Ollama, llama.cpp, MLX, LM Studio, Docker Model Runner; signed Windows binaries via SignPath.
**Maturity:** Shipped, mature, package-manager distributed — the strongest "this is a real product" proof in the portfolio.
**Site framing:** *"A shipped Rust tool that right-sizes LLMs to your hardware — install it from Scoop or Homebrew."*

### ZenMind — Local-first Obsidian RAG assistant (full-stack)  **[Featured / Hero]**
**What it is:** A polished full-stack assistant for an Obsidian vault: conversational, citation-backed retrieval
over your personal knowledge base, runnable entirely with local models.
**Stack (verified):** Python 3.13 FastAPI + LangGraph + LangChain; ChromaDB or Postgres/pgvector; React 19 + Vite +
Tailwind frontend; sentence-transformers (BAAI/bge-m3, 1024-dim, multilingual); uv + pnpm.
**Why it's impressive:** Multi-node graph (reformulate → retrieve → assess_confidence → answer → fallback);
**SSE streaming** with token/node/citation events; multi-knowledge-base collections with runtime switching;
swappable embedding model with re-indexing; setup wizard with endpoint probing; mypy strict + 12+ test files.
**Maturity:** Polished, production-ready architecture.
**Site framing:** *"Chat with your own notes — local-first RAG with citation streaming and confidence gating."*

### agent-spec-lab — Spec-driven multi-node LangGraph agent  **[Featured]**
**What it is:** A LangGraph FAQ agent that retrieves from a markdown knowledge base and answers with citations,
built to show spec-driven agent design and observability.
**Stack (verified):** Python 3.13, LangGraph, LangChain-core, OpenAI, Pydantic, LangSmith.
**Why it's impressive:** Beyond retrieve→answer, it adds a **confidence-assessment node** (ambiguous / off-topic /
insufficient-context), a **fallback** node, and a **question-reformulation** node; typed `AgentState` with
correlation/trace IDs; **LangSmith tracing**; 10+ tests + GitHub Actions CI (ruff, mypy, pytest).
**Maturity:** Polished prototype with CI.
**Site framing:** *"An agent that knows when it doesn't know — confidence gating, reformulation, and fallback nodes."*

### langchain-rag-app — Multi-model local RAG with quantization  **[Featured]**
**What it is:** A Streamlit RAG app for document Q&A using free/local HuggingFace models, with tunable retrieval
and quantization.
**Stack (verified):** Python, LangChain, Streamlit, Transformers, torch, sentence-transformers, ChromaDB + FAISS,
**BitsAndBytes 8-bit quantization**.
**Why it's impressive:** **Hybrid retrieval** (semantic + keyword, tunable MMR lambda); **model presets** with
documented RAM needs (Phi-2 3GB → Mixtral 16GB); device detection (CPU/GPU/MPS); no API keys required. A clear
"optimize for the constraint" story (memory/quality trade-offs).
**Maturity:** Working prototype (lighter CI).
**Site framing:** *"RAG that runs on your own GPU — 8-bit quantization, hybrid retrieval, swappable local models."*

### java-spring-ai — Enterprise-flavored RAG in Java/Spring AI  **[Featured / Supporting]**
**What it is:** A Spring Boot service using Spring AI + pgvector for document ingestion and semantic search with
citation extraction — the "RAG, but in the enterprise stack" piece.
**Stack (verified):** Java 25, Spring Boot 3.3, Spring AI 1.0.0-M6, PostgreSQL/pgvector, Gradle (Kotlin DSL),
JUnit 5 + Testcontainers + Jacoco.
**Why it's impressive:** Shows RAG competence in a **JVM/enterprise** context (where his day job lives): typed
request/response/citation models, Testcontainers integration tests, coverage reporting. Good résumé bridge to the
SPS Commerce work.
**Maturity:** Minimal but clean starter.
**Site framing:** *"RAG in the enterprise stack — Spring AI + pgvector with real integration tests."*

### zennlogic_ai — Composable RAG / service framework  **[Supporting]**
**What it is:** A modular Python framework for assembling RAG + chat services from optional components (API,
LangChain/LangGraph, vector backends, AWS, MCP).
**Stack (verified):** Python 3.12+, FastAPI (optional), structlog, FAISS/Annoy via factory pattern, sentence-
transformers, boto3/SSM, MCP stub; mypy strict + ruff.
**Why it's impressive:** **Install-only-what-you-use** extras; pluggable **vector-backend abstraction** (FAISS vs
Annoy); MCP server framework; AWS-native (S3, SSM Parameter Store); structured logging. Reads like the foundation
for productionizing the other RAG demos.
**Maturity:** Framework/library; test coverage unclear.
**Site framing:** *"The reusable skeleton behind my RAG services — composable, typed, AWS-native."*

### agents — Cross-tool agentic dev scaffold  **[Supporting]**
**What it is:** A reusable scaffold that wires formatting, testing, linting, and security policy across Claude Code,
Cursor, Copilot, and other agent tools via hooks and allowlists.
**Stack (verified):** Node `.mjs` hooks; ruff/biome/stylua+selene; pytest/vitest/busted; `AGENTS.md` cross-tool
contract; OS sandbox + network/domain allowlists.
**Why it's impressive:** Layered security (deny rules → guard hooks → OS sandbox); **spec-gate nudge**; self-disabling
hooks; secret-aware worktree auto-cleanup. Signals maturity about *how* he works with agents safely.
**Maturity:** Polished scaffold.
**Site framing:** *"How I run AI coding agents safely — hooks, allowlists, and a cross-tool contract."*

### token-counter — Claude Code usage/cost analytics  **[Supporting]**
**What it is:** A stdlib-only Python CLI + local web dashboard that parses Claude Code transcripts and computes
API-equivalent cost per model/day/project, including cache-read/write economics.
**Stack (verified):** Python 3.11+, no external deps; localhost dashboard with incremental cache.
**Why it's impressive:** Real grasp of **LLM cost models** (cache-read 0.1x, cache-write 1.25–2x), transcript
dedup, plan-value comparison. Pairs well with the "I optimize for cost" value prop.
**Maturity:** Polished personal utility.
**Site framing:** *"I instrument my own AI usage — a cost dashboard built from raw transcripts."*

### ai-gateway — Multi-provider MCP gateway  **[Supporting / WIP]**
**What it is:** An early MCP stdio server to expose OpenAI + Gemini through one connection for Claude clients.
**Stack (verified):** Python 3.13 + uv, mcp ≥1.27 / FastMCP, pydantic-settings.
**Maturity:** Early scaffold — ping works; chat/image + HTTP transport planned. *Mention only as "in progress."*

### claw-code — Clean-room agent-harness study  **[Omit publicly / blog material]**
**What it is:** A Python (and Rust-branch) reimplementation study of an agent harness, with an essay on the legal/
ethical line of AI reimplementation.
**Maturity:** Early WIP. **Recommendation:** don't feature as a product; the essay could be a *blog post* instead.

### real-estate-skip-tracer — **[Omit]** scaffold only, no implementation.
### skills — third-party skill collection (not Ben's authored work) — **[Omit]** as a portfolio piece.

---

## Web / front-end projects

### benhickman.dev — Multi-domain portfolio platform  **[This IS the site — Hero/meta]**
**What it is:** The portfolio platform itself: a Sanity v4 headless CMS (`studio/`) + React 19 / Vite / TypeScript /
MUI 6 frontend (`ui/`) serving three domains (benhickman.dev, zengineer.cloud, zennlogic.com) from one codebase.
**Stack (verified):** Sanity v4.17, React 19.1, Vite 6, TS 5.6, MUI 6.1, React Router 6, Monaco editor, Jest 30 +
Storybook 9 + Testing Library, ESLint 9 / Prettier.
**Key facts for the builder:** Multi-domain branding via `ui/src/config/domainConfig.ts` (domain-aware SEO meta,
OG/Twitter, JSON-LD). **Sanity schema types already exist:** `post` (title, slug, author ref, categories,
mainImage w/ hotspot, blockContent body, publishedAt, status draft/in_review/published), `author`, `category`,
`project`, `timelineItem`, `snippet`, `homePage` (org-aware singleton: hero + content-section modules, 1-hero
validation), `siteSettings`, `blockContent`. Posts and home pages carry an `organizationId` for multi-tenant
separation. Existing pages: Home, Blog, BlogPostDetail, Contact, DevelopmentExperience, Playground, PrivacyPolicy;
`ConsentProvider` for cookie consent; `useTheme` light/dark.
**Maturity:** Polished/deployed shell — **schema is ready; content needs populating.** This is exactly where the
next agent writes posts/projects/home modules.

### zennlogic.com — Astro SSR brand site with AI command bar + 3D game  **[Featured — best web showpiece]**
**What it is:** An Astro 6 SSR site on Cloudflare Workers with a Sanity blog, a YouTube feed, an **AI command bar**
(OpenRouter streaming), and an interactive React Three Fiber game easter egg.
**Stack (verified):** Astro 6.4 (Cloudflare adapter), React 19 islands, R3F 9.6 + Drei + Three 0.184, Sanity 7.23,
OpenRouter streaming, YouTube Data v3, Cloudflare Turnstile, Vitest. Full pre-push gate (format/typecheck/lint/test/
build/CSP) via git hooks; dynamic OG image generation; RSS/sitemap.
**Why it's impressive:** Edge SSR, an **AI-powered command bar** (ties the "AI everywhere" story into the web work),
a full Three.js game with Zustand state, and unusually rigorous quality gates.
**Maturity:** Polished/deployed with rich content.
**Site framing:** *"Edge-rendered, with an AI command bar and a hidden 3D game — my most ambitious front-end."*

### zengineer.cloud — Next.js marketing site with 3D backdrop  **[Featured]**
**What it is:** A Next.js 16 (Turbopack) marketing + blog site with a route-aware WebGL/React Three Fiber backdrop
and Sanity Portable Text blog.
**Stack (verified):** Next.js 16.0.7, MUI v7.3, React 19, R3F 9.5 + Drei + Three 0.183, Framer Motion, Sanity 7.12,
Zod, Jest + jest-axe + Playwright E2E.
**Why it's impressive:** Three distinct 3D scenes by route, lazy-loaded and **respecting `prefers-reduced-motion`**;
accessibility testing (jest-axe); full E2E. Strong "polished, accessible, animated" web craft proof.
**Maturity:** Polished/deployed.
**Site framing:** *"Animated, accessible, edge-fast marketing — Next.js + React Three Fiber done right."*

### zendev.pro — Next.js + Chakra portfolio  **[Supporting / WIP]**
**What it is:** A Next.js 16 + Chakra UI v3 + Sanity site.
**Stack (verified):** Next.js 16.1, Chakra UI 3.31, React 19, Framer Motion, Sanity client 7.14.
**Maturity:** Scaffold/bootstrap — minimal content. **Recommendation:** list only if it adds breadth; otherwise hold.

---

## Quick prioritization cheat-sheet

| Tier | AI/ML | Web |
|---|---|---|
| **Hero** | zenn_ai, model-training, llmfit | benhickman.dev (the platform itself) |
| **Featured** | ZenMind, agent-spec-lab, langchain-rag-app, java-spring-ai | zennlogic.com, zengineer.cloud |
| **Supporting** | zennlogic_ai, agents, token-counter | zendev.pro |
| **WIP / omit** | ai-gateway, claw-code, real-estate-skip-tracer, skills | — |
