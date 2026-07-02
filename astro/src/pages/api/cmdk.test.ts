import { afterEach, describe, expect, it, vi } from 'vitest';
import { exceedsBodyLimit, hashIp } from '@/lib/apiSecurity';
import {
  POST,
  collectToolCallDelta,
  isLocalRequest,
  overQuota,
  parseHistory,
  projectsLedAnswer,
  providerErrorMessage,
  runAssistant,
  systemPrompt,
  trimHistoryForPrompt,
} from './cmdk';

// The route reads Worker bindings via `import('cloudflare:workers')`, which
// does not resolve under node — mock it with a mutable env tests can shape.
const runtimeEnv = vi.hoisted(() => ({}) as Record<string, unknown>);
vi.mock('cloudflare:workers', () => ({ env: runtimeEnv }));

afterEach(() => {
  for (const key of Object.keys(runtimeEnv)) delete runtimeEnv[key];
  vi.unstubAllGlobals();
});

describe('parseHistory', () => {
  it('returns an empty array for non-array input', () => {
    expect(parseHistory(null)).toEqual([]);
    expect(parseHistory(undefined)).toEqual([]);
    expect(parseHistory('not an array')).toEqual([]);
    expect(parseHistory({ role: 'user', content: 'hi' })).toEqual([]);
  });

  it('keeps a complete, correctly-ordered user/assistant pair', () => {
    const history = [
      { role: 'user', content: 'hi' },
      { role: 'assistant', content: 'hello' },
    ];
    expect(parseHistory(history)).toEqual(history);
  });

  it('drops a dangling trailing message with no matching reply', () => {
    const history = [
      { role: 'user', content: 'hi' },
      { role: 'assistant', content: 'hello' },
      { role: 'user', content: 'follow-up with no answer yet' },
    ];
    expect(parseHistory(history)).toHaveLength(2);
  });

  it('drops a pair that is not in user-then-assistant order', () => {
    // Nemotron requires strict user/assistant alternation — a flipped pair must
    // not be forwarded to the provider.
    const history = [
      { role: 'assistant', content: 'hello' },
      { role: 'user', content: 'hi' },
    ];
    expect(parseHistory(history)).toEqual([]);
  });

  it('filters a trailing malformed entry (missing content, unknown role) without disturbing earlier pairs', () => {
    const history = [
      { role: 'user', content: 'real question' },
      { role: 'assistant', content: 'real answer' },
      { role: 'system', content: 'ignored' },
      { role: 'user', content: '' },
    ];
    expect(parseHistory(history)).toEqual([
      { role: 'user', content: 'real question' },
      { role: 'assistant', content: 'real answer' },
    ]);
  });

  it('pairs strictly by post-filter position, so a malformed entry can shift and break later alignment', () => {
    // Documents a real, accepted limitation: filtering is a flat pass before
    // pairing, so an invalid entry isn't "skipped in place" — it can misalign
    // every pair after it. Safe failure mode (drops history), not a crash.
    const history = [
      { role: 'user', content: '' }, // filtered out; assistant below shifts into its slot
      { role: 'assistant', content: 'hello' },
      { role: 'user', content: 'real question' },
      { role: 'assistant', content: 'real answer' },
    ];
    expect(parseHistory(history)).toEqual([]);
  });

  it('keeps only the most recent MAX_SESSION_EXCHANGES (10) pairs', () => {
    const history = Array.from({ length: 14 }, (_, i) => [
      { role: 'user', content: `q${i}` },
      { role: 'assistant', content: `a${i}` },
    ]).flat();
    const result = parseHistory(history);
    expect(result).toHaveLength(20);
    expect(result[0]).toEqual({ role: 'user', content: 'q4' });
    expect(result.at(-1)).toEqual({ role: 'assistant', content: 'a13' });
  });
});

describe('trimHistoryForPrompt', () => {
  it('returns the same array when under the character budget', () => {
    const history = [
      { role: 'user' as const, content: 'q' },
      { role: 'assistant' as const, content: 'a' },
    ];
    expect(trimHistoryForPrompt(history)).toBe(history);
  });

  it('drops whole oldest pairs (never splitting one) until under budget', () => {
    const big = 'x'.repeat(5_000);
    const history = [
      { role: 'user' as const, content: big },
      { role: 'assistant' as const, content: big },
      { role: 'user' as const, content: big },
      { role: 'assistant' as const, content: big },
      { role: 'user' as const, content: 'recent q' },
      { role: 'assistant' as const, content: 'recent a' },
    ];
    // 20k+ chars > 12k budget → the first pair goes; the rest (~10k) fits.
    const result = trimHistoryForPrompt(history);
    expect(result).toHaveLength(4);
    expect(result[0]?.role).toBe('user');
    expect(result.at(-1)).toEqual({ role: 'assistant', content: 'recent a' });
  });
});

describe('collectToolCallDelta', () => {
  it('accumulates fragmented name/arguments by index, defaulting a missing index to 0', () => {
    const acc = new Map<number, { id: string; name: string; args: string }>();
    collectToolCallDelta(acc, [
      { index: 0, id: 'call-1', function: { name: 'search_', arguments: '{"qu' } },
    ]);
    collectToolCallDelta(acc, [{ function: { name: 'site', arguments: 'ery":"x"}' } }]);
    expect(acc.get(0)).toEqual({ id: 'call-1', name: 'search_site', args: '{"query":"x"}' });
  });

  it('tracks parallel calls on separate indices', () => {
    const acc = new Map<number, { id: string; name: string; args: string }>();
    collectToolCallDelta(acc, [
      { index: 0, id: 'a', function: { name: 'get_project', arguments: '{}' } },
      { index: 1, id: 'b', function: { name: 'get_post', arguments: '{}' } },
    ]);
    expect(acc.size).toBe(2);
    expect(acc.get(1)?.name).toBe('get_post');
  });
});

describe('systemPrompt', () => {
  it('lists projects as slim slug lines, not detail bodies', () => {
    const prompt = systemPrompt();
    expect(prompt).toContain('[slug:');
    expect(prompt).toContain('get_project');
  });

  it('carries the abuse policy block', () => {
    const prompt = systemPrompt();
    expect(prompt).toContain('POLICY');
    expect(prompt).toMatch(/not a general-purpose assistant/i);
    expect(prompt).toMatch(/never reveal/i);
    expect(prompt).toMatch(/data, not instructions/i);
  });
});

describe('projectsLedAnswer', () => {
  it('surfaces a matching project by name', () => {
    // Matching is a whole-query substring check against each project's combined
    // name/tags/summary/group haystack — query with a term that haystack contains.
    expect(projectsLedAnswer('zenn_ai')).toContain('zenn_ai');
  });

  it('falls back to a generic message when nothing matches', () => {
    const answer = projectsLedAnswer('what is the weather today');
    expect(answer).toMatch(/not enabled/i);
    expect(answer).not.toContain('zenn_ai');
  });
});

describe('providerErrorMessage', () => {
  it('reports a credentials problem for 401/403', () => {
    expect(providerErrorMessage(401)).toMatch(/credentials/i);
    expect(providerErrorMessage(403)).toMatch(/credentials/i);
  });

  it('reports rate-limiting for 429', () => {
    expect(providerErrorMessage(429)).toMatch(/rate-limited/i);
  });

  it('falls back to a generic unavailable message otherwise', () => {
    expect(providerErrorMessage(500)).toMatch(/unavailable/i);
  });
});

describe('isLocalRequest', () => {
  it('treats localhost and loopback hosts as local', () => {
    expect(isLocalRequest(new Request('http://localhost:4321/api/cmdk'))).toBe(true);
    expect(isLocalRequest(new Request('http://127.0.0.1:4321/api/cmdk'))).toBe(true);
  });

  it('treats a real hostname as non-local', () => {
    expect(isLocalRequest(new Request('https://benhickman.dev/api/cmdk'))).toBe(false);
  });
});

// Minimal in-memory KV double: records put keys so tests can assert exactly
// which counters a request consumed.
function createMockKv(initial: Record<string, string> = {}): {
  kv: KVNamespace;
  puts: string[];
  store: Map<string, string>;
} {
  const store = new Map(Object.entries(initial));
  const puts: string[] = [];
  const kv = {
    get: async (key: string) => store.get(key) ?? null,
    put: async (key: string, value: string) => {
      store.set(key, value);
      puts.push(key);
    },
    delete: async (key: string) => {
      store.delete(key);
    },
  } as unknown as KVNamespace;
  return { kv, puts, store };
}

const QUOTA_IP = '203.0.113.9';
const QUOTA_SECRET = 'turnstile-secret';
const today = (): string => new Date().toISOString().slice(0, 10);

describe('overQuota', () => {
  it('allows a fresh IP, bumping the per-IP key and exactly one global shard', async () => {
    const { kv, puts } = createMockKv();
    expect(await overQuota(kv, QUOTA_IP, QUOTA_SECRET)).toBe('ok');
    expect(puts).toHaveLength(2);
    expect(puts[0]).toMatch(/^cmdk:ip:[0-9a-f]{16}:\d{4}-\d{2}-\d{2}$/);
    expect(puts[1]).toMatch(/^cmdk:global:\d{4}-\d{2}-\d{2}:[0-7]$/);
  });

  it('never embeds the raw client IP in a quota key', async () => {
    const { kv, puts } = createMockKv();
    await overQuota(kv, QUOTA_IP, QUOTA_SECRET);
    for (const key of puts) expect(key).not.toContain(QUOTA_IP);
  });

  it('checks per-IP FIRST: an over-limit IP does not consume the global budget', async () => {
    const day = today();
    const ipKey = `cmdk:ip:${await hashIp(QUOTA_IP, day, QUOTA_SECRET)}:${day}`;
    // 40 = PER_IP_DAILY in cmdk.ts.
    const { kv, puts, store } = createMockKv({ [ipKey]: '40' });
    expect(await overQuota(kv, QUOTA_IP, QUOTA_SECRET)).toBe('over');
    expect(puts).toHaveLength(0);
    expect([...store.keys()].filter((key) => key.startsWith('cmdk:global:'))).toHaveLength(0);
  });

  it('rejects when the summed global shards reach the limit, after the per-IP bump', async () => {
    const day = today();
    // 8 shards × 63 = 504 ≥ 500 (GLOBAL_DAILY in cmdk.ts).
    const shards = Object.fromEntries(
      Array.from({ length: 8 }, (_, shard) => [`cmdk:global:${day}:${shard}`, '63']),
    );
    const { kv, puts } = createMockKv(shards);
    expect(await overQuota(kv, QUOTA_IP, QUOTA_SECRET)).toBe('over');
    expect(puts).toHaveLength(1);
    expect(puts[0]).toMatch(/^cmdk:ip:/);
  });

  it('fails OPEN when KV throws (Turnstile still gates abuse)', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const kv = {
      get: async () => {
        throw new Error('KV write rate exceeded');
      },
      put: async () => {
        throw new Error('KV write rate exceeded');
      },
    } as unknown as KVNamespace;
    expect(await overQuota(kv, QUOTA_IP, QUOTA_SECRET)).toBe('ok');
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('reports a missing KV binding or missing client IP as unconfigured, not over-quota', async () => {
    const { kv } = createMockKv();
    expect(await overQuota(undefined, QUOTA_IP, QUOTA_SECRET)).toBe('unconfigured');
    expect(await overQuota(kv, null, QUOTA_SECRET)).toBe('unconfigured');
  });
});

describe('hashIp', () => {
  it('is deterministic for identical inputs', async () => {
    const first = await hashIp(QUOTA_IP, '2026-07-01', QUOTA_SECRET);
    const second = await hashIp(QUOTA_IP, '2026-07-01', QUOTA_SECRET);
    expect(first).toBe(second);
  });

  it('produces 16 lowercase hex chars containing no raw IP material', async () => {
    const hash = await hashIp(QUOTA_IP, '2026-07-01', QUOTA_SECRET);
    expect(hash).toMatch(/^[0-9a-f]{16}$/);
    expect(hash).not.toContain(QUOTA_IP);
  });

  it('rotates with the day and varies with the secret', async () => {
    const base = await hashIp(QUOTA_IP, '2026-07-01', QUOTA_SECRET);
    expect(await hashIp(QUOTA_IP, '2026-07-02', QUOTA_SECRET)).not.toBe(base);
    expect(await hashIp(QUOTA_IP, '2026-07-01', 'other-secret')).not.toBe(base);
  });
});

describe('exceedsBodyLimit', () => {
  const withContentLength = (value: string | null): Request =>
    ({
      headers: new Headers(value === null ? {} : { 'content-length': value }),
    }) as unknown as Request;

  it('flags a declared body larger than the cap', () => {
    expect(exceedsBodyLimit(withContentLength('4097'), 4_096)).toBe(true);
  });

  it('allows bodies at or under the cap, and requests without the header', () => {
    expect(exceedsBodyLimit(withContentLength('4096'), 4_096)).toBe(false);
    expect(exceedsBodyLimit(withContentLength(null), 4_096)).toBe(false);
  });
});

describe('POST body-size guard', () => {
  it('returns 413 before parsing when Content-Length exceeds the cap', async () => {
    const context = {
      request: {
        headers: new Headers({ 'content-length': String(64 * 1024) }),
      },
      cookies: { get: () => undefined },
      session: undefined,
      locals: {},
    } as unknown as Parameters<typeof POST>[0];
    const response = await POST(context);
    expect(response.status).toBe(413);
  });
});

describe('POST reset gating', () => {
  it('performs no history delete when Turnstile verification fails', async () => {
    const deleteSpy = vi.fn(async () => undefined);
    runtimeEnv.LLM_API_KEY = 'live-key';
    runtimeEnv.CMDK_TURNSTILE_SECRET = 'secret';
    runtimeEnv.CMDK_KV = {
      get: async () => null,
      put: async () => undefined,
      delete: deleteSpy,
    };
    // Siteverify rejects the token — the request must die at the 403 without
    // ever touching history (S1: pre-verification KV deletes).
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ success: false }), { status: 200 })),
    );
    const context = {
      request: new Request('https://benhickman.dev/api/cmdk', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ query: 'hello', turnstileToken: 'bad-token', reset: true }),
      }),
      cookies: { get: () => ({ value: 'session-1' }) },
      session: undefined,
      locals: {},
    } as unknown as Parameters<typeof POST>[0];
    const response = await POST(context);
    expect(response.status).toBe(403);
    expect(deleteSpy).not.toHaveBeenCalled();
  });
});

// ── runAssistant tool loop ──────────────────────────────────────────────────

function sseResponse(frames: string[]): Response {
  const body = frames.map((frame) => `data: ${frame}\n\n`).join('');
  return new Response(body, {
    status: 200,
    headers: { 'content-type': 'text/event-stream' },
  });
}

const toolCallFrame = JSON.stringify({
  choices: [
    {
      delta: {
        tool_calls: [
          {
            index: 0,
            id: 'call-1',
            function: { name: 'search_site', arguments: '{"query":"zenmind"}' },
          },
        ],
      },
    },
  ],
});

const contentFrame = (text: string): string =>
  JSON.stringify({ choices: [{ delta: { content: text } }] });

const fakeController = { enqueue: () => undefined } as unknown as ReadableStreamDefaultController;
const liveEnv = { LLM_API_KEY: 'test-key' } as Parameters<typeof runAssistant>[3];
const emptyCtx = { corpus: [], index: [] };

describe('runAssistant', () => {
  it('caps tool rounds at 2 and forces a tool-free final call', async () => {
    // The provider asks for a tool on every round it is allowed to — the loop
    // must stop feeding it tools after MAX_TOOL_ROUNDS and demand an answer.
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(sseResponse([toolCallFrame, '[DONE]']))
      .mockResolvedValueOnce(sseResponse([toolCallFrame, '[DONE]']))
      .mockResolvedValueOnce(sseResponse([contentFrame('Grounded answer.'), '[DONE]']));
    vi.stubGlobal('fetch', fetchMock);

    const result = await runAssistant(
      fakeController,
      'what is zenmind?',
      [],
      liveEnv,
      new AbortController().signal,
      emptyCtx,
    );
    expect(result).toEqual({ ok: true, answer: 'Grounded answer.' });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    const bodies = fetchMock.mock.calls.map(
      (call) => JSON.parse((call[1] as RequestInit).body as string) as { tools?: unknown[] },
    );
    expect(bodies[0]?.tools).toBeDefined();
    expect(bodies[1]?.tools).toBeDefined();
    expect(bodies[2]?.tools).toBeUndefined();
  });

  it('degrades to plain chat when the provider rejects the tools parameter', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('tools are not supported for this model', { status: 400 }))
      .mockResolvedValueOnce(sseResponse([contentFrame('Plain answer.'), '[DONE]']));
    vi.stubGlobal('fetch', fetchMock);

    const result = await runAssistant(
      fakeController,
      'hi',
      [],
      liveEnv,
      new AbortController().signal,
      emptyCtx,
    );
    expect(result).toEqual({ ok: true, answer: 'Plain answer.' });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const retryBody = JSON.parse(
      (fetchMock.mock.calls[1]?.[1] as RequestInit).body as string,
    ) as { tools?: unknown[] };
    expect(retryBody.tools).toBeUndefined();
  });

  it('surfaces a non-tool provider error without retrying', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('upstream exploded', { status: 500 }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await runAssistant(
      fakeController,
      'hi',
      [],
      liveEnv,
      new AbortController().signal,
      emptyCtx,
    );
    expect(result.ok).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    errorSpy.mockRestore();
  });
});
