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
  {
    label: "Work",
    href: "/",
    // The comps label the sub-lists in lowercase: "personal" and "work work"
    // (the client's name for commissioned work). Routes keep neutral slugs.
    children: [
      { label: "personal", href: "/work/personal" },
      { label: "work work", href: "/work/professional" },
    ],
  },
  { label: "About Me", href: "/about" },
  { label: "Journal", href: "/journal" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];
