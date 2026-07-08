# Eloisa — Art Portfolio

A minimalist art portfolio built for high-resolution imagery, video, GIFs, and motion. The homepage is a large gallery; individual pieces are managed through a headless CMS.

## Stack

| Layer      | Choice                     | Why                                                                                     |
| ---------- | -------------------------- | --------------------------------------------------------------------------------------- |
| Framework  | **Next.js 15 (App Router)**| `next/image` gives responsive AVIF/WebP, lazy-load, and blur placeholders out of the box |
| Language   | **TypeScript**             | Type-safe schema + components                                                           |
| Styling    | **Tailwind CSS**           | Minimalist white design system, utility-driven                                          |
| Motion     | **Framer Motion**          | Hover, mouse, and per-piece animations                                                  |
| CMS        | **Sanity**                 | On-the-fly image transforms, hotspot/crop, video + GIF assets, real-time editing        |
| Host       | **Vercel**                 | First-party Next.js image optimization + edge caching, zero-config deploys              |

## Quick start

```bash
npm install
cp .env.local.example .env.local   # then fill in your Sanity project values
npm run dev
```

- App: <http://localhost:3000>
- Sanity Studio (embedded): <http://localhost:3000/studio>

## Documentation

- [docs/RUNNING.md](docs/RUNNING.md) — local development, scripts, environment variables
- [docs/DATABASE.md](docs/DATABASE.md) — Sanity content model, schemas, media handling
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — deploying to Vercel + Sanity

## Project layout

```
src/
  app/            Next.js App Router (pages, layout, embedded Studio)
  components/     Gallery + media rendering (image/video/gif)
  sanity/         Client, image builder, schema types
docs/             Setup & operations docs
```

## Status

Starter scaffold. The gallery renders sample data until a Sanity project is connected. Sectional / piece-by-piece design is intentionally left open.
