import type { Artwork } from "@/sanity/queries";
import { WorkTile } from "./WorkTile";

/** Multi-column masonry; tiles keep their own aspect ratios and flow down. */
const COLUMNS = "columns-1 gap-5 sm:columns-2 lg:columns-3";

/**
 * Aspect ratios (width ÷ height) traced from the staggered three-column grid in
 * the comps. These shape the gray placeholder tiles shown while the CMS is
 * empty, so the layout can be reviewed before any work is published.
 */
const PLACEHOLDER_RATIOS = [0.93, 1.04, 0.67, 0.7, 0.79, 0.99];

export function WorkGrid({ pieces }: { pieces: Artwork[] }) {
  if (pieces.length === 0) {
    return (
      <>
        <p className="sr-only">No work has been published yet.</p>
        <div className={COLUMNS} aria-hidden="true">
          {PLACEHOLDER_RATIOS.map((ratio, index) => (
            <div
              key={index}
              className="mb-5 w-full break-inside-avoid bg-placeholder"
              style={{ aspectRatio: ratio }}
            />
          ))}
        </div>
      </>
    );
  }

  return (
    <div className={COLUMNS}>
      {pieces.map((piece, index) => (
        <WorkTile key={piece._id} piece={piece} priority={index < 3} />
      ))}
    </div>
  );
}
