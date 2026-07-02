import React from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { Link, useLocation, matchPath } from 'react-router-dom';
import type { SystemStyleObject } from '@mui/system';
import type { Theme } from '@mui/material';
import { bottomNavItems } from '../../config/navLinks';

const tabSx: SystemStyleObject<Theme> = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4px',
  minHeight: 56,
  position: 'relative',
  textDecoration: 'none',
  color: 'var(--color-text-secondary)',
  transition: 'color 0.2s var(--easing-standard)',
  // Active indicator — a 2px Persimmon bar at the top of the tab, mirroring the
  // desktop nav's underline (inverted), revealed via scaleX.
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '24%',
    right: '24%',
    height: '2px',
    background: 'var(--color-accent-hex)',
    transform: 'scaleX(0)',
    transition: 'transform 0.25s var(--easing-standard)',
  },
  // Neutralize the global `a:hover` underline (tokens.css) on the tab links.
  '&:hover': { color: 'var(--color-text)', borderBottomColor: 'transparent' },
  '&:focus-visible': {
    outline: '2px solid var(--color-accent-hex)',
    outlineOffset: '-3px',
    borderRadius: 'var(--radius-sm)',
  },
  '&[aria-current="page"]': { color: 'var(--color-accent-hex)' },
  '&[aria-current="page"]::before': { transform: 'scaleX(1)' },
  '@media (prefers-reduced-motion: reduce)': {
    '&::before': { transition: 'none' },
  },
};

const iconSx: SystemStyleObject<Theme> = {
  fontFamily: 'var(--font-mono)',
  fontSize: '19px',
  lineHeight: 1,
};

const labelSx: SystemStyleObject<Theme> = {
  fontFamily: 'var(--font-mono)',
  fontSize: '10px',
  letterSpacing: '0.01em',
};

/**
 * Mobile bottom tab bar — the thumb-reach counterpart to the desktop header
 * pill. Renders only below `md`; the desktop nav and this bar are mutually
 * exclusive so only one `Primary` nav landmark exists at a time. The elevated
 * center action is the ⌘K "Ask my work" trigger (a coming-soon stub until the
 * Phase 5 backend ships).
 */
export const BottomNav: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  if (!isMobile) return null;

  const isActive = (href: string) =>
    !!matchPath({ path: href, end: href === '/' }, location.pathname);

  const renderTab = (item: (typeof bottomNavItems)[number]) => {
    const active = isActive(item.href);
    return (
      <Box
        key={item.name}
        component={Link}
        to={item.href}
        aria-current={active ? 'page' : undefined}
        sx={tabSx}
      >
        <Box component="span" aria-hidden="true" sx={iconSx}>
          {item.icon}
        </Box>
        <Box component="span" sx={labelSx}>
          {item.name}
        </Box>
      </Box>
    );
  };

  const left = bottomNavItems.slice(0, 2);
  const right = bottomNavItems.slice(2);

  return (
    <Box
      component="nav"
      aria-label="Primary"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        display: 'flex',
        alignItems: 'stretch',
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        pb: 'env(safe-area-inset-bottom)',
      }}
    >
      {left.map(renderTab)}

      {/* Elevated center ⌘K Ask — coming-soon stub (Phase 5 wires the agent). */}
      <Box
        component="button"
        type="button"
        aria-label="Ask my work — command menu, coming soon"
        title="Ask my work — coming soon"
        sx={{
          flex: '0 0 64px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '4px',
          minHeight: 56,
          pb: '8px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--color-text-secondary)',
          '&:focus-visible': {
            outline: '2px solid var(--color-accent-hex)',
            outlineOffset: '-3px',
            borderRadius: 'var(--radius-md)',
          },
          '&:active span:first-of-type': { transform: 'scale(0.94)' },
        }}
      >
        <Box
          component="span"
          aria-hidden="true"
          sx={{
            width: 46,
            height: 46,
            mt: '-22px',
            borderRadius: '50%',
            background: 'var(--color-accent-hex)',
            color: 'var(--color-accent-contrast-hex)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '20px',
            border: '4px solid var(--color-bg)',
            transition: 'transform 0.12s var(--easing-standard)',
          }}
        >
          ⌘
        </Box>
        <Box component="span" sx={labelSx}>
          Ask
        </Box>
      </Box>

      {right.map(renderTab)}
    </Box>
  );
};
