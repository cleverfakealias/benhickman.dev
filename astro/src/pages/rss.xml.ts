import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { site } from '@/config/site';
import { getAllPosts } from '@/lib/sanity';

// STATIC ENDPOINT: this app is output:'server', so endpoints default to SSR —
// prerender the feed at build time (posts only change on rebuild anyway).
export const prerender = true;

export const GET: APIRoute = async (context) => {
  const posts = await getAllPosts();

  return rss({
    title: `${site.name} · Writing`,
    description: site.description,
    site: context.site ?? site.url,
    // RSS <language> wants RFC 1766 casing (en-gb), not OG's en_GB.
    customData: `<language>${site.locale.toLowerCase().replace('_', '-')}</language>`,
    items: posts.map((post) => ({
      title: post.title,
      // Must match the live route (see src/pages/writing/[slug].astro).
      // @astrojs/rss appends the trailing slash by default, agreeing with the
      // slashed canonical URLs emitted by SEO.astro.
      link: `/writing/${post.slug}`,
      // publishedAt is optional on PostSummary but guaranteed here (POSTS_QUERY
      // filters on defined(publishedAt)); excerpt genuinely may be missing.
      // Spread conditionally so the types hold without asserting.
      ...(post.excerpt ? { description: post.excerpt } : {}),
      ...(post.publishedAt ? { pubDate: new Date(post.publishedAt) } : {}),
    })),
  });
};
