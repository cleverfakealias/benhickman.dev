import { projects } from '@/data/projects';
import { scoreItem } from '@/lib/scoreItem';
import type { SearchItem } from '@/lib/searchIndex';

// Tooling for the ⌘K assistant's tool-calling loop (api/cmdk.ts). One module
// owns the OpenAI-format schemas, argument validation, execution, and the
// loaders for the two prerendered assets the tools read. Everything here is
// read-only over public build-time data: no user-supplied URLs, no writes.

export interface CorpusPost {
  slug: string;
  title: string;
  publishedAt?: string;
  excerpt?: string;
  /** Plaintext body, truncated at build time (see assistant-corpus.json.ts). */
  text: string;
}

export interface ToolContext {
  corpus: CorpusPost[];
  index: SearchItem[];
}

// `ok: false` content is a model-facing error string — runTool never throws,
// so a bad tool call costs one round, not the whole stream.
export interface ToolResult {
  ok: boolean;
  content: string;
}

// Worker ASSETS binding, typed structurally (like RateLimiterLike in
// api/cmdk.ts) so vitest node tests never depend on `wrangler types` output.
export interface AssetsFetcherLike {
  fetch(input: RequestInfo | URL): Promise<Response>;
}

// OpenAI chat.completions `tools` entry, typed structurally — no openai dep.
export interface ToolDefinition {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, unknown>;
      required: string[];
      additionalProperties: boolean;
    };
  };
}

export const MAX_TOOL_RESULT_CHARS = 2_000;

const MIN_QUERY_CHARS = 2;
const MAX_QUERY_CHARS = 100;
const MAX_SEARCH_RESULTS = 5;
// Dropped from per-token scoring so "posts about supabase and discord" ranks
// by the content words, not the glue.
const SEARCH_STOPWORDS = new Set([
  'a', 'an', 'and', 'about', 'for', 'his', 'in', 'of', 'on', 'or', 'the', 'to', 'with',
]);

// Human-readable labels for SSE `status` events while a tool runs. Args are
// the parsed (unvalidated) tool arguments, so narrow before interpolating.
export const TOOL_STATUS_LABELS: Record<string, (args: Record<string, unknown>) => string> = {
  search_site: () => 'Searching the site…',
  get_project: (args) => `Looking up ${typeof args.slug === 'string' ? args.slug : 'a project'}…`,
  get_post: (args) => `Reading ${typeof args.slug === 'string' ? args.slug : 'a post'}…`,
};

// get_project publishes the real slugs as a JSON-schema enum so the model
// never has to guess; get_post slugs live in the corpus (only known at
// runtime), so its schema stays open and validation happens in runTool.
export function buildTools(): ToolDefinition[] {
  return [
    {
      type: 'function',
      function: {
        name: 'search_site',
        description:
          'Fuzzy-search all pages, projects, and writing on this site. Returns up to ' +
          `${MAX_SEARCH_RESULTS} matches as "label (group) — href" lines. ` +
          'Short keywords work best (e.g. "supabase discord"), not full sentences.',
        parameters: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              minLength: MIN_QUERY_CHARS,
              maxLength: MAX_QUERY_CHARS,
              description: 'Search terms, 2–100 characters.',
            },
          },
          required: ['query'],
          additionalProperties: false,
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'get_project',
        description:
          "Full verified details for one of Ben's projects: summary, description, tags, and detail sections.",
        parameters: {
          type: 'object',
          properties: {
            slug: {
              type: 'string',
              enum: projects.map((project) => project.slug),
              description: 'Project slug from the enum.',
            },
          },
          required: ['slug'],
          additionalProperties: false,
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'get_post',
        description:
          'Read a blog post from /writing by slug: title, date, excerpt, and plaintext body. ' +
          'Use search_site first if you only know the topic.',
        parameters: {
          type: 'object',
          properties: {
            slug: {
              type: 'string',
              description: 'Post slug, e.g. the last segment of a /writing/<slug> href.',
            },
          },
          required: ['slug'],
          additionalProperties: false,
        },
      },
    },
  ];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function cap(content: string): string {
  return content.length > MAX_TOOL_RESULT_CHARS ? content.slice(0, MAX_TOOL_RESULT_CHARS) : content;
}

function searchSite(args: Record<string, unknown>, ctx: ToolContext): ToolResult {
  const query = typeof args.query === 'string' ? args.query.trim() : '';
  if (query.length < MIN_QUERY_CHARS || query.length > MAX_QUERY_CHARS) {
    return {
      ok: false,
      content: `Invalid arguments: query must be ${MIN_QUERY_CHARS}–${MAX_QUERY_CHARS} characters.`,
    };
  }
  // Models pass natural-language queries ("supabase and discord"), which the
  // palette's whole-query fuzzy match rejects. Score the full query (any tier)
  // PLUS each meaningful token, but tokens only at substring strength (≥50) —
  // the loose subsequence tier (20) on short tokens would drown real hits.
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .filter((token) => token.length >= MIN_QUERY_CHARS && !SEARCH_STOPWORDS.has(token));
  const scored = new Map<SearchItem, number>();
  for (const item of ctx.index) {
    let total = scoreItem(item, query) ?? 0;
    for (const token of tokens) {
      const tokenScore = scoreItem(item, token);
      if (tokenScore !== null && tokenScore >= 50) total += tokenScore;
    }
    if (total > 0) scored.set(item, total);
  }
  const matches = [...scored.entries()].sort((a, b) => b[1] - a[1]).slice(0, MAX_SEARCH_RESULTS);
  if (matches.length === 0) return { ok: true, content: 'No matches found.' };
  return {
    ok: true,
    content: matches.map(([item]) => `${item.label} (${item.group}) — ${item.href}`).join('\n'),
  };
}

function getProject(args: Record<string, unknown>): ToolResult {
  const slug = typeof args.slug === 'string' ? args.slug.trim() : '';
  const project = projects.find((candidate) => candidate.slug === slug);
  if (!project) {
    return {
      ok: false,
      content: `Invalid arguments: unknown project slug "${slug.slice(0, 100)}". Valid slugs: ${projects
        .map((candidate) => candidate.slug)
        .join(', ')}.`,
    };
  }
  const lines = [
    `${project.name} (${project.group}, ${project.maturity})`,
    project.summary,
    project.description,
    `Tags: ${project.tags.join(', ')}`,
    ...(project.detail ?? []).map((section) => `${section.heading}: ${section.body}`),
  ];
  return { ok: true, content: lines.join('\n') };
}

function getPost(args: Record<string, unknown>, ctx: ToolContext): ToolResult {
  const slug = typeof args.slug === 'string' ? args.slug.trim() : '';
  const post = ctx.corpus.find((candidate) => candidate.slug === slug);
  if (!post) {
    return {
      ok: false,
      content: `Invalid arguments: unknown post slug "${slug.slice(0, 100)}". Use search_site to find posts.`,
    };
  }
  const lines = [
    post.title,
    post.publishedAt ? `Published: ${post.publishedAt}` : null,
    post.excerpt ? `Excerpt: ${post.excerpt}` : null,
    '',
    post.text,
  ].filter((line): line is string => line !== null);
  return { ok: true, content: lines.join('\n') };
}

// NEVER throws: unknown tool, malformed JSON, and invalid args all come back
// as model-facing `ok: false` results. Every content is capped so a tool can
// never blow up the prompt budget.
export function runTool(name: string, rawArgs: string, ctx: ToolContext): ToolResult {
  let args: Record<string, unknown>;
  try {
    // Some providers send '' for no-arg calls; treat it as an empty object so
    // the per-tool validation produces the more useful error.
    const parsed: unknown = JSON.parse(rawArgs || '{}');
    if (!isRecord(parsed)) return { ok: false, content: 'Invalid arguments: expected a JSON object.' };
    args = parsed;
  } catch {
    return { ok: false, content: 'Invalid arguments: malformed JSON.' };
  }

  let result: ToolResult;
  switch (name) {
    case 'search_site':
      result = searchSite(args, ctx);
      break;
    case 'get_project':
      result = getProject(args);
      break;
    case 'get_post':
      result = getPost(args, ctx);
      break;
    default:
      result = { ok: false, content: `Unknown tool: ${name.slice(0, 100)}` };
  }
  return { ok: result.ok, content: cap(result.content) };
}

// ---------------------------------------------------------------------------
// Prerendered-asset loaders. Both assets are static per deploy, so one
// successful fetch serves the whole isolate (module-level cache — mirrors the
// CommandPalette island's index cache). ANY failure returns [] after one
// console.error: the tools answer "unavailable" and chat keeps working.

function isCorpusPost(value: unknown): value is CorpusPost {
  if (!isRecord(value)) return false;
  return typeof value.slug === 'string' && typeof value.title === 'string' && typeof value.text === 'string';
}

// Mirrors isSearchItem in CommandPalette.tsx — kept private there, and this
// copy validates the server-side trust boundary independently.
function isSearchItem(value: unknown): value is SearchItem {
  if (!isRecord(value)) return false;
  return (
    (value.group === 'Pages' || value.group === 'Projects' || value.group === 'Writing') &&
    typeof value.label === 'string' &&
    typeof value.href === 'string'
  );
}

async function loadAsset<T>(
  assets: AssetsFetcherLike | undefined,
  origin: string,
  path: string,
  isItem: (value: unknown) => value is T,
): Promise<T[] | null> {
  const url = new URL(path, origin);
  // In production the ASSETS binding serves the prerendered file directly.
  // Under `astro dev` the binding exists but 404s (prerendered endpoints are
  // rendered on demand, not emitted as static files), so fall back to a plain
  // same-origin fetch — the dev server renders it; in production this branch
  // only runs if ASSETS itself failed, and the self-request still terminates
  // at the static file rather than re-entering the Worker.
  const attempts: (() => Promise<Response>)[] = [];
  if (assets) attempts.push(() => assets.fetch(url));
  attempts.push(() => fetch(url));
  let lastError: unknown = new Error('ASSETS binding missing');
  for (const attempt of attempts) {
    try {
      const response = await attempt();
      if (!response.ok) throw new Error(`asset request failed (${response.status})`);
      const payload: unknown = await response.json();
      if (!Array.isArray(payload)) throw new Error('asset payload is malformed');
      return payload.filter(isItem);
    } catch (error) {
      lastError = error;
    }
  }
  console.error(`[assistantTools] failed to load ${path}`, lastError);
  return null;
}

let corpusCache: CorpusPost[] | null = null;
let indexCache: SearchItem[] | null = null;

export async function loadCorpus(
  assets: AssetsFetcherLike | undefined,
  origin: string,
): Promise<CorpusPost[]> {
  if (corpusCache) return corpusCache;
  const loaded = await loadAsset(assets, origin, '/assistant-corpus.json', isCorpusPost);
  if (loaded === null) return []; // failure: leave the cache empty so the next call retries
  corpusCache = loaded;
  return corpusCache;
}

export async function loadIndex(
  assets: AssetsFetcherLike | undefined,
  origin: string,
): Promise<SearchItem[]> {
  if (indexCache) return indexCache;
  const loaded = await loadAsset(assets, origin, '/search-index.json', isSearchItem);
  if (loaded === null) return [];
  indexCache = loaded;
  return indexCache;
}
