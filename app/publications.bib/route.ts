import { toBibtex } from '@/lib/citations'
import { getPublications } from '@/lib/publications'
import { SITE_URL } from '@/lib/site'

/**
 * Every publication as one BibTeX file.
 *
 * A researcher who wants to cite this work should be able to point Zotero,
 * Mendeley or JabRef at a URL and be done. Retyping an entry by hand is where
 * citations get dropped, and a `.bib` on a stable URL costs nothing to keep.
 *
 * Served as `text/plain` rather than `application/x-bibtex` deliberately: the
 * BibTeX mime type makes browsers download the file instead of showing it, and
 * being readable in a tab is worth more than the strictly correct header.
 */

export const dynamic = 'force-static'

export function GET() {
  const publications = [...getPublications()].sort((a, b) => b.year - a.year)

  const body = [
    '% BibTeX entries for the publications of Thabang Mashinini-Sekgoto',
    `% ${SITE_URL}/publications`,
    '%',
    '% Generated from the site source. Corrections are welcome: the venue strings',
    '% these are parsed from come from Google Scholar and are not always complete.',
    '',
    ...publications.map((pub) => `${toBibtex(pub)}\n`),
  ].join('\n')

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
    },
  })
}
