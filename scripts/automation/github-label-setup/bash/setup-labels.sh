#!/bin/bash

# GitHub Labels Setup Script for Nerva Repository
# This script creates all necessary labels for issue organization

echo "🚀 Setting up GitHub labels for Nerva repository..."

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed. Please install it first."
    echo "Visit: https://cli.github.com/"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Please authenticate with GitHub CLI first:"
    echo "Run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI found and authenticated"
echo "📝 Creating labels..."

# Script Categories
gh label create "python" --color "3776ab" --description "Python scripts and issues" --force
gh label create "javascript" --color "f1e05a" --description "JavaScript scripts and issues" --force
gh label create "bash" --color "89e051" --description "Bash scripts and issues" --force
gh label create "powershell" --color "012456" --description "PowerShell scripts and issues" --force

# Script Manager Specific
gh label create "script-manager" --color "e99695" --description "Script Manager related issues" --force
gh label create "website" --color "1d76db" --description "Website integration issues" --force
gh label create "automation" --color "0052cc" --description "Automation related issues" --force

# Priority Levels
gh label create "priority: high" --color "d73a4a" --description "High priority issues" --force
gh label create "priority: medium" --color "fbca04" --description "Medium priority issues" --force
gh label create "priority: low" --color "0e8a16" --description "Low priority issues" --force

# Difficulty Levels
gh label create "good first issue" --color "7057ff" --description "Good for newcomers" --force
gh label create "help wanted" --color "008672" --description "Extra attention is needed" --force
gh label create "advanced" --color "5319e7" --description "Requires advanced knowledge" --force

# Status Labels
gh label create "in progress" --color "fbca04" --description "Currently being worked on" --force
gh label create "needs review" --color "0e8a16" --description "Ready for review" --force
gh label create "blocked" --color "d93f0b" --description "Blocked by other issues" --force

# Security Related
gh label create "security" --color "d73a4a" --description "Security related issues" --force
gh label create "vulnerability" --color "b60205" --description "Security vulnerability" --force

# Script Types
gh label create "utility" --color "7057ff" --description "Utility scripts" --force
gh label create "networking" --color "0e8a16" --description "Network related scripts" --force
gh label create "file-management" --color "c2e0c6" --description "File management scripts" --force

# Special Events
gh label create "hacktoberfest" --color "ff6b35" --description "Hacktoberfest eligible" --force

# Technical
gh label create "dependencies" --color "0366d6" --description "Dependency related issues" --force
gh label create "performance" --color "c2e0c6" --description "Performance improvements" --force
gh label create "breaking change" --color "b60205" --description "Breaking changes" --force

echo ""
echo "🎉 All labels have been created successfully!"
echo "📊 You can now use these labels to organize issues and PRs in your Nerva repository."
echo ""
echo "💡 Pro tip: Use 'gh label list' to see all your repository labels."
