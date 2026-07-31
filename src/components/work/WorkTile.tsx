"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

import { Media } from "@/components/Media";
import type { Artwork } from "@/sanity/queries";

/** Fallback shape for pieces whose source dimensions aren't known yet. */
export const DEFAULT_RATIO = 0.8;

/**
 * Deterministic little tilt per piece, like photos loosely taped into a
 * scrapbook — the same piece always leans the same way (SSR-safe, no
 * hydration mismatch), and neighbours lean in different directions.
 */
export function scrapbookTilt(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  const magnitude = 1.2 + (Math.abs(hash) % 14) / 10; // 1.2° – 2.5°
  return hash % 2 === 0 ? magnitude : -magnitude;
}

/** Springy pick-the-photo-up feel; a hard ease would read as UI, not paper. */
export const SCRAPBOOK_SPRING = {
  type: "spring",
  stiffness: 260,
  damping: 14,
} as const;

/**
 * One piece in the Work masonry, downsized to its column. The tile takes the
 * source's own aspect ratio so the column keeps the staggered rhythm of the
 * comps. Hovering lifts and tilts the piece scrapbook-style; clicking opens
 * it at full size.
 */
export function WorkTile({
  piece,
  priority = false,
}: {
  piece: Artwork;
  priority?: boolean;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <figure className="mb-5 break-inside-avoid">
      <Link href={`/work/${piece.workType ?? "professional"}/${piece.slug}`}>
      <motion.div
        whileHover={
          reducedMotion
            ? undefined
            : { rotate: scrapbookTilt(piece._id), scale: 1.03, y: -5 }
        }
        whileTap={reducedMotion ? undefined : { scale: 0.98 }}
        transition={SCRAPBOOK_SPRING}
        style={{ aspectRatio: piece.aspectRatio ?? DEFAULT_RATIO }}
        className="group relative block w-full overflow-hidden bg-placeholder outline-offset-4 transition-shadow duration-300 ease-gallery hover:shadow-[0_14px_30px_-12px_rgba(30,30,30,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        <Media artwork={piece} priority={priority} />
        <span className="absolute inset-0 flex items-center justify-center bg-white/85 px-5 text-center opacity-0 transition-opacity duration-300 ease-gallery group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="text-sm font-medium uppercase tracking-[0.06em] text-ink">
            {piece.title}
          </span>
        </span>
        <span className="sr-only">View {piece.title} at full size</span>
      </motion.div>
      </Link>
    </figure>
  );
}
