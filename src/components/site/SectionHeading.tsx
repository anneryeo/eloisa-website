/** Pink uppercase section heading, as used on About Me / FAQ in the comps. */
export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="mb-6 text-[0.9375rem] font-medium uppercase tracking-[0.05em] text-accent">
      {children}
    </h1>
  );
}
