import Link from 'next/link'
import { getAllPosts, type BlogPost } from '@/lib/blog'
import { formatDate } from '@/lib/utils'

interface RelatedPostsProps {
  slug: string
  tags: string[]
}

function pickRelated(slug: string, tags: string[]): BlogPost[] {
  const lower = tags.map((t) => t.toLowerCase())
  return getAllPosts()
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      post: p,
      score: p.tags.reduce(
        (n, t) => n + (lower.includes(t.toLowerCase()) ? 1 : 0),
        0
      ),
    }))
    .sort((a, b) => b.score - a.score || +new Date(b.post.date) - +new Date(a.post.date))
    .slice(0, 3)
    .map((s) => s.post)
}

export function RelatedPosts({ slug, tags }: RelatedPostsProps) {
  const related = pickRelated(slug, tags)
  if (related.length === 0) return null

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h2 className="font-display text-2xl font-semibold text-ivory mb-6">Keep reading</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {related.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block bg-surface border border-border rounded-2xl p-5 hover:border-synapse/40 transition-colors"
          >
            <p className="text-sm text-muted mb-2">{formatDate(post.date)}</p>
            <h3 className="font-medium text-ivory leading-snug group-hover:text-synapse transition-colors">
              {post.title}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  )
}
