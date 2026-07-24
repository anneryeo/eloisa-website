"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { cx } from "@/lib/cx";

export interface WordmarkFrame {
  key: string;
  url: string;
}

/**
 * The "ELOISA CLAIRE DESIGN" wordmark. When the CMS provides lettering frames
 * (the logo studies from the board), the mark cycles through them with hard
 * cuts — stop-motion style, matching Eloisa's mixed-media look. All frames
 * stay mounted so the cuts never flash a half-loaded image. Falls back to the
 * three-line text mark when no frames are published, and holds the first
 * frame for users who prefer reduced motion.
 */
export function SiteWordmark({
  frames = [],
  interval = 1.6,
}: {
  frames?: WordmarkFrame[];
  interval?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (frames.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(
      () => setIndex((value) => (value + 1) % frames.length),
      Math.max(0.2, interval) * 1000,
    );
    return () => window.clearInterval(id);
  }, [frames.length, interval]);

  if (frames.length === 0) {
    return (
      <Link
        href="/"
        className="block font-display text-[1.75rem] uppercase leading-[1.5] tracking-[0.14em] text-ink"
      >
        Eloisa
        <br />
        Claire
        <br />
        Design
      </Link>
    );
  }

  return (
    <Link
      href="/"
      aria-label="Eloisa Claire Design — home"
      className="relative block h-[124px] w-[190px]"
    >
      {frames.map((frame, frameIndex) => (
        <Image
          key={frame.key}
          src={frame.url}
          alt=""
          fill
          sizes="190px"
          priority={frameIndex === 0}
          className={cx(
            "object-contain object-left",
            frameIndex === index ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
    </Link>
  );
}
