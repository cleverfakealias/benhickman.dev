import { createClient } from '@sanity/client';
import { isSanityPreviewMode } from '../../../utils/sanityPreview';

// Check if we're in Presentation mode with secure origin verification
const isPreviewMode = isSanityPreviewMode();

// Client configuration for public content
const clientConfig = {
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'your-project-id',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2023-09-01',
  useCdn: true,
  token: undefined,
  ignoreBrowserTokenWarning: true,
  // Enable stega encoding in preview mode (only when securely verified)
  stega: isPreviewMode
    ? {
        enabled: true,
        studioUrl: import.meta.env.VITE_SANITY_STUDIO_URL || 'http://localhost:3333',
      }
    : false,
} as const;

// Only create client if we have a valid project ID
const hasValidConfig =
  clientConfig.projectId &&
  clientConfig.projectId !== 'your-project-id' &&
  /^[a-z0-9-]+$/.test(clientConfig.projectId);

export const sanityClient = hasValidConfig ? createClient(clientConfig) : null;

const POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc, _createdAt desc) {
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  _createdAt,
  mainImage,
  "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180 ),
  "author": author->name
}`;

export async function fetchPosts() {
  if (!sanityClient) {
    console.warn(
      'Sanity client not configured. Please set VITE_SANITY_PROJECT_ID and VITE_SANITY_DATASET environment variables.'
    );
    return [];
  }

  return await sanityClient.fetch(POSTS_QUERY);
}

export async function fetchPostsPreview() {
  // With public reads enabled, just use the standard fetch
  return fetchPosts();
}

export async function getAllPostSlugs() {
  if (!sanityClient) {
    console.warn('Sanity client not configured.');
    return [];
  }

  const query = `*[_type == "post"]{ "slug": slug.current }`;
  return await sanityClient.fetch(query);
}

export async function getPostBySlug(slug: string) {
  if (!sanityClient) {
    console.warn('Sanity client not configured.');
    return null;
  }

  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    body,
    excerpt,
    publishedAt,
    "slug": slug.current,
    mainImage,
    "author": author->name,
    "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180 )
  }`;
  return await sanityClient.fetch(query, { slug });
}

export async function getPostBySlugPreview(slug: string) {
  // With public reads enabled, just use the standard fetch
  return getPostBySlug(slug);
}

export default sanityClient;
