# 🚀 Deploying ScriptHub to GitHub Pages

This guide will help you deploy the ScriptHub web interface to GitHub Pages.

## 📋 Prerequisites

- GitHub repository with the ScriptHub code
- GitHub account with Pages enabled
- Node.js 18+ installed locally (for testing)

## 🔧 Setup Steps

### 1. Repository Configuration

1. **Push your code to GitHub**:
   \`\`\`bash
   git add .
   git commit -m "Add ScriptHub web interface"
   git push origin main
   \`\`\`

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click on **Settings** tab
   - Scroll down to **Pages** section
   - Under **Source**, select **GitHub Actions**

### 2. Automatic Deployment

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that will:

- ✅ Automatically trigger on pushes to `main` branch
- ✅ Install dependencies and build the Next.js app
- ✅ Deploy the static files to GitHub Pages
- ✅ Make your site available at `https://yourusername.github.io/ScriptHub`

### 3. Manual Deployment (Alternative)

If you prefer manual deployment:

1. **Build the project locally**:
   \`\`\`bash
   npm install
   npm run build
   \`\`\`

2. **The build creates static files in the `out/` directory**

3. **Deploy using GitHub Pages settings**:
   - Go to repository Settings > Pages
   - Select "Deploy from a branch"
   - Choose `gh-pages` branch (created by the workflow)

## 🌐 Accessing Your Site

After deployment, your ScriptHub will be available at:
\`\`\`
https://[your-username].github.io/ScriptHub
\`\`\`

## 🔍 Features Available

The deployed site includes:

- **🔍 Script Search**: Search by name, language, category, or tags
- **📊 Statistics**: Live counts of available and in-development scripts
- **📱 Responsive Design**: Works on desktop, tablet, and mobile
- **⚡ Fast Loading**: Optimized static site generation
- **🎨 Modern UI**: Clean, professional interface

## 🛠 Customization

### Updating the Site

1. Make changes to your code
2. Push to the `main` branch
3. GitHub Actions will automatically rebuild and deploy

### Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `public/` directory with your domain
2. Configure DNS settings with your domain provider
3. Update GitHub Pages settings to use your custom domain

### Environment Variables

The site automatically adjusts for production deployment:
- **Base Path**: Configured for GitHub Pages subdirectory
- **Asset Prefix**: Ensures all assets load correctly
- **Image Optimization**: Disabled for static export compatibility

## 🐛 Troubleshooting

### Common Issues

**Build Fails**:
- Check Node.js version (requires 18+)
- Verify all dependencies are installed
- Check for TypeScript errors

**Images Not Loading**:
- Ensure images are in the `public/` directory
- Check image paths are relative to the public directory
- Verify `next.config.mjs` has correct `basePath` settings

**404 Errors**:
- Confirm GitHub Pages is enabled
- Check that the `gh-pages` branch exists
- Verify the deployment workflow completed successfully

### Checking Deployment Status

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. Check the latest workflow run for any errors

## 📈 Performance

The deployed site is optimized for:
- **Fast Loading**: Static generation with Next.js
- **SEO Friendly**: Proper meta tags and structure
- **Mobile Responsive**: Tailwind CSS responsive design
- **Accessibility**: Semantic HTML and ARIA labels

## 🔄 Updates and Maintenance

- **Automatic Updates**: Push to main branch triggers redeployment
- **Manual Trigger**: Re-run the GitHub Action if needed
- **Monitoring**: Check GitHub Actions for deployment status
- **Analytics**: Consider adding Google Analytics for usage tracking

Your ScriptHub is now ready for the world! 🎉
