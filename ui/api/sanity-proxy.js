// Vercel serverless function to proxy Sanity queries for preview/draft
// Avoids exposing the token to the browser. Set SANITY_API_READ_TOKEN in Vercel.
import { createClient } from '@sanity/client';

const projectId = process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || '';
const dataset = process.env.VITE_SANITY_DATASET || process.env.SANITY_DATASET || 'production';
const apiVersion = '2023-09-01';
const token = process.env.SANITY_API_READ_TOKEN;

const studioUrl = process.env.SANITY_STUDIO_URL || process.env.VITE_SANITY_STUDIO_URL;
const serverClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
  stega: studioUrl ? { studioUrl } : undefined,
});

// Whitelist of allowed query patterns for preview mode
// Only permit queries for blog posts and home page content
const ALLOWED_QUERIES = [
  // Blog posts list: *[_type == "post"] | order(...) [0..10] { fields... }
  /^\*\[_type\s*==\s*"post"/,
  // Single blog post by slug: *[_type == "post" && slug.current == $slug][0] { fields... }
  /^\*\[_type\s*==\s*"post"\s*&&\s*slug\.current\s*==\s*\$slug/,
  // Home page queries: *[_type == "homePage" ...
  /^\*\[_type\s*==\s*"homePage"/,
];

// Validate query against whitelist
function isQueryAllowed(query) {
  if (!query || typeof query !== 'string') {
    return false;
  }

  // Normalize whitespace for consistent matching
  const normalizedQuery = query.replace(/\s+/g, ' ').trim();

  return ALLOWED_QUERIES.some((pattern) => pattern.test(normalizedQuery));
}

// Validate params to prevent injection attacks
function validateParams(params) {
  if (!params) return true;

  // Only allow simple string/number values, no objects or arrays
  for (const [key, value] of Object.entries(params)) {
    if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
      return false;
    }

    // Prevent GROQ injection in slug parameter - only allow safe characters
    if (key === 'slug' && typeof value === 'string') {
      if (!/^[a-z0-9-]+$/i.test(value)) {
        return false;
      }
    }
  }

  return true;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const { query, params } = req.body || {};
    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'Missing query' });
      return;
    }

    // Validate query against whitelist
    if (!isQueryAllowed(query)) {
      console.warn('Rejected unauthorized query:', query);
      res.status(403).json({ error: 'Query not allowed' });
      return;
    }

    // Validate params to prevent injection
    if (!validateParams(params)) {
      console.warn('Rejected invalid params:', params);
      res.status(400).json({ error: 'Invalid query parameters' });
      return;
    }

    const result = await serverClient.fetch(query, params);
    res.status(200).json({ result });
  } catch (err) {
    console.error('Sanity proxy error', err);
    res.status(500).json({ error: 'Internal error' });
  }
}
