// Shared hardening helpers for the runtime API endpoints (currently
// /api/cmdk). Everything here runs on both the Workers runtime and the
// Node 22 vitest environment (Web Crypto, Headers, URL are available in both).

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0']);

/**
 * True when the request targets a local dev host. Used to relax the Turnstile
 * hostname/action checks that would otherwise reject Cloudflare's public test
 * keys during `astro dev` / `wrangler dev`.
 */
export function isLocalRequest(request: Request): boolean {
  return LOCAL_HOSTS.has(new URL(request.url).hostname);
}

/** True for the hostnames Turnstile reports when running against local dev. */
export function isLocalHostname(hostname: string): boolean {
  return LOCAL_HOSTS.has(hostname);
}

/**
 * Privacy-preserving quota key material: SHA-256 over `ip|day|secret` via Web
 * Crypto, hex-truncated to 16 chars. Raw client IPs are personal data under
 * GDPR, so they must never appear in KV keys; folding the day into the hash
 * also stops entries being linked across days. The Turnstile secret doubles as
 * the salt — it is already present wherever quotas are enforced, so no new
 * secret needs provisioning.
 */
export async function hashIp(ip: string, day: string, secret: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(`${ip}|${day}|${secret}`),
  );
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 16);
}

/**
 * Cheap pre-parse request body cap based on Content-Length, which the
 * Cloudflare edge sets for ordinary JSON posts. Requests without the header
 * (rare chunked bodies) fall through to the JSON parser's failure modes and
 * the existing post-parse character caps, so this is a fast-reject layer, not
 * the only defence.
 */
export function exceedsBodyLimit(request: Request, maxBytes: number): boolean {
  const contentLength = Number(request.headers.get('content-length') ?? '0');
  return Number.isFinite(contentLength) && contentLength > maxBytes;
}
