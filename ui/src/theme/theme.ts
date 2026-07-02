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

  const shape = { borderRadius: 8 } as const;

  // Obsidian Foundry: 1px Iron borders carry depth — no shadows.
  const shadows: Shadows = Array(25).fill('none') as unknown as Shadows;

  const fontFamilySans =
    "'JetBrains Mono', 'Commit Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
  const fontFamilyDisplay =
    'Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
  const fontFamilyMonospace =
    "'JetBrains Mono', 'Commit Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
  const headingCommon = { letterSpacing: '-0.025em', lineHeight: 1.04 } as const;

  const typography = {
    fontFamily: fontFamilySans,
    fontSize: 16,
    h1: {
      ...headingCommon,
      fontFamily: fontFamilyDisplay,
      fontWeight: 500,
      fontSize: 'clamp(2.6rem, 7vw, 4.8rem)',
      letterSpacing: '-0.035em',
      lineHeight: 1.02,
    },
    h2: {
      ...headingCommon,
      fontFamily: fontFamilyDisplay,
      fontWeight: 500,
      fontSize: 'clamp(1.9rem, 4vw, 3.2rem)',
    },
    h3: {
      ...headingCommon,
      fontFamily: fontFamilyDisplay,
      fontWeight: 500,
      fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)',
      lineHeight: 1.14,
    },
    h4: { ...headingCommon, fontFamily: fontFamilyDisplay, fontWeight: 500, fontSize: '1.2rem' },
    subtitle1: { fontWeight: 500, letterSpacing: '0', lineHeight: 1.4 },
    body1: { fontWeight: 400, lineHeight: 1.75, letterSpacing: '0.005em' },
    body2: { fontWeight: 400, lineHeight: 1.7, letterSpacing: '0.01em' },
    button: { fontWeight: 600, letterSpacing: '0.02em', textTransform: 'none', lineHeight: 1.1 },
    caption: { fontSize: '0.85rem', lineHeight: 1.4, opacity: 0.9 },
    overline: { fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' },
    // custom helper for code elements
    fontFamilyMonospace: fontFamilyMonospace,
  } as const;

  // Spacing system based on CSS custom properties.
  // Integer steps 0–7 map to the fluid Obsidian Foundry scale (--space-0…7):
  //   0=0  1=~10px  2=~14px  3=~18px  4=~24px  5=~32px  6=~48px  7=~64px
  // Any other value — fractional (1.5, 0.25, …), negative, or >7 — falls back
  // to MUI's 8px base grid. Without this fallback, `sx={{ px: 1.5 }}` resolved
  // to the undefined token `var(--space-1.5)` and collapsed to 0 (the nav
  // links ran together; all fractional spacing app-wide silently vanished).
  const spacing = (factor: number | string): string => {
    if (typeof factor === 'string') return factor; // semantic spacer, e.g. 'card'
    if (Number.isInteger(factor) && factor >= 0 && factor <= 7) {
      return `var(--space-${factor})`;
    }
    return `${factor * 8}px`;
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
            '&:hover': {
              backgroundColor: readVar('--color-accent-hover-hex', '#ff6316'),
              boxShadow: 'none',
            },
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
            border: `1px solid ${readVar('--color-border-hex', '#27272A')}`,
            boxShadow: 'none',
            backgroundImage: 'none',
            borderRadius: 'var(--radius-lg)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: alpha(
              readVar('--color-surface-hex', isDark ? '#161618' : '#FFFFFF'),
              0.92
            ),
            borderBottom: `1px solid ${readVar('--color-border-hex', '#27272A')}`,
            boxShadow: 'none',
            backgroundImage: 'none',
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
            border: `1px solid ${readVar('--color-border-hex', '#27272A')}`,
            boxShadow: 'none',
            backgroundImage: 'none',
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
