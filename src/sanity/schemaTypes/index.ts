import type { SchemaTypeDefinition } from "sanity";

import { artwork } from "./artwork";
import { category } from "./category";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [artwork, category],
};
