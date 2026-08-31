import { defineField, defineType } from "sanity";

/** One question on the FAQ page — pink uppercase question, plain answer. */
export const faqItem = defineType({
  name: "faqItem",
  title: "FAQ item",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer (existing plain text)",
      type: "text",
      rows: 6,
      readOnly: true,
    }),
    defineField({
      name: "answerRich",
      title: "Answer",
      description:
        "Formatted answer. When empty, the existing plain-text answer remains visible.",
      type: "richText",
    }),
    defineField({
      name: "order",
      title: "Order",
      description: "Lower numbers appear first on the page.",
      type: "number",
      initialValue: 100,
    }),
  ],
  orderings: [
    {
      title: "Page order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "question" },
  },
});
