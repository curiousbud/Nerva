# Nerva Development Scripts

This folder contains scripts to help you run the Nerva website in both development and production modes.

## Development Mode

To start the development server with the proper environment settings:

### Using Command Prompt
Run `start-dev-server.bat` to start the Next.js development server.

### Using PowerShell
Run `start-dev-server.ps1` to start the Next.js development server.

## Production Build

To build the website for production:

### Using Command Prompt
Run `build-production.bat` to build the website for production.

### Using PowerShell
Run `build-production.ps1` to build the website for production.

## Environment Variables

Next.js requires specific environment variable settings:

- For development: NODE_ENV should be "development" (or unset, Next.js defaults to development)
- For production: NODE_ENV should be "production"

The scripts in this folder handle these environment variables automatically.

## Troubleshooting

If you see a warning about "non-standard NODE_ENV value", it means the NODE_ENV environment variable is set to something unexpected.

To fix this:
1. Use the provided scripts to start the development server or build for production
2. Or manually clear the environment variable:
   - Windows Command Prompt: `set NODE_ENV=`
   - PowerShell: `Remove-Item Env:NODE_ENV -ErrorAction SilentlyContinue`
   - Linux/macOS: `unset NODE_ENV`
