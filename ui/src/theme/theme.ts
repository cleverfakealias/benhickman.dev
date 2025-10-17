import { createTheme, alpha } from '@mui/material/styles';
import type { Shadows } from '@mui/material/styles';
import type { CSSObject } from '@mui/system';

// Resolve a CSS variable to its computed value. Prefer our -hex tokens for MUI compatibility.
const readVar = (name: string, fallback: string) => {
  if (typeof document === 'undefined') return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
};

export const buildTheme = (mode: 'light' | 'dark') => {
  const isDark = mode === 'dark';

  const palette = {
    mode,
    primary: {
      main: readVar('--color-accent-hex', isDark ? '#3ED598' : '#0F766E'),
      contrastText: readVar('--color-accent-contrast-hex', isDark ? '#0D1117' : '#FFFFFF'),
    },
    secondary: {
      main: readVar('--color-secondary-hex', isDark ? '#58A6FF' : '#14B8A6'),
      contrastText: readVar('--color-text-hex', isDark ? '#0D1117' : '#FFFFFF'),
    },
    background: {
      default: readVar('--color-bg-hex', isDark ? '#0D1117' : '#F8FAFC'),
      paper: readVar('--color-surface-hex', isDark ? '#161B22' : '#FFFFFF'),
    },
    text: {
      primary: readVar('--color-text-hex', isDark ? '#E5E7EB' : '#0F172A'),
      secondary: readVar('--color-text-secondary-hex', isDark ? '#9CA3AF' : '#475569'),
    },
    success: { main: readVar('--color-success-hex', isDark ? '#10B981' : '#059669') },
    warning: { main: readVar('--color-warning-hex', isDark ? '#FBBF24' : '#F59E0B') },
    error: { main: readVar('--color-danger-hex', isDark ? '#EF4444' : '#DC2626') },
    info: { main: readVar('--color-info-hex', isDark ? '#3B82F6' : '#2563EB') },
    divider: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
  } as const;

  const shape = { borderRadius: 'var(--radius-md)' as unknown as number } as const;

  const shadows: Shadows = [
    'none',
    readVar('--shadow-1', '0 1px 2px rgba(17,20,24,.06), 0 1px 1px rgba(17,20,24,.04)'),
    readVar('--shadow-2', '0 2px 6px rgba(17,20,24,.08), 0 1px 2px rgba(17,20,24,.06)'),
    readVar('--shadow-3', '0 6px 12px rgba(17,20,24,.10), 0 2px 4px rgba(17,20,24,.08)'),
    readVar('--shadow-4', '0 10px 20px rgba(17,20,24,.12), 0 4px 6px rgba(17,20,24,.10)'),
    readVar('--shadow-5', '0 18px 36px rgba(17,20,24,.16), 0 8px 12px rgba(17,20,24,.12)'),
    ...Array(19).fill('none'),
  ] as unknown as Shadows;

  const fontFamilySans =
    'Geist, Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif';
  const fontFamilyDisplay = "'Clash Display', Geist, system-ui";
  const fontFamilyMonospace =
    "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
  const headingCommon = { letterSpacing: '-0.01em', lineHeight: 1.1 } as const;

  const typography = {
    fontFamily: fontFamilySans,
    fontSize: 16,
    h1: {
      ...headingCommon,
      fontFamily: fontFamilyDisplay,
      fontWeight: 700,
      fontSize: 'clamp(2.4rem, 3vw, 3.2rem)',
    },
    h2: {
      ...headingCommon,
      fontFamily: fontFamilyDisplay,
      fontWeight: 600,
      fontSize: 'clamp(1.8rem, 2.4vw, 2.4rem)',
    },
    h3: { ...headingCommon, fontWeight: 600, fontSize: '1.5rem', lineHeight: 1.2 },
    h4: { ...headingCommon, fontWeight: 600, fontSize: '1.25rem' },
    subtitle1: { fontWeight: 500, letterSpacing: '0', lineHeight: 1.4 },
    body1: { fontWeight: 400, lineHeight: 1.75, letterSpacing: '0.005em' },
    body2: { fontWeight: 400, lineHeight: 1.7, letterSpacing: '0.01em' },
    button: { fontWeight: 600, letterSpacing: '0.02em', textTransform: 'none', lineHeight: 1.1 },
    caption: { fontSize: '0.85rem', lineHeight: 1.4, opacity: 0.9 },
    overline: { fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' },
    // custom helper for code elements
    fontFamilyMonospace: fontFamilyMonospace,
  } as const;

  // Spacing system based on CSS custom properties
  // Maps to --space-0 through --space-7, plus semantic spacers
  const spacing = (factor: number | string): string => {
    // If it's a number, map to --space-{n}
    if (typeof factor === 'number') {
      // MUI uses 8px base by default, we map to our fluid scale
      // 0=0px, 1=~10px, 2=~14px, 3=~18px, 4=~24px, 5=~32px, 6=~48px, 7=~64px
      const clampedFactor = Math.max(0, Math.min(7, factor));
      return `var(--space-${clampedFactor})`;
    }
    // If it's a semantic string like 'card' or 'section', return that
    return factor;
  };

  const theme = createTheme({
    palette,
    shape,
    shadows,
    typography,
    spacing, // Use our custom spacing function
    transitions: {
      duration: {
        shortest: 100,
        shorter: 150,
        short: 200,
        standard: 300,
        complex: 500,
        enteringScreen: 225,
        leavingScreen: 195,
      },
      easing: {
        easeInOut: 'cubic-bezier(0.2, 0, 0, 1)',
        easeOut: 'cubic-bezier(0.2, 0, 0, 1.2)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        sharp: 'cubic-bezier(0.2, 0, 0, 1)',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          ':root, html, body': { colorScheme: isDark ? 'dark' : 'light' },
          body: ((): CSSObject => {
            const headerVars: Record<
              | '--header-bg'
              | '--header-text'
              | '--header-link-hover'
              | '--header-link-glow'
              | '--header-active-link',
              string
            > = {
              '--header-bg': palette.background.paper as string,
              '--header-text': palette.text.primary as string,
              '--header-link-hover': palette.primary.main as string,
              '--header-link-glow': readVar(
                '--color-focus-hex',
                isDark ? '#3ED59873' : '#0F766E73'
              ),
              '--header-active-link': palette.primary.main as string,
            };
            return {
              backgroundColor: palette.background.default as string,
              color: palette.text.primary as string,
              ...headerVars,
            } as CSSObject;
          })(),
          'code, kbd, samp, pre': { fontFamily: fontFamilyMonospace },
          a: { color: palette.primary.main as string },
          '*, *::before, *::after': {
            outlineColor: readVar('--color-focus-hex', isDark ? '#74e02473' : '#63d21e73'),
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 'var(--radius-md)',
            transition: `transform var(--motion-150) var(--easing-standard), background-color var(--motion-150) var(--easing-standard)`,
            '&:active': { transform: 'translateY(1px)' },
            '&.Mui-focusVisible': {
              boxShadow: `0 0 0 3px ${readVar('--color-focus-hex', '#63d21e73')}`,
            },
          },
          contained: {
            backgroundColor: palette.primary.main as string,
            color: palette.primary.contrastText as string,
            '&:hover': { filter: 'saturate(1.05)', boxShadow: shadows[2] as string },
          },
          outlined: {
            borderColor: readVar('--color-border-hex', isDark ? '#2a313a' : '#e5e7eb'),
            '&:hover': { backgroundColor: alpha('#000', 0.03) },
          },
          text: { '&:hover': { backgroundColor: alpha('#000', 0.03) } },
        },
        variants: [
          {
            props: { variant: 'soft' },
            style: {
              backgroundColor: alpha(palette.primary.main as string, 0.12),
              color: palette.primary.main as string,
              border: `1px solid ${alpha(palette.primary.main as string, 0.2)}`,
              '&:hover': { backgroundColor: alpha(palette.primary.main as string, 0.18) },
            },
          },
          {
            props: { variant: 'ghost' },
            style: {
              backgroundColor: 'transparent',
              color: palette.text.primary as string,
              '&:hover': { backgroundColor: alpha('#000', 0.04) },
            },
          },
          {
            props: { variant: 'link' },
            style: {
              padding: 0,
              minWidth: 0,
              textDecoration: 'underline',
              color: palette.primary.main as string,
              '&:hover': { textDecorationThickness: '2px' },
            },
          },
        ],
      },
      MuiLink: {
        styleOverrides: {
          root: {
            textUnderlineOffset: '2px',
            color: palette.primary.main as string,
            '&:hover': { textDecorationThickness: '2px' },
            '&.Mui-focusVisible': {
              outline: `2px solid ${readVar('--color-focus-hex', '#63d21e73')}`,
              outlineOffset: '2px',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: palette.background.paper as string,
            boxShadow: shadows[1] as string,
            borderRadius: 'var(--radius-lg)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backdropFilter: 'saturate(140%) blur(10px)',
            backgroundColor: alpha(
              readVar('--color-surface-hex', isDark ? '#0f141a' : '#f6f7f9'),
              0.9
            ),
            boxShadow: shadows[1] as string,
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: { borderRadius: 'var(--radius-sm)' },
          input: {
            '&:focus-visible': {
              outline: `3px solid ${readVar('--color-focus-hex', '#63d21e73')}`,
              outlineOffset: '1px',
            },
          },
        },
      },
      MuiTextField: { defaultProps: { variant: 'outlined' } },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: palette.background.paper as string,
            boxShadow: shadows[3] as string,
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          standardSuccess: { backgroundColor: alpha('#34d399', 0.16) },
          standardWarning: { backgroundColor: alpha('#fbbf24', 0.16) },
          standardError: { backgroundColor: alpha('#ef4444', 0.16) },
        },
      },
    },
  });

  return theme;
};
