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
    <footer className="flex flex-col items-start gap-1 text-[0.6875rem] font-light leading-4 text-ink">
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
      {website && <p className="m-0">{website}</p>}
      <a
        href={`mailto:${email}`}
        className="transition-colors duration-200 hover:text-accent"
      >
        {email}
      </a>
    </footer>
  );
}
