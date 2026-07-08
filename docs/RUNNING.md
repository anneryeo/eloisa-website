# Running locally

## Prerequisites

- **Node.js 18.18+** (Node 20 or 22 LTS recommended)
- **npm** (bundled with Node)

## First-time setup

```bash
npm install
cp .env.local.example .env.local
```

Then open `.env.local` and fill in your Sanity values (see [DATABASE.md](DATABASE.md) for how to get a project). The site runs on **sample data** until these are set, so you can preview the gallery immediately.

## Scripts

| Command          | What it does                                             |
| ---------------- | -------------------------------------------------------- |
| `npm run dev`    | Start the dev server at <http://localhost:3000>          |
| `npm run build`  | Production build                                         |
| `npm run start`  | Serve the production build (run `build` first)           |
| `npm run lint`   | ESLint (Next.js core-web-vitals + TypeScript rules)      |
| `npm run typecheck` | Type-check without emitting                           |

## URLs in development

- **Site** — <http://localhost:3000>
- **Sanity Studio** — <http://localhost:3000/studio> (content editor, embedded in the app)

## Environment variables

| Variable                          | Required | Notes                                              |
| --------------------------------- | -------- | -------------------------------------------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`   | Yes\*    | From sanity.io/manage. \*Sample data used if unset |
| `NEXT_PUBLIC_SANITY_DATASET`      | Yes\*    | Usually `production`                               |
| `NEXT_PUBLIC_SANITY_API_VERSION`  | No       | Defaults to `2024-10-01`                           |
| `SANITY_API_READ_TOKEN`           | No       | Only for previewing drafts / private datasets      |

`NEXT_PUBLIC_*` values are exposed to the browser by design (they identify the dataset, not secrets). Never add `NEXT_PUBLIC_` to a token.

## Troubleshooting

- **Gallery shows placeholder tiles** — expected until Sanity env vars are set. Add them to `.env.local` and restart `npm run dev`.
- **Images don't load from Sanity** — confirm `cdn.sanity.io` is allowed in `next.config.mjs` (it is by default) and that the project ID is correct.
- **Studio won't load** — the Studio needs valid `projectId`/`dataset`; it can't run on sample data.
