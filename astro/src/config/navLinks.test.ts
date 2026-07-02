import { describe, expect, it } from 'vitest';
import { isActive } from './navLinks';

describe('isActive', () => {
  it('matches "/" only on the exact root path', () => {
    expect(isActive('/', '/')).toBe(true);
    expect(isActive('/', '/work')).toBe(false);
  });

  it('matches an exact non-root path', () => {
    expect(isActive('/work', '/work')).toBe(true);
  });

  it('matches a child path as a prefix', () => {
    expect(isActive('/work', '/work/zenn-ai')).toBe(true);
  });

  it('does not match an unrelated path that merely shares a prefix string', () => {
    // "/work" must not match "/workshop" — the bug a naive startsWith(href) would have.
    expect(isActive('/work', '/workshop')).toBe(false);
  });

  it('normalizes a trailing slash on the current pathname before comparing', () => {
    expect(isActive('/work', '/work/')).toBe(true);
    expect(isActive('/', '//')).toBe(true);
  });

  it('does not match a sibling route', () => {
    expect(isActive('/work', '/writing')).toBe(false);
    expect(isActive('/work', '/writing/some-post')).toBe(false);
  });
});
