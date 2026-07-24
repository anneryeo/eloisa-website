import path from "node:path";

import { defineCliConfig } from "sanity/cli";

import { dataset, projectId } from "@/sanity/env";

/** Used by the `sanity` CLI (e.g. deploying schema, managing datasets). */
export default defineCliConfig({
  api: { projectId, dataset },
  deployment: { autoUpdates: true, appId: "vuz6byj3k0z8scc6ru7p8owp" },
  vite: (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        "@": path.resolve(__dirname, "src"),
      },
    },
  }),
});
