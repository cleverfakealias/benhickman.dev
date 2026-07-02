import { defineMiddleware } from 'astro:middleware';

// Baseline security headers for RUNTIME (server-rendered) responses only.
// Static/prerendered pages are served by the Workers assets pipeline, where
// public/_headers already stamps this set (plus the CSP) — but _headers never
// applies to responses the Worker generates itself, so /api/* and any
// server-rendered page would ship bare without this middleware. Two layers,
// one owner each: assets → public/_headers, runtime → here.
const BASELINE_SECURITY_HEADERS: ReadonlyArray<readonly [string, string]> = [
  ['Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload'],
  ['X-Content-Type-Options', 'nosniff'],
  ['Referrer-Policy', 'strict-origin-when-cross-origin'],
  ['X-Frame-Options', 'DENY'],
];

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  // Middleware also runs while prerendering at build time; headers set there
  // would be discarded with the Response anyway (only the body is written to
  // disk), but skipping keeps the split above explicit.
  if (context.isPrerendered) return response;
  for (const [name, value] of BASELINE_SECURITY_HEADERS) {
    // `has` before `set` so a route that chose its own value (e.g. a stricter
    // per-route policy) is never overwritten.
    if (!response.headers.has(name)) response.headers.set(name, value);
  }
  return response;
});
