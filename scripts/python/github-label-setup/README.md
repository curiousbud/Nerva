# 🐍 Python GitHub Label Automation

## 📝 Description

A Python script that automatically creates all necessary GitHub labels for the Nerva repository to help organize issues and pull requests efficiently.

## ✨ Features

- 🏷️ Creates 25+ organized labels for different categories
- 🔍 Comprehensive GitHub CLI installation and authentication checks
- 🎨 Uses consistent color scheme following GitHub conventions
- ⚡ Fast batch creation with detailed progress feedback
- 🛡️ Type hints and robust error handling
- 📊 Success rate reporting
- 🐍 Cross-platform Python compatibility

## 📋 Requirements

- Python 3.6+
- GitHub CLI (`gh`) installed and authenticated
- Repository access permissions

## 🚀 Usage

### Make the script executable (Unix-like systems):
```bash
chmod +x setup_labels.py
```

### Run the script:
```bash
python setup_labels.py
# or
python3 setup_labels.py
# or (if executable)
./setup_labels.py
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

- **Type Hints**: Full type annotations for better code clarity
- **Error Handling**: Comprehensive exception handling
- **Subprocess Management**: Safe subprocess execution
- **Cross-platform**: Works on Windows, macOS, and Linux
- **Clean Code**: Well-documented and maintainable

## 💡 Pro Tips

- Run `gh label list` after execution to verify all labels
- Labels are created with `--force` flag to update existing ones
- Script includes comprehensive error checking
- Success rate is reported at the end
- Can be easily imported and used in other Python scripts

## 🤝 Contributing

This script is part of the Nerva automation system. Feel free to suggest improvements or additional label categories!
