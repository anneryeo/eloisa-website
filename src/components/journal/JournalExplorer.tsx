"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { WorkLightbox } from "@/components/work/WorkLightbox";
import { SCRAPBOOK_SPRING, scrapbookTilt } from "@/components/work/WorkTile";
import { urlForImage } from "@/sanity/image";
import type { Artwork, JournalEntry } from "@/sanity/queries";

/** Comp copy fallback, used when the CMS settings document has no intro. */
const FALLBACK_INTRO = [
  "From workshops to campus talks, Eloisa Claire loves showing up for student communities.",
  "As a student herself she enjoys sharing lessons, experiences, and creative insights that encourage fellow students to pursue bold ideas and colorful careers.",
  "Click to see what she's been up to recently ˙ᵕ˙",
];

/** Cover shapes for the gray placeholders shown while the CMS is empty. */
const PLACEHOLDER_RATIOS = [0.79, 1.24, 0.72, 0.9, 0.86];

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The Journal in one client component so opening an entry can morph the
 * clicked cover into the detail view (framer-motion layoutId) instead of
 * doing a hard route change. The URL still tracks the open entry via
 * `?e=slug` (history.pushState) so back/forward and deep links work.
 */
export function JournalExplorer({
  entries,
  intro,
  initialSlug,
}: {
  entries: JournalEntry[];
  intro?: string[];
  initialSlug: string | null;
}) {
  const [activeSlug, setActiveSlug] = useState(initialSlug);
  const active = entries.find((entry) => entry.slug === activeSlug) ?? null;
  const activeIndex = active
    ? entries.findIndex((entry) => entry.slug === active.slug)
    : -1;

  const open = useCallback((slug: string) => {
    window.history.pushState(null, "", `/journal?e=${encodeURIComponent(slug)}`);
    setActiveSlug(slug);
  }, []);

  const close = useCallback(() => {
    window.history.pushState(null, "", "/journal");
    setActiveSlug(null);
  }, []);

  // Keep state in sync when the user drives the browser's back/forward.
  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      setActiveSlug(params.get("e"));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  if (entries.length === 0) {
    return (
      <>
        <JournalIntro paragraphs={intro} />
        <p className="sr-only">No journal entries have been published yet.</p>
        <div
          className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
          aria-hidden="true"
        >
          {PLACEHOLDER_RATIOS.map((ratio, index) => (
            <div
              key={index}
              className="w-full bg-placeholder"
              style={{ aspectRatio: ratio }}
            />
          ))}
        </div>
      </>
    );
  }

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {active ? (
        <JournalDetail
          key={active.slug}
          entry={active}
          onClose={close}
          onPrevious={
            entries.length > 1
              ? () =>
                  open(
                    entries[(activeIndex - 1 + entries.length) % entries.length]
                      .slug,
                  )
              : undefined
          }
          onNext={
            entries.length > 1
              ? () => open(entries[(activeIndex + 1) % entries.length].slug)
              : undefined
          }
        />
      ) : (
        <motion.div
          key="grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.35, ease: EASE } }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
        >
          <JournalIntro paragraphs={intro} />
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry, index) => (
              <JournalTile
                key={entry._id}
                entry={entry}
                priority={index < 3}
                onOpen={() => open(entry.slug)}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function JournalIntro({ paragraphs }: { paragraphs?: string[] }) {
  const lines = paragraphs?.length ? paragraphs : FALLBACK_INTRO;
  return (
    <div className="mb-10 w-full space-y-4 text-justify text-[0.8125rem] font-light leading-[1.9] text-ink">
      {lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  );
}

/** One snapshot in the grid with its "SCHOOL, YEAR / role" mono caption. */
function JournalTile({
  entry,
  priority = false,
  onOpen,
}: {
  entry: JournalEntry;
  priority?: boolean;
  onOpen: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const src = entry.coverImage
    ? urlForImage(entry.coverImage).width(900).url()
    : null;

  return (
    <figure>
      <motion.button
        type="button"
        onClick={onOpen}
        whileHover={
          reducedMotion
            ? undefined
            : { rotate: scrapbookTilt(entry.slug), scale: 1.03, y: -5 }
        }
        whileTap={reducedMotion ? undefined : { scale: 0.98 }}
        transition={SCRAPBOOK_SPRING}
        style={{ aspectRatio: entry.coverAspectRatio ?? 0.8 }}
        className="group relative block w-full overflow-hidden outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        {src && (
          <motion.div
            layoutId={`journal-cover-${entry.slug}`}
            className="absolute inset-0"
            transition={{ duration: 0.45, ease: EASE }}
          >
            <Image
              src={src}
              alt={`${entry.title}, ${entry.year} — ${entry.role}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-contain"
              priority={priority}
            />
          </motion.div>
        )}
        <span className="absolute inset-0 z-10 flex items-center justify-center bg-white/85 px-5 text-center opacity-0 transition-opacity duration-300 ease-gallery group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="font-mono text-sm font-bold uppercase tracking-[0.04em] text-ink">
            {entry.title}, {entry.year}
          </span>
        </span>
        <span className="sr-only">
          Open {entry.title}, {entry.year}
        </span>
      </motion.button>
      <figcaption className="mt-3 font-mono">
        <p className="text-[0.9375rem] font-bold uppercase tracking-[0.02em] text-ink">
          {entry.title}, {entry.year}
        </p>
        <p className="mt-0.5 text-[0.6875rem] text-ink">{entry.role}</p>
      </figcaption>
    </figure>
  );
}

/** An opened entry — cover morphs in, posters and photos follow. */
function JournalDetail({
  entry,
  onClose,
  onPrevious,
  onNext,
}: {
  entry: JournalEntry;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const coverSrc = entry.coverImage
    ? urlForImage(entry.coverImage).width(1200).url()
    : null;

  // The entry's photos (cover + gallery) as Artwork-shaped records, so the
  // Work lightbox can page prev/next through them like a Work list.
  const photos: Artwork[] = [
    ...(entry.coverImage
      ? [
          {
            _id: `${entry.slug}-cover`,
            title: `${entry.title}, ${entry.year}`,
            slug: entry.slug,
            mediaType: "image" as const,
            image: entry.coverImage,
            aspectRatio: entry.coverAspectRatio,
          },
        ]
      : []),
    ...(entry.gallery ?? [])
      .filter((item) => item.image)
      .map((item, index) => ({
        _id: `${entry.slug}-${item._key}`,
        title: `${entry.title}, ${entry.year} — photo ${index + 1}`,
        slug: entry.slug,
        mediaType: "image" as const,
        image: item.image,
        aspectRatio: item.aspectRatio,
      })),
  ];

  // Index into `photos` when the lightbox is open.
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const pageLightbox = (step: number) =>
    setLightboxIndex((index) =>
      index === null ? index : (index + step + photos.length) % photos.length,
    );

  // Close on Escape, matching the Work lightbox — but only while the
  // lightbox isn't open (it handles its own Escape and stops there).
  useEffect(() => {
    if (lightboxIndex !== null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, lightboxIndex]);

  return (
    <motion.article
      key={entry.slug}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.35, ease: EASE } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      <nav
        aria-label="Journal entry navigation"
        className="mb-8 flex items-center justify-between font-mono text-[0.6875rem] uppercase tracking-[0.05em]"
      >
        <button
          type="button"
          onClick={onClose}
          className="text-ink transition-colors hover:text-accent"
        >
          &larr; Back to Journal
        </button>
        <div className="flex gap-6 text-muted">
          {onPrevious && (
            <button
              type="button"
              onClick={onPrevious}
              className="transition-colors hover:text-accent"
            >
              &lt; Prev
            </button>
          )}
          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="transition-colors hover:text-accent"
            >
              Next &gt;
            </button>
          )}
        </div>
      </nav>

      <header className="mb-6 font-mono">
        <h1 className="text-[1.0625rem] font-bold uppercase tracking-[0.02em] text-ink">
          {entry.title}, {entry.year}
        </h1>
        <p className="mt-0.5 text-[0.75rem] text-ink">{entry.role}</p>
      </header>

      <div className="flex flex-wrap items-start gap-6">
        {coverSrc && (
          <motion.button
            type="button"
            onClick={() => setLightboxIndex(0)}
            layoutId={`journal-cover-${entry.slug}`}
            whileHover={
              reducedMotion
                ? undefined
                : {
                    rotate: scrapbookTilt(`${entry.slug}-cover`),
                    scale: 1.03,
                    y: -5,
                  }
            }
            whileTap={reducedMotion ? undefined : { scale: 0.98 }}
            transition={SCRAPBOOK_SPRING}
            className="relative w-full max-w-[260px] outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            style={{ aspectRatio: entry.coverAspectRatio ?? 0.8 }}
          >
            <Image
              src={coverSrc}
              alt={`${entry.title}, ${entry.year} — ${entry.role}`}
              fill
              sizes="260px"
              className="object-contain"
              priority
            />
            <span className="sr-only">View photo at full size</span>
          </motion.button>
        )}

        {entry.gallery?.map((item, index) =>
          item.image ? (
            <motion.button
              type="button"
              key={item._key}
              onClick={() => setLightboxIndex(entry.coverImage ? index + 1 : index)}
              initial={{ opacity: 0, y: 14 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.45,
                  ease: EASE,
                  delay: 0.12 + index * 0.06,
                },
              }}
              whileHover={
                reducedMotion
                  ? undefined
                  : { rotate: scrapbookTilt(item._key), scale: 1.03, y: -5 }
              }
              whileTap={reducedMotion ? undefined : { scale: 0.98 }}
              className="relative w-full max-w-[340px] outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              style={{ aspectRatio: item.aspectRatio ?? 0.8 }}
            >
              <Image
                src={urlForImage(item.image).width(1200).url()}
                alt={`${entry.title}, ${entry.year} — photo ${index + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, 340px"
                className="object-contain"
              />
              <span className="sr-only">View photo at full size</span>
            </motion.button>
          ) : null,
        )}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && photos[lightboxIndex] && (
          <WorkLightbox
            piece={photos[lightboxIndex]}
            onClose={() => setLightboxIndex(null)}
            onPrev={photos.length > 1 ? () => pageLightbox(-1) : undefined}
            onNext={photos.length > 1 ? () => pageLightbox(1) : undefined}
          />
        )}
      </AnimatePresence>

      {(entry.blurb || entry.note) && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.45, ease: EASE, delay: 0.25 },
          }}
          className="mt-8 w-full space-y-4 text-justify text-[0.8125rem] font-light leading-[1.9] text-ink"
        >
          {entry.blurb && <p className="italic">{entry.blurb}</p>}
          {entry.note && <p>{entry.note}</p>}
        </motion.div>
      )}
    </motion.article>
  );
}
