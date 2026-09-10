import { test, expect } from '@playwright/test'

/**
 * Every URL that can be shared has to produce a real preview card.
 *
 * This exists because the failure is invisible from inside the site. A post
 * with a broken card looks perfect in a browser and only reveals itself when
 * someone pastes the link into LinkedIn and gets a bare blue underline. By
 * then it is public and cached.
 *
 * The blog list is not hard coded. It comes from the sitemap, so a post
 * published next year is covered by these assertions the day it ships without
 * anyone remembering to add it here.
 */

const SITE_ORIGIN = 'https://www.tmashininisekgoto.com'

/** Meta content by property or name, read out of the raw server HTML. */
function meta(html: string, key: string): string | null {
  const pattern = new RegExp(
    `<meta[^>]*(?:property|name)="${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*content="([^"]*)"`,
    'i'
  )
  const byPropertyFirst = html.match(pattern)
  if (byPropertyFirst) return decode(byPropertyFirst[1])

  // Next emits `content` before `property` in some orders.
  const reversed = new RegExp(
    `<meta[^>]*content="([^"]*)"[^>]*(?:property|name)="${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`,
    'i'
  )
  const match = html.match(reversed)
  return match ? decode(match[1]) : null
}

function decode(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

/** Production URLs in metadata point at the real origin; tests run locally. */
function toLocalPath(url: string): string {
  return url.startsWith(SITE_ORIGIN) ? url.slice(SITE_ORIGIN.length) || '/' : url
}

/**
 * Asserts the full set a share preview needs.
 *
 * `og:image:width` and `height` are in here rather than treated as nice to
 * have: LinkedIn and WhatsApp choose between a wide card and a small
 * thumbnail from those two numbers, and without them the link renders as the
 * sad little square version.
 */
async function expectCompleteCard(
  request: import('@playwright/test').APIRequestContext,
  path: string
) {
  const response = await request.get(path)
  expect(response.status(), `${path} did not load`).toBe(200)
  const html = await response.text()

  for (const key of [
    'og:title',
    'og:description',
    'og:url',
    'og:site_name',
    'og:image',
    'og:image:width',
    'og:image:height',
    'og:image:alt',
    'twitter:card',
  ]) {
    expect(meta(html, key), `${path} is missing ${key}`).toBeTruthy()
  }

  expect(meta(html, 'og:url'), `${path} names a different URL as its own`).toBe(
    path === '/' ? SITE_ORIGIN : `${SITE_ORIGIN}${path}`
  )

  // A summary card shows a postage stamp. Every page here has a 1200x630
  // image and should get the wide one.
  expect(meta(html, 'twitter:card')).toBe('summary_large_image')
  expect(meta(html, 'og:image:width')).toBe('1200')
  expect(meta(html, 'og:image:height')).toBe('630')

  // A card image that 404s is worse than none: the scraper records the miss.
  const imageUrl = meta(html, 'og:image')!
  const image = await request.get(toLocalPath(imageUrl))
  expect(image.status(), `${path} card image did not render`).toBe(200)
  expect(image.headers()['content-type']).toContain('image')

  return html
}

test.describe('share cards', () => {
  test('every blog post in the sitemap has a complete card', async ({ request }) => {
    const sitemap = await (await request.get('/sitemap.xml')).text()
    const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((m) => toLocalPath(m[1]))
      .filter((p) => p.startsWith('/blog/'))

    // If this ever hits zero the loop below passes by doing nothing, which
    // would be the quietest possible way for this test to stop testing.
    expect(paths.length, 'no blog posts found in the sitemap').toBeGreaterThan(0)

    for (const path of paths) {
      const html = await expectCompleteCard(request, path)

      expect(meta(html, 'og:type'), `${path} is not marked as an article`).toBe('article')

      // Open Graph wants ISO 8601. A JavaScript Date `toString` parses in a
      // browser and is dropped by the scrapers that read the spec strictly.
      const published = meta(html, 'article:published_time')
      expect(published, `${path} has no publication date`).toBeTruthy()
      expect(published, `${path} publication date is not ISO 8601`).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
      )

      // The card draws the title, so an empty one is a blank card.
      expect(meta(html, 'og:title')!.length, `${path} has an empty title`).toBeGreaterThan(0)
      expect(
        meta(html, 'og:description')!.length,
        `${path} has an empty description`
      ).toBeGreaterThan(0)
    }
  })

  test('the pages people link to have complete cards', async ({ request }) => {
    for (const path of ['/', '/about', '/work', '/publications', '/blog', '/talks', '/resume', '/career', '/ai', '/courses', '/tags', '/now']) {
      await expectCompleteCard(request, path)
    }
  })

  test('a card subtitle never ends mid word or on a dangling conjunction', async ({ request }) => {
    const sitemap = await (await request.get('/sitemap.xml')).text()
    const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((m) => toLocalPath(m[1]))
      .filter((p) => p.startsWith('/blog/'))

    for (const path of paths) {
      const html = await (await request.get(path)).text()
      const image = meta(html, 'og:image')!
      const subtitle = new URL(image).searchParams.get('subtitle') ?? ''
      if (!subtitle.endsWith('…')) continue

      const words = subtitle.replace(/…$/, '').trim().split(/\s+/)
      const last = words[words.length - 1].toLowerCase()
      expect(
        ['and', 'but', 'or', 'the', 'a', 'an', 'to', 'of', 'for', 'in', 'on', 'with', 'that'],
        `${path} card subtitle trails off on "${last}"`
      ).not.toContain(last)
    }
  })
})
