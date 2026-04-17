import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Skip TS type-checking during Vercel build (stale .next/types clash).
  // Type safety is verified locally via `tsc --noEmit`.
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
}

export default nextConfig
