import { test, expect } from '@playwright/test'

/**
 * Guards the server-rendering fixes from Phase 2 of the SEO work.
 *
 * Two things have to stay true at once:
 *   1. The HTML the server sends contains the content, visible, with no
 *      `opacity: 0` waiting on JavaScript. Crawlers and AI readers that do not
 *      execute JS must still see the page.
 *   2. The reveal animations still work for real visitors who scroll.
 *
 * Fixing (1) is easy in a way that silently breaks (2), so both are asserted.
 */

const ROUTES = ['/', '/about', '/work', '/publications', '/blog', '/talks', '/resume', '/career', '/ai', '/courses', '/tags']

test.describe('server-rendered HTML', () => {
  for (const route of ROUTES) {
    test(`${route} ships no server-hidden content`, async ({ request }) => {
      const html = await (await request.get(route)).text()
      const hidden = html.match(/opacity:\s*0[^.]/g) ?? []
      expect(hidden, `found ${hidden.length} element(s) server-rendered at opacity:0`).toHaveLength(0)
    })
  }

  test('homepage impact numbers are the real values, not zeros', async ({ request }) => {
    const html = await (await request.get('/')).text()
    const text = html.replace(/<[^>]+>/g, '')

    // The real figures from IMPACT_NUMBERS in lib/data.ts.
    expect(text).toContain('R1B+')
    expect(text).toContain('80-90%')
    expect(text).toContain('R2M+')

    // The old bug: counters initialised to zero, so the HTML said "R0+".
    expect(text).not.toContain('R0+')
  })

  test('homepage below-fold sections are in the HTML', async ({ request }) => {
    const html = await (await request.get('/')).text()
    expect(html).toContain('Real impact, real numbers')
    expect(html).toContain('University of the Witwatersrand')
  })
})

test.describe('reveal animations still work', () => {
  test('below-fold section becomes visible when scrolled into view', async ({ page }) => {
    await page.goto('/')

    const heading = page.getByRole('heading', { name: 'Real impact, real numbers' })
    await heading.scrollIntoViewIfNeeded()

    // Not just attached: actually painted at full opacity.
    await expect(heading).toBeVisible()
    await expect
      .poll(async () => heading.evaluate((el) => Number(getComputedStyle(el.parentElement!).opacity)), {
        timeout: 5000,
      })
      .toBeGreaterThan(0.9)
  })

  test('hero paints without waiting for an animation', async ({ page }) => {
    await page.goto('/', { waitUntil: 'commit' })
    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toBeVisible()
    const opacity = await h1.evaluate((el) => Number(getComputedStyle(el).opacity))
    expect(opacity).toBe(1)
  })
})
