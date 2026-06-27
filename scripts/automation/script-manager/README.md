# Script Registry Management Tool

An automated tool for managing and organizing scripts in the Nerva project. This tool automatically scans your scripts, generates metadata, and updates the website with your contributions.

## What does this tool do?

The Script Registry Management Tool is like a **smart assistant** that:
- 📂 **Scans** all script directories to find your code
- 🏷️ **Reads** your README files to understand what your scripts do
- 📊 **Organizes** everything into a neat registry
- 🌐 **Updates** the website automatically with your new scripts

Think of it as the "glue" that connects your awesome scripts to the Nerva website!

## Features

- **Automated Script Discovery**: Intelligently scans all language directories for scripts
- **README Metadata Extraction**: Parses documentation to extract features, requirements, and usage
- **Website Integration**: Automatically generates website data with beautiful 3D card layouts
- **Registry Management**: Maintains a comprehensive database of all scripts
- **Template Generation**: Creates new script templates with proper structure
- **Zero Manual Work**: No need to manually edit website code or configurations

## Why is this important?

Without this tool, adding new scripts to the website would require:
- ❌ Manually updating website code
- ❌ Remembering to add your script to multiple places
- ❌ Risk of breaking the website
- ❌ Inconsistent script information

**With this tool:**
- ✅ Just write your script and README
- ✅ Run one command
- ✅ Everything updates automatically
- ✅ Consistent, beautiful script cards on the website

## How to use it (Beginner Guide)

### Step 1: Write your script
Create your awesome script in the appropriate language folder:
```
scripts/python/your-script-name/
├── your_script.py
├── README.md
└── requirements.txt (if needed)
```

### Step 2: Write a good README
Your README should include:
```markdown
# Your Script Name

## Description
Brief description of what your script does.

## Features
- Feature 1
- Feature 2
## Requirements

- **Python 3.6+** (no additional packages needed)
- **Windows/Linux/macOS** compatible
- Access to the main Nerva project directory

## Usage

```bash
# Main command - scan scripts and update website
python script_manager.py build

# Scan scripts only (no website update)
python script_manager.py scan

# Create a new script template
python script_manager.py add python my-new-script
```
```

### Step 3: Run the script manager
Open your terminal in the main Nerva folder and run:

```bash
# Scan for new scripts and update everything
python script_manager.py build
```

That's it! Your script will now appear on the website! 🎉

## Available Commands

| Command | What it does | When to use it |
|---------|--------------|----------------|
| `python script_manager.py scan` | Scans all scripts and saves registry | When you want to check what scripts exist |
| `python script_manager.py build` | Scans scripts AND updates website | **Most common** - use this after adding/updating scripts |
| `python script_manager.py add <language> <name>` | Creates a template for a new script | When starting a brand new script |

## Examples

### Adding a new Python script:
```bash
# Create a template (optional)
python script_manager.py add python my-awesome-tool

# After writing your script and README:
python script_manager.py build
```

### Just updating the website:
```bash
# After editing existing READMEs or adding features:
python script_manager.py build
```

## How it works behind the scenes

1. **Scans** `scripts/python/`, `scripts/javascript/`, `scripts/bash/`, `scripts/powershell/`
2. **Reads** each `README.md` file to extract:
   - Script name and description
   - Features list
   - Requirements
   - Usage examples
3. **Creates** `script-registry.json` with all script information
4. **Generates** `website/public/data/scripts.json` for the website to use
5. **Updates** the website automatically with your scripts

## File Structure

```
Nerva/
├── script_manager.py                    # Main tool (also copied here)
├── script-registry.json                 # Generated script database
└── website/
    └── public/
        └── data/
            └── scripts.json             # Website data file
```

## Troubleshooting

**Problem**: Script doesn't appear on website
- ✅ **Solution**: Make sure your script has a `README.md` file
- ✅ **Solution**: Run `python script_manager.py build` again

**Problem**: Script information looks wrong
- ✅ **Solution**: Check your README.md formatting (use the template above)
- ✅ **Solution**: Make sure features are listed with `- ` (dash and space)

**Problem**: Command not found
- ✅ **Solution**: Make sure you're in the main Nerva directory
- ✅ **Solution**: Use `python3` instead of `python` on some systems

## Contributing to this tool

Want to improve the script manager itself? Great! Here's what you can do:
- 🐛 **Fix bugs**: Found something broken? Please report or fix it!
- ✨ **Add features**: Want to extract more information from READMEs?
- 📚 **Improve docs**: Make this README even clearer for beginners

## Technical Details

- **Language**: Python 3.6+
- **Dependencies**: None (uses only built-in libraries)
- **Files it creates**:
  - `script-registry.json` - Complete script database
  - `website/public/data/scripts.json` - Website-ready data
- **Files it reads**: All `README.md` files in script directories

## Fun Facts

- 🚀 This tool can scan hundreds of scripts in seconds
- 🤖 It automatically detects script categories from your README
- 🎨 It powers the beautiful 3D script cards on the website
- 📈 It makes contributing to Nerva super easy for everyone

---

**Made with ❤️ for the Nerva community**

*This tool is part of the Nerva project and helps keep our script collection organized and accessible to everyone!*
