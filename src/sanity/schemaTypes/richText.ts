import { defineArrayMember, defineType } from "sanity";

/** Shared editorial text with a deliberately small, client-friendly toolbar. */
export const richText = defineType({
  name: "richText",
  title: "Formatted text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [{ title: "Normal", value: "normal" }],
      lists: [],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
          { title: "Underline", value: "underline" },
          { title: "Strikethrough", value: "strike-through" },
        ],
        annotations: [],
      },
    }),
  ],
});
