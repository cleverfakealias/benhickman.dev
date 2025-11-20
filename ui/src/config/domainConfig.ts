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

const formspreeUrl = import.meta.env.VITE_FORMSPREE_URL || '';
const hCaptchaSiteKey = import.meta.env.VITE_HCAPTCHA_SITEKEY || '';

export const domainConfigs: Record<string, DomainConfig> = {
  'benhickman.dev': {
    formspreeUrl: formspreeUrl,
    hCaptchaSiteKey: hCaptchaSiteKey,
    branding: {
      name: 'Ben Hickman',
      logo: '/images/monogram.png',
      alt: 'Ben Hickman logo',
      subtitle: 'Cloud Architecture and Engineering',
      title: 'Ben Hickman | Cloud Architecture and Engineering',
      description:
        'Ben Hickman specializes in cloud architecture and engineering, offering tailored solutions for modern businesses.',
    },
  },
  localhost: {
    formspreeUrl: formspreeUrl,
    hCaptchaSiteKey: hCaptchaSiteKey,
    branding: {
      name: 'Localhost',
      logo: '/images/monogram.png',
      alt: 'Ben Hickman logo',
      subtitle: 'Localhost Running',
      title: 'Localhost | Cloud Architecture and Engineering',
      description:
        'Ben Hickman specializes in cloud architecture and engineering, offering tailored solutions for modern businesses.',
    },
  },
};

export const getDomainConfig = (hostname?: string): DomainConfig => {
  const host =
    hostname || (typeof window !== 'undefined' ? window.location.hostname : 'benhickman.dev');
  const fallback = domainConfigs['benhickman.dev'];
  const cfg = domainConfigs[host as keyof typeof domainConfigs];
  return (cfg || fallback) as DomainConfig;
};

export const updateMetaTags = (hostname?: string) => {
  const config = getDomainConfig(hostname);
  const host =
    hostname || (typeof window !== 'undefined' ? window.location.hostname : 'benhickman.dev');

  document.title = config.branding.title;

  // Update meta description
  const descMeta = document.querySelector('meta[name="description"]');
  if (descMeta) descMeta.setAttribute('content', config.branding.description);

  // Update OG
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', config.branding.title);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', config.branding.description);

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', `https://${host}/`);

  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage) ogImage.setAttribute('content', `https://${host}${config.branding.logo}`);

  // Twitter
  const twTitle = document.querySelector('meta[property="twitter:title"]');
  if (twTitle) twTitle.setAttribute('content', config.branding.title);

  const twDesc = document.querySelector('meta[property="twitter:description"]');
  if (twDesc) twDesc.setAttribute('content', config.branding.description);

  const twUrl = document.querySelector('meta[property="twitter:url"]');
  if (twUrl) twUrl.setAttribute('content', `https://${host}/`);

  const twImage = document.querySelector('meta[property="twitter:image"]');
  if (twImage) twImage.setAttribute('content', `https://${host}${config.branding.logo}`);

  // Canonical
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', `https://${host}/`);

  // Structured data - update the JSON-LD
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  scripts.forEach((script) => {
    const data = JSON.parse(script.textContent || '{}');
    if (data['@type'] === 'Organization') {
      data.name = config.branding.name;
      data.url = `https://${host}`;
      data.logo = `https://${host}${config.branding.logo}`;
      data.description = config.branding.description;
      script.textContent = JSON.stringify(data);
    } else if (data['@type'] === 'WebSite') {
      data.name = config.branding.name;
      data.url = `https://${host}`;
      data.description = config.branding.subtitle || config.branding.description;
      script.textContent = JSON.stringify(data);
    }
  });
};
