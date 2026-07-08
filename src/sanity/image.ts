import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from "./env";

const builder = createImageUrlBuilder({ projectId, dataset });

/**
 * Build a Sanity CDN URL for an image asset. Sanity transforms images on the
 * fly (resize, crop to hotspot, format), so we hand a high-quality source URL
 * to next/image, which then does responsive AVIF/WebP delivery.
 *
 * @example urlForImage(artwork.image).width(1600).url()
 */
export function urlForImage(source: SanityImageSource) {
  return builder.image(source).auto("format").fit("max");
}
