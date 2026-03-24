/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'mg.co.za' },
      { hostname: '*.youtube.com' },
      { hostname: 'raw.githubusercontent.com' },
    ],
  },
  // Ignore the old CRA src/ directory
  webpack: (config) => {
    config.resolve.alias['@'] = process.cwd()
    return config
  },
}

export default nextConfig
