import type { SchemaTypeDefinition } from "sanity";

import { aboutPage } from "./aboutPage";
import { artwork } from "./artwork";
import { category } from "./category";
import { faqItem } from "./faqItem";
import { journalEntry } from "./journalEntry";
import { richText } from "./richText";
import { siteSettings } from "./siteSettings";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    richText,
    artwork,
    category,
    journalEntry,
    faqItem,
    aboutPage,
    siteSettings,
  ],
};
