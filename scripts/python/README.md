# 🐍 Python Scripts Collection

Welcome to the Python scripts section of ScriptHub! This directory contains various Python tools and utilities for different use cases.

## 📋 Available Scripts

| Script                                        | Category   | Difficulty     | Description                                        |
|----------------------------------------------- |------------|---------------|----------------------------------------------------|
| [🔍 FTP Scanner](ftp-scanner/)                 | Security   | 🟡 Intermediate| Multi-threaded anonymous FTP scanner for security testing |
| [🛡️ SHADOW Scanner](vulnerability-scanner/)   | Security   | 🔴 Advanced    | Template-based web vulnerability scanner with async scanning |
| [🌐 URL Status Checker](url-status-checker/)   | Networking | 🟢 Beginner    | Bulk URL availability checker with detailed reporting |

## 🚀 Quick Start

### Prerequisites

- Python 3.6 or higher
- pip (Python package installer)

### General Usage Pattern

```bash
# Navigate to a script directory
cd script-name/

# Install dependencies
pip install -r requirements.txt

# Run the script
python script-name.py --help
```

## 🔧 General Requirements

Most Python scripts in this collection require:

- Python 3.6 or higher
- pip for package management

## 📦 Common Dependencies

Install common dependencies used across multiple scripts:

```bash
pip install requests pyyaml dnspython aiohttp
```

## 💡 Best Practices

- Use virtual environments to avoid dependency conflicts.
- Check Python version compatibility.
- Review security implications before running security tools.
- Test scripts in safe environments first.

## 🤝 Contributing Python Scripts

- Follow PEP 8 style guidelines.
- Include comprehensive docstrings.
- Add error handling and logging.
- Provide clear usage examples.
- Include requirements.txt if needed.
