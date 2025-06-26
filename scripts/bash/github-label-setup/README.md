# 🏷️ Bash GitHub Label Automation

## 📝 Description

A Bash script that automatically creates all necessary GitHub labels for the Nerva repository to help organize issues and pull requests efficiently.

## ✨ Features

- 🏷️ Creates 25+ organized labels for different categories
- 🔍 Checks for GitHub CLI installation and authentication
- 🎨 Uses consistent color scheme following GitHub conventions
- ⚡ Fast batch creation with progress feedback
- 🛡️ Safe execution with error handling

## 📋 Requirements

- GitHub CLI (`gh`) installed and authenticated
- Bash shell (Linux/macOS/WSL)
- Repository access permissions

## 🚀 Usage

### Make the script executable:
```bash
chmod +x setup-labels.sh
```

### Run the script:
```bash
./setup-labels.sh
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

## 💡 Pro Tips

- Run `gh label list` after execution to verify all labels
- Labels are created with `--force` flag to update existing ones
- Script includes authentication and installation checks
- Color codes follow GitHub's standard conventions

## 🤝 Contributing

This script is part of the Nerva automation system. Feel free to suggest improvements or additional label categories!
