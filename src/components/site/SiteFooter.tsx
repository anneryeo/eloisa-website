import type { SocialLink, SocialPlatform } from "@/sanity/queries";

function SocialIcon({ platform }: { platform: SocialPlatform }) {
  if (platform === "instagram") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-5 w-5 fill-none stroke-current"
        strokeWidth="1.8"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" className="fill-current stroke-none" />
      </svg>
    );
  }

  if (platform === "tiktok") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
        <path d="M15.7 3c.4 2.3 1.7 3.7 4.3 3.9v3.2a8.8 8.8 0 0 1-4.2-1.2v6.2a6 6 0 1 1-5.2-5.9v3.3a2.8 2.8 0 1 0 2 2.7V3h3.1Z" />
      </svg>
    );
  }

  const letters: Record<
    Exclude<SocialPlatform, "instagram" | "tiktok">,
    string
  > = {
    facebook: "f",
    linkedin: "in",
    youtube: "▶",
    behance: "Bē",
    other: "↗",
  };
  return (
    <span aria-hidden="true" className="text-[0.65rem] font-medium">
      {letters[platform]}
    </span>
  );
}

const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  behance: "Behance",
  other: "Social profile",
};

/** Sidebar footer — social icons, site, and contact email, editable in Studio. */
export function SiteFooter({
  handle = "eloisaclairedesign",
  website = "eloisaclaire.com",
  email = "hello@eloisaclaire.com",
  socialLinks,
}: {
  handle?: string;
  website?: string;
  email?: string;
  socialLinks?: SocialLink[];
}) {
  const socialHandle = (handle || "eloisaclairedesign").replace(/^@/, "");
  const websiteHref = website
    ? /^https?:\/\//i.test(website)
      ? website
      : `https://${website}`
    : undefined;
  const links: SocialLink[] = socialLinks?.length
    ? socialLinks
    : [
        {
          _key: "legacy-instagram",
          platform: "instagram",
          url: `https://www.instagram.com/${socialHandle}/`,
        },
        {
          _key: "legacy-tiktok",
          platform: "tiktok",
          url: `https://www.tiktok.com/@${socialHandle}`,
        },
      ];

  return (
    <footer className="flex flex-col items-start gap-1 text-[0.6875rem] font-light leading-4 text-ink">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {links.map((link) => {
          const label = link.label || PLATFORM_LABELS[link.platform];
          return (
            <a
              key={link._key}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              title={label}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-ink transition-colors duration-200 hover:border-accent hover:text-accent"
            >
              <SocialIcon platform={link.platform} />
            </a>
          );
        })}
      </div>
      {websiteHref && (
        <a
          href={websiteHref}
          target="_blank"
          rel="noreferrer"
          className="transition-colors duration-200 hover:text-accent"
        >
          {website}
        </a>
      )}
      <a
        href={`mailto:${email}`}
        className="transition-colors duration-200 hover:text-accent"
      >
        {email}
      </a>
    </footer>
  );
}
