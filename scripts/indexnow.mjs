/**
 * Tell IndexNow which URLs changed.
 *
 * IndexNow is a single submission that reaches Bing, Yandex, Seznam and Naver.
 * Google does not participate, which is why the sitemap and Search Console
 * still matter; this covers the rest for the cost of one request per deploy.
 *
 * The key is public by design. Ownership is proved by serving the same value at
 * https://<host>/<key>.txt, which is why the file lives in public/ and is
 * committed. There is no secret here to leak.
 *
 * Usage:
 *   node scripts/indexnow.mjs            submit every URL in the sitemap
 *   node scripts/indexnow.mjs --dry-run  print what would be submitted
 */

const KEY = '4c15afbe7a404b1390da9d0b8bc24c0b'
const HOST = 'www.tmashininisekgoto.com'
const ORIGIN = `https://${HOST}`
const ENDPOINT = 'https://api.indexnow.org/IndexNow'

const dryRun = process.argv.includes('--dry-run')

/** Every URL the site says is indexable, read from the live sitemap. */
async function sitemapUrls() {
  const res = await fetch(`${ORIGIN}/sitemap.xml`)
  if (!res.ok) throw new Error(`sitemap returned ${res.status}`)
  const xml = await res.text()
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
}

async function main() {
  const urlList = await sitemapUrls()

  if (urlList.length === 0) {
    // Submitting an empty list is not an error, it is a sign the sitemap broke.
    console.error('IndexNow: sitemap returned no URLs, refusing to submit')
    process.exit(1)
  }

  console.log(`IndexNow: ${urlList.length} URLs from the sitemap`)

  if (dryRun) {
    for (const url of urlList) console.log(`  ${url}`)
    return
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${ORIGIN}/${KEY}.txt`, urlList }),
  })

  // 200 accepted, 202 accepted but the key is still being verified. Anything
  // else is worth seeing in the log, but never worth failing a deploy over:
  // the site is already live at this point and the sitemap is the fallback.
  const body = await res.text().catch(() => '')
  console.log(`IndexNow: HTTP ${res.status}${body ? ` ${body.slice(0, 200)}` : ''}`)
}

main().catch((err) => {
  console.error('IndexNow submission failed:', err.message)
  // Deliberately exit 0. A failed ping must not turn a good deploy red.
  process.exit(0)
})
