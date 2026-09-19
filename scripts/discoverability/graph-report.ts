/**
 * Print the content graph: every topic with how much work sits behind it and
 * whether it earns a hub, plus every node with its topics. Read only.
 *
 *   npx tsx scripts/discoverability/graph-report.ts
 */
import { TOPICS } from '../../lib/graph/topics'
import { getNodes, getTopicHub, allReferencedTopics } from '../../lib/graph'

const rows = TOPICS.map((t) => {
  const hub = getTopicHub(t.slug)!
  const byType = Object.entries(hub.items).filter(([, l]) => l.length).map(([k, l]) => `${k}:${l.length}`).join(' ')
  return { slug: t.slug, count: hub.count, types: hub.types, hub: hub.hasHub, intro: Boolean(t.intro), byType }
}).sort((a, b) => b.count - a.count)

console.log('TOPIC'.padEnd(34), 'N'.padStart(3), 'T', 'HUB', 'INTRO', 'BREAKDOWN')
for (const r of rows) {
  console.log(r.slug.padEnd(34), String(r.count).padStart(3), r.types, r.hub ? 'yes' : ' - ', r.intro ? 'yes  ' : ' -   ', r.byType)
}
const known = new Set(TOPICS.map((t) => t.slug))
const unknown = allReferencedTopics().filter((t) => !known.has(t))
console.log(`\n${getNodes().length} nodes, ${rows.filter((r) => r.hub).length} hubs, unknown topic refs: ${unknown.join(', ') || 'none'}`)
console.log(`Topics with no work attached: ${rows.filter((r) => r.count === 0).map((r) => r.slug).join(', ') || 'none'}`)
