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

// Home Page queries
export async function fetchHomePage(organizationId: string) {
  console.log('fetchHomePage called for:', organizationId, 'client exists:', !!sanityClient);

  if (!sanityClient) {
    console.error('Sanity client not configured. Check VITE_SANITY_PROJECT_ID env var.');
    return null;
  }

  // Test query without parameters first
  const query = `*[_type == "homePage"][0]{
    _id,
    organizationId,
    internalTitle,
    seoDescription,
    modules[]{
      _type,
      _key,
      internalTitle,
      eyebrow,
      headline,
      lede,
      layout,
      emphasis,
      primaryCta,
      secondaryCta,
      media{
        desktop{
          _type,
          alt,
          image{asset->}
        },
        mobile{
          _type,
          alt,
          image{asset->}
        }
      },
      body,
      cta
    }
  }`;

  try {
    console.log('Fetching homePage with query...');
    const result = await sanityClient.fetch(query);
    console.log('fetchHomePage result:', result);
    return result;
  } catch (err) {
    console.error('fetchHomePage error:', err);
    throw err;
  }
}

export async function fetchHomePagePreview(organizationId: string) {
  // With public reads enabled, just use the standard fetch
  return fetchHomePage(organizationId);
}

export async function debugFetchAllHomePages() {
  if (!sanityClient) {
    console.error('No sanityClient available for debug fetch');
    return [];
  }

  console.log('Client config being used:', {
    projectId: sanityClient.config().projectId,
    dataset: sanityClient.config().dataset,
    useCdn: sanityClient.config().useCdn,
    apiVersion: sanityClient.config().apiVersion,
  });

  // Try fetching by exact document ID
  const byId = await sanityClient.fetch(`*[_id == "homePage-benhickman.dev"][0]`);
  console.log('Direct ID query result:', byId);

  // Try the exact query that works in Vision
  const exactVisionQuery = await sanityClient.fetch(
    `*[_type == "homePage"][0]{ _id, organizationId, internalTitle }`
  );
  console.log('Exact Vision query result:', exactVisionQuery);

  // Check ALL document types
  const allDocs = await sanityClient.fetch(
    `*[_id == "homePage-benhickman.dev" || _type == "homePage"]{ _id, _type, organizationId, internalTitle }`
  );
  console.log('All matching documents:', allDocs);

  return allDocs;
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
