import { SectionHeading } from "@/components/site/SectionHeading";

export const metadata = { title: "FAQ" };

/** FAQ. Layout only — the question list lands in a later pass. */
export default function FaqPage() {
  return (
    <>
      <SectionHeading>FAQ</SectionHeading>
      <p className="max-w-[60ch] text-sm font-light leading-[1.9] text-muted">
        This section is still being built.
      </p>
    </>
  );
}
