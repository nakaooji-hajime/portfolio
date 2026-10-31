import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://nakaooji-hajime.github.io',
  base: '/portfolio',
  integrations: [mdx()],
  vite: { plugins: [tailwindcss()] },
});
