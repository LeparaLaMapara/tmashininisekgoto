import { test } from '@playwright/test'
import path from 'path'

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'about', path: '/about' },
  { name: 'work', path: '/work' },
  { name: 'blog', path: '/blog' },
  { name: 'talks', path: '/talks' },
  { name: 'ai', path: '/ai' },
  { name: 'resume', path: '/resume' },
]

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)

for (const page of PAGES) {
  test(`screenshot ${page.name}`, async ({ page: p }) => {
    await p.goto(page.path, { waitUntil: 'networkidle' })
    // Wait for animations to settle
    await p.waitForTimeout(2000)

    // Full page screenshot
    await p.screenshot({
      path: path.join('screenshots', `${timestamp}_${page.name}_full.png`),
      fullPage: true,
    })

    // Viewport screenshot
    await p.screenshot({
      path: path.join('screenshots', `${timestamp}_${page.name}_viewport.png`),
    })
  })
}

// Mobile screenshots
test('mobile screenshots', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 14 Pro
  })
  const p = await context.newPage()

  for (const page of PAGES) {
    await p.goto(page.path, { waitUntil: 'networkidle' })
    await p.waitForTimeout(2000)
    await p.screenshot({
      path: path.join('screenshots', `${timestamp}_${page.name}_mobile.png`),
      fullPage: true,
    })
  }

  await context.close()
})
