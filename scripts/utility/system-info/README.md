# System Information

Collect and display key details about a machine — OS, CPU, memory and disks — in one quick command. Available in Python (cross-platform) and PowerShell (Windows).

**Difficulty:** Beginner

## ✨ Features

- OS name, version and architecture
- CPU model, cores and logical processors
- Total / free physical memory
- Per-drive disk capacity and free space
- Human-readable table or machine-readable JSON output

## 📋 Requirements

- **Python:** 3.8+ and `psutil` (`pip install -r python/requirements.txt`)
- **PowerShell:** Windows PowerShell 5.1+ or PowerShell 7+ (built-in CIM cmdlets)

## 🚀 Usage

### Python

```bash
pip install -r python/requirements.txt

python python/system_info.py            # formatted table
python python/system_info.py --format json
python python/system_info.py -o info.json
```

### PowerShell

```powershell
./powershell/system-info.ps1            # formatted report
./powershell/system-info.ps1 -Json      # JSON output
```
