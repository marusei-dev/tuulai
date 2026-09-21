// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  // Fully static build; Cloudflare Pages serves the generated `dist/` folder.
  output: 'static',
  integrations: [mdx()],
});
