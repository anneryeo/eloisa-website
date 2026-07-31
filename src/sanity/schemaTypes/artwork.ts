import { defineField, defineType } from "sanity";

/**
 * A single art piece. Media is modeled as one of three kinds — a still image,
 * a video, or a GIF — because each needs different delivery:
 *   - image : Sanity's image pipeline (hotspot crop, on-the-fly transforms)
 *   - video : uploaded as a file asset, streamed with a poster still
 *   - gif   : uploaded as a file asset so animation is preserved (the image
 *             pipeline would flatten it)
 */
export const artwork = defineType({
  name: "artwork",
  title: "Artwork",
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
      name: "mediaType",
      title: "Media type",
      type: "string",
      options: {
        list: [
          { title: "Image", value: "image" },
          { title: "Video", value: "video" },
          { title: "GIF", value: "gif" },
        ],
        layout: "radio",
      },
      initialValue: "image",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      // Hotspot lets editors pick the focal point; crops stay art-directed
      // across every responsive size.
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.mediaType !== "image",
    }),
    defineField({
      name: "video",
      title: "Video file",
      type: "file",
      options: { accept: "video/mp4,video/webm" },
      hidden: ({ parent }) => parent?.mediaType !== "video",
    }),
    defineField({
      name: "poster",
      title: "Video poster (still)",
      description: "Shown before the video plays and as a fallback.",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.mediaType !== "video",
    }),
    defineField({
      name: "gif",
      title: "GIF file",
      type: "file",
      options: { accept: "image/gif" },
      hidden: ({ parent }) => parent?.mediaType !== "gif",
    }),
    defineField({
      name: "workType",
      title: "Work type",
      description:
        "Which list this piece appears under when Work is expanded in the nav.",
      type: "string",
      options: {
        list: [
          { title: "Personal", value: "personal" },
          { title: "Professional", value: "professional" },
        ],
        layout: "radio",
      },
      initialValue: "professional",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      validation: (rule) => rule.min(1900).max(2100),
    }),
    defineField({
      name: "medium",
      title: "Medium",
      description: 'e.g. "Oil on canvas", "Digital", "Mixed media"',
      type: "string",
    }),
    defineField({
      name: "dimensions",
      title: "Dimensions",
      description: 'e.g. "120 × 90 cm"',
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "projectLabel",
      title: "Project label",
      description: 'Small label above the intro. Defaults to "WORK".',
      type: "string",
      initialValue: "WORK",
    }),
    defineField({
      name: "heroImage",
      title: "Case study hero",
      description:
        "Optional wide hero for the project page. The main artwork image is used when empty.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "caseStudySections",
      title: "Case study sections",
      description:
        "Build the page in order. Empty projects still show the standard title, intro, and hero layout.",
      type: "array",
      of: [
        {
          type: "object",
          name: "caseStudySection",
          title: "Case study section",
          fields: [
            defineField({
              name: "layout",
              title: "Layout",
              type: "string",
              options: {
                list: [
                  { title: "Full-width image", value: "full" },
                  { title: "Three photos", value: "threeUp" },
                  { title: "Two photos", value: "split" },
                  { title: "Text", value: "text" },
                ],
                layout: "radio",
              },
              initialValue: "full",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "heading",
              title: "Heading",
              type: "string",
            }),
            defineField({
              name: "body",
              title: "Body",
              type: "text",
              rows: 5,
            }),
            defineField({
              name: "images",
              title: "Images",
              description:
                "Add one image for full-width, two for split, or three for the three-photo layout.",
              type: "array",
              of: [{ type: "image", options: { hotspot: true } }],
              validation: (rule) => rule.max(3),
            }),
          ],
          preview: {
            select: {
              title: "heading",
              layout: "layout",
              media: "images.0",
            },
            prepare({ title, layout, media }) {
              const labels: Record<string, string> = {
                full: "Full-width image",
                threeUp: "Three photos",
                split: "Two photos",
                text: "Text",
              };
              return {
                title: title || labels[layout] || "Case study section",
                subtitle: labels[layout],
                media,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "featured",
      title: "Featured on front gallery",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Order",
      description: "Lower numbers appear first in the gallery.",
      type: "number",
      initialValue: 100,
    }),
  ],
  orderings: [
    {
      title: "Gallery order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "medium",
      media: "image",
    },
  },
});
