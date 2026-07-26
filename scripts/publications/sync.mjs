/**
 * Refresh publication metadata from Semantic Scholar and CrossRef.
 *
 *   node scripts/publications/sync.mjs           # fetch and write
 *   node scripts/publications/sync.mjs --check   # fetch and report, exit 1 on drift
 *
 * What it writes: `data/publications.remote.json`, holding citation counts keyed
 * by Semantic Scholar paper id, plus any papers on the author profile that
 * lib/data.ts does not know about.
 *
 * What it deliberately does NOT write: lib/data.ts. The `aiSummary` and
 * `applications` fields on every publication are written by hand and are the
 * reason the page is worth reading. A script that rewrote that file would
 * either clobber them or need to parse TypeScript to avoid it. So the split is:
 * prose stays curated in the repo, numbers come from the API, and a genuinely
 * new paper is *reported* rather than silently inserted with an empty summary.
 *
 * No API key is needed. The Semantic Scholar Graph API and CrossRef are both
 * open, rate-limited, and polite about a User-Agent with contact details.
 */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const ROOT = process.cwd()
const OUTPUT = path.join(ROOT, 'data', 'publications.remote.json')
const DATA_FILE = path.join(ROOT, 'lib', 'data.ts')

const CHECK_ONLY = process.argv.includes('--check')

// CrossRef and Semantic Scholar both ask for a contact address in the
// User-Agent and give the "polite pool" better rate limits in return.
const USER_AGENT =
  'tmashininisekgoto-site/1.0 (https://www.tmashininisekgoto.com; mailto:thabangvisionstudios@gmail.com)'

/* -------------------------------------------------------------------------- */
/* Reading the curated record                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Pull the fields we need out of lib/data.ts without importing it.
 *
 * The file is TypeScript and this is a plain node script with no build step, so
 * it is read as text. Only four flat string/number fields are extracted, which
 * a regex handles honestly; anything more structural would want a real parser.
 */
/** The repo is checked out with CRLF on Windows; every pattern below assumes \n. */
function readSource() {
  return fs.readFileSync(DATA_FILE, 'utf-8').replace(/\r\n/g, '\n')
}

function readCuratedPublications() {
  const source = readSource()
  const block = source.match(/export const PUBLICATIONS: Publication\[\] = \[([\s\S]*?)\n\]/)
  if (!block) throw new Error('Could not find PUBLICATIONS in lib/data.ts')

  return block[1]
    .split(/\n  \{\n/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => ({
      title: entry.match(/title:\s*'([^']*)'/)?.[1] ?? entry.match(/title:\s*"([^"]*)"/)?.[1],
      year: Number(entry.match(/year:\s*(\d+)/)?.[1]),
      citations: entry.match(/citations:\s*(\d+)/)
        ? Number(entry.match(/citations:\s*(\d+)/)[1])
        : undefined,
      semanticScholarId: entry.match(/semanticScholarId:\s*'([^']*)'/)?.[1],
      doi: entry.match(/doi:\s*'([^']*)'/)?.[1],
    }))
    .filter((entry) => entry.title)
}

function readAuthorId() {
  const id = readSource().match(/SEMANTIC_SCHOLAR_AUTHOR_ID\s*=\s*'([^']+)'/)?.[1]
  if (!id) throw new Error('Could not find SEMANTIC_SCHOLAR_AUTHOR_ID in lib/data.ts')
  return id
}

/* -------------------------------------------------------------------------- */
/* Fetching                                                                   */
/* -------------------------------------------------------------------------- */

async function getJson(url, { retries = 3 } = {}) {
  for (let attempt = 0; attempt < retries; attempt++) {
    const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })

    // Semantic Scholar rate-limits unauthenticated callers aggressively and
    // says so with a 429. Backing off is the difference between a working
    // script and one that reports every paper as missing.
    if (response.status === 429 || response.status >= 500) {
      const wait = 2000 * (attempt + 1)
      console.warn(`  ${response.status} from ${new URL(url).host}, retrying in ${wait}ms`)
      await new Promise((resolve) => setTimeout(resolve, wait))
      continue
    }

    if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`)
    return response.json()
  }
  throw new Error(`Gave up after ${retries} attempts: ${url}`)
}

async function fetchSemanticScholarPapers(authorId) {
  const fields = 'paperId,title,year,citationCount,venue,externalIds,url'
  const url = `https://api.semanticscholar.org/graph/v1/author/${authorId}/papers?fields=${fields}&limit=100`
  const payload = await getJson(url)
  return payload.data ?? []
}

/** CrossRef record for a DOI, or null if it is not registered there. */
async function fetchCrossref(doi) {
  try {
    const payload = await getJson(`https://api.crossref.org/works/${encodeURIComponent(doi)}`)
    const work = payload.message
    return {
      title: work.title?.[0],
      container: work['container-title']?.[0],
      volume: work.volume,
      issue: work.issue,
      page: work.page,
      published: work.issued?.['date-parts']?.[0]?.[0],
      referencedBy: work['is-referenced-by-count'],
    }
  } catch (error) {
    console.warn(`  CrossRef lookup failed for ${doi}: ${error.message}`)
    return null
  }
}

/* -------------------------------------------------------------------------- */
/* Matching                                                                   */
/* -------------------------------------------------------------------------- */

const normalise = (value) => (value ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

/**
 * Tie a Semantic Scholar record to a curated one.
 *
 * By id first, since that is exact. Falling back to a normalised title match
 * catches the case where a paper is in lib/data.ts without an id yet, which is
 * how every new paper starts life.
 */
function matchPaper(curated, papers) {
  if (curated.semanticScholarId) {
    const byId = papers.find((p) => p.paperId === curated.semanticScholarId)
    if (byId) return byId
  }
  if (curated.doi) {
    const byDoi = papers.find(
      (p) => p.externalIds?.DOI?.toLowerCase() === curated.doi.toLowerCase()
    )
    if (byDoi) return byDoi
  }
  return papers.find((p) => normalise(p.title) === normalise(curated.title)) ?? null
}

/* -------------------------------------------------------------------------- */
/* Main                                                                       */
/* -------------------------------------------------------------------------- */

async function main() {
  const curated = readCuratedPublications()
  const authorId = readAuthorId()

  console.log(`Curated publications in lib/data.ts: ${curated.length}`)
  console.log(`Fetching Semantic Scholar author ${authorId} ...`)

  const papers = await fetchSemanticScholarPapers(authorId)
  console.log(`Semantic Scholar returned ${papers.length} papers\n`)

  const byId = {}
  const drift = []
  const unmatched = []

  for (const entry of curated) {
    const paper = matchPaper(entry, papers)

    if (!paper) {
      unmatched.push(entry.title)
      console.log(`  no match: ${entry.title}`)
      continue
    }

    const crossref = entry.doi ? await fetchCrossref(entry.doi) : null

    // CrossRef counts citations from registered reference lists only, so it
    // reads lower than Semantic Scholar. Both are recorded rather than averaged:
    // they measure different things and picking one silently would hide that.
    byId[paper.paperId] = {
      title: paper.title,
      year: paper.year,
      citations: paper.citationCount ?? 0,
      crossrefCitations: crossref?.referencedBy,
      venue: paper.venue || undefined,
      doi: paper.externalIds?.DOI,
      arxiv: paper.externalIds?.ArXiv,
      url: paper.url,
    }

    if (entry.citations !== paper.citationCount) {
      drift.push({
        title: entry.title,
        inRepo: entry.citations ?? 0,
        remote: paper.citationCount ?? 0,
      })
    }

    if (crossref?.title && normalise(crossref.title) !== normalise(entry.title)) {
      console.log(`  title differs from CrossRef for ${entry.doi}:`)
      console.log(`    repo:     ${entry.title}`)
      console.log(`    crossref: ${crossref.title}`)
    }
  }

  // Papers on the author profile that the site has never mentioned. Reported,
  // never auto-inserted: each one needs a hand-written summary and a list of
  // applications before it belongs on the page.
  const curatedIds = new Set(Object.keys(byId))
  const curatedTitles = new Set(curated.map((entry) => normalise(entry.title)))
  const newPapers = papers
    .filter((p) => !curatedIds.has(p.paperId) && !curatedTitles.has(normalise(p.title)))
    .map((p) => ({
      paperId: p.paperId,
      title: p.title,
      year: p.year,
      citations: p.citationCount ?? 0,
      doi: p.externalIds?.DOI,
      url: p.url,
    }))
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))

  const output = {
    // Written by scripts/publications/sync.mjs. Committed so the site can build
    // without network access; refreshed by CI on a schedule.
    fetchedAt: new Date().toISOString(),
    source: `https://api.semanticscholar.org/graph/v1/author/${authorId}/papers`,
    papers: byId,
    newPapers,
    unmatched,
  }

  /* ---------------------------------------------------------------------- */

  console.log('\nCitation counts')
  if (drift.length === 0) {
    console.log('  up to date')
  } else {
    for (const item of drift) {
      console.log(`  ${item.inRepo} -> ${item.remote}  ${item.title}`)
    }
  }

  if (newPapers.length) {
    console.log(`\n${newPapers.length} paper(s) on the profile but not on the site:`)
    for (const paper of newPapers) {
      console.log(`  ${paper.year}  ${paper.title}`)
      console.log(`         ${paper.url ?? ''}`)
    }
    console.log('\nAdd them to PUBLICATIONS in lib/data.ts with a summary and')
    console.log('applications written by hand. This script will not invent either.')
  }

  if (CHECK_ONLY) {
    const stale = drift.length > 0 || newPapers.length > 0
    console.log(stale ? '\n--check: drift found' : '\n--check: clean')
    process.exit(stale ? 1 : 0)
  }

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true })
  fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf-8')
  console.log(`\nWrote ${path.relative(ROOT, OUTPUT)}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
