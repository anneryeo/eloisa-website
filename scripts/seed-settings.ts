/**
 * Seed (or refresh) the Site settings singleton — sidebar wordmark frames,
 * bio, footer lines, and Journal intro. Kept separate from seed.ts so chrome
 * can be re-seeded without re-uploading the whole artwork catalogue.
 *
 *   SEED_ASSET_DIR=/path/to/assets npx sanity exec scripts/seed-settings.ts --with-user-token
 *
 * Expects the wordmark frames in `${SEED_ASSET_DIR}/wordmarks/*.png`.
 */
import fs from "node:fs";
import path from "node:path";

import { getCliClient } from "sanity/cli";

const ASSET_DIR = process.env.SEED_ASSET_DIR;
if (!ASSET_DIR) {
  throw new Error("Set SEED_ASSET_DIR to the folder holding the seed images.");
}

const client = getCliClient({ apiVersion: "2024-10-01" });

/**
 * Cycle order — the classic handwritten mark and the pink hearts version.
 * The other lettering studies on the board only exist at thumbnail size, so
 * they stay out until crisp exports are uploaded through the Studio.
 */
const FRAME_FILES = [
  "wordmark-handwritten.png",
  "wordmark-pink-script.png",
];

async function run() {
  const frames = [];
  for (const file of FRAME_FILES) {
    const asset = await client.assets.upload(
      "image",
      fs.createReadStream(path.join(ASSET_DIR as string, "wordmarks", file)),
      { filename: file },
    );
    frames.push({
      _type: "image" as const,
      _key: file.replace(/\W+/g, "-"),
      asset: { _type: "reference" as const, _ref: asset._id },
    });
    console.log(`frame ✓ ${file}`);
  }

  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    wordmarkFrames: frames,
    wordmarkInterval: 1.6,
    bio: "Eloisa Claire is a marketing-led graphic designer and creative storyteller focused on colorful visual direction and campaign-driven design based in Manila, Philippines.",
    footerHandle: "eloisaclairedesign",
    footerWebsite: "eloisaclaire.com",
    footerEmail: "hello@eloisaclaire.com",
    journalIntro: [
      "From workshops to campus talks, Eloisa Claire loves showing up for student communities.",
      "As a student herself she enjoys sharing lessons, experiences, and creative insights that encourage fellow students to pursue bold ideas and colorful careers.",
      "Click to see what she's been up to recently ˙ᵕ˙",
    ],
  });
  console.log("siteSettings ✓");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
