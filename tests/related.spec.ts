import { test, expect } from '@playwright/test'
import { getRelated, getRelatedForPost } from '../lib/related'
import { getAllPosts } from '../lib/blog'
import { PROJECTS } from '../lib/data'

/**
 * The related engine must be deterministic and safe: no self-recommendation,
 * no duplicates, stable order, and genuinely cross-type. These run in-process,
 * no server needed.
 */

test.describe('related content engine', () => {
  test('never recommends the item itself', () => {
    for (const post of getAllPosts()) {
      const related = getRelatedForPost(post.slug)
      expect(related.some((r) => r.type === 'Post' && r.key === post.slug)).toBe(false)
    }
  })

  test('produces no duplicates', () => {
    for (const post of getAllPosts()) {
      const related = getRelatedForPost(post.slug)
      const ids = related.map((r) => `${r.type}:${r.href}:${r.title}`)
      expect(new Set(ids).size).toBe(ids.length)
    }
  })

  test('is deterministic across calls', () => {
    const post = getAllPosts()[0]
    const a = getRelatedForPost(post.slug)
    const b = getRelatedForPost(post.slug)
    expect(a).toEqual(b)
  })

  test('every result is navigable and typed', () => {
    const related = getRelatedForPost(getAllPosts()[0].slug)
    for (const r of related) {
      expect(r.href).toMatch(/^\//)
      expect(['Post', 'Project', 'Publication', 'Talk']).toContain(r.type)
      expect(r.title.length).toBeGreaterThan(0)
    }
  })

  test('reaches beyond articles into other content types', () => {
    // Across the whole corpus at least one post should relate to something that
    // is not another post — that is the entire point of the cross-type engine.
    const anyCrossType = getAllPosts().some((post) =>
      getRelatedForPost(post.slug).some((r) => r.type !== 'Post')
    )
    expect(anyCrossType).toBe(true)
  })

  test('respects the limit', () => {
    const related = getRelatedForPost(getAllPosts()[0].slug, 2)
    expect(related.length).toBeLessThanOrEqual(2)
  })

  test('works from a non-post source too', () => {
    const project = PROJECTS[0]
    const related = getRelated({ type: 'Project', key: project.slug })
    expect(related.some((r) => r.type === 'Project' && r.key === project.slug)).toBe(false)
  })
})
