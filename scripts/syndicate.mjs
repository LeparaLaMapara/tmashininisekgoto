/**
 * Cross-post the blog to dev.to and Hashnode, and prepare the manual platforms.
 *
 *   node scripts/syndicate.mjs                     # dry run: says what it would do
 *   node scripts/syndicate.mjs --publish           # actually push
 *   node scripts/syndicate.mjs --post <slug>       # one post only
 *   node scripts/syndicate.mjs --platform devto    # devto | hashnode | manual
 *   node scripts/syndicate.mjs --draft             # push unpublished, for review
 *
 * ## The canonical rule, which is the whole point
 *
 * Every copy pushed from here carries a canonical URL pointing back at
 * tmashininisekgoto.com. That tag goes on the *copy*, never on the original.
 * dev.to calls it `canonical_url`, Hashnode calls it `originalArticleURL`, and
 * both hand the ranking credit to the site rather than keeping it.
 *
 * The corollary is publish order: post here first and let it be indexed, then
 * syndicate. Doing it the other way round means Google meets the copy first and
 * may keep treating it as the original whatever the tag says.
 *
 * ## Dry run by default
 *
 * Publishing to someone else's platform under your name is not undoable in any
 * meaningful sense: a deleted dev.to article leaves a dead URL, and Hashnode
 * emails your followers. So `--publish` is required, every time, and without it
 * this prints a diff and exits.
 *
 * ## Medium and LinkedIn
 *
 * Neither is automated here, for different reasons.
 *
 * Medium retired its publishing API (integration tokens stopped being issued in
 * 2023). Its import tool sets `rel="canonical"` back to the source URL by
 * itself, which is better than anything the API did, so the right move is a
 * paste rather than a POST.
 *
 * LinkedIn has no canonical mechanism at all. Republishing an article there in
 * full creates a copy that outranks the original for your own name and gives
 * nothing back. So this generates a short post with a link instead.
 *
 * Both get files written to data/syndication-drafts/ ready to paste.
 */

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import process from 'node:process'
import matter from 'gray-matter'
import { syndicationBody } from '../lib/post-markdown.mjs'

const ROOT = process.cwd()
const CONTENT_DIR = path.join(ROOT, 'content', 'blog')
const STATE_FILE = path.join(ROOT, 'data', 'syndication.json')
const DRAFTS_DIR = path.join(ROOT, 'data', 'syndication-drafts')

// Kept in sync with lib/site.ts by hand: this is a plain node script and
// importing a TypeScript module would mean adding a build step to a script
// whose entire value is that it has none.
const SITE_URL = 'https://www.tmashininisekgoto.com'

/* -------------------------------------------------------------------------- */
/* Arguments and environment                                                  */
/* -------------------------------------------------------------------------- */

function parseArgs(argv) {
  const flag = (name) => argv.includes(`--${name}`)
  const value = (name) => {
    const index = argv.indexOf(`--${name}`)
    return index >= 0 ? argv[index + 1] : undefined
  }
  return {
    publish: flag('publish'),
    draft: flag('draft'),
    post: value('post'),
    platform: value('platform'),
  }
}

const args = parseArgs(process.argv.slice(2))

const ENV = {
  devtoKey: process.env.DEVTO_API_KEY,
  hashnodeToken: process.env.HASHNODE_TOKEN,
  hashnodePublicationId: process.env.HASHNODE_PUBLICATION_ID,
}

const wants = (platform) => !args.platform || args.platform === platform

/* -------------------------------------------------------------------------- */
/* Posts                                                                      */
/* -------------------------------------------------------------------------- */

function readPosts() {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8')
      const { data, content } = matter(raw)
      return {
        slug: file.replace(/\.mdx?$/, ''),
        title: data.title ?? file,
        date: data.date?.toString() ?? '',
        tags: data.tags ?? [],
        summary: data.summary ?? '',
        seoDescription: data.seoDescription,
        published: data.published !== false,
        // A post that was genuinely first published elsewhere must not be
        // syndicated from here: the copy would claim a canonical that already
        // belongs to someone else's URL.
        canonical: data.canonical,
        content,
      }
    })
    .filter((post) => post.published && !post.canonical)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

/**
 * Platform tags.
 *
 * dev.to rejects anything that is not alphanumeric and allows four, so
 * `open source` becomes `opensource` and `ci/cd` becomes `cicd`. Truncating is
 * better than failing the whole request on a tag nobody will search for.
 */
function devtoTags(tags) {
  return tags
    .map((tag) => tag.toLowerCase().replace(/[^a-z0-9]/g, ''))
    .filter(Boolean)
    .slice(0, 4)
}

function hashnodeTags(tags) {
  return tags.slice(0, 5).map((tag) => ({
    slug: tag.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    name: tag.replace(/\b\w/g, (c) => c.toUpperCase()),
  }))
}

/** The one-line description platforms show under the title. */
function description(post) {
  const text = post.seoDescription || post.summary
  return text.length <= 250 ? text : `${text.slice(0, 247).trimEnd()}...`
}

/**
 * The dev.to series name, when a post belongs to one.
 *
 * A `… series` tag is how the series is marked in the frontmatter here, and
 * dev.to renders a series as a linked index at the top of every part, which is
 * most of the value of cross-posting a six-part run.
 */
function seriesName(post) {
  const tag = post.tags.find((t) => /\bseries\b/i.test(t))
  if (!tag) return undefined
  return tag.replace(/\b\w/g, (c) => c.toUpperCase())
}

function contentHash(post, body) {
  return crypto
    .createHash('sha256')
    .update(`${post.title}\n${description(post)}\n${body}`)
    .digest('hex')
    .slice(0, 16)
}

/* -------------------------------------------------------------------------- */
/* State                                                                      */
/* -------------------------------------------------------------------------- */

function readState() {
  if (!fs.existsSync(STATE_FILE)) return { posts: {} }
  return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'))
}

function writeState(state) {
  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true })
  fs.writeFileSync(STATE_FILE, `${JSON.stringify(state, null, 2)}\n`, 'utf-8')
}

/* -------------------------------------------------------------------------- */
/* dev.to                                                                     */
/* -------------------------------------------------------------------------- */

async function devtoRequest(pathname, { method = 'GET', body } = {}) {
  const response = await fetch(`https://dev.to/api${pathname}`, {
    method,
    headers: {
      'api-key': ENV.devtoKey,
      'Content-Type': 'application/json',
      accept: 'application/vnd.forem.api-v1+json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const text = await response.text()
  if (!response.ok) {
    throw new Error(`dev.to ${method} ${pathname} -> ${response.status}: ${text.slice(0, 300)}`)
  }
  return text ? JSON.parse(text) : null
}

/**
 * Existing dev.to articles, keyed by canonical URL.
 *
 * Reconciling against the live account rather than trusting the state file
 * alone: the file can be stale after a manual edit on dev.to, and posting a
 * duplicate is the one failure mode that cannot be quietly fixed.
 */
async function devtoExisting() {
  const articles = await devtoRequest('/articles/me/all?per_page=100')
  const byCanonical = new Map()
  for (const article of articles) {
    if (article.canonical_url) byCanonical.set(article.canonical_url, article)
  }
  return byCanonical
}

function devtoPayload(post, body) {
  return {
    article: {
      title: post.title,
      body_markdown: body,
      published: !args.draft,
      canonical_url: `${SITE_URL}/blog/${post.slug}`,
      description: description(post),
      tags: devtoTags(post.tags),
      series: seriesName(post),
    },
  }
}

async function syndicateDevto(posts, state) {
  if (!ENV.devtoKey) {
    console.log('dev.to: skipped, DEVTO_API_KEY is not set')
    return
  }

  console.log('\ndev.to')
  // Fetched on a dry run too: knowing whether a post already exists there is
  // most of what the dry run is for.
  const existing = await devtoExisting()

  for (const post of posts) {
    const body = syndicationBody(post, SITE_URL)
    const canonical = `${SITE_URL}/blog/${post.slug}`
    const hash = contentHash(post, body)
    const tracked = state.posts[post.slug]?.devto
    const live = existing.get(canonical)

    if (live && tracked?.hash === hash) {
      console.log(`  unchanged  ${post.slug}`)
      continue
    }

    const action = live ? 'update' : 'create'
    if (!args.publish) {
      console.log(`  would ${action}  ${post.slug}${live ? ` (id ${live.id})` : ''}`)
      continue
    }

    const payload = devtoPayload(post, body)
    const result = live
      ? await devtoRequest(`/articles/${live.id}`, { method: 'PUT', body: payload })
      : await devtoRequest('/articles', { method: 'POST', body: payload })

    state.posts[post.slug] = {
      ...state.posts[post.slug],
      devto: { id: result.id, url: result.url, hash, syncedAt: new Date().toISOString() },
    }
    console.log(`  ${action}d   ${post.slug} -> ${result.url}`)

    // dev.to allows roughly 30 article writes per 30 seconds. One second
    // between calls keeps a full backfill inside that without thinking about it.
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
}

/* -------------------------------------------------------------------------- */
/* Hashnode                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * The Hashnode GraphQL endpoint.
 *
 * `gql.hashnode.com` now 301s to an announcement page, and a 301 turns a POST
 * into a GET in every fetch implementation, so the request fails in a way that
 * looks like a bad query rather than a moved endpoint. The live host is
 * gql-beta.
 *
 * Note also that Hashnode put the API behind its Pro plan on 13 May 2026, for
 * reads as well as writes. Reads work on this account today; if publishing
 * starts returning an authorisation error, that is the reason, not the token.
 */
const HASHNODE_ENDPOINT = 'https://gql-beta.hashnode.com/'

async function hashnodeRequest(query, variables) {
  const response = await fetch(HASHNODE_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: ENV.hashnodeToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  })

  const payload = await response.json()
  if (payload.errors) {
    throw new Error(`Hashnode: ${payload.errors.map((e) => e.message).join('; ')}`)
  }
  return payload.data
}

const HASHNODE_PUBLISH = `
  mutation PublishPost($input: PublishPostInput!) {
    publishPost(input: $input) { post { id slug url } }
  }
`

const HASHNODE_UPDATE = `
  mutation UpdatePost($input: UpdatePostInput!) {
    updatePost(input: $input) { post { id slug url } }
  }
`

async function syndicateHashnode(posts, state) {
  if (!ENV.hashnodeToken || !ENV.hashnodePublicationId) {
    console.log('Hashnode: skipped, HASHNODE_TOKEN or HASHNODE_PUBLICATION_ID is not set')
    return
  }

  console.log('\nHashnode')

  for (const post of posts) {
    const body = syndicationBody(post, SITE_URL)
    const hash = contentHash(post, body)
    const tracked = state.posts[post.slug]?.hashnode

    if (tracked?.hash === hash) {
      console.log(`  unchanged  ${post.slug}`)
      continue
    }

    const action = tracked?.id ? 'update' : 'create'
    if (!args.publish) {
      console.log(`  would ${action}  ${post.slug}`)
      continue
    }

    const shared = {
      title: post.title,
      subtitle: description(post).slice(0, 150),
      contentMarkdown: body,
      tags: hashnodeTags(post.tags),
      // Hashnode's name for the canonical tag on the copy.
      originalArticleURL: `${SITE_URL}/blog/${post.slug}`,
    }

    const data = tracked?.id
      ? await hashnodeRequest(HASHNODE_UPDATE, { input: { id: tracked.id, ...shared } })
      : await hashnodeRequest(HASHNODE_PUBLISH, {
          input: { publicationId: ENV.hashnodePublicationId, ...shared },
        })

    const result = data.publishPost?.post ?? data.updatePost?.post
    state.posts[post.slug] = {
      ...state.posts[post.slug],
      hashnode: { id: result.id, url: result.url, hash, syncedAt: new Date().toISOString() },
    }
    console.log(`  ${action}d   ${post.slug} -> ${result.url}`)
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
}

/* -------------------------------------------------------------------------- */
/* Medium and LinkedIn: files to paste                                        */
/* -------------------------------------------------------------------------- */

function writeManualDrafts(posts) {
  console.log('\nMedium and LinkedIn (manual)')
  fs.mkdirSync(DRAFTS_DIR, { recursive: true })

  const mediumChecklist = [
    '# Medium import checklist',
    '',
    'Medium retired its publishing API, but its importer is better than the API',
    'was: it sets rel="canonical" back to the source URL automatically, so the',
    'ranking credit stays on tmashininisekgoto.com.',
    '',
    'For each URL below: open https://medium.com/p/import, paste the URL, import,',
    'check the canonical link in story settings, publish.',
    '',
    ...posts.map((post) => `- [ ] ${SITE_URL}/blog/${post.slug}`),
    '',
  ].join('\n')

  fs.writeFileSync(path.join(DRAFTS_DIR, 'medium-import.md'), mediumChecklist, 'utf-8')
  console.log(`  wrote ${path.relative(ROOT, path.join(DRAFTS_DIR, 'medium-import.md'))}`)

  // LinkedIn gets an excerpt and a link, never the full article. There is no
  // canonical mechanism there, so a full republish creates a copy that competes
  // with the original for your own name.
  const linkedin = posts
    .map((post) =>
      [
        post.title,
        '',
        post.summary,
        '',
        `Full post: ${SITE_URL}/blog/${post.slug}`,
        '',
        post.tags
          .slice(0, 5)
          .map((tag) => `#${tag.replace(/[^a-zA-Z0-9]/g, '')}`)
          .join(' '),
        '',
        '---',
        '',
      ].join('\n')
    )
    .join('\n')

  const linkedinFile = path.join(DRAFTS_DIR, 'linkedin-posts.txt')
  fs.writeFileSync(linkedinFile, linkedin, 'utf-8')
  console.log(`  wrote ${path.relative(ROOT, linkedinFile)}`)
}

/* -------------------------------------------------------------------------- */
/* Main                                                                       */
/* -------------------------------------------------------------------------- */

async function main() {
  let posts = readPosts()
  if (args.post) {
    posts = posts.filter((post) => post.slug === args.post)
    if (posts.length === 0) throw new Error(`No published post with slug "${args.post}"`)
  }

  console.log(`${posts.length} post(s) eligible for syndication`)
  if (!args.publish) {
    console.log('DRY RUN. Nothing will be sent. Re-run with --publish to push.')
  }
  if (args.draft) {
    console.log('Draft mode: dev.to articles will be created unpublished.')
  }

  const state = readState()

  if (wants('devto')) await syndicateDevto(posts, state)
  if (wants('hashnode')) await syndicateHashnode(posts, state)
  if (wants('manual')) writeManualDrafts(posts)

  if (args.publish) {
    writeState(state)
    console.log(`\nState written to ${path.relative(ROOT, STATE_FILE)}`)
  }

  console.log('\nReminder: publish here first and let the post be indexed, then')
  console.log('syndicate. The canonical tag is on the copies, never on the original.')
}

main().catch((error) => {
  console.error(`\n${error.message}`)
  process.exit(1)
})
