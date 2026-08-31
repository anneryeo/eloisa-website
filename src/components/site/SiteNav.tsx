"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { cx } from "@/lib/cx";
import { NAV_SECTIONS, type NavSection } from "./navigation";

const ITEM = "block uppercase transition-colors duration-200";

const CHILD_ITEM = "block uppercase transition-colors duration-200";

export function SiteNav({ sections = NAV_SECTIONS }: { sections?: NavSection[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Sections">
      <ul className="text-[0.8125rem] font-light leading-[1.9] tracking-[0.05em]">
        {sections.map((section) =>
          section.children ? (
            <NavDisclosure
              key={section.href}
              section={section}
              pathname={pathname}
            />
          ) : (
            <li key={section.href}>
              <Link
                href={section.href}
                aria-current={pathname === section.href ? "page" : undefined}
                className={cx(
                  ITEM,
                  "hover:text-accent",
                  pathname === section.href ? "text-accent" : "text-ink",
                )}
              >
                {section.label}
              </Link>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}

export function MobileSiteNav({
  sections = NAV_SECTIONS,
}: {
  sections?: NavSection[];
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="relative z-50 lg:hidden">
      <button
        type="button"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 border border-ink bg-canvas"
      >
        <span
          className={cx(
            "block h-px w-5 bg-current transition-transform",
            open ? "translate-y-[3.5px] rotate-45" : "",
          )}
        />
        <span
          className={cx(
            "block h-px w-5 bg-current transition-transform",
            open ? "-translate-y-[3.5px] -rotate-45" : "",
          )}
        />
      </button>

      {open && (
        <nav
          aria-label="Mobile sections"
          className="absolute right-0 top-12 min-w-52 border border-ink bg-canvas p-5 shadow-[0_12px_30px_-14px_rgba(30,30,30,0.35)]"
        >
          <ul className="space-y-3 text-right text-sm font-light uppercase tracking-[0.05em]">
            {sections.map((section) => (
              <li key={section.href}>
                <Link
                  href={section.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === section.href ? "page" : undefined}
                  className={cx(
                    "block transition-colors hover:text-accent",
                    pathname === section.href ? "text-accent" : "text-ink",
                  )}
                >
                  {section.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

/**
 * A section that reveals sub-links. Work uses this: the brief calls for it to
 * sit black and collapsed like every other item on first paint, then turn pink
 * and expand into Personal / Professional on hover or keyboard focus. The Work
 * label itself links to the main gallery.
 */
function NavDisclosure({
  section,
  pathname,
}: {
  section: NavSection;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);

  // Once you're on one of the children the disclosure stays open, so the
  // current page is always reachable in the nav. Matching against the children
  // rather than the section's own href matters: Work's href is "/", and every
  // path starts with "/" — testing that would pin it open on the landing page,
  // which is exactly where the brief wants it closed.
  const inSection =
    section.children?.some((child) => pathname === child.href) ?? false;
  const expanded = open || inSection;

  return (
    <li
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(event) => {
        // Only collapse when focus leaves the whole group, not when it moves
        // from the button to one of the children.
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <Link
        href={section.href}
        aria-expanded={expanded}
        aria-current={pathname === section.href ? "page" : undefined}
        className={cx(ITEM, expanded ? "text-accent" : "text-ink")}
      >
        {section.label}
      </Link>

      {/* 0fr -> 1fr animates height without hard-coding one. */}
      <div
        className={cx(
          "grid transition-[grid-template-rows] duration-300 ease-gallery",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <ul className="overflow-hidden pl-3">
          {section.children?.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                tabIndex={expanded ? undefined : -1}
                aria-hidden={expanded ? undefined : true}
                aria-current={pathname === child.href ? "page" : undefined}
                className={cx(
                  CHILD_ITEM,
                  "text-accent",
                  pathname === child.href ? "underline underline-offset-4" : "",
                )}
              >
                <span aria-hidden="true" className="mr-2">
                  &bull;
                </span>
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
