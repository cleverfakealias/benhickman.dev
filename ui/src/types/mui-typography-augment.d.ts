import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Typography {
    fontFamilyMonospace: string;
  }
  interface TypographyOptions {
    fontFamilyMonospace?: string;
  }
}
