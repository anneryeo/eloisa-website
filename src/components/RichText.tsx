import { PortableText } from "next-sanity";

import { cx } from "@/lib/cx";

const components = {
  marks: {
    underline: ({ children }: { children?: React.ReactNode }) => (
      <span className="underline underline-offset-2">{children}</span>
    ),
    "strike-through": ({ children }: { children?: React.ReactNode }) => (
      <s>{children}</s>
    ),
  },
};

/** Render formatted Sanity blocks while retaining support for legacy strings. */
export function RichText({
  value,
  className,
}: {
  value?: unknown[] | string;
  className?: string;
}) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;

  return (
    <div className={cx("space-y-4", className)}>
      {typeof value === "string" ? (
        <p className="whitespace-pre-line">{value}</p>
      ) : (
        <PortableText value={value as never} components={components} />
      )}
    </div>
  );
}
