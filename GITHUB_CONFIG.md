# GitHub Configuration Setup

This document explains how to manage GitHub usernames and repository links across the entire Nerva website.

## 📋 Overview

All GitHub-related URLs are now centralized in a single configuration file: `website/lib/github-config.ts`

## 🚀 How to Change Your Username

To update the GitHub username used throughout the website:

1. Open `website/lib/github-config.ts`
2. Change the `USERNAME` value in the `GITHUB_CONFIG` object:

```typescript
export const GITHUB_CONFIG = {
  // Main GitHub username/organization
  USERNAME: 'your-new-username', // ← Change this line
  
  // Repository name
  REPO_NAME: 'Nerva',
  
  // Branch name (usually 'main' or 'master')
  BRANCH: 'main',
  
  // ... rest of configuration
};
```

3. Save the file

That's it! All links across the website will automatically update.

## 🔧 What Gets Updated Automatically

When you change the username, these links are automatically updated:

- **Star buttons** - Points to your repository
- **Fork buttons** - Points to your repository's fork URL
- **Script cards** - Links to individual script folders
- **Language cards** - Links to language-specific folders
- **Contributing links** - Links to your CONTRIBUTING.md file
- **All GitHub navigation links**

## 📁 Files That Use This Configuration

- `website/components/ScriptCard.tsx` - Script card star/fork buttons
- `website/app/page.tsx` - Main page GitHub links
- `website/app/scripts/page.tsx` - Scripts page GitHub links

## 🛡️ Safety Features

- **Type-safe**: Uses TypeScript for better error detection
- **Centralized**: One place to change all GitHub links
- **Auto-generated URLs**: Prevents broken links from manual URL construction
- **Fallback support**: Handles both absolute and relative paths

## 🔄 Advanced Configuration

You can also modify other aspects:

```typescript
export const GITHUB_CONFIG = {
  USERNAME: 'your-username',
  REPO_NAME: 'YourRepoName',     // Change repository name
  BRANCH: 'main',                // Change default branch
  // ...
};
```

## 🧪 Testing Your Changes

After changing the configuration:

1. Start the development server: `npm run dev`
2. Open the website in your browser
3. Test the following buttons/links:
   - Star button in header
   - Fork button in header
   - Star/Fork buttons on script cards
   - "View Script" buttons
   - Contributing link

All should now point to your GitHub repository.

## 📝 Notes

- This configuration only affects the website frontend
- You may also need to update any hardcoded URLs in README files
- The configuration uses ES6 getters for dynamic URL generation
- All URLs are generated at runtime for maximum flexibility
