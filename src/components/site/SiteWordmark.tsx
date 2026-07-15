import Link from "next/link";

/**
 * The "ELOISA CLAIRE DESIGN" wordmark — three stacked lines of wide-tracked
 * handwritten caps, per the comps. The line breaks are part of the mark, so
 * they're explicit rather than left to wrapping.
 */
export function SiteWordmark() {
  return (
    <Link
      href="/"
      className="block font-display text-[1.75rem] uppercase leading-[1.5] tracking-[0.14em] text-ink"
    >
      Eloisa
      <br />
      Claire
      <br />
      Design
    </Link>
  );
}
