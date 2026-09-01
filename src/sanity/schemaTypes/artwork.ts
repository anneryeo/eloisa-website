import { defineField, defineType } from "sanity";

/**
 * A single art piece. Media is modeled as one of four kinds — a still image,
 * a video, a social embed, or a GIF — because each needs different delivery:
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
      name: "gridPreviewType",
      title: "Work grid preview type",
      description:
        "Choose media used only on the Work grid. Reuse main media keeps the project’s primary picture or video.",
      type: "string",
      options: {
        list: [
          { title: "Reuse main media", value: "main" },
          { title: "Separate picture", value: "image" },
          { title: "Looping uploaded video", value: "video" },
          { title: "GIF", value: "gif" },
          { title: "Social video link", value: "socialVideo" },
        ],
        layout: "radio",
      },
      initialValue: "main",
    }),
    defineField({
      name: "gridThumbnail",
      title: "Grid picture",
      description:
        "A separate picture used only on the Work grid. Adjust its crop with the hotspot tool.",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.gridPreviewType !== "image",
    }),
    defineField({
      name: "gridVideo",
      title: "Grid video",
      description: "Upload an MP4 or WebM. It plays muted, automatically, and on a loop.",
      type: "file",
      options: { accept: "video/mp4,video/webm" },
      hidden: ({ parent }) => parent?.gridPreviewType !== "video",
    }),
    defineField({
      name: "gridVideoPoster",
      title: "Grid video poster",
      description: "Optional still shown while the looping video loads.",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.gridPreviewType !== "video",
    }),
    defineField({
      name: "gridGif",
      title: "Grid GIF",
      type: "file",
      options: { accept: "image/gif" },
      hidden: ({ parent }) => parent?.gridPreviewType !== "gif",
    }),
    defineField({
      name: "gridSocialVideoUrl",
      title: "Grid social video URL",
      description:
        "Paste a public YouTube, Instagram, or TikTok video URL. Muted autoplay is requested but the platform or visitor’s browser may block it.",
      type: "url",
      hidden: ({ parent }) => parent?.gridPreviewType !== "socialVideo",
      validation: (rule) =>
        rule.uri({ scheme: ["http", "https"] }).custom((value, context) => {
          if ((context.parent as { gridPreviewType?: string })?.gridPreviewType !== "socialVideo") return true;
          if (!value) return "A social video URL is required.";
          try {
            const host = new URL(value).hostname.replace(/^www\./, "");
            return ["youtube.com", "youtu.be", "instagram.com", "tiktok.com"].some(
              (domain) => host === domain || host.endsWith(`.${domain}`),
            )
              ? true
              : "Use a YouTube, Instagram, or TikTok URL.";
          } catch {
            return "Enter a valid URL.";
          }
        }),
    }),
    defineField({
      name: "mediaType",
      title: "Media type",
      description:
        "Choose what visitors should see. For YouTube, Instagram, or TikTok, choose Social video link and paste the public post URL.",
      type: "string",
      options: {
        list: [
          { title: "Image", value: "image" },
          { title: "Video", value: "video" },
          { title: "Social video link", value: "socialVideo" },
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
      name: "socialVideoUrl",
      title: "Social video URL",
      description:
        "Paste a YouTube video/Short, Instagram post/Reel, or TikTok video URL.",
      type: "url",
      hidden: ({ parent }) => parent?.mediaType !== "socialVideo",
      validation: (rule) =>
        rule.uri({ scheme: ["http", "https"] }).custom((value, context) => {
          if (
            (context.parent as { mediaType?: string })?.mediaType !==
            "socialVideo"
          )
            return true;
          if (!value) return "A social video URL is required.";
          try {
            const host = new URL(value).hostname.replace(/^www\./, "");
            return ["youtube.com", "youtu.be", "instagram.com", "tiktok.com"].some(
              (domain) => host === domain || host.endsWith(`.${domain}`),
            )
              ? true
              : "Use a YouTube, Instagram, or TikTok URL.";
          } catch {
            return "Enter a valid URL.";
          }
        }),
    }),
    defineField({
      name: "gif",
      title: "GIF file",
      type: "file",
      options: { accept: "image/gif" },
      hidden: ({ parent }) => parent?.mediaType !== "gif",
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
      title: "Description (legacy)",
      description:
        "Existing project description. Used above the artwork when the new field below is empty.",
      type: "text",
      rows: 4,
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "descriptionAbove",
      title: "Description above artwork",
      description: "Optional introduction shown between the project title and hero artwork.",
      type: "text",
      rows: 5,
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "descriptionAboveRich",
      title: "Description above artwork",
      description:
        "Introduction shown under the title. Select text in the editor to use Bold, Italic, Underline, or Strikethrough.",
      type: "richText",
    }),
    defineField({
      name: "descriptionBelow",
      title: "Description below artwork",
      description: "Optional closing description shown immediately below the hero artwork.",
      type: "text",
      rows: 5,
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "descriptionBelowRich",
      title: "Description below artwork",
      description:
        "Optional closing text below the main artwork. Select text to reveal the formatting controls.",
      type: "richText",
    }),
    defineField({
      name: "projectLabel",
      title: "Project label",
      description: 'Small label above the intro. Defaults to "WORK".',
      type: "string",
      initialValue: "WORK",
    }),
    defineField({
      name: "mainMediaWidth",
      title: "Main media size on project page",
      description: "Controls the width of the first picture or video after the project title.",
      type: "string",
      options: {
        list: [
          { title: "Full width", value: "full" },
          { title: "Large (75%)", value: "large" },
          { title: "Medium (50%)", value: "medium" },
        ],
        layout: "radio",
      },
      initialValue: "full",
    }),
    defineField({
      name: "mainMediaFit",
      title: "Main media fit",
      description:
        "Fit shows the whole picture/video with possible empty space. Fill covers the frame and may crop edges.",
      type: "string",
      options: {
        list: [
          { title: "Fit — do not crop", value: "contain" },
          { title: "Fill — crop edges if needed", value: "cover" },
        ],
        layout: "radio",
      },
      initialValue: "contain",
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
              name: "headingSize",
              title: "Heading size",
              description: "Choose how prominent this section heading should be.",
              type: "string",
              options: {
                list: [
                  { title: "Small", value: "small" },
                  { title: "Medium", value: "medium" },
                  { title: "Large", value: "large" },
                ],
                layout: "radio",
              },
              initialValue: "medium",
              hidden: ({ parent }) => !parent?.heading,
            }),
            defineField({
              name: "body",
              title: "Body (existing plain text)",
              type: "text",
              rows: 5,
              readOnly: true,
              hidden: true,
            }),
            defineField({
              name: "bodyRich",
              title: "Body",
              description:
                "Optional section copy. Select text to reveal Bold, Italic, Underline, and Strikethrough.",
              type: "richText",
            }),
            defineField({
              name: "mediaItems",
              title: "Media",
              description:
                "Add and reorder pictures, uploaded videos, GIFs, or public YouTube, Instagram, and TikTok links.",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "projectMediaItem",
                  title: "Media item",
                  fields: [
                    defineField({
                      name: "mediaType",
                      title: "Media type",
                      type: "string",
                      options: {
                        list: [
                          { title: "Picture", value: "image" },
                          { title: "Uploaded video", value: "video" },
                          { title: "Social video link", value: "socialVideo" },
                          { title: "GIF", value: "gif" },
                        ],
                        layout: "radio",
                      },
                      initialValue: "image",
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: "image",
                      title: "Picture",
                      type: "image",
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
                      type: "image",
                      options: { hotspot: true },
                      hidden: ({ parent }) => parent?.mediaType !== "video",
                    }),
                    defineField({
                      name: "socialVideoUrl",
                      title: "Social video URL",
                      description:
                        "Paste a public YouTube video/Short, Instagram post/Reel, or TikTok video URL.",
                      type: "url",
                      hidden: ({ parent }) => parent?.mediaType !== "socialVideo",
                      validation: (rule) =>
                        rule.uri({ scheme: ["http", "https"] }).custom((value, context) => {
                          if ((context.parent as { mediaType?: string })?.mediaType !== "socialVideo") return true;
                          if (!value) return "A social video URL is required.";
                          try {
                            const host = new URL(value).hostname.replace(/^www\./, "");
                            return ["youtube.com", "youtu.be", "instagram.com", "tiktok.com"].some(
                              (domain) => host === domain || host.endsWith(`.${domain}`),
                            )
                              ? true
                              : "Use a YouTube, Instagram, or TikTok URL.";
                          } catch {
                            return "Enter a valid URL.";
                          }
                        }),
                    }),
                    defineField({
                      name: "gif",
                      title: "GIF file",
                      type: "file",
                      options: { accept: "image/gif" },
                      hidden: ({ parent }) => parent?.mediaType !== "gif",
                    }),
                    defineField({
                      name: "caption",
                      title: "Caption / alt text",
                      description: "A short description for accessibility; optional for decorative media.",
                      type: "string",
                    }),
                  ],
                  preview: {
                    select: {
                      mediaType: "mediaType",
                      caption: "caption",
                      media: "image",
                    },
                    prepare({ mediaType, caption, media }) {
                      const labels: Record<string, string> = {
                        image: "Picture",
                        video: "Uploaded video",
                        socialVideo: "Social video",
                        gif: "GIF",
                      };
                      return {
                        title: caption || labels[mediaType] || "Choose a media type",
                        subtitle: labels[mediaType],
                        media,
                      };
                    },
                  },
                },
              ],
              validation: (rule) => rule.max(3),
            }),
            defineField({
              name: "images",
              title: "Previous pictures",
              description: "Existing section pictures are preserved here for compatibility.",
              type: "array",
              of: [{ type: "image", options: { hotspot: true } }],
              readOnly: true,
              hidden: true,
            }),
          ],
          preview: {
            select: {
              title: "heading",
              layout: "layout",
              media: "mediaItems.0.image",
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
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Untitled artwork",
        subtitle: subtitle || "Add medium (optional)",
        media,
      };
    },
  },
});
