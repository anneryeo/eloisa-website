import { defineArrayMember, defineField, defineType } from "sanity";

/** Shared editorial text with a deliberately small, client-friendly toolbar. */
export const richText = defineType({
  name: "richText",
  title: "Formatted text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal text", value: "normal" },
        { title: "Large heading", value: "h2" },
        { title: "Medium heading", value: "h3" },
        { title: "Small heading", value: "h4" },
      ],
      lists: [],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
          { title: "Underline", value: "underline" },
          { title: "Strikethrough", value: "strike-through" },
        ],
        annotations: [
          {
            name: "link",
            title: "Link",
            type: "object",
            fields: [
              defineField({
                name: "href",
                title: "Link destination",
                description:
                  "Paste a full web address, email link, phone link, or an internal path such as /about.",
                type: "string",
                validation: (rule) =>
                  rule.required().custom((value) => {
                    if (!value) return true;
                    if (/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(value)) return true;
                    return "Use https://, http://, mailto:, tel:, /path, or #section.";
                  }),
              }),
              defineField({
                name: "openInNewTab",
                title: "Open in a new tab",
                type: "boolean",
                initialValue: true,
              }),
            ],
          },
          {
            name: "textStyle",
            title: "Font and size",
            type: "object",
            fields: [
              defineField({
                name: "font",
                title: "Font style",
                type: "string",
                options: {
                  list: [
                    { title: "Default (Poppins)", value: "sans" },
                    { title: "Handwritten", value: "display" },
                    { title: "Typewriter", value: "mono" },
                  ],
                },
                initialValue: "sans",
              }),
              defineField({
                name: "size",
                title: "Font size",
                type: "string",
                options: {
                  list: [
                    { title: "Small", value: "small" },
                    { title: "Normal", value: "normal" },
                    { title: "Large", value: "large" },
                    { title: "Extra large", value: "xlarge" },
                  ],
                },
                initialValue: "normal",
              }),
            ],
          },
        ],
      },
    }),
  ],
});
