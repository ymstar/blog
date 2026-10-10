import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://ymstar.cn',
  adapter: vercel(),
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
