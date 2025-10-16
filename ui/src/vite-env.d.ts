/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  readonly VITE_RECAPTCHA_SITE_KEY?: string;
  readonly VITE_FORMSPREE_URL?: string;
  readonly VITE_HCAPTCHA_SITEKEY?: string;
  readonly VITE_SANITY_PROJECT_ID?: string;
  readonly VITE_SANITY_DATASET?: string;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
