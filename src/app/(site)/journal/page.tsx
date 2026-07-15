import { SectionHeading } from "@/components/site/SectionHeading";

export const metadata = { title: "Journal" };

/** Journal — talks, workshops and campus appearances. Layout only for now. */
export default function JournalPage() {
  return (
    <>
      <SectionHeading>Journal</SectionHeading>
      <p className="max-w-[60ch] text-sm font-light leading-[1.9] text-muted">
        This section is still being built.
      </p>
    </>
  );
}
