import { afterEach, describe, expect, it, vi } from 'vitest';
import { hashForTrace, startAskTrace } from './tracing';

const generationSpy = vi.hoisted(() => vi.fn());
const spanSpy = vi.hoisted(() => vi.fn());
const updateSpy = vi.hoisted(() => vi.fn());
const flushSpy = vi.hoisted(() => vi.fn(async () => undefined));
const traceSpy = vi.hoisted(() =>
  vi.fn(() => ({ generation: generationSpy, span: spanSpy, update: updateSpy })),
);

vi.mock('langfuse', () => ({
  Langfuse: class {
    trace = traceSpy;
    flushAsync = flushSpy;
  },
}));

const CONFIGURED = {
  LANGFUSE_PUBLIC_KEY: 'pk-lf-test',
  LANGFUSE_SECRET_KEY: 'sk-lf-test',
};

afterEach(() => {
  vi.clearAllMocks();
});

describe('startAskTrace', () => {
  it('returns null (tracing off) when either key is missing', () => {
    expect(startAskTrace({}, { query: 'q', sessionIdHash: null })).toBeNull();
    expect(
      startAskTrace({ LANGFUSE_PUBLIC_KEY: 'pk' }, { query: 'q', sessionIdHash: null }),
    ).toBeNull();
    expect(
      startAskTrace({ LANGFUSE_SECRET_KEY: 'sk' }, { query: 'q', sessionIdHash: null }),
    ).toBeNull();
    expect(traceSpy).not.toHaveBeenCalled();
  });

  it('opens a trace carrying the query and the hashed session id', () => {
    const trace = startAskTrace(CONFIGURED, { query: 'what is zenmind?', sessionIdHash: 'abc123' });
    expect(trace).not.toBeNull();
    expect(traceSpy).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'cmdk-ask', input: 'what is zenmind?', sessionId: 'abc123' }),
    );
  });

  it('records generations, tool spans (ERROR level on failure), finish, and flush', async () => {
    const trace = startAskTrace(CONFIGURED, { query: 'q', sessionIdHash: null });
    trace?.recordGeneration({
      round: 1,
      model: 'test-model',
      input: [{ role: 'user', content: 'q' }],
      output: 'a',
      toolCallCount: 0,
      degraded: false,
      startTime: new Date(0),
      endTime: new Date(1),
    });
    expect(generationSpy).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'provider-round-1', model: 'test-model', level: 'DEFAULT' }),
    );
    trace?.recordToolCall({ name: 'search_site', args: '{}', result: 'bad args', ok: false });
    expect(spanSpy).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'tool:search_site', level: 'ERROR' }),
    );
    trace?.finish({ answer: 'a' });
    expect(updateSpy).toHaveBeenCalledWith(expect.objectContaining({ output: 'a' }));
    await trace?.flush();
    expect(flushSpy).toHaveBeenCalled();
  });

  it('swallows SDK throws — tracing can never break the answer path', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    generationSpy.mockImplementationOnce(() => {
      throw new Error('sdk exploded');
    });
    flushSpy.mockRejectedValueOnce(new Error('network gone'));
    const trace = startAskTrace(CONFIGURED, { query: 'q', sessionIdHash: null });
    expect(() =>
      trace?.recordGeneration({
        round: 1,
        model: 'm',
        input: [],
        output: '',
        toolCallCount: 0,
        degraded: false,
        startTime: new Date(0),
        endTime: new Date(1),
      }),
    ).not.toThrow();
    await expect(trace?.flush()).resolves.toBeUndefined();
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});

describe('hashForTrace', () => {
  it('is deterministic and salt-sensitive', async () => {
    const first = await hashForTrace('session-id-value', 'salt-a');
    expect(first).toBe(await hashForTrace('session-id-value', 'salt-a'));
    expect(first).not.toBe(await hashForTrace('session-id-value', 'salt-b'));
  });

  it('emits 24 lowercase hex chars containing no raw session material', async () => {
    const raw = 'astro-session-cookie-value';
    const hash = await hashForTrace(raw, 'sk-lf-test');
    expect(hash).toMatch(/^[0-9a-f]{24}$/);
    expect(hash).not.toContain(raw);
  });
});
