#!/usr/bin/env node
/**
 * Crawl the site the way a search engine would, and fail on the things that
 * stop a page being found, understood or trusted.
 *
 * It starts from the sitemap and the homepage, follows every internal link,
 * and checks each HTML page for: status, <title>, meta description, a self
 * referencing canonical, accidental noindex, a single <h1>, images without
 * alt text, JSON-LD that parses and carries the properties its type needs,
 * and the graph level problems no single page shows: duplicate titles and
 * descriptions, orphan pages (in the sitemap, linked from nowhere), indexable
 * pages missing from the sitemap, and internal links that 404.
 *
 * No dependencies. The HTML is our own React output, so a handful of careful
 * regular expressions are enough and keep this runnable in CI with plain node.
 *
 *   node scripts/discoverability/audit-site.mjs                  # against localhost:3000
 *   node scripts/discoverability/audit-site.mjs --base https://www.tmashininisekgoto.com
 *   node scripts/discoverability/audit-site.mjs --json report.json
 *
 * Exit code 1 when any error level issue is found. Warnings never fail.
 */

import fs from 'node:fs'

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback
}

const BASE = flag('base', 'http://localhost:3000').replace(/\/$/, '')
const CANONICAL_ORIGIN = flag('origin', 'https://www.tmashininisekgoto.com').replace(/\/$/, '')
const JSON_OUT = flag('json', '')
const MAX_PAGES = Number(flag('max', '600'))
const CONCURRENCY = Number(flag('concurrency', '6'))

/** Paths that are not pages: machine files, API routes, assets. */
const NON_PAGE = /^\/(api\/|_next\/|audio\/|projects\/|posts\/|icons\/|diagrams\/)|\.(xml|txt|bib|md|png|jpe?g|svg|webp|gif|pdf|mp3|ico|json|css|js)$/i

/** Pages that are deliberately not indexable, so they are exempt from the sitemap rules. */
const NOINDEX_OK = new Set(['/search'])

const issues = []
const report = (severity, path, rule, detail = '') => issues.push({ severity, path, rule, detail })

/** Site relative path for any URL on either origin, or null if external. */
function toPath(href, from = '/') {
  if (!href || href.startsWith('#') || /^(mailto|tel|javascript):/i.test(href)) return null
  let url
  try {
    url = new URL(href, BASE + from)
  } catch {
    return null
  }
  const origin = url.origin
  if (origin !== new URL(BASE).origin && origin !== CANONICAL_ORIGIN && origin !== CANONICAL_ORIGIN.replace('://www.', '://')) {
    return null
  }
  let p = decodeURI(url.pathname)
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1)
  return p
}

async function fetchPage(path) {
  const res = await fetch(BASE + encodeURI(path), { redirect: 'manual', headers: { 'User-Agent': 'discoverability-audit/1.0' } })
  const location = res.headers.get('location')
  const type = res.headers.get('content-type') || ''
  const body = type.includes('text/html') ? await res.text() : ''
  return { status: res.status, location, type, body }
}

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`, 'i'))
  return m ? decodeEntities(m[1]) : null
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

/** The properties a consumer needs for each type we emit. Missing ones are errors. */
const REQUIRED = {
  Person: ['name'],
  WebSite: ['name', 'url'],
  BlogPosting: ['headline', 'datePublished', 'author'],
  ScholarlyArticle: ['name', 'author'],
  Thesis: ['name', 'author'],
  SoftwareSourceCode: ['name', 'codeRepository'],
  ResearchProject: ['name'],
  CreativeWork: ['name'],
  DefinedTerm: ['name'],
  CollectionPage: ['name', 'url'],
  ProfilePage: ['mainEntity'],
  BreadcrumbList: ['itemListElement'],
  VideoObject: ['name', 'uploadDate'],
  Organization: ['name'],
}

/** Every node in a JSON-LD document, including @graph members and nested objects. */
function* nodes(value) {
  if (Array.isArray(value)) {
    for (const v of value) yield* nodes(v)
  } else if (value && typeof value === 'object') {
    if (value['@type']) yield value
    for (const [k, v] of Object.entries(value)) {
      if (k !== '@context') yield* nodes(v)
    }
  }
}

function analyse(path, html) {
  const page = { path, links: new Set(), jsonLdTypes: new Set(), ids: new Map() }

  const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)
  page.title = title ? decodeEntities(title[1]).trim() : ''
  const metas = html.match(/<meta\s[^>]*>/gi) ?? []
  const meta = (n) => {
    const tag = metas.find((t) => attr(t, 'name') === n || attr(t, 'property') === n)
    return tag ? attr(tag, 'content') : null
  }
  page.description = meta('description') ?? ''
  page.robots = meta('robots') ?? ''
  page.ogTitle = meta('og:title')
  page.ogImage = meta('og:image')
  const canonTag = (html.match(/<link\s[^>]*rel="canonical"[^>]*>/i) ?? [])[0]
  page.canonical = canonTag ? attr(canonTag, 'href') : null
  page.h1 = (html.match(/<h1[\s>]/gi) ?? []).length
  page.lang = (html.match(/<html[^>]*\slang="([^"]+)"/i) ?? [])[1] ?? null

  for (const img of html.match(/<img\s[^>]*>/gi) ?? []) {
    if (attr(img, 'alt') === null) report('warn', path, 'img-missing-alt', attr(img, 'src') ?? '')
  }

  for (const a of html.match(/<a\s[^>]*>/gi) ?? []) {
    const p = toPath(attr(a, 'href'), path)
    if (p && !NON_PAGE.test(p)) page.links.add(p)
    else if (p && /\.(md|xml|txt|bib)$/.test(p)) page.links.add(p)
  }

  const blocks = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi) ?? []
  for (const block of blocks) {
    const raw = block.replace(/^<script[^>]*>/i, '').replace(/<\/script>$/i, '')
    let doc
    try {
      doc = JSON.parse(raw)
    } catch (e) {
      report('error', path, 'jsonld-parse', e.message)
      continue
    }
    for (const node of nodes(doc)) {
      const types = [].concat(node['@type'])
      for (const t of types) {
        page.jsonLdTypes.add(t)
        for (const prop of REQUIRED[t] ?? []) {
          // A bare reference (@id plus a name at most) is a pointer, not a definition.
          const isRef = node['@id'] && Object.keys(node).length <= 4
          if (!isRef && (node[prop] === undefined || node[prop] === '' || (Array.isArray(node[prop]) && !node[prop].length))) {
            report('error', path, 'jsonld-missing-property', `${t}.${prop}`)
          }
        }
      }
      const id = node['@id']
      if (id) {
        if (!/^https?:\/\//.test(id)) report('error', path, 'jsonld-relative-id', id)
        const prev = page.ids.get(id)
        const t = types.join(',')
        if (prev && prev !== t) report('error', path, 'jsonld-id-type-conflict', `${id} is ${prev} and ${t}`)
        page.ids.set(id, t)
      }
      for (const key of ['url', 'image', 'codeRepository']) {
        if (typeof node[key] === 'string' && !/^https?:\/\//.test(node[key])) {
          report('error', path, 'jsonld-relative-url', `${key}=${node[key]}`)
        }
      }
    }
  }
  return page
}

async function pool(items, worker) {
  const queue = [...items]
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (queue.length) await worker(queue.shift())
    })
  )
}

async function main() {
  const started = Date.now()

  const sitemapRes = await fetch(`${BASE}/sitemap.xml`)
  if (!sitemapRes.ok) {
    console.error(`sitemap.xml returned ${sitemapRes.status}`)
    process.exit(1)
  }
  const sitemapXml = await sitemapRes.text()
  const sitemap = new Set(
    [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => toPath(m[1])).filter(Boolean)
  )
  for (const loc of sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    if (!loc[1].startsWith(CANONICAL_ORIGIN)) report('error', loc[1], 'sitemap-wrong-origin')
  }

  const robots = await (await fetch(`${BASE}/robots.txt`)).text()
  if (/^\s*Disallow:\s*\/\s*$/m.test(robots)) report('error', '/robots.txt', 'robots-disallow-all')
  if (!/Sitemap:/i.test(robots)) report('error', '/robots.txt', 'robots-no-sitemap')

  const pages = new Map()
  const statuses = new Map()
  const inbound = new Map()
  const queued = new Set(['/', ...sitemap])
  let frontier = [...queued]

  while (frontier.length && pages.size + statuses.size < MAX_PAGES) {
    const next = []
    await pool(frontier, async (path) => {
      let res
      try {
        res = await fetchPage(path)
      } catch (e) {
        statuses.set(path, { status: 0, error: e.message })
        return
      }
      statuses.set(path, { status: res.status, location: res.location })
      if (res.status !== 200 || !res.type.includes('text/html')) return
      const page = analyse(path, res.body)
      pages.set(path, page)
      for (const link of page.links) {
        if (link !== path) {
          if (!inbound.has(link)) inbound.set(link, new Set())
          inbound.get(link).add(path)
        }
        if (!queued.has(link) && !NON_PAGE.test(link)) {
          queued.add(link)
          next.push(link)
        }
      }
    })
    frontier = next
  }

  // Machine readable copies that pages link to are checked for status only.
  const machineLinks = [...inbound.keys()].filter((p) => NON_PAGE.test(p) && !statuses.has(p))
  await pool(machineLinks, async (path) => {
    try {
      const res = await fetch(BASE + encodeURI(path), { redirect: 'manual' })
      statuses.set(path, { status: res.status, location: res.headers.get('location') })
    } catch (e) {
      statuses.set(path, { status: 0, error: e.message })
    }
  })

  // --- Per URL status ---
  for (const [path, { status, location }] of statuses) {
    const from = [...(inbound.get(path) ?? [])].slice(0, 3).join(', ')
    if (status >= 400 || status === 0) {
      report('error', path, sitemap.has(path) ? 'sitemap-url-broken' : 'broken-internal-link', `${status} linked from ${from || 'sitemap'}`)
    } else if (status >= 300) {
      if (sitemap.has(path)) report('error', path, 'sitemap-url-redirects', `${status} -> ${location}`)
      else if (from) report('warn', path, 'link-to-redirect', `${status} -> ${location}, linked from ${from}`)
    }
  }

  // --- Per page rules ---
  const titles = new Map()
  const descriptions = new Map()
  for (const [path, page] of pages) {
    const noindex = /noindex/i.test(page.robots)
    if (noindex) {
      if (sitemap.has(path)) report('error', path, 'noindex-in-sitemap')
      if (!NOINDEX_OK.has(path)) report('error', path, 'unexpected-noindex', page.robots)
      continue
    }
    if (!page.title) report('error', path, 'missing-title')
    if (!page.description) report('error', path, 'missing-description')
    if (!page.canonical) report('error', path, 'missing-canonical')
    else {
      const canonicalPath = toPath(page.canonical)
      if (!page.canonical.startsWith(CANONICAL_ORIGIN)) report('error', path, 'canonical-wrong-origin', page.canonical)
      else if (canonicalPath !== path) report(path === '/' || sitemap.has(path) ? 'error' : 'warn', path, 'canonical-not-self', page.canonical)
    }
    if (page.h1 !== 1) report('warn', path, 'h1-count', String(page.h1))
    if (!page.ogImage) report('warn', path, 'missing-og-image')
    if (page.lang === null) report('error', path, 'missing-html-lang')
    if (page.title.length > 70) report('warn', path, 'title-long', `${page.title.length} chars`)
    if (page.description && (page.description.length < 50 || page.description.length > 170)) {
      report('warn', path, 'description-length', `${page.description.length} chars`)
    }
    if (!page.jsonLdTypes.size) report('warn', path, 'no-structured-data')
    if (page.title) titles.set(page.title, [...(titles.get(page.title) ?? []), path])
    if (page.description) descriptions.set(page.description, [...(descriptions.get(page.description) ?? []), path])

    if (!sitemap.has(path)) report('warn', path, 'indexable-not-in-sitemap')
    const linkedFrom = [...(inbound.get(path) ?? [])].filter((p) => p !== path)
    if (path !== '/' && linkedFrom.length === 0) report('error', path, 'orphan-page', 'no internal link points here')
  }
  for (const [title, paths] of titles) if (paths.length > 1) report('error', paths.join(' '), 'duplicate-title', title)
  for (const [d, paths] of descriptions) if (paths.length > 1) report('warn', paths.join(' '), 'duplicate-description', d.slice(0, 80))

  // --- Summary ---
  const errors = issues.filter((i) => i.severity === 'error')
  const warns = issues.filter((i) => i.severity === 'warn')
  const byRule = {}
  for (const i of issues) byRule[`${i.severity}:${i.rule}`] = (byRule[`${i.severity}:${i.rule}`] ?? 0) + 1

  const types = {}
  for (const p of pages.values()) for (const t of p.jsonLdTypes) types[t] = (types[t] ?? 0) + 1

  console.log(`Crawled ${pages.size} HTML pages (${statuses.size} URLs) from ${BASE} in ${((Date.now() - started) / 1000).toFixed(1)}s`)
  console.log(`Sitemap: ${sitemap.size} URLs`)
  console.log(`Structured data types: ${Object.entries(types).map(([t, n]) => `${t} ${n}`).join(', ')}`)
  console.log('')
  for (const [rule, n] of Object.entries(byRule).sort()) console.log(`${String(n).padStart(4)}  ${rule}`)
  console.log('')
  for (const i of [...errors, ...warns].slice(0, 200)) {
    console.log(`${i.severity === 'error' ? 'ERROR' : 'warn '} ${i.rule.padEnd(26)} ${i.path}${i.detail ? `  (${i.detail})` : ''}`)
  }
  console.log(`\n${errors.length} errors, ${warns.length} warnings`)

  if (JSON_OUT) {
    fs.writeFileSync(
      JSON_OUT,
      JSON.stringify(
        {
          base: BASE,
          crawledAt: new Date().toISOString(),
          pages: [...pages.values()].map((p) => ({
            path: p.path, title: p.title, description: p.description, canonical: p.canonical,
            inSitemap: sitemap.has(p.path), inbound: (inbound.get(p.path)?.size ?? 0), jsonLdTypes: [...p.jsonLdTypes],
          })),
          issues,
        },
        null,
        2
      )
    )
  }
  process.exit(errors.length ? 1 : 0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
