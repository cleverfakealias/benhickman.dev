import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { extractInlineScriptHashes, injectScriptHashes } from './cspHashes.mjs';

const sha = (s) => `'sha256-${createHash('sha256').update(s, 'utf8').digest('base64')}'`;

describe('extractInlineScriptHashes', () => {
  it('hashes classic and module inline scripts, exact content', () => {
    const html = '<head><script>let a=1;</script><script type="module">let b=2;</script></head>';
    expect(extractInlineScriptHashes(html)).toEqual([sha('let a=1;'), sha('let b=2;')]);
  });

  it('skips external scripts and non-executable types', () => {
    const html = [
      '<script src="/x.js"></script>',
      '<script type="application/ld+json">{"@type":"WebSite"}</script>',
      '<script type="application/json">{}</script>',
      '<script>run()</script>',
    ].join('');
    expect(extractInlineScriptHashes(html)).toEqual([sha('run()')]);
  });

  it('preserves whitespace in the hashed content (CSP hashes are byte-exact)', () => {
    const body = '\n  doTheme();\n';
    expect(extractInlineScriptHashes(`<script>${body}</script>`)).toEqual([sha(body)]);
  });
});

describe('injectScriptHashes', () => {
  const headers = [
    "# comment mentioning script-src 'unsafe-inline' — must never be rewritten",
    '/*',
    "  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://x.example; style-src 'self' 'unsafe-inline'",
    '  X-Frame-Options: DENY',
  ].join('\n');

  it("replaces 'unsafe-inline' only inside script-src, deduped and sorted", () => {
    const out = injectScriptHashes(headers, ["'sha256-bbb'", "'sha256-aaa'", "'sha256-bbb'"]);
    expect(out).toContain("script-src 'self' 'sha256-aaa' 'sha256-bbb' https://x.example");
    expect(out).toContain("style-src 'self' 'unsafe-inline'");
  });

  it('never rewrites comment lines, even when they mention the directive', () => {
    const out = injectScriptHashes(headers, ["'sha256-aaa'"]);
    expect(out).toContain("# comment mentioning script-src 'unsafe-inline' — must never be rewritten");
  });

  it('throws when script-src has no unsafe-inline to replace (CSP drift guard)', () => {
    const drifted = headers.replace("script-src 'self' 'unsafe-inline'", "script-src 'self'");
    expect(() => injectScriptHashes(drifted, ["'sha256-aaa'"])).toThrow(/drifted/);
  });
});
