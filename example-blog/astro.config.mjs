import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  output: "server",
  site: "https://appwrite-demos-for-astro-blog.vercel.app",
  integrations: [mdx(), sitemap()],
  adapter: vercel(),
});
