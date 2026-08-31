import { CursorSparkles } from "@/components/site/CursorSparkles";
import { SiteFooter } from "@/components/site/SiteFooter";
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
      className="cursor-funky min-h-screen px-7 py-10 lg:px-12 lg:py-0"
      style={
        customCursor
          ? ({
              "--site-cursor": `url(${customCursor}) 3 2, auto`,
            } as React.CSSProperties)
          : undefined
      }
    >
      <CursorSparkles />
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-10 lg:grid-cols-[minmax(220px,300px)_1fr] lg:gap-20">
        <SiteSidebar settings={settings} />
        <main className="min-w-0 lg:py-14">{children}</main>
      </div>
      <div className="mx-auto mt-16 max-w-[1600px] border-t border-ink/20 py-8 lg:hidden">
        <SiteFooter
          handle={settings?.footerHandle}
          website={settings?.footerWebsite}
          email={settings?.footerEmail}
          socialLinks={settings?.socialLinks}
        />
      </div>
    </div>
  );
}
