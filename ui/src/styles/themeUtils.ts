import { Theme } from '@mui/material/styles';
import {
  colorTokens,
  themeConfigs,
  fontConfigs,
  shadowTokens,
  gradientTokens,
  borderTokens,
  transitionTokens,
} from './colorTokens';

// Type definitions for theme modes
export type ThemeMode = 'light' | 'dark';

// Utility functions for safe theme access
export const themeUtils = {
  // Get color by mode - simplified for now
  getColor: (mode: ThemeMode, colorKey: 'primary' | 'secondary' | 'accent') => {
    return themeConfigs[mode][colorKey];
  },

  // Get background color by mode and type
  getBackgroundColor: (mode: ThemeMode, type: 'default' | 'paper') => {
    return themeConfigs[mode].background[type];
  },

  // Get text color by mode and type
  getTextColor: (mode: ThemeMode, type: 'primary' | 'secondary') => {
    return themeConfigs[mode].text[type];
  },

  // Get shadow by mode and type
  getShadow: (mode: ThemeMode, type: keyof typeof shadowTokens, variant?: 'hover') => {
    const shadowGroup = shadowTokens[type];
    if (variant && typeof shadowGroup === 'object' && 'hover' in shadowGroup) {
      return shadowGroup.hover[mode];
    }
    return shadowGroup[mode];
  },

  // Get gradient by mode and type
  getGradient: (mode: ThemeMode, type: keyof typeof gradientTokens) => {
    const gradientGroup = gradientTokens[type];
    if (typeof gradientGroup === 'object' && mode in gradientGroup) {
      return gradientGroup[mode];
    }
    return gradientGroup;
  },

  // Get border by mode and type
  getBorder: (mode: ThemeMode, type: keyof typeof borderTokens) => {
    return borderTokens[type][mode];
  },

  // Get transition
  getTransition: (type: keyof typeof transitionTokens = 'standard') => {
    return transitionTokens[type];
  },

  // Get font family
  getFont: (type: keyof typeof fontConfigs) => {
    return fontConfigs[type];
  },

  // Helper to get theme-aware styles
  getCardStyles: (theme: Theme) => ({
    transition: themeUtils.getTransition('smooth'),
    background: themeUtils.getGradient(theme.palette.mode as ThemeMode, 'card'),
    backdropFilter: 'blur(10px)',
    border: themeUtils.getBorder(theme.palette.mode as ThemeMode, 'card'),
    borderRadius: 'var(--radius-xl)',
    boxShadow: themeUtils.getShadow(theme.palette.mode as ThemeMode, 'card'),
    overflow: 'hidden',
    position: 'relative' as const,
    '&:hover': {
      transform: 'translateY(-8px) scale(1.02)',
      boxShadow: themeUtils.getShadow(theme.palette.mode as ThemeMode, 'card', 'hover'),
      background: gradientTokens.card.hover[theme.palette.mode as ThemeMode],
    },
  }),

  getSocialStyles: (theme: Theme) => ({
    transition: themeUtils.getTransition('standard'),
    background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(65,42,145,0.02)',
    border: themeUtils.getBorder(theme.palette.mode as ThemeMode, 'social'),
    '&:hover': {
      transform: 'translateY(-2px)',
      background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(65,42,145,0.04)',
      boxShadow: themeUtils.getShadow(theme.palette.mode as ThemeMode, 'social'),
    },
  }),

  // Helper for call-to-action (CTA) button styles
  getCtaStyles: (theme: Theme) => ({
    transition: themeUtils.getTransition('smooth'),
    background: themeUtils.getGradient(theme.palette.mode as ThemeMode, 'callToAction'),
    borderRadius: 'var(--radius-sm)',
    textTransform: 'none' as const,
    fontWeight: 700,
    padding: '12px 24px',
  }),
};

// Export individual tokens for direct access
export {
  colorTokens,
  themeConfigs,
  fontConfigs,
  shadowTokens,
  gradientTokens,
  borderTokens,
  transitionTokens,
};
