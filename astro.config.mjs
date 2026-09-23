// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  // Public URL, used for absolute links such as hreflang alternates.
  site: 'https://tuulai.pages.dev',
  // Fully static build; Cloudflare Pages serves the generated `dist/` folder.
  output: 'static',
  integrations: [mdx()],
});
