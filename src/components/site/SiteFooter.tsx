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
  return (
    <footer className="text-[0.6875rem] font-light leading-relaxed text-ink">
      <p>{handle}</p>
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
