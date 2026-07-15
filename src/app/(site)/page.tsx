import { WorkGrid } from "@/components/work/WorkGrid";
import { getFeaturedWork } from "@/sanity/queries";

// Revalidate hourly; Sanity's CDN keeps reads fast between rebuilds.
export const revalidate = 3600;

/**
 * The Work landing page. The sidebar shell supplies the wordmark, bio, nav and
 * footer, so this renders only the grid of pieces.
 */
export default async function WorkPage() {
  const pieces = await getFeaturedWork();

  return <WorkGrid pieces={pieces} />;
}
