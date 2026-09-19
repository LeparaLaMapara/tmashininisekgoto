import { PROJECTS, PUBLICATIONS, TALKS, type Project, type Publication, type Talk } from '@/lib/data'
import { getAllPosts, type BlogPost } from '@/lib/blog'
import { SITE_URL, absoluteUrl } from '@/lib/site'
import { TOPICS, TAG_TO_TOPIC, TALK_TOPIC_TO_TOPIC, getTopicDef, type TopicDef } from './topics'
import { RESEARCH, type ResearchLine } from './research'
import { slugifyTag } from '@/lib/topics'

/**
 * The content graph.
 *
 * Every entity on the site becomes a node with a stable id, a URL and the
 * topics it is about. Relations between nodes are either stated (a research
 * line lists its publications; a post names the projects it discusses in
 * frontmatter) or derived from shared topics, weighted so that a shared rare
 * topic (echo state networks) counts for far more than a shared common one
 * (Python).
 *
 * Pages, JSON-LD, the machine files and the tests all read from here, so a new
 * project, research line, post or talk joins the graph by being added to its
 * own source, with no second list to update.
 */

export type NodeType = 'project' | 'research' | 'publication' | 'post' | 'talk'

export interface GraphNode {
  type: NodeType
  key: string
  title: string
  /** Site relative URL of the node's canonical page or anchor. */
  href: string
  /** The node's JSON-LD @id. */
  id: string
  blurb: string
  topics: string[]
  /** Explicitly stated neighbours, as `${type}:${key}`. */
  links: string[]
  /** ISO date or year, for ordering. */
  date?: string
}

/**
 * Minimum work behind a topic before it earns a hub page: at least three
 * items, at least two of which are substantive (a project, research line,
 * publication or post). Talks count toward the three but cannot make a hub on
 * their own, because a page of video links is not a topic page.
 */
export const HUB_THRESHOLD = { minItems: 3, minSubstantive: 2 }

// --- Stable identifiers ------------------------------------------------------

export const PERSON_ID = `${SITE_URL}/#person`
export const WEBSITE_ID = `${SITE_URL}/#website`
export const orgId = (slug: string) => `${SITE_URL}/#org-${slug}`
export const topicId = (slug: string) => `${SITE_URL}/topics/${slug}#topic`
export const topicSetId = () => `${SITE_URL}/topics#vocabulary`
export const projectId = (p: Pick<Project, 'slug' | 'kind'>) =>
  `${SITE_URL}/work/${p.slug}#${p.kind === 'software' ? 'software' : 'work'}`
export const researchId = (slug: string) => `${SITE_URL}/research/${slug}#research`
export const publicationId = (key: string) => `${SITE_URL}/publications#${key}`
export const postId = (slug: string) => `${SITE_URL}/blog/${slug}#post`
export const seriesId = (slug: string) => `${SITE_URL}/blog/series/${slug}#series`

// --- Topic assignment --------------------------------------------------------

function unique<T>(xs: T[]): T[] {
  return [...new Set(xs)]
}

export function postTopics(post: BlogPost): string[] {
  const fromTags = post.tags.map((t) => TAG_TO_TOPIC[t.toLowerCase()]).filter(Boolean) as string[]
  return unique([...fromTags, ...(post.topics ?? [])])
}

export function talkTopics(talk: Talk): string[] {
  const mapped = talk.topics.map((t) => TALK_TOPIC_TO_TOPIC[t]).filter(Boolean) as string[]
  // A session whose own title is about agents is about agents. Read from the
  // title because the talk vocabulary predates the topic ontology.
  if (/\bagents?\b/i.test(talk.title)) mapped.push('ai-agents')
  return unique(mapped)
}

export function projectTopics(p: Project): string[] {
  return unique([...p.graphTopics, ...p.technologies])
}

function talkHref(talk: Talk): string {
  return talk.series === 'FabAcademic Unfiltered' ? '/talks/fabacademic-unfiltered' : '/talks'
}

// --- Nodes -------------------------------------------------------------------

function projectNode(p: Project): GraphNode {
  return {
    type: 'project', key: p.slug, title: p.headline, href: `/work/${p.slug}`, id: projectId(p),
    blurb: p.summary, topics: projectTopics(p), links: [],
  }
}

function researchNode(r: ResearchLine): GraphNode {
  return {
    type: 'research', key: r.slug, title: r.headline,
    href: r.page ? `/research/${r.slug}` : `/research#${r.slug}`, id: researchId(r.slug),
    blurb: r.summary, topics: r.topics,
    links: [
      ...r.publications.map((k) => `publication:${k}`),
      ...r.relatedProjects.map((s) => `project:${s}`),
    ],
    date: r.year ? String(r.year) : undefined,
  }
}

function publicationNode(pub: Publication): GraphNode {
  return {
    type: 'publication', key: pub.key, title: pub.title, href: `/publications#${pub.key}`, id: publicationId(pub.key),
    blurb: pub.aiSummary, topics: pub.topics, links: [`research:${pub.research}`], date: String(pub.year),
  }
}

function postNode(post: BlogPost): GraphNode {
  return {
    type: 'post', key: post.slug, title: post.title, href: `/blog/${post.slug}`, id: postId(post.slug),
    blurb: post.summary, topics: postTopics(post),
    links: (post.projects ?? []).map((s) => `project:${s}`),
    date: new Date(post.date).toISOString(),
  }
}

function talkNode(talk: Talk): GraphNode {
  return {
    type: 'talk', key: String(talk.id), title: talk.title, href: talkHref(talk), id: `${absoluteUrl(talkHref(talk))}#talk-${talk.id}`,
    blurb: talk.description, topics: talkTopics(talk), links: [], date: talk.date,
  }
}

let cache: GraphNode[] | null = null
const hubCache = new Map<string, boolean>()

/** Every node. Built once per process; all sources are local files. */
export function getNodes(): GraphNode[] {
  if (cache && process.env.NODE_ENV === 'production') return cache
  const nodes = [
    ...PROJECTS.map(projectNode),
    ...RESEARCH.map(researchNode),
    ...PUBLICATIONS.map(publicationNode),
    ...getAllPosts().map(postNode),
    ...TALKS.map(talkNode),
  ]
  // Stated links are symmetric: if a research line lists a project, the
  // project page shows the research line too.
  const byRef = new Map(nodes.map((n) => [`${n.type}:${n.key}`, n]))
  for (const n of nodes) {
    for (const ref of n.links) {
      const other = byRef.get(ref)
      const self = `${n.type}:${n.key}`
      if (other && !other.links.includes(self)) other.links.push(self)
    }
  }
  cache = nodes
  return nodes
}

export function getNode(type: NodeType, key: string): GraphNode | undefined {
  return getNodes().find((n) => n.type === type && n.key === key)
}

// --- Topics ------------------------------------------------------------------

/** How many nodes carry each topic, for weighting. */
function topicFrequency(): Map<string, number> {
  const freq = new Map<string, number>()
  for (const n of getNodes()) for (const t of n.topics) freq.set(t, (freq.get(t) ?? 0) + 1)
  return freq
}

export interface TopicHub {
  topic: TopicDef
  items: Record<NodeType, GraphNode[]>
  count: number
  types: number
  hasHub: boolean
  /** Other topics that share work with this one, strongest first. */
  related: { topic: TopicDef; shared: number; hasHub: boolean }[]
  narrower: TopicDef[]
  broader: TopicDef[]
}

const EMPTY = (): Record<NodeType, GraphNode[]> => ({ project: [], research: [], publication: [], post: [], talk: [] })

function collect(slug: string): { items: Record<NodeType, GraphNode[]>; count: number; types: number } {
  const items = EMPTY()
  for (const n of getNodes()) if (n.topics.includes(slug)) items[n.type].push(n)
  for (const list of Object.values(items)) {
    list.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '') || a.title.localeCompare(b.title))
  }
  const count = Object.values(items).reduce((s, l) => s + l.length, 0)
  const types = Object.values(items).filter((l) => l.length > 0).length
  return { items, count, types }
}

/** True when the topic is written up and has enough distinct work behind it. */
export function topicHasHub(slug: string): boolean {
  if (hubCache.has(slug) && process.env.NODE_ENV === 'production') return hubCache.get(slug)!
  const result = computeHasHub(slug)
  hubCache.set(slug, result)
  return result
}

function computeHasHub(slug: string): boolean {
  const def = getTopicDef(slug)
  if (!def?.intro || !def.description) return false
  const { items, count } = collect(slug)
  const substantive = count - items.talk.length
  return count >= HUB_THRESHOLD.minItems && substantive >= HUB_THRESHOLD.minSubstantive
}

export function getHubTopics(): TopicDef[] {
  return TOPICS.filter((t) => topicHasHub(t.slug))
}

export function getTopicHub(slug: string): TopicHub | undefined {
  const topic = getTopicDef(slug)
  if (!topic) return undefined
  const { items, count, types } = collect(slug)

  const shared = new Map<string, number>()
  for (const n of getNodes()) {
    if (!n.topics.includes(slug)) continue
    for (const t of n.topics) if (t !== slug) shared.set(t, (shared.get(t) ?? 0) + 1)
  }
  const related = [...shared.entries()]
    .map(([s, c]) => ({ topic: getTopicDef(s)!, shared: c, hasHub: topicHasHub(s) }))
    .filter((r) => r.topic)
    .sort((a, b) => b.shared - a.shared || a.topic.name.localeCompare(b.topic.name))
    .slice(0, 12)

  return {
    topic, items, count, types, hasHub: topicHasHub(slug), related,
    narrower: TOPICS.filter((t) => t.broader?.includes(slug)),
    broader: (topic.broader ?? []).map((s) => getTopicDef(s)!).filter(Boolean),
  }
}

/** Where a topic should link: its hub if it has one, otherwise nowhere. */
export function topicHref(slug: string): string | null {
  return topicHasHub(slug) ? `/topics/${slug}` : null
}

// --- Connections -------------------------------------------------------------

export interface Connection {
  node: GraphNode
  score: number
  /** Shared topics, rarest first, for "why is this related". */
  via: TopicDef[]
  stated: boolean
}

/**
 * Nodes connected to a given node, best first, grouped by type.
 *
 * Score is the sum of inverse frequencies of the shared topics, so sharing
 * "echo state networks" (on two nodes) outweighs sharing "Python" (on many),
 * plus a large bonus for a stated link. Zero means unrelated, and unrelated
 * nodes are never returned to pad a list.
 */
export function getConnections(type: NodeType, key: string, perType = 4): Record<NodeType, Connection[]> {
  const nodes = getNodes()
  const self = nodes.find((n) => n.type === type && n.key === key)
  const out = EMPTY() as unknown as Record<NodeType, Connection[]>
  if (!self) return out
  const freq = topicFrequency()
  const selfRef = `${self.type}:${self.key}`

  const scored: Connection[] = []
  for (const n of nodes) {
    if (n === self) continue
    const sharedTopics = n.topics.filter((t) => self.topics.includes(t))
    const stated = self.links.includes(`${n.type}:${n.key}`) || n.links.includes(selfRef)
    const score = sharedTopics.reduce((s, t) => s + 1 / (freq.get(t) ?? 1), 0) + (stated ? 10 : 0)
    if (score <= 0) continue
    const via = sharedTopics
      .sort((a, b) => (freq.get(a) ?? 0) - (freq.get(b) ?? 0))
      .map((t) => getTopicDef(t)!)
      .filter(Boolean)
    scored.push({ node: n, score, via, stated })
  }
  scored.sort((a, b) => b.score - a.score || a.node.title.localeCompare(b.node.title))
  for (const c of scored) {
    const list = out[c.node.type]
    // Talks in the same series all link to one page; show that page once.
    if (list.some((x) => x.node.href === c.node.href && c.node.type === 'talk')) continue
    if (list.length < perType) list.push(c)
  }
  return out
}

/** A reference to a topic as a DefinedTerm, for `about` and `knowsAbout`. */
export function definedTermRef(slug: string) {
  const t = getTopicDef(slug)
  if (!t) return null
  return {
    '@type': 'DefinedTerm',
    '@id': topicId(slug),
    name: t.name,
    inDefinedTermSet: topicSetId(),
    ...(t.wikidata ? { sameAs: `https://www.wikidata.org/wiki/${t.wikidata}` } : {}),
  }
}

/** Every ontology slug a node, publication or project refers to, for validation. */
export function allReferencedTopics(): string[] {
  return unique(getNodes().flatMap((n) => n.topics))
}

/**
 * Where a blog tag chip should point. A tag whose topic has a hub goes to the
 * hub, because /tags/<slug> now redirects there; any other tag keeps its tag
 * page. Linking straight to the destination avoids a redirect on every click.
 */
export function tagHref(tag: string): string {
  const topic = TAG_TO_TOPIC[tag.toLowerCase()]
  if (topic && topicHasHub(topic)) return `/topics/${topic}`
  return `/tags/${slugifyTag(tag)}`
}
