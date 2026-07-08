import type { Artwork } from "./queries";

/**
 * Placeholder pieces so the gallery has something to render before a Sanity
 * project is connected. Images are lightweight inline SVG data URIs — no
 * network needed. Replace by adding real artworks in the Studio.
 */
function placeholder(label: string, bg: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000"><rect width="800" height="1000" fill="${bg}"/><text x="50%" y="50%" fill="#111" font-family="sans-serif" font-size="34" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const sampleArtworks: Artwork[] = [
  {
    _id: "sample-1",
    title: "Untitled I",
    slug: "untitled-i",
    mediaType: "image",
    fileUrl: placeholder("Sample piece 01", "#f4f1ec"),
    year: 2025,
    medium: "Oil on canvas",
    dimensions: "120 × 90 cm",
    description: "Placeholder — connect Sanity to replace with real work.",
  },
  {
    _id: "sample-2",
    title: "Untitled II",
    slug: "untitled-ii",
    mediaType: "image",
    fileUrl: placeholder("Sample piece 02", "#eef0f2"),
    year: 2025,
    medium: "Digital",
    dimensions: "Variable",
  },
  {
    _id: "sample-3",
    title: "Untitled III",
    slug: "untitled-iii",
    mediaType: "image",
    fileUrl: placeholder("Sample piece 03", "#f0ece9"),
    year: 2024,
    medium: "Mixed media",
    dimensions: "100 × 100 cm",
  },
  {
    _id: "sample-4",
    title: "Untitled IV",
    slug: "untitled-iv",
    mediaType: "image",
    fileUrl: placeholder("Sample piece 04", "#edeef0"),
    year: 2024,
    medium: "Acrylic on panel",
    dimensions: "80 × 60 cm",
  },
];
