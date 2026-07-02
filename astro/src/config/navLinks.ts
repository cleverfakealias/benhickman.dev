// Navigation — single source of truth for the shell.
// IA re-pointed for the Astro rebuild: /experience → /work, /blog → /writing,
// Playground dropped, About added (new IA: Home / Work / Writing / About / Contact).

export interface NavLink {
  name: string;
  href: string;
}

export interface BottomNavItem extends NavLink {
  /** Mono system glyph (U+FE0E forces text rendering, not emoji). */
  icon: string;
}

// Desktop floating-pill links (Home is the brand mark, so it's not repeated here).
export const navLinks: readonly NavLink[] = [
  { name: 'Work', href: '/work' },
  { name: 'Writing', href: '/writing' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
] as const;

// Mobile bottom tab bar — the center "Ask" (⌘K) button is injected by BottomNav,
// not listed here. Order: Home · Work · [Ask] · Writing · Contact.
export const bottomNavItems: readonly BottomNavItem[] = [
  { name: 'Home', href: '/', icon: '⌂' },
  { name: 'Work', href: '/work', icon: '▤' },
  { name: 'Writing', href: '/writing', icon: '✎︎' },
  { name: 'Contact', href: '/contact', icon: '✉︎' },
] as const;

/**
 * Active-link test against the current pathname. Exact for "/", prefix-match for
 * the rest (so /work/[slug] highlights Work). Replaces react-router's matchPath.
 */
export function isActive(href: string, pathname: string): boolean {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (href === '/') return path === '/';
  return path === href || path.startsWith(`${href}/`);
}
