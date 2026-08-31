import Link from "next/link";

import { Media } from "@/components/Media";
import { urlForImage } from "@/sanity/image";
import type {
  Artwork,
  CaseStudyImage,
  CaseStudySection,
  WorkType,
} from "@/sanity/queries";
import { ScrapbookImage } from "./ScrapbookImage";

function imageUrl(image: unknown) {
  return urlForImage(image as object).quality(95).url();
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
  const columns =
    section.layout === "threeUp"
      ? "md:grid-cols-3"
      : section.layout === "split"
        ? "md:grid-cols-2"
        : "grid-cols-1";

  return (
    <section className="space-y-6">
      {(section.heading || section.body) && (
        <div className="w-full space-y-3">
          {section.heading && (
            <h2 className="text-xs font-medium uppercase tracking-[0.04em]">
              {section.heading}
            </h2>
          )}
          {section.body && (
            <p className="whitespace-pre-line text-justify text-sm font-light leading-7">
              {section.body}
            </p>
          )}
        </div>
      )}

      {images.length > 0 && section.layout !== "text" && (
        <div className={`grid gap-5 md:gap-7 ${columns}`}>
          {images.map((item, index) => (
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
  workType: WorkType;
  previous?: Pick<Artwork, "title" | "slug">;
  next?: Pick<Artwork, "title" | "slug">;
}) {
  const hero = project.heroImage ?? project.image;
  const usesPrimaryMedia = !project.heroImage && project.mediaType !== "image";
  const basePath = `/work/${workType}`;

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
        {(project.descriptionAbove ?? project.description) && (
          <p className="w-full pt-2 text-justify text-sm font-light leading-7">
            {project.descriptionAbove ?? project.description}
          </p>
        )}
      </header>

      <div className="space-y-16 md:space-y-24">
        {(Boolean(hero) || usesPrimaryMedia) && (
          <section className="space-y-7">
            {usesPrimaryMedia ? (
              <div
                className="relative w-full overflow-hidden bg-placeholder"
                style={{
                  aspectRatio:
                    project.heroAspectRatio ?? project.aspectRatio ?? 16 / 9,
                }}
              >
                <Media artwork={project} priority fullResolution />
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
            {project.descriptionBelow && (
              <p className="w-full whitespace-pre-line text-justify text-sm font-light leading-7">
                {project.descriptionBelow}
              </p>
            )}
          </section>
        )}

        {project.caseStudySections?.map((section) => (
          <Section key={section._key} section={section} title={project.title} />
        ))}
      </div>
    </article>
  );
}
