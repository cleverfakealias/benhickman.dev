import type { APIRoute } from 'astro';
import type { CorpusPost } from '@/lib/assistantTools';
import { getAllPostsWithBody, portableTextToPlainText } from '@/lib/sanity';

// The ⌘K assistant's post corpus as a prerendered static asset (modeled on
// search-index.json.ts): the cmdk Worker fetches it once per isolate via the
// ASSETS binding to answer get_post tool calls. Public content only by
// construction — it re-shapes the same published posts already rendered on
// /writing, nothing more.
export const prerender = true;

// Per-post plaintext budget; tool results are capped again at read time
// (MAX_TOOL_RESULT_CHARS), this just keeps the asset itself small.
const MAX_TEXT_CHARS = 4_000;

export const GET: APIRoute = async () => {
  let corpus: CorpusPost[] = [];
  try {
    const posts = await getAllPostsWithBody();
    corpus = posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      ...(post.publishedAt ? { publishedAt: post.publishedAt } : {}),
      ...(post.excerpt ? { excerpt: post.excerpt } : {}),
      text: portableTextToPlainText(post.body).slice(0, MAX_TEXT_CHARS),
    }));
  } catch (error) {
    // Unlike the writing pages (where a swallowed Sanity error would silently
    // 404 every post), an empty corpus only degrades the assistant's get_post
    // tool — never fail the build for it.
    console.error('[assistant-corpus] Sanity fetch failed — emitting empty corpus:', error);
    corpus = [];
  }
  return new Response(JSON.stringify(corpus), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
};
