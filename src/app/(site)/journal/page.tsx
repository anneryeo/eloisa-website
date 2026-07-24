import { JournalExplorer } from "@/components/journal/JournalExplorer";
import { getJournalEntries } from "@/sanity/queries";

export const metadata = { title: "Journal" };
export const revalidate = 3600;

/**
 * Journal — campus talks, panels and judging gigs. The grid of decorated
 * snapshots comes from the CMS; opening one transitions to its posters,
 * photos and notes. `?e=slug` deep-links an open entry.
 */
export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>;
}) {
  const [entries, params] = await Promise.all([
    getJournalEntries(),
    searchParams,
  ]);

  return <JournalExplorer entries={entries} initialSlug={params.e ?? null} />;
}
