import { PortableText } from "next-sanity";

import { cx } from "@/lib/cx";

function safeHref(value?: string) {
  if (!value || !/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(value)) return "#";
  return value;
}

const fontClasses: Record<string, string> = {
  sans: "font-sans",
  display: "font-display",
  mono: "font-mono",
};

const sizeClasses: Record<string, string> = {
  small: "text-[0.625rem]",
  normal: "text-[0.6875rem]",
  large: "text-sm",
  xlarge: "text-lg",
};

const components = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => <p>{children}</p>,
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="pt-3 text-3xl font-bold leading-tight tracking-[-0.025em] md:text-4xl">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="pt-2 text-2xl font-bold leading-tight tracking-[-0.02em] md:text-3xl">
        {children}
      </h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="pt-1 text-lg font-bold leading-snug md:text-xl">{children}</h4>
    ),
  },
  marks: {
    underline: ({ children }: { children?: React.ReactNode }) => (
      <span className="underline underline-offset-2">{children}</span>
    ),
    "strike-through": ({ children }: { children?: React.ReactNode }) => (
      <s>{children}</s>
    ),
    link: ({
      children,
      value,
    }: {
      children?: React.ReactNode;
      value?: { href?: string; openInNewTab?: boolean };
    }) => {
      const href = safeHref(value?.href);
      const external = /^https?:\/\//i.test(href);
      const newTab = value?.openInNewTab && external;
      return (
        <a
          href={href}
          className="underline decoration-current underline-offset-2 transition-colors hover:text-accent"
          target={newTab ? "_blank" : undefined}
          rel={newTab ? "noreferrer noopener" : undefined}
        >
          {children}
        </a>
      );
    },
    textStyle: ({
      children,
      value,
    }: {
      children?: React.ReactNode;
      value?: { font?: string; size?: string };
    }) => (
      <span
        className={cx(
          value?.font ? fontClasses[value.font] : undefined,
          value?.size ? sizeClasses[value.size] : undefined,
        )}
      >
        {children}
      </span>
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
