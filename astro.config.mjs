import { defineConfig } from "astro/config";

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

import sitemap from "@astrojs/sitemap";

import icon from "astro-icon";

import mdx from "@astrojs/mdx";

const SITE = import.meta.env.DEV
  ? "http://localhost:4321/"
  : "https://www.bowlerscaffolding.com";

// https://astro.build/config
export default defineConfig({
  base: "",
  site: SITE,
  experimental: {
    contentIntellisense: true,
  },
  trailingSlash: "always",
  integrations: [tailwind(), sitemap(), icon(), mdx()],
  vite: {
    ssr: {
      external: ["svgo"],
    },
  },
});
