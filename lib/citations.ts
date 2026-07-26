import type { Publication } from '@/lib/data'

/**
 * Citation strings for every publication, in the three formats people actually
 * paste: BibTeX, APA 7 and Chicago author-date.
 *
 * The point is friction. A researcher who wants to cite a paper and finds no
 * ready-made entry will either retype it (slowly, with errors) or cite
 * something else. A copy button is a smaller ask than a trip to Google Scholar,
 * and `/publications.bib` drops the whole record into a reference manager in
 * one fetch.
 *
 * Everything is derived from the `Publication` records in lib/data.ts. Nothing
 * is fetched at render time, so the formatting is deterministic and testable.
 */

/* -------------------------------------------------------------------------- */
/* Venue parsing                                                              */
/* -------------------------------------------------------------------------- */

type VenueKind = 'journal' | 'preprint' | 'thesis'

interface ParsedVenue {
  kind: VenueKind
  /** Journal or repository name, e.g. `IFAC-PapersOnLine`, `arXiv`. */
  container: string
  volume?: string
  issue?: string
  pages?: string
  /** Degree-awarding institution, theses only. */
  school?: string
  /** arXiv identifier, preprints only. */
  eprint?: string
}

/**
 * Pull structure out of the free-text venue strings in lib/data.ts, which come
 * from Google Scholar's export format:
 *
 *   'IFAC-PapersOnLine 52 (14), 117-122'      -> journal, vol 52, issue 14, pp. 117-122
 *   'arXiv preprint arXiv:2102.00085'         -> preprint, eprint 2102.00085
 *   'MSc Thesis, University of the Witwatersrand, 2022' -> thesis, school Wits
 *
 * Anything unrecognised falls back to the whole string as the container name,
 * which still produces a valid (if sparse) citation.
 */
export function parseVenue(venue: string): ParsedVenue {
  if (/thesis|dissertation/i.test(venue)) {
    const school = venue.match(/(University[^,]*|Universiteit[^,]*)/i)?.[1]?.trim()
    return { kind: 'thesis', container: venue, school }
  }

  const arxiv = venue.match(/arXiv:\s*([\d.]+(?:v\d+)?)/i)
  if (arxiv) {
    return { kind: 'preprint', container: 'arXiv', eprint: arxiv[1] }
  }

  // 'Name 52 (14), 117-122' — the shape Scholar emits for journal articles.
  const journal = venue.match(/^(.+?)\s+(\d+)\s*\((\d+)\)\s*,\s*([\d]+\s*[-–]\s*[\d]+)$/)
  if (journal) {
    return {
      kind: 'journal',
      container: journal[1].trim(),
      volume: journal[2],
      issue: journal[3],
      pages: journal[4].replace(/\s/g, ''),
    }
  }

  return { kind: 'journal', container: venue.trim() }
}

/* -------------------------------------------------------------------------- */
/* Author parsing                                                             */
/* -------------------------------------------------------------------------- */

interface ParsedAuthor {
  family: string
  /** Given names as written, e.g. `MCI` or `Thabang`. */
  given: string
}

/**
 * Split `MCI Madahana` into given `MCI` and family `Madahana`.
 *
 * The last whitespace-separated token is the family name. That is correct for
 * every name in the current record and wrong for compound surnames such as
 * `van der Merwe`, which would need a particle list. Worth fixing the day a
 * co-author has one, not before.
 */
function parseAuthor(name: string): ParsedAuthor {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return { family: parts[0], given: '' }
  return { family: parts[parts.length - 1], given: parts.slice(0, -1).join(' ') }
}

export function parseAuthors(authors: string): ParsedAuthor[] {
  return authors
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean)
    .map(parseAuthor)
}

/**
 * `MCI` -> `M. C. I.`, `Thabang` -> `T.`
 *
 * Scholar writes given names as run-together capitals, so a short all-caps
 * token is a set of initials rather than a name. A spelled-out name is reduced
 * to its first letter, which is what APA and Chicago both want.
 */
function initials(given: string): string {
  if (!given) return ''
  return given
    .split(/\s+/)
    .flatMap((token) =>
      /^[A-Z]{2,4}$/.test(token) ? token.split('') : [token[0].toUpperCase()]
    )
    .map((letter) => `${letter}.`)
    .join(' ')
}

/* -------------------------------------------------------------------------- */
/* Links                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * The most durable link available for a publication.
 *
 * A DOI first, then the arXiv abstract page, and only then the Google Scholar
 * link held in lib/data.ts. The Scholar URL carries a profile id and a
 * per-citation token; it works today and is the first thing to rot.
 */
function sourceUrl(pub: Publication, venue: ParsedVenue): string {
  if (pub.doi) return `https://doi.org/${pub.doi}`
  if (venue.eprint) return `https://arxiv.org/abs/${venue.eprint}`
  return pub.scholarUrl
}

/* -------------------------------------------------------------------------- */
/* BibTeX                                                                     */
/* -------------------------------------------------------------------------- */

/** `madahana2019mine` — first author, year, first meaningful title word. */
export function citationKey(pub: Publication): string {
  const first = parseAuthors(pub.authors)[0]
  const family = (first?.family ?? 'unknown').toLowerCase().replace(/[^a-z]/g, '')
  const stopWords = new Set(['a', 'an', 'the', 'on', 'of', 'in', 'for', 'and'])
  const word =
    pub.title
      .toLowerCase()
      .split(/\s+/)
      .map((w) => w.replace(/[^a-z]/g, ''))
      .find((w) => w.length > 2 && !stopWords.has(w)) ?? 'paper'
  return `${family}${pub.year}${word}`
}

/**
 * Escape the five characters that break a BibTeX parse.
 *
 * Titles here are plain English, but `&` appears in institution names and an
 * unescaped one silently truncates the field in some parsers.
 */
function bibtexEscape(value: string): string {
  return value.replace(/([&%$#_])/g, '\\$1')
}

/** One BibTeX entry. `@mastersthesis` for the thesis, `@misc` for preprints. */
export function toBibtex(pub: Publication): string {
  const venue = parseVenue(pub.venue)
  // `Mashinini, T. L.` rather than the `Mashinini, TL` that Scholar exports:
  // reference managers read a run-together `TL` as one given name and render it
  // as "Tl" in the bibliography.
  const authors = parseAuthors(pub.authors)
    .map(({ family, given }) => (given ? `${family}, ${initials(given)}` : family))
    .join(' and ')

  const fields: [string, string | undefined][] = [
    ['title', bibtexEscape(pub.title)],
    ['author', bibtexEscape(authors)],
    ['year', String(pub.year)],
  ]

  let type: string
  switch (venue.kind) {
    case 'thesis':
      type = 'mastersthesis'
      fields.push(['school', bibtexEscape(venue.school ?? 'University of the Witwatersrand')])
      fields.push(['type', 'MSc dissertation'])
      break
    case 'preprint':
      type = 'misc'
      fields.push(['eprint', venue.eprint])
      fields.push(['archivePrefix', 'arXiv'])
      // No `primaryClass`: the arXiv category is not recorded in lib/data.ts and
      // guessing one would put a wrong fact in every reference manager that
      // imports this file.
      break
    default:
      type = 'article'
      fields.push(['journal', bibtexEscape(venue.container)])
      fields.push(['volume', venue.volume])
      fields.push(['number', venue.issue])
      fields.push(['pages', venue.pages?.replace(/[-–]/, '--')])
  }

  if (pub.doi) fields.push(['doi', pub.doi])
  fields.push(['url', sourceUrl(pub, venue)])

  const body = fields
    .filter(([, value]) => value)
    .map(([key, value]) => `  ${key.padEnd(13)} = {${value}}`)
    .join(',\n')

  return `@${type}{${citationKey(pub)},\n${body}\n}`
}

/* -------------------------------------------------------------------------- */
/* APA 7 and Chicago author-date                                              */
/* -------------------------------------------------------------------------- */

/** `Madahana, M. C. I., Ekoru, J. E. D., & Nyandoro, O. T. C.` */
function apaAuthorList(authors: ParsedAuthor[]): string {
  const formatted = authors.map(({ family, given }) =>
    given ? `${family}, ${initials(given)}` : family
  )
  if (formatted.length === 1) return formatted[0]
  return `${formatted.slice(0, -1).join(', ')}, & ${formatted[formatted.length - 1]}`
}

/** APA 7. Page ranges use an en dash, which is what the style calls for. */
export function toApa(pub: Publication): string {
  const venue = parseVenue(pub.venue)
  const authors = apaAuthorList(parseAuthors(pub.authors))
  const link = sourceUrl(pub, venue)

  let source: string
  switch (venue.kind) {
    case 'thesis':
      source = `[Master's thesis, ${venue.school ?? 'University of the Witwatersrand'}]`
      break
    case 'preprint':
      source = `arXiv${venue.eprint ? `:${venue.eprint}` : ''} [Preprint]`
      break
    default: {
      const volume = venue.volume
        ? `, ${venue.volume}${venue.issue ? `(${venue.issue})` : ''}`
        : ''
      const pages = venue.pages ? `, ${venue.pages.replace(/[-–]/, '–')}` : ''
      source = `${venue.container}${volume}${pages}`
    }
  }

  return `${authors} (${pub.year}). ${pub.title}. ${source}. ${link}`
}

/** `Madahana, M. C. I., J. E. D. Ekoru, and O. T. C. Nyandoro` — only the first is inverted. */
function chicagoAuthorList(authors: ParsedAuthor[]): string {
  const formatted = authors.map(({ family, given }, i) => {
    if (i === 0) return given ? `${family}, ${initials(given)}` : family
    return given ? `${initials(given)} ${family}` : family
  })
  if (formatted.length === 1) return formatted[0]
  if (formatted.length === 2) return `${formatted[0]}, and ${formatted[1]}`
  return `${formatted.slice(0, -1).join(', ')}, and ${formatted[formatted.length - 1]}`
}

/** Chicago author-date (17th edition). */
export function toChicago(pub: Publication): string {
  const venue = parseVenue(pub.venue)
  const authors = chicagoAuthorList(parseAuthors(pub.authors))
  const link = sourceUrl(pub, venue)

  let source: string
  switch (venue.kind) {
    case 'thesis':
      source = `MSc dissertation, ${venue.school ?? 'University of the Witwatersrand'}`
      break
    case 'preprint':
      source = `arXiv preprint arXiv${venue.eprint ? `:${venue.eprint}` : ''}`
      break
    default: {
      const volume = venue.volume
        ? ` ${venue.volume}${venue.issue ? ` (${venue.issue})` : ''}`
        : ''
      const pages = venue.pages ? `: ${venue.pages.replace(/[-–]/, '–')}` : ''
      source = `${venue.container}${volume}${pages}`
    }
  }

  return `${authors}. ${pub.year}. "${pub.title}." ${source}. ${link}.`
}

export type CitationFormat = 'BibTeX' | 'APA' | 'Chicago'

/** All three formats for one publication, ready for a tabbed copy widget. */
export function citations(pub: Publication): Record<CitationFormat, string> {
  return {
    BibTeX: toBibtex(pub),
    APA: toApa(pub),
    Chicago: toChicago(pub),
  }
}
