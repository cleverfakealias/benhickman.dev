# Verification & Ownership Corrections (AUTHORITATIVE)

**Date:** 2026-06-26. **This file overrides `02-project-briefs.md` and `04-accuracy-and-gaps.md` on any conflict.**

It exists because `llmfit` was wrongly elevated to a shipped "Hero" in `02` — it is **not Ben's repo**. Two sources
produced these corrections: (1) an objective git audit — `git remote get-url origin` + commit-author distribution
across every repo in the workspace; (2) a per-repo source-code verification pass (7 skeptical auditor agents reading
the actual implementation, defaulting to "unsupported" when the code wasn't there).

## A. Ownership — NOT Ben's (never feature these)

| Repo | origin remote | Authored by |
|---|---|---|
| **llmfit** | `AlexsJones/llmfit` | Alex Jones (100%) |
| **claw-code** | `instructkr/claw-code` | Yeachan-Heo |
| **skills** | `mattpocock/skills` | Matt Pocock |
| **path-of-zenn**, **PathOfBuilding-PoE2** | PathOfBuilding fork | LocalIdentity et al. |
| **luajit** | `luajit.org` | Mike Pall |

## B. Verified Ben's (origin `cleverfakealias`, authored by BJH / Zenn)

zenn_ai · ZenMind · model-training · agent-spec-lab · token-counter · zennlogic_ai · agents · ai-gateway ·
langchain-rag-app · java-spring-ai · benhickman.dev · zennlogic.com · zengineer.cloud · zendev.pro ·
**exile-view** (NEW — was missing from the packet) · stream-stuff · stream_toys · Zenith-Fall · school_projects.

## C. Per-repo claim audit (the 7 featured repos)

### zenn_ai — STRONG ✅ (polished-prototype)
Verified in source: LangGraph tool-calling (MAX_TOOL_ROUNDS=3), 5-tier permission gates enforced twice,
LM Studio local LLM, stdio MCP sidecar (`poe-mcp`, FastMCP), per-channel libSQL DiskANN vector search,
prose fallback for weak models. 140+ TS tests, 28 Py tests.
**CORRECTION:** "running 24/7 on bare metal" is backed only by deploy *tooling* (hardened systemd units, daily
backup timer, Caddy TLS, Proxmox runbook) — **no in-repo proof of a live instance.** Say "deployable to / runbook
for Proxmox LXC," not "running 24/7." CI exists but is disabled to manual dispatch — don't claim "CI-gated."

### zennlogic.com — SHIPPED/DEPLOYED ✅ (strongest shipped proof)
Verified: Astro 6 SSR on Cloudflare Workers (real `wrangler deploy`, KV namespaces, custom domains, pre-push gate);
a Cmd-K AI command bar that **streams** from OpenRouter (`claude-haiku-4.5`) with tool-calling, per-IP quota,
Turnstile, KV caching. This is the legitimate home for a "shipped" badge.
**Minor:** a `.dev.vars` file is in the working tree (gitignored) — confirm it was never committed before sharing.

### token-counter — CLEAN ✅ (polished-prototype)
All claims accurate: parses `~/.claude` transcripts, models cache read/5m/1h-write economics, stdlib-only, localhost
dashboard. Caveats: reads pre-recorded usage (doesn't tokenize); it's an estimate, not a bill; pricing is a hardcoded
2026-06 snapshot. Local single-user tool — not "shipped."

### ZenMind — STRONG ✅ (polished-prototype)
RAG over an Obsidian vault, SSE citation streaming, FastAPI + LangGraph, Chroma/pgvector, bge-m3 — all verified.
**CORRECTION:** the graph is **CRAG-lite with a HyDE corrective re-retrieval loop**, not the linear
reformulate→retrieve→assess→answer→fallback chain. Not fully offline (needs an external OpenAI-compatible endpoint).
Self-labeled "CS50 Final Project Scaffold," v0.1.0, no deploy. **Undersold:** hybrid BM25+RRF + a cross-encoder reranker.

### model-training — REAL CODE, NO PROVEN RUN ⚠️ (polished-prototype)
From-scratch char-level GPT (PyTorch) + Unsloth QLoRA + GGUF export are all genuinely implemented (substantial,
idiomatic code). BUT **zero in-repo evidence any training/fine-tune/export was ever executed** (logs & checkpoints
gitignored). Describe as "built/implements," NOT "trained a model" / "ran it," unless Ben can show loss curves or a
GGUF artifact. **BUG (fix task spawned):** a blanket `data/` .gitignore rule excludes all data-prep scripts, so a
clean clone can't run end-to-end. Only 3 commits.

### agent-spec-lab — BROKEN AS COMMITTED ❌ (do not feature until fixed)
**Does NOT import or run.** `cli.py` + every node import `agent_spec_lab.tools.logging` and `…tools.langsmith_utils`;
neither module exists or was ever committed. `import agent_spec_lab` → ModuleNotFoundError; CLI can't start; pytest
fails at collection; CI would not pass. Also: the confidence node only emits a 1–10 score (categorization is in other
nodes); the sophisticated graph isn't the one the CLI runs. **REMOVED from the homepage featured set.** (Fix task spawned.)

### exile-view — REAL, his ✅ (polished-prototype) — "more work" listing
A TypeScript **Twitch Extension for Path of Exile 2**: Cloudflare Worker EBS + D1 + R2 item icons + PubSub; streamers
paste up to 5 builds, viewers see them live. ~8k LOC, 173 tests pass. **CAVEAT:** deployment-ready/audited-for-review,
**NOT confirmed live/published** on Twitch — don't claim "live." OAuth phase-2 incomplete.

## D. Net effect on the homepage featured set

**Featured bento (all verified Ben's):** `zenn_ai` (flagship) · `ZenMind` · `model-training` (as "built") ·
`token-counter` · `zennlogic.com` (legit "shipped" badge).
**Removed:** `llmfit` (not his), `agent-spec-lab` (broken).
**More work (verified, conservative framing — see §E):** langchain-rag-app · agents · zengineer.cloud · exile-view · java-spring-ai (prototype). **Dropped:** `zennlogic_ai` (headline features are stubs).

## E. Supporting repos audit (round 2, 2026-06-26) — Work-page framings

All ownership-verified (origin `cleverfakealias`, authored by BJH/Zenn). Use these conservative framings — `02` over-claims several.

- **langchain-rag-app** — polished-prototype. ✅ list. *"A local-model RAG demo (Streamlit) — chat with your docs using HuggingFace models, no API keys, with ChromaDB + selectable retrieval strategies and optional 8-bit quant."* CAVEAT: MMR/hybrid retrieval is implemented but **not wired into the main Q&A chain** (plain similarity drives answers); keyword search is naive word-overlap, not BM25. Don't claim "production hybrid retrieval."
- **zengineer.cloud** — polished-prototype. ✅ list. *"Next.js 16 + React 19 marketing/blog with a GLSL React-Three-Fiber backdrop that shifts palette per route and honors reduced-motion; Sanity Portable Text; jest-axe + Playwright smoke tests."* CAVEAT: route-aware by **color palette only** (identical geometry) — the "distinct scenes per route" claim is FALSE (those scene files are dead code). a11y tests are shallow smoke.
- **agents** — polished-prototype. ✅ list. *"A Claude-Code-native agent scaffold — cross-platform .mjs hooks automate format/lint/test and enforce layered security (deny rules + guard hooks + OS sandbox); AGENTS.md is the cross-tool contract."* CAVEAT: only Claude Code runs the hooks (other tools get the AGENTS.md contract, not executable wiring); template never executed in its own repo.
- **exile-view** — polished-prototype. ✅ list (also §C). *"Twitch Extension for PoE2 builds — Cloudflare Worker + D1 + R2 + PubSub."* Not "live/published."
- **java-spring-ai** — **PROTOTYPE** (downgraded). List modestly or omit. *"A Spring AI (1.0.0-M6 milestone) + pgvector RAG starter in Java 25 — profile-gated ingest/search/citations."* DO NOT claim "Testcontainers integration tests" (Testcontainers is declared but **used nowhere**; the RAG path has zero tests) and NOT GA Spring AI.
- **zennlogic_ai** — ❌ **DROP from the Work page.** Prototype with multiple stub over-claims: the "pluggable FAISS/Annoy vector backend" always returns FAISS (Annoy is dead code); the "MCP server" is a self-labeled stub (no MCP protocol); SSM auth is unimplemented (breaks auth outside local); a "Bedrock provider" is claimed but absent. Featuring it points a reviewer straight at the stubs.
