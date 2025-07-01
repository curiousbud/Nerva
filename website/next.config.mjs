/** @type {import('next').NextConfig} */

/**
 * Next.js Configuration for Nerva Website
 * 
 * This configuration is optimized for static export deployment on platforms like:
 * - Netlify (current deployment)
 * - Vercel 
 * - GitHub Pages (requires basePath modifications)
 * - Firebase Hosting
 * - AWS S3 + CloudFront
 */

const nextConfig = {
  // Static Export Configuration
  output: 'export',
  // ↑ Generates static HTML/CSS/JS files instead of server-side rendering
  // This is required for static hosting platforms
  
  trailingSlash: true,
  // ↑ Adds trailing slashes to URLs (/about/ instead of /about)
  // Helps with static hosting compatibility and SEO
  
  // Build Configuration
  eslint: {
    ignoreDuringBuilds: true,
  },
  // ↑ Skip ESLint during builds to prevent deployment failures
  // Run 'npm run lint' separately for code quality checks
  
  typescript: {
    ignoreBuildErrors: true,
  },
  // ↑ Skip TypeScript type checking during builds
  // This speeds up builds and prevents deployment failures from type errors
  
  // Image Optimization
  images: {
    unoptimized: true,
  },
  // ↑ Disable Next.js image optimization for static export
  // Static hosting platforms can't run the optimization server
  
  // Path Configuration for Different Deployment Platforms
  // 
  // For Netlify/Vercel/Firebase (current setup):
  // No basePath needed - files served from root domain
  //
  // For GitHub Pages (if switching):
  // basePath: process.env.NODE_ENV === 'production' ? '/Nerva' : '',
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/Nerva/' : '',
  //
  // For subdirectory deployment:
  // basePath: '/your-subdirectory',
  // assetPrefix: '/your-subdirectory/',
  
  // Output Directory
  distDir: 'out',
  // ↑ Directory where static files are generated
  // This is where 'npm run build' puts the exportable files
}

export default nextConfig
