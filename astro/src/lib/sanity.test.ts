import { beforeEach, describe, expect, it, vi } from 'vitest';

// createClient runs at module scope in sanity.ts, so the mock must be hoisted;
// the shared fetch spy is threaded out via vi.hoisted. The image-url builder is
// left real — URL assertions below exercise the actual query-string output.
const { fetchMock } = vi.hoisted(() => ({ fetchMock: vi.fn() }));

vi.mock('@sanity/client', () => ({
  createClient: () => ({ fetch: fetchMock }),
}));

import { getAllPosts, getAllPostSlugs, getPostBySlug, responsiveImageAttrs } from '@/lib/sanity';

const source = {
  _type: 'image',
  asset: { _ref: 'image-abc123-1600x800-jpg', _type: 'reference' },
};

describe('post fetchers', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    // Each fetcher logs before rethrowing; keep test output clean.
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('rethrows fetch failures so a broken Sanity call fails the build', async () => {
    fetchMock.mockRejectedValue(new Error('sanity down'));
    await expect(getAllPosts()).rejects.toThrow('sanity down');
    await expect(getPostBySlug('some-post')).rejects.toThrow('sanity down');
    await expect(getAllPostSlugs()).rejects.toThrow('sanity down');
  });

  it('passes empty results through so the writing empty state stays reachable', async () => {
    fetchMock.mockResolvedValueOnce([]);
    await expect(getAllPosts()).resolves.toEqual([]);
    fetchMock.mockResolvedValueOnce(null);
    await expect(getPostBySlug('missing')).resolves.toBeNull();
    fetchMock.mockResolvedValueOnce([]);
    await expect(getAllPostSlugs()).resolves.toEqual([]);
  });
});

describe('responsiveImageAttrs', () => {
  it('builds a 400–1600 srcset ladder with auto=format on every candidate', () => {
    const { src, srcset } = responsiveImageAttrs(source, { baseWidth: 800, aspectRatio: 2 });
    const entries = srcset.split(', ');

    expect(entries.map((e) => e.split(' ')[1])).toEqual(['400w', '800w', '1200w', '1600w']);
    for (const entry of entries) {
      const url = entry.split(' ')[0];
      expect(url).toBeDefined();
      expect(new URL(url as string).searchParams.get('auto')).toBe('format');
    }
    expect(new URL(src).searchParams.get('w')).toBe('800');
  });

  it('re-applies the crop ratio at every width', () => {
    const { srcset } = responsiveImageAttrs(source, { baseWidth: 800, aspectRatio: 2 });
    const first = srcset.split(', ')[0]?.split(' ')[0];
    const params = new URL(first as string).searchParams;

    expect(params.get('w')).toBe('400');
    expect(params.get('h')).toBe('200');
    expect(params.get('fit')).toBe('crop');
  });

  it('falls back to fit=max with no forced height when no ratio is given', () => {
    const { src } = responsiveImageAttrs(source, { baseWidth: 1200 });
    const params = new URL(src).searchParams;

    expect(params.get('w')).toBe('1200');
    expect(params.get('fit')).toBe('max');
    expect(params.has('h')).toBe(false);
  });
});
