/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: true,
  },
  images: {
    formats: ['image/webp'],
    minimumCacheTTL: 31536000,
  },
}

module.exports = nextConfig
