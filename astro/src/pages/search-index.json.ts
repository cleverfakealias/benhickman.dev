import type { APIRoute } from 'astro';
import { buildSearchIndex } from '@/lib/searchIndex';

// The ⌘K palette's search index as a prerendered static asset. Fetched once by
// the CommandPalette island on first open instead of being serialized into a
// props attribute on every prerendered page (~7 KB duplicated 20×).
export const prerender = true;

export const GET: APIRoute = async () => {
  const items = await buildSearchIndex();
  return new Response(JSON.stringify(items), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
};
