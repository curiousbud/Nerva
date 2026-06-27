# GitHub Label Setup

Automatically create a consistent set of 25+ GitHub labels (categories, priorities, difficulty and status) for a repository. Provided in Python, JavaScript, Bash and PowerShell so it runs in any environment.

**Difficulty:** Beginner

## ✨ Features

- Creates 25+ organized labels in one run
- Consistent color scheme following GitHub conventions
- Checks for GitHub CLI installation and authentication
- Batch creation with progress feedback and a success summary
- Identical behaviour across all four language implementations

## 📋 Requirements

- [GitHub CLI](https://cli.github.com/) (`gh`) installed and authenticated (`gh auth login`)
- Push access to the target repository
- The runtime for your chosen implementation (Python 3.6+, Node.js 14+, Bash, or PowerShell 5.1+)

## 🚀 Usage

Run whichever implementation suits your environment — all create the same labels.

```bash
# Python
python python/setup_labels.py

# JavaScript
node javascript/setup-labels.js

# Bash
bash bash/setup-labels.sh

# PowerShell
./powershell/setup-labels.ps1
```

## 🏷️ Labels Created

Includes language tags (`python`, `javascript`, `bash`, `powershell`), priority levels
(`priority: high/medium/low`), difficulty (`good first issue`, `help wanted`, `advanced`)
and status labels (`in progress`, `needs review`, `blocked`).
