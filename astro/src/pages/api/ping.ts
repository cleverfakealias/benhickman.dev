import type { APIRoute } from 'astro';

// SERVER ENDPOINT: runs on the Cloudflare Worker at request time (never prerendered).
export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  // Astro 7 + CF adapter: read Worker env/bindings via the `cloudflare:workers`
  // module (the old `Astro.locals.runtime.env` API was removed). Imported lazily
  // so the prerender pass never evaluates the binding proxy.
  const { env } = await import('cloudflare:workers');

  const body = {
    ok: true,
    runtime: 'cloudflare-worker',
    // Proves request-time execution: a fresh timestamp per request, not build time.
    now: new Date().toISOString(),
    method: request.method,
    // Confirms a binding is reachable without leaking secrets.
    hasAssetsBinding: typeof env?.ASSETS !== 'undefined',
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
};
