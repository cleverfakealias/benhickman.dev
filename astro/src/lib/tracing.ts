import { Langfuse } from 'langfuse';

// Optional Langfuse tracing for the ⌘K assistant (api/cmdk.ts). Strictly
// additive: missing keys → startAskTrace returns null and the route runs
// untraced; every wrapper method try/catches so an SDK or network problem is
// logged, never thrown into the answer path. Full message content is traced
// by owner decision (see specs/cmdk-langfuse-tracing.md + the privacy page).

export interface TracingEnv {
  LANGFUSE_PUBLIC_KEY?: string;
  LANGFUSE_SECRET_KEY?: string;
  LANGFUSE_BASE_URL?: string;
  /** 'true' → verbose SDK logging (every enqueue + ingestion result). */
  LANGFUSE_DEBUG?: string;
}

const DEFAULT_BASE_URL = 'https://us.cloud.langfuse.com';

export interface GenerationRecord {
  round: number;
  model: string;
  /** Full provider messages for this round (owner opted into content). */
  input: unknown;
  output: string;
  toolCallCount: number;
  degraded: boolean;
  startTime: Date;
  endTime: Date;
  error?: string;
}

export interface ToolCallRecord {
  name: string;
  args: string;
  result: string;
  ok: boolean;
}

export interface AskTrace {
  recordGeneration(record: GenerationRecord): void;
  recordToolCall(record: ToolCallRecord): void;
  finish(outcome: { answer?: string; error?: string }): void;
  flush(): Promise<void>;
}

// The Astro session id doubles as the session cookie value — a capability —
// so traces carry only a salted hash: enough to group a conversation in the
// Langfuse UI, useless for session hijacking. Salted with the Langfuse secret
// so the hash space is private to the tracing project.
export async function hashForTrace(value: string, salt: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(`${salt}:${value}`),
  );
  return [...new Uint8Array(digest)]
    .slice(0, 12)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export function startAskTrace(
  env: TracingEnv,
  opts: { query: string; sessionIdHash: string | null },
): AskTrace | null {
  const publicKey = env.LANGFUSE_PUBLIC_KEY;
  const secretKey = env.LANGFUSE_SECRET_KEY;
  if (!publicKey || !secretKey) return null;
  try {
    const langfuse = new Langfuse({
      publicKey,
      secretKey,
      baseUrl: env.LANGFUSE_BASE_URL || DEFAULT_BASE_URL,
      requestTimeout: 10_000,
    });
    // Verbose SDK logging (enqueue + ingestion HTTP results) is opt-in via
    // LANGFUSE_DEBUG=true — too loud for every dev session, and production
    // stays quiet unless something actually fails.
    if (env.LANGFUSE_DEBUG === 'true') langfuse.debug();
    const trace = langfuse.trace({
      name: 'cmdk-ask',
      sessionId: opts.sessionIdHash ?? undefined,
      input: opts.query,
    });
    return {
      recordGeneration(record) {
        try {
          trace.generation({
            name: `provider-round-${record.round}`,
            model: record.model,
            input: record.input,
            output: record.error ?? record.output,
            startTime: record.startTime,
            endTime: record.endTime,
            level: record.error ? 'ERROR' : 'DEFAULT',
            metadata: { toolCallCount: record.toolCallCount, degraded: record.degraded },
          });
        } catch (error) {
          console.error('[tracing] generation record failed', error);
        }
      },
      recordToolCall(record) {
        try {
          trace.span({
            name: `tool:${record.name}`,
            input: record.args,
            output: record.result,
            level: record.ok ? 'DEFAULT' : 'ERROR',
          });
        } catch (error) {
          console.error('[tracing] tool span failed', error);
        }
      },
      finish(outcome) {
        try {
          trace.update({
            output: outcome.error ?? outcome.answer ?? '',
            ...(outcome.error ? { metadata: { failed: true } } : {}),
          });
        } catch (error) {
          console.error('[tracing] trace finish failed', error);
        }
      },
      async flush() {
        const startedAt = Date.now();
        try {
          await langfuse.flushAsync();
          if (import.meta.env.DEV) {
            console.log('[tracing] flush completed', { ms: Date.now() - startedAt });
          }
        } catch (error) {
          console.error('[tracing] flush failed', error);
        }
      },
    };
  } catch (error) {
    console.error('[tracing] init failed', error);
    return null;
  }
}
