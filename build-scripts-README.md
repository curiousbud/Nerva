# Nerva Production Build Scripts

This folder contains scripts to help you build the Nerva website for production with minimal console logs.

## For Windows Users

### Using Command Prompt
Run `build-production.bat` to build the website for production.

### Using PowerShell
Run `build-production.ps1` to build the website for production.

## Manual Build Process

To manually build the website for production:

1. Navigate to the website directory:
   ```
   cd website
   ```

2. Set NODE_ENV to production:
   - Windows Command Prompt: `set NODE_ENV=production`
   - PowerShell: `$env:NODE_ENV = "production"`
   - Linux/macOS: `export NODE_ENV=production`

3. Run the build command:
   ```
   npm run build
   ```

4. To test the production build:
   ```
   npm run serve
   ```

## Differences Between Development and Production

In production mode:
- Console logs are minimized to essential messages
- The service worker only logs critical errors
- API and data fetching logs are not displayed
- Performance is optimized for end-users

## Troubleshooting

If you need to debug the production build:
1. Temporarily modify the logging functions to force logs in production
2. Rebuild with the modified logging
3. Remember to restore the logging functions before deploying
