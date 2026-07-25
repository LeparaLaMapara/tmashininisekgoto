import { COURSES, PROJECTS, PUBLICATIONS, TALKS, WRITINGS } from '@/lib/data'
import { getAllPosts } from '@/lib/blog'

/**
 * Server-side search across everything on the site.
 *
 * Runs on the server so /search?q=… returns real HTML, which is what makes the
 * WebSite SearchAction in lib/schema.ts a truthful claim rather than a broken
 * promise. The command palette stays a separate, client-side convenience.
 */

export type SearchKind = 'Page' | 'Post' | 'Project' | 'Talk' | 'Publication' | 'Course' | 'Writing'

export interface SearchResult {
  kind: SearchKind
  title: string
  description: string
  href: string
  /** Higher is better. */
  score: number
}

interface Indexed {
  kind: SearchKind
  title: string
  description: string
  href: string
  /** Extra text that should match but is not shown. */
  keywords: string
}

const PAGES: Indexed[] = [
  {
    kind: 'Page',
    title: 'About',
    description: 'Who Thabang is, how he works, and the tools he builds with.',
    href: '/about',
    keywords: 'about bio biography background tech stack',
  },
  {
    kind: 'Page',
    title: 'Work',
    description: 'Projects across open source, telecoms, banking, research, and education.',
    href: '/work',
    keywords: 'projects portfolio case studies proof',
  },
  {
    kind: 'Page',
    title: 'Publications',
    description: 'Peer-reviewed papers, preprints, and thesis work.',
    href: '/publications',
    keywords: 'papers research scholar citations doi',
  },
  {
    kind: 'Page',
    title: 'Blog',
    description: 'Writing on AI systems, MLOps, and open source engineering.',
    href: '/blog',
    keywords: 'articles posts writing essays',
  },
  {
    kind: 'Page',
    title: 'Talks and press',
    description: 'Conference talks, sessions, interviews, and coverage.',
    href: '/talks',
    keywords: 'speaking conference interview podcast press media',
  },
  {
    kind: 'Page',
    title: 'Career journey',
    description: 'The path from BSc at Wits to Lead Data Scientist.',
    href: '/career',
    keywords: 'career history journey timeline experience',
  },
  {
    kind: 'Page',
    title: 'Resume',
    description: 'Full career history and credentials.',
    href: '/resume',
    keywords: 'cv resume hire hiring experience',
  },
  {
    kind: 'Page',
    title: 'Courses',
    description: 'Practitioner-first AI and data science teaching.',
    href: '/courses',
    keywords: 'teaching training learn course workshop',
  },
  {
    kind: 'Page',
    title: 'Thabang AI Assist',
    description: 'An AI assistant grounded on Thabang’s real work, with citations.',
    href: '/ai',
    keywords: 'ai assistant chat ask rag grounded',
  },
  {
    kind: 'Page',
    title: 'Now',
    description: 'What Thabang is working on at the moment.',
    href: '/now',
    keywords: 'now current present today focus',
  },
]

/** Everything searchable, built fresh per request (all sources are local). */
function buildIndex(): Indexed[] {
  const posts: Indexed[] = getAllPosts().map((post) => ({
    kind: 'Post',
    title: post.title,
    description: post.summary,
    href: `/blog/${post.slug}`,
    // Body text included so search reaches inside articles.
    keywords: `${post.tags.join(' ')} ${post.content}`,
  }))

  const projects: Indexed[] = PROJECTS.map((project) => ({
    kind: 'Project',
    title: project.title,
    description: project.problem,
    href: '/work',
    keywords: `${project.solution} ${project.impact} ${project.skills.join(' ')} ${project.category}`,
  }))

  const publications: Indexed[] = PUBLICATIONS.map((pub) => ({
    kind: 'Publication',
    title: pub.title,
    description: pub.aiSummary,
    href: '/publications',
    keywords: `${pub.authors} ${pub.venue} ${pub.year} ${pub.applications.join(' ')}`,
  }))

  const talks: Indexed[] = TALKS.map((talk) => ({
    kind: 'Talk',
    title: talk.title,
    description: talk.description,
    href: '/talks',
    keywords: `${talk.event} ${talk.date}`,
  }))

  const courses: Indexed[] = COURSES.map((course) => ({
    kind: 'Course',
    title: course.title,
    description: course.description,
    href: '/courses',
    keywords: `${course.subtitle} ${course.level} ${course.duration} ${course.format} ${course.modules.join(' ')}`,
  }))

  const writings: Indexed[] = WRITINGS.map((writing) => ({
    kind: 'Writing',
    title: writing.title,
    description: writing.description,
    href: '/talks',
    keywords: writing.date,
  }))

  return [...PAGES, ...posts, ...projects, ...publications, ...talks, ...courses, ...writings]
}

/**
 * Scores a document against the query terms. Title matches count most, then the
 * description, then the hidden keyword blob. A document must match every term to
 * be returned, which keeps multi-word queries precise.
 */
function scoreDocument(doc: Indexed, terms: string[]): number {
  const title = doc.title.toLowerCase()
  const description = doc.description.toLowerCase()
  const keywords = doc.keywords.toLowerCase()

  let score = 0
  for (const term of terms) {
    const inTitle = title.includes(term)
    const inDescription = description.includes(term)
    const inKeywords = keywords.includes(term)
    if (!inTitle && !inDescription && !inKeywords) return 0

    if (inTitle) score += title.startsWith(term) ? 12 : 8
    if (inDescription) score += 3
    if (inKeywords) score += 1
  }
  return score
}

/** Ranked results for a query. Empty query returns nothing. */
export function search(query: string, limit = 30): SearchResult[] {
  const terms = query.toLowerCase().split(/\s+/).map((t) => t.trim()).filter(Boolean)
  if (!terms.length) return []

  return buildIndex()
    .map((doc) => ({
      kind: doc.kind,
      title: doc.title,
      description: doc.description,
      href: doc.href,
      score: scoreDocument(doc, terms),
    }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit)
}
