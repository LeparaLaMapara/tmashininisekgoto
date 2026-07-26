import { SITE_URL } from '@/lib/site'

/**
 * robots.txt, hand-built.
 *
 * This was `app/robots.ts` using Next's metadata convention. It is a route
 * handler now for one reason: `MetadataRoute.Robots` can only emit the fields
 * in the spec, and the useful thing to add here is a set of comment lines
 * pointing at /llms.txt, /llms-full.txt and /ai.txt.
 *
 * Those pointers are not standard, and no crawler is obliged to follow them.
 * They cost three lines and robots.txt is the first file every crawler fetches,
 * which makes it the cheapest place to advertise that the machine-readable
 * copies exist.
 */

export const dynamic = 'force-static'

// AI crawlers are welcomed by name so there is no ambiguity: being readable
// by AI search (ChatGPT, Claude, Perplexity, Google AI) is a distribution
// channel, not a threat. See also /llms.txt and /ai.txt.
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
  'cohere-ai',
  'CCBot',
]

export function GET() {
  const body = [
    '# Everything here is meant to be read, by people and by machines alike.',
    '# Identity and usage terms: /ai.txt',
    '# Index for language models: /llms.txt',
    '# Full text for language models: /llms-full.txt',
    '# Any post is available as markdown by appending .md to its URL.',
    '',
    'User-agent: *',
    'Allow: /',
    '',
    ...AI_CRAWLERS.flatMap((agent) => [`User-agent: ${agent}`, 'Allow: /', '']),
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n')

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
