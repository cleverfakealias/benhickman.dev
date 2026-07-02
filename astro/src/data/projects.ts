/**
 * Work / projects — the VERIFIED-ONLY set, sourced inline from the content-plan
 * verification packet (`.claude/content-plan/02` + `06`) until Sanity `project`
 * docs are populated. Every framing here respects the packet's corrections.
 *
 * NEVER add: llmfit (not Ben's), agent-spec-lab (broken as committed),
 * zennlogic_ai (stub over-claims), claw-code/skills/path-of-zenn/luajit (not
 * Ben's). java-spring-ai is included but DOWNGRADED to prototype.
 */

export type Tier = 'hero' | 'featured' | 'supporting';
export type Group = 'Agents' | 'RAG / Retrieval' | 'Model Development' | 'Web';
export type Maturity = 'shipped' | 'deployed' | 'polished prototype' | 'working prototype' | 'scaffold';

export interface ProjectDetailSection {
  heading: string;
  body: string;
}

export interface Project {
  slug: string;
  name: string;
  group: Group;
  tier: Tier;
  maturity: Maturity;
  /** One-line card summary. */
  summary: string;
  tags: string[];
  /** Longer card/description paragraph. */
  description: string;
  /** Hero/featured projects get a detail page; supporting list inline only. */
  detail?: ProjectDetailSection[];
}

export const projects: Project[] = [
  {
    slug: 'zenn-ai',
    name: 'zenn_ai',
    group: 'Agents',
    tier: 'hero',
    maturity: 'deployed',
    summary: 'A production AI agent — tool-calling, permission tiers, a local LLM, and an MCP sidecar.',
    tags: ['TypeScript', 'Python', 'LangGraph', 'MCP', 'local LLM'],
    description:
      'A production-grade Node/TypeScript + Python monorepo: an agentic Twitch assistant with tool-calling orchestration, per-channel RAG, a stdio MCP sidecar, and an OBS overlay — with hardened Proxmox/systemd deploy tooling and an operator runbook.',
    detail: [
      {
        heading: 'The problem',
        body: 'A real-time chat agent has to call tools safely under load: untrusted users, weaker local models, and rate-limited upstream APIs. It needs guardrails, not just prompts.',
      },
      {
        heading: 'Architecture',
        body: 'A LangGraph tool-calling pipeline with a defensive prose fallback for weaker models; per-tier permission gates (viewer / vip / mod / broadcaster) on every tool; a Python MCP sidecar spawned over stdio exposing read-only tools; per-channel vector search with dedup; and a managed local-model lifecycle (LM Studio) with external-API fallback.',
      },
      {
        heading: 'Interesting optimization',
        body: 'Permission-checked tool execution plus a confidence/prose fallback means the agent degrades gracefully on a small local model instead of hallucinating tool calls — rate limiting, conditional requests, and cache TTLs keep it inside upstream quotas.',
      },
      {
        heading: 'What shipped',
        body: 'Real-time Twitch EventSub + Helix integration, an optional Discord relay, a 12-step setup wizard, and deploy tooling for Proxmox LXC — systemd units, a backup timer, and Caddy TLS, with an operator runbook.',
      },
    ],
  },
  {
    slug: 'model-training',
    name: 'model-training',
    group: 'Model Development',
    tier: 'hero',
    maturity: 'working prototype',
    summary: 'Built a transformer from scratch and a QLoRA fine-tuning track, with GGUF export for local inference.',
    tags: ['PyTorch', 'Unsloth', 'QLoRA', 'GGUF'],
    description:
      'A two-track local model-development lab: a char-level GPT built from scratch (nanoGPT-style, heavily commented) and an Unsloth QLoRA fine-tuning track on a personal Obsidian vault, with synthetic Q&A generation from a local teacher model and GGUF export for local inference.',
    detail: [
      {
        heading: 'The problem',
        body: 'Understanding models means building them — both the architecture from first principles and the practical fine-tuning loop that adapts an instruct model to your own data, privately.',
      },
      {
        heading: 'Architecture',
        body: 'Track 1 implements attention, transformer blocks, an LR schedule, bf16 autocast, gradient clipping, and best-model checkpointing from scratch in PyTorch. Track 2 wires Unsloth QLoRA fine-tuning with LLM-as-teacher synthetic SFT data, targeting native bf16 on Blackwell-class hardware.',
      },
      {
        heading: 'What it demonstrates',
        body: 'The whole local-model loop — data prep → train → eval → quantized GGUF export → local inference — kept privacy-first so personal notes never leave the machine. (Code is implemented; training runs and artifacts are run locally, not committed.)',
      },
    ],
  },
  {
    slug: 'zennlogic-com',
    name: 'zennlogic.com',
    group: 'Web',
    tier: 'hero',
    maturity: 'shipped',
    summary: 'Edge-rendered Astro site on Cloudflare Workers with a streaming AI command bar.',
    tags: ['Astro', 'Cloudflare', 'OpenRouter', 'SSE', 'R3F'],
    description:
      'An Astro SSR site on Cloudflare Workers with a Sanity blog, a YouTube feed, an AI command bar that streams answers from OpenRouter (tool-calling, per-IP quota, Turnstile, KV caching), and an interactive React Three Fiber game easter egg — behind a full pre-push quality gate.',
    detail: [
      {
        heading: 'The problem',
        body: 'A brand site that proves edge-AI chops: server-rendered at the edge, fast, and interactive — with an AI command bar that actually streams.',
      },
      {
        heading: 'Architecture',
        body: 'Astro SSR on the Cloudflare adapter with React 19 islands; a Cmd-K command bar that streams from OpenRouter with tool-calling, per-IP quota, Turnstile verification, and KV caching; dynamic OG image generation; RSS + sitemap; and a full Three.js / R3F game with Zustand state.',
      },
      {
        heading: 'What shipped',
        body: 'Live on Cloudflare with an unusually rigorous gate — format, typecheck, lint, test, build, and CSP all run on pre-push. This rebuild of benhickman.dev follows the same edge pattern.',
      },
    ],
  },
  {
    slug: 'zenmind',
    name: 'ZenMind',
    group: 'RAG / Retrieval',
    tier: 'featured',
    maturity: 'polished prototype',
    summary: 'Local-first RAG over an Obsidian vault with citation streaming and confidence gating.',
    tags: ['FastAPI', 'LangGraph', 'pgvector', 'bge-m3', 'BM25+RRF'],
    description:
      'A polished full-stack assistant for an Obsidian vault: conversational, citation-backed retrieval over a personal knowledge base. A CRAG-lite graph runs a corrective HyDE re-retrieval when confidence is low, with hybrid BM25 + RRF retrieval and a cross-encoder reranker. SSE streams token / node / citation events.',
    detail: [
      {
        heading: 'Architecture',
        body: 'A multi-node graph (reformulate → retrieve → assess confidence → answer → fallback) over ChromaDB or Postgres/pgvector, with bge-m3 embeddings, multi-knowledge-base collections with runtime switching, and a swappable embedding model with re-indexing. FastAPI + LangGraph backend, React 19 + Vite frontend, mypy strict.',
      },
    ],
  },
  {
    slug: 'token-counter',
    name: 'token-counter',
    group: 'Model Development',
    tier: 'featured',
    maturity: 'polished prototype',
    summary: 'Prices my Claude Code usage at API rates from raw transcripts — full prompt-cache economics.',
    tags: ['Python', 'zero-deps', 'cost analytics'],
    description:
      'A stdlib-only Python CLI + local web dashboard that parses Claude Code transcripts and estimates API-equivalent cost per model / day / project, including cache-read and cache-write economics, with transcript dedup and a plan-value comparison.',
    detail: [
      {
        heading: 'What it does',
        body: 'Models real LLM cost (cache-read 0.1×, cache-write 1.25–2×) from pre-recorded usage — an estimate, not a bill, against a pinned pricing snapshot. A local single-user tool that pairs with the "optimize for cost" thesis.',
      },
    ],
  },
  {
    slug: 'langchain-rag-app',
    name: 'langchain-rag-app',
    group: 'RAG / Retrieval',
    tier: 'supporting',
    maturity: 'working prototype',
    summary: 'RAG on your own GPU — 8-bit quantization, swappable local HuggingFace models.',
    tags: ['Python', 'LangChain', 'Streamlit', 'ChromaDB', 'FAISS'],
    description:
      'A Streamlit RAG app for document Q&A using free/local HuggingFace models, with tunable retrieval and 8-bit (BitsAndBytes) quantization. (Similarity search drives answers; the MMR/hybrid path is implemented but not yet wired into the main chain.)',
  },
  {
    slug: 'agents',
    name: 'agents',
    group: 'Agents',
    tier: 'supporting',
    maturity: 'polished prototype',
    summary: 'How I run AI coding agents safely — hooks, allowlists, and a cross-tool contract.',
    tags: ['Node', '.mjs hooks', 'AGENTS.md', 'allowlists'],
    description:
      'A reusable scaffold that wires formatting, testing, linting, and security policy across agent tools via Node hooks and allowlists, with an AGENTS.md cross-tool contract. (Claude Code runs the hooks; other tools consume the contract.)',
  },
  {
    slug: 'exile-view',
    name: 'exile-view',
    group: 'Web',
    tier: 'supporting',
    maturity: 'working prototype',
    summary: 'A Twitch Extension for PoE2 builds — Cloudflare Worker + D1 + R2 + PubSub.',
    tags: ['TypeScript', 'Cloudflare', 'D1', 'R2', 'PubSub'],
    description:
      'A TypeScript Twitch Extension for Path of Exile 2: a Cloudflare Worker EBS with D1, R2 item icons, and PubSub — streamers paste builds, viewers see them live. ~8k LOC, 173 tests. Deployment-ready and audited for review.',
  },
  {
    slug: 'java-spring-ai',
    name: 'java-spring-ai',
    group: 'RAG / Retrieval',
    tier: 'supporting',
    maturity: 'working prototype',
    summary: 'RAG in the enterprise stack — Spring AI + pgvector, a clean starter.',
    tags: ['Java', 'Spring AI', 'pgvector', 'Gradle'],
    description:
      'A Spring Boot service using Spring AI + pgvector for document ingestion and semantic search with citation extraction — the "RAG, but in the enterprise stack" piece. A clean, minimal milestone-version starter (Spring AI 1.0.0-M6).',
  },
  {
    slug: 'zengineer-cloud',
    name: 'zengineer.cloud',
    group: 'Web',
    tier: 'supporting',
    maturity: 'deployed',
    summary: 'Animated, accessible, edge-fast marketing — Next.js + React Three Fiber.',
    tags: ['Next.js', 'React 19', 'R3F', 'Sanity'],
    description:
      'A Next.js 16 (Turbopack) marketing + blog site with a route-aware WebGL / React Three Fiber backdrop (route-aware by color palette) and a Sanity Portable Text blog, with Jest + Playwright E2E coverage.',
  },
];

export const GROUP_ORDER: Group[] = ['Agents', 'RAG / Retrieval', 'Model Development', 'Web'];
const TIER_RANK: Record<Tier, number> = { hero: 0, featured: 1, supporting: 2 };

export function projectsByGroup(): { group: Group; items: Project[] }[] {
  return GROUP_ORDER.map((group) => ({
    group,
    items: projects
      .filter((p) => p.group === group)
      .sort((a, b) => TIER_RANK[a.tier] - TIER_RANK[b.tier]),
  })).filter((g) => g.items.length > 0);
}

export function getProjectsWithDetail(): Project[] {
  return projects.filter((p) => p.detail && p.detail.length > 0);
}
