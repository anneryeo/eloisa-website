import Link from "next/link";

import { Media } from "@/components/Media";
import { RichText } from "@/components/RichText";
import { urlForImage } from "@/sanity/image";
import type {
  Artwork,
  CaseStudyImage,
  CaseStudyMediaItem,
  CaseStudySection,
  WorkScope,
} from "@/sanity/queries";
import { ScrapbookImage } from "./ScrapbookImage";

function imageUrl(image: unknown) {
  return urlForImage(image as object).quality(95).url();
}

function ProjectMedia({ item, title, priority }: { item: CaseStudyMediaItem; title: string; priority?: boolean }) {
  return (
    <div
      className="relative w-full overflow-hidden bg-placeholder"
      style={{ aspectRatio: item.aspectRatio ?? 16 / 9 }}
    >
      <Media
        artwork={{
          _id: item._key,
          title: item.caption || title,
          slug: "",
          mediaType: item.mediaType,
          image: item.image,
          poster: item.poster,
          fileUrl: item.fileUrl,
          socialVideoUrl: item.socialVideoUrl,
        }}
        priority={priority}
        fullResolution
      />
    </div>
  );
}

function ProjectImage({
  item,
  title,
  seed,
  priority,
  subtle,
}: {
  item: CaseStudyImage;
  title: string;
  seed: string;
  priority?: boolean;
  subtle?: boolean;
}) {
  return (
    <ScrapbookImage
      src={imageUrl(item.image)}
      alt={title}
      ratio={item.aspectRatio ?? 1}
      seed={seed}
      priority={priority}
      subtle={subtle}
    />
  );
}

function Section({
  section,
  title,
}: {
  section: CaseStudySection;
  title: string;
}) {
  const images = section.images?.filter((item) => item.image) ?? [];
  const mediaItems = section.mediaItems?.filter(
    (item) => item.image || item.fileUrl || item.socialVideoUrl,
  ) ?? [];
  const headingClass = {
    small: "text-lg md:text-xl",
    medium: "text-2xl md:text-3xl",
    large: "text-3xl md:text-5xl",
  }[section.headingSize ?? "medium"];
  const columns =
    section.layout === "threeUp"
      ? "md:grid-cols-3"
      : section.layout === "split"
        ? "md:grid-cols-2"
        : "grid-cols-1";

  return (
    <section className="space-y-6">
      {(section.heading || section.bodyRich || section.body) && (
        <div className="w-full space-y-3">
          {section.heading && (
            <h2 className={`${headingClass} font-bold leading-tight tracking-[-0.025em]`}>
              {section.heading}
            </h2>
          )}
          <RichText
            value={section.bodyRich ?? section.body}
            className="text-justify text-sm font-light leading-7"
          />
        </div>
      )}

      {(mediaItems.length > 0 || images.length > 0) && section.layout !== "text" && (
        <div className={`grid gap-5 md:gap-7 ${columns}`}>
          {mediaItems.length > 0
            ? mediaItems.map((item, index) => (
                <ProjectMedia
                  key={item._key}
                  item={item}
                  title={`${title} — media ${index + 1}`}
                />
              ))
            : images.map((item, index) => (
                <ProjectImage
                  key={item._key}
                  item={item}
                  title={`${title} — image ${index + 1}`}
                  seed={`${section._key}-${item._key}`}
                  subtle={section.layout === "full"}
                />
              ))}
        </div>
      )}
    </section>
  );
}

export function CaseStudy({
  project,
  workType,
  previous,
  next,
}: {
  project: Artwork;
  workType: WorkScope;
  previous?: Pick<Artwork, "title" | "slug">;
  next?: Pick<Artwork, "title" | "slug">;
}) {
  const hero = project.heroImage ?? project.image;
  // A project whose primary artwork is motion must stay playable on its detail
  // page. Posters and optional hero stills are fallbacks, not replacements for
  // the uploaded video, GIF, or supported social embed.
  const usesPrimaryMedia = project.mediaType !== "image";
  const basePath = `/work/${workType}`;
  const mainMediaWidth = {
    full: "w-full",
    large: "w-full md:w-3/4",
    medium: "w-full md:w-1/2",
  }[project.mainMediaWidth ?? "full"];

  return (
    <article className="pb-24">
      <nav
        className="mb-10 flex items-center justify-between text-[0.6875rem] uppercase tracking-[0.04em] text-muted"
        aria-label="Project navigation"
      >
        {previous ? (
          <Link className="transition-colors hover:text-accent" href={`${basePath}/${previous.slug}`}>
            &lt; Prev
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link className="transition-colors hover:text-accent" href={`${basePath}/${next.slug}`}>
            Next &gt;
          </Link>
        ) : (
          <span />
        )}
      </nav>

      <header className="mb-8 w-full space-y-2">
        <h1 className="text-3xl font-medium uppercase leading-none tracking-[-0.035em] md:text-5xl">
          {project.title}
        </h1>
        <p className="text-[0.6875rem] font-medium uppercase tracking-[0.05em]">
          {project.projectLabel ?? "WORK"}
        </p>
        <RichText
          value={
            project.descriptionAboveRich ??
            project.descriptionAbove ??
            project.description
          }
          className="w-full pt-2 text-justify text-sm font-light leading-7"
        />
      </header>

      <div className="space-y-16 md:space-y-24">
        {(Boolean(hero) || usesPrimaryMedia) && (
          <section className={`space-y-7 ${mainMediaWidth}`}>
            {usesPrimaryMedia ? (
              <div
                className="relative w-full overflow-hidden bg-placeholder"
                style={{
                  aspectRatio:
                    project.heroAspectRatio ?? project.aspectRatio ?? 16 / 9,
                }}
              >
                <Media
                  artwork={project}
                  priority
                  fullResolution
                  fit={project.mainMediaFit ?? "contain"}
                />
              </div>
            ) : (
              <ScrapbookImage
                src={imageUrl(hero)}
                alt={project.title}
                ratio={project.heroAspectRatio ?? project.aspectRatio ?? 1.5}
                seed={`${project._id}-hero`}
                priority
                subtle
              />
            )}
            <RichText
              value={project.descriptionBelowRich ?? project.descriptionBelow}
              className="w-full text-justify text-sm font-light leading-7"
            />
          </section>
        )}

        {project.caseStudySections?.map((section) => (
          <Section key={section._key} section={section} title={project.title} />
        ))}
      </div>
    </article>
  );
}
