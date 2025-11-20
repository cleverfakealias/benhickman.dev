// Home Page types for Sanity CMS

export interface SanityImageAsset {
    _id: string;
    url: string;
    metadata?: {
        lqip?: string;
        dimensions?: {
            width: number;
            height: number;
            aspectRatio: number;
        };
    };
}

export interface HomeImageAsset {
    image?: {
        asset?: SanityImageAsset;
    };
    alt: string;
    caption?: string;
}

export interface HomeResponsiveImagePipeline {
    desktop: HomeImageAsset;
    tablet?: HomeImageAsset;
    mobile: HomeImageAsset;
}

export interface HomeCta {
    _type: 'homeCta';
    label: string;
    href: string;
    style: 'primary' | 'secondary' | 'link';
}

export interface HomeHeroModule {
    _type: 'homeHeroModule';
    _key: string;
    internalTitle: string;
    eyebrow?: string;
    headline: string;
    lede?: string;
    primaryCta: HomeCta;
    secondaryCta?: HomeCta;
    media: HomeResponsiveImagePipeline;
    layout: 'media-right' | 'media-left' | 'content-only';
    emphasis: 'brand' | 'neutral' | 'surface';
}

export interface HomeContentSectionModule {
    _type: 'homeContentSectionModule';
    _key: string;
    internalTitle: string;
    headline: string;
    body: unknown[]; // Portable text blocks
    media?: HomeImageAsset;
    layout: 'content-left' | 'content-right' | 'full-width';
    cta?: HomeCta;
}

export type HomeModule = HomeHeroModule | HomeContentSectionModule;

export interface HomePage {
    _id: string;
    organizationId: string;
    internalTitle: string;
    seoDescription?: string;
    modules: HomeModule[];
}
