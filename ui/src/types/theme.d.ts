import '@mui/material/styles';

// Type augmentation for custom theme properties
declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      gradients: {
        primary: string;
        primaryDark: string;
        accent: string;
        card: {
          light: string;
          dark: string;
          hover: {
            light: string;
            dark: string;
          };
        };
        hero: {
          light: string;
          dark: string;
        };
        callToAction: {
          light: string;
          dark: string;
        };
      };
      shadows: {
        card: {
          light: string;
          dark: string;
          hover: {
            light: string;
            dark: string;
          };
        };
        button: {
          light: string;
          dark: string;
          hover: {
            light: string;
            dark: string;
          };
        };
        social: {
          light: string;
          dark: string;
        };
      };
      transitions: {
        standard: string;
        smooth: string;
        fast: string;
      };
      borders: {
        card: {
          light: string;
          dark: string;
        };
        social: {
          light: string;
          dark: string;
        };
      };
      getCardStyles: () => object;
      getSocialStyles: () => object;
      getCallToActionStyles: () => object;
    };
  }

  interface ThemeOptions {
    custom?: {
      gradients?: {
        primary?: string;
        primaryDark?: string;
        accent?: string;
        card?: {
          light?: string;
          dark?: string;
          hover?: {
            light?: string;
            dark?: string;
          };
        };
        hero?: {
          light?: string;
          dark?: string;
        };
        callToAction?: {
          light?: string;
          dark?: string;
        };
      };
      shadows?: {
        card?: {
          light?: string;
          dark?: string;
          hover?: {
            light?: string;
            dark?: string;
          };
        };
        button?: {
          light?: string;
          dark?: string;
          hover?: {
            light?: string;
            dark?: string;
          };
        };
        social?: {
          light?: string;
          dark?: string;
        };
      };
      transitions?: {
        standard?: string;
        smooth?: string;
        fast?: string;
      };
      borders?: {
        card?: {
          light?: string;
          dark?: string;
        };
        social?: {
          light?: string;
          dark?: string;
        };
      };
      getCardStyles?: () => object;
      getSocialStyles?: () => object;
      getCallToActionStyles?: () => object;
    };
  }
}
