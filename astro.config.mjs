import { defineConfig } from "astro/config";

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

import sitemap from "@astrojs/sitemap";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://www.miltonkeynesscaffolding.co.uk",
  integrations: [tailwind(), sitemap(), icon()],
  vite: {
    ssr: {
      external: ["svgo"],
    },
  },
});
