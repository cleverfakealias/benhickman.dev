// Social profiles — ported from ui/src/config (vanity subdomains).
export interface SocialProfile {
  name: 'LinkedIn' | 'GitHub';
  url: string;
}

// Render order: LinkedIn first, then GitHub (matches the old shell).
export const socialProfiles: readonly SocialProfile[] = [
  { name: 'LinkedIn', url: 'https://linkedin.benhickman.dev' },
  { name: 'GitHub', url: 'https://github.benhickman.dev' },
] as const;
