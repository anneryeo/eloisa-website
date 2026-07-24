import { defineField, defineType } from "sanity";

/**
 * The About Me page — a singleton (one document, fixed id "aboutPage").
 * The bio is Portable Text because the comp italicizes the handle names
 * (*eloisaclaireart*, *eloisaclairedesign*) inside otherwise plain paragraphs.
 */
export const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      description: 'The pink greeting — "HI, I\'M ELOISA CLAIRE"',
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "portrait",
      title: "Portrait",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "array",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
          marks: {
            decorators: [
              { title: "Emphasis", value: "em" },
              { title: "Strong", value: "strong" },
            ],
            annotations: [],
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "heading", media: "portrait" },
  },
});
