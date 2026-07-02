# Positioning & Narrative — benhickman.dev

This is the master story the site should tell. The next agent should treat it as the source of truth for
*voice, framing, and value props*, and pull concrete proof points from `02-project-briefs.md`.

## 1. Who Ben is (one paragraph)

Ben Hickman is an AI/ML engineer who builds production AI systems and the model layer beneath them. At SPS
Commerce he helped build **"Max,"** an AI agent embedded into the company's platform, and worked on the
retrieval foundations that make agents useful in an enterprise — **RAG pipelines** and **multimodal image +
text embedding and retrieval**. Outside of work he goes a layer deeper than most application engineers: he
trains and fine-tunes models from scratch, runs them locally, builds agentic orchestration with tool-calling
and guardrails, and ships the front-ends that put it all in front of users. His through-line is *optimization* —
getting better quality, lower cost, and more reliable behavior out of AI systems at every layer of the stack.

## 2. The through-line (the one idea the whole site reinforces)

> **"I work the full depth of the AI stack — from training the model to deploying the agent to shipping the UI —
> and I optimize each layer for quality, cost, and reliability."**

Most "AI engineers" online prove only the top layer (prompt + API call). Ben's differentiator is **vertical
depth**: he can credibly speak to what's happening from the GPU up to the React component. The site should
make that depth legible without drowning a non-technical reader.

The three pillars to repeat everywhere:

1. **Build** — agentic systems, RAG pipelines, full-stack apps that actually ship.
2. **Optimize** — quantization, hardware-aware model selection, hybrid retrieval, eval/confidence gating,
   cost tracking. This is the word that should recur; it's what separates him from API-gluers.
3. **Ship** — real deployments (Proxmox/systemd, Cloudflare Workers, Vercel), CI/quality gates, packaged
   and distributed tools (Scoop/Homebrew).

## 3. Target audiences (and what each needs to see)

- **Technical hiring managers / senior engineers** — want architecture decisions, trade-offs, and evidence
  of depth. Serve them: project deep-dives, architecture notes, "why I chose X over Y," and links to code.
- **Recruiters / non-technical screeners** — skim for role-fit keywords and impact. Serve them: a crisp
  headline, a skills/stack band, titles, and one-line impact statements.
- **Potential clients / founders** — want outcomes and reliability. Serve them: "what I can build for you,"
  shipped examples, and a clear contact path.

Design implication: **layer the content.** Lead each section with a plain-language claim, then let an
interested reader expand into technical depth (project pages, blog posts).

## 4. Value propositions (reusable copy seeds)

- *"From the GPU to the front-end."* I've trained a transformer from scratch, fine-tuned models with QLoRA on
  my own data, and shipped the apps that serve them.
- *"Retrieval that actually retrieves."* I build RAG and embedding pipelines — hybrid retrieval, citation-backed
  answers, confidence gating — in Python, Java/Spring, and at the edge.
- *"Agents with guardrails."* My agentic systems have permission tiers, tool registries, fallback nodes, and
  observability — not just a single prompt and hope.
- *"I optimize for the real constraints."* Memory, latency, and cost: 8-bit quantization, hardware-aware model
  fitting, token-cost analytics, MoE expert offloading.
- *"Enterprise-tested."* I've shipped AI into a real platform (SPS Commerce "Max") used by real customers.

## 5. Voice & tone

- **Confident, specific, and technical — but never vague or buzzword-y.** Prefer concrete nouns ("pgvector,"
  "QLoRA," "GGUF export," "MCP sidecar") over adjectives ("cutting-edge," "robust," "scalable").
- **Show the trade-off, not just the win.** A sentence like "I chose Annoy over FAISS here because…" signals
  seniority better than a feature list.
- **Builder's humility on maturity.** Be honest about what's shipped vs. a prototype vs. a lab. It reads as
  credible and avoids the over-claiming that technical reviewers punish. (See `04-accuracy-and-gaps.md`.)
- **First person, active voice.** "I built," "I optimized," "I shipped."
- Avoid: "passionate about," "leveraging synergies," "revolutionary," empty "AI-powered" labels.

## 6. How the enterprise work anchors the personal projects

The SPS Commerce work is the **credibility anchor**; the personal projects are the **proof of depth**. Tie them
together explicitly so the portfolio doesn't read as "just side projects":

- Enterprise **RAG pipelines** ↔ personal `ZenMind`, `langchain-rag-app`, `java-spring-ai`, `zennlogic_ai`.
  ("I build the same retrieval systems on my own time, in multiple languages.")
- Enterprise **"Max" agent** ↔ personal `zenn_ai`, `agent-spec-lab`, `agents`.
  ("I design agent orchestration with tools, permissions, and fallbacks.")
- Enterprise **multimodal image+text embeddings & retrieval** ↔ this is the one area where the *enterprise* work
  is the headline evidence; the personal repos show adjacent retrieval/embedding depth and local model work
  rather than image embeddings specifically. Frame multimodal as enterprise experience, not a repo demo.
  (See `04-accuracy-and-gaps.md` — do not imply a public repo demonstrates image embeddings.)

Suggested framing line for the About/Work section:
> *"By day I build enterprise AI — the 'Max' agent and the RAG and multimodal retrieval systems behind it. By
> night I go down a layer: training models from scratch, fine-tuning them on my own data, and shipping the
> tools and agents that use them."*

## 7. Tagline / headline options (pick one, A/B the rest)

1. **"I build AI systems — model, agent, and interface."**
2. **"Full-stack AI engineer. From the GPU to the front-end."**
3. **"I train models, build agents, and ship the apps that use them."**
4. **"AI systems, optimized end to end."**
5. **"Enterprise AI by day. Models from scratch by night."**

## 8. Short bio variants

**One-liner (nav/meta):**
> AI/ML engineer building agentic systems, RAG pipelines, and the models underneath them.

**Recruiter bio (~50 words):**
> Ben Hickman is an AI/ML engineer who builds production AI systems end to end. At SPS Commerce he helped build
> the "Max" platform agent and its RAG and multimodal retrieval foundations. His personal work spans model
> training and fine-tuning, agent orchestration, and full-stack apps across Python, Java, TypeScript, and Rust.

**Technical bio (~90 words):**
> I'm an AI/ML engineer focused on the full depth of the stack. I build agentic systems with tool-calling,
> permission tiers, and fallback/confidence gating; RAG and embedding pipelines with hybrid retrieval and
> citation-backed answers; and the model layer itself — training a transformer from scratch and fine-tuning
> instruct models with QLoRA, then exporting to GGUF for local inference. I ship: a production Twitch agent on
> Proxmox/systemd, a Rust CLI distributed via Scoop and Homebrew, and front-ends on Vercel and Cloudflare. At
> SPS Commerce I helped build the "Max" agent and its retrieval foundations.

## 9. Skills / stack band (for a scannable strip)

- **AI/ML:** LangGraph · LangChain · Spring AI · RAG · pgvector · ChromaDB · FAISS/Annoy · sentence-transformers ·
  QLoRA/Unsloth · nanoGPT-from-scratch · GGUF/llama.cpp · LM Studio · MCP · LangSmith
- **Languages:** Python · TypeScript · Java · Rust · Lua
- **Web:** React 19 · Next.js · Astro · Vite · MUI · Chakra UI · React Three Fiber · Sanity CMS
- **Infra/quality:** Cloudflare Workers · Vercel · Proxmox/systemd · Docker · GitHub Actions · pytest/Jest/Playwright
