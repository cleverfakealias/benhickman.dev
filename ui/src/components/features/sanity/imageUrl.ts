import createImageUrlBuilder from '@sanity/image-url';
import { sanityClient } from './sanityClient';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Only create builder if sanityClient exists
const builder = sanityClient ? createImageUrlBuilder(sanityClient) : null;

export default function urlFor(source: SanityImageSource) {
  if (!builder) {
    console.warn('Sanity image builder not available - client not configured');
    return { url: () => '' };
  }
  return builder.image(source);
}
