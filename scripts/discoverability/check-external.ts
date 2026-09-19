/**
 * Check every external link the site uses as evidence or identity, and the
 * metadata of the GitHub repositories it points at.
 *
 * Evidence links rot quietly. The IBM product page the site cited for two
 * years now redirects to an unrelated product; nothing noticed until a manual
 * audit. This runs weekly in CI and on demand:
 *
 *   npx tsx scripts/discoverability/check-external.ts            # links + GitHub metadata
 *   npx tsx scripts/discoverability/check-external.ts --links    # links only
 *   npx tsx scripts/discoverability/check-external.ts --json out.json
 *
 * Classification, deliberately conservative so it does not cry wolf:
 *   BROKEN   404 or 410: exit code 1, the link itself is wrong
 *   UNREACHABLE  a timeout or network error: a warning, because a host being
 *            down this week (WIReDSpace was, in September 2026) is not a
 *            broken link. Recurring UNREACHABLE results deserve a look.
 *   MOVED    redirected to a different host: a warning, because that is how
 *            the IBM link failed, but many hosts legitimately redirect
 *   BLOCKED  401, 403, 429, 999 (LinkedIn) or a bot check: a warning, the
 *            host refuses robots, which says nothing about the link
 *   OK       2xx, or a redirect within the same site
 *
 * GitHub metadata is advisory only: it reports missing descriptions,
 * homepages, topics and licences, and changes nothing. Changing a public
 * repository is left to its owner (DISCOVERABILITY_STATUS.md).
 */
import fs from 'node:fs'
import { CAREER_TIMELINE, PROJECTS, PUBLICATIONS, SOCIAL_LINKS, WRITINGS } from '../../lib/data'
import { RESEARCH } from '../../lib/graph/research'
import { ORGANIZATIONS } from '../../lib/graph/organizations'

const args = process.argv.slice(2)
const linksOnly = args.includes('--links')
const jsonOut = args.includes('--json') ? args[args.indexOf('--json') + 1] : ''

type Status = 'OK' | 'MOVED' | 'BLOCKED' | 'UNREACHABLE' | 'BROKEN'
interface Result { url: string; from: string; status: Status; code: number | string; final?: string }

function collect(): Map<string, string> {
  const urls = new Map<string, string>()
  const add = (url: string | undefined, from: string) => {
    if (url && /^https?:\/\//.test(url) && !url.includes('tmashininisekgoto.com') && !urls.has(url)) urls.set(url, from)
  }
  for (const p of PROJECTS) {
    for (const a of p.artifacts) add(a.href, `project ${p.slug}`)
    add(p.ghLink, `project ${p.slug}`)
    add(p.productLink, `project ${p.slug}`)
    add(p.paperLink, `project ${p.slug}`)
    for (const s of p.siteLinks ?? []) add(s.href, `project ${p.slug}`)
    for (const l of p.lineage ?? []) add(l.href, `project ${p.slug} lineage`)
  }
  for (const r of RESEARCH) {
    for (const s of r.software) add(s.href, `research ${r.slug}`)
    for (const s of r.provenance) add(s.href, `research ${r.slug}`)
  }
  for (const p of PUBLICATIONS) {
    add(p.scholarUrl, `publication ${p.key}`)
    if (p.doi) add(`https://doi.org/${p.doi}`, `publication ${p.key}`)
    if (p.arxiv) add(`https://arxiv.org/abs/${p.arxiv}`, `publication ${p.key}`)
  }
  for (const o of ORGANIZATIONS) {
    add(o.url, `organisation ${o.slug}`)
    for (const s of o.sameAs ?? []) add(s, `organisation ${o.slug}`)
  }
  for (const [key, url] of Object.entries(SOCIAL_LINKS)) if (key !== 'email') add(url, `profile ${key}`)
  for (const m of CAREER_TIMELINE) for (const l of m.links ?? []) add(l.href, `career ${m.shortOrg}`)
  for (const w of WRITINGS) add(w.link, `press ${w.id}`)
  return urls
}

async function check(url: string, from: string): Promise<Result> {
  const attempt = async (method: 'HEAD' | 'GET') =>
    fetch(url, {
      method,
      redirect: 'follow',
      signal: AbortSignal.timeout(20000),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; tmashininisekgoto-link-check/1.0; +https://www.tmashininisekgoto.com)' },
    })
  try {
    let res = await attempt('HEAD')
    // Plenty of servers reject HEAD; only a GET is conclusive.
    if (res.status >= 400) res = await attempt('GET')
    const final = res.url
    const code = res.status
    if ([401, 403, 429, 999].includes(code)) return { url, from, status: 'BLOCKED', code, final }
    if (code === 404 || code === 410) return { url, from, status: 'BROKEN', code, final }
    if (code >= 500) return { url, from, status: 'BLOCKED', code, final }
    const sameHost = new URL(final).hostname.replace(/^www\./, '') === new URL(url).hostname.replace(/^www\./, '')
    // DOIs and handles exist to redirect elsewhere; that is not a move.
    const resolver = /(^|\.)(doi\.org|hdl\.handle\.net|calendar\.app\.google)$/.test(new URL(url).hostname)
    if (!sameHost && !resolver) return { url, from, status: 'MOVED', code, final }
    return { url, from, status: 'OK', code, final }
  } catch (e) {
    return { url, from, status: 'UNREACHABLE', code: (e as Error).name === 'TimeoutError' ? 'timeout' : (e as Error).message.slice(0, 60) }
  }
}

interface RepoReport { repo: string; issues: string[] }

async function githubMetadata(): Promise<RepoReport[]> {
  const repos = new Set<string>()
  const re = /^https:\/\/github\.com\/([^/]+)\/([^/#?]+)/
  for (const url of collect().keys()) {
    const m = url.match(re)
    if (m && !['orgs'].includes(m[1])) repos.add(`${m[1]}/${m[2]}`)
  }
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' }
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  const out: RepoReport[] = []
  for (const repo of repos) {
    const res = await fetch(`https://api.github.com/repos/${repo}`, { headers })
    if (!res.ok) {
      out.push({ repo, issues: [`API ${res.status}`] })
      continue
    }
    const r = await res.json()
    const issues: string[] = []
    if (!r.description) issues.push('no description')
    if (!r.homepage) issues.push('no homepage link')
    if (!r.topics?.length) issues.push('no topics')
    if (!r.license) issues.push('no licence detected')
    else if (r.license.spdx_id === 'NOASSERTION') issues.push('licence not recognised by GitHub')
    if (r.archived) issues.push('archived')
    out.push({ repo, issues })
  }
  return out
}

async function main() {
  const urls = collect()
  const results: Result[] = []
  const queue = [...urls.entries()]
  await Promise.all(
    Array.from({ length: 6 }, async () => {
      while (queue.length) {
        const [url, from] = queue.shift()!
        results.push(await check(url, from))
      }
    })
  )
  results.sort((a, b) => a.status.localeCompare(b.status) || a.url.localeCompare(b.url))

  const count = (s: Status) => results.filter((r) => r.status === s).length
  console.log(`External links: ${results.length} checked. OK ${count('OK')}, MOVED ${count('MOVED')}, BLOCKED ${count('BLOCKED')}, UNREACHABLE ${count('UNREACHABLE')}, BROKEN ${count('BROKEN')}\n`)
  for (const r of results.filter((x) => x.status !== 'OK')) {
    console.log(`${r.status.padEnd(8)} ${String(r.code).padEnd(8)} ${r.url}${r.final && r.final !== r.url ? `  ->  ${r.final}` : ''}  (${r.from})`)
  }

  let repos: RepoReport[] = []
  if (!linksOnly) {
    repos = await githubMetadata()
    console.log('\nGitHub repository metadata (advisory)')
    for (const r of repos) console.log(`${r.issues.length ? 'NOTE' : 'ok  '}  ${r.repo}${r.issues.length ? `: ${r.issues.join(', ')}` : ''}`)
  }

  if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify({ checkedAt: new Date().toISOString(), results, repos }, null, 2))
  process.exit(count('BROKEN') ? 1 : 0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
