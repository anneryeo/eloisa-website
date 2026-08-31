import type { Artwork } from "@/sanity/queries";
import { WorkTile } from "./WorkTile";

/** Narrow layouts use CSS columns; desktop columns are assigned explicitly. */
const NARROW_COLUMNS = "columns-1 gap-5 sm:columns-2 lg:hidden";

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
        <div className={NARROW_COLUMNS} aria-hidden="true">
          {PLACEHOLDER_RATIOS.map((ratio, index) => (
            <div
              key={index}
              className="mb-5 w-full break-inside-avoid bg-placeholder"
              style={{ aspectRatio: ratio }}
            />
          ))}
        </div>
        <div className="hidden grid-cols-3 gap-5 lg:grid" aria-hidden="true">
          {[0, 1, 2].map((column) => (
            <div key={column}>
              {PLACEHOLDER_RATIOS.filter((_, index) => index % 3 === column).map(
                (ratio, index) => (
                  <div
                    key={index}
                    className="mb-5 w-full bg-placeholder"
                    style={{ aspectRatio: ratio }}
                  />
                ),
              )}
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <div className={NARROW_COLUMNS}>
        {pieces.map((piece, index) => (
          <WorkTile key={piece._id} piece={piece} priority={index < 3} />
        ))}
      </div>
      <div className="hidden grid-cols-3 gap-5 lg:grid">
        {[0, 1, 2].map((column) => (
          <div key={column}>
            {pieces
              .map((piece, index) => ({ piece, index }))
              .filter(({ index }) => index % 3 === column)
              .map(({ piece, index }) => (
                <WorkTile key={piece._id} piece={piece} priority={index < 3} />
              ))}
          </div>
        ))}
      </div>
    </>
  );
}
