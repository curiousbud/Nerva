# 🚀 PowerShell GitHub Label Automation

## 📝 Description

A PowerShell script that automatically creates all necessary GitHub labels for the Nerva repository to help organize issues and pull requests efficiently.

## ✨ Features

- 🏷️ Creates 25+ organized labels for different categories
- 🔍 Comprehensive GitHub CLI installation and authentication checks
- 🎨 Uses consistent color scheme following GitHub conventions
- ⚡ Fast batch creation with detailed progress feedback
- 🛡️ Robust error handling and user-friendly messages
- 📊 Success rate reporting

## 📋 Requirements

- GitHub CLI (`gh`) installed and authenticated
- PowerShell 5.1 or PowerShell Core 6+
- Repository access permissions

## 🚀 Usage

### Run the script:
```powershell
.\setup-labels.ps1
```

### Or execute remotely:
```powershell
Invoke-Expression (Invoke-WebRequest -Uri "path/to/setup-labels.ps1").Content
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

## 🔧 Installation Help

If GitHub CLI is not installed, the script will guide you:

```powershell
# Install using winget (recommended)
winget install --id GitHub.cli

# Or using Chocolatey
choco install gh

# Or using Scoop
scoop install gh
```

## 💡 Pro Tips

- Run `gh label list` after execution to verify all labels
- Labels are created with `--force` flag to update existing ones
- Script provides detailed feedback with color-coded messages
- Success rate is reported at the end
- Compatible with both Windows PowerShell and PowerShell Core

## 🤝 Contributing

This script is part of the Nerva automation system. Feel free to suggest improvements or additional label categories!
