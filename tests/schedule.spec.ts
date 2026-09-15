import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { test, expect } from '@playwright/test'
import { getAllPosts, getUnpublishedPosts } from '../lib/blog'

/**
 * The publishing schedule: posts carry `publishOn` and the publish-scheduled
 * workflow flips them live on that day. These guard the schedule itself (in
 * process) and the one thing a reader would notice if it went wrong: a live
 * page linking to a post that is not out yet.
 */

const CONTENT_DIR = path.join(process.cwd(), 'content/blog')

function frontmatter() {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => ({ slug: f.replace(/\.mdx$/, ''), data: matter(fs.readFileSync(path.join(CONTENT_DIR, f), 'utf-8')).data }))
}

const day = (value: unknown) => new Date(String(value)).toISOString().slice(0, 10)

test.describe('publishing schedule', () => {
  // The rule governs the queue ahead, not what has already gone out: a whole
  // series can be released at once on purpose, as the agents roadmap was on
  // 12 September 2026.
  test('posts still waiting go out on Mondays and Thursdays, one per day', () => {
    const scheduled = frontmatter().filter((p) => p.data.publishOn && p.data.published === false)
    const days = scheduled.map((p) => day(p.data.publishOn))
    expect(new Set(days).size, 'two posts share a publishOn date').toBe(days.length)
    for (const p of scheduled) {
      const weekday = new Date(`${day(p.data.publishOn)}T00:00:00Z`).getUTCDay()
      expect([1, 4], `${p.slug} is scheduled on a ${weekday} (0 = Sunday)`).toContain(weekday)
    }
  })

  test('series parts are scheduled in reading order', () => {
    const bySeries = new Map<string, { part: number; when: string }[]>()
    for (const p of frontmatter()) {
      if (!p.data.series || !p.data.publishOn) continue
      const list = bySeries.get(p.data.series) ?? []
      list.push({ part: p.data.seriesPart, when: day(p.data.publishOn) })
      bySeries.set(p.data.series, list)
    }
    for (const [series, parts] of bySeries) {
      const byPart = [...parts].sort((a, b) => a.part - b.part).map((p) => p.when)
      expect(byPart, series).toEqual([...byPart].sort())
    }
  })

  test('a scheduled post is dated the day it goes live', () => {
    // Moving a post means changing both lines. This catches the one that was forgotten.
    for (const p of frontmatter().filter((p) => p.data.publishOn)) {
      expect(day(p.data.date), `${p.slug}: date and publishOn differ`).toBe(day(p.data.publishOn))
    }
  })

  test('a scheduled post shows its publishOn date, not the draft date', () => {
    for (const p of frontmatter().filter((p) => p.data.publishOn && p.data.published !== false)) {
      const live = getAllPosts().find((post) => post.slug === p.slug)!
      expect(day(live.date), p.slug).toBe(day(p.data.publishOn))
    }
  })
})

test.describe('links to posts that are not out yet', () => {
  test('no live post links to an unpublished one', async ({ request }) => {
    const unpublished = getUnpublishedPosts()
    for (const post of getAllPosts()) {
      const html = await (await request.get(`/blog/${post.slug}`)).text()
      for (const slug of unpublished.keys()) {
        expect(html, `${post.slug} links to unpublished ${slug}`).not.toContain(`href="/blog/${slug}"`)
      }
    }
  })

  test('the next-part pointer names the date instead', async ({ request }) => {
    const partTwo = getUnpublishedPosts().get('agent-tools-and-integrations')
    test.skip(!partTwo, 'Part 2 is live, so the pointer is a normal link now')
    const html = await (await request.get('/blog/how-i-used-ai-to-build-this-site')).text()
    expect(html).toContain('Part 2: Giving an Agent Hands')
    expect(html).toContain('(out ')
  })
})
