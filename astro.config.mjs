// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // `site` habilita canonical/sitemap correctos y es requerido por @astrojs/sitemap.
  // Debe coincidir con SITE_URL en src/global/global.constants.ts.
  site: 'https://gsslatam.com',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});
