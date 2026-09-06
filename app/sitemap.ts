import fs from 'fs'
import path from 'path'
import type { MetadataRoute } from 'next'
import { getAllPosts, getAllTags, getPostsByTag } from '@/lib/blog'
import { SITE_URL } from '@/lib/site'

/**
 * Static routes, paired with the source file whose mtime stands in for "when
 * did this page last change". Previously every entry reported `new Date()`,
 * i.e. build time, which told crawlers the whole site changed on every deploy
 * and taught them to ignore the field.
 */
const STATIC_ROUTES: { route: string; source: string }[] = [
  { route: '', source: 'app/page.tsx' },
  { route: '/about', source: 'app/about/page.tsx' },
  { route: '/work', source: 'app/work/page.tsx' },
  { route: '/publications', source: 'app/publications/page.tsx' },
  { route: '/resume', source: 'app/resume/page.tsx' },
  { route: '/career', source: 'app/career/page.tsx' },
  { route: '/talks', source: 'app/talks/page.tsx' },
  { route: '/ai', source: 'app/ai/page.tsx' },
  { route: '/courses', source: 'app/courses/page.tsx' },
  { route: '/tags', source: 'app/tags/page.tsx' },
  { route: '/now', source: 'app/now/page.tsx' },
  // /search is intentionally absent: it is noindex, so listing it would ask
  // crawlers to index a page that tells them not to.
]

/** File mtime, falling back to now if the file has moved. */
function sourceModified(relativePath: string): Date {
  try {
    return fs.statSync(path.join(process.cwd(), relativePath)).mtime
  } catch {
    return new Date()
  }
}

/** Newest publication date in a set of posts. */
function newestPostDate(posts: { date: string }[]): Date {
  const times = posts
    .map((p) => new Date(p.date).getTime())
    .filter((t) => Number.isFinite(t))
  return times.length ? new Date(Math.max(...times)) : new Date()
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()

  const staticPages = STATIC_ROUTES.map(({ route, source }) => ({
    url: `${SITE_URL}${route}`,
    lastModified: sourceModified(source),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // /blog is as fresh as its newest post, not as fresh as the last deploy.
  const blogIndex = {
    url: `${SITE_URL}/blog`,
    lastModified: newestPostDate(posts),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }

  const postPages = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    // The revision date, not the publish date. A rewritten post that still
    // advertises its original date tells crawlers there is nothing to re-read.
    lastModified: new Date(post.lastModified),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }))

  // Tag pages were absent entirely, so nothing pointed crawlers at the topic
  // landing pages. Each is as fresh as the newest post it lists.
  const tagPages = getAllTags().map(({ name, slug }) => ({
    url: `${SITE_URL}/tags/${slug}`,
    lastModified: newestPostDate(getPostsByTag(name)),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  return [...staticPages, blogIndex, ...postPages, ...tagPages]
}
