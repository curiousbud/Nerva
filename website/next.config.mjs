/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/Nerva' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/Nerva/' : '',
  // Ensure static files are served correctly on GitHub Pages
  distDir: 'out',
}

export default nextConfig
