import { SectionHeading } from "@/components/site/SectionHeading";
import { RichText } from "@/components/RichText";
import { getFaqItems, type FaqItem } from "@/sanity/queries";

export const metadata = { title: "FAQ" };
export const revalidate = 3600;

/** Comp copy, shown whenever the CMS has no FAQ items yet. */
const FALLBACK_FAQS: FaqItem[] = [
  {
    _id: "fallback-career",
    question: "How did you start your design career?",
    answer:
      "I've always considered myself an artistic child, but it only was when I entered senior of high school did I learn that I can monetize my work. We were doing a lot of presentations and brand books at that time (I have a background in Business Management & Marketing) and I was often the one doing the designs for it and I fell in love with the process. :~)",
  },
  {
    _id: "fallback-degree",
    question: "Do I need a degree in design?",
    answer:
      "Imo, not necessarily! As mentioned, I have a background in business so my whole curriculum wasn't entirely catered to design and branding. Although I didn't have the edge of similar connections to my design peers at that time, it only made me strive harder to be more outgoing and take lots of coffee chats.",
  },
];

/** FAQ, per the comp: pink questions over plain answers in a narrow column. */
export default async function FaqPage() {
  const items = await getFaqItems();
  const faqs = items.length > 0 ? items : FALLBACK_FAQS;

  return (
    <div className="w-full">
      <SectionHeading>FAQ</SectionHeading>

      <dl className="space-y-8">
        {faqs.map((faq) => (
          <div key={faq._id}>
            <dt className="mb-2 text-[0.8125rem] font-medium uppercase tracking-[0.05em] text-accent">
              {faq.question}
            </dt>
            <dd>
              <RichText
                value={faq.answerRich ?? faq.answer}
                className="text-justify text-sm font-light leading-[1.9] text-ink"
              />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
