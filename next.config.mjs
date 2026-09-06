/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'mg.co.za' },
      { hostname: '*.youtube.com' },
      { hostname: 'raw.githubusercontent.com' },
    ],
  },
  webpack: (config) => {
    config.resolve.alias['@'] = process.cwd()
    return config
  },
  async rewrites() {
    return [
      // `/blog/<slug>.md` serves the plain-markdown copy of a post. The handler
      // has to live under /api because `app/blog/[slug]/` is already the HTML
      // page, and one directory cannot be both a page and a route handler.
      //
      // Appending `.md` to an article URL is the convention AI crawlers and
      // doc tools have settled on, so it is worth the rewrite rather than
      // exposing the /api path.
      { source: '/blog/:slug.md', destination: '/api/md/blog/:slug' },
    ]
  },
  async redirects() {
    return [
      // Two ThabangVision posts published on 2026-09-03 were reorganised the
      // same day into the seven part system design series. Their slugs named a
      // commit count and a thesis rather than a subject, which no longer
      // matches the content, so both pointed at the series map.
      //
      // The map is now unpublished, so those redirects were sending a
      // permanent 308 to a 404. They land on the blog index instead until the
      // series goes live.
      //
      // Temporary on purpose: the source slugs are retired for good, but this
      // destination is not the real one. When the map is published, point both
      // back at it and make them permanent again.
      {
        source: '/blog/building-a-marketplace-in-176-days',
        destination: '/blog',
        permanent: false,
      },
      {
        source: '/blog/the-platform-is-a-design-input',
        destination: '/blog',
        permanent: false,
      },
    ]
  },
  // Note: the old percent-encoded tag URLs (/tags/open%20source, /tags/ci%2Fcd)
  // are redirected inside app/tags/[tag]/page.tsx, not here. `redirects()` did
  // not match those paths, and doing it in the route also covers any future tag
  // containing spaces or punctuation without another config entry.
}

export default nextConfig
