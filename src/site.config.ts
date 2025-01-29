import type { CollectionEntry } from "astro:content";

export type NewsEntry = CollectionEntry<"news">;
export type CaseStudiesEntry = CollectionEntry<"caseStudies">;
export type Entry = NewsEntry | CaseStudiesEntry;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number];
export type RelatedService = (typeof RELATED_SERVICES)[number];

export type Site = {
  author: string;
  name: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
  caseStudies: {
    base: string;
    perPage: number;
  };
  news: {
    base: string;
    perPage: number;
  };
};

export const SITE: Site = {
  author: "Michael Sables",
  name: "Bowler Scaffolding Group",
  description: "A portfolio site template for built with Astro",
  image: {
    src: "/og/social-image.png",
    alt: "Bowlers Scaffolding Group",
  },
  caseStudies: {
    base: "work",
    perPage: 6,
  },
  news: {
    base: "news-insights",
    perPage: 6,
  },
};

export const RELATED_SERVICES = [
  "Domestic Scaffolding",
  "Commercial Scaffolding",
  "Industrial Scaffolding",
  "Specialist Scaffolding",
] as const;

export const NEWS_CATEGORIES = [
  "Company News",
  "Industry News",
  "Technology",
  "Events",
] as const;
