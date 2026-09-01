import { RichText } from "@/components/RichText";
import { SectionHeading } from "@/components/site/SectionHeading";
import { getContactPage } from "@/sanity/queries";

export const metadata = { title: "Contact" };

export const revalidate = 60;

export default async function ContactPage() {
  const contact = await getContactPage();
  const methods = contact?.contactMethods ?? [
    {
      _key: "fallback-email",
      label: "Email",
      displayText: "hello@eloisaclaire.com",
      url: "mailto:hello@eloisaclaire.com",
    },
  ];

  return (
    <>
      <SectionHeading>{contact?.heading ?? "Contact"}</SectionHeading>
      <RichText
        value={contact?.intro}
        className="mb-10 w-full text-justify text-[0.6875rem] font-light leading-[1.9] text-muted"
      />
      <dl className="space-y-5">
        {methods.map((method) => (
          <div key={method._key}>
            <dt className="font-mono text-xs font-bold uppercase tracking-[0.04em] text-muted">
              {method.label}
            </dt>
            <dd className="mt-1">
              <a
                href={method.url}
                className="text-lg font-medium underline underline-offset-4 transition-colors hover:text-accent"
                target={method.url.startsWith("http") ? "_blank" : undefined}
                rel={method.url.startsWith("http") ? "noreferrer noopener" : undefined}
              >
                {method.displayText}
              </a>
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}
