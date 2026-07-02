/**
 * Primary navigation — the single source consumed by the desktop header pill,
 * the mobile bottom tab bar, and the footer quick-links menu.
 *
 * `navLinks` drives the desktop pill + footer menu. `bottomNavItems` is the
 * thumb-reach mobile bar: it adds Home, drops Playground (still reachable from
 * the footer menu), and carries a system glyph per destination. The elevated
 * center ⌘K "Ask" action is rendered separately by the bottom bar.
 *
 * Work/About get their own pages in a later phase; until then these point only
 * at routes that exist so nothing dead-links.
 */
export const navLinks = [
  { name: 'Work', href: '/experience' },
  { name: 'Writing', href: '/blog' },
  { name: 'Playground', href: '/playground' },
  { name: 'Contact', href: '/contact' },
] as const;

/**
 * Bottom-bar destinations (mobile). Glyphs are from the Obsidian Foundry icon
 * set; the emoji-presentation ones carry U+FE0E so they render as flat text
 * glyphs, not color emoji. Order is [Home, Work | Writing, Contact] with the
 * ⌘K Ask action slotted in the middle by the bar itself.
 */
export const bottomNavItems = [
  { name: 'Home', href: '/', icon: '⌂' },
  { name: 'Work', href: '/experience', icon: '▤' },
  { name: 'Writing', href: '/blog', icon: '✎︎' },
  { name: 'Contact', href: '/contact', icon: '✉︎' },
] as const;
