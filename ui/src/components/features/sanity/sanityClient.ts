import { createClient } from '@sanity/client';
import { isSanityPreviewMode } from '../../../utils/sanityPreview';

// Check if we're in Presentation mode with secure origin verification
const isPreviewMode = isSanityPreviewMode();

// Fallback configuration for development
const clientConfig = {
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'your-project-id',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2023-09-01',
  // Prefer fresh content so editors see changes reflected quickly
  useCdn: false,
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
  try {
    const res = await fetch('/api/sanity-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: POSTS_QUERY, params: {} }),
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

export async function fetchHomePagePreview(organizationId: string) {
  try {
    const query = `*[_type == "homePage" && organizationId == $organizationId][0]{
      _id,
      internalTitle,
      organizationId,
      seoDescription,
      modules[]{
        ...,
        _type == "homeHeroModule" => {
          ...,
          media {
            ...,
            desktop {
              ...,
              image {
                ...,
                asset->
              }
            },
            mobile {
              ...,
              image {
                ...,
                asset->
              }
            }
          }
        },
        _type == "homeContentSectionModule" => {
          ...,
          body[] {
            ...,
            markDefs[] {
              ...,
              _type == "internalLink" => {
                "slug": @.reference->slug.current
              }
            }
          }
        }
      }
    }`;

    const res = await fetch('/api/sanity-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, params: { organizationId } }),
    });

    if (!res.ok) throw new Error(`Proxy error ${res.status}`);
    const data = await res.json();
    return data.result ?? null;
  } catch (e) {
    console.warn('Preview fetch failed for Home Page', e);
    return null;
  }
}

export async function debugFetchAllHomePages() {
  if (!sanityClient) return [];
  return await sanityClient.fetch(`*[_type == "homePage"]{ _id, organizationId, internalTitle }`);
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
