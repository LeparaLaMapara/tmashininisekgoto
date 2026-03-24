import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const CONTENT_DIR = path.join(process.cwd(), 'content/blog')

export interface BlogPost {
  slug: string
  title: string
  date: string
  tags: string[]
  summary: string
  readingTime: string
  content: string
  published: boolean
}

function parsePost(fileName: string): BlogPost {
  const slug = fileName.replace(/\.mdx?$/, '')
  const filePath = path.join(CONTENT_DIR, fileName)
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const stats = readingTime(content)

  return {
    slug,
    title: data.title ?? slug,
    date: data.date?.toString() ?? '',
    tags: (data.tags as string[]) ?? [],
    summary: data.summary ?? '',
    readingTime: stats.text,
    content,
    published: data.published !== false,
  }
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(CONTENT_DIR)) return []

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx'))

  return files
    .map(parsePost)
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): BlogPost | null {
  const fileName = `${slug}.mdx`
  const filePath = path.join(CONTENT_DIR, fileName)

  if (!fs.existsSync(filePath)) return null

  return parsePost(fileName)
}

export function getAllTags(): { name: string; count: number }[] {
  const posts = getAllPosts()
  const tagMap = new Map<string, number>()

  for (const post of posts) {
    for (const tag of post.tags) {
      const lower = tag.toLowerCase()
      tagMap.set(lower, (tagMap.get(lower) ?? 0) + 1)
    }
  }

  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

export function getPostsByTag(tag: string): BlogPost[] {
  const lower = tag.toLowerCase()
  return getAllPosts().filter((post) =>
    post.tags.some((t) => t.toLowerCase() === lower)
  )
}
