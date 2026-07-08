# Content model (Sanity)

Content lives in **Sanity**, a headless CMS. There is no traditional database to run — Sanity hosts the content and serves media from its global CDN. You edit content in the Studio at `/studio`.

## Creating a Sanity project

1. Sign in / up at <https://www.sanity.io/manage>.
2. Create a new project, then create a dataset named `production` (public is fine for a portfolio).
3. Copy the **Project ID** into `.env.local`:

   ```bash
   NEXT_PUBLIC_SANITY_PROJECT_ID="<your id>"
   NEXT_PUBLIC_SANITY_DATASET="production"
   ```

4. Restart `npm run dev` and open <http://localhost:3000/studio> to start adding work.

> The schema is defined in code (`src/sanity/schemaTypes/`), not in the Sanity UI. Deploying the app deploys the schema.

## Schema types

### `artwork`

The core piece. Media is one of three kinds, chosen by the **Media type** field:

| Media type | Field    | Delivery                                                              |
| ---------- | -------- | -------------------------------------------------------------------- |
| `image`    | `image`  | Sanity image pipeline — hotspot crop, on-the-fly resize/format       |
| `video`    | `video` + `poster` | File asset streamed from the CDN, with a still poster      |
| `gif`      | `gif`    | File asset (kept as a file so animation is preserved)                |

Other fields: `title`, `slug`, `category` (reference), `year`, `medium`, `dimensions`, `description`, `featured` (surface on the front gallery), `order` (sort — lower first).

### `category`

A grouping (series / medium / collection): `title`, `slug`, `description`.

## Why media is modeled this way

- **Images** go through Sanity's transform pipeline so the site can request exactly the sizes it needs — the source stays high-resolution while the browser gets a lean AVIF/WebP.
- **GIFs** are stored as **file** assets, not images. The image pipeline would flatten them to a single frame; as a file, the animation survives.
- **Videos** are file assets with a separate poster still, so the gallery shows a crisp frame instantly and streams the clip on play.

## How the site reads content

- `src/sanity/client.ts` — the read client (`useCdn: true` for fast, cached reads).
- `src/sanity/queries.ts` — GROQ query for featured artworks + a typed return. Falls back to `src/sanity/sampleData.ts` when no project is configured.
- `src/sanity/image.ts` — builds CDN image URLs (`urlForImage(...)`).

To change what the gallery shows, edit the GROQ query in `queries.ts`.

## Media size guidance

- Upload the **highest-quality masters** you have — downscaling happens on delivery, so bigger sources mean sharper results at every size.
- Videos: prefer `.mp4` (H.264) or `.webm`; keep gallery loops short and muted.
- There's no need to pre-resize images; the pipeline handles it.
