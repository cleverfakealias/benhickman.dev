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
    const result = await serverClient.fetch(query, params);
    res.status(200).json({ result });
  } catch (err) {
    console.error('Sanity proxy error', err);
    res.status(500).json({ error: 'Internal error' });
  }
}
