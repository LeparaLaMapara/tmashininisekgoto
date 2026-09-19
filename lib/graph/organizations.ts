/**
 * Organisations the work happened at or belongs to.
 *
 * Before this, employers and universities were plain strings, so the career
 * could not be joined to the organisations' own entries in any knowledge
 * graph. Each one now has a stable `@id` on this site, its official site, and
 * its Wikidata id where one exists (checked by hand against label and
 * description; ABSA Insurance has none of its own, so it points at its parent).
 */

export type OrgType =
  | 'Corporation'
  | 'CollegeOrUniversity'
  | 'ResearchOrganization'
  | 'GovernmentOrganization'
  | 'Organization'

export interface OrgDef {
  slug: string
  name: string
  type: OrgType
  url?: string
  wikidata?: string
  /** Another org in this registry, by slug. */
  parent?: string
  /** Set when Thabang founded it. Emitted as `founder` on the org. */
  foundedBySubject?: boolean
  /** Other URLs that identify the same organisation. */
  sameAs?: string[]
}

export const ORGANIZATIONS: OrgDef[] = [
  { slug: 'absa-group', name: 'ABSA Group', type: 'Corporation', url: 'https://www.absa.africa/', wikidata: 'Q58641733' },
  { slug: 'absa-insurance', name: 'ABSA Insurance', type: 'Corporation', url: 'https://www.absa.co.za/', parent: 'absa-group' },
  { slug: 'vodacom', name: 'Vodacom', type: 'Corporation', url: 'https://www.vodacom.co.za/', wikidata: 'Q1856518' },
  { slug: 'ibm-research', name: 'IBM Research', type: 'ResearchOrganization', url: 'https://research.ibm.com/', wikidata: 'Q3146518' },
  {
    slug: 'wits',
    name: 'University of the Witwatersrand',
    type: 'CollegeOrUniversity',
    url: 'https://www.wits.ac.za/',
    wikidata: 'Q534643',
  },
  {
    slug: 'csir',
    name: 'Council for Scientific and Industrial Research',
    type: 'GovernmentOrganization',
    url: 'https://www.csir.co.za/',
    wikidata: 'Q849145',
  },
  {
    slug: 'ubunye-ai-ecosystems',
    name: 'Ubunye AI Ecosystems',
    type: 'Organization',
    url: 'https://github.com/ubunye-ai-ecosystems',
    foundedBySubject: true,
  },
  {
    slug: 'kasilam',
    name: 'Kasilam Digital Platforms',
    type: 'Organization',
    url: 'https://kasilamdigitialplatforms.vercel.app/',
    sameAs: ['https://github.com/Kasilam-Projects'],
  },
]

const BY_SLUG = new Map(ORGANIZATIONS.map((o) => [o.slug, o]))

export function getOrg(slug: string): OrgDef | undefined {
  return BY_SLUG.get(slug)
}
