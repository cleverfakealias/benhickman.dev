/**
 * Home page content — the single source of copy for the Obsidian Foundry
 * homepage (design `home-v1`). Ported verbatim from the SPA's verified module;
 * only WORK_HREF / WRITING_HREF are re-pointed to the new Astro IA.
 *
 * Every project, proof point, and framing here is drawn from the AUTHORITATIVE
 * verification packet (`.claude/content-plan/06-verification-and-ownership-corrections.md`)
 * and the locked site brief (`05-site-brief-and-decisions.md`).
 *
 * Featured set is VERIFIED-ONLY: zenn_ai · ZenMind · model-training ·
 * token-counter · zennlogic.com. Never feature `llmfit` (not Ben's),
 * `agent-spec-lab` (broken as committed), `java-spring-ai` (downgraded to
 * prototype), or `zennlogic_ai` (stub over-claims).
 */

import { socialProfiles } from '@/config/socialLinks';

export const WORK_HREF = '/work';
export const WRITING_HREF = '/writing';
export const CONTACT_HREF = '/contact';

/** Placeholder shown in the hero ⌘K bar (the live agent ships in Phase 5). */
export const CMDK_PLACEHOLDER = 'ask my work anything — “how do you build agents with guardrails?”';

export interface ProofPoint {
  /** Lowercase mono kicker. */
  key: string;
  value: string;
}

/** Verified qualitative proof — no invented numbers (brief §3). */
export const proofPoints: ProofPoint[] = [
  {
    key: 'in production',
    value: 'Built AI agents + RAG retrieval into an enterprise SaaS platform.',
  },
  {
    key: 'shipped at the edge',
    value: 'A streaming Cmd-K AI command bar on Astro + Cloudflare Workers (zennlogic.com).',
  },
  {
    key: 'the full model loop',
    value: 'Builds it end to end — from-scratch GPT, QLoRA fine-tune, GGUF export.',
  },
];

export type BentoSpan = 'big' | 'tall' | 'small';

export interface FeaturedProject {
  name: string;
  description: string;
  tags: string[];
  span: BentoSpan;
  /** Decorative bento footprint annotation (e.g. "[2×2]"), aria-hidden. */
  spanTag?: string;
  /** Verified status badge — only zennlogic.com earns "shipped" (packet §C). */
  badge?: string;
  /** Animated agent-loop trace, flagship card only. */
  trace?: string[];
}

/**
 * Featured work bento — order drives grid placement (flagship 2×2, two tall
 * 1×2, two 1×1). Copy is the approved `home-v1` wording, already reconciled
 * with the packet's corrections (no "running 24/7", no "trained a model").
 */
export const featuredProjects: FeaturedProject[] = [
  {
    name: 'zenn_ai',
    span: 'big',
    spanTag: '[2×2]',
    description:
      'A production-grade AI agent — LangGraph tool-calling, five-tier permission gates, a local LLM via LM Studio, and a stdio MCP sidecar. Ships hardened Proxmox/systemd deploy tooling + an operator runbook.',
    trace: [
      'plan',
      'retrieve — per-channel vector search',
      'act — call tool (permission-checked)',
      'reflect — prose fallback if weak',
      'done',
    ],
    tags: ['TypeScript', 'Python', 'LangGraph', 'MCP', 'local LLM'],
  },
  {
    name: 'ZenMind',
    span: 'tall',
    spanTag: '[1×2]',
    description:
      'Chat with your own notes — local-first RAG over an Obsidian vault with citation streaming (SSE) and a confidence-gating CRAG-lite graph that runs a corrective HyDE re-retrieval when confidence is low.',
    tags: ['FastAPI', 'LangGraph', 'pgvector', 'bge-m3', 'BM25+RRF'],
  },
  {
    name: 'model-training',
    span: 'tall',
    spanTag: '[1×2]',
    description:
      'A from-scratch char-level GPT (PyTorch) and an Unsloth QLoRA fine-tuning track on a personal Obsidian vault, with GGUF export for local inference.',
    tags: ['PyTorch', 'Unsloth', 'QLoRA', 'GGUF'],
  },
  {
    name: 'token-counter',
    span: 'small',
    description:
      'Prices my Claude Code usage at API rates from raw transcripts — full prompt-cache (read / 5m / 1h-write) economics. Zero-dependency Python + a localhost dashboard.',
    tags: ['Python', 'zero-deps', 'cost analytics'],
  },
  {
    name: 'zennlogic.com',
    span: 'small',
    badge: 'shipped',
    description:
      'An Astro SSR site on Cloudflare Workers with a Cmd-K AI command bar that streams answers from OpenRouter — tool-calling, per-IP quota, Turnstile, KV caching.',
    tags: ['Astro', 'Cloudflare', 'OpenRouter', 'SSE'],
  },
];

/** Conservative "more work" list (packet §D/§E) shown on the bento's link card. */
export const moreWork = ['langchain-rag-app', 'agents', 'zengineer.cloud', 'exile-view'];

export interface StackGroup {
  label: string;
  items: string[];
}

/** Stack band — the whole depth of the stack (positioning §9). */
export const stackGroups: StackGroup[] = [
  {
    label: 'AI / ML',
    items: [
      'LangGraph',
      'LangChain',
      'Spring AI',
      'RAG',
      'pgvector',
      'QLoRA / Unsloth',
      'GGUF / llama.cpp',
      'MCP',
      'LangSmith',
    ],
  },
  { label: 'Languages', items: ['Python', 'TypeScript', 'Java', 'Rust', 'Lua'] },
  {
    label: 'Web / Infra',
    items: ['React 19', 'Astro', 'Cloudflare Workers', 'Vercel', 'Proxmox / systemd', 'Docker'],
  },
];

export interface WritingTeaser {
  meta: string;
  title: string;
}

/** Upcoming writing from the blog backlog (brief §6 / content-plan 03). */
export const writingTeasers: WritingTeaser[] = [
  {
    meta: 'local models · soon',
    title: 'I built a transformer from scratch, then a QLoRA fine-tune on my own notes',
  },
  {
    meta: 'agents · soon',
    title: 'Building an AI agent with guardrails: tools, permission tiers, and graceful fallback',
  },
  {
    meta: 'retrieval · soon',
    title: 'RAG that actually retrieves: hybrid search, citations, and confidence gating',
  },
];

export interface SocialLink {
  name: string;
  href: string;
}

/** Featured profiles, derived from the single source of profile URLs. */
export const socials: SocialLink[] = socialProfiles.map(({ name, url }) => ({
  name,
  href: url,
}));
