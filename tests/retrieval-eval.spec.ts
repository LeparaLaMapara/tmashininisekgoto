import { test, expect } from '@playwright/test'
import { search } from '../lib/search'
import { getConnections, getTopicHub } from '../lib/graph'

/**
 * Discoverability evaluation: can the site's own corpus answer the questions a
 * stranger would ask, without knowing the author's name?
 *
 * Each case is a query a person or a retrieval system might plausibly run and
 * the page that holds the evidence. The test does not plant answers: it checks
 * that the information architecture already surfaces the right page within
 * the top results of the site's own search, which matches on titles,
 * descriptions and the topic vocabulary, the same signals a crawler reads. A
 * failure means a structural gap (a page that does not name its subject, a
 * missing topic, a missing page), and the fix belongs there, not in this file.
 *
 * Results are printed as a table so the scorecard in DISCOVERABILITY_STATUS.md
 * can be refreshed from a run.
 */

const CASES: { question: string; query: string; expect: string; within: number }[] = [
  { question: 'What is TFiltersPy?', query: 'tfilterspy', expect: '/work/tfilterspy', within: 1 },
  { question: 'Python Kalman filter library', query: 'kalman python', expect: '/work/tfilterspy', within: 3 },
  { question: 'Software for state estimation', query: 'state estimation', expect: '/work/tfilterspy', within: 3 },
  { question: 'Particle filters', query: 'particle filter', expect: '/work/tfilterspy', within: 3 },
  { question: 'What is Ubunye Engine?', query: 'ubunye engine', expect: '/work/ubunye-engine', within: 1 },
  { question: 'Portable ETL and ML on Databricks and Kubernetes', query: 'databricks kubernetes', expect: '/work/ubunye-engine', within: 3 },
  { question: 'Reservoir computing for iterative image segmentation', query: 'reservoir computing segmentation', expect: '/research/echo-state-networks-level-set-segmentation', within: 3 },
  { question: 'Research using echo state networks', query: 'echo state networks', expect: '/research/echo-state-networks-level-set-segmentation', within: 3 },
  { question: 'Level set segmentation with recurrent networks', query: 'level set', expect: '/research/echo-state-networks-level-set-segmentation', within: 3 },
  { question: 'Work on climate forecasting', query: 'climate forecasting', expect: '/research/seasonal-climate-forecasting', within: 3 },
  { question: 'Seasonal temperature forecasting with ML', query: 'seasonal temperature', expect: '/research/seasonal-climate-forecasting', within: 3 },
  { question: 'Publications on occupational noise', query: 'noise mine', expect: '/research/mine-worker-noise-hearing-loss', within: 3 },
  { question: 'Hearing loss prediction', query: 'hearing', expect: '/research/mine-worker-noise-hearing-loss', within: 3 },
  { question: 'Computer vision research', query: 'computer vision', expect: '/topics/computer-vision', within: 3 },
  { question: 'Climate risk and geospatial ML', query: 'climate risk', expect: '/topics/climate-risk', within: 3 },
  { question: 'AI education in South Africa', query: 'ai education', expect: '/topics/ai-education', within: 3 },
  { question: 'Generator optimisation for telecoms', query: 'generator optimisation', expect: '/work/vodacom-network-intelligence', within: 3 },
  { question: 'Township youth building with AI', query: 'township', expect: '/work/kasilam-digital', within: 3 },
]

test.describe('retrieval evaluation', () => {
  const rows: string[] = []

  for (const c of CASES) {
    test(`${c.question}`, () => {
      const results = search(c.query, 10)
      const rank = results.findIndex((r) => r.href === c.expect) + 1
      rows.push(`${rank > 0 && rank <= c.within ? 'PASS' : 'FAIL'}  rank ${rank || '-'} (need <= ${c.within})  "${c.query}" -> ${c.expect}`)
      expect(rank, `top results: ${results.slice(0, 5).map((r) => r.href).join(', ')}`).toBeGreaterThan(0)
      expect(rank).toBeLessThanOrEqual(c.within)
    })
  }

  test.afterAll(() => {
    console.log(`\nRetrieval evaluation\n${rows.join('\n')}\n`)
  })
})

test.describe('the graph answers relational questions', () => {
  test('which software relates to state estimation', () => {
    const hub = getTopicHub('state-estimation')!
    expect(hub.items.project.map((n) => n.key)).toContain('tfilterspy')
  })

  test('which research artifacts relate to computer vision', () => {
    const hub = getTopicHub('computer-vision')!
    expect(hub.items.research.map((n) => n.key)).toContain('echo-state-networks-level-set-segmentation')
    expect(hub.items.publication.map((n) => n.key)).toContain('esn-level-set-segmentation-msc')
  })

  test('which topics connect the research and the software', () => {
    // Recurrent networks tie three research lines together; time series ties
    // the filtering library to the forecasting research.
    const ts = getTopicHub('time-series')!
    expect(ts.items.project.map((n) => n.key)).toContain('tfilterspy')
    expect(ts.items.research.map((n) => n.key)).toContain('seasonal-climate-forecasting')
  })

  test('the climate research reaches the production work it fed', () => {
    const c = getConnections('research', 'seasonal-climate-forecasting')
    expect(c.project.map((x) => x.node.key)).toContain('ibm-geospatial')
    expect(c.publication.length).toBeGreaterThanOrEqual(2)
  })
})
