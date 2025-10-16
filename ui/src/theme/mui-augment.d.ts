import '@mui/material/Button';

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    soft: true;
    ghost: true;
    link: true;
  }
}
