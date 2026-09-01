# Content model (Sanity)

Content lives in **Sanity**, a headless CMS. There is no traditional database to run — Sanity hosts the content and serves media from its global CDN. The client-facing editor is [eloisa.sanity.studio](https://eloisa.sanity.studio/). The `/studio` route is a secondary copy for development and emergency access.

## Creating a Sanity project

1. Sign in / up at <https://www.sanity.io/manage>.
2. Create a new project, then create a dataset named `production` (public is fine for a portfolio).
3. Copy the **Project ID** into `.env.local`:

   ```bash
   NEXT_PUBLIC_SANITY_PROJECT_ID="<your id>"
   NEXT_PUBLIC_SANITY_DATASET="production"
   ```

4. Restart `npm run dev` and open <http://localhost:3000/studio> to start adding work.

> The schema is defined in code (`src/sanity/schemaTypes/`), not in the Sanity UI. Deploy the standalone Studio separately with `npx sanity deploy --yes --schema-required`; deploying the Next.js site alone does not update `eloisa.sanity.studio`.

## Schema types

### `artwork`

The core piece. Media is one of four kinds, chosen by the **Media type** field:

| Media type | Field    | Delivery                                                              |
| ---------- | -------- | -------------------------------------------------------------------- |
| `image`    | `image`  | Sanity image pipeline — hotspot crop, on-the-fly resize/format       |
| `video`    | `video` + `poster` | File asset streamed from the CDN, with a still poster      |
| `socialVideo` | `socialVideoUrl` | Embedded public YouTube video/Short, Instagram post/Reel, or TikTok video |
| `gif`      | `gif`    | File asset (kept as a file so animation is preserved)                |

Other fields: `title`, `slug`, `year`, `medium`, `dimensions`, formatted descriptions, `featured` (surface on the front gallery), and `order` (sort — lower first). Legacy category and Personal/Professional values remain stored for compatibility but are no longer shown to editors.

To add a social preview, choose **Social video link**, paste the public post URL, and publish. Use the canonical browser URL—not a creator profile, shortened Instagram redirect, or private post. The site validates supported hosts and turns the URL into an embedded player.

For more than one media item, add a **Case study section**, choose its layout, then add up to three items under **Media**. Each section can mix pictures, uploaded MP4/WebM videos, GIFs, and supported social-video links. Add more sections when a project needs more than three items or a different layout.

## Why media is modeled this way

- **Images** go through Sanity's transform pipeline so the site can request exactly the sizes it needs — the source stays high-resolution while the browser gets a lean AVIF/WebP.
- **GIFs** are stored as **file** assets, not images. The image pipeline would flatten them to a single frame; as a file, the animation survives.
- **Videos** are file assets with a separate poster still, so the gallery shows a crisp frame instantly and streams the clip on play.
- **Social videos** stay hosted by YouTube, Instagram, or TikTok. Their privacy settings, availability, cookies, and platform embed rules still apply.

## How the site reads content

- `src/sanity/client.ts` — the read client (`useCdn: true` for fast, cached reads).
- `src/sanity/queries.ts` — GROQ query for featured artworks + a typed return. Falls back to `src/sanity/sampleData.ts` when no project is configured.
- `src/sanity/image.ts` — builds CDN image URLs (`urlForImage(...)`).

To change what the gallery shows, edit the GROQ query in `queries.ts`.

## Media size guidance

- Upload the **highest-quality masters** you have — downscaling happens on delivery, so bigger sources mean sharper results at every size.
- Videos: prefer `.mp4` (H.264) or `.webm`; keep gallery loops short and muted.
- There's no need to pre-resize images; the pipeline handles it.
