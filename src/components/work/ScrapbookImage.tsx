"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

import { scrapbookTilt, SCRAPBOOK_SPRING } from "./WorkTile";

export function ScrapbookImage({
  src,
  alt,
  ratio,
  seed,
  priority = false,
  subtle = false,
  onOpen,
}: {
  src: string;
  alt: string;
  ratio: number;
  seed: string;
  priority?: boolean;
  subtle?: boolean;
  onOpen?: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const tilt = subtle ? scrapbookTilt(seed) * 0.18 : scrapbookTilt(seed) * 0.65;

  const image = (
    <motion.figure
      className="relative w-full overflow-hidden bg-placeholder shadow-[0_12px_28px_-18px_rgba(30,30,30,0.55)]"
      style={{ aspectRatio: ratio, rotate: reducedMotion ? 0 : tilt }}
      whileHover={
        reducedMotion ? undefined : { rotate: -tilt * 0.35, scale: 1.012, y: -3 }
      }
      transition={SCRAPBOOK_SPRING}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 100vw, 75vw"
        className="object-cover"
        priority={priority}
      />
    </motion.figure>
  );

  if (!onOpen) return image;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open ${alt} in focus mode`}
      className="block w-full cursor-zoom-in text-left outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
    >
      {image}
    </button>
  );
}
