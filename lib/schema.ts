import {
  SEMANTIC_SCHOLAR_AUTHOR_ID,
  SOCIAL_LINKS,
  type Publication,
} from '@/lib/data'
import { getPublications } from '@/lib/publications'
import { SITE_URL, absoluteUrl } from '@/lib/site'

/**
 * JSON-LD builders. Each returns a plain object for `<JsonLd>` to serialise, so
 * the shapes stay testable and there is exactly one definition of each entity.
 *
 * Every URL is absolute, as schema.org requires. Nothing here is invented: the
 * facts come from lib/data.ts and the MDX frontmatter.
 */

const PERSON_ID = `${SITE_URL}/#person`
const WEBSITE_ID = `${SITE_URL}/#website`

const WITS = {
  '@type': 'CollegeOrUniversity',
  name: 'University of the Witwatersrand',
  sameAs: 'https://www.wits.ac.za/',
} as const

/**
 * Profiles that prove the same person across the web. ORCID and Medium are
 * deliberately absent: no ORCID exists yet and no Medium profile is recorded in
 * the repo. Add them here once they do, rather than guessing a URL.
 */
/**
 * A self-contained reference to the Person.
 *
 * Keeping the `@id` lets consumers tie this back to the full Person entity on
 * the homepage, but `name` and `url` are repeated so the node stands on its own.
 * A bare `{ '@id': … }` pointing at an entity defined on a *different* page is
 * not reliably resolved by search engines, which would leave posts effectively
 * authorless.
 */
function personRef() {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Thabang Mashinini-Sekgoto',
    url: SITE_URL,
  }
}

/** Same reasoning as personRef: self-contained rather than a cross-page pointer. */
function webSiteRef() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: 'Thabang Mashinini-Sekgoto',
    url: SITE_URL,
  }
}

function sameAsProfiles(): string[] {
  return [
    SOCIAL_LINKS.github,
    SOCIAL_LINKS.linkedin,
    SOCIAL_LINKS.scholar,
    SOCIAL_LINKS.twitter,
    SOCIAL_LINKS.youtube,
    SOCIAL_LINKS.instagram,
    `https://www.semanticscholar.org/author/${SEMANTIC_SCHOLAR_AUTHOR_ID}`,
  ]
}

/** The Person entity. Emitted once, on the homepage, and referenced by @id elsewhere. */
export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Thabang Mashinini-Sekgoto',
    givenName: 'Thabang',
    familyName: 'Mashinini-Sekgoto',
    url: SITE_URL,
    image: absoluteUrl('/avatar.svg'),
    jobTitle: 'Lead Data Scientist',
    description:
      'Data Science and AI leader building enterprise-scale machine learning across banking, telecoms, research, and education. PhD candidate at the University of the Witwatersrand and founder of Ubunye AI Ecosystems.',
    worksFor: { '@type': 'Organization', name: 'ABSA Insurance' },
    affiliation: [
      WITS,
      { '@type': 'Organization', name: 'Ubunye AI Ecosystems' },
    ],
    alumniOf: WITS,
    nationality: { '@type': 'Country', name: 'South Africa' },
    knowsAbout: [
      'Machine Learning',
      'Data Science',
      'MLOps',
      'Self-Supervised Learning',
      'Remote Sensing',
      'Apache Spark',
      'Databricks',
      'Distributed Systems',
      'AI Agents',
    ],
    sameAs: sameAsProfiles(),
  }
}

/**
 * The WebSite entity, including SearchAction so search engines can offer a
 * sitelinks search box. `target` points at the real /search route; declaring a
 * SearchAction without a working results URL is invalid markup.
 */
export function webSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: 'Thabang Mashinini-Sekgoto',
    description:
      'Personal site of Thabang Mashinini-Sekgoto: AI systems, machine learning engineering, and published research.',
    inLanguage: 'en',
    publisher: personRef(),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

interface BlogPostingInput {
  slug: string
  title: string
  description: string
  datePublished: string
  dateModified: string
  tags: string[]
  imageUrl: string
}

/** A blog post. `BlogPosting` rather than the looser `Article`. */
export function blogPostingSchema(post: BlogPostingInput) {
  const url = absoluteUrl(`/blog/${post.slug}`)
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#post`,
    headline: post.title,
    description: post.description,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    url,
    image: post.imageUrl,
    keywords: post.tags.join(', '),
    inLanguage: 'en',
    author: personRef(),
    publisher: personRef(),
    isPartOf: webSiteRef(),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url, url },
  }
}

/** "MCI Madahana, JED Ekoru, TL Mashinini" -> Person nodes. */
function parseAuthors(authors: string) {
  return authors
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name) => ({ '@type': 'Person' as const, name }))
}

/**
 * Journal name from a venue string, e.g.
 *   'IFAC-PapersOnLine 52 (14), 117-122' -> 'IFAC-PapersOnLine'
 *   'arXiv preprint arXiv:2102.00085'    -> 'arXiv preprint'
 * Falls back to the whole string when there is no volume/number to strip.
 */
function journalName(venue: string): string {
  const trimmed = venue.split(/\s+\d/)[0].trim()
  return trimmed || venue
}

/**
 * A publication. Theses are typed `Thesis`, everything else `ScholarlyArticle`,
 * because the MSc dissertation is not a journal article and claiming otherwise
 * would be wrong.
 */
export function publicationSchema(pub: Publication) {
  const isThesis = /thesis/i.test(pub.venue)

  const base: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': isThesis ? 'Thesis' : 'ScholarlyArticle',
    headline: pub.title,
    name: pub.title,
    abstract: pub.aiSummary,
    datePublished: String(pub.year),
    author: parseAuthors(pub.authors),
    inLanguage: 'en',
    url: pub.scholarUrl,
  }

  if (isThesis) {
    base.inSupportOf = 'MSc'
    base.publisher = WITS
  } else {
    base.isPartOf = { '@type': 'Periodical', name: journalName(pub.venue) }
  }

  const sameAs: string[] = []
  if (pub.doi) {
    base.identifier = { '@type': 'PropertyValue', propertyID: 'DOI', value: pub.doi }
    sameAs.push(`https://doi.org/${pub.doi}`)
  }
  if (pub.semanticScholarId) {
    sameAs.push(`https://www.semanticscholar.org/paper/${pub.semanticScholarId}`)
  }
  if (sameAs.length) base.sameAs = sameAs

  if (typeof pub.citations === 'number') {
    base.interactionStatistic = {
      '@type': 'InteractionCounter',
      interactionType: 'https://schema.org/CiteAction',
      userInteractionCount: pub.citations,
    }
  }

  return base
}

/**
 * All publications, for the /publications page.
 *
 * Reads the enriched list rather than the raw one so `interactionStatistic`
 * carries the same citation figure the page prints. Two different numbers for
 * the same paper, one in the markup and one on screen, is the kind of mismatch
 * that gets structured data ignored.
 */
export function publicationsSchema() {
  return getPublications().map((pub) =>
    publicationSchema({ ...pub, citations: pub.bestCitation?.count ?? pub.citations })
  )
}

/** Breadcrumbs for nested routes. `path` is site-relative. */
export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  }
}

/** A tag landing page: a curated collection of posts. */
export function collectionPageSchema(input: {
  name: string
  description: string
  path: string
  items: { title: string; slug: string }[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${absoluteUrl(input.path)}#collection`,
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    inLanguage: 'en',
    isPartOf: webSiteRef(),
    about: personRef(),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: input.items.length,
      itemListElement: input.items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.title,
        url: absoluteUrl(`/blog/${item.slug}`),
      })),
    },
  }
}
