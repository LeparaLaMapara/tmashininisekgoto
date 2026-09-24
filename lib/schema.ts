import {
  PROJECTS,
  PUBLICATIONS,
  SEMANTIC_SCHOLAR_AUTHOR_ID,
  SOCIAL_LINKS,
  type Project,
  type Publication,
} from '@/lib/data'
import { getPublications } from '@/lib/publications'
import { SITE_URL, absoluteUrl } from '@/lib/site'
import {
  PERSON_ID,
  WEBSITE_ID,
  definedTermRef,
  getConnections,
  getHubTopics,
  orgId,
  postId,
  projectId,
  publicationId,
  researchId,
  seriesId,
  topicHasHub,
  topicId,
  topicSetId,
  type GraphNode,
} from '@/lib/graph'
import { getTopicDef, TOPICS } from '@/lib/graph/topics'
import { ORGANIZATIONS, getOrg } from '@/lib/graph/organizations'
import { RESEARCH, type ResearchLine } from '@/lib/graph/research'

/**
 * JSON-LD builders. Each returns a plain object for `<JsonLd>` to serialise, so
 * the shapes stay testable and there is exactly one definition of each entity.
 *
 * Every entity has one stable `@id` (defined in lib/graph), used on every page
 * that mentions it, so the site's markup describes one connected graph rather
 * than a pile of unrelated fragments. Every URL is absolute, as schema.org
 * requires. Nothing here is invented: the facts come from lib/data.ts,
 * lib/graph/* and the MDX frontmatter.
 */

/**
 * Name variants the published record uses for the same person. Each has a
 * source: Crossref and Semantic Scholar (Thabang L. Mashinini), the EGU 2022
 * abstract and OpenAlex (Thabang Lukhetho Mashinini), arXiv and the NeurIPS
 * CCAI page (Thabang Mashinini), the papers' short author lists (T. L.
 * Mashinini) and PyPI package metadata (Thabang L. Mashinini-Sekgoto). Declaring them is what lets a scholarly index join the papers to
 * this Person rather than treating them as a stranger's.
 */
export const NAME_VARIANTS = [
  'Thabang Mashinini',
  'Thabang L. Mashinini',
  'Thabang Lukhetho Mashinini',
  'T. L. Mashinini',
  'Thabang L. Mashinini-Sekgoto',
]

/** Does an author string in a paper's author list refer to the subject? */
function isSubject(name: string): boolean {
  return /\bMashinini\b/i.test(name)
}

/** Drop undefined values and empty arrays, so optional facts are omitted, not blank. */
function clean<T extends Record<string, unknown>>(o: T): T {
  return Object.fromEntries(
    Object.entries(o).filter(([, v]) => v !== undefined && !(Array.isArray(v) && v.length === 0))
  ) as T
}

const terms = (slugs: string[]) => slugs.map(definedTermRef).filter(Boolean) as Record<string, unknown>[]

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

/** A self-contained reference to an organisation in the registry. */
export function orgRef(slug: string) {
  const o = getOrg(slug)
  if (!o) return undefined
  return clean({ '@type': o.type, '@id': orgId(slug), name: o.name, url: o.url })
}

/** The full organisation node, with its Wikidata identity and parent. */
export function orgSchema(slug: string) {
  const o = getOrg(slug)!
  const sameAs = [...(o.wikidata ? [`https://www.wikidata.org/wiki/${o.wikidata}`] : []), ...(o.sameAs ?? [])]
  return clean({
    '@context': 'https://schema.org',
    '@type': o.type,
    '@id': orgId(slug),
    name: o.name,
    url: o.url,
    sameAs,
    parentOrganization: o.parent ? orgRef(o.parent) : undefined,
    founder: o.foundedBySubject ? personRef() : undefined,
  })
}

/** The organisations the career and projects refer to, as full nodes. */
export function organizationsSchema() {
  return ORGANIZATIONS.map((o) => orgSchema(o.slug))
}

/**
 * Profiles that prove the same person across the web. Google Scholar is the
 * scholarly identity of record. ORCID is absent by decision, not by oversight
 * (see SOCIAL_LINKS.orcid); if one is ever registered, setting that field adds
 * it here automatically.
 */
export function sameAsProfiles(): string[] {
  return [
    SOCIAL_LINKS.github,
    SOCIAL_LINKS.linkedin,
    SOCIAL_LINKS.scholar,
    SOCIAL_LINKS.youtube,
    // The syndication targets. A cross-post carries a canonical back here, but
    // the canonical is a hint about which copy ranks, not a statement about who
    // wrote it. Declaring the profiles says the dev.to and Medium accounts are
    // the same person, rather than someone reposting his work.
    SOCIAL_LINKS.devto,
    SOCIAL_LINKS.medium,
    `https://www.semanticscholar.org/author/${SEMANTIC_SCHOLAR_AUTHOR_ID}`,
    // Emitted only if SOCIAL_LINKS.orcid is ever filled, so the absent ORCID
    // never becomes a broken or guessed profile link.
    ...(SOCIAL_LINKS.orcid ? [SOCIAL_LINKS.orcid] : []),
  ].filter(Boolean)
}

/**
 * The subjects the Person is known for, as DefinedTerms: every topic with a
 * hub page, plus the topics of his software and research, because those are
 * the specific subjects (Kalman filtering, echo state networks) that someone
 * who does not know his name would search for.
 */
function knowsAboutSlugs(): string[] {
  const slugs = new Set<string>(getHubTopics().map((t) => t.slug))
  for (const p of PROJECTS) if (p.kind === 'software') p.graphTopics.forEach((t) => slugs.add(t))
  for (const r of RESEARCH) if (r.page) r.topics.forEach((t) => slugs.add(t))
  return [...slugs].filter((t) => getTopicDef(t)?.kind !== 'technology' || topicHasHub(t))
}

/** The Person entity. Emitted in full on the homepage and /about, referenced by @id elsewhere. */
export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Thabang Mashinini-Sekgoto',
    alternateName: NAME_VARIANTS,
    givenName: 'Thabang',
    familyName: 'Mashinini-Sekgoto',
    url: SITE_URL,
    mainEntityOfPage: absoluteUrl('/about'),
    image: absoluteUrl('/avatar.svg'),
    jobTitle: 'Lead Data Scientist, AI Engineer and Applied Researcher',
    description:
      'Builds production AI and data systems, reusable open source infrastructure and applied research. Nine years across insurance, telecommunications, applied research and higher education. Author of Ubunye Engine and founder of Ubunye AI Ecosystems.',
    worksFor: orgRef('absa-insurance'),
    affiliation: [orgRef('ubunye-ai-ecosystems')],
    alumniOf: orgRef('wits'),
    homeLocation: { '@type': 'Place', name: 'Johannesburg, South Africa' },
    nationality: { '@type': 'Country', name: 'South Africa' },
    knowsAbout: terms(knowsAboutSlugs()),
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

/** A self-contained reference to a project, for mentions and lists. */
export function projectRef(p: Project) {
  return {
    '@type': p.kind === 'software' ? 'SoftwareSourceCode' : 'CreativeWork',
    '@id': projectId(p),
    name: p.kind === 'software' ? p.title : p.headline,
    url: absoluteUrl(`/work/${p.slug}`),
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
  /** Ontology topics (lib/graph): become `about` DefinedTerms. */
  topics?: string[]
  /** Project slugs the post discusses: become `mentions`. */
  projects?: string[]
  /** The series this post is a part of. */
  series?: { name: string; slug: string; part?: number }
}

/** A blog post. `BlogPosting` rather than the looser `Article`. */
export function blogPostingSchema(post: BlogPostingInput) {
  const url = absoluteUrl(`/blog/${post.slug}`)
  const mentioned = (post.projects ?? [])
    .map((slug) => PROJECTS.find((p) => p.slug === slug))
    .filter((p): p is Project => Boolean(p))
  return clean({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': postId(post.slug),
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
    isPartOf: post.series
      ? [
          webSiteRef(),
          {
            '@type': 'CreativeWorkSeries',
            '@id': seriesId(post.series.slug),
            name: post.series.name,
            url: absoluteUrl(`/blog/series/${post.series.slug}`),
          },
        ]
      : webSiteRef(),
    position: post.series?.part,
    about: terms(post.topics ?? []),
    mentions: mentioned.map(projectRef),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url, url },
  })
}

/**
 * "MCI Madahana, JED Ekoru, TL Mashinini" -> Person nodes, in order. The
 * subject's own entry becomes a reference to the one Person entity, carrying
 * the name as printed, so the paper is attached to him rather than to a
 * namesake.
 */
function parseAuthors(authors: string) {
  return authors
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name) => (isSubject(name) ? { ...personRef(), alternateName: name } : { '@type': 'Person' as const, name }))
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
 * would be wrong. Each has an `@id` at its anchor on /research, and points
 * at the research line it came from.
 */
export function publicationSchema(pub: Publication) {
  const isThesis = /thesis/i.test(pub.venue)

  const base: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': isThesis ? 'Thesis' : 'ScholarlyArticle',
    '@id': publicationId(pub.key),
    headline: pub.title,
    name: pub.title,
    abstract: pub.aiSummary,
    datePublished: String(pub.year),
    author: parseAuthors(pub.authors),
    inLanguage: 'en',
    url: pub.scholarUrl,
    mainEntityOfPage: absoluteUrl(`/research#${pub.key}`),
    about: terms(pub.topics),
  }

  const research = RESEARCH.find((r) => r.slug === pub.research)
  if (research?.page) {
    base.isBasedOn = {
      '@type': 'ResearchProject',
      '@id': researchId(research.slug),
      name: research.name,
      url: absoluteUrl(`/research/${research.slug}`),
    }
  }

  if (isThesis) {
    base.inSupportOf = 'MSc'
    base.publisher = orgRef('wits')
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
 * All publications, for the papers section of /research.
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

/**
 * A page that is primarily about the person, e.g. /about and /resume.
 *
 * `ProfilePage` with `mainEntity` pointing at the Person is what tells a
 * knowledge graph "this page is the profile of that entity" rather than "this
 * page happens to mention them".
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
 * A project on its own /work page, as the single entity it is.
 *
 * Software (Ubunye Engine, TFiltersPy) is SoftwareSourceCode with the same
 * `@id` everywhere it appears, so the /work index, the project page and any
 * post that mentions it all describe one thing. Everything else is a
 * CreativeWork. `sameAs` is used only for URLs that identify the same software
 * (its repository and package page); press coverage becomes `subjectOf` and
 * product pages `mentions`, because a case study is not the Vodacom product
 * page it links to. No star count, download figure or adoption claim is
 * asserted: none can be verified from this repository.
 */
export function projectSchema(p: Project) {
  const url = absoluteUrl(`/work/${p.slug}`)
  const connections = getConnections('project', p.slug, 8)
  const stated = (list: { node: GraphNode; stated: boolean }[]) => list.filter((c) => c.stated).map((c) => c.node)
  const researchRefs = stated(connections.research).map((n) => ({
    '@type': 'ResearchProject', '@id': n.id, name: n.title, url: absoluteUrl(n.href),
  }))
  const postRefs = stated(connections.post).map((n) => ({
    '@type': 'BlogPosting', '@id': n.id, headline: n.title, url: absoluteUrl(n.href),
  }))

  const common = {
    '@context': 'https://schema.org',
    '@id': projectId(p),
    name: p.kind === 'software' ? p.title : p.headline,
    alternateName: p.kind === 'software' ? p.headline : undefined,
    description: p.summary,
    url,
    mainEntityOfPage: url,
    inLanguage: 'en',
    about: terms(p.graphTopics),
    keywords: p.topics.join(', '),
    creator: personRef(),
    sourceOrganization: p.organization ? orgRef(p.organization) : undefined,
    isPartOf: webSiteRef(),
    subjectOf: [
      ...postRefs,
      ...p.artifacts
        .filter((a) => a.kind === 'publication')
        .map((a) => ({ '@type': 'CreativeWork', name: a.label ?? 'Coverage', url: a.href })),
    ],
    isBasedOn: researchRefs,
  }

  if (p.kind === 'software') {
    const repo = p.artifacts.find((a) => a.kind === 'github' && !a.label)?.href ?? p.ghLink
    const pypi = p.artifacts.find((a) => a.kind === 'pypi')?.href
    const docs = p.artifacts.find((a) => a.kind === 'docs')?.href
    const authors = p.authors?.length
      ? p.authors.map((name) => (isSubject(name) ? personRef() : { '@type': 'Person', name }))
      : [personRef()]
    return clean({
      ...common,
      '@type': 'SoftwareSourceCode',
      codeRepository: repo,
      programmingLanguage: p.technologies.includes('python') ? 'Python' : undefined,
      runtimePlatform: p.technologies
        .filter((t) => t !== 'python')
        .map((t) => getTopicDef(t)?.name)
        .filter((n): n is string => Boolean(n)),
      license: p.license ? `https://spdx.org/licenses/${p.license}.html` : undefined,
      author: authors,
      maintainer: personRef(),
      publisher: p.organization ? orgRef(p.organization) : undefined,
      sameAs: [repo, pypi].filter((u): u is string => Boolean(u)),
      softwareHelp: docs ? { '@type': 'CreativeWork', name: `${p.title} documentation`, url: docs } : undefined,
      creativeWorkStatus: p.status === 'active' ? 'Active' : p.status === 'maintained' ? 'Maintained' : 'Completed',
    })
  }

  return clean({
    ...common,
    '@type': 'CreativeWork',
    creativeWorkStatus: p.status === 'active' ? 'Active' : 'Completed',
    mentions: p.artifacts
      .filter((a) => a.kind !== 'publication')
      .map((a) => ({ '@type': 'WebPage', name: a.label ?? a.kind, url: a.href })),
  })
}

/** The /work index: every project, by the same @id its own page uses. */
export function workIndexSchema() {
  const url = absoluteUrl('/work')
  const ordered = [...PROJECTS].sort((a, b) => a.order - b.order)
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    url,
    name: 'Work and projects',
    description: 'Production systems, open source infrastructure, applied research and community work by Thabang Mashinini-Sekgoto.',
    inLanguage: 'en',
    isPartOf: webSiteRef(),
    about: personRef(),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: ordered.length,
      itemListElement: ordered.map((p, i) => ({ '@type': 'ListItem', position: i + 1, item: projectRef(p) })),
    },
  }
}

/**
 * A research line. `ResearchProject` is the schema.org type for exactly this,
 * with the person as `member`, the institution as `parentOrganization`, the
 * subjects as `knowsAbout`, and the papers and code as `subjectOf`.
 */
export function researchSchema(r: ResearchLine) {
  const url = absoluteUrl(`/research/${r.slug}`)
  const pubs = PUBLICATIONS.filter((p) => r.publications.includes(p.key))
  return clean({
    '@context': 'https://schema.org',
    '@type': 'ResearchProject',
    '@id': researchId(r.slug),
    name: r.name,
    alternateName: r.headline !== r.name ? r.headline : undefined,
    description: r.summary,
    url,
    mainEntityOfPage: url,
    member: [personRef(), ...(r.collaborators ?? []).map((name) => ({ '@type': 'Person', name }))],
    parentOrganization: r.organization ? orgRef(r.organization) : undefined,
    knowsAbout: terms(r.topics),
    subjectOf: [
      ...pubs.map((p) => ({
        '@type': /thesis/i.test(p.venue) ? 'Thesis' : 'ScholarlyArticle',
        '@id': publicationId(p.key),
        name: p.title,
        url: absoluteUrl(`/research#${p.key}`),
      })),
      ...r.software.map((sw) => ({
        '@type': 'SoftwareSourceCode',
        name: sw.name,
        codeRepository: sw.href,
        author: personRef(),
      })),
    ],
  })
}

/** The /research index. */
export function researchIndexSchema() {
  const url = absoluteUrl('/research')
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    url,
    name: 'Research',
    description: 'Research lines by Thabang Mashinini-Sekgoto, with their questions, methods, findings, code and publications.',
    inLanguage: 'en',
    isPartOf: webSiteRef(),
    about: personRef(),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: RESEARCH.length,
      itemListElement: RESEARCH.map((r, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'ResearchProject',
          '@id': researchId(r.slug),
          name: r.name,
          url: absoluteUrl(r.page ? `/research/${r.slug}` : `/research#${r.slug}`),
        },
      })),
    },
  }
}

/** A topic hub: the DefinedTerm itself, and the work gathered under it. */
export function topicHubSchema(slug: string, nodes: GraphNode[]) {
  const t = getTopicDef(slug)!
  const url = absoluteUrl(`/topics/${slug}`)
  return [
    clean({
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      '@id': topicId(slug),
      name: t.name,
      description: t.description,
      url,
      inDefinedTermSet: { '@type': 'DefinedTermSet', '@id': topicSetId(), name: 'Topics', url: absoluteUrl('/topics') },
      sameAs: t.wikidata ? `https://www.wikidata.org/wiki/${t.wikidata}` : undefined,
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${url}#collection`,
      url,
      name: t.heading ?? t.name,
      description: t.description,
      inLanguage: 'en',
      isPartOf: webSiteRef(),
      about: { '@type': 'DefinedTerm', '@id': topicId(slug), name: t.name },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: nodes.length,
        itemListElement: nodes.map((n, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: { '@id': n.id, name: n.title, url: absoluteUrl(n.href) },
        })),
      },
    },
  ]
}

/** The /topics index: the whole vocabulary as a DefinedTermSet. */
export function topicSetSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': topicSetId(),
    name: 'Topics',
    url: absoluteUrl('/topics'),
    description: 'The subjects the work of Thabang Mashinini-Sekgoto is about, linked to Wikidata where a matching concept exists.',
    hasDefinedTerm: TOPICS.map((t) => definedTermRef(t.slug)),
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
  topics?: string[]
}) {
  return clean({
    '@type': 'VideoObject',
    name: input.title,
    description: input.description,
    uploadDate: new Date(input.date).toISOString(),
    contentUrl: input.videoUrl,
    url: input.videoUrl,
    author: personRef(),
    creator: personRef(),
    about: terms(input.topics ?? []),
    ...(input.event ? { recordedAt: { '@type': 'Event', name: input.event } } : {}),
  })
}

/** The talks page: a list of the recorded talks above. */
export function talksSchema(talks: {
  title: string
  description: string
  date: string
  videoUrl: string
  event: string
  topics?: string[]
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

/** A tag or series landing page: a curated collection of posts. */
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
        item: { '@id': postId(item.slug), name: item.title, url: absoluteUrl(`/blog/${item.slug}`) },
      })),
    },
  }
}
