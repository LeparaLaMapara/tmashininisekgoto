/**
 * The production origin, in one place.
 *
 * Everything that emits an absolute URL reads from here: metadataBase and the
 * per-route canonicals, the sitemap, robots.txt, the RSS feed, llms.txt and the
 * OG card. Before this existed the value was copied into six files as
 * `https://tmashininisekgoto.vercel.app`, so the whole site canonicalised
 * itself onto the preview domain.
 *
 * If the domain ever changes, change it here and nowhere else.
 */
export const SITE_URL = 'https://www.tmashininisekgoto.com'

/** Absolute URL for a site-relative path. `absoluteUrl('/blog')` -> `https://www.…/blog` */
export function absoluteUrl(path = '/'): string {
  return path === '/' ? SITE_URL : `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
