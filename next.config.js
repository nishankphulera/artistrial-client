/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['lucide-react'],
  // Only use 'standalone' output when building for Docker
  // For PM2 deployment, remove this line or set to undefined
  output: process.env.NEXT_STANDALONE === 'true' ? 'standalone' : undefined,
  images: {
    domains: [
      'localhost',
      process.env.NEXT_PUBLIC_S3_BUCKET_DOMAIN,
      process.env.NEXT_PUBLIC_CDN_DOMAIN,
    ].filter(Boolean),
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.s3.*.amazonaws.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001',
  },
};

module.exports = nextConfig;