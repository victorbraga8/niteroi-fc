// @ts-check
import { defineConfig, fontProviders } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://niteroiensefc.com.br',
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      // Stand-in for Geoform (official display face of the club brand manual):
      // a wide grotesque with a full weight range, so the regressive-weight
      // wordmark (NI heavy -> FC light) stays reproducible on the web.
      provider: fontProviders.google(),
      name: 'Archivo',
      cssVariable: '--font-display',
      weights: ['400 900'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Arial Narrow', 'Helvetica Neue', 'sans-serif'],
    },
    {
      // Stand-in for Creato Display (official text face): geometric humanist.
      provider: fontProviders.google(),
      name: 'Manrope',
      cssVariable: '--font-text',
      weights: ['400 800'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Segoe UI', 'Helvetica Neue', 'sans-serif'],
    },
  ],
})
