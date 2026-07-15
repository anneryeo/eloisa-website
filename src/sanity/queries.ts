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
