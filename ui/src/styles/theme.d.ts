// theme.d.ts
import '@mui/material/styles';
import { shadowTokens, gradientTokens, borderTokens, transitionTokens } from './colorTokens';

declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      gradients: typeof gradientTokens;
      shadows: typeof shadowTokens;
      transitions: typeof transitionTokens;
      borders: typeof borderTokens;
      getCardStyles: () => React.CSSProperties;
      getSocialStyles: () => React.CSSProperties;
      getCallToActionStyles: () => React.CSSProperties;
    };
  }

  interface ThemeOptions {
    custom?: {
      gradients?: typeof gradientTokens;
      shadows?: typeof shadowTokens;
      transitions?: typeof transitionTokens;
      borders?: typeof borderTokens;
      getCardStyles?: () => React.CSSProperties;
      getSocialStyles?: () => React.CSSProperties;
      getCallToActionStyles?: () => React.CSSProperties;
    };
  }
}
