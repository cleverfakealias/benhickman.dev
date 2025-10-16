import { createTheme, alpha } from '@mui/material/styles';

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
      main: readVar('--color-accent-hex', '#59d11f'),
      contrastText: readVar('--color-accent-contrast-hex', '#0b0f14'),
    },
    secondary: {
      main: readVar('--color-secondary-hex', '#33c2dd'),
      contrastText: readVar('--color-text-hex', '#0e1116'),
    },
    background: {
      default: readVar('--color-bg-hex', isDark ? '#0b1015' : '#f8fafc'),
      paper: readVar('--color-surface-hex', isDark ? '#10161d' : '#f3f5f7'),
    },
    text: {
      primary: readVar('--color-text-hex', isDark ? '#edf2f7' : '#0e1116'),
      secondary: readVar('--color-text-secondary-hex', isDark ? '#c8d0da' : '#4b5563'),
    },
    success: { main: readVar('--color-success-hex', '#34d399') },
    warning: { main: readVar('--color-warning-hex', '#fbbf24') },
    error: { main: readVar('--color-danger-hex', '#ef4444') },
  divider: readVar('--color-border-hex', isDark ? '#2a3441' : '#e4e8ee'),
  } as const;

  const shape = { borderRadius: 8 } as const;

  const shadows = [
    'none',
    readVar('--shadow-1', '0 1px 2px rgba(17,20,24,.06), 0 1px 1px rgba(17,20,24,.04)'),
    readVar('--shadow-2', '0 2px 6px rgba(17,20,24,.08), 0 1px 2px rgba(17,20,24,.06)'),
    readVar('--shadow-3', '0 6px 12px rgba(17,20,24,.10), 0 2px 4px rgba(17,20,24,.08)'),
    readVar('--shadow-4', '0 10px 20px rgba(17,20,24,.12), 0 4px 6px rgba(17,20,24,.10)'),
    readVar('--shadow-5', '0 18px 36px rgba(17,20,24,.16), 0 8px 12px rgba(17,20,24,.12)'),
    ...Array(19).fill('none'),
  ] as unknown as any;

  const typography = {
    fontFamily: "'InterVariable', Inter, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, system-ui, sans-serif",
    fontSize: 16,
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { lineHeight: 1.7 },
    body2: { lineHeight: 1.6 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: 0 },
  } as const;

  const theme = createTheme({
    palette,
    shape,
    shadows,
    typography,
    transitions: {
      duration: { shortest: 100, shorter: 150, short: 200, standard: 300, complex: 500, enteringScreen: 225, leavingScreen: 195 },
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
          body: { backgroundColor: palette.background.default as string, color: palette.text.primary as string },
          a: { color: palette.primary.main as string },
          '*, *::before, *::after': { outlineColor: readVar('--color-focus-hex', isDark ? '#74e02473' : '#63d21e73') },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 'var(--radius-md)',
            transition: `transform var(--motion-150) var(--easing-standard), background-color var(--motion-150) var(--easing-standard)`,
            '&:active': { transform: 'translateY(1px)' },
            '&.Mui-focusVisible': { boxShadow: `0 0 0 3px ${readVar('--color-focus-hex', '#63d21e73')}` },
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
          { props: { variant: 'soft' as any }, style: { backgroundColor: alpha(palette.primary.main as string, 0.12), color: palette.primary.main as string, border: `1px solid ${alpha(palette.primary.main as string, 0.2)}`, '&:hover': { backgroundColor: alpha(palette.primary.main as string, 0.18) } } },
          { props: { variant: 'ghost' as any }, style: { backgroundColor: 'transparent', color: palette.text.primary as string, '&:hover': { backgroundColor: alpha('#000', 0.04) } } },
          { props: { variant: 'link' as any }, style: { padding: 0, minWidth: 0, textDecoration: 'underline', color: palette.primary.main as string, '&:hover': { textDecorationThickness: '2px' } } },
        ],
      },
      MuiLink: {
        styleOverrides: {
          root: {
            textUnderlineOffset: '2px',
            color: palette.primary.main as string,
            '&:hover': { textDecorationThickness: '2px' },
            '&.Mui-focusVisible': { outline: `2px solid ${readVar('--color-focus-hex', '#63d21e73')}`, outlineOffset: '2px' },
          },
        },
      },
      MuiCard: { styleOverrides: { root: { backgroundColor: palette.background.paper as string, boxShadow: shadows[1] as string, borderRadius: 'var(--radius-lg)' } } },
      MuiAppBar: { styleOverrides: { root: { backdropFilter: 'saturate(140%) blur(10px)', backgroundColor: alpha(readVar('--color-surface-hex', isDark ? '#0f141a' : '#f6f7f9'), 0.9), boxShadow: shadows[1] as string } } },
      MuiInputBase: {
        styleOverrides: {
          root: { borderRadius: 'var(--radius-sm)' },
          input: { '&:focus-visible': { outline: `3px solid ${readVar('--color-focus-hex', '#63d21e73')}`, outlineOffset: '1px' } },
        },
      },
      MuiTextField: { defaultProps: { variant: 'outlined' } },
      MuiDialog: { styleOverrides: { paper: { backgroundColor: palette.background.paper as string, boxShadow: shadows[3] as string } } },
      MuiAlert: { styleOverrides: { standardSuccess: { backgroundColor: alpha('#34d399', 0.16) }, standardWarning: { backgroundColor: alpha('#fbbf24', 0.16) }, standardError: { backgroundColor: alpha('#ef4444', 0.16) } } },
    },
  });

  return theme;
};
