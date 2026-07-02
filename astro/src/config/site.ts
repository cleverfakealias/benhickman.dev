// Site-wide brand + SEO defaults (the rebuild's agentic repositioning).
export const site = {
  name: 'Ben Hickman',
  // ◉ U+25C9 — the brand mark, rendered in the accent colour.
  mark: '◉',
  url: 'https://benhickman.dev',
  tagline: 'AI/ML Engineer',
  // Short bio (content-plan 01) — default meta description.
  description:
    'AI/ML engineer building agentic systems, RAG pipelines, and the models underneath them.',
  // Default OG/Twitter share image (monogram until a dedicated 1200×630 card
  // exists — an owner/design task). When the card lands, update the path AND
  // the dims/alt below together; SEO.astro reads all of them from here.
  ogImage: '/images/monogram.png',
  // Kept beside the path (not hardcoded in meta tags) so swapping the asset
  // is a one-file change. Verified against the PNG's actual IHDR dimensions.
  ogImageMeta: {
    width: 1024,
    height: 1024,
    alt: 'BH monogram — pine tree and water on a dark background',
  },
  // Site copy is British English ("colour", "optimise") — og:locale matches.
  locale: 'en_GB',
  twitter: undefined as string | undefined,
} as const;
