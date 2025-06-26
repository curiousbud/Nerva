# GitHub Label Setup Script (JavaScript/Node.js)

## 📝 Description

A Node.js script that automatically creates all necessary GitHub labels for the Nerva repository to help organize issues and pull requests efficiently.

## ✨ Features

- 🏷️ Creates 25+ organized labels for different categories
- 🔍 Comprehensive GitHub CLI installation and authentication checks
- 🎨 Uses consistent color scheme following GitHub conventions
- ⚡ Fast batch creation with colorful progress feedback
- 🛡️ Modern JavaScript with proper error handling
- 📊 Success rate reporting
- 🌈 Beautiful colored console output

## 📋 Requirements

- Node.js 12+ 
- GitHub CLI (`gh`) installed and authenticated
- Repository access permissions

## 🚀 Usage

### Run the script:
```bash
node setup-labels.js
```

### Or using npm (if package.json exists):
```bash
npm run setup-labels
```

## 🏷️ Labels Created

### Script Categories
- `python` - Python scripts and issues
- `javascript` - JavaScript scripts and issues  
- `bash` - Bash scripts and issues
- `powershell` - PowerShell scripts and issues

### Priority Levels
- `priority: high` - High priority issues
- `priority: medium` - Medium priority issues
- `priority: low` - Low priority issues

### Difficulty Levels
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `advanced` - Requires advanced knowledge

### Status Labels
- `in progress` - Currently being worked on
- `needs review` - Ready for review
- `blocked` - Blocked by other issues

### Script Manager & Technical
- `script-manager` - Script Manager related issues
- `website` - Website integration issues
- `automation` - Automation related issues
- `security` - Security related issues
- `performance` - Performance improvements

And many more organized categories!

## 🔧 Code Features

- **Modern JavaScript**: Uses ES6+ features and best practices
- **Colored Output**: Beautiful console output with ANSI colors
- **Error Handling**: Comprehensive try-catch blocks
- **Synchronous Execution**: Uses `execSync` for reliable command execution
- **Cross-platform**: Works on Windows, macOS, and Linux

## 📦 Optional: Package.json Setup

Create a `package.json` for easier execution:

```json
{
  "name": "github-label-setup",
  "version": "1.0.0",
  "description": "GitHub label setup for Nerva repository",
  "main": "setup-labels.js",
  "scripts": {
    "start": "node setup-labels.js",
    "setup-labels": "node setup-labels.js"
  },
  "engines": {
    "node": ">=12.0.0"
  }
}
```

## 💡 Pro Tips

- Run `gh label list` after execution to verify all labels
- Labels are created with `--force` flag to update existing ones
- Script uses colorful output for better user experience
- Success rate is reported at the end
- Can be easily modified to add custom labels

## 🤝 Contributing

This script is part of the Nerva automation system. Feel free to suggest improvements or additional label categories!
