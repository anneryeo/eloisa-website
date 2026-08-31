/**
 * Single source of truth for the sidebar nav — label text, order, and routes
 * all match the Figma comps. Labels are stored in sentence case and uppercased
 * in CSS so they stay readable here and in screen-reader output.
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface NavSection extends NavLink {
  /** Sub-links revealed when the section opens (hover / click / focus). */
  children?: NavLink[];
}

export const NAV_SECTIONS: NavSection[] = [
  // Personal and Professional remain separate values in Sanity so no existing
  // content or URLs are disturbed. The public gallery presents both together.
  { label: "Work", href: "/" },
  { label: "About Me", href: "/about" },
  { label: "Journal", href: "/journal" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const NAV_LABELS: Record<string, string> = Object.fromEntries(
  NAV_SECTIONS.map((section) => [section.href, section.label]),
);
