/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'mg.co.za' },
      { hostname: '*.youtube.com' },
      { hostname: 'img.youtube.com' },
      { hostname: 'raw.githubusercontent.com' },
    ],
  },
  webpack: (config) => {
    config.resolve.alias['@'] = process.cwd()
    return config
  },
  /**
   * Security response headers.
   *
   * The site had none. These are the four that cost nothing and close real
   * gaps, plus a Content Security Policy in REPORT ONLY mode.
   *
   * The CSP is deliberately not enforced yet. This site loads a 3D career
   * scene, a GitHub contribution calendar that fetches its own data, Vercel
   * analytics, and Google Fonts. Enforcing a policy written blind would break
   * one of them in production and the failure would be silent. Report only
   * collects violations first; promote it to `Content-Security-Policy` once the
   * reports are clean.
   */
  async headers() {
    const csp = [
      "default-src 'self'",
      // Next injects inline bootstrap scripts, and the analytics scripts are
      // served from Vercel.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://*.supabase.co https://api.github.com https://va.vercel-scripts.com",
      "frame-src https://www.youtube.com https://youtube.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ].join('; ')

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          { key: 'Content-Security-Policy-Report-Only', value: csp },
        ],
      },
    ]
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
