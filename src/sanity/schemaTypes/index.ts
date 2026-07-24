import type { SchemaTypeDefinition } from "sanity";

import { aboutPage } from "./aboutPage";
import { artwork } from "./artwork";
import { category } from "./category";
import { faqItem } from "./faqItem";
import { journalEntry } from "./journalEntry";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [artwork, category, journalEntry, faqItem, aboutPage],
};
