import Image from "next/image";

import type { Artwork } from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";

/**
 * Renders an artwork's media by kind:
 *   - image : next/image (responsive AVIF/WebP, lazy-loaded, blur-friendly)
 *   - video : native <video>, muted-autoplay-loop for gallery motion
 *   - gif   : plain <img> so animation is preserved (next/image would freeze it)
 *
 * `priority` should be true for above-the-fold pieces to preload them.
 */
export function Media({
  artwork,
  priority = false,
  fullResolution = false,
}: {
  artwork: Artwork;
  priority?: boolean;
  fullResolution?: boolean;
}) {
  if (artwork.mediaType === "video" && artwork.fileUrl) {
    return (
      <video
        className="h-full w-full object-cover"
        src={artwork.fileUrl}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
    );
  }

  if (artwork.mediaType === "gif" && artwork.fileUrl) {
    return (
      // next/image would freeze the animation, so a raw <img> is intentional.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className="h-full w-full object-cover"
        src={artwork.fileUrl}
        alt={artwork.title}
        loading={priority ? "eager" : "lazy"}
      />
    );
  }

  // Image piece. Prefer a real Sanity asset; fall back to the sample data URI.
  const src = artwork.image
    ? fullResolution
      ? urlForImage(artwork.image).url()
      : urlForImage(artwork.image).width(1600).url()
    : artwork.fileUrl;

  if (!src) return null;

  const isRemote = artwork.image != null;

  return (
    <Image
      className="h-full w-full object-cover"
      src={src}
      alt={artwork.title}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      priority={priority}
      // Sample data URIs aren't on the Sanity CDN, so skip optimization for them.
      unoptimized={!isRemote || fullResolution}
    />
  );
}
