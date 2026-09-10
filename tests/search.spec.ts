import { test, expect } from '@playwright/test'

/**
 * The Cmd+K palette must search real content across every type, not filter
 * titles. These guard the wiring between the palette and lib/search.
 */

test.describe('universal search', () => {
  test('the API returns scored, multi-type results', async ({ request }) => {
    const res = await request.get('/api/search?q=Databricks')
    expect(res.status()).toBe(200)
    const { results } = await res.json()

    expect(results.length).toBeGreaterThan(0)

    // A term that appears across the corpus should reach more than one type,
    // which is the whole point: an article, a project and a course, not just
    // whatever happens to have it in the title.
    const kinds = new Set(results.map((r: { kind: string }) => r.kind))
    expect(kinds.size).toBeGreaterThan(1)

    // Every result must be navigable and typed.
    for (const r of results) {
      expect(r.href).toMatch(/^\//)
      expect(r.title.length).toBeGreaterThan(0)
      expect(typeof r.kind).toBe('string')
    }

    // Results arrive in descending score order.
    const scores = results.map((r: { score: number }) => r.score)
    expect(scores).toEqual([...scores].sort((a: number, b: number) => b - a))
  })

  test('a one-character query is ignored', async ({ request }) => {
    const { results } = await (await request.get('/api/search?q=a')).json()
    expect(results).toHaveLength(0)
  })

  test('body content is searchable, not only titles', async ({ request }) => {
    // "vending machine" is a phrase from inside an article body, not any title.
    const { results } = await (await request.get('/api/search?q=vending')).json()
    expect(results.some((r: { kind: string }) => r.kind === 'Post')).toBe(true)
  })

  test('Cmd+K opens the palette and searches live', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('ControlOrMeta+k')

    const input = page.getByPlaceholder(/Search writing, work/i)
    await expect(input).toBeVisible()

    await input.fill('Databricks')
    // A result item from the live engine appears (grouped headings render).
    await expect(page.getByText('Production ML Systems', { exact: false }).first())
      .toBeVisible({ timeout: 5000 })
  })
})
