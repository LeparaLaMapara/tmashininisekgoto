import { NextResponse, type NextRequest } from 'next/server'
import { slugifyTag } from '@/lib/topics'

/**
 * Redirects the old raw-tag URLs to their slugged equivalents.
 *
 * Tag pages were addressed by the tag itself, which produced `/tags/open%20source`
 * and `/tags/ci%2Fcd`. Those URLs were live and linked from every post, so they
 * get a 301 rather than a 404.
 *
 * This has to be middleware. `redirects()` in next.config.mjs did not match the
 * percent-encoded paths, and a redirect inside the route never ran either: the
 * router 404s a dynamic segment that `generateStaticParams` did not produce,
 * before any page code executes. Middleware runs ahead of routing, so it sees
 * the request regardless.
 */
export function middleware(request: NextRequest) {
  const match = request.nextUrl.pathname.match(/^\/tags\/(.+)$/)
  if (!match) return NextResponse.next()

  // `ci%2Fcd` may arrive still encoded or already split into `ci/cd`; the
  // capture group covers both because it spans slashes.
  let raw: string
  try {
    raw = decodeURIComponent(match[1])
  } catch {
    raw = match[1]
  }

  const slug = slugifyTag(raw)
  if (!slug || slug === raw) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = `/tags/${slug}`
  return NextResponse.redirect(url, 301)
}

export const config = {
  matcher: '/tags/:path*',
}
