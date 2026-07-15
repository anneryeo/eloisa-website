import { Media } from "@/components/Media";
import type { Artwork } from "@/sanity/queries";

/** Fallback shape for pieces whose source dimensions aren't known yet. */
export const DEFAULT_RATIO = 0.8;

/**
 * One piece in the Work masonry, downsized to its column. The tile takes the
 * source's own aspect ratio so the column keeps the staggered rhythm of the
 * comps, and shows the gray placeholder fill underneath while media loads.
 * Clicking opens the piece at full size.
 */
export function WorkTile({
  piece,
  priority = false,
  onOpen,
}: {
  piece: Artwork;
  priority?: boolean;
  onOpen: () => void;
}) {
  return (
    <figure className="mb-5 break-inside-avoid">
      <button
        type="button"
        onClick={onOpen}
        style={{ aspectRatio: piece.aspectRatio ?? DEFAULT_RATIO }}
        className="relative block w-full overflow-hidden bg-placeholder outline-offset-4 transition-opacity duration-300 ease-gallery hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        <Media artwork={piece} priority={priority} />
        <span className="sr-only">View {piece.title} at full size</span>
      </button>
    </figure>
  );
}
