/**
 * Seed the Sanity dataset with the site's content — artwork, journal entries,
 * FAQ items, and the About page — uploading images from a local asset folder.
 *
 * Run with the logged-in CLI user's token (needs write access):
 *
 *   SEED_ASSET_DIR=/path/to/assets npx sanity exec scripts/seed.ts --with-user-token
 *
 * Documents use deterministic ids and createOrReplace, so re-running is safe
 * and updates in place. Image files are looked up by the `file` names below.
 */
import fs from "node:fs";
import path from "node:path";

import { getCliClient } from "sanity/cli";

const ASSET_DIR = process.env.SEED_ASSET_DIR;
if (!ASSET_DIR) {
  throw new Error("Set SEED_ASSET_DIR to the folder holding the seed images.");
}

const client = getCliClient({ apiVersion: "2024-10-01" });

/** Upload one image and return an image field value referencing it. */
async function uploadImage(file: string) {
  const filePath = path.join(ASSET_DIR as string, file);
  const asset = await client.assets.upload(
    "image",
    fs.createReadStream(filePath),
    { filename: file },
  );
  return {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: asset._id },
  };
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// ---------------------------------------------------------------------------
// Artwork — Work masonry. `featured` pieces appear on the landing page.
// ---------------------------------------------------------------------------

interface ArtSeed {
  id: string;
  title: string;
  file: string;
  workType: "personal" | "professional";
  year?: number;
  medium?: string;
  featured?: boolean;
}

const ARTWORKS: ArtSeed[] = [
  // Professional — the project sheets on the board, newest first.
  { id: "adobe-2026", title: "Adobe", year: 2026, medium: "Mixed-media animation", file: "work-adobe-2026.png", workType: "professional", featured: true },
  { id: "grainy-gradients", title: "Grainy Gradient Illustrations", year: 2025, medium: "Digital illustration", file: "work-grainy-gradients.png", workType: "professional", featured: true },
  { id: "binondo-travelogue", title: "Binondo Travelogue", year: 2024, medium: "Illustrated travel zine", file: "work-binondo-travelogue.png", workType: "professional", featured: true },
  { id: "mccormick", title: "McCormick", year: 2024, medium: "Marketing research & packaging", file: "work-mccormick.png", workType: "professional" },
  { id: "island-souvenirs", title: "Island Souvenirs", year: 2023, medium: "Souvenir posters & tees", file: "work-island-souvenirs.png", workType: "professional" },
  { id: "adobe-2023", title: "Adobe", year: 2023, medium: "Commissioned artwork", file: "work-adobe-2023.png", workType: "professional", featured: true },
  { id: "36-days-of-type", title: "36 Days of Type", year: 2023, medium: "Lettering series", file: "work-36-days-of-type.png", workType: "professional", featured: true },
  { id: "yearbook", title: "Yearbook", year: 2023, medium: "Editorial design", file: "work-yearbook.png", workType: "professional" },

  // Personal — the poster grid in the middle of the board.
  { id: "full-of-trinkets", title: "Full of Trinkets", file: "art-full-of-trinkets.png", workType: "personal", featured: true },
  { id: "trinket-duck", title: "Trinket Duck", file: "art-trinket-duck.png", workType: "personal", featured: true },
  { id: "apple-girl-fruits", title: "Apple Girl", file: "art-apple-girl-fruits.png", workType: "personal" },
  { id: "aquarium", title: "Aquarium", file: "art-aquarium.png", workType: "personal", featured: true },
  { id: "hello-trinkets", title: "Hello", file: "art-hello-trinkets.png", workType: "personal" },
  { id: "jelly-desserts", title: "Jelly Desserts", file: "art-jelly-desserts.png", workType: "personal", featured: true },
  { id: "bading-na-bading", title: "Bading na Bading", file: "art-bading-na-bading.png", workType: "personal", featured: true },
  { id: "halo-halo-sundae", title: "Halo-Halo", file: "art-halo-halo-sundae.png", workType: "personal" },
  { id: "anik-anik", title: "Anik-Anik", file: "art-anik-anik.png", workType: "personal", featured: true },
  { id: "please-call", title: "For Emergencies, Please Call", file: "art-please-call.png", workType: "personal" },
  { id: "mirror-mirror", title: "Mirror, Mirror", file: "art-mirror-mirror.png", workType: "personal" },
  { id: "youre-on-your-own-kid", title: "You're On Your Own, Kid", file: "art-youre-on-your-own-kid.png", workType: "personal" },
  { id: "wonderful-time", title: "The Most Wonderful Time of the Year", file: "art-wonderful-time.png", workType: "personal" },
  { id: "whos-that-girl", title: "Who's That Girl?", file: "art-whos-that-girl.png", workType: "personal" },
  { id: "head-in-the-clouds", title: "Head in the Clouds", file: "art-head-in-the-clouds.png", workType: "personal" },
  { id: "nutcracker", title: "Nutcracker", file: "art-nutcracker.png", workType: "personal" },
  { id: "im-feeling-lucky", title: "I'm Feeling Lucky!", file: "art-im-feeling-lucky.png", workType: "personal" },
  { id: "do-it-scared", title: "Do It Scared", file: "art-do-it-scared.png", workType: "personal" },
  { id: "rotten-to-the-core", title: "Rotten to the Core", file: "art-rotten-to-the-core.png", workType: "personal" },
  { id: "pilipinas-stickers", title: "Pilipinas Stickers", file: "art-pilipinas-stickers.png", workType: "personal" },
  { id: "star-pattern", title: "Star Pattern", file: "art-star-pattern.png", workType: "personal" },
];

// ---------------------------------------------------------------------------
// Journal — campus appearances, per the Journal comp and its detail boards.
// ---------------------------------------------------------------------------

interface JournalSeed {
  id: string;
  title: string;
  year: number;
  role: string;
  cover: string;
  gallery: string[];
  blurb?: string;
  note?: string;
}

const JOURNAL: JournalSeed[] = [
  {
    id: "dlsu-2023",
    title: "DLSU",
    year: 2023,
    role: "Speaker; AdCreate Society",
    cover: "journal-dlsu-cover.png",
    gallery: ["journal-dlsu-1.png", "journal-dlsu-2.png"],
    blurb: "Monster Academy: Illustrator 101. DLSU AdCreate Society",
    note: "This was my first discussion evah!",
  },
  {
    id: "ateneo-2024",
    title: "ATENEO",
    year: 2024,
    role: "Panel Discussion",
    cover: "journal-ateneo-cover.png",
    gallery: ["journal-ateneo-1.png", "journal-ateneo-2.png", "journal-ateneo-3.png"],
    blurb:
      "Exploring Art Market & Fairs in College Campuses. Panel discussion moderated by Cyrene Cacdac & Jacob Arabes",
    note: "Such a special moment for me! Although this was just a small panel discussion, I had friends from high school, senior high—even one I met through online CETs prep—college, and work gathered together in one room. Really wasn't expecting them to sign up. This day reminded me so much how so many support my journey 🥺 so heart warming",
  },
  {
    id: "mapua-manila-2025",
    title: "MAPUA Manila",
    year: 2025,
    role: "Guest Judge",
    cover: "journal-mapua-manila-cover.png",
    gallery: ["journal-mapua-manila-1.png", "journal-mapua-manila-2.png"],
    blurb: "Guest judge for Orgs in Frame during Orgs' Week 2025, Mapúa University Council of Organizations",
  },
  {
    id: "mapua-laguna-2025",
    title: "MAPUA Laguna",
    year: 2025,
    role: "Guest Judge",
    cover: "journal-mapua-laguna-cover.png",
    gallery: [
      "journal-mapua-laguna-1.png",
      "journal-mapua-laguna-2.png",
      "journal-mapua-laguna-3.png",
      "journal-mapua-laguna-4.png",
    ],
    blurb: "See Saw — A Multimedia Arts Seminar and Exhibit, July 2025",
  },
  {
    id: "pup-2026",
    title: "PUP",
    year: 2026,
    role: "Guest Judge",
    cover: "journal-pup-cover.png",
    gallery: ["journal-pup-1.png"],
    blurb: "Brand Prix: Zone — Marketing the Goal, Owning the Zone",
  },
];

// ---------------------------------------------------------------------------
// FAQ + About — copy transcribed from the comps.
// ---------------------------------------------------------------------------

const FAQS = [
  {
    id: "faq-design-career",
    question: "How did you start your design career?",
    answer:
      "I've always considered myself an artistic child, but it only was when I entered senior of high school did I learn that I can monetize my work. We were doing a lot of presentations and brand books at that time (I have a background in Business Management & Marketing) and I was often the one doing the designs for it and I fell in love with the process. :~)",
  },
  {
    id: "faq-degree",
    question: "Do I need a degree in design?",
    answer:
      "Imo, not necessarily! As mentioned, I have a background in business so my whole curriculum wasn't entirely catered to design and branding. Although I didn't have the edge of similar connections to my design peers at that time, it only made me strive harder to be more outgoing and take lots of coffee chats.",
  },
];

/** Portable Text paragraph helper; `em` spans are italicized handles. */
function paragraph(key: string, spans: [text: string, em?: boolean][]) {
  return {
    _type: "block",
    _key: key,
    style: "normal",
    markDefs: [],
    children: spans.map(([text, em], index) => ({
      _type: "span",
      _key: `${key}-${index}`,
      text,
      marks: em ? ["em"] : [],
    })),
  };
}

const ABOUT_BIO = [
  paragraph("bio-1", [
    [
      "I've always been inspired by colorful things, from Lisa Frank coloring books and Sailor Moon reruns to the wild ads and groovy typography of the 60s & 70s. I could absolutely barf color.",
    ],
  ]),
  paragraph("bio-2", [
    ["You may know me as "],
    ["eloisaclaireart", true],
    [", but over the years, "],
    ["eloisaclairedesign", true],
    [
      " emerged as a way to merge my playful visual world with my marketing background—creating work that's colorful, strategic, and rooted in storytelling.",
    ],
  ]),
];

// ---------------------------------------------------------------------------

async function run() {
  console.log(`Seeding ${client.config().projectId}/${client.config().dataset}…`);

  let order = 0;
  for (const art of ARTWORKS) {
    const image = await uploadImage(art.file);
    order += 10;
    await client.createOrReplace({
      _id: `artwork-${art.id}`,
      _type: "artwork",
      title: art.title,
      slug: { _type: "slug", current: slugify(`${art.title}-${art.year ?? art.id}`) },
      mediaType: "image",
      image,
      workType: art.workType,
      year: art.year,
      medium: art.medium,
      featured: art.featured ?? false,
      order,
    });
    console.log(`artwork ✓ ${art.title}`);
  }

  order = 0;
  for (const entry of JOURNAL) {
    const coverImage = await uploadImage(entry.cover);
    const gallery = [];
    for (const file of entry.gallery) {
      const image = await uploadImage(file);
      gallery.push({ ...image, _key: file.replace(/\W+/g, "-") });
    }
    order += 10;
    await client.createOrReplace({
      _id: `journal-${entry.id}`,
      _type: "journalEntry",
      title: entry.title,
      slug: { _type: "slug", current: entry.id },
      year: entry.year,
      role: entry.role,
      coverImage,
      gallery,
      blurb: entry.blurb,
      note: entry.note,
      order,
    });
    console.log(`journal ✓ ${entry.title}, ${entry.year}`);
  }

  order = 0;
  for (const faq of FAQS) {
    order += 10;
    await client.createOrReplace({
      _id: faq.id,
      _type: "faqItem",
      question: faq.question,
      answer: faq.answer,
      order,
    });
    console.log(`faq ✓ ${faq.question}`);
  }

  const portrait = await uploadImage("about-portrait.png");
  await client.createOrReplace({
    _id: "aboutPage",
    _type: "aboutPage",
    heading: "Hi, I'm Eloisa Claire",
    portrait,
    bio: ABOUT_BIO,
  });
  console.log("about ✓");

  console.log("Done.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
