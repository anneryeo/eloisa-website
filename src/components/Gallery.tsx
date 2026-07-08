import type { Artwork } from "@/sanity/queries";
import { ArtworkCard } from "./ArtworkCard";

/**
 * The front gallery: a responsive masonry-ish grid. Kept deliberately plain so
 * the sectional / piece-by-piece design can layer on top without a rewrite.
 */
export function Gallery({ artworks }: { artworks: Artwork[] }) {
  if (artworks.length === 0) {
    return (
      <p className="py-24 text-center text-muted">
        No pieces yet. Add artworks in the{" "}
        <a href="/studio" className="underline underline-offset-4">
          Studio
        </a>
        .
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {artworks.map((artwork, i) => (
        <ArtworkCard key={artwork._id} artwork={artwork} priority={i < 3} />
      ))}
    </div>
  );
}
