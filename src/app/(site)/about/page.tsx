import { SectionHeading } from "@/components/site/SectionHeading";

export const metadata = { title: "About Me" };

/** About Me. Layout only — copy and portrait land in a later pass. */
export default function AboutMePage() {
  return (
    <>
      <SectionHeading>Hi, I&apos;m Eloisa Claire</SectionHeading>
      <p className="max-w-[60ch] text-sm font-light leading-[1.9] text-muted">
        This section is still being built.
      </p>
    </>
  );
}
