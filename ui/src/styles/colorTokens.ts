// Color Token System - Single source of truth for all colors
export const colorTokens = {
  // Base color palette - Minnesota sports theme
  mn: {
    // MN United Colors
    loonGray: '#8CD2EF',
    unitedDarkBlue: '#263E68',
    unitedLightGray: '#EEEEEE',

    // Vikings Colors (ABE purple theme)
    vikingsPurple: '#412A91', // Primary purple
    vikingsGold: '#FFC62F',
    vikingsWhite: '#FFFFFF',

    // Twins Colors
    twinsNavy: '#002B5C',
    twinsRed: '#C6011F',
    twinsGold: '#CFAB7A',

    // Neutral grays
    lightBackground: '#FAFAFA',
    darkBackground: '#121212',
    mediumGray: '#666666',
    lightGray: '#AAAAAA',
    darkGray: '#333333',
  },

  // Semantic color mappings
  semantic: {
    // Primary brand colors
    primary: '#412A91', // Vikings purple
    secondary: '#8CD2EF', // Loon gray
    accent: '#FFC62F', // Vikings gold

    // Status colors
    success: '#27C93F',
    warning: '#FFC62F',
    error: '#C6011F',
    info: '#8CD2EF',

    // Neutral colors
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
  },

  // Alpha variations for overlays and subtle effects
  alpha: {
    primary: {
      3: 'rgba(65, 42, 145, 0.03)',
      5: 'rgba(65, 42, 145, 0.05)',
      8: 'rgba(65, 42, 145, 0.08)',
      10: 'rgba(65, 42, 145, 0.1)',
      12: 'rgba(65, 42, 145, 0.12)',
      15: 'rgba(65, 42, 145, 0.15)',
      18: 'rgba(65, 42, 145, 0.18)',
      20: 'rgba(65, 42, 145, 0.2)',
      25: 'rgba(65, 42, 145, 0.25)',
      30: 'rgba(65, 42, 145, 0.3)',
      50: 'rgba(65, 42, 145, 0.5)',
      80: 'rgba(65, 42, 145, 0.8)',
    },
    secondary: {
      3: 'rgba(140, 210, 239, 0.03)',
      5: 'rgba(140, 210, 239, 0.05)',
      8: 'rgba(140, 210, 239, 0.08)',
      10: 'rgba(140, 210, 239, 0.1)',
      12: 'rgba(140, 210, 239, 0.12)',
      15: 'rgba(140, 210, 239, 0.15)',
      18: 'rgba(140, 210, 239, 0.18)',
      20: 'rgba(140, 210, 239, 0.2)',
      25: 'rgba(140, 210, 239, 0.25)',
      30: 'rgba(140, 210, 239, 0.3)',
      50: 'rgba(140, 210, 239, 0.5)',
      80: 'rgba(140, 210, 239, 0.8)',
    },
    black: {
      10: 'rgba(0, 0, 0, 0.1)',
      20: 'rgba(0, 0, 0, 0.2)',
      30: 'rgba(0, 0, 0, 0.3)',
      50: 'rgba(0, 0, 0, 0.5)',
      80: 'rgba(0, 0, 0, 0.8)',
    },
    white: {
      8: 'rgba(255, 255, 255, 0.08)',
      10: 'rgba(255, 255, 255, 0.1)',
      20: 'rgba(255, 255, 255, 0.2)',
      30: 'rgba(255, 255, 255, 0.3)',
      50: 'rgba(255, 255, 255, 0.5)',
      80: 'rgba(255, 255, 255, 0.8)',
    },
  },
};

// Theme mode configurations using tokens
export const themeConfigs = {
  light: {
    primary: colorTokens.semantic.primary,
    secondary: colorTokens.semantic.secondary,
    accent: colorTokens.semantic.accent,
    background: {
      default: colorTokens.mn.lightBackground,
      paper: colorTokens.mn.unitedLightGray,
    },
    text: {
      primary: colorTokens.mn.twinsNavy,
      secondary: colorTokens.mn.mediumGray,
    },
    socialIcons: {
      default: colorTokens.mn.unitedLightGray,
      hover: colorTokens.semantic.primary,
      shadow: colorTokens.semantic.secondary,
    },
    header: {
      background: colorTokens.semantic.white,
      text: colorTokens.mn.twinsNavy,
      linkHover: colorTokens.semantic.secondary,
      activeLink: colorTokens.semantic.primary,
    },
    footer: {
      background: colorTokens.semantic.primary,
      text: colorTokens.semantic.white,
    },
  },
  dark: {
    primary: colorTokens.semantic.secondary,
    secondary: colorTokens.semantic.primary,
    accent: colorTokens.semantic.accent,
    background: {
      default: colorTokens.mn.darkGray,
      paper: colorTokens.mn.darkGray,
    },
    text: {
      primary: colorTokens.semantic.white,
      secondary: colorTokens.mn.lightGray,
    },
    socialIcons: {
      default: colorTokens.mn.unitedLightGray,
      hover: colorTokens.semantic.secondary,
      shadow: colorTokens.semantic.primary,
    },
    header: {
      background: colorTokens.mn.darkBackground,
      text: colorTokens.semantic.white,
      linkHover: colorTokens.semantic.secondary,
      activeLink: colorTokens.semantic.secondary,
    },
    footer: {
      background: colorTokens.mn.darkBackground,
      text: colorTokens.semantic.white,
    },
  },
};

// Font configurations
export const fontConfigs = {
  heading: "'Manrope', Arial, sans-serif",
  body: "'Space Grotesk', Arial, sans-serif",
  mono: "'JetBrains Mono', 'Fira Mono', 'Menlo', monospace",
};

// Shadow tokens
export const shadowTokens = {
  card: {
    light: `0 4px 32px 0 ${colorTokens.alpha.primary[8]}`,
    dark: `0 4px 32px 0 ${colorTokens.alpha.secondary[10]}`,
    hover: {
      light: `0 8px 48px 0 ${colorTokens.alpha.primary[12]}`,
      dark: `0 8px 48px 0 ${colorTokens.alpha.secondary[15]}`,
    },
  },
  button: {
    light: `0 2px 8px 0 ${colorTokens.alpha.primary[12]}`,
    dark: `0 2px 8px 0 ${colorTokens.alpha.secondary[18]}`,
    hover: {
      light: `0 4px 16px 0 ${colorTokens.alpha.primary[18]}`,
      dark: `0 4px 16px 0 ${colorTokens.alpha.secondary[25]}`,
    },
  },
  social: {
    light: `0 4px 16px 0 ${colorTokens.alpha.primary[15]}`,
    dark: `0 4px 16px 0 ${colorTokens.alpha.secondary[20]}`,
  },
};

// Gradient tokens
export const gradientTokens = {
  primary: `linear-gradient(90deg, ${colorTokens.semantic.primary}, ${colorTokens.mn.twinsNavy})`,
  primaryDark: `linear-gradient(90deg, ${colorTokens.alpha.secondary[80]}, ${colorTokens.alpha.primary[80]})`,
  accent: `linear-gradient(135deg, ${colorTokens.semantic.secondary}, ${colorTokens.mn.twinsNavy})`,
  card: {
    light: `linear-gradient(145deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.96) 100%)`,
    dark: `linear-gradient(145deg, rgba(30,30,30,0.95) 0%, rgba(40,40,40,0.95) 100%)`,
    hover: {
      light: `linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)`,
      dark: `linear-gradient(145deg, rgba(50,50,50,0.95) 0%, rgba(60,60,60,0.95) 100%)`,
    },
  },
  hero: {
    light: `linear-gradient(135deg, ${colorTokens.mn.lightBackground} 0%, ${colorTokens.alpha.primary[5]} 100%)`,
    dark: `linear-gradient(135deg, ${colorTokens.mn.darkBackground} 0%, ${colorTokens.alpha.primary[5]} 100%)`,
  },
  callToAction: {
    light: `linear-gradient(135deg, ${colorTokens.alpha.primary[3]} 0%, ${colorTokens.alpha.secondary[3]} 100%)`,
    dark: `linear-gradient(135deg, ${colorTokens.alpha.secondary[5]} 0%, ${colorTokens.alpha.primary[5]} 100%)`,
  },
};

// Border tokens
export const borderTokens = {
  card: {
    light: `1px solid ${colorTokens.alpha.primary[8]}`,
    dark: `1px solid ${colorTokens.alpha.secondary[10]}`,
  },
  social: {
    light: `1px solid ${colorTokens.alpha.primary[8]}`,
    dark: `1px solid ${colorTokens.alpha.white[8]}`,
  },
};

// Transition tokens
export const transitionTokens = {
  standard: 'all 0.3s ease',
  smooth: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  fast: 'all 0.2s ease-in-out',
};
