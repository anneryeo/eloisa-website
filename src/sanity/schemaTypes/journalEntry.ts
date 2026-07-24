import { defineField, defineType } from "sanity";

/**
 * One appearance in the Journal — a campus talk, panel, or judging gig.
 * The grid shows `coverImage` with a "SCHOOL, YEAR / role" caption; opening an
 * entry reveals the gallery (event posters and photos) plus the two notes.
 */
export const journalEntry = defineType({
  name: "journalEntry",
  title: "Journal entry",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      description: 'Shown uppercase in the grid caption — e.g. "DLSU", "ATENEO"',
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
      name: "year",
      title: "Year",
      type: "number",
      validation: (rule) => rule.required().min(1900).max(2100),
    }),
    defineField({
      name: "role",
      title: "Role",
      description: 'Second caption line — e.g. "Speaker; AdCreate Society"',
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover photo",
      description: "The decorated snapshot shown in the Journal grid.",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      description: "Event posters and photos shown when the entry is opened.",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "blurb",
      title: "Blurb",
      description:
        'What the event was — e.g. "Monster Academy: Illustrator 101. DLSU AdCreate Society"',
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "note",
      title: "Personal note",
      description: 'Eloisa\'s own line — e.g. "This was my first discussion evah!"',
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "order",
      title: "Order",
      description: "Lower numbers appear first in the grid.",
      type: "number",
      initialValue: 100,
    }),
  ],
  orderings: [
    {
      title: "Grid order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "role", media: "coverImage" },
    prepare({ title, subtitle, media }) {
      return { title, subtitle, media };
    },
  },
});
