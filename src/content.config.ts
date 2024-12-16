import { z, defineCollection, reference } from "astro:content";
import { glob, file } from "astro/loaders";
import { RELATED_SERVICES, NEWS_CATEGORIES } from "@config";

const authorsCollection = defineCollection({
  loader: file("./src/data/authors/authors.json"),
  schema: ({ image }) =>
    z
      .object({
        id: z.string(),
        name: z.string(),
        bio: z.string().optional(),
        role: z.string().optional(),
        twitter: z.string().url().optional(),
        linkedin: z.string().url().optional(),
        instagram: z.string().url().optional(),
        image: image(),
      })
      .strict(),
});

const newsCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/data/news" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      authors: z.array(reference("authors")).optional(),
      publishDate: z.coerce.date(),
      description: z.string().min(150).max(200),
      draft: z.boolean().optional(),
      categories: z.array(z.enum(NEWS_CATEGORIES)).default([]),
      coverImage: image(),
      coverImageAlt: z.string().optional(),
    }),
});

const caseStudiesCollection = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/data/caseStudies",
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().min(150).max(200),
      publishDate: z.coerce.date(),
      draft: z.boolean().optional(),
      relatedServices: z.enum(RELATED_SERVICES).array().default([]),
      client: z.string().optional(),
      clientLogo: image().optional(),
      coverImage: image(),
      coverImageAlt: z.string().optional(),
    }),
});

export const collections = {
  news: newsCollection,
  caseStudies: caseStudiesCollection,
  authors: authorsCollection,
};

export interface Link {
  href: string;
  text: string;
}

export interface CardContent {
  heading: string;
  text: string;
  image?: string;
  href?: string;
}
