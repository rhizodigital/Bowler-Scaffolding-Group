import slugify from "slugify";

export const generateTaxonomies = (array: string[]) => {
  return array
    .map((taxonomy) => {
      return {
        name: taxonomy,
        slug: slugify(taxonomy, {
          lower: true,
          strict: true,
          locale: "en",
          trim: true,
        }),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
};
