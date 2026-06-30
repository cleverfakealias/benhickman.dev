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
  // Default OG/Twitter share image (monogram until a dedicated card exists).
  ogImage: '/images/monogram.png',
  twitter: undefined as string | undefined,
} as const;
