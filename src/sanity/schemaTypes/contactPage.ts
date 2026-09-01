import { defineField, defineType } from "sanity";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact page",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Contact",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Introduction",
      description: "Main contact message. Supports headings, links, fonts, and text sizes.",
      type: "richText",
    }),
    defineField({
      name: "contactMethods",
      title: "Contact methods",
      description: "Add and reorder email addresses, social profiles, booking links, or other contact options.",
      type: "array",
      of: [
        {
          type: "object",
          name: "contactMethod",
          title: "Contact method",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              description: 'For example “Email”, “Instagram”, or “Book a call”.',
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "displayText",
              title: "Text shown",
              description: 'For example “hello@eloisaclaire.com” or “@eloisaclairedesign”.',
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "Link destination",
              description: "Use https://, mailto:, or tel:.",
              type: "string",
              validation: (rule) =>
                rule.required().custom((value) =>
                  !value || /^(https?:\/\/|mailto:|tel:)/i.test(value)
                    ? true
                    : "Use https://, http://, mailto:, or tel:.",
                ),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "displayText" },
            prepare({ title, subtitle }) {
              return { title: title || "Untitled contact method", subtitle };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return { title: title || "Contact page" };
    },
  },
});
