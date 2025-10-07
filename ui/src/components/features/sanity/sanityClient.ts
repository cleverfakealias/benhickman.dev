import { createClient } from '@sanity/client';

// Fallback configuration for development
const clientConfig = {
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'your-project-id',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2023-09-01',
  useCdn: true,
};

// Only create client if we have a valid project ID
const hasValidConfig =
  clientConfig.projectId &&
  clientConfig.projectId !== 'your-project-id' &&
  /^[a-z0-9-]+$/.test(clientConfig.projectId);

export const sanityClient = hasValidConfig ? createClient(clientConfig) : null;

export async function fetchPosts() {
  if (!sanityClient) {
    console.warn(
      'Sanity client not configured. Please set VITE_SANITY_PROJECT_ID and VITE_SANITY_DATASET environment variables.'
    );
    return [];
  }

  const query = `*[_type == "post"] | order(publishedAt desc, _createdAt desc) {
    title,
    slug,
    excerpt,
    publishedAt,
    _createdAt,
    mainImage,
    "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180 ),
    "author": author->name
  }`;
  return await sanityClient.fetch(query);
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

export default sanityClient;
