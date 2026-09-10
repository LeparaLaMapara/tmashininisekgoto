/**
 * The client IP to key rate limits on.
 *
 * The bug this fixes: several routes read `x-forwarded-for` and take
 * `.split(',')[0]`, the first entry. On a platform that appends to the header,
 * the first entry is whatever the client sent, so anyone can rotate it and get
 * a fresh rate-limit bucket per request. That turns the per-IP daily cap on the
 * paid chat endpoint into no cap at all, and the comment flood limit into none.
 *
 * `x-real-ip` is set by the Vercel proxy from the actual TCP peer and is not
 * carried through from a client-supplied header, so it is the trustworthy
 * source in production. `x-forwarded-for` stays as a local-dev fallback only,
 * where there is no proxy and nothing to spoof.
 *
 * This does not make the value cryptographically trustworthy, nothing at the
 * HTTP layer can, but it removes the trivial one-header bypass and is the
 * correct source for this platform.
 */
export function clientIp(headers: Headers): string {
  const real = headers.get('x-real-ip')?.trim()
  if (real) return real

  const forwarded = headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  if (forwarded) return forwarded

  return 'unknown'
}
