import { urlForImage } from "@/sanity/image";
import { getSiteSettings } from "@/sanity/queries";
import { RichText } from "@/components/RichText";
import { SiteFooter } from "./SiteFooter";
import { SiteNav } from "./SiteNav";
import { SiteWordmark, type WordmarkFrame } from "./SiteWordmark";
import { NAV_LABELS, NAV_SECTIONS, type NavSection } from "./navigation";

/** Comp copy, used whenever the CMS settings document is missing. */
const FALLBACK_BIO =
  "Eloisa Claire is a marketing-led graphic designer and creative storyteller focused on colorful visual direction and campaign-driven design based in Manila, Philippines.";

/**
 * The left rail: wordmark, bio, section nav, contact footer. Sticky and full
 * height on desktop; stacks above the content on narrow screens. Every piece
 * of chrome here (wordmark frames, bio, footer lines) is edited in the
 * Studio's Site settings document.
 */
export async function SiteSidebar() {
  const settings = await getSiteSettings();

  const frames: WordmarkFrame[] =
    settings?.wordmarkFrames
      ?.filter((frame) => frame.image)
      .map((frame) => ({
        key: frame._key,
        url: urlForImage(frame.image as object).width(400).url(),
      })) ?? [];
  const sections: NavSection[] = settings?.siteSections?.length
    ? settings.siteSections
        .filter((section) => section.visible !== false)
        .map((section) => ({
          href: section.path,
          label: section.label?.trim() || NAV_LABELS[section.path] || "Section",
        }))
    : NAV_SECTIONS;

  return (
    <aside className="flex flex-col gap-9 lg:sticky lg:top-0 lg:h-screen lg:py-14">
      <SiteWordmark
        frames={frames}
        interval={settings?.wordmarkInterval}
        width={settings?.wordmarkWidth}
      />

      <RichText
        value={settings?.bioRich ?? settings?.bio ?? FALLBACK_BIO}
        className="max-w-[34ch] text-[0.6875rem] font-light leading-[1.85] text-ink"
      />

      <SiteNav sections={sections} />

      <div className="mt-auto pt-10">
        <SiteFooter
          handle={settings?.footerHandle}
          website={settings?.footerWebsite}
          email={settings?.footerEmail}
          socialLinks={settings?.socialLinks}
        />
      </div>
    </aside>
  );
}
