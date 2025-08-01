// src/config/domainConfig.ts

export interface BrandInfo {
  name: string;
  logo: string;
  alt: string;
  subtitle?: string;
}

export interface DomainConfig {
  formspreeUrl: string;
  recaptchaSiteKey: string;
  branding: BrandInfo;
}

export const domainConfigs: Record<string, DomainConfig> = {
  "zengineer.cloud": {
    formspreeUrl: import.meta.env.VITE_FORMSPREE_URL || "",
    recaptchaSiteKey: import.meta.env.VITE_RECAPTCHA_ZENGINEER,
    branding: {
      name: "Zengineer",
      logo: "/images/zengineer dark logo 2.png",
      alt: "Zengineer monogram logo",
      subtitle: "Cloud Architecture and Development",
    },
  },
  "zennlogic.com": {
    formspreeUrl: import.meta.env.VITE_FORMSPREE_URL || "",
    recaptchaSiteKey:  import.meta.env.VITE_RECAPTCHA_ZENNLOGIC,
    branding: {
      name: "ZennLogic",
      logo: "/images/ZL monogram.png",
      alt: "ZennLogic logo",
      subtitle: "Cloud Software Engineering",
    },
  },
  "benhickman.dev": {
    formspreeUrl: import.meta.env.VITE_FORMSPREE_URL || "",
    recaptchaSiteKey: import.meta.env.VITE_RECAPTCHA_OTHER,
    branding: {
      name: "Ben Hickman",
      logo: "/images/BH monogram.png",
      alt: "Ben Hickman logo",
      subtitle: "Cloud Architecture and Engineering",
    },
  },
};

export const getDomainConfig = (hostname?: string) => {
  const host =
    hostname ||
    (typeof window !== "undefined" ? window.location.hostname : "zengineer.cloud");
  return domainConfigs[host] || domainConfigs["zengineer.cloud"];
};
