"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

import { Media } from "@/components/Media";
import type { Artwork } from "@/sanity/queries";
import { DEFAULT_RATIO } from "./WorkTile";

/**
 * A piece at full size, over the gallery. The grid downsizes work to
 * thumbnails; this is the "back to original" half of that — the piece scaled
 * to fill the viewport at its true aspect ratio rather than the tile's crop.
 * When `onPrev`/`onNext` are provided, arrows and the arrow keys page through
 * the list the piece was opened from (a Work list, a journal entry's photos).
 */
export function WorkLightbox({
  piece,
  onClose,
  onPrev,
  onNext,
}: {
  piece: Artwork;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrev?.();
      if (event.key === "ArrowRight") onNext?.();
    };

    document.addEventListener("keydown", onKeyDown);
    // Stop the gallery scrolling behind the overlay.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [onClose, onPrev, onNext]);

  const ratio = piece.aspectRatio ?? DEFAULT_RATIO;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={piece.title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-canvas/95 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="absolute right-6 top-6 text-xs uppercase tracking-[0.05em] text-ink transition-colors hover:text-accent"
      >
        Close
      </button>

      {onPrev && (
        <button
          type="button"
          aria-label="Previous piece"
          onClick={(event) => {
            event.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 p-3 font-mono text-2xl text-ink transition-colors hover:text-accent md:left-8"
        >
          &larr;
        </button>
      )}
      {onNext && (
        <button
          type="button"
          aria-label="Next piece"
          onClick={(event) => {
            event.stopPropagation();
            onNext();
          }}
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 p-3 font-mono text-2xl text-ink transition-colors hover:text-accent md:right-8"
        >
          &rarr;
        </button>
      )}

      <motion.figure
        // Keyed by piece so paging animates each piece in fresh. Height
        // drives the box; width follows the true aspect ratio, and the min()
        // keeps a wide piece from running past the viewport.
        key={piece._id}
        style={{ aspectRatio: ratio, height: `min(85vh, calc(84vw / ${ratio}))` }}
        className="relative"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        onClick={(event) => event.stopPropagation()}
      >
        <Media artwork={piece} priority />
      </motion.figure>
    </motion.div>
  );
}
