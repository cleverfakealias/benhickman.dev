import { createClient, type SanityClient } from '@sanity/client';
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import type { PortableTextBlock } from '@portabletext/types';

// Reuses the SPA's Sanity project (studio/ projectId `unh13egm`). projectId +
// dataset are public; overridable via PUBLIC_SANITY_* env. Content is fetched at
// BUILD TIME (getStaticPaths / frontmatter) — never from the browser.
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'unh13egm';
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';
const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION || '2023-09-01';

export const sanityClient: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

const imageBuilder = createImageUrlBuilder({ projectId, dataset });

export function urlForImage(source: SanityImageSource) {
  return imageBuilder.image(source);
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

export async function getAllPosts(): Promise<PostSummary[]> {
  try {
    return await sanityClient.fetch<PostSummary[]>(POSTS_QUERY);
  } catch (err) {
    console.error('[sanity] getAllPosts failed:', err);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    return await sanityClient.fetch<Post | null>(POST_BY_SLUG_QUERY, { slug });
  } catch (err) {
    console.error(`[sanity] getPostBySlug(${slug}) failed:`, err);
    return null;
  }
}

export async function getAllPostSlugs(): Promise<string[]> {
  try {
    return await sanityClient.fetch<string[]>(SLUGS_QUERY);
  } catch (err) {
    console.error('[sanity] getAllPostSlugs failed:', err);
    return [];
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
