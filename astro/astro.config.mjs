// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://docs.astro.build/en/guides/integrations-guide/cloudflare/
export default defineConfig({
  site: 'https://benhickman.dev',

  // Legacy → new IA. Param mapping carries the slug across.
  redirects: {
    '/blog': '/writing',
    '/blog/post/[slug]': '/writing/[slug]',
    '/experience': '/work',
    '/career': '/about',
    '/playground': '/',
  },
  // Server output: routes are server-rendered by default; static pages opt in
  // per-route with `export const prerender = true`. Only /api/* stay dynamic.
  output: 'server',
  adapter: cloudflare({
    // v14 bundles the Cloudflare Vite plugin, so `astro dev` surfaces real KV/env
    // bindings automatically (no platformProxy option needed). `wrangler dev`
    // remains the source of truth for production binding behaviour.
    // 'compile' needs no Images binding; revisit when we add responsive images.
    imageService: 'compile',
  }),
  integrations: [
    react(),
    sitemap({
      // Drop noindex routes (privacy) + the 404 from the sitemap.
      filter: (page) => !/\/(privacy|404)\/?$/.test(page),
    }),
  ],
});
