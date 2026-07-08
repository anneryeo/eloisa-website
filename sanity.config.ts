"use client";

/**
 * Configuration for the Studio mounted at /studio inside the Next.js app.
 * Editors manage all content here; the site reads it via the Sanity CDN.
 */
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "@/sanity/env";
import { schema } from "@/sanity/schemaTypes";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool(),
    // Vision lets you run GROQ queries against your dataset from the Studio.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
