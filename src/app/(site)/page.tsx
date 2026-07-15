import { Gallery } from "@/components/Gallery";
import { getFeaturedArtworks } from "@/sanity/queries";

// Revalidate hourly; Sanity's CDN keeps reads fast between rebuilds.
export const revalidate = 3600;

/**
 * The Work landing page. The sidebar shell supplies the wordmark, bio, nav and
 * footer, so this renders only the grid of pieces.
 */
export default async function WorkPage() {
  const artworks = await getFeaturedArtworks();

  return <Gallery artworks={artworks} />;
}
