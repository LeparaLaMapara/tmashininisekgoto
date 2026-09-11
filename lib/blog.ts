import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { slugifyTag } from '@/lib/topics'

const CONTENT_DIR = path.join(process.cwd(), 'content/blog')

export interface BlogPost {
  slug: string
  title: string
  date: string
  tags: string[]
  summary: string
  readingTime: string
  content: string
  published: boolean
  /**
   * When the content was last meaningfully revised, ISO format. Used for
   * `dateModified` in BlogPosting schema and for sitemap freshness.
   *
   * Comes from the optional `updated` frontmatter field, falling back to
   * `date`. It deliberately does NOT use the file mtime: git does not preserve
   * mtimes, so on a fresh CI checkout every post looks like it changed at
   * deploy time. That tells crawlers all eighteen posts were revised on every
   * push, which is false and trains them to ignore the signal.
   *
   * Set `updated` by hand when a post is substantively rewritten. A typo fix
   * does not need it.
   */
  lastModified: string
  /**
   * Canonical URL override, for the rare case where this post was originally
   * published somewhere else. Leave unset for original work.
   *
   * NOTE for cross-posting: when you republish to Medium, dev.to or Hashnode,
   * the canonical tag goes on THAT copy pointing back here. Setting it here
   * hands the ranking away, which is the opposite of what you want.
   */
  canonical?: string
  /**
   * Optional override for the `<title>` tag only. The visible H1 keeps `title`.
   *
   * Search results truncate around 60 characters including the site-name suffix,
   * and a good headline is often longer than that. Set this to give the SERP a
   * shorter, front-loaded version without shortening the headline readers see.
   */
  seoTitle?: string
  /**
   * Optional override for the `<meta name="description">` only. `summary` does
   * double duty as the visible excerpt on /blog and the search-result snippet,
   * and a good excerpt is often far longer than the ~155 chars search engines
   * show. Set this when you want the snippet to differ from the excerpt.
   */
  seoDescription?: string
  /**
   * The collection this post belongs to, e.g. "The Practical Roadmap to
   * Building With AI Agents". Set in frontmatter as `series`.
   *
   * Posts that are really one argument split across several pieces read as
   * disconnected fragments in a reverse chronological list. This is what lets
   * the index present them as one body of work.
   */
  series?: string
  /** Position within `series`, 1 based. Set in frontmatter as `seriesPart`. */
  seriesPart?: number
  /**
   * How many parts the finished series will have, from `seriesTotal`.
   *
   * Deliberately the planned total rather than the published count, so a
   * reader landing on part one knows what they are starting. Unpublished parts
   * are never listed or linked.
   */
  seriesTotal?: number
  /**
   * The day this post goes live, YYYY-MM-DD, from `publishOn`.
   *
   * A scheduled post stays `published: false` until the publish-scheduled
   * workflow flips it on this date. `date` is set to the same day (a test
   * holds them together), so the file says when readers first saw the post.
   * `publishOn` is still needed as the trigger: a held draft also has
   * `published: false` and a past `date`, and must not go out. When both are
   * present `publishOn` wins, so a post moved without updating `date` still
   * shows the day it actually went live.
   */
  publishOn?: string
}

export interface Series {
  name: string
  /** Published parts only, in reading order. */
  posts: BlogPost[]
  /** Planned length, which can exceed `posts.length` while a series is in progress. */
  total: number
}

/**
 * The search-result snippet for a post, kept under Google's ~155 char cut-off.
 *
 * Prefers an explicit `seoDescription`, then falls back to the summary trimmed
 * at a sentence boundary. Trimming at a sentence beats letting Google chop
 * mid-word, and it keeps the visible excerpt on /blog untouched.
 */
export function metaDescription(post: BlogPost, limit = 155): string {
  if (post.seoDescription) return post.seoDescription
  const summary = post.summary.trim()
  if (summary.length <= limit) return summary

  // Prefer whole sentences: a snippet that ends cleanly reads better than one
  // cut mid-thought.
  const sentences = summary.match(/[^.!?]+[.!?]+/g) ?? []
  let out = ''
  for (const sentence of sentences) {
    if ((out + sentence).trim().length > limit) break
    out += sentence
  }

  // But do not leave most of the budget unused. A short opening sentence
  // followed by a long one ("The engine is now on version 0.5.0. This part
  // shows how to…") would otherwise yield a 35-character snippet and waste the
  // space Google would have shown. Below this threshold, fill to the word
  // boundary instead.
  const MIN_USEFUL = Math.floor(limit * 0.6)
  if (out.trim().length >= MIN_USEFUL) return out.trim()

  const cut = summary.slice(0, limit - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`
}

function parsePost(fileName: string): BlogPost {
  const slug = fileName.replace(/\.mdx?$/, '')
  const filePath = path.join(CONTENT_DIR, fileName)
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const stats = readingTime(content)

  const toIso = (value: unknown): string | null => {
    if (!value) return null
    const parsed = new Date(value.toString())
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString()
  }
  const publishOn = toIso(data.publishOn)?.slice(0, 10)
  const publishedAt = (data.publishOn ?? data.date)?.toString() ?? ''
  const lastModified = toIso(data.updated) ?? toIso(publishedAt) ?? publishedAt

  return {
    slug,
    title: data.title ?? slug,
    date: publishedAt,
    tags: (data.tags as string[]) ?? [],
    summary: data.summary ?? '',
    readingTime: stats.text,
    content,
    published: data.published !== false,
    lastModified,
    canonical: data.canonical,
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    series: data.series,
    seriesPart: data.seriesPart,
    seriesTotal: data.seriesTotal,
    publishOn,
  }
}

/**
 * The line under the title on the share card.
 *
 * The card fits roughly a hundred characters, and a hard slice at that number
 * ends mid-phrase: "I used it like a senior engineer sitting next to me, and".
 * Cut on a word and mark the cut, so the line reads as trimmed rather than as
 * a sentence that fell off a cliff.
 */
export function cardSubtitle(summary: string, limit = 100): string {
  const text = summary.trim()
  if (text.length <= limit) return text

  const cut = text.slice(0, limit)
  const lastSpace = cut.lastIndexOf(' ')
  let trimmed = cut.slice(0, lastSpace > 0 ? lastSpace : limit)

  // Cutting on a word is not enough on its own. "…sitting next to me, and"
  // ends on a conjunction that promises a clause the card will never show,
  // which reads as a bug rather than as a trim. Drop trailing words that
  // cannot end a thought, then any punctuation they leave behind.
  const DANGLING = /\s+(and|but|or|nor|so|yet|the|a|an|to|of|for|in|on|at|by|with|from|as|that|which|is|was|are|were)$/i
  let previous = ''
  while (previous !== trimmed) {
    previous = trimmed
    trimmed = trimmed.replace(DANGLING, '').replace(/[\s,;:]+$/, '')
  }

  return `${trimmed.replace(/[\s,;:.]+$/, '')}…`
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(CONTENT_DIR)) return []

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx'))

  return files
    .map(parsePost)
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * Published posts grouped into their series, in reading order.
 *
 * Ordered by the most recent part in each series, so an active series sits
 * above one finished two years ago. A series with nothing published yet does
 * not appear at all.
 */
export function getSeries(): Series[] {
  const grouped = new Map<string, BlogPost[]>()

  for (const post of getAllPosts()) {
    if (!post.series) continue
    const existing = grouped.get(post.series) ?? []
    existing.push(post)
    grouped.set(post.series, existing)
  }

  return Array.from(grouped.entries())
    .map(([name, posts]) => ({
      name,
      posts: posts.sort((a, b) => (a.seriesPart ?? 0) - (b.seriesPart ?? 0)),
      total: Math.max(...posts.map((p) => p.seriesTotal ?? p.seriesPart ?? 1)),
    }))
    .sort((a, b) => {
      const latest = (s: Series) =>
        Math.max(...s.posts.map((p) => new Date(p.date).getTime()))
      return latest(b) - latest(a)
    })
}

/**
 * Posts that exist but are not live, mapped to their `publishOn` date when
 * they are scheduled.
 *
 * Used to render a link to such a post as plain text (with its date, when it
 * has one), so a series part can point at the next one before it exists
 * without handing readers or crawlers a 404.
 */
export function getUnpublishedPosts(): Map<string, string | undefined> {
  if (!fs.existsSync(CONTENT_DIR)) return new Map()

  return new Map(
    fs
      .readdirSync(CONTENT_DIR)
      .filter((f) => f.endsWith('.mdx'))
      .map(parsePost)
      .filter((post) => !post.published)
      .map((post) => [post.slug, post.publishOn]),
  )
}

export function getPostBySlug(slug: string): BlogPost | null {
  const fileName = `${slug}.mdx`
  const filePath = path.join(CONTENT_DIR, fileName)

  if (!fs.existsSync(filePath)) return null

  return parsePost(fileName)
}

export interface TagSummary {
  /** Display name, lowercased, e.g. `open source`. */
  name: string
  /** URL segment, e.g. `open-source`. */
  slug: string
  count: number
}

export function getAllTags(): TagSummary[] {
  const posts = getAllPosts()
  const tagMap = new Map<string, number>()

  for (const post of posts) {
    for (const tag of post.tags) {
      const lower = tag.toLowerCase()
      tagMap.set(lower, (tagMap.get(lower) ?? 0) + 1)
    }
  }

  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, slug: slugifyTag(name), count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

export function getPostsByTag(tag: string): BlogPost[] {
  const lower = tag.toLowerCase()
  return getAllPosts().filter((post) =>
    post.tags.some((t) => t.toLowerCase() === lower)
  )
}

/**
 * Posts for a slugified tag, e.g. `open-source` matches the `open source` tag.
 * Tag pages are addressed by slug, so this is the lookup they use.
 */
export function getPostsBySlug(slug: string): BlogPost[] {
  return getAllPosts().filter((post) =>
    post.tags.some((tag) => slugifyTag(tag) === slug)
  )
}

/** The display name for a slug, or undefined if no post uses it. */
export function getTagNameBySlug(slug: string): string | undefined {
  return getAllTags().find((tag) => tag.slug === slug)?.name
}
