import { getAllPosts, getPostBySlug } from '@/lib/blog'
import { postToMarkdown } from '@/lib/post-markdown.mjs'
import { SITE_URL } from '@/lib/site'

/**
 * The plain-markdown copy of a post, served at `/blog/<slug>.md`.
 *
 * The public URL comes from a rewrite in `next.config.mjs`; this handler lives
 * under `/api` because `app/blog/[slug]/` already holds the HTML page and a
 * directory cannot be both a page and a route handler.
 *
 * Why bother: an LLM crawler fetching the HTML page gets a React shell, a nav,
 * a table of contents, a comment form and a subscribe box wrapped around the
 * prose. The markdown copy is the prose. Every post links to its own `.md` from
 * `<link rel="alternate">`, and `/llms.txt` lists them, which is the convention
 * the AI search crawlers have converged on.
 */

export const dynamic = 'force-static'

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  // `published: false` has to 404 here too, not just drop out of the listing.
  // generateStaticParams only controls what is prerendered; an unlisted slug is
  // still served on demand, so a scheduled post would be readable early by
  // anyone who knew or guessed the URL.
  if (!post || !post.published) {
    return new Response('Not found\n', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }

  return new Response(postToMarkdown(post, SITE_URL), {
    headers: {
      // text/markdown, not text/plain: it tells a fetcher what it is holding.
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
