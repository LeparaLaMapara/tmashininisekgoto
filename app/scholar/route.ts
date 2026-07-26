import { SOCIAL_LINKS } from '@/lib/data'

/**
 * `/scholar` -> the Google Scholar profile.
 *
 * A short, memorable URL for an email signature, a talk slide or a conference
 * bio, which survives Google changing its profile URL format. The Scholar link
 * is long, opaque and easy to mistype; this one is not.
 *
 * 307 rather than 301: a permanent redirect is cached by browsers indefinitely,
 * and the target is the single thing here most likely to change.
 */

export function GET() {
  return new Response(null, {
    status: 307,
    headers: {
      Location: SOCIAL_LINKS.scholar,
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  })
}
