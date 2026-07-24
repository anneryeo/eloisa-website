import { client } from "./client";
import { isSanityConfigured } from "./env";

export type MediaType = "image" | "video" | "gif";
export type WorkType = "personal" | "professional";

export interface Artwork {
  _id: string;
  title: string;
  slug: string;
  mediaType: MediaType;
  /** Which Work sub-list the piece belongs to. */
  workType?: WorkType;
  /** Sanity image ref (image pieces) or poster (video pieces). */
  image?: unknown;
  /** Resolved CDN URL for the video/gif file asset. */
  fileUrl?: string;
  /** width ÷ height of the source, used to size the tile in the masonry. */
  aspectRatio?: number;
  year?: number;
  medium?: string;
  dimensions?: string;
  description?: string;
}

const FIELDS = `
  _id,
  title,
  "slug": slug.current,
  mediaType,
  workType,
  image,
  "fileUrl": select(
    mediaType == "video" => video.asset->url,
    mediaType == "gif"   => gif.asset->url
  ),
  "aspectRatio": coalesce(
    image.asset->metadata.dimensions.aspectRatio,
    poster.asset->metadata.dimensions.aspectRatio
  ),
  year,
  medium,
  dimensions,
  description
`;

/**
 * Queries resolve to an empty list when Sanity isn't configured yet or the
 * dataset is empty. The Work grid renders its gray placeholder tiles in that
 * case, matching the comps, so the layout stays reviewable before the CMS is
 * populated.
 */
async function fetchWork(
  filter: string,
  params: Record<string, unknown> = {},
): Promise<Artwork[]> {
  if (!isSanityConfigured) return [];

  try {
    return await client.fetch<Artwork[]>(
      `*[_type == "artwork"${filter}] | order(order asc){${FIELDS}}`,
      params,
    );
  } catch {
    // A network or config hiccup shouldn't blank the page during development.
    return [];
  }
}

/** Featured pieces, for the Work landing page. */
export function getFeaturedWork(): Promise<Artwork[]> {
  return fetchWork(" && featured == true");
}

/** Every piece in one Work sub-list (Personal or Professional). */
export function getWorkByType(workType: WorkType): Promise<Artwork[]> {
  return fetchWork(" && workType == $workType", { workType });
}

export interface JournalEntry {
  _id: string;
  title: string;
  slug: string;
  year: number;
  role: string;
  coverImage?: unknown;
  /** width ÷ height of the cover, used to shape the grid tile. */
  coverAspectRatio?: number;
  gallery?: { _key: string; image: unknown; aspectRatio?: number }[];
  blurb?: string;
  note?: string;
}

/** Journal entries in grid order; [] when Sanity is unreachable or empty. */
export async function getJournalEntries(): Promise<JournalEntry[]> {
  if (!isSanityConfigured) return [];

  try {
    return await client.fetch<JournalEntry[]>(
      `*[_type == "journalEntry"] | order(order asc){
        _id,
        title,
        "slug": slug.current,
        year,
        role,
        coverImage,
        "coverAspectRatio": coverImage.asset->metadata.dimensions.aspectRatio,
        "gallery": gallery[]{
          _key,
          "image": @,
          "aspectRatio": asset->metadata.dimensions.aspectRatio
        },
        blurb,
        note
      }`,
    );
  } catch {
    return [];
  }
}

export interface FaqItem {
  _id: string;
  question: string;
  answer: string;
}

/** FAQ items in page order; [] when Sanity is unreachable or empty. */
export async function getFaqItems(): Promise<FaqItem[]> {
  if (!isSanityConfigured) return [];

  try {
    return await client.fetch<FaqItem[]>(
      `*[_type == "faqItem"] | order(order asc){ _id, question, answer }`,
    );
  } catch {
    return [];
  }
}

export interface AboutPage {
  heading: string;
  portrait?: unknown;
  portraitAspectRatio?: number;
  /** Portable Text blocks — the comp italicizes handle names inside the bio. */
  bio?: unknown[];
}

export interface SiteSettings {
  /** Wordmark lettering frames, already resolved for the sidebar cycler. */
  wordmarkFrames?: { _key: string; image: unknown; aspectRatio?: number }[];
  wordmarkInterval?: number;
  bio?: string;
  footerHandle?: string;
  footerWebsite?: string;
  footerEmail?: string;
  journalIntro?: string[];
}

/** Site-wide chrome singleton; null when Sanity is unreachable or empty. */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!isSanityConfigured) return null;

  try {
    return await client.fetch<SiteSettings | null>(
      `*[_type == "siteSettings"][0]{
        "wordmarkFrames": wordmarkFrames[]{
          _key,
          "image": @,
          "aspectRatio": asset->metadata.dimensions.aspectRatio
        },
        wordmarkInterval,
        bio,
        footerHandle,
        footerWebsite,
        footerEmail,
        journalIntro
      }`,
    );
  } catch {
    return null;
  }
}

/** The About Me singleton; null when Sanity is unreachable or empty. */
export async function getAboutPage(): Promise<AboutPage | null> {
  if (!isSanityConfigured) return null;

  try {
    return await client.fetch<AboutPage | null>(
      `*[_type == "aboutPage"][0]{
        heading,
        portrait,
        "portraitAspectRatio": portrait.asset->metadata.dimensions.aspectRatio,
        bio
      }`,
    );
  } catch {
    return null;
  }
}
