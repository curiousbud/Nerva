# ✅ Nerva – Universal Script Repository

<p align="center">
  <img src="assets/## 🚀 Script Management Systemanner.jp### ⚡ Essential Comman## 🤝 Contributing

**Ready to contribute? It's super easy with our Script Manager!**

1. 🍴 **Fork this repo**
2. 📝 **Add your script** in the appropriate language folder  
3. 📖 **Write a README** following our [template guide](scripts/python/script-manager/README.md)
4. 🚀 **Run `python script_manager.py build`** to update everything automatically
5. 📤 **Submit a pull request**

The Script Manager handles all the tedious parts - you just focus on writing awesome code! 🎉
| Command | Purpose | Use Case |
|---------|---------|----------|
| `python script_manager.py build` | **⭐ MAIN COMMAND** - Scan & update everything | After adding/editing any script |
| `python script_manager.py scan` | Scan and save registry only | Check what scripts exist |
| `python script_manager.py add <lang> <name>` | Create new script template | Starting a brand new script |

### 💡 Pro Tips

- 🛠️ **The script manager itself is a featured script!** Check [`scripts/python/script-manager/`](scripts/python/script-manager/) for the **complete beginner-friendly guide**
- 🎯 **Always run `build` after changes** - it's fast and ensures everything stays in sync
- 📚 **Follow the README template** for best results on the website
- 🤝 **No website coding knowledge needed** - just focus on your awesome scripts!    alt="Nerva - Universal Script Repository" 
     />
</p>

<p align="center"><strong>A curated collection of practical scripts across multiple programming languages.</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/Languages-4-blue?style=flat-square" alt="Languages">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License">
  <img src="https://img.shields.io/badge/Contributions-Welcome-orange?style=flat-square" alt="Contributions">
</p>

---

## 🌐 Overview

Nerva is an open-source collection of practical, production-ready scripts for automation, security testing, networking, and more—across multiple programming languages.

## 🤖 Featured: Automated Script Management

**NEW!** Nerva includes a powerful **Script Manager** that makes contributing incredibly easy:

- ✅ **Write your script + README** → **Run one command** → **Appears on website automatically!**
- 🎯 **Zero manual website editing** required
- 🚀 **Beautiful 3D cards** generated automatically
- 📊 **Consistent documentation** across all scripts

**Quick Start for Contributors:**
```bash
# 1. Add your script to appropriate folder
# 2. Write a README.md
# 3. Run this command:
python script_manager.py build
```

➡️ **Full guide**: [scripts/python/script-manager/README.md](scripts/python/script-manager/README.md)

## 📊 Script Collection

| Language    | Script Name                        | Description                                         | Location                                     |
|-------------|------------------------------------|-----------------------------------------------------|----------------------------------------------|
| **Python**  | 🤖 Script Manager                | **Automated script registry and website management** | [scripts/python/script-manager/](scripts/python/script-manager/) |
|             | 🔒 FTP Scanner                    | Anonymous FTP login scanner for security testing    | [scripts/python/ftp-scanner/](scripts/python/ftp-scanner/) |
|             | 🛡️ SHADOW Vulnerability Scanner   | Template-based web vulnerability scanner            | [scripts/python/vulnerability-scanner/](scripts/python/vulnerability-scanner/) |
|             | 🌐 URL Status Checker             | Bulk URL availability checker with reporting        | [scripts/python/url-status-checker/](scripts/python/url-status-checker/) |
|             | 📁 File Organizer                 | Smart file organization by type and date            | [scripts/python/file-organizer/](scripts/python/file-organizer/) |
|             | 🔍 Duplicate Finder               | Find and manage duplicate files efficiently          | [scripts/python/duplicate-finder/](scripts/python/duplicate-finder/) |
|             | 📧 Email Automation               | Send automated emails with templates                | [scripts/python/email-automation/](scripts/python/email-automation/) |
|             | 🔐 Password Generator             | Generate secure random passwords                     | [scripts/python/password-generator/](scripts/python/password-generator/) |
|             | 📶 Auto WiFi Check                | Monitor and reconnect WiFi automatically            | [scripts/python/auto-wifi-check/](scripts/python/auto-wifi-check/) |
| **JavaScript** | *(None yet)*                    | *Coming soon. Contributions welcome!*               | [scripts/javascript/](scripts/javascript/)   |
| **Bash**    | *(None yet)*                      | *Coming soon. Contributions welcome!*               | [scripts/bash/](scripts/bash/)               |
| **PowerShell** | *(None yet)*                    | *Coming soon. Contributions welcome!*               | [scripts/powershell/](scripts/powershell/)   |

> Want to add a script in your favorite language? [Open a PR!](https://github.com/curiousbud/Nerva/pulls)

## 📁 Repository Structure

```
Nerva/
├── scripts/
│   ├── python/
│   │   ├── ftp-scanner/
│   │   ├── vulnerability-scanner/
│   │   └── url-status-checker/
│   ├── javascript/
│   ├── bash/
│   └── powershell/
├── assets/
└── README.md
```

## 🧑‍💻 Getting Started

1. **🚀 Want to contribute?** Use our [Script Manager](scripts/python/script-manager/) - just write your script + README and run one command!
2. **🔍 Want to use scripts?** Browse to any language directory and follow the README instructions.
3. **📚 Need help?** Check language-specific README files in each directory for best practices.

## � Script Management System

**🎯 For Contributors: The Easiest Way to Share Your Scripts**

Our automated script management system eliminates all the tedious work of adding scripts to the repository! Just write your script and README, run one command, and watch it appear on the website with beautiful 3D cards. 

### ⚡ Super Simple Workflow

1. **📝 Create your script** in the appropriate language folder:
   ```bash
   scripts/python/your-script-name/
   ├── your_script.py
   ├── README.md
   └── requirements.txt (if needed)
   ```

2. **📖 Write a descriptive README** (see our [complete template guide](scripts/python/script-manager/README.md))

3. **🚀 Run the magic command**:
   ```bash
   python script_manager.py build
   ```

**🎉 That's it!** Your script appears on the website with:
- Beautiful 3D animated cards
- Automatic categorization  
- Consistent formatting
- Searchable content

### 🔧 What the Script Manager Does Automatically

- 📂 **Scans** all script directories intelligently
- 🏷️ **Extracts** metadata from your README files  
- 🌐 **Updates** the website with zero manual intervention
- 📊 **Maintains** perfect consistency across all presentations
- ✅ **Validates** script information and structure
- 🎨 **Generates** beautiful visual cards for the website

### Quick Commands

| Command | Purpose |
|---------|---------|
| `python script_manager.py build` | **Most common** - Scan scripts and update website |
| `python script_manager.py scan` | Scan and save registry only |
| `python script_manager.py add <lang> <name>` | Create new script template |

💡 **Pro Tip**: The script manager tool itself is a featured script! Check out [`scripts/python/script-manager/`](scripts/python/script-manager/) for the complete beginner-friendly guide.

## �🤝 Contributing

- Fork this repo, add your script in the right language folder, and submit a pull request.
- Please include a usage example and a brief README for new scripts.

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

---

<p align="center">
  <em>Browse all scripts and contribute at <a href="https://github.com/curiousbud/Nerva">github.com/curiousbud/Nerva</a></em>
</p>
