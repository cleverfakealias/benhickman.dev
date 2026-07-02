import React from 'react';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import type { Theme } from '@mui/material';
import type { SystemStyleObject } from '@mui/system';

interface CtaLinkProps {
  to: string;
  variant?: 'primary' | 'ghost';
  children: React.ReactNode;
}

const baseSx: SystemStyleObject<Theme> = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '9px',
  px: '20px',
  py: '13px',
  minHeight: 44,
  borderRadius: 'var(--radius-md)',
  fontFamily: 'var(--font-mono)',
  fontSize: '14px',
  fontWeight: 500,
  textDecoration: 'none',
  border: '1px solid transparent',
  transition: 'background 180ms var(--easing-standard), border-color 180ms var(--easing-standard)',
  '&:active': { transform: 'translateY(1px)' },
  // Neutralize the global `a:hover` underline from tokens.css.
  '&:hover': { borderBottomColor: 'transparent' },
};

const variantSx: Record<NonNullable<CtaLinkProps['variant']>, SystemStyleObject<Theme>> = {
  primary: {
    background: 'var(--color-accent-hex)',
    color: 'var(--color-accent-contrast-hex)',
    '&:hover': { background: 'var(--color-accent-hover-hex)' },
  },
  ghost: {
    color: 'var(--color-text)',
    borderColor: 'var(--color-border)',
    '&:hover': { borderColor: 'var(--color-border-hover)', background: 'var(--color-surface)' },
  },
};

/** Obsidian Foundry CTA button rendered as an in-app router link. */
export const CtaLink: React.FC<CtaLinkProps> = ({ to, variant = 'primary', children }) => (
  <Box component={Link} to={to} sx={[baseSx, variantSx[variant]]}>
    {children}
  </Box>
);
