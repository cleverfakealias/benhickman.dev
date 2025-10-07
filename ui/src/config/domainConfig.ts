// src/config/domainConfig.ts

export interface BrandInfo {
  name: string;
  logo: string;
  alt: string;
  subtitle?: string;
  title: string;
  description: string;
}

export interface DomainConfig {
  formspreeUrl: string;
  hCaptchaSiteKey: string;
  branding: BrandInfo;
}

export const domainConfigs: Record<string, DomainConfig> = {
  "zengineer.cloud": {
    formspreeUrl: import.meta.env.VITE_FORMSPREE_URL || "",
    hCaptchaSiteKey: import.meta.env.VITE_HCAPTCHA_SITEKEY || "",
    branding: {
      name: "Zengineer",
      logo: "/images/zengineer dark logo 2.png",
      alt: "Zengineer monogram logo",
      subtitle: "Cloud Architecture and Development",
      title: "Zengineer | Cloud Architecture and Development",
      description:
        "Zengineer provides expert cloud architecture and development services, specializing in scalable, modern software solutions.",
    },
  },
  "zennlogic.com": {
    formspreeUrl: import.meta.env.VITE_FORMSPREE_URL || "",
    hCaptchaSiteKey: import.meta.env.VITE_HCAPTCHA_SITEKEY || "",
    branding: {
      name: "ZennLogic",
      logo: "/images/ZL monogram.png",
      alt: "ZennLogic logo",
      subtitle: "Cloud Software Engineering",
      title: "ZennLogic | Cloud Software Engineering",
      description:
        "ZennLogic delivers cloud software engineering solutions, focusing on robust, efficient, and innovative cloud applications.",
    },
  },
  "benhickman.dev": {
    formspreeUrl: import.meta.env.VITE_FORMSPREE_URL || "",
    hCaptchaSiteKey: import.meta.env.VITE_HCAPTCHA_SITEKEY || "",
    branding: {
      name: "Ben Hickman",
      logo: "/images/BH monogram.png",
      alt: "Ben Hickman logo",
      subtitle: "Cloud Architecture and Engineering",
      title: "Ben Hickman | Cloud Architecture and Engineering",
      description:
        "Ben Hickman specializes in cloud architecture and engineering, offering tailored solutions for modern businesses.",
    },
  },
  localhost: {
    formspreeUrl: import.meta.env.VITE_FORMSPREE_URL || "",
    hCaptchaSiteKey: import.meta.env.VITE_HCAPTCHA_SITEKEY || "",
    branding: {
      name: "Localhost",
      logo: "/images/BH monogram.png",
      alt: "Ben Hickman logo",
      subtitle: "Localhost Running",
      title: "Localhost | Cloud Architecture and Engineering",
      description:
        "Ben Hickman specializes in cloud architecture and engineering, offering tailored solutions for modern businesses.",
    },
  },
};

export const getDomainConfig = (hostname?: string) => {
  const host =
    hostname ||
    (typeof window !== "undefined"
      ? window.location.hostname
      : "zengineer.cloud");
  return domainConfigs[host] || domainConfigs["zengineer.cloud"];
};
