import { Media } from "@/components/Media";
import type { Artwork } from "@/sanity/queries";

/** Fallback shape for pieces whose source dimensions aren't known yet. */
export const DEFAULT_RATIO = 0.8;

/**
 * One piece in the Work masonry. The tile takes the source's own aspect ratio
 * so the column keeps the staggered rhythm of the comps, and shows the gray
 * placeholder fill underneath while the media loads.
 */
export function WorkTile({
  piece,
  priority = false,
}: {
  piece: Artwork;
  priority?: boolean;
}) {
  return (
    <figure
      className="relative mb-5 w-full break-inside-avoid overflow-hidden bg-placeholder"
      style={{ aspectRatio: piece.aspectRatio ?? DEFAULT_RATIO }}
    >
      <Media artwork={piece} priority={priority} />
    </figure>
  );
}
