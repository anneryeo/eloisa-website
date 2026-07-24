import { PortableText } from "next-sanity";
import Image from "next/image";

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
    : null;

  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,340px)_minmax(0,1fr)] md:gap-16">
      {portraitUrl ? (
        <figure
          className="relative w-full max-w-[340px] overflow-hidden bg-placeholder"
          style={{ aspectRatio: about?.portraitAspectRatio ?? 0.82 }}
        >
          <Image
            src={portraitUrl}
            alt="Portrait of Eloisa Claire"
            fill
            sizes="(max-width: 768px) 100vw, 340px"
            className="object-cover"
            priority
          />
        </figure>
      ) : (
        // Gray stand-in keeps the comp's layout before a portrait is uploaded.
        <div
          aria-hidden="true"
          className="w-full max-w-[340px] bg-placeholder"
          style={{ aspectRatio: 0.82 }}
        />
      )}

      <section className="max-w-[52ch]">
        <h1 className="mb-6 font-mono text-[1.0625rem] font-bold uppercase tracking-[0.08em] text-accent">
          {about?.heading ?? FALLBACK_HEADING}
        </h1>

        <div className="space-y-5 text-[0.8125rem] font-light leading-[1.9] text-ink">
          {about?.bio ? (
            <PortableText value={about.bio as never} />
          ) : (
            FALLBACK_BIO
          )}
        </div>
      </section>
    </div>
  );
}
