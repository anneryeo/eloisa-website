import { defineField, defineType } from "sanity";

/**
 * Site-wide chrome, editable in the Studio — a singleton (fixed id
 * "siteSettings"). The wordmark is a stack of lettering frames the sidebar
 * cycles through stop-motion style, matching the mixed-media logo studies on
 * the board; add, remove, or reorder frames here to change the animation.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "wordmarkFrames",
      title: "Wordmark frames",
      description:
        "Lettering variants cycled in the sidebar like stop-motion frames. One image = static wordmark; empty = plain text fallback.",
      type: "array",
      of: [{ type: "image" }],
    }),
    defineField({
      name: "wordmarkInterval",
      title: "Seconds per frame",
      description: "How long each wordmark frame holds before the next cut.",
      type: "number",
      initialValue: 1.6,
      validation: (rule) => rule.min(0.2).max(30),
    }),
    defineField({
      name: "bio",
      title: "Sidebar bio",
      description: "The standing intro paragraph under the wordmark.",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "footerHandle",
      title: "Footer — handle",
      type: "string",
    }),
    defineField({
      name: "footerWebsite",
      title: "Footer — website",
      type: "string",
    }),
    defineField({
      name: "footerEmail",
      title: "Footer — email",
      type: "string",
    }),
    defineField({
      name: "journalIntro",
      title: "Journal intro",
      description: "Short paragraphs shown above the Journal grid.",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site settings" }),
  },
});
