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
    // The syndication targets. A cross-post carries a canonical back here, but
    // the canonical is a hint about which copy ranks, not a statement about who
    // wrote it. Declaring the profiles says the dev.to and Medium accounts are
    // the same person, rather than someone reposting his work.
    SOCIAL_LINKS.devto,
    SOCIAL_LINKS.medium,
    `https://www.semanticscholar.org/author/${SEMANTIC_SCHOLAR_AUTHOR_ID}`,
    // Emitted only once SOCIAL_LINKS.orcid is filled, so an empty ORCID
    // never becomes a broken profile link.
    ...(SOCIAL_LINKS.orcid ? [SOCIAL_LINKS.orcid] : []),
  ].filter(Boolean)
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
    jobTitle: 'Lead Data Scientist, AI Engineer and Applied Researcher',
    description:
      'Builds production AI and data systems, reusable open source infrastructure and applied research. Nine years across banking and insurance, telecommunications and research. Author of Ubunye Engine and founder of Ubunye AI Ecosystems.',
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
/**
 * A page that is primarily about the person, e.g. /about and /resume.
 *
 * `ProfilePage` with `mainEntity` pointing at the Person is what tells a
 * knowledge graph "this page is the profile of that entity" rather than "this
 * page happens to mention them". Without it the About page carried no
 * structured data at all and the strongest biography on the site was invisible
 * to machines.
 */
export function profilePageSchema(input: {
  path: string
  name: string
  description: string
  dateModified?: string
}) {
  const url = absoluteUrl(input.path)
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${url}#profile`,
    url,
    name: input.name,
    description: input.description,
    inLanguage: 'en',
    isPartOf: webSiteRef(),
    mainEntity: personRef(),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
  }
}

/** An ordinary page, so every route resolves to the site and the person. */
export function webPageSchema(input: {
  path: string
  name: string
  description: string
}) {
  const url = absoluteUrl(input.path)
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#page`,
    url,
    name: input.name,
    description: input.description,
    inLanguage: 'en',
    isPartOf: webSiteRef(),
    about: personRef(),
  }
}

/**
 * An open source project, as code rather than as a page about code.
 *
 * This is the node that was missing entirely. Ubunye Engine has a repository, a
 * documentation site and a published package, and without a
 * `SoftwareSourceCode` entity naming the same Person as author it does not
 * exist as a thing a knowledge graph can attach to him.
 *
 * `programmingLanguage` and `codeRepository` come from the project record. No
 * adoption figure, star count or user number is asserted anywhere, because none
 * can be verified from this repository.
 */
export function softwareSourceCodeSchema(input: {
  name: string
  description: string
  codeRepository: string
  url?: string
  programmingLanguage: string[]
  slug: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    '@id': `${SITE_URL}/work#${input.slug}`,
    name: input.name,
    description: input.description,
    codeRepository: input.codeRepository,
    ...(input.url ? { url: input.url } : {}),
    programmingLanguage: input.programmingLanguage,
    author: personRef(),
    maintainer: personRef(),
    isPartOf: webSiteRef(),
    license: 'https://opensource.org/licenses/MIT',
  }
}

/**
 * A recorded talk.
 *
 * `uploadDate` is required by consumers for VideoObject; the talk records carry
 * a date, so nothing is guessed. `embedUrl` is deliberately not asserted: the
 * records hold a watch URL, and claiming an embed URL that may not exist would
 * be a fabricated field.
 */
export function videoObjectSchema(input: {
  title: string
  description: string
  date: string
  videoUrl: string
  event: string
}) {
  return {
    '@type': 'VideoObject',
    name: input.title,
    description: input.description,
    uploadDate: new Date(input.date).toISOString(),
    contentUrl: input.videoUrl,
    url: input.videoUrl,
    author: personRef(),
    creator: personRef(),
    ...(input.event ? { recordedAt: { '@type': 'Event', name: input.event } } : {}),
  }
}

/** The talks page: a list of the recorded talks above. */
export function talksSchema(talks: {
  title: string
  description: string
  date: string
  videoUrl: string
  event: string
}[]) {
  const url = absoluteUrl('/talks')
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    url,
    name: 'Talks and press',
    inLanguage: 'en',
    isPartOf: webSiteRef(),
    about: personRef(),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: talks.length,
      itemListElement: talks.map((talk, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: videoObjectSchema(talk),
      })),
    },
  }
}

/**
 * A course.
 *
 * Only `name`, `description` and provider are asserted. No `CourseInstance`,
 * no start date, no price and no enrolment figure: the courses are in
 * preparation and every one of those fields would be a claim the repository
 * cannot support.
 */
export function coursesSchema(courses: { title: string; description: string; slug: string }[]) {
  const url = absoluteUrl('/courses')
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    url,
    name: 'Courses',
    inLanguage: 'en',
    isPartOf: webSiteRef(),
    about: personRef(),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: courses.length,
      itemListElement: courses.map((course, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Course',
          name: course.title,
          description: course.description,
          url: `${url}#${course.slug}`,
          provider: personRef(),
        },
      })),
    },
  }
}

/**
 * A work case study, as a CreativeWork tied to the one Person entity.
 *
 * Used for the non-software /work stories (systems, research, community) that
 * are not SoftwareSourceCode. `keywords` carries the topics so a knowledge graph
 * can connect the story to the same subjects the articles use. No metric is
 * asserted here that the page does not state.
 */
export function creativeWorkSchema(input: {
  slug: string
  name: string
  description: string
  topics: string[]
  artifactUrls: string[]
}) {
  const url = `${SITE_URL}/work/${input.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${url}#work`,
    url,
    name: input.name,
    description: input.description,
    keywords: input.topics.join(', '),
    inLanguage: 'en',
    isPartOf: webSiteRef(),
    author: personRef(),
    creator: personRef(),
    ...(input.artifactUrls.length ? { sameAs: input.artifactUrls } : {}),
  }
}

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
