import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Production domain. For GitHub Pages under a sub-path also set `base`.
export default defineConfig({
  site: 'https://drobyshevski.com',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en-GB', fr: 'fr-FR' } },
    }),
  ],
});
