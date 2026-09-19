/**
 * Discoverability scorecard from a Google Search Console export.
 *
 * The number that matters is how often someone who does not know the name
 * finds the work. Search Console already records every query and landing
 * page; this turns its export into that answer, with no proprietary score:
 * every figure is a sum of Google's own clicks and impressions.
 *
 *   1. Search Console > Performance > Search results > Export > CSV.
 *      Unzip; it contains Queries.csv and Pages.csv.
 *   2. npx tsx scripts/discoverability/scorecard.ts path/to/unzipped-folder
 *
 * Queries are classed as:
 *   branded           names the person (any published variant of the name)
 *   project branded   names a project (Ubunye, TFiltersPy, Kasilam, ...)
 *   non branded       everything else: the problem, method or topic itself
 * Landing pages are classed by entity type and mapped to their topics through
 * the content graph, so "which subjects bring strangers in" is answerable.
 *
 * Search Console hides rare queries for privacy, so the query totals are
 * lower than the page totals. The report says so rather than hiding it.
 */
import fs from 'node:fs'
import path from 'node:path'
import { PROJECTS } from '../../lib/data'
import { RESEARCH } from '../../lib/graph/research'
import { getTopicDef } from '../../lib/graph/topics'
import { getNodes } from '../../lib/graph'

const dir = process.argv[2]
if (!dir || !fs.existsSync(path.join(dir, 'Queries.csv'))) {
  console.error('Usage: npx tsx scripts/discoverability/scorecard.ts <folder with Queries.csv and Pages.csv>')
  process.exit(1)
}

/** Minimal CSV: Search Console quotes fields that contain commas. */
function readCsv(file: string): Record<string, string>[] {
  const text = fs.readFileSync(file, 'utf-8').replace(/^﻿/, '')
  const rows = text.split(/\r?\n/).filter(Boolean).map((line) => {
    const cells: string[] = []
    let cur = ''
    let quoted = false
    for (const ch of line) {
      if (ch === '"') quoted = !quoted
      else if (ch === ',' && !quoted) { cells.push(cur); cur = '' }
      else cur += ch
    }
    cells.push(cur)
    return cells
  })
  const [head, ...body] = rows
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h.trim(), (r[i] ?? '').trim()])))
}

const num = (v: string | undefined) => Number((v ?? '0').replace(/[^\d.]/g, '')) || 0

const PERSON = /thabang|mashinini|sekgoto|lepara/i
const PROJECT_NAMES = [
  ...PROJECTS.filter((p) => p.kind === 'software' || p.title.split(' ').length <= 2).map((p) => p.title),
  'Ubunye', 'Kasilam', 'FabAcademic', 'Thabang AI',
]
const PROJECT = new RegExp(PROJECT_NAMES.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'i')

type QueryClass = 'branded' | 'project branded' | 'non branded'
const classify = (q: string): QueryClass => (PERSON.test(q) ? 'branded' : PROJECT.test(q) ? 'project branded' : 'non branded')

function pageType(url: string): string {
  const p = new URL(url).pathname
  if (p === '/') return 'home'
  const first = p.split('/')[1]
  return ({ work: 'project', research: 'research', topics: 'topic', blog: 'post', publications: 'publication', talks: 'talk' } as Record<string, string>)[first] ?? 'other page'
}

/** Topics for a landing page, from the graph node whose URL it is. */
function pageTopics(url: string): string[] {
  const p = new URL(url).pathname
  const node = getNodes().find((n) => n.href === p)
  if (node) return node.topics
  if (p.startsWith('/topics/')) return [p.split('/')[2]]
  return []
}

const queries = readCsv(path.join(dir, 'Queries.csv'))
const pages = fs.existsSync(path.join(dir, 'Pages.csv')) ? readCsv(path.join(dir, 'Pages.csv')) : []
const qKey = Object.keys(queries[0] ?? {}).find((k) => /quer/i.test(k)) ?? 'Top queries'
const pKey = Object.keys(pages[0] ?? {}).find((k) => /page/i.test(k)) ?? 'Top pages'

const byClass = new Map<QueryClass, { clicks: number; impressions: number; queries: number }>()
for (const row of queries) {
  const c = classify(row[qKey])
  const agg = byClass.get(c) ?? { clicks: 0, impressions: 0, queries: 0 }
  agg.clicks += num(row.Clicks)
  agg.impressions += num(row.Impressions)
  agg.queries += 1
  byClass.set(c, agg)
}

const byType = new Map<string, { clicks: number; impressions: number }>()
const byTopic = new Map<string, { clicks: number; impressions: number }>()
for (const row of pages) {
  const url = row[pKey]
  if (!/^https?:/.test(url)) continue
  const t = pageType(url)
  const a = byType.get(t) ?? { clicks: 0, impressions: 0 }
  a.clicks += num(row.Clicks); a.impressions += num(row.Impressions); byType.set(t, a)
  for (const topic of pageTopics(url)) {
    const b = byTopic.get(topic) ?? { clicks: 0, impressions: 0 }
    b.clicks += num(row.Clicks); b.impressions += num(row.Impressions); byTopic.set(topic, b)
  }
}

const total = [...byClass.values()].reduce((s, v) => ({ clicks: s.clicks + v.clicks, impressions: s.impressions + v.impressions }), { clicks: 0, impressions: 0 })
const pct = (n: number, d: number) => (d ? `${((100 * n) / d).toFixed(1)}%` : 'n/a')

const out: string[] = [
  `# Discoverability scorecard`,
  '',
  `Source: Search Console export in ${dir}. Generated ${new Date().toISOString().slice(0, 10)}.`,
  'Every figure is a sum of Google\'s own clicks and impressions. Rare queries are withheld by Google, so query totals are lower than page totals.',
  '',
  '## Branded versus non branded',
  '',
  '| Query class | Queries | Clicks | Share of clicks | Impressions | Share of impressions |',
  '|---|---|---|---|---|---|',
  ...(['branded', 'project branded', 'non branded'] as QueryClass[]).map((c) => {
    const v = byClass.get(c) ?? { clicks: 0, impressions: 0, queries: 0 }
    return `| ${c} | ${v.queries} | ${v.clicks} | ${pct(v.clicks, total.clicks)} | ${v.impressions} | ${pct(v.impressions, total.impressions)} |`
  }),
  '',
  '## Top non branded queries',
  '',
  '| Query | Clicks | Impressions | Position |',
  '|---|---|---|---|',
  ...queries
    .filter((r) => classify(r[qKey]) === 'non branded')
    .sort((a, b) => num(b.Impressions) - num(a.Impressions))
    .slice(0, 25)
    .map((r) => `| ${r[qKey]} | ${num(r.Clicks)} | ${num(r.Impressions)} | ${r.Position ?? ''} |`),
  '',
  '## Landing pages by entity type',
  '',
  '| Type | Clicks | Impressions |',
  '|---|---|---|',
  ...[...byType.entries()].sort((a, b) => b[1].impressions - a[1].impressions).map(([t, v]) => `| ${t} | ${v.clicks} | ${v.impressions} |`),
  '',
  '## Topics that bring people in (via landing pages)',
  '',
  '| Topic | Clicks | Impressions |',
  '|---|---|---|',
  ...[...byTopic.entries()]
    .sort((a, b) => b[1].impressions - a[1].impressions)
    .slice(0, 20)
    .map(([t, v]) => `| ${getTopicDef(t)?.name ?? t} | ${v.clicks} | ${v.impressions} |`),
  '',
  `Research pages known to the graph: ${RESEARCH.filter((r) => r.page).length}. A research page with no impressions after 90 days is a structural question, not a copy one.`,
  '',
]
console.log(out.join('\n'))
