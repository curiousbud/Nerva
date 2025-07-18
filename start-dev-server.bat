@echo off
echo Resetting environment for Next.js development...

REM Clear the NODE_ENV environment variable
set NODE_ENV=

REM Change directory to website folder
cd %~dp0\website

echo Starting Next.js development server...
call npm run dev

pause
