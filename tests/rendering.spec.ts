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

const ROUTES = ['/', '/about', '/work', '/research', '/blog', '/talks', '/resume', '/career', '/ai', '/courses', '/tags']

test.describe('server-rendered HTML', () => {
  for (const route of ROUTES) {
    test(`${route} ships no server-hidden content`, async ({ request }) => {
      const html = await (await request.get(route)).text()
      const hidden = html.match(/opacity:\s*0[^.]/g) ?? []
      expect(hidden, `found ${hidden.length} element(s) server-rendered at opacity:0`).toHaveLength(0)
    })
  }

  // The figures moved from the homepage to the CV on 2026-09-24.
  // Publications became a section of /research on 2026-09-24. Old links, Scholar
  // entries and search results must still arrive, and each paper keeps its anchor.
  test('/publications redirects to /research, where every paper keeps its anchor', async ({ request }) => {
    const res = await request.get('/publications', { maxRedirects: 0 })
    expect(res.status()).toBe(308)
    expect(res.headers()['location']).toMatch(/\/research$/)
    const html = await (await request.get('/research')).text()
    expect(html).toContain('id="papers"')
    expect(html).toContain('Papers, newest first')
    expect(html).toContain('BibTeX for all')
  })

  test('CV impact numbers are the real values, not zeros', async ({ request }) => {
    const html = await (await request.get('/resume')).text()
    const text = html.replace(/<[^>]+>/g, '')

    // The real figures from IMPACT_NUMBERS in lib/data.ts.
    expect(text).toContain('R1B')
    expect(text).toContain('100M+')
    expect(text).not.toContain('230K')
    expect(text).toContain('R2M+')
    // Figures the CV does not state must not come back.
    expect(text).not.toContain('80-90%')
    expect(text).not.toContain('R1B+')

    // The old bug: counters initialised to zero, so the HTML said "R0+".
    expect(text).not.toContain('R0+')
  })

  test('CV record sections are in the HTML', async ({ request }) => {
    const html = await (await request.get('/resume')).text()
    expect(html).toContain('What the work delivered')
    expect(html).toContain('University of the Witwatersrand')
  })
})

test.describe('reveal animations still work', () => {
  test('below-fold section becomes visible when scrolled into view', async ({ page }) => {
    await page.goto('/resume')

    const heading = page.getByRole('heading', { name: 'What the work delivered' })
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
