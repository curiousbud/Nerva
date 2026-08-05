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
  // NOTE: the `eslint.ignoreDuringBuilds` and `eslint` keys were removed in
  // Next.js 16. `next lint` no longer exists; run `tsc --noEmit` (npm run
  // lint) for type checking instead.

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
  
  // NOTE: distDir is intentionally left at the default ('.next'). With
  // `output: 'export'`, `next build` already emits the static site to `out/`,
  // so overriding distDir to 'out' was redundant — and it made the dev server
  // write its build artifacts into a folder it also watches, causing an endless
  // recompile loop. Netlify still publishes `out/`.

  // NOTE: the `webpack` watchOptions block below was removed for Next.js 16,
  // where Turbopack is the default bundler and a `webpack` config without a
  // `turbopack` config is a hard build error. Turbopack ignores generated
  // folders (node_modules, .git, .next, out) by default.
}

export default nextConfig
