// Build-time CSP hardening: replace script-src 'unsafe-inline' with per-script
// SHA-256 hashes. Astro emits a handful of static is:inline scripts (theme
// pre-paint, analytics consent bootstrap); their content is fixed per build, so
// the emitted HTML is the source of truth — hash every inline executable
// script in dist and rewrite the _headers CSP to allow exactly those.
// Style-src keeps 'unsafe-inline': style attributes (e.g. PageHeader's
// --lede-max) would need 'unsafe-hashes' and buy little — scripts are the
// escalation risk, styles are not.
import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_RE = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
// Types the browser executes. No `type` attr = classic script.
const EXEC_TYPES = new Set(['module', 'text/javascript', 'application/javascript']);

/**
 * Hashes of every inline executable script in an HTML document.
 * Non-executable types (application/ld+json etc.) don't run and need no hash.
 * @param {string} html
 * @returns {string[]} CSP source tokens, e.g. 'sha256-…'
 */
export function extractInlineScriptHashes(html) {
  const hashes = [];
  for (const match of html.matchAll(SCRIPT_RE)) {
    const attrs = match[1];
    if (/\bsrc\s*=/i.test(attrs)) continue;
    const type = /\btype\s*=\s*["']?([^"'\s>]+)/i.exec(attrs)?.[1];
    if (type && !EXEC_TYPES.has(type.toLowerCase())) continue;
    const digest = createHash('sha256').update(match[2], 'utf8').digest('base64');
    hashes.push(`'sha256-${digest}'`);
  }
  return hashes;
}

/**
 * Swap 'unsafe-inline' inside the script-src directive (only — style-src
 * keeps its own) for the given hash tokens.
 * @param {string} headersText  contents of the _headers file
 * @param {Iterable<string>} hashes  CSP source tokens
 * @returns {string}
 */
export function injectScriptHashes(headersText, hashes) {
  const tokens = [...new Set(hashes)].sort().join(' ');
  let replaced = false;
  const result = headersText
    .split('\n')
    .map((line) => {
      // Only the real header line — the explanatory comment block above it
      // also contains the literal "script-src 'unsafe-inline'" and must not
      // swallow the replacement.
      if (line.trimStart().startsWith('#')) return line;
      if (!/Content-Security-Policy/i.test(line)) return line;
      return line.replace(/(script-src[^;]*)/, (directive) => {
        if (!directive.includes("'unsafe-inline'")) return directive;
        replaced = true;
        return directive.replace("'unsafe-inline'", tokens);
      });
    })
    .join('\n');
  if (!replaced) {
    throw new Error("_headers: no script-src 'unsafe-inline' to replace — CSP drifted?");
  }
  return result;
}

/** @returns {import('astro').AstroIntegration} */
export function cspHashes() {
  return {
    name: 'csp-inline-script-hashes',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const out = fileURLToPath(dir);
        const entries = await readdir(out, { recursive: true, withFileTypes: true });
        const htmlFiles = entries.filter((e) => e.isFile() && e.name.endsWith('.html'));
        const headersEntry = entries.find((e) => e.isFile() && e.name === '_headers');
        if (!headersEntry) throw new Error('csp-hashes: no _headers file in build output');

        const hashes = new Set();
        for (const e of htmlFiles) {
          const html = await readFile(join(e.parentPath, e.name), 'utf8');
          for (const h of extractInlineScriptHashes(html)) hashes.add(h);
        }
        // Zero inline scripts would mean the theme pre-paint script vanished —
        // that's a build regression, not a reason to silently drop the tokens.
        if (hashes.size === 0) throw new Error('csp-hashes: found no inline scripts to hash');

        const headersPath = join(headersEntry.parentPath, headersEntry.name);
        const text = await readFile(headersPath, 'utf8');
        await writeFile(headersPath, injectScriptHashes(text, hashes));
        logger.info(`script-src: 'unsafe-inline' -> ${hashes.size} sha256 hash(es)`);
      },
    },
  };
}
