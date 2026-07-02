/**
 * Social profile URLs — the single source of the verified, wired profiles.
 *
 * Only the wired, verified URLs ship — X / YouTube are an open data gap
 * (site brief §"Open data gaps"); placeholdered, not invented. Consumers map
 * this base data into their own presentation shapes (icons, mono pills, etc.).
 */
export const socialProfiles = [
  { name: 'GitHub', url: 'https://github.benhickman.dev' },
  { name: 'LinkedIn', url: 'https://linkedin.benhickman.dev' },
] as const;
