import { client } from "./client";
import { isSanityConfigured } from "./env";

export type MediaType = "image" | "video" | "socialVideo" | "gif";
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
  poster?: unknown;
  /** Resolved CDN URL for the video/gif file asset. */
  fileUrl?: string;
  socialVideoUrl?: string;
  /** width ÷ height of the source, used to size the tile in the masonry. */
  aspectRatio?: number;
  year?: number;
  medium?: string;
  dimensions?: string;
  description?: string;
  descriptionAbove?: string;
  descriptionBelow?: string;
  projectLabel?: string;
  heroImage?: unknown;
  heroAspectRatio?: number;
  caseStudySections?: CaseStudySection[];
}

export type CaseStudyLayout = "full" | "threeUp" | "split" | "text";

export interface CaseStudyImage {
  _key: string;
  image: unknown;
  aspectRatio?: number;
}

export interface CaseStudySection {
  _key: string;
  layout: CaseStudyLayout;
  heading?: string;
  body?: string;
  images?: CaseStudyImage[];
}

const FIELDS = `
  _id,
  title,
  "slug": slug.current,
  mediaType,
  workType,
  image,
  poster,
  socialVideoUrl,
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

const CASE_STUDY_FIELDS = `
  ${FIELDS},
  "projectLabel": coalesce(projectLabel, "WORK"),
  "descriptionAbove": coalesce(descriptionAbove, description),
  descriptionBelow,
  heroImage,
  "heroAspectRatio": coalesce(
    heroImage.asset->metadata.dimensions.aspectRatio,
    image.asset->metadata.dimensions.aspectRatio,
    poster.asset->metadata.dimensions.aspectRatio
  ),
  "caseStudySections": caseStudySections[]{
    _key,
    layout,
    heading,
    body,
    "images": images[]{
      _key,
      "image": @,
      "aspectRatio": asset->metadata.dimensions.aspectRatio
    }
  }
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

/** Every Personal and Professional piece, for the Work landing page. */
export function getAllWork(): Promise<Artwork[]> {
  return fetchWork("");
}

/** Every piece in one Work sub-list (Personal or Professional). */
export function getWorkByType(workType: WorkType): Promise<Artwork[]> {
  return fetchWork(" && workType == $workType", { workType });
}

/** One project plus its neighbours within the same Work section. */
export async function getWorkProject(
  workType: WorkType,
  slug: string,
): Promise<{
  project: Artwork;
  previous?: Pick<Artwork, "title" | "slug">;
  next?: Pick<Artwork, "title" | "slug">;
} | null> {
  if (!isSanityConfigured) return null;

  try {
    const projects = await client.fetch<Artwork[]>(
      `*[_type == "artwork" && workType == $workType] | order(order asc){${CASE_STUDY_FIELDS}}`,
      { workType },
    );
    const index = projects.findIndex((project) => project.slug === slug);
    if (index === -1) return null;

    const project = projects[index];
    const previous = projects[(index - 1 + projects.length) % projects.length];
    const next = projects[(index + 1) % projects.length];

    return {
      project,
      previous: projects.length > 1 ? previous : undefined,
      next: projects.length > 1 ? next : undefined,
    };
  } catch {
    return null;
  }
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
  wordmarkWidth?: number;
  favicon?: unknown;
  bio?: string;
  footerHandle?: string;
  footerWebsite?: string;
  footerEmail?: string;
  socialLinks?: SocialLink[];
  siteSections?: SiteSection[];
  journalIntro?: string[];
}

export interface SiteSection {
  _key: string;
  path: "/" | "/about" | "/journal" | "/faq" | "/contact";
  label?: string;
  visible?: boolean;
}

export type SocialPlatform =
  | "instagram"
  | "tiktok"
  | "facebook"
  | "linkedin"
  | "youtube"
  | "behance"
  | "other";

export interface SocialLink {
  _key: string;
  platform: SocialPlatform;
  label?: string;
  url: string;
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
        wordmarkWidth,
        favicon,
        bio,
        footerHandle,
        footerWebsite,
        footerEmail,
        socialLinks[]{ _key, platform, label, url },
        siteSections[]{ _key, path, label, visible },
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
