import { createClient } from '@sanity/client';

// Check if we're in Presentation mode (loaded in iframe)
const isPreviewMode = typeof window !== 'undefined' && window.parent !== window;

// Fallback configuration for development
const clientConfig = {
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'your-project-id',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2023-09-01',
  // Prefer fresh content so editors see changes reflected quickly
  useCdn: false,
  // Enable stega encoding in preview mode
  stega: isPreviewMode ? {
    enabled: true,
    studioUrl: import.meta.env.VITE_SANITY_STUDIO_URL || 'http://localhost:3333',
  } : false,
} as const;

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
  return await sanityClient.fetch(query);
}

export async function fetchPostsPreview() {
  try {
    const query = `*[_type == "post"] | order(publishedAt desc, _createdAt desc) {
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
    const res = await fetch('/api/sanity-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, params: {} }),
    });
    if (!res.ok) throw new Error(`Proxy error ${res.status}`);
    const data = await res.json();
    return data.result ?? [];
  } catch (e) {
    console.warn('Preview fetch failed, falling back to public client', e);
    return fetchPosts();
  }
}

// Home Page queries
export async function fetchHomePage(organizationId: string) {
  if (!sanityClient) {
    console.warn('Sanity client not configured.');
    return null;
  }

  const query = `*[_type == "homePage" && organizationId == $organizationId][0] {
    _id,
    organizationId,
    internalTitle,
    seoDescription,
    modules[] {
      _type,
      _key,
      internalTitle,
      eyebrow,
      headline,
      lede,
      body,
      layout,
      emphasis,
      primaryCta,
      secondaryCta,
      cta,
      media {
        desktop {
          image {
            asset-> {
              _id,
              url,
              metadata {
                lqip,
                dimensions {
                  width,
                  height,
                  aspectRatio
                }
              }
            }
          },
          alt,
          caption
        },
        tablet {
          image {
            asset-> {
              _id,
              url,
              metadata {
                lqip,
                dimensions {
                  width,
                  height,
                  aspectRatio
                }
              }
            }
          },
          alt,
          caption
        },
        mobile {
          image {
            asset-> {
              _id,
              url,
              metadata {
                lqip,
                dimensions {
                  width,
                  height,
                  aspectRatio
                }
              }
            }
          },
          alt,
          caption
        }
      }
    }
  }`;

  return await sanityClient.fetch(query, { organizationId });
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
  try {
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
    const res = await fetch('/api/sanity-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, params: { slug } }),
    });
    if (!res.ok) throw new Error(`Proxy error ${res.status}`);
    const data = await res.json();
    return data.result ?? null;
  } catch (e) {
    console.warn('Preview fetch failed, falling back to public client', e);
    return getPostBySlug(slug);
  }
}

export default sanityClient;
