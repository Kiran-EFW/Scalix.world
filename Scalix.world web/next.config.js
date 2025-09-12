/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['scalix.world', 'github.com', 'avatars.githubusercontent.com'],
    unoptimized: true, // For development
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'}/api/:path*`,
      },
    ]
  },
  // Enable source maps for better debugging
  productionBrowserSourceMaps: true,
  // Enable experimental features for better DX
  swcMinify: true,
}

module.exports = nextConfig
