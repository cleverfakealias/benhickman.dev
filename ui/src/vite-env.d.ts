/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  [key: string]: string | undefined;
  readonly VITE_RECAPTCHA_SITE_KEY?: string;
  readonly VITE_FORMSPREE_URL?: string;
  readonly VITE_HCAPTCHA_SITEKEY?: string;
  readonly VITE_SANITY_PROJECT_ID?: string;
  readonly VITE_SANITY_DATASET?: string;
  readonly VITE_GA_MEASUREMENT_ID?: string;
}

declare interface Window {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
}
