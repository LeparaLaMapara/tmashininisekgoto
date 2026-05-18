import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'

const SITE_URL = 'https://tmashininisekgoto.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    '', '/about', '/blog', '/work', '/publications',
    '/resume', '/talks', '/ai', '/courses', '/tags',
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/blog' ? 'weekly' as const : 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  const posts = getAllPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...posts]
}
