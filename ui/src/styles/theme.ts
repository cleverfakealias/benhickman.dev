import { createTheme } from '@mui/material/styles';
import {
  colorTokens,
  themeConfigs,
  fontConfigs,
  shadowTokens,
  gradientTokens,
  borderTokens,
  transitionTokens,
} from './colorTokens';
import { themeUtils } from './themeUtils';
import './theme.d';

// Theme configuration for light and dark modes
export const mnThemeConfig = {
  light: themeConfigs.light,
  dark: themeConfigs.dark,
};

// Add or update fontFamily in theme config
export const fontFamilies = fontConfigs;

// Common styling patterns used throughout the site
const commonStyles = {
  // Gradient patterns
  gradients: gradientTokens,

  // Shadow patterns
  shadows: shadowTokens,

  // Transition patterns
  transitions: transitionTokens,

  // Border patterns
  borders: borderTokens,
};

// Function to create theme based on mode
export const createMnTheme = (mode: 'light' | 'dark') => {
  const config = mnThemeConfig[mode];
  const isDark = mode === 'dark';

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: config.primary,
        light: colorTokens.alpha.primary[30], // Lighter version
        dark: colorTokens.mn.twinsNavy, // Darker version
        contrastText: colorTokens.semantic.white,
      },
      secondary: {
        main: config.secondary,
        light: colorTokens.alpha.secondary[30], // Lighter version
        dark: colorTokens.mn.unitedDarkBlue, // Darker version
        contrastText: colorTokens.mn.twinsNavy,
      },
      background: config.background,
      text: config.text,
    },
    shape: {
      borderRadius: 'var(--radius-sm)' as unknown as number, // Less aggressive, subtle rounding
    },
    typography: {
      fontFamily: [fontFamilies.heading, fontFamilies.body].join(','),
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
      },
      h2: {
        fontWeight: 700,
        fontSize: '2rem',
        letterSpacing: '-0.01em',
        lineHeight: 1.25,
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.3,
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.35,
      },
      h5: {
        fontWeight: 500,
        fontSize: '1.1rem',
        lineHeight: 1.4,
      },
      h6: {
        fontWeight: 500,
        fontSize: '1rem',
        lineHeight: 1.4,
      },
      body1: {
        fontWeight: 400,
        fontSize: '1rem',
        lineHeight: 1.7,
      },
      body2: {
        fontWeight: 400,
        fontSize: '0.95rem',
        lineHeight: 1.6,
      },
      button: {
        fontWeight: 600,
        borderRadius: 'var(--radius-lg)' as unknown as number,
        textTransform: 'none',
        letterSpacing: 0,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            '--social-icon-color': config.socialIcons.default,
            '--social-icon-hover': config.socialIcons.hover,
            '--social-icon-shadow': config.socialIcons.shadow,
            '--footer-bg': config.footer.background,
            '--footer-text': config.footer.text,
            '--header-bg': config.header.background,
            '--header-text': config.header.text,
            '--header-link-hover': config.header.linkHover,
            '--header-link-glow': config.socialIcons.shadow,
            '--header-active-link': config.header.activeLink,
            '--color-primary': config.primary,
            '--color-secondary': config.secondary,
            '--color-background-paper': config.background.paper,
            '--color-background-default': config.background.default,
            '--color-text-primary': config.text.primary,
            '--color-text-secondary': config.text.secondary,
          },
        },
      },
      // Card component styling
      MuiCard: {
        styleOverrides: {
          root: {
            transition: commonStyles.transitions.smooth,
            background: isDark
              ? commonStyles.gradients.card.dark
              : commonStyles.gradients.card.light,
            backdropFilter: 'blur(10px)',
            border: isDark ? commonStyles.borders.card.dark : commonStyles.borders.card.light,
            borderRadius: 16,
            boxShadow: isDark ? commonStyles.shadows.card.dark : commonStyles.shadows.card.light,
            overflow: 'hidden',
            position: 'relative',
            '&:hover': {
              transform: 'translateY(-8px) scale(1.02)',
              boxShadow: isDark
                ? commonStyles.shadows.card.hover.dark
                : commonStyles.shadows.card.hover.light,
              background: isDark
                ? commonStyles.gradients.card.hover.dark
                : commonStyles.gradients.card.hover.light,
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${config.primary}, ${config.secondary})`,
            },
          },
        },
      },
      // Paper component styling
      MuiPaper: {
        styleOverrides: {
          root: {
            transition: commonStyles.transitions.standard,
          },
          elevation1: {
            boxShadow: isDark ? commonStyles.shadows.card.dark : commonStyles.shadows.card.light,
          },
          elevation2: {
            boxShadow: isDark ? commonStyles.shadows.card.dark : commonStyles.shadows.card.light,
          },
          elevation3: {
            boxShadow: isDark ? commonStyles.shadows.card.dark : commonStyles.shadows.card.light,
          },
        },
      },
      // Button component styling
      MuiButton: {
        styleOverrides: {
          root: {
            transition: commonStyles.transitions.standard,
            boxShadow: isDark
              ? commonStyles.shadows.button.dark
              : commonStyles.shadows.button.light,
            '&:hover': {
              boxShadow: isDark
                ? commonStyles.shadows.button.hover.dark
                : commonStyles.shadows.button.hover.light,
            },
          },
          contained: {
            background: `linear-gradient(90deg, ${config.primary} 0%, ${config.secondary} 100%)`,
            color: '#ffffff',
            '&:hover': {
              background: `linear-gradient(90deg, ${colorTokens.alpha.primary[80]} 0%, ${colorTokens.alpha.secondary[80]} 100%)`,
              color: '#ffffff',
            },
          },
        },
      },
      // Chip component styling
      MuiChip: {
        styleOverrides: {
          root: {
            transition: commonStyles.transitions.standard,
            '&:hover': {
              transform: 'translateY(-1px)',
            },
          },
        },
      },
    },
  });

  // Add custom properties to the theme
  return {
    ...theme,
    custom: {
      gradients: commonStyles.gradients,
      shadows: commonStyles.shadows,
      transitions: commonStyles.transitions,
      borders: commonStyles.borders,
      // Helper functions for common patterns
      getCardStyles: () => themeUtils.getCardStyles(theme),
      getSocialStyles: () => themeUtils.getSocialStyles(theme),
      getCallToActionStyles: () => themeUtils.getCtaStyles(theme),
    },
  };
};
