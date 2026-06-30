import type { APIRoute } from 'astro';
import { projects } from '@/data/projects';

// SERVER endpoint (Cloudflare Worker) — the "ask my work" boundary.
// v1 ships a projects-led STUB stream in the final SSE event shape. The live
// OpenRouter agent drops into the marked branch later without re-architecting:
// KV per-IP quota + Turnstile gating + a streaming Response are already wired.
// Secrets (read from `cloudflare:workers`, never shipped to the client):
//   OPENROUTER_API_KEY / OPENROUTER_MODEL — Phase 5+ live agent
//   TURNSTILE_SECRET                       — shared with /api/contact
export const prerender = false;

interface CmdkEnv {
  OPENROUTER_API_KEY?: string;
  OPENROUTER_MODEL?: string;
  TURNSTILE_SECRET?: string;
  CMDK_KV?: KVNamespace;
}

const DAILY_LIMIT = 40;
const encoder = new TextEncoder();

function sse(controller: ReadableStreamDefaultController, data: unknown): void {
  controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
}

async function verifyTurnstile(token: string, secret: string, ip: string | null): Promise<boolean> {
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: form,
    });
    return ((await res.json()) as { success?: boolean }).success === true;
  } catch {
    return false;
  }
}

// Best-effort per-IP daily quota (KV is eventually consistent — advisory).
async function overQuota(kv: KVNamespace | undefined, ip: string | null): Promise<boolean> {
  if (!kv || !ip) return false;
  const key = `cmdk:${ip}:${new Date().toISOString().slice(0, 10)}`;
  const current = Number((await kv.get(key)) ?? '0');
  if (current >= DAILY_LIMIT) return true;
  await kv.put(key, String(current + 1), { expirationTtl: 60 * 60 * 24 });
  return false;
}

// Projects-led stub: surface the verified projects most relevant to the query.
function projectsLedAnswer(query: string): string {
  const q = query.toLowerCase();
  const matches = projects
    .filter((p) => `${p.name} ${p.tags.join(' ')} ${p.summary} ${p.group}`.toLowerCase().includes(q))
    .slice(0, 3);
  if (matches.length > 0) {
    const names = matches.map((p) => p.name).join(', ');
    return `The live assistant isn't wired up yet, but based on "${query}" the most relevant work is: ${names}. Open any from the Work list below, or reach out via Contact.`;
  }
  return `The live assistant isn't wired up yet. Try the Work, Writing, or Contact results below — or rephrase your question.`;
}

export const POST: APIRoute = async ({ request }) => {
  const { env } = await import('cloudflare:workers');
  const e = env as unknown as CmdkEnv;
  const ip = request.headers.get('cf-connecting-ip');

  let query = '';
  let turnstileToken = '';
  try {
    const body = (await request.json()) as { query?: string; turnstileToken?: string };
    query = (body.query ?? '').trim().slice(0, 500);
    turnstileToken = body.turnstileToken ?? '';
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body.' }), { status: 400 });
  }
  if (!query) {
    return new Response(JSON.stringify({ error: 'Empty query.' }), { status: 400 });
  }

  // Turnstile is enforced only once the live LLM is enabled (the stub is cheap
  // and safe). When the key exists, require a valid token before spending it.
  const liveMode = Boolean(e.OPENROUTER_API_KEY);
  if (liveMode && e.TURNSTILE_SECRET) {
    const ok = await verifyTurnstile(turnstileToken, e.TURNSTILE_SECRET, ip);
    if (!ok) return new Response(JSON.stringify({ error: 'Verification failed.' }), { status: 403 });
  }

  if (await overQuota(e.CMDK_KV, ip)) {
    return new Response(JSON.stringify({ error: 'Daily question limit reached. Try tomorrow.' }), {
      status: 429,
    });
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // ── LIVE AGENT BRANCH (future) ──────────────────────────────────
        // if (liveMode) { stream OpenRouter SSE → re-emit as {type:'token'};
        //   consult the claude-api skill when wiring the real call. }
        // For now, always the projects-led stub, in the final event shape:
        const answer = projectsLedAnswer(query);
        for (const word of answer.split(' ')) {
          sse(controller, { type: 'token', text: word + ' ' });
        }
        sse(controller, { type: 'done' });
      } catch {
        sse(controller, { type: 'error' });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-cache, no-transform',
      connection: 'keep-alive',
    },
  });
};
