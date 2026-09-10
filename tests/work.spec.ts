import { test, expect } from '@playwright/test'
import { PROJECTS, getProjectsOrdered } from '../lib/data'

/**
 * The /work restructure: every project has a case study, verified artifacts,
 * topics not skill badges, and honest attribution. These run in-process for the
 * data guarantees, plus a couple of live checks.
 */

test.describe('work data integrity', () => {
  test('every project has the full case-study shape', () => {
    for (const p of PROJECTS) {
      expect(p.cardTitle.length).toBeGreaterThan(0)
      expect(p.oneLiner.length).toBeGreaterThan(0)
      expect(p.why.length).toBeGreaterThan(0)
      expect(p.topics.length).toBeGreaterThanOrEqual(3)
      expect(p.topics.length).toBeLessThanOrEqual(6)
      for (const key of ['problem', 'why', 'context', 'contribution', 'changed', 'benefited', 'remained'] as const) {
        expect(p.caseStudy[key].length, `${p.slug}.${key}`).toBeGreaterThan(0)
      }
    }
  })

  test('explicit ordering is unique and contiguous', () => {
    const orders = getProjectsOrdered().map((p) => p.order)
    expect(new Set(orders).size).toBe(orders.length)
    expect(orders).toEqual([...orders].sort((a, b) => a - b))
  })

  test('every artifact link is absolute http(s)', () => {
    for (const p of PROJECTS) {
      for (const a of p.artifacts) {
        expect(a.href, `${p.slug}`).toMatch(/^https?:\/\//)
      }
    }
  })

  test('confidential work asserts no public artifact link', () => {
    // A brand image is a design choice; a public artifact *link* would imply
    // inspectable proof of confidential work, which must stay absent.
    const absa = PROJECTS.find((p) => p.slug === 'insurance-data-science-capability')!
    expect(absa.artifacts).toHaveLength(0)
  })

  test('no fabricated hard numbers survive on the ABSA story', () => {
    const absa = PROJECTS.find((p) => p.slug === 'insurance-data-science-capability')!
    const blob = JSON.stringify(absa)
    expect(blob).not.toContain('230,000')
    expect(blob).not.toContain('2M')
    expect(blob).not.toContain('2,000,000')
  })

  test('no PhD-candidate claim anywhere in work data', () => {
    const blob = JSON.stringify(PROJECTS).toLowerCase()
    expect(blob).not.toContain('phd candidate')
    expect(blob).not.toContain('phd student')
  })
})

test.describe('work pages render', () => {
  test('every case study is reachable and typed', async ({ request }) => {
    for (const p of getProjectsOrdered()) {
      const res = await request.get(`/work/${p.slug}`)
      expect(res.status(), `/work/${p.slug}`).toBe(200)
    }
  })

  test('the index shows problem-titles and topics, not a skill logo wall', async ({ request }) => {
    const html = await (await request.get('/work')).text()
    expect(html).toContain('Everything you build sits on engineering')
    expect(html).toContain('Why it mattered')
    // The old "Built with" logo-wall label is gone.
    expect(html).not.toContain('Built with')
  })

  test('work pages are listed in the sitemap', async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text()
    expect(xml).toContain('/work/ubunye-engine')
    expect(xml).toContain('/work/insurance-data-science-capability')
  })
})
