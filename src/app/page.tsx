import { Gallery } from "@/components/Gallery";
import { getFeaturedArtworks } from "@/sanity/queries";

// Revalidate the gallery hourly; Sanity's CDN keeps reads fast between rebuilds.
export const revalidate = 3600;

export default async function HomePage() {
  const artworks = await getFeaturedArtworks();

  return (
    <main className="mx-auto max-w-[1600px] px-6 py-16 sm:px-10 lg:px-16">
      <header className="mb-16 flex flex-col gap-2">
        <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">
          Eloisa
        </h1>
        <p className="max-w-prose text-muted">Selected works.</p>
      </header>

      <Gallery artworks={artworks} />

      <footer className="mt-24 border-t border-hairline pt-8 text-sm text-muted">
        <p>© {new Date().getFullYear()} Eloisa. All works and rights reserved.</p>
      </footer>
    </main>
  );
}
