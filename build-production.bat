@echo off
echo Building Nerva website for production...
echo.

cd %~dp0\website

echo Setting NODE_ENV to production temporarily for this build...
set NODE_ENV=production

echo Running Next.js build...
call npm run build

echo Clearing NODE_ENV to prevent issues with future development sessions...
set NODE_ENV=

echo.
echo Build completed! The production files are in the 'website\out' directory.
echo To test the production build, run 'npm run serve' from the website directory.
echo.

pause
