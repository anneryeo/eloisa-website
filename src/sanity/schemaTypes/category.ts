import { defineField, defineType } from "sanity";

/** A grouping for artworks — e.g. a series, medium, or collection. */
export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description (existing plain text)",
      type: "text",
      rows: 3,
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "descriptionRich",
      title: "Description",
      description:
        "Formatted category description. Existing plain text remains stored until replaced.",
      type: "richText",
    }),
  ],
});
