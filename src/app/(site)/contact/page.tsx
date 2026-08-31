import { SectionHeading } from "@/components/site/SectionHeading";

export const metadata = { title: "Contact" };

/** Contact. Layout only — the comps for this screen aren't drawn yet. */
export default function ContactPage() {
  return (
    <>
      <SectionHeading>Contact</SectionHeading>
      <p className="w-full text-justify text-sm font-light leading-[1.9] text-muted">
        This section is still being built. In the meantime, reach Eloisa at{" "}
        <a
          href="mailto:hello@eloisaclaire.com"
          className="text-ink underline underline-offset-4 transition-colors hover:text-accent"
        >
          hello@eloisaclaire.com
        </a>
        .
      </p>
    </>
  );
}
