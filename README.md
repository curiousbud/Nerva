# ✅ ScriptHub – Universal Script Repository

<p align="center">
  <img src="assets/banner.jpeg" 
       alt="ScriptHub - Universal Script Repository" 
       width="800">
</p>

<p align="center">
  <strong>A curated collection of practical scripts across multiple programming languages</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Languages-4-blue?style=flat-square" alt="Languages">
  <img src="https://img.shields.io/badge/Scripts-3-green?style=flat-square" alt="Scripts">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License">
  <img src="https://img.shields.io/badge/Contributions-Welcome-orange?style=flat-square" alt="Contributions">
</p>

## 🌐 Overview

ScriptHub is an open-source initiative aimed at collecting and sharing practical scripts in multiple programming languages. Whether you're automating workflows, solving common problems, or contributing learning resources, ScriptHub is your collaborative scripting toolbox.

From security testing tools to network utilities, each script is professionally crafted with comprehensive documentation, error handling, and real-world applicability.

## 🚀 Features

- 🌍 **Multi-language support**: Python, JavaScript, Bash, PowerShell, and more
- 📂 **Organized structure**: Scripts categorized by language and use-case
- 🛡️ **Production-ready**: Professional scripts with error handling and logging
- 📖 **Comprehensive docs**: Detailed README files for each script
- 💡 **Learning-friendly**: Great for education, prototyping, and automation
- 🤝 **Community-driven**: Contributions welcome from developers of all levels
- ⚡ **Performance-focused**: Multi-threaded and async implementations where applicable

## 📊 Current Collection

### 🐍 Python Scripts (3)
- **[FTP Scanner](scripts/python/ftp-scanner/)** - Anonymous FTP login scanner for security testing
- **[SHADOW Vulnerability Scanner](scripts/python/vulnerability-scanner/)** - Template-based web vulnerability scanner
- **[URL Status Checker](scripts/python/url-status-checker/)** - Bulk URL availability checker with detailed reporting

### 🟨 JavaScript Scripts (0)
- *Coming soon - contributions welcome!*

### 🐚 Bash Scripts (0)
- *Coming soon - contributions welcome!*

### 💙 PowerShell Scripts (0)
- *Coming soon - contributions welcome!*

## 📁 Project Structure

\`\`\`
ScriptHub/
│
├── scripts/                    # Main scripts directory
│   ├── python/                # Python scripts
│   │   ├── ftp-scanner/       # FTP security scanner
│   │   ├── vulnerability-scanner/  # Web vulnerability scanner
│   │   └── url-status-checker/     # URL availability checker
│   ├── javascript/            # JavaScript/Node.js scripts
│   ├── bash/                  # Bash shell scripts
│   └── powershell/            # PowerShell scripts
│
├── assets/                    # Project assets (images, etc.)
├── docs/                      # Documentation (if needed)
├── app/                       # Web interface for the repository
├── components/                # UI components
├── LICENSE                    # MIT License
├── README.md                  # This file
├── CONTRIBUTING.md            # Contribution guidelines
└── CODE_OF_CONDUCT.md         # Community guidelines
\`\`\`

## 🧑‍💻 Getting Started

### Quick Start

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/ScriptHub.git
   cd ScriptHub
   \`\`\`

2. **Browse available scripts**
   \`\`\`bash
   # View all Python scripts
   ls scripts/python/
   
   # Check out a specific script
   cd scripts/python/ftp-scanner/
   cat README.md
   \`\`\`

3. **Run a script**
   \`\`\`bash
   # Example: Run the FTP scanner
   cd scripts/python/ftp-scanner/
   python ftp-scanner.py -t example.com -v
   
   # Example: Check URL status
   cd scripts/python/url-status-checker/
   python url-status.py -u https://example.com --show-details
   \`\`\`

### Prerequisites

Different scripts may have different requirements:

- **Python scripts**: Python 3.6+ and specific packages (see individual README files)
- **JavaScript scripts**: Node.js 14+ and npm packages
- **Bash scripts**: Bash 4.0+ and standard Unix utilities
- **PowerShell scripts**: PowerShell 5.1+ or PowerShell Core 7+

## 🎯 Use Cases

- **🔒 Security Testing**: Vulnerability scanners, network reconnaissance tools
- **🌐 Network Utilities**: URL checkers, connectivity tests, DNS tools
- **🛠 System Administration**: Server management, monitoring, automation
- **📊 Data Processing**: File manipulation, format conversion, analysis
- **⚡ Task Automation**: Workflow automation, batch processing, scheduling

## 🤝 Contributing

We welcome contributions from developers of all skill levels! Here's how you can help:

### Adding a New Script

1. **Fork the repository**
2. **Create your script folder**
   \`\`\`bash
   mkdir scripts/[language]/[script-name]/
   cd scripts/[language]/[script-name]/
   \`\`\`

3. **Add your script and documentation**
   - Main script file (e.g., `script-name.py`)
   - Comprehensive `README.md` with usage examples
   - Any additional files (requirements.txt, config files, etc.)

4. **Follow our guidelines**
   - Use clear, descriptive naming (kebab-case for folders)
   - Include comprehensive error handling
   - Add detailed documentation and examples
   - Follow language-specific best practices (PEP 8 for Python, etc.)

5. **Submit a pull request**

### What We're Looking For

- **Utility scripts** that solve real-world problems
- **Well-documented code** with clear usage examples
- **Error handling** and input validation
- **Cross-platform compatibility** where possible
- **Performance optimizations** for resource-intensive tasks

For detailed guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md).

## 📋 Script Categories

- **🔒 Security**: Penetration testing, vulnerability scanning, security audits
- **🌐 Networking**: URL validation, port scanning, network diagnostics
- **🛠 System Admin**: Server monitoring, log analysis, system maintenance
- **📊 Data Processing**: File conversion, data analysis, report generation
- **⚡ Automation**: Task scheduling, workflow automation, batch operations
- **🧪 Development**: Code analysis, build automation, testing utilities

## 🏆 Quality Standards

All scripts in ScriptHub maintain high quality standards:

- ✅ **Comprehensive error handling**
- ✅ **Command-line argument parsing**
- ✅ **Detailed logging and output**
- ✅ **Performance optimization**
- ✅ **Cross-platform compatibility**
- ✅ **Security best practices**
- ✅ **Extensive documentation**

## 🌟 Featured Scripts

### 🛡️ SHADOW Vulnerability Scanner
Advanced template-based vulnerability scanner with async scanning, DNS enumeration, and multiple output formats.

### 🔍 FTP Anonymous Scanner
Multi-threaded FTP scanner for detecting anonymous login vulnerabilities with detailed reporting.

### 🌐 URL Status Checker
High-performance URL availability checker with smart fallback, redirect tracking, and comprehensive reporting.

## 📈 Statistics

- **Total Scripts**: 3
- **Languages Supported**: 4
- **Contributors**: 1 (growing!)
- **Lines of Code**: 1000+
- **Documentation Pages**: 10+

## 🔗 Related Projects

- [Awesome Scripts](https://github.com/topics/awesome-scripts) - Curated list of useful scripts
- [DevOps Scripts](https://github.com/topics/devops-scripts) - Infrastructure automation scripts
- [Security Tools](https://github.com/topics/security-tools) - Cybersecurity utilities

## 📞 Support

- 📖 **Documentation**: Check individual script README files
- 🐛 **Issues**: Report bugs or request features via GitHub Issues
- 💬 **Discussions**: Join our GitHub Discussions for questions and ideas
- 📧 **Contact**: Reach out to maintainers for collaboration

## 📜 License

This project is licensed under the [MIT License](./LICENSE) — see the LICENSE file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who make ScriptHub possible
- Inspired by the open-source community's collaborative spirit
- Built with modern development practices and tools

---

<p align="center">
  <strong>Made with ❤️ by the ScriptHub community</strong>
</p>

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-contributing">Contributing</a> •
  <a href="#-license">License</a>
</p>
