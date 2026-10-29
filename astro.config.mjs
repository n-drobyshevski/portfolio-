import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Replace with the real domain before deploying. (A literal "https://[yourdomain].com" is not a valid URL,
// so the placeholder is "yourdomain.com".) For GitHub Pages under a sub-path also set `base`.
export default defineConfig({
  site: 'https://yourdomain.com',
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
