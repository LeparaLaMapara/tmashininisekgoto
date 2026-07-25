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
  // Note: the old percent-encoded tag URLs (/tags/open%20source, /tags/ci%2Fcd)
  // are redirected inside app/tags/[tag]/page.tsx, not here. `redirects()` did
  // not match those paths, and doing it in the route also covers any future tag
  // containing spaces or punctuation without another config entry.
}

export default nextConfig
