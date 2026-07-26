import { PUBLICATIONS, type Publication } from '@/lib/data'
import remoteRaw from '@/data/publications.remote.json'

/**
 * The publication record, with the citation counts that a script keeps fresh.
 *
 * The prose on /publications is hand-written and stays in lib/data.ts. Only the
 * numbers come from outside, from `scripts/publications/sync.mjs`, which writes
 * data/publications.remote.json. The file is committed so a build never depends
 * on a third-party API being up.
 *
 * ## Why three counts, and why the highest wins
 *
 * The three sources disagree, badly, and each one is right about a different
 * thing:
 *
 * | Paper                                  | Scholar | S2 | CrossRef |
 * |----------------------------------------|---------|----|----------|
 * | Mine workers threshold shift           |      10 | 10 |       13 |
 * | Noise level policy advising            |       8 |  8 |       10 |
 * | Long-range seasonal forecasting        |       8 |  3 |        — |
 *
 * CrossRef counts only citations from publishers who registered their
 * reference lists, so it misses preprints and anything unregistered. Semantic
 * Scholar's corpus is broad but lags on recent work. Google Scholar indexes
 * theses, preprints and grey literature that neither of the others sees.
 *
 * None of them can overcount: a citation has to exist somewhere to be indexed.
 * So every figure is a lower bound on the truth, and the largest lower bound is
 * the best estimate available. That is the rule, and the source is printed next
 * to the number so anyone can check it rather than take it on trust.
 */

interface RemotePaper {
  title: string
  year?: number
  citations: number
  crossrefCitations?: number
  venue?: string
  doi?: string
  arxiv?: string
  url?: string
}

interface RemotePublications {
  fetchedAt: string
  source: string
  papers: Record<string, RemotePaper>
  newPapers: unknown[]
  unmatched: string[]
}

// Cast rather than infer: TypeScript reads the committed JSON literally and
// gives each entry its own shape, so `crossrefCitations` would be missing from
// the union for any paper that happens not to have one yet.
const remote = remoteRaw as RemotePublications

export type CitationSource = 'CrossRef' | 'Semantic Scholar' | 'Google Scholar'

export interface CitationCount {
  source: CitationSource
  count: number
}

export interface EnrichedPublication extends Publication {
  /** The highest count found, with the source that reported it. */
  bestCitation?: CitationCount
  /** Every count found, highest first. Shown as the tooltip on the figure. */
  citationCounts: CitationCount[]
  /** Semantic Scholar's page for the paper, when it has one. */
  semanticScholarUrl?: string
}

const normalise = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

/** Find the remote record for a curated publication: by id, then DOI, then title. */
function findRemote(pub: Publication): RemotePaper | undefined {
  const entries = Object.entries(remote.papers)

  if (pub.semanticScholarId && remote.papers[pub.semanticScholarId]) {
    return remote.papers[pub.semanticScholarId]
  }
  if (pub.doi) {
    const byDoi = entries.find(
      ([, paper]) => paper.doi?.toLowerCase() === pub.doi?.toLowerCase()
    )
    if (byDoi) return byDoi[1]
  }
  return entries.find(([, paper]) => normalise(paper.title) === normalise(pub.title))?.[1]
}

/** The curated record with fresh counts merged in. */
export function getPublications(): EnrichedPublication[] {
  return PUBLICATIONS.map((pub) => {
    const paper = findRemote(pub)

    const counts: CitationCount[] = [
      typeof pub.citations === 'number'
        ? { source: 'Google Scholar' as const, count: pub.citations }
        : null,
      typeof paper?.citations === 'number'
        ? { source: 'Semantic Scholar' as const, count: paper.citations }
        : null,
      typeof paper?.crossrefCitations === 'number'
        ? { source: 'CrossRef' as const, count: paper.crossrefCitations }
        : null,
    ]
      .filter((entry): entry is CitationCount => entry !== null)
      .sort((a, b) => b.count - a.count)

    return {
      ...pub,
      citationCounts: counts,
      bestCitation: counts[0],
      semanticScholarUrl: paper?.url,
    }
  })
}

/** Sum of the best count for each publication. */
export function citationTotal(): number {
  return getPublications().reduce((sum, pub) => sum + (pub.bestCitation?.count ?? 0), 0)
}

/** When the counts were last refreshed, ISO. */
export function citationsFetchedAt(): string {
  return remote.fetchedAt
}
