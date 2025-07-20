import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import UnoCSS from "@unocss/astro";
import icon from "astro-icon";

export default defineConfig({
  integrations: [
    UnoCSS({
      injectReset: true  // This injects the CSS reset
    }),
    svelte(),
    mdx(),
    sitemap(),
    icon()
  ],
  site: "https://kusamaxi.com",
  vite: {
    ssr: {
      external: ["svgo"]
    }
  }
});
