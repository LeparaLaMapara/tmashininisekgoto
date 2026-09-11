#!/usr/bin/env node
// Publish blog posts whose day has come, or print the schedule.
//
// A scheduled post is `published: false` with a `publishOn: YYYY-MM-DD` line in
// its frontmatter. On or after that date (South African time) this flips it to
// `published: true`. Nothing else in the file is touched, so the diff is one
// line per post and merges into nonprod without a conflict.
//
// Usage:
//   node scripts/blog/publish-due.mjs              # flip every post that is due
//   node scripts/blog/publish-due.mjs --dry-run    # say what would be flipped
//   node scripts/blog/publish-due.mjs --list       # print the whole schedule
//   node scripts/blog/publish-due.mjs --today 2026-09-14   # pretend it is that day
//
// In GitHub Actions it writes `count` and `slugs` (published by this run) and
// `recent` (live within the last few days, ready to syndicate) to $GITHUB_OUTPUT.
//
// Deliberately dependency free (no gray-matter), so the workflow that runs it
// does not need an npm install.

import fs from 'node:fs'
import path from 'node:path'

const CONTENT_DIR = path.join(process.cwd(), 'content/blog')
const TIME_ZONE = 'Africa/Johannesburg'

const args = process.argv.slice(2)
const flag = (name) => args.includes(name)
const option = (name) => {
  const i = args.indexOf(name)
  return i >= 0 ? args[i + 1] : undefined
}

// en-CA formats as YYYY-MM-DD, which compares correctly as a string.
const today =
  option('--today') ?? new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(new Date())

if (!/^\d{4}-\d{2}-\d{2}$/.test(today)) {
  console.error(`--today must be YYYY-MM-DD, got "${today}"`)
  process.exit(1)
}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---/

function field(frontmatter, name) {
  const match = frontmatter.match(new RegExp(`^${name}:\\s*(.+?)\\s*$`, 'm'))
  return match ? match[1].replace(/^["']|["']$/g, '') : undefined
}

function readPosts() {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((file) => {
      const filePath = path.join(CONTENT_DIR, file)
      const raw = fs.readFileSync(filePath, 'utf-8')
      const frontmatter = raw.match(FRONTMATTER)?.[1] ?? ''
      const publishOn = field(frontmatter, 'publishOn')
      if (publishOn && !/^\d{4}-\d{2}-\d{2}$/.test(publishOn)) {
        throw new Error(`${file}: publishOn must be YYYY-MM-DD, got "${publishOn}"`)
      }
      return {
        file,
        filePath,
        raw,
        slug: file.replace(/\.mdx$/, ''),
        title: field(frontmatter, 'title') ?? file,
        published: field(frontmatter, 'published') !== 'false',
        publishOn,
      }
    })
}

function weekday(day) {
  return new Date(`${day}T00:00:00Z`).toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'UTC' })
}

const posts = readPosts()

if (flag('--list')) {
  const scheduled = posts
    .filter((p) => p.publishOn)
    .sort((a, b) => a.publishOn.localeCompare(b.publishOn))
  const held = posts.filter((p) => !p.published && !p.publishOn)

  console.log(`Schedule (today is ${today}, ${TIME_ZONE})\n`)
  for (const p of scheduled) {
    const status = p.published ? 'live     ' : p.publishOn <= today ? 'DUE      ' : 'scheduled'
    console.log(`${p.publishOn} ${weekday(p.publishOn)}  ${status}  ${p.title}`)
  }
  if (held.length) {
    console.log(`\nHeld (unpublished, no publishOn):`)
    for (const p of held) console.log(`  ${p.slug}`)
  }
  process.exit(0)
}

const due = posts
  .filter((p) => !p.published && p.publishOn && p.publishOn <= today)
  .sort((a, b) => a.publishOn.localeCompare(b.publishOn))

for (const post of due) {
  const updated = post.raw.replace(FRONTMATTER, (block) =>
    block.replace(/^published:\s*false\s*$/m, 'published: true'),
  )
  if (updated === post.raw) throw new Error(`${post.file}: could not find "published: false" to flip`)
  if (!flag('--dry-run')) fs.writeFileSync(post.filePath, updated)
  console.log(`${flag('--dry-run') ? 'would publish' : 'published'}: ${post.slug} (publishOn ${post.publishOn})`)
}

if (due.length === 0) console.log(`Nothing due on ${today}.`)

// Posts that went live on one of the previous few days are the ones to
// syndicate. Not today's: the canonical copy should be indexed before a
// dev.to or Hashnode copy exists. A window rather than just yesterday, so a
// skipped run still catches up; the syndication script skips anything it has
// already sent unchanged, so re-sending within the window is harmless.
const SYNDICATE_WINDOW_DAYS = 3
const windowStart = new Date(`${today}T00:00:00Z`)
windowStart.setUTCDate(windowStart.getUTCDate() - SYNDICATE_WINDOW_DAYS)
const since = windowStart.toISOString().slice(0, 10)
const recent = posts.filter((p) => p.published && p.publishOn && p.publishOn >= since && p.publishOn < today)
if (recent.length) console.log(`Recently live, to syndicate: ${recent.map((p) => p.slug).join(' ')}`)

if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(
    process.env.GITHUB_OUTPUT,
    `count=${due.length}\nslugs=${due.map((p) => p.slug).join(' ')}\nrecent=${recent.map((p) => p.slug).join(' ')}\n`,
  )
}
