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

/**
 * Open Graph for a page that is *about the person*, not about the site.
 *
 * `og:type: profile` gives consumers `profile:first_name` and
 * `profile:last_name` as separate fields instead of one title string to guess
 * at. Facebook, LinkedIn and several entity extractors read them; nothing is
 * harmed where they are ignored.
 *
 * The siteName, locale and image are repeated from the root layout on purpose:
 * a child's `openGraph` replaces the parent's rather than merging into it, so
 * omitting them here would strip the OG card off these pages.
 */
export function profileOpenGraph(path: string) {
  return {
    type: 'profile' as const,
    firstName: 'Thabang',
    lastName: 'Mashinini-Sekgoto',
    username: 'tmashininisekgoto',
    url: absoluteUrl(path),
    siteName: 'Thabang Mashinini-Sekgoto',
    locale: 'en_ZA',
    images: ['/api/og'],
  }
}
