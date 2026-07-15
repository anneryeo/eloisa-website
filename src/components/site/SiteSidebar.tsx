import { SiteFooter } from "./SiteFooter";
import { SiteNav } from "./SiteNav";
import { SiteWordmark } from "./SiteWordmark";

/** Intro copy — the same standing blurb appears on every frame in the comps. */
const BIO =
  "Eloisa Claire is a marketing-led graphic designer and creative storyteller focused on colorful visual direction and campaign-driven design based in Manila, Philippines.";

/**
 * The left rail: wordmark, bio, section nav, contact footer. Sticky and full
 * height on desktop; stacks above the content on narrow screens.
 */
export function SiteSidebar() {
  return (
    <aside className="flex flex-col gap-9 lg:sticky lg:top-0 lg:h-screen lg:py-14">
      <SiteWordmark />

      <p className="max-w-[34ch] text-[0.6875rem] font-light leading-[1.85] text-ink">
        {BIO}
      </p>

      <SiteNav />

      <div className="mt-auto pt-10">
        <SiteFooter />
      </div>
    </aside>
  );
}
