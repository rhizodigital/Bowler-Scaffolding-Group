import type { CollectionEntry } from "astro:content";
import { NEWS_CATEGORIES, RELATED_SERVICES } from "@config";

export type NewsEntry = CollectionEntry<"news">;
export type CaseStudiesEntry = CollectionEntry<"caseStudies">;
export type Entry = NewsEntry | CaseStudiesEntry;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number];
export type RelatedService = (typeof RELATED_SERVICES)[number];

export type Site = {
  author: string;
  description: string;
  title: string;
  caseStudies: {
    base: string;
    perPage: number;
  };
  news: {
    base: string;
    perPage: number;
  };
};
