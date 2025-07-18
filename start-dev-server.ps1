# Reset NODE_ENV and start development server
Write-Host "Resetting environment for Next.js development..." -ForegroundColor Cyan

# Clear the NODE_ENV environment variable
Remove-Item Env:NODE_ENV -ErrorAction SilentlyContinue

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$websitePath = Join-Path -Path $scriptPath -ChildPath "website"

# Change directory to website folder
Set-Location -Path $websitePath

Write-Host "Starting Next.js development server..." -ForegroundColor Green
npm run dev

Read-Host -Prompt "Press Enter to exit"
