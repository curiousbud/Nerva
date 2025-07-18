# Nerva Production Build Script

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$websitePath = Join-Path -Path $scriptPath -ChildPath "website"

Write-Host "Building Nerva website for production..." -ForegroundColor Green
Write-Host ""

Set-Location -Path $websitePath

Write-Host "Setting NODE_ENV to production..." -ForegroundColor Cyan
$env:NODE_ENV = "production"

Write-Host "Running Next.js build..." -ForegroundColor Cyan
npm run build

Write-Host ""
Write-Host "Build completed! The production files are in the 'website\out' directory." -ForegroundColor Green
Write-Host "To test the production build, run 'npm run serve' from the website directory." -ForegroundColor Yellow
Write-Host ""

Read-Host -Prompt "Press Enter to exit"
