import { defineCliConfig } from "sanity/cli";

import { dataset, projectId } from "@/sanity/env";

/** Used by the `sanity` CLI (e.g. deploying schema, managing datasets). */
export default defineCliConfig({
  api: { projectId, dataset },
  autoUpdates: true,
});
