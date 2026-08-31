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
      name: "portraitMediaType",
      title: "Portrait media type",
      type: "string",
      options: {
        list: [
          { title: "Image", value: "image" },
          { title: "GIF", value: "gif" },
          { title: "Looping video", value: "video" },
        ],
        layout: "radio",
      },
      initialValue: "image",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "portrait",
      title: "Portrait image",
      description:
        "The default portrait for Image mode and the loading poster/fallback for video.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "portraitGif",
      title: "Portrait GIF",
      type: "file",
      options: { accept: "image/gif" },
      hidden: ({ parent }) => parent?.portraitMediaType !== "gif",
    }),
    defineField({
      name: "portraitVideo",
      title: "Looping portrait video",
      description: "Upload an MP4 or WebM. It plays muted and loops automatically.",
      type: "file",
      options: { accept: "video/mp4,video/webm" },
      hidden: ({ parent }) => parent?.portraitMediaType !== "video",
    }),
    defineField({
      name: "portraitHoverImage",
      title: "Image shown on hover",
      description:
        "Optional image that crossfades over the default portrait, GIF, or video when a visitor hovers.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "richText",
    }),
  ],
  preview: {
    select: { title: "heading", media: "portrait" },
  },
});
