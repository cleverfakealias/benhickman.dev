import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PostSummary } from '@/lib/sanity';

// buildSearchIndex memoizes at module level, so each test re-imports a fresh
// copy via vi.resetModules() to start from an empty cache. The project mocks
// live inside the hoisted vi.mock factory (it runs before module-level consts).

vi.mock('@/data/projects', () => {
  const base = {
    group: 'Agents',
    maturity: 'shipped',
    summary: 'A summary.',
    tags: ['ts', 'agents'],
    description: 'A description.',
  };
  const items = [
    {
      ...base,
      slug: 'with-detail',
      name: 'With Detail',
      tier: 'hero',
      detail: [{ heading: 'H', body: 'B' }],
    },
    { ...base, slug: 'list-only', name: 'List Only', tier: 'supporting' },
  ];
  return {
    projects: items,
    getProjectsWithDetail: () => items.filter((p) => 'detail' in p),
  };
});

vi.mock('@/lib/sanity', () => ({
  getAllPosts: vi.fn(),
}));

const posts: PostSummary[] = [
  {
    _id: 'p1',
    title: 'Shipping an agent',
    slug: 'shipping-an-agent',
    excerpt: 'Notes from production.',
    publishedAt: '2026-05-04T00:00:00Z',
  },
  { _id: 'p2', title: 'Undated draft', slug: 'undated-draft' },
];

async function freshImports() {
  vi.resetModules();
  const sanity = await import('@/lib/sanity');
  const getAllPosts = vi.mocked(sanity.getAllPosts);
  const { buildSearchIndex } = await import('@/lib/searchIndex');
  return { buildSearchIndex, getAllPosts };
}

describe('buildSearchIndex', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('links detail-page projects to /work/<slug> and list-only projects to /work', async () => {
    const { buildSearchIndex, getAllPosts } = await freshImports();
    getAllPosts.mockResolvedValue([]);
    const index = await buildSearchIndex();

    const withDetail = index.find((i) => i.label === 'With Detail');
    const listOnly = index.find((i) => i.label === 'List Only');
    expect(withDetail?.href).toBe('/work/with-detail');
    expect(listOnly?.href).toBe('/work');
  });

  it('maps posts into Writing items with slugged hrefs and month sublabels', async () => {
    const { buildSearchIndex, getAllPosts } = await freshImports();
    getAllPosts.mockResolvedValue(posts);
    const index = await buildSearchIndex();

    const writing = index.filter((i) => i.group === 'Writing');
    expect(writing).toHaveLength(2);
    expect(writing[0]).toMatchObject({
      label: 'Shipping an agent',
      href: '/writing/shipping-an-agent',
      keywords: 'Notes from production.',
    });
    expect(writing[0]?.sublabel).toContain('2026');
    expect(writing[1]?.sublabel).toBeUndefined();
  });

  it('degrades to pages + projects when the Sanity fetch fails', async () => {
    const { buildSearchIndex, getAllPosts } = await freshImports();
    getAllPosts.mockRejectedValue(new Error('sanity down'));
    const index = await buildSearchIndex();

    expect(index.some((i) => i.group === 'Pages')).toBe(true);
    expect(index.some((i) => i.group === 'Projects')).toBe(true);
    expect(index.some((i) => i.group === 'Writing')).toBe(false);
  });

  it('memoizes: the Sanity fetch runs once across repeated calls', async () => {
    const { buildSearchIndex, getAllPosts } = await freshImports();
    getAllPosts.mockResolvedValue(posts);
    const first = await buildSearchIndex();
    const second = await buildSearchIndex();

    expect(getAllPosts).toHaveBeenCalledTimes(1);
    expect(second).toBe(first);
  });
});
