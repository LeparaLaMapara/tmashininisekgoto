import { PROJECTS, PUBLICATIONS, TALKS, type Project, type Publication, type Talk } from '@/lib/data'
import { getAllPosts, type BlogPost } from '@/lib/blog'

/**
 * Cross-type "related content".
 *
 * The old related-posts logic only ever compared articles by shared tags. This
 * generalises it: an article about production ML can surface the Vodacom system,
 * a relevant talk and a paper, because they share a vocabulary even though their
 * metadata is shaped completely differently.
 *
 * Everything is deterministic and derives from metadata that already exists.
 * There are no embeddings and no model call: at this scale, weighted overlap of
 * the terms the content already carries is enough, and it is testable, which the
 * brief requires. If the metadata ever proves too sparse to relate things well,
 * that is the point to measure whether embeddings would actually help.
 */

export type RelatedType = 'Post' | 'Project' | 'Publication' | 'Talk'

export interface RelatedItem {
  type: RelatedType
  /** Stable identity within its type, used to exclude self and de-duplicate. */
  key: string
  title: string
  href: string
  /** One-line context for the card. */
  blurb: string
}

/** A candidate plus the weighted terms it is compared on. */
interface Node extends RelatedItem {
  /** term -> weight. Explicit metadata (tags, tech, category) outweighs title words. */
  terms: Map<string, number>
}

// Weights. Explicit, curated metadata is a far stronger signal of relatedness
// than a word two titles happen to share, so it counts for more.
const W_STRONG = 3 // tags, skills/technologies, category, applications, event
const W_TITLE = 1 // a meaningful word in the title

const STOPWORDS = new Set([
  'a', 'an', 'the', 'to', 'of', 'for', 'in', 'on', 'at', 'by', 'as', 'with',
  'and', 'or', 'is', 'are', 'be', 'how', 'why', 'what', 'i', 'my', 'me', 'you',
  'your', 'it', 'its', 'this', 'that', 'from', 'into', 'a', 'not', 'using', 'use',
])

/** Lowercase word tokens of length >= 3 that are not stopwords. */
function titleTokens(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9+]+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w))
}

/**
 * A curated phrase like "ai agents" or "self-supervised learning" is kept whole
 * (a strong, specific signal) AND split into its words (so "agents" can still
 * match a title). Both are lowercased.
 */
function expandPhrase(phrase: string): string[] {
  const norm = phrase.toLowerCase().trim()
  if (!norm) return []
  const words = norm.split(/[^a-z0-9+]+/).filter((w) => w.length >= 3 && !STOPWORDS.has(w))
  return words.length > 1 ? [norm, ...words] : [norm]
}

function addTerms(map: Map<string, number>, terms: string[], weight: number) {
  for (const t of terms) {
    if (!t) continue
    map.set(t, Math.max(map.get(t) ?? 0, weight))
  }
}

function postNode(post: BlogPost): Node {
  const terms = new Map<string, number>()
  for (const tag of post.tags) addTerms(terms, expandPhrase(tag), W_STRONG)
  addTerms(terms, titleTokens(post.title), W_TITLE)
  return {
    type: 'Post', key: post.slug, title: post.title,
    href: `/blog/${post.slug}`, blurb: post.summary, terms,
  }
}

function projectNode(project: Project): Node {
  const terms = new Map<string, number>()
  for (const skill of project.skills) addTerms(terms, expandPhrase(skill), W_STRONG)
  addTerms(terms, expandPhrase(project.category), W_STRONG)
  addTerms(terms, titleTokens(project.title), W_TITLE)
  return {
    type: 'Project', key: project.slug, title: project.title,
    href: `/work/${project.slug}`, blurb: project.problem, terms,
  }
}

function publicationNode(pub: Publication): Node {
  const terms = new Map<string, number>()
  for (const app of pub.applications) addTerms(terms, expandPhrase(app), W_STRONG)
  addTerms(terms, titleTokens(pub.title), W_TITLE)
  return {
    type: 'Publication', key: pub.doi ?? pub.title, title: pub.title,
    href: '/publications', blurb: pub.aiSummary, terms,
  }
}

function talkNode(talk: Talk): Node {
  const terms = new Map<string, number>()
  for (const topic of talk.topics) addTerms(terms, expandPhrase(topic), W_STRONG)
  addTerms(terms, expandPhrase(talk.event), W_STRONG)
  addTerms(terms, titleTokens(talk.title), W_TITLE)
  return {
    type: 'Talk', key: String(talk.id), title: talk.title,
    href: talk.series === 'FabAcademic Unfiltered' ? '/talks/fabacademic-unfiltered' : '/talks',
    blurb: talk.description, terms,
  }
}

/** Every relatable thing on the site, built fresh (all sources are local). */
function buildNodes(): Node[] {
  return [
    ...getAllPosts().map(postNode),
    ...PROJECTS.map(projectNode),
    ...PUBLICATIONS.map(publicationNode),
    ...TALKS.map(talkNode),
  ]
}

/** Shared-term score, each shared term counting the smaller of the two weights. */
function similarity(a: Node, b: Node): number {
  let score = 0
  const [small, large] = a.terms.size <= b.terms.size ? [a.terms, b.terms] : [b.terms, a.terms]
  for (const [term, weight] of small) {
    const other = large.get(term)
    if (other) score += Math.min(weight, other)
  }
  return score
}

const TYPE_ORDER: Record<RelatedType, number> = { Post: 0, Project: 1, Publication: 2, Talk: 3 }

/**
 * Content related to a given item, best first.
 *
 * Excludes the item itself and any duplicate (same type + href + title). Ties
 * break by a stable order (type, then title) so results are deterministic and
 * testable. Returns nothing rather than padding with weak matches: a score of
 * zero means genuinely unrelated, and a bad recommendation is worse than none.
 */
export function getRelated(
  source: { type: RelatedType; key: string },
  limit = 4
): RelatedItem[] {
  const nodes = buildNodes()
  const self = nodes.find((n) => n.type === source.type && n.key === source.key)
  if (!self) return []

  const seen = new Set<string>([`${self.type}:${self.href}:${self.title}`])

  return nodes
    .filter((n) => !(n.type === self.type && n.key === self.key))
    .map((n) => ({ node: n, score: similarity(self, n) }))
    .filter((x) => x.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        TYPE_ORDER[a.node.type] - TYPE_ORDER[b.node.type] ||
        a.node.title.localeCompare(b.node.title)
    )
    .filter((x) => {
      const id = `${x.node.type}:${x.node.href}:${x.node.title}`
      if (seen.has(id)) return false
      seen.add(id)
      return true
    })
    .slice(0, limit)
    .map(({ node }) => ({
      type: node.type, key: node.key, title: node.title, href: node.href, blurb: node.blurb,
    }))
}

/** Convenience for the article page. */
export function getRelatedForPost(slug: string, limit = 4): RelatedItem[] {
  return getRelated({ type: 'Post', key: slug }, limit)
}
