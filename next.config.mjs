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
  // Note: the old percent-encoded tag URLs (/tags/open%20source, /tags/ci%2Fcd)
  // are redirected inside app/tags/[tag]/page.tsx, not here. `redirects()` did
  // not match those paths, and doing it in the route also covers any future tag
  // containing spaces or punctuation without another config entry.
}

export default nextConfig
