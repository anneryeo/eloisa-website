/**
 * Embedded Sanity Studio route. Everything under /studio is handled by the
 * Studio single-page app, so this is a catch-all client route.
 */
import { NextStudio } from "next-sanity/studio";

import config from "../../../../sanity.config";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
