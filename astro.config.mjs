import { defineConfig } from "astro/config";

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

import sitemap from "@astrojs/sitemap";

import icon from "astro-icon";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://www.miltonkeynesscaffolding.co.uk",
  trailingSlash: "always",
  integrations: [tailwind(), sitemap(), icon(), mdx()],
  vite: {
    ssr: {
      external: ["svgo"],
    },
  },
});
