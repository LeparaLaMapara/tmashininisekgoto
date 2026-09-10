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
 * The card image every share preview falls back to, as a full OG image object.
 *
 * The dimensions are declared rather than left for the consumer to work out.
 * Facebook, LinkedIn and WhatsApp decide whether to render a large card or a
 * small thumbnail before the image finishes downloading, and with no width and
 * height to read they guess. Declaring the real 1200x630 is what makes the
 * large card appear on the first scrape rather than the second.
 *
 * `alt` matters for the reason alt text always does: a share card is an image,
 * and LinkedIn and Mastodon announce it to screen readers.
 */
export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630

export function ogImages(alt: string, title?: string, subtitle?: string) {
  const params = new URLSearchParams()
  if (title) params.set('title', title)
  if (subtitle) params.set('subtitle', subtitle)
  const query = params.toString()

  return [
    {
      url: `${SITE_URL}/api/og${query ? `?${query}` : ''}`,
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      alt,
      type: 'image/png',
    },
  ]
}

/**
 * Open Graph for an ordinary page.
 *
 * Exists because `og:url` cannot be added on its own. A child's `openGraph`
 * replaces the parent's rather than merging into it, so a route declaring only
 * `{ url }` would lose the site name, the locale and the card image. This
 * returns the whole object so a route can name itself without losing them.
 *
 * `title` and `description` are deliberately absent: Next fills them from the
 * route's own `title` and `description`, so repeating them here would be a
 * second place to keep in step.
 */
export function pageOpenGraph(path: string, imageAlt: string) {
  return {
    type: 'website' as const,
    url: absoluteUrl(path),
    siteName: 'Thabang Mashinini-Sekgoto',
    locale: 'en_ZA',
    images: ogImages(imageAlt),
  }
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
    images: ogImages('Thabang Mashinini-Sekgoto, Data Scientist and AI Engineer'),
  }
}
