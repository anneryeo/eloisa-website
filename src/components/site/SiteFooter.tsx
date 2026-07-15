/** Sidebar footer — handle and contact email, pinned to the bottom of the rail. */
export function SiteFooter() {
  return (
    <footer className="text-[0.6875rem] font-light leading-relaxed text-ink">
      <p>eloisaclairedesign</p>
      <a
        href="mailto:hello@eloisaclaire.com"
        className="transition-colors duration-200 hover:text-accent"
      >
        hello@eloisaclaire.com
      </a>
    </footer>
  );
}
