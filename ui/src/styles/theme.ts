import { createTheme } from "@mui/material/styles";

// Minnesota Sports Team Color Palette
export const mnColors = {
  // MN United Colors
  loonGray: "#8CD2EF",
  unitedDarkBlue: "#263E68",
  unitedLightGray: "#EEEEEE",

  // Vikings Colors (Updated with ABE purple)
  vikingsPurple: "#412A91", // Updated to match ABE image
  vikingsGold: "#FFC62F",
  vikingsWhite: "#FFFFFF",

  // Twins Colors
  twinsNavy: "#002B5C",
  twinsRed: "#C6011F",
  twinsGold: "#CFAB7A",

  // Additional shades for better theming
  lightBackground: "#FAFAFA",
  darkBackground: "#121212",
  mediumGray: "#666666",
  lightGray: "#AAAAAA",
  darkGray: "#333333",
};

// Theme configuration for light and dark modes
export const mnThemeConfig = {
  light: {
    primary: mnColors.vikingsPurple,
    secondary: mnColors.loonGray,
    accent: mnColors.loonGray,
    background: {
      default: mnColors.lightBackground,
      paper: mnColors.unitedLightGray,
    },
    text: {
      primary: mnColors.twinsNavy,
      secondary: mnColors.mediumGray,
    },
    socialIcons: {
      default: mnColors.unitedLightGray,
      hover: mnColors.vikingsPurple,
      shadow: mnColors.loonGray,
    },
    footer: {
      background: mnColors.vikingsPurple,
      text: mnColors.vikingsWhite,
    },
  },
  dark: {
    primary: mnColors.loonGray,
    secondary: mnColors.vikingsPurple,
    accent: mnColors.twinsGold,
    background: {
      default: mnColors.darkBackground,
      paper: mnColors.darkGray,
    },
    text: {
      primary: mnColors.vikingsWhite,
      secondary: mnColors.lightGray,
    },
    socialIcons: {
      default: mnColors.unitedLightGray,
      hover: mnColors.loonGray,
      shadow: mnColors.vikingsPurple,
    },
    footer: {
      background: mnColors.vikingsPurple,
      text: mnColors.vikingsWhite,
    },
  },
};

// Add or update fontFamily in theme config
export const fontFamilies = {
  heading: "'Manrope', Arial, sans-serif",
  body: "'Space Grotesk', Arial, sans-serif",
  mono: "'JetBrains Mono', 'Fira Mono', 'Menlo', monospace",
};

// Common styling patterns used throughout the site
const commonStyles = {
  // Gradient patterns
  gradients: {
    primary: "linear-gradient(90deg, #412A91, #002B5C)",
    primaryDark: "linear-gradient(90deg, #7C4DFF, #448AFF)",
    accent: "linear-gradient(135deg, #8CD2EF, #5DADE2)",
    card: {
      light:
        "linear-gradient(145deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.96) 100%)",
      dark: "linear-gradient(145deg, rgba(30,30,30,0.95) 0%, rgba(40,40,40,0.95) 100%)",
      hover: {
        light:
          "linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
        dark: "linear-gradient(145deg, rgba(50,50,50,0.95) 0%, rgba(60,60,60,0.95) 100%)",
      },
    },
    hero: {
      light: "linear-gradient(135deg, #f5f7fa 0%, #e8eaf6 100%)",
      dark: "linear-gradient(135deg, #23243a 0%, #2c2e4d 100%)",
    },
    callToAction: {
      light:
        "linear-gradient(135deg, rgba(65,42,145,0.03) 0%, rgba(0,43,92,0.03) 100%)",
      dark: "linear-gradient(135deg, rgba(124,77,255,0.05) 0%, rgba(68,138,255,0.05) 100%)",
    },
  },

  // Shadow patterns
  shadows: {
    card: {
      light: "0 4px 32px 0 rgba(65,42,145,0.08)",
      dark: "0 4px 32px 0 rgba(124,77,255,0.10)",
      hover: {
        light: "0 8px 48px 0 rgba(65,42,145,0.12)",
        dark: "0 8px 48px 0 rgba(124,77,255,0.15)",
      },
    },
    button: {
      light: "0 2px 8px 0 rgba(65,42,145,0.12)",
      dark: "0 2px 8px 0 rgba(124,77,255,0.18)",
      hover: {
        light: "0 4px 16px 0 rgba(65,42,145,0.18)",
        dark: "0 4px 16px 0 rgba(124,77,255,0.25)",
      },
    },
    social: {
      light: "0 4px 16px 0 rgba(65,42,145,0.15)",
      dark: "0 4px 16px 0 rgba(124,77,255,0.20)",
    },
  },

  // Transition patterns
  transitions: {
    standard: "all 0.3s ease",
    smooth: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fast: "all 0.2s ease-in-out",
  },

  // Border patterns
  borders: {
    card: {
      light: "1px solid rgba(65,42,145,0.08)",
      dark: "1px solid rgba(124,77,255,0.1)",
    },
    social: {
      light: "1px solid rgba(65,42,145,0.08)",
      dark: "1px solid rgba(255,255,255,0.08)",
    },
  },
};

// Function to create theme based on mode
export const createMnTheme = (mode: "light" | "dark") => {
  const config = mnThemeConfig[mode];
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      primary: { main: config.primary },
      secondary: { main: config.secondary },
      background: config.background,
      text: config.text,
    },
    shape: {
      borderRadius: 4, // Less aggressive, subtle rounding
    },
    typography: {
      fontFamily: [
        fontFamilies.heading,
        fontFamilies.body,
      ].join(","),
      h1: {
        fontWeight: 700,
        fontSize: "2.5rem",
        letterSpacing: "-0.02em",
        lineHeight: 1.2,
      },
      h2: {
        fontWeight: 700,
        fontSize: "2rem",
        letterSpacing: "-0.01em",
        lineHeight: 1.25,
      },
      h3: {
        fontWeight: 600,
        fontSize: "1.5rem",
        lineHeight: 1.3,
      },
      h4: {
        fontWeight: 600,
        fontSize: "1.25rem",
        lineHeight: 1.35,
      },
      h5: {
        fontWeight: 500,
        fontSize: "1.1rem",
        lineHeight: 1.4,
      },
      h6: {
        fontWeight: 500,
        fontSize: "1rem",
        lineHeight: 1.4,
      },
      body1: {
        fontWeight: 400,
        fontSize: "1rem",
        lineHeight: 1.7,
      },
      body2: {
        fontWeight: 400,
        fontSize: "0.95rem",
        lineHeight: 1.6,
      },
      button: {
        fontWeight: 600,
        borderRadius: 12,
        textTransform: "none",
        letterSpacing: 0,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            "--social-icon-color": config.socialIcons.default,
            "--social-icon-hover": config.socialIcons.hover,
            "--social-icon-shadow": config.socialIcons.shadow,
            "--footer-bg": config.footer.background,
            "--footer-text": config.footer.text,
            "--header-bg": config.footer.background, // Same as footer for consistency
            "--header-text": config.footer.text,
            "--header-link-hover": config.socialIcons.hover,
            "--header-link-glow": config.socialIcons.shadow,
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
            backdropFilter: "blur(10px)",
            border: isDark
              ? commonStyles.borders.card.dark
              : commonStyles.borders.card.light,
            borderRadius: 16,
            boxShadow: isDark
              ? commonStyles.shadows.card.dark
              : commonStyles.shadows.card.light,
            overflow: "hidden",
            position: "relative",
            "&:hover": {
              transform: "translateY(-8px) scale(1.02)",
              boxShadow: isDark
                ? commonStyles.shadows.card.hover.dark
                : commonStyles.shadows.card.hover.light,
              background: isDark
                ? commonStyles.gradients.card.hover.dark
                : commonStyles.gradients.card.hover.light,
            },
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
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
            boxShadow: isDark
              ? commonStyles.shadows.card.dark
              : commonStyles.shadows.card.light,
          },
          elevation2: {
            boxShadow: isDark
              ? commonStyles.shadows.card.dark
              : commonStyles.shadows.card.light,
          },
          elevation3: {
            boxShadow: isDark
              ? commonStyles.shadows.card.dark
              : commonStyles.shadows.card.light,
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
            "&:hover": {
              boxShadow: isDark
                ? commonStyles.shadows.button.hover.dark
                : commonStyles.shadows.button.hover.light,
            },
          },
          contained: {
            background: `linear-gradient(90deg, ${config.primary} 0%, ${config.secondary} 100%)`,
            color: "#ffffff",
            "&:hover": {
              background: `linear-gradient(90deg, ${config.primary}dd 0%, ${config.secondary}dd 100%)`,
              color: "#ffffff",
            },
          },
        },
      },
      // Chip component styling
      MuiChip: {
        styleOverrides: {
          root: {
            transition: commonStyles.transitions.standard,
            "&:hover": {
              transform: "translateY(-1px)",
            },
          },
        },
      },
    },
    // Custom theme extensions
    custom: {
      gradients: commonStyles.gradients,
      shadows: commonStyles.shadows,
      transitions: commonStyles.transitions,
      borders: commonStyles.borders,
      // Helper functions for common patterns
      getCardStyles: () => ({
        transition: commonStyles.transitions.smooth,
        background: isDark
          ? commonStyles.gradients.card.dark
          : commonStyles.gradients.card.light,
        backdropFilter: "blur(10px)",
        border: isDark
          ? commonStyles.borders.card.dark
          : commonStyles.borders.card.light,
        borderRadius: 16,
        boxShadow: isDark
          ? commonStyles.shadows.card.dark
          : commonStyles.shadows.card.light,
        overflow: "hidden",
        position: "relative" as const,
        "&:hover": {
          transform: "translateY(-8px) scale(1.02)",
          boxShadow: isDark
            ? commonStyles.shadows.card.hover.dark
            : commonStyles.shadows.card.hover.light,
          background: isDark
            ? commonStyles.gradients.card.hover.dark
            : commonStyles.gradients.card.hover.light,
        },
      }),
      getSocialStyles: () => ({
        transition: commonStyles.transitions.standard,
        background: isDark ? "rgba(255,255,255,0.04)" : "rgba(65,42,145,0.02)",
        border: isDark
          ? commonStyles.borders.social.dark
          : commonStyles.borders.social.light,
        "&:hover": {
          transform: "translateY(-2px)",
          background: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(65,42,145,0.04)",
          boxShadow: isDark
            ? commonStyles.shadows.social.dark
            : commonStyles.shadows.social.light,
        },
      }),
      getCallToActionStyles: () => ({
        background: isDark
          ? commonStyles.gradients.callToAction.dark
          : commonStyles.gradients.callToAction.light,
        border: isDark
          ? commonStyles.borders.card.dark
          : commonStyles.borders.card.light,
        borderRadius: 4,
        "& .MuiTypography-root": {
          color: isDark ? "#ffffff" : "inherit",
        },
      }),
    },
  });
};

// Type augmentation for custom theme properties
declare module "@mui/material/styles" {
  interface Theme {
    custom: {
      gradients: typeof commonStyles.gradients;
      shadows: typeof commonStyles.shadows;
      transitions: typeof commonStyles.transitions;
      borders: typeof commonStyles.borders;
      getCardStyles: () => object;
      getSocialStyles: () => object;
      getCallToActionStyles: () => object;
    };
  }
  interface ThemeOptions {
    custom?: {
      gradients?: typeof commonStyles.gradients;
      shadows?: typeof commonStyles.shadows;
      transitions?: typeof commonStyles.transitions;
      borders?: typeof commonStyles.borders;
      getCardStyles?: () => object;
      getSocialStyles?: () => object;
      getCallToActionStyles?: () => object;
    };
  }
}
