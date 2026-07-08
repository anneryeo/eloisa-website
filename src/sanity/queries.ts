import { client } from "./client";
import { sampleArtworks } from "./sampleData";

export type MediaType = "image" | "video" | "gif";

export interface Artwork {
  _id: string;
  title: string;
  slug: string;
  mediaType: MediaType;
  /** Sanity image ref (image pieces) or poster (video pieces). */
  image?: unknown;
  /** Resolved CDN URL for the video/gif file asset. */
  fileUrl?: string;
  year?: number;
  medium?: string;
  dimensions?: string;
  description?: string;
}

const FEATURED_QUERY = `*[_type == "artwork" && featured == true] | order(order asc){
  _id,
  title,
  "slug": slug.current,
  mediaType,
  image,
  "fileUrl": select(
    mediaType == "video" => video.asset->url,
    mediaType == "gif"   => gif.asset->url
  ),
  "poster": poster,
  year,
  medium,
  dimensions,
  description
}`;

/**
 * Fetch featured artworks for the front gallery. Falls back to bundled sample
 * data when no Sanity project is configured yet, so the scaffold renders on a
 * fresh clone. Once NEXT_PUBLIC_SANITY_PROJECT_ID is set, real content wins.
 */
export async function getFeaturedArtworks(): Promise<Artwork[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return sampleArtworks;
  }

  try {
    const data = await client.fetch<Artwork[]>(FEATURED_QUERY);
    return data.length > 0 ? data : sampleArtworks;
  } catch {
    // Network / config hiccup shouldn't blank the page during development.
    return sampleArtworks;
  }
}
