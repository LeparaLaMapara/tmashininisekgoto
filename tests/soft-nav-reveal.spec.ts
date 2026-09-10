import { test, expect, type Page } from '@playwright/test'

/**
 * Headings used to stay at opacity 0 after a client-side navigation, and only
 * appear if the visitor reloaded. ScrollReveal drove visibility from two
 * racing mechanisms (an effect flipping `animate`, and an IntersectionObserver
 * flipping `whileInView` with `once: true`). On a hard load the effect won and
 * the observer revealed the content afterwards; on a soft navigation the
 * observer fired first, unobserved the element, and nothing was left to undo
 * the hide. These tests pin both paths, and pin that the reveal itself still
 * animates so the fix is not just "everything is always visible".
 */

const ROUTES = ['/', '/work', '/talks', '/blog', '/publications', '/about', '/resume', '/courses']

/** Smallest opacity applied anywhere in an element's ancestor chain. */
function effectiveOpacity(page: Page, selector: string, nth = 0) {
  return page.locator(selector).nth(nth).evaluate((el) => {
    let node: HTMLElement | null = el as HTMLElement
    let min = 1
    while (node && node !== document.body) {
      min = Math.min(min, parseFloat(getComputedStyle(node).opacity))
      node = node.parentElement
    }
    return min
  })
}

/** Navigate the way a visitor clicking the nav does, with no page load. */
async function softNavigate(page: Page, route: string) {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await page.locator(`a[href="${route}"]`).first().click()
  await page.waitForURL(`**${route}`)
  await page.waitForTimeout(1500)
}

test.describe('above-the-fold content survives a client-side navigation', () => {
  for (const route of ROUTES.filter((r) => r !== '/')) {
    test(`${route} paints its heading without a reload`, async ({ page }) => {
      await softNavigate(page, route)

      const h1 = page.locator('h1').first()
      await expect(h1).toBeVisible()
      expect(await effectiveOpacity(page, 'h1'), `${route} h1`).toBeGreaterThan(0.9)

      // The first subheading is usually on screen too, and was hidden by the
      // same bug.
      if (await page.locator('h2').count()) {
        const box = await page.locator('h2').first().boundingBox()
        if (box && box.y < 900) {
          expect(await effectiveOpacity(page, 'h2'), `${route} first h2`).toBeGreaterThan(0.9)
        }
      }
    })
  }
})

test.describe('the reveal animation still works', () => {
  test('content below the fold starts hidden and fades in on scroll', async ({ page }) => {
    await page.goto('/work')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(800)

    // Off-screen blocks must actually be armed, or the fix would just be
    // "nothing ever animates".
    const armed = page.locator('div[style*="opacity: 0"]')
    const count = await armed.count()
    expect(count, 'below-fold blocks armed for reveal on /work').toBeGreaterThan(0)

    // Hold a handle, not a locator: the selector stops matching the moment the
    // element fades in, which would look like "element not found".
    const target = await armed.first().elementHandle()
    await target!.scrollIntoViewIfNeeded()
    await page.waitForTimeout(1200)
    const after = await target!.evaluate((el) => getComputedStyle(el).opacity)
    expect(parseFloat(after), 'armed block after scrolling into view').toBeGreaterThan(0.9)
  })
})

test.describe('a hard load still paints immediately', () => {
  for (const route of ROUTES) {
    test(`${route} heading is visible on direct load`, async ({ page }) => {
      await page.goto(route)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(800)
      expect(await effectiveOpacity(page, 'h1'), `${route} h1`).toBeGreaterThan(0.9)
    })
  }
})
