import createImageUrlBuilder from '@sanity/image-url';
import { sanityClient } from './sanityClient';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import type { ImageUrlBuilder } from '@sanity/image-url/lib/types/builder';

// Only create builder if sanityClient exists
const builder = sanityClient ? createImageUrlBuilder(sanityClient) : null;

/**
 * Creates a Sanity image URL builder for the given source.
 * Returns a builder with proper typing for chaining methods.
 */
export default function urlFor(source: SanityImageSource): ImageUrlBuilder {
  if (!builder) {
    console.warn('Sanity image builder not available - client not configured');
    // Return a mock builder that returns empty string
    return {
      url: () => '',
      width: () => ({ url: () => '' }) as unknown as ImageUrlBuilder,
      height: () => ({ url: () => '' }) as unknown as ImageUrlBuilder,
    } as unknown as ImageUrlBuilder;
  }
  return builder.image(source);
}

/**
 * Interface for image dimension options
 */
interface ImageDimensions {
  width?: number;
  height?: number;
  quality?: number;
}

/**
 * Builds an optimized image URL with specified dimensions and quality.
 * Provides a cleaner API for common image operations.
 *
 * @param source - Sanity image source (mainImage object from BlogPost)
 * @param dimensions - Optional width, height, and quality settings
 * @returns Optimized image URL string
 *
 * @example
 * ```tsx
 * const imageUrl = buildImageUrl(post.mainImage, { width: 400, height: 200, quality: 80 });
 * ```
 */
export function buildImageUrl(
  source: SanityImageSource | null | undefined,
  dimensions?: ImageDimensions
): string {
  if (!source) return '';

  try {
    let imageBuilder = urlFor(source);

    if (dimensions?.width) {
      imageBuilder = imageBuilder.width(dimensions.width);
    }

    if (dimensions?.height) {
      imageBuilder = imageBuilder.height(dimensions.height);
    }

    if (dimensions?.quality) {
      imageBuilder = imageBuilder.quality(dimensions.quality);
    }

    return imageBuilder.url();
  } catch (error) {
    console.error('Error building image URL:', error);
    return '';
  }
}
