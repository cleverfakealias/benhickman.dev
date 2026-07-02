import { createClient, type SanityClient } from '@sanity/client';
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import type { PortableTextBlock } from '@portabletext/types';

// Reuses the SPA's Sanity project (studio/ projectId `unh13egm`). projectId +
// dataset are public; overridable via PUBLIC_SANITY_* env. Content is fetched at
// BUILD TIME (getStaticPaths / frontmatter) — never from the browser.
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'unh13egm';
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';
const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION || '2025-02-19';

export const sanityClient: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  // Sanity's API CDN is eventually consistent — static builds should read the
  // live API so a rebuild never bakes in stale content (Sanity's own guidance).
  useCdn: false,
});

const imageBuilder = createImageUrlBuilder({ projectId, dataset });

export function urlForImage(source: SanityImageSource) {
  return imageBuilder.image(source);
}

// One srcset ladder for every Sanity image — 400 covers phones, 1600 covers
// 2x-DPR desktops. Sanity's pipeline never upscales past the original asset.
const SRCSET_WIDTHS = [400, 800, 1200, 1600];

// src + srcset pair so browsers download the smallest sufficient variant;
// auto('format') negotiates AVIF/WebP via the Accept header. `aspectRatio`
// (width/height) re-applies the crop at every ladder width so all candidates
// frame identically; omitted, the image scales inside its intrinsic ratio via
// fit('max') — used for portable-text figures.
export function responsiveImageAttrs(
  source: SanityImageSource,
  options: { baseWidth: number; aspectRatio?: number },
): { src: string; srcset: string } {
  const { baseWidth, aspectRatio } = options;
  const url = (width: number): string => {
    const base = urlForImage(source).width(width).auto('format');
    // biome-ignore lint/suspicious/noFocusedTests: .fit() is @sanity/image-url's crop-mode builder, not a focused test
    const sized = aspectRatio ? base.height(Math.round(width / aspectRatio)).fit('crop') : base.fit('max');
    return sized.url();
  };
  return {
    src: url(baseWidth),
    srcset: SRCSET_WIDTHS.map((width) => `${url(width)} ${width}w`).join(', '),
  };
}

export interface SanityImage {
  asset?: { _ref: string; _type: string };
  alt?: string;
}

export interface PostSummary {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  mainImage?: SanityImage;
  author?: string;
  estimatedReadingTime?: number;
}

export interface Post extends PostSummary {
  body?: PortableTextBlock[];
}

// Only real, published posts — `defined(publishedAt)` filters out Studio test
// drafts (e.g. the "test" / "testymctestface" docs with no publish date).
const POST_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  mainImage,
  "author": author->name,
  "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180)
`;

const POSTS_QUERY = `*[_type == "post" && defined(slug.current) && defined(publishedAt)]
  | order(publishedAt desc) { ${POST_FIELDS} }`;

const POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  ${POST_FIELDS},
  body
}`;

const SLUGS_QUERY = `*[_type == "post" && defined(slug.current) && defined(publishedAt)].slug.current`;

// Fetch failures rethrow so a broken Sanity call fails the build loudly —
// under prerender a swallowed error would exit 0 with an empty writing index
// and zero getStaticPaths entries (every published post 404s). A genuinely
// empty dataset resolves without throwing, so the index's "no posts published
// yet" state stays reachable.
export async function getAllPosts(): Promise<PostSummary[]> {
  try {
    return await sanityClient.fetch<PostSummary[]>(POSTS_QUERY);
  } catch (err) {
    console.error('[sanity] getAllPosts failed:', err);
    throw err;
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    return await sanityClient.fetch<Post | null>(POST_BY_SLUG_QUERY, { slug });
  } catch (err) {
    console.error(`[sanity] getPostBySlug(${slug}) failed:`, err);
    throw err;
  }
}

// The assistant corpus needs full bodies for every post; kept separate from
// getAllPosts so its (body-free) shape — relied on by the writing index and
// search index — never changes. Memoized like buildSearchIndex so the fetch
// runs once per build no matter how many prerendered consumers call it.
const POSTS_WITH_BODY_QUERY = `*[_type == "post" && defined(slug.current) && defined(publishedAt)]
  | order(publishedAt desc) { ${POST_FIELDS}, body }`;

let postsWithBodyCache: Post[] | null = null;

export async function getAllPostsWithBody(): Promise<Post[]> {
  if (postsWithBodyCache) return postsWithBodyCache;
  try {
    postsWithBodyCache = await sanityClient.fetch<Post[]>(POSTS_WITH_BODY_QUERY);
    return postsWithBodyCache;
  } catch (err) {
    console.error('[sanity] getAllPostsWithBody failed:', err);
    throw err;
  }
}

// Portable Text → plaintext, without a serializer dependency: standard `block`
// nodes are the concatenated text of their spans; non-block types (images,
// code, embeds) carry no prose and are skipped. Good enough for a search/QA
// corpus — formatting and marks are irrelevant there.
export function portableTextToPlainText(blocks: PortableTextBlock[] | undefined): string {
  if (!blocks || blocks.length === 0) return '';
  return blocks
    .filter((block) => block._type === 'block')
    .map((block) =>
      (Array.isArray(block.children) ? block.children : [])
        .map((child) => ('text' in child && typeof child.text === 'string' ? child.text : ''))
        .join(''),
    )
    .join('\n');
}

export async function getAllPostSlugs(): Promise<string[]> {
  try {
    return await sanityClient.fetch<string[]>(SLUGS_QUERY);
  } catch (err) {
    console.error('[sanity] getAllPostSlugs failed:', err);
    throw err;
  }
}

export function formatDate(dateString?: string): string {
  if (!dateString) return 'Recently';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
