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
      name: "wordmarkWidth",
      title: "Logo width",
      description:
        "Width of the image logo in pixels. The layout caps it so it remains responsive.",
      type: "number",
      initialValue: 190,
      validation: (rule) => rule.min(120).max(260),
    }),
    defineField({
      name: "favicon",
      title: "Website favicon",
      description: "Upload a square PNG, JPG, or WebP. A transparent PNG works best.",
      type: "image",
      options: { accept: "image/png,image/jpeg,image/webp" },
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true;
          return value.asset ? true : "Upload a favicon image.";
        }),
    }),
    defineField({
      name: "bio",
      title: "Sidebar bio (existing plain text)",
      description: "The standing intro paragraph under the wordmark.",
      type: "text",
      rows: 4,
      readOnly: true,
    }),
    defineField({
      name: "bioRich",
      title: "Sidebar bio",
      description:
        "Formatted sidebar description. When empty, the existing plain-text bio remains visible.",
      type: "richText",
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
      name: "socialLinks",
      title: "Social media links",
      description:
        "Add, remove, and reorder the icon links shown in the sidebar footer.",
      type: "array",
      of: [
        {
          type: "object",
          name: "socialLink",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "Instagram", value: "instagram" },
                  { title: "TikTok", value: "tiktok" },
                  { title: "Facebook", value: "facebook" },
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "YouTube", value: "youtube" },
                  { title: "Behance", value: "behance" },
                  { title: "Other", value: "other" },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "label",
              title: "Accessible label",
              description: 'Required only for "Other"; for example, "Dribbble".',
              type: "string",
            }),
            defineField({
              name: "url",
              title: "Profile URL",
              type: "url",
              validation: (rule) =>
                rule.required().uri({ scheme: ["http", "https"] }),
            }),
          ],
          preview: {
            select: { title: "platform", subtitle: "url" },
          },
        },
      ],
    }),
    defineField({
      name: "siteSections",
      title: "Site navigation sections",
      description:
        "Add, remove, reorder, rename, or hide links in the public navigation. Removing a link does not delete its page or content.",
      type: "array",
      initialValue: [
        { _type: "siteSection", path: "/", label: "Work", visible: true },
        { _type: "siteSection", path: "/about", label: "About Me", visible: true },
        { _type: "siteSection", path: "/journal", label: "Journal", visible: true },
        { _type: "siteSection", path: "/faq", label: "FAQ", visible: true },
        { _type: "siteSection", path: "/contact", label: "Contact", visible: true },
      ],
      of: [
        {
          type: "object",
          name: "siteSection",
          title: "Site section",
          fields: [
            defineField({
              name: "path",
              title: "Page",
              type: "string",
              options: {
                list: [
                  { title: "Work", value: "/" },
                  { title: "About Me", value: "/about" },
                  { title: "Journal", value: "/journal" },
                  { title: "FAQ", value: "/faq" },
                  { title: "Contact", value: "/contact" },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "label",
              title: "Navigation label",
              description: "Optional custom label. Leave empty to use the page name.",
              type: "string",
            }),
            defineField({
              name: "visible",
              title: "Show in navigation",
              type: "boolean",
              initialValue: true,
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "path", visible: "visible" },
            prepare({ title, subtitle, visible }) {
              return {
                title: title || subtitle,
                subtitle: visible === false ? `${subtitle} — hidden` : subtitle,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "journalIntro",
      title: "Journal intro (existing plain text)",
      description: "Short paragraphs shown above the Journal grid.",
      type: "array",
      of: [{ type: "string" }],
      readOnly: true,
    }),
    defineField({
      name: "journalIntroRich",
      title: "Journal intro",
      description:
        "Formatted Journal introduction. When empty, the existing paragraphs remain visible.",
      type: "richText",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site settings" }),
  },
});
