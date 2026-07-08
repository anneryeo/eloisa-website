// Centralized Sanity environment values. Imported by both the Next.js app and
// the embedded Studio so there is a single source of truth.
//
// These fall back to safe placeholders when unset so the app still builds and
// runs on bundled sample data (see queries.ts). Set the real values in
// .env.local to connect a live Sanity project — the Studio requires them.

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

// `placeholder` is a syntactically valid project id, so createClient() and the
// Studio config don't throw before a real project is connected.
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

/** Server-only token; empty for public datasets. */
export const readToken = process.env.SANITY_API_READ_TOKEN || "";

/** True once a real Sanity project id is configured. */
export const isSanityConfigured = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
);
