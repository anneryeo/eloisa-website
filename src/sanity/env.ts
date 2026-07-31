// Centralized Sanity environment values. Imported by both the Next.js app and
// the embedded Studio so there is a single source of truth.
//
// The project ID and dataset are public identifiers, so defaults keep the
// deployed site and embedded Studio connected even when Vercel environment
// variables have not been configured yet. Environment variables still allow
// preview deployments to point at another Sanity project or dataset.

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "vaq3w914";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

/** Server-only token; empty for public datasets. */
export const readToken = process.env.SANITY_API_READ_TOKEN || "";

/** True when the app has a usable Sanity project configuration. */
export const isSanityConfigured = projectId !== "placeholder";
