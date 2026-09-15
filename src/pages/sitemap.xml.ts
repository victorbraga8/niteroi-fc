import type { APIRoute } from 'astro'

/**
 * The site is a single page, so the sitemap is written here rather than pulled
 * in as an integration: one route, one source of truth for the URL, and a
 * lastmod that is stamped at build time instead of going stale in a static
 * file. If the site ever grows past a handful of routes, swap this for
 * @astrojs/sitemap.
 */
export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL('https://niteroiensefc.vercel.app')
  const lastmod = new Date().toISOString().slice(0, 10)

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${new URL('/', origin).href}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
