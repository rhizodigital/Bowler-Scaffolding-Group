import type { Site } from "./env";

export const SITE: Site = {
  author: "Michael Sables",
  description: "A portfolio site template for built with Astro",
  title: "Portfolio site",
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
