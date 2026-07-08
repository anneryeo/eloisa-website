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
