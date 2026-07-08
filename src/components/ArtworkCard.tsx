"use client";

import { motion } from "framer-motion";

import type { Artwork } from "@/sanity/queries";
import { Media } from "./Media";

/**
 * A single gallery tile. The piece lifts and its caption fades in on hover —
 * a restrained motion cue that keeps the minimalist gallery feel. Swap or
 * extend the `whileHover` transforms when the per-piece design is decided.
 */
export function ArtworkCard({
  artwork,
  priority = false,
}: {
  artwork: Artwork;
  priority?: boolean;
}) {
  return (
    <motion.figure
      className="group relative cursor-pointer overflow-hidden bg-hairline"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="relative aspect-[4/5] w-full"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Media artwork={artwork} priority={priority} />
      </motion.div>

      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-2 items-end justify-between p-4 opacity-0 transition-all duration-500 ease-gallery group-hover:translate-y-0 group-hover:opacity-100">
        <span className="bg-canvas/90 px-2 py-1 text-sm text-ink backdrop-blur-sm">
          {artwork.title}
        </span>
        {artwork.year && (
          <span className="bg-canvas/90 px-2 py-1 text-sm text-muted backdrop-blur-sm">
            {artwork.year}
          </span>
        )}
      </figcaption>
    </motion.figure>
  );
}
