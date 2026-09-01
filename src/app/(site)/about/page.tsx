import { RichText } from "@/components/RichText";
import { AboutPortrait } from "@/components/about/AboutPortrait";
import { urlForImage } from "@/sanity/image";
import { getAboutPage } from "@/sanity/queries";

export const metadata = { title: "About Me" };
export const revalidate = 3600;

/**
 * Copy transcribed from the comp, shown whenever the CMS document is missing
 * so the page never renders blank.
 */
const FALLBACK_HEADING = "Hi, I'm Eloisa Claire";
const FALLBACK_BIO = (
  <>
    <p>
      I&apos;ve always been inspired by colorful things, from Lisa Frank
      coloring books and Sailor Moon reruns to the wild ads and groovy
      typography of the 60s &amp; 70s. I could absolutely barf color.
    </p>
    <p>
      You may know me as <em>eloisaclaireart</em>, but over the years,{" "}
      <em>eloisaclairedesign</em> emerged as a way to merge my playful visual
      world with my marketing background—creating work that&apos;s colorful,
      strategic, and rooted in storytelling.
    </p>
  </>
);

/**
 * About Me, per the comp: portrait column on the left, pink typewriter
 * greeting and the bio paragraphs on the right.
 */
export default async function AboutMePage() {
  const about = await getAboutPage();
  const portraitUrl = about?.portrait
    ? urlForImage(about.portrait).width(1200).url()
    : undefined;
  const hoverPortraitUrl = about?.portraitHoverImage
    ? urlForImage(about.portraitHoverImage).width(1200).url()
    : undefined;

  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,340px)_minmax(0,1fr)] md:gap-16">
      <AboutPortrait
        mediaType={about?.portraitMediaType}
        imageUrl={portraitUrl}
        fileUrl={about?.portraitFileUrl}
        hoverImageUrl={hoverPortraitUrl}
        ratio={about?.portraitAspectRatio ?? 0.82}
      />

      <section className="w-full">
        <h1 className="mb-6 font-mono text-[1.0625rem] font-bold uppercase tracking-[0.08em] text-accent">
          {about?.heading ?? FALLBACK_HEADING}
        </h1>

        <div className="space-y-5 text-justify text-[0.6875rem] font-light leading-[1.9] text-ink">
          {about?.bio ? <RichText value={about.bio} /> : FALLBACK_BIO}
        </div>
      </section>
    </div>
  );
}
