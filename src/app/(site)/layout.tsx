import { CursorSparkles } from "@/components/site/CursorSparkles";
import { SiteSidebar } from "@/components/site/SiteSidebar";
import { urlForImage } from "@/sanity/image";
import { getSiteSettings } from "@/sanity/queries";

// The sidebar is CMS-driven and belongs to this shared layout. Keeping its ISR
// policy here prevents static routes (notably Contact) from freezing an older
// logo, bio, footer, or navigation configuration than the other sections.
export const revalidate = 60;

/**
 * Shell shared by every public section (Work, About Me, Journal, FAQ, Contact).
 * Lives in a route group so /studio stays outside it and renders bare.
 */
export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();
  const customCursor = settings?.cursorImage
    ? urlForImage(settings.cursorImage as object)
        .width(48)
        .height(48)
        .fit("max")
        .format("png")
        .url()
    : undefined;

  return (
    <div
      className="cursor-funky mx-auto grid max-w-[1600px] grid-cols-1 gap-10 px-7 py-10 lg:grid-cols-[minmax(200px,260px)_1fr] lg:gap-20 lg:px-12 lg:py-0"
      style={
        customCursor
          ? ({ "--site-cursor": `url(${customCursor}) 3 2, auto` } as React.CSSProperties)
          : undefined
      }
    >
      <CursorSparkles />
      <SiteSidebar />
      <main className="min-w-0 lg:py-14">{children}</main>
    </div>
  );
}
