import type { APIRoute } from 'astro';

/** robots.txt is generated so the Sitemap line always follows `site` in astro.config.mjs. */
export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL('https://drobyshevski.com');
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap-index.xml', origin).href}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
