/** Sidebar footer — handle, site, and contact email, editable in the Studio. */
export function SiteFooter({
  handle = "eloisaclairedesign",
  website,
  email = "hello@eloisaclaire.com",
}: {
  handle?: string;
  website?: string;
  email?: string;
}) {
  const socialHandle = (handle || "eloisaclairedesign").replace(/^@/, "");

  return (
    <footer className="space-y-2 text-[0.6875rem] font-light leading-relaxed text-ink">
      <div className="flex flex-col items-start">
        <a
          href={`https://www.instagram.com/${socialHandle}/`}
          target="_blank"
          rel="noreferrer"
          className="transition-colors duration-200 hover:text-accent"
        >
          Instagram @{socialHandle}
        </a>
        <a
          href={`https://www.tiktok.com/@${socialHandle}`}
          target="_blank"
          rel="noreferrer"
          className="transition-colors duration-200 hover:text-accent"
        >
          TikTok @{socialHandle}
        </a>
      </div>
      {website && <p>{website}</p>}
      <a
        href={`mailto:${email}`}
        className="transition-colors duration-200 hover:text-accent"
      >
        {email}
      </a>
    </footer>
  );
}
