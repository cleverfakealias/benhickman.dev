// src/config/domainConfig.ts

export interface BrandInfo {
  name: string;
  logo: string;
  alt: string;
  subtitle?: string;
  title: string; // Add title for document.title
  description: string; // Add description for meta
}

export interface DomainConfig {
  formspreeUrl: string;
  recaptchaSiteKey: string;
  branding: BrandInfo;
}

// Helper to safely get env vars
const getEnv = (key: string) => {
  // Use import.meta.env for Vite client-side env vars
  if (
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    key in import.meta.env
  ) {
    return import.meta.env[key] as string;
  }
  return "";
};

const getDomainConfigs = (): Record<string, DomainConfig> => ({
  "zengineer.cloud": {
    formspreeUrl: getEnv("VITE_FORMSPREE_URL"),
    recaptchaSiteKey: getEnv("VITE_RECAPTCHA_ZENGINEER"),
    branding: {
      name: "Zengineer",
      logo: "/images/zengineer dark logo 2.png",
      alt: "Zengineer monogram logo",
      subtitle: "Cloud Architecture and Development",
      title:
        "Zengineer Cloud Software Development — Modern Cloud & Web Solutions",
      description:
        "Zengineer provides modern cloud and web solutions, specializing in cloud architecture and development.",
    },
  },
  "zennlogic.com": {
    formspreeUrl: getEnv("VITE_FORMSPREE_URL"),
    recaptchaSiteKey: getEnv("VITE_RECAPTCHA_ZENNLOGIC"),
    branding: {
      name: "ZennLogic",
      logo: "/images/ZL monogram.png",
      alt: "ZennLogic logo",
      subtitle: "Cloud Software Engineering",
      title: "ZennLogic — Cloud Software Engineering",
      description:
        "ZennLogic delivers expert cloud software engineering and development services.",
    },
  },
  "benhickman.dev": {
    formspreeUrl: getEnv("VITE_FORMSPREE_URL"),
    recaptchaSiteKey: getEnv("VITE_RECAPTCHA_OTHER"),
    branding: {
      name: "Ben Hickman",
      logo: "/images/BH monogram.png",
      alt: "Ben Hickman logo",
      subtitle: "Cloud Architecture and Engineering",
      title: "Ben Hickman — Cloud Architecture and Engineering",
      description:
        "Ben Hickman specializes in cloud architecture and engineering for modern businesses.",
    },
  },
});

export const getDomainConfig = (hostname?: string) => {
  const host =
    hostname ||
    (typeof window !== "undefined"
      ? window.location.hostname
      : "zengineer.cloud");
  const configs = getDomainConfigs();
  return configs[host] || configs["zengineer.cloud"];
};
