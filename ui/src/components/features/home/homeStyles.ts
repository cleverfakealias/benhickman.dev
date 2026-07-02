import type { Theme } from '@mui/material';
import type { SystemStyleObject } from '@mui/system';

/**
 * Shared layout primitives for the Home page sections, mirroring the Obsidian
 * Foundry design-system values (`--max`, `--gutter`, `--section-y`). Kept in a
 * plain module (no components) so the section components stay import-cheap.
 *
 * Typed as `SystemStyleObject` (not `SxProps`) so they compose cleanly as
 * elements of an `sx={[base, overrides]}` array.
 */

const WRAP_MAX = 1240;
export const GUTTER = 'clamp(20px, 5vw, 40px)';
export const SECTION_Y = 'clamp(64px, 9vw, 112px)';

/** Centered content column: max 1240px with a fluid gutter. */
export const wrapSx: SystemStyleObject<Theme> = {
  width: '100%',
  maxWidth: WRAP_MAX,
  mx: 'auto',
  px: GUTTER,
};

/** Eyebrow / micro-label — 11px, 0.14em tracking, uppercase mono. */
export const eyebrowSx: SystemStyleObject<Theme> = {
  m: 0,
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'var(--color-text-muted)',
  fontWeight: 500,
};

/** Accent-colored eyebrow variant (proof-strip kickers carry the Wasabi accent). */
export const eyebrowAccentSx: SystemStyleObject<Theme> = {
  ...eyebrowSx,
  color: 'var(--color-secondary-hex)',
};

/** Italic-serif accent applied to the emphasized verb in display headings. */
export const headingEmSx: SystemStyleObject<Theme> = {
  fontStyle: 'italic',
  fontFamily: 'Geist, serif',
  color: 'var(--color-accent-hex)',
};

/**
 * Obsidian card surface — `--color-surface` on a 1px Iron border with the
 * border-color + transform hover lift. Depth comes from the border, never a
 * shadow. The reduced-motion guard disables the lift but keeps the hover.
 */
export const cardSx: SystemStyleObject<Theme> = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  transition: 'border-color 200ms var(--easing-standard), transform 200ms var(--easing-standard)',
  '&:hover': { borderColor: 'var(--color-border-hover)', transform: 'translateY(-2px)' },
  '@media (prefers-reduced-motion: reduce)': { '&:hover': { transform: 'none' } },
};

/** Mono pill/chip — 11px mono on a 1px Iron border, fully rounded. */
export const tagSx: SystemStyleObject<Theme> = {
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  color: 'var(--color-text-secondary)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-pill)',
  px: '9px',
  py: '3px',
};

/** Keycap pill — mono glyph on a raised surface with a 1px Iron border. */
export const kbdSx: SystemStyleObject<Theme> = {
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  lineHeight: 1.4,
  background: 'var(--color-surface-2)',
  border: '1px solid var(--color-border)',
  borderRadius: '5px',
  px: '6px',
  py: '1px',
  color: 'var(--color-text-secondary)',
};
