/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  trailingSlash: true,
  reactStrictMode: false,
  ignoreBuildErrors: true,
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    return config
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/images/**'
      }
    ]
  }
}

module.exports = nextConfig
