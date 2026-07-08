import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // `useCdn` serves cached, fast responses from Sanity's edge. Turn off only
  // when you need guaranteed-fresh data (e.g. server-side draft preview).
  useCdn: true,
  perspective: "published",
});
