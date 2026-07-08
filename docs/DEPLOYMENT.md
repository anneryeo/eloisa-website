# Deployment

The site deploys to **Vercel**; content is served by **Sanity**. Nothing else to host.

## Why Vercel

Next.js is Vercel's own framework, so image optimization (`next/image`), edge caching, and incremental static regeneration work with zero configuration. Sanity's CDN delivers the heavy art assets, so Vercel mostly serves the fast app shell.

## Deploy the site

1. Push this repo to GitHub/GitLab/Bitbucket.
2. In <https://vercel.com>, **Import Project** and select the repo. Vercel auto-detects Next.js — no build settings to change.
3. Add environment variables (Project → Settings → Environment Variables):

   | Variable                         | Value                      |
   | -------------------------------- | -------------------------- |
   | `NEXT_PUBLIC_SANITY_PROJECT_ID`  | your Sanity project ID     |
   | `NEXT_PUBLIC_SANITY_DATASET`     | `production`               |
   | `NEXT_PUBLIC_SANITY_API_VERSION` | `2024-10-01` (optional)    |
   | `SANITY_API_READ_TOKEN`          | only if using draft preview |

4. Deploy. The embedded Studio ships with the app at `https://<your-domain>/studio`.

## Connect the Studio's CORS

For the hosted Studio to talk to your dataset, add your domain(s) to Sanity's CORS origins at <https://www.sanity.io/manage> → API → CORS origins:

- `http://localhost:3000` (local dev)
- `https://<your-domain>` (production)
- your Vercel preview domain(s) if you use the Studio there

Allow credentials only if you use a token.

## Content updates

- Editors publish in the Studio; the site revalidates the gallery hourly (`revalidate = 3600` in `src/app/page.tsx`).
- For instant updates, lower `revalidate` or wire a Sanity webhook to Vercel's Deploy Hook / On-Demand Revalidation (future enhancement).

## Custom domain

Add it in Vercel → Settings → Domains, then update DNS as instructed. Remember to add the domain to Sanity CORS (above).

## Alternative host (Cloudflare)

Cloudflare Pages can run Next.js via the `@cloudflare/next-on-pages` adapter, but `next/image` optimization needs a workaround (Cloudflare Images or `unoptimized`). Vercel is the recommended path for this project; revisit Cloudflare only if you specifically need its network or pricing.
