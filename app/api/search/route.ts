import { NextResponse } from 'next/server'
import { search } from '@/lib/search'

/**
 * Search as JSON, for the Cmd+K palette.
 *
 * The palette used to filter hardcoded title lists on the client, which is the
 * title-only matching the search brief rules out: it never reached article
 * bodies, publications or courses. This exposes the real engine in `lib/search`
 * — the same one the server-rendered `/search` page uses — so the palette and
 * the page return identical, multi-field, scored results.
 *
 * Only public content is indexed (the engine reads the same published sources
 * as the sitemap), so nothing unpublished can leak through here.
 */
export function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = (searchParams.get('q') ?? '').trim()

  // An empty query returns nothing rather than the whole index: the palette
  // shows its static quick-nav until the user actually types.
  if (q.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const results = search(q, 20)

  return NextResponse.json(
    { results },
    {
      headers: {
        // Safe to cache briefly at the edge: results are a pure function of the
        // query and the published corpus, which only changes on deploy.
        'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600',
      },
    }
  )
}
