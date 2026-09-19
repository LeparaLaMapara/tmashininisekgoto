import { test, expect } from '@playwright/test'
import { PROJECTS, PUBLICATIONS } from '../lib/data'
import { TOPICS, TAG_TO_TOPIC, getTopicDef } from '../lib/graph/topics'
import { RESEARCH } from '../lib/graph/research'
import { ORGANIZATIONS } from '../lib/graph/organizations'
import {
  HUB_THRESHOLD,
  allReferencedTopics,
  getConnections,
  getHubTopics,
  getNodes,
  getTopicHub,
  tagHref,
} from '../lib/graph'
import { NAME_VARIANTS, personSchema, projectSchema, researchSchema, publicationSchema } from '../lib/schema'
import { getAllPosts } from '../lib/blog'

/**
 * The content graph's guarantees. In-process, no server: these fail the build
 * the moment a new project, research line, post or topic is added in a way
 * that would break a link, create a thin page or assert something unsourced.
 */

const DASH = /[–—]/ // en dash, em dash: the house style bans both in prose

test.describe('ontology', () => {
  test('every topic referenced anywhere exists in the ontology', () => {
    const known = new Set(TOPICS.map((t) => t.slug))
    expect(allReferencedTopics().filter((t) => !known.has(t))).toEqual([])
    for (const t of TOPICS) for (const b of t.broader ?? []) expect(known.has(b), `${t.slug} broader ${b}`).toBe(true)
    for (const target of Object.values(TAG_TO_TOPIC)) expect(known.has(target), target).toBe(true)
  })

  test('topic slugs are unique and Wikidata ids are well formed', () => {
    const slugs = TOPICS.map((t) => t.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const t of TOPICS) if (t.wikidata) expect(t.wikidata, t.slug).toMatch(/^Q\d+$/)
    for (const o of ORGANIZATIONS) if (o.wikidata) expect(o.wikidata, o.slug).toMatch(/^Q\d+$/)
  })

  test('a hub exists only with an intro, a description and enough work behind it', () => {
    for (const t of getHubTopics()) {
      const hub = getTopicHub(t.slug)!
      expect(t.intro, t.slug).toBeTruthy()
      expect(t.description!.length, t.slug).toBeLessThanOrEqual(160)
      expect(hub.count, t.slug).toBeGreaterThanOrEqual(HUB_THRESHOLD.minItems)
      expect(hub.count - hub.items.talk.length, t.slug).toBeGreaterThanOrEqual(HUB_THRESHOLD.minSubstantive)
    }
  })

  test('topic copy follows the house style', () => {
    for (const t of TOPICS) {
      for (const text of [t.intro, t.description, t.heading]) if (text) expect(DASH.test(text), t.slug).toBe(false)
      expect(`${t.intro ?? ''}`).not.toMatch(/PhD candidate|world.class|leading expert/i)
    }
  })
})

test.describe('records', () => {
  test('project identity fields are present and sized for search results', () => {
    for (const p of PROJECTS) {
      expect(p.headline.length, p.slug).toBeLessThanOrEqual(60)
      expect(p.summary.length, p.slug).toBeLessThanOrEqual(160)
      expect(p.graphTopics.length, p.slug).toBeGreaterThan(0)
      for (const text of [p.headline, p.summary, p.role, p.period]) expect(DASH.test(text), p.slug).toBe(false)
      if (p.organization) expect(ORGANIZATIONS.some((o) => o.slug === p.organization), p.slug).toBe(true)
      for (const t of p.technologies) expect(getTopicDef(t)?.kind, `${p.slug} ${t}`).toBe('technology')
    }
  })

  test('software names itself in its headline', () => {
    // The TFiltersPy page once had a title without the word TFiltersPy in it.
    for (const p of PROJECTS.filter((x) => x.kind === 'software')) {
      expect(p.headline.startsWith(p.title), p.slug).toBe(true)
      expect(p.license, p.slug).toBeTruthy()
    }
  })

  test('research records resolve and are sized for search results', () => {
    const pubKeys = new Set(PUBLICATIONS.map((p) => p.key))
    const projectSlugs = new Set(PROJECTS.map((p) => p.slug))
    for (const r of RESEARCH) {
      expect(r.headline.length, r.slug).toBeLessThanOrEqual(60)
      expect(r.summary.length, r.slug).toBeLessThanOrEqual(160)
      for (const k of r.publications) expect(pubKeys.has(k), `${r.slug} ${k}`).toBe(true)
      for (const s of r.relatedProjects) expect(projectSlugs.has(s), `${r.slug} ${s}`).toBe(true)
      expect(r.provenance.length, r.slug).toBeGreaterThan(0)
      const prose = [r.headline, r.summary, r.question, r.approach, r.limitations, r.implications, ...(r.findings ?? [])]
      for (const text of prose) if (text) expect(DASH.test(text), r.slug).toBe(false)
    }
  })

  test('every publication belongs to a research line that has a page', () => {
    for (const p of PUBLICATIONS) {
      const r = RESEARCH.find((x) => x.slug === p.research)
      expect(r?.page, p.key).toBe(true)
      expect(r!.publications, p.key).toContain(p.key)
    }
  })

  test('post frontmatter points at real projects', () => {
    const slugs = new Set(PROJECTS.map((p) => p.slug))
    for (const post of getAllPosts()) for (const s of post.projects ?? []) expect(slugs.has(s), `${post.slug} ${s}`).toBe(true)
  })
})

test.describe('evidence', () => {
  // Claims removed after checking each abstract (DISCOVERABILITY_AUDIT.md,
  // section 4). They must not come back.
  const RETRACTED: [string, RegExp][] = [
    ['mine-noise-policy-advising', /real.time|regulat|exposure limits/i],
    ['mine-threshold-shift-rnn', /permanent|progression/i],
    ['seasonal-forecasting-2m-temperature', /numerical weather prediction|integrated into/i],
    ['probabilistic-2m-temperature-precipitation', /closing the skill gap/i],
  ]
  for (const [key, pattern] of RETRACTED) {
    test(`${key} states only what its abstract supports`, () => {
      const pub = PUBLICATIONS.find((p) => p.key === key)!
      expect(pub.aiSummary).not.toMatch(pattern)
      expect(pub.applications.join(' ')).not.toMatch(pattern)
    })
  }

  test('the person carries the name variants the published record uses', () => {
    const person = personSchema()
    for (const v of ['Thabang L. Mashinini', 'Thabang Mashinini', 'Thabang Lukhetho Mashinini']) {
      expect(person.alternateName).toContain(v)
    }
    expect(NAME_VARIANTS.length).toBe(new Set(NAME_VARIANTS).size)
  })

  test('no ORCID or other identifier is asserted without a value', () => {
    const sameAs = personSchema().sameAs
    expect(sameAs.every((u) => /^https:\/\//.test(u))).toBe(true)
    expect(sameAs.some((u) => u.includes('orcid.org/'))).toBe(false) // until one is confirmed
  })
})

test.describe('structured data', () => {
  test('ids are unique per entity', () => {
    const ids = getNodes().map((n) => n.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('the same software has the same @id on every surface', () => {
    const tf = PROJECTS.find((p) => p.slug === 'tfilterspy')!
    const node = getNodes().find((n) => n.type === 'project' && n.key === 'tfilterspy')!
    expect(projectSchema(tf)['@id']).toBe(node.id)
    expect(node.id).toMatch(/\/work\/tfilterspy#software$/)
    expect(projectSchema(tf)['@type']).toBe('SoftwareSourceCode')
  })

  test('papers attach the subject to the one Person entity', () => {
    for (const p of PUBLICATIONS) {
      const authors = publicationSchema(p).author as Record<string, unknown>[]
      expect(authors.some((a) => a['@id'] === 'https://www.tmashininisekgoto.com/#person'), p.key).toBe(true)
    }
  })

  test('research lines link their publications by @id', () => {
    for (const r of RESEARCH.filter((x) => x.page && x.publications.length)) {
      const s = researchSchema(r) as { subjectOf: { '@id'?: string }[] }
      for (const k of r.publications) expect(s.subjectOf.some((x) => x['@id']?.endsWith(`#${k}`)), `${r.slug} ${k}`).toBe(true)
    }
  })

  test('case studies do not claim to be the pages they link to', () => {
    for (const p of PROJECTS.filter((x) => x.kind !== 'software')) {
      expect((projectSchema(p) as Record<string, unknown>).sameAs, p.slug).toBeUndefined()
    }
  })
})

test.describe('connections', () => {
  test('never include the item itself, never duplicate, and are deterministic', () => {
    for (const n of getNodes()) {
      const a = getConnections(n.type, n.key)
      const flat = Object.values(a).flat()
      expect(flat.some((c) => c.node.type === n.type && c.node.key === n.key)).toBe(false)
      const ids = flat.map((c) => `${c.node.type}:${c.node.key}`)
      expect(new Set(ids).size).toBe(ids.length)
      expect(getConnections(n.type, n.key)).toEqual(a)
    }
  })

  test('a stated link always outranks a shared topic', () => {
    const c = getConnections('research', 'seasonal-climate-forecasting')
    expect(c.project[0]?.node.key).toBe('ibm-geospatial')
    expect(c.project[0]?.stated).toBe(true)
  })

  test('every project, research page and publication has at least one connection', () => {
    for (const n of getNodes().filter((x) => x.type !== 'talk')) {
      const total = Object.values(getConnections(n.type, n.key)).flat().length
      expect(total, `${n.type}:${n.key}`).toBeGreaterThan(0)
    }
  })

  test('a tag with a hub links straight to the hub', () => {
    expect(tagHref('ai agents')).toBe('/topics/ai-agents')
    expect(tagHref('python')).toBe('/topics/python')
  })
})
