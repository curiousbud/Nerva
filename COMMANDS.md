# Nerva Project Commands Reference

This file contains all the useful commands for managing the Nerva project.

## Environment Variable Management

### Check NODE_ENV
```powershell
# Check current NODE_ENV
echo $env:NODE_ENV

# Check NODE_ENV via Node.js
node check-env.js

# Check NODE_ENV via Next.js
node check-next-env.js
```

### Set NODE_ENV
```powershell
# Set to production
$env:NODE_ENV="production"

# Set to development
$env:NODE_ENV="development"

# Set to test
$env:NODE_ENV="test"
```

### Clear NODE_ENV
```powershell
# Remove NODE_ENV variable
Remove-Item Env:NODE_ENV -ErrorAction SilentlyContinue

# Verify it's cleared
echo "NODE_ENV is now: $env:NODE_ENV"
```

## Development Commands

### Start Development Server
```powershell
# Navigate to website directory
cd website

# Clear NODE_ENV and start dev server (Next.js sets it automatically)
Remove-Item Env:NODE_ENV -ErrorAction SilentlyContinue; npm run dev

# Or start with explicit development environment
$env:NODE_ENV="development"; npm run dev
```

### Build Commands
```powershell
# Build for production
cd website
$env:NODE_ENV="production"; npm run build

# Start production server
npm run start

# Build and start production
$env:NODE_ENV="production"; npm run build; npm run start
```

### Package Management
```powershell
# Install dependencies
cd website
npm install

# Install specific package
npm install <package-name>

# Install dev dependency
npm install -D <package-name>

# Update dependencies
npm update

# Check for outdated packages
npm outdated
```

## Git Commands

### Basic Git Operations
```powershell
# Check status
git status

# Add all changes
git add .

# Add specific file
git add <filename>

# Commit changes
git commit -m "your commit message"

# Push to main branch
git push origin main

# Pull latest changes
git pull origin main
```

### Branch Management
```powershell
# Create new branch
git checkout -b <branch-name>

# Switch to branch
git checkout <branch-name>

# List branches
git branch

# Delete branch
git branch -d <branch-name>
```

## Testing Commands

### Run Tests
```powershell
cd website
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Linting and Formatting
```powershell
cd website

# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Run Prettier
npm run format

# Type checking
npm run type-check
```

## Service Worker Management

### Register Service Worker
```javascript
// In browser console
navigator.serviceWorker.register('/sw.js')

// Check if service worker is registered
navigator.serviceWorker.getRegistrations()

// Unregister all service workers
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
    registration.unregister()
  }
})
```

### Clear Service Worker Cache
```javascript
// In browser console
caches.keys().then(function(names) {
  for (let name of names) caches.delete(name);
})
```

## Debugging Commands

### View Logs
```powershell
# View Next.js build logs
cd website
npm run build 2>&1 | Tee-Object -FilePath build.log

# View development server logs
npm run dev 2>&1 | Tee-Object -FilePath dev.log
```

### Performance Testing
```powershell
# Build and analyze bundle
cd website
npm run build
npm run analyze

# Check bundle size
npx bundle-analyzer .next/static/chunks/*.js
```

## File Operations

### Search in Files
```powershell
# Search for text in all files
Select-String -Pattern "search-term" -Recurse

# Search in specific file types
Select-String -Pattern "search-term" -Include "*.tsx","*.ts" -Recurse

# Search and replace
(Get-Content file.txt) -replace 'old-text', 'new-text' | Set-Content file.txt
```

### File Management
```powershell
# Create directory
New-Item -ItemType Directory -Path "new-folder"

# Copy files
Copy-Item -Path "source" -Destination "destination" -Recurse

# Remove files/folders
Remove-Item -Path "file-or-folder" -Recurse -Force
```

## Database/API Commands (if applicable)

### Local API Testing
```powershell
# Test API endpoints
Invoke-RestMethod -Uri "http://localhost:3000/api/scripts" -Method GET

# Test with curl (if available)
curl http://localhost:3000/api/scripts
```

## Environment Files

### Create .env files
```powershell
# Create .env.local for local development
echo "NODE_ENV=development" > .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:3000" >> .env.local

# Create .env.production for production
echo "NODE_ENV=production" > .env.production
echo "NEXT_PUBLIC_API_URL=https://yoursite.com" >> .env.production
```

## Deployment Commands

### Netlify Deployment
```powershell
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy to Netlify
cd website
netlify deploy

# Deploy to production
netlify deploy --prod
```

### Manual Deployment
```powershell
# Build for production
cd website
$env:NODE_ENV="production"; npm run build

# Copy build files to server
# (use your preferred method: scp, rsync, etc.)
```

## Troubleshooting Commands

### Clear Node Modules and Reinstall
```powershell
cd website
Remove-Item -Path "node_modules" -Recurse -Force
Remove-Item -Path "package-lock.json" -Force
npm install
```

### Clear Next.js Cache
```powershell
cd website
Remove-Item -Path ".next" -Recurse -Force
npm run build
```

### Check Ports
```powershell
# Check what's running on port 3000
netstat -ano | findstr :3000

# Kill process on port 3000 (replace PID with actual process ID)
taskkill /PID <PID> /F
```

## Useful Aliases (Add to PowerShell Profile)

Add these to your PowerShell profile (`$PROFILE`):

```powershell
# Navigation aliases
function nerva { cd "C:\Users\Akare\OneDrive\Desktop\Areeb\Open-Source\Nerva" }
function nweb { cd "C:\Users\Akare\OneDrive\Desktop\Areeb\Open-Source\Nerva\website" }

# Development aliases
function ndev { cd "C:\Users\Akare\OneDrive\Desktop\Areeb\Open-Source\Nerva\website"; Remove-Item Env:NODE_ENV -ErrorAction SilentlyContinue; npm run dev }
function nbuild { cd "C:\Users\Akare\OneDrive\Desktop\Areeb\Open-Source\Nerva\website"; $env:NODE_ENV="production"; npm run build }
function nstart { cd "C:\Users\Akare\OneDrive\Desktop\Areeb\Open-Source\Nerva\website"; npm run start }

# Environment aliases
function setprod { $env:NODE_ENV="production"; echo "NODE_ENV set to production" }
function setdev { $env:NODE_ENV="development"; echo "NODE_ENV set to development" }
function clearenv { Remove-Item Env:NODE_ENV -ErrorAction SilentlyContinue; echo "NODE_ENV cleared" }
function checkenv { echo "NODE_ENV: $env:NODE_ENV" }
```

## Quick Setup for New Development Session

```powershell
# 1. Navigate to project
cd "C:\Users\Akare\OneDrive\Desktop\Areeb\Open-Source\Nerva"

# 2. Check git status
git status

# 3. Pull latest changes
git pull origin main

# 4. Navigate to website and install dependencies
cd website
npm install

# 5. Clear environment and start development
Remove-Item Env:NODE_ENV -ErrorAction SilentlyContinue
npm run dev
```

---

*Last updated: July 18, 2025*
*Project: Nerva - Script Collection Website*
