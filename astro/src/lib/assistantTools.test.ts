import { afterEach, describe, expect, it, vi, type Mock } from 'vitest';
import { projects } from '@/data/projects';
import type { SearchItem } from '@/lib/searchIndex';
import {
  buildTools,
  MAX_TOOL_RESULT_CHARS,
  runTool,
  TOOL_STATUS_LABELS,
  type CorpusPost,
  type ToolContext,
} from './assistantTools';

const CORPUS: CorpusPost[] = [
  {
    slug: 'hello-world',
    title: 'Hello World',
    publishedAt: '2026-01-05',
    excerpt: 'First post.',
    text: 'Body text about building agents.',
  },
];

const INDEX: SearchItem[] = [
  { group: 'Pages', label: 'Contact', href: '/contact', keywords: 'email hire message' },
  { group: 'Pages', label: 'Writing', href: '/writing', keywords: 'blog posts' },
  { group: 'Projects', label: 'zenn_ai', sublabel: 'Agents · deployed', href: '/work/zenn-ai', keywords: 'agents' },
];

const ctx: ToolContext = { corpus: CORPUS, index: INDEX };

describe('runTool', () => {
  it('returns a model-facing error for an unknown tool (never throws)', () => {
    const result = runTool('launch_missiles', '{}', ctx);
    expect(result.ok).toBe(false);
    expect(result.content).toMatch(/unknown tool/i);
  });

  it('returns a model-facing error for malformed argument JSON', () => {
    const result = runTool('search_site', '{"query": "cont', ctx);
    expect(result.ok).toBe(false);
    expect(result.content).toMatch(/malformed json/i);
  });

  it('rejects non-object argument JSON', () => {
    const result = runTool('search_site', '"contact"', ctx);
    expect(result.ok).toBe(false);
    expect(result.content).toMatch(/invalid arguments/i);
  });

  describe('search_site', () => {
    it('rejects a query shorter than 2 chars (after trimming)', () => {
      const result = runTool('search_site', JSON.stringify({ query: ' c ' }), ctx);
      expect(result.ok).toBe(false);
      expect(result.content).toMatch(/2–100/);
    });

    it('rejects a query longer than 100 chars', () => {
      const result = runTool('search_site', JSON.stringify({ query: 'x'.repeat(101) }), ctx);
      expect(result.ok).toBe(false);
      expect(result.content).toMatch(/2–100/);
    });

    it('rejects a missing/non-string query', () => {
      expect(runTool('search_site', '{}', ctx).ok).toBe(false);
      expect(runTool('search_site', JSON.stringify({ query: 42 }), ctx).ok).toBe(false);
    });

    it('returns matches as "label (group) — href" lines', () => {
      const result = runTool('search_site', JSON.stringify({ query: 'contact' }), ctx);
      expect(result.ok).toBe(true);
      expect(result.content).toContain('Contact (Pages) — /contact');
    });

    it('caps results at 5 lines', () => {
      const bigIndex: SearchItem[] = Array.from({ length: 8 }, (_, i) => ({
        group: 'Writing' as const,
        label: `agents post ${i}`,
        href: `/writing/agents-${i}`,
      }));
      const result = runTool('search_site', JSON.stringify({ query: 'agents' }), {
        corpus: CORPUS,
        index: bigIndex,
      });
      expect(result.ok).toBe(true);
      expect(result.content.split('\n')).toHaveLength(5);
    });

    it('reports no matches as an ok result', () => {
      const result = runTool('search_site', JSON.stringify({ query: 'zzqqxxyy' }), ctx);
      expect(result.ok).toBe(true);
      expect(result.content).toBe('No matches found.');
    });

    it('matches natural-language queries by content tokens, ignoring stopwords', () => {
      // Models send phrases like "supabase and discord"; whole-query fuzzy
      // matching alone rejects them because of the reordered glue words.
      const index: SearchItem[] = [
        {
          group: 'Writing' as const,
          label: 'Building an Open Brain: A Persistent AI Memory System with Supabase, Discord, and MCP',
          href: '/writing/building-open-brain-with-supabase-and-discord',
        },
        { group: 'Pages' as const, label: 'Contact', href: '/contact' },
      ];
      const result = runTool('search_site', JSON.stringify({ query: 'supabase and discord' }), {
        corpus: CORPUS,
        index,
      });
      expect(result.ok).toBe(true);
      expect(result.content).toContain('/writing/building-open-brain-with-supabase-and-discord');
      expect(result.content).not.toContain('/contact');
    });
  });

  describe('get_project', () => {
    it('rejects an unknown project slug and lists valid ones', () => {
      const result = runTool('get_project', JSON.stringify({ slug: 'not-a-project' }), ctx);
      expect(result.ok).toBe(false);
      expect(result.content).toMatch(/unknown project slug/i);
      expect(result.content).toContain('zenn-ai');
    });

    it('returns name, group, maturity, tags, and detail sections for a valid slug', () => {
      const result = runTool('get_project', JSON.stringify({ slug: 'zenn-ai' }), ctx);
      expect(result.ok).toBe(true);
      expect(result.content).toContain('zenn_ai (Agents, deployed)');
      expect(result.content).toContain('Tags: ');
      expect(result.content).toContain('Architecture:');
      expect(result.content.length).toBeLessThanOrEqual(MAX_TOOL_RESULT_CHARS);
    });
  });

  describe('get_post', () => {
    it('rejects a slug that is not in the corpus', () => {
      const result = runTool('get_post', JSON.stringify({ slug: 'no-such-post' }), ctx);
      expect(result.ok).toBe(false);
      expect(result.content).toMatch(/unknown post slug/i);
    });

    it('returns title, date, excerpt, and body for a valid slug', () => {
      const result = runTool('get_post', JSON.stringify({ slug: 'hello-world' }), ctx);
      expect(result.ok).toBe(true);
      expect(result.content).toContain('Hello World');
      expect(result.content).toContain('Published: 2026-01-05');
      expect(result.content).toContain('Excerpt: First post.');
      expect(result.content).toContain('Body text about building agents.');
    });

    it('caps an over-long result at MAX_TOOL_RESULT_CHARS', () => {
      const longCorpus: CorpusPost[] = [
        { slug: 'long-post', title: 'Long Post', text: 'x'.repeat(MAX_TOOL_RESULT_CHARS * 3) },
      ];
      const result = runTool('get_post', JSON.stringify({ slug: 'long-post' }), {
        corpus: longCorpus,
        index: INDEX,
      });
      expect(result.ok).toBe(true);
      expect(result.content).toHaveLength(MAX_TOOL_RESULT_CHARS);
    });
  });
});

describe('buildTools', () => {
  it('defines exactly the three tools in OpenAI function format', () => {
    const tools = buildTools();
    expect(tools.map((tool) => tool.function.name)).toEqual(['search_site', 'get_project', 'get_post']);
    for (const tool of tools) {
      expect(tool.type).toBe('function');
      expect(tool.function.parameters.type).toBe('object');
    }
  });

  it('publishes the real project slugs as the get_project enum', () => {
    const tool = buildTools().find((candidate) => candidate.function.name === 'get_project');
    const slugProperty = tool?.function.parameters.properties.slug as { enum?: string[] };
    expect(slugProperty.enum).toEqual(projects.map((project) => project.slug));
  });
});

describe('TOOL_STATUS_LABELS', () => {
  it('produces a human label for every tool, interpolating slugs when present', () => {
    expect(TOOL_STATUS_LABELS.search_site?.({ query: 'agents' })).toBe('Searching the site…');
    expect(TOOL_STATUS_LABELS.get_project?.({ slug: 'zenn-ai' })).toBe('Looking up zenn-ai…');
    expect(TOOL_STATUS_LABELS.get_post?.({ slug: 'hello-world' })).toBe('Reading hello-world…');
  });

  it('falls back to a generic label when args are malformed', () => {
    expect(TOOL_STATUS_LABELS.get_project?.({})).toBe('Looking up a project…');
    expect(TOOL_STATUS_LABELS.get_post?.({ slug: 42 })).toBe('Reading a post…');
  });
});

// Loader tests import a FRESH module instance per test (vi.resetModules) so
// the module-level isolate cache from one test never leaks into the next.
async function freshModule(): Promise<typeof import('./assistantTools')> {
  vi.resetModules();
  return import('./assistantTools');
}

type AssetsFetchMock = Mock<(input: RequestInfo | URL) => Promise<Response>>;

function jsonFetcher(body: string): { fetch: AssetsFetchMock } {
  return {
    fetch: vi.fn(async (_input: RequestInfo | URL) => {
      return new Response(body, { headers: { 'content-type': 'application/json' } });
    }),
  };
}

const ORIGIN = 'https://benhickman.dev';

describe('loadCorpus / loadIndex', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns [] and logs once when the ASSETS binding is missing', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const mod = await freshModule();
    expect(await mod.loadCorpus(undefined, ORIGIN)).toEqual([]);
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it('returns [] and logs once for a malformed (non-array) payload', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const mod = await freshModule();
    const fetcher = jsonFetcher(JSON.stringify({ nope: true }));
    expect(await mod.loadCorpus(fetcher, ORIGIN)).toEqual([]);
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it('returns [] and logs once for JSON that does not parse', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const mod = await freshModule();
    expect(await mod.loadCorpus(jsonFetcher('{not json'), ORIGIN)).toEqual([]);
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it('returns [] and logs once for a non-OK response', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const mod = await freshModule();
    const fetcher = {
      fetch: vi.fn(async (_input: RequestInfo | URL) => new Response('nope', { status: 404 })),
    };
    expect(await mod.loadCorpus(fetcher, ORIGIN)).toEqual([]);
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it('filters invalid items instead of rejecting the whole payload', async () => {
    const mod = await freshModule();
    const fetcher = jsonFetcher(
      JSON.stringify([CORPUS[0], { slug: 'missing-text', title: 'Bad' }, 'not even an object']),
    );
    const corpus = await mod.loadCorpus(fetcher, ORIGIN);
    expect(corpus).toHaveLength(1);
    expect(corpus[0]?.slug).toBe('hello-world');
  });

  it('caches per isolate: a second loadCorpus call does not re-fetch', async () => {
    const mod = await freshModule();
    const fetcher = jsonFetcher(JSON.stringify(CORPUS));
    const first = await mod.loadCorpus(fetcher, ORIGIN);
    const second = await mod.loadCorpus(fetcher, ORIGIN);
    expect(fetcher.fetch).toHaveBeenCalledTimes(1);
    expect(second).toBe(first);
  });

  it('loadIndex validates items like the palette does and caches identically', async () => {
    const mod = await freshModule();
    const fetcher = jsonFetcher(
      JSON.stringify([INDEX[0], { group: 'Bogus', label: 'x', href: '/x' }, { label: 'no group' }]),
    );
    const first = await mod.loadIndex(fetcher, ORIGIN);
    await mod.loadIndex(fetcher, ORIGIN);
    expect(first).toEqual([INDEX[0]]);
    expect(fetcher.fetch).toHaveBeenCalledTimes(1);
  });

  it('requests the corpus and index from their prerendered asset paths', async () => {
    const mod = await freshModule();
    const corpusFetcher = jsonFetcher('[]');
    const indexFetcher = jsonFetcher('[]');
    await mod.loadCorpus(corpusFetcher, ORIGIN);
    await mod.loadIndex(indexFetcher, ORIGIN);
    expect(String(corpusFetcher.fetch.mock.calls[0]?.[0])).toBe(`${ORIGIN}/assistant-corpus.json`);
    expect(String(indexFetcher.fetch.mock.calls[0]?.[0])).toBe(`${ORIGIN}/search-index.json`);
  });
});
