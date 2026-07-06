// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://flotlife.no',
  output: 'static',
  trailingSlash: 'always',

  redirects: {
    '/': '/no/',
  },

  i18n: {
    defaultLocale: 'no',
    locales: ['no', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
