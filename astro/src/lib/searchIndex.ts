import { projects, getProjectsWithDetail } from '@/data/projects';
import { getAllPosts } from '@/lib/sanity';

// Build-time index for the ⌘K palette (v1 = local, no LLM). Served from the
// prerendered /search-index.json endpoint and fetched by the CommandPalette
// island on first open — not inlined as a prop, which duplicated ~7 KB into
// every prerendered page. Memoized so the Sanity fetch runs once across the
// whole build, not per page.

export type SearchGroup = 'Pages' | 'Projects' | 'Writing';

export interface SearchItem {
  group: SearchGroup;
  label: string;
  sublabel?: string;
  href: string;
  /** Extra text folded into the fuzzy match (tags, etc.). */
  keywords?: string;
}

const PAGES: SearchItem[] = [
  { group: 'Pages', label: 'Home', href: '/', keywords: 'start landing' },
  { group: 'Pages', label: 'Work', href: '/work', keywords: 'projects portfolio agents rag models' },
  { group: 'Pages', label: 'Writing', href: '/writing', keywords: 'blog posts notes articles' },
  { group: 'Pages', label: 'About', href: '/about', keywords: 'bio engineer resume' },
  { group: 'Pages', label: 'Contact', href: '/contact', keywords: 'email hire message reach out' },
  { group: 'Pages', label: 'Privacy', href: '/privacy', keywords: 'cookies gdpr policy' },
];

let cache: SearchItem[] | null = null;

export async function buildSearchIndex(): Promise<SearchItem[]> {
  if (cache) return cache;

  const detailSlugs = new Set(getProjectsWithDetail().map((p) => p.slug));
  const projectItems: SearchItem[] = projects.map((p) => ({
    group: 'Projects',
    label: p.name,
    sublabel: `${p.group} · ${p.maturity}`,
    href: detailSlugs.has(p.slug) ? `/work/${p.slug}` : '/work',
    keywords: `${p.tags.join(' ')} ${p.summary}`,
  }));

  let writingItems: SearchItem[] = [];
  try {
    const posts = await getAllPosts();
    writingItems = posts.map((post) => ({
      group: 'Writing',
      label: post.title,
      sublabel: post.publishedAt
        ? new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
        : undefined,
      href: `/writing/${post.slug}`,
      keywords: post.excerpt ?? '',
    }));
  } catch {
    writingItems = [];
  }

  cache = [...PAGES, ...projectItems, ...writingItems];
  return cache;
}
