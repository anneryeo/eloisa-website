import { CursorSparkles } from "@/components/site/CursorSparkles";
import { SiteSidebar } from "@/components/site/SiteSidebar";

/**
 * Shell shared by every public section (Work, About Me, Journal, FAQ, Contact).
 * Lives in a route group so /studio stays outside it and renders bare.
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="cursor-funky mx-auto grid max-w-[1600px] grid-cols-1 gap-10 px-7 py-10 lg:grid-cols-[minmax(200px,260px)_1fr] lg:gap-20 lg:px-12 lg:py-0">
      <CursorSparkles />
      <SiteSidebar />
      <main className="min-w-0 lg:py-14">{children}</main>
    </div>
  );
}
