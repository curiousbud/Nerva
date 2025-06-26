# 🖥️ System Information Gatherer

## Description
A comprehensive Python script that collects and displays detailed system information including hardware specifications, operating system details, network configuration, and performance metrics. Perfect for system administrators, developers, and anyone who needs quick access to system diagnostics.

## Features
- **🔧 Hardware Information**: CPU specs, cores, frequencies, and real-time usage
- **💾 Memory Analysis**: RAM and swap memory usage with detailed statistics  
- **💿 Disk Information**: All mounted drives with usage statistics and file systems
- **🌐 Network Details**: Network interfaces, IP addresses, MAC addresses, and traffic stats
- **🎮 GPU Information**: NVIDIA GPU details including memory and temperature (when available)
- **📊 Multiple Output Formats**: Clean table view or structured JSON export
- **💾 File Export**: Save reports as text or JSON files for documentation
- **⚡ Real-time Data**: Live CPU usage and current system metrics
- **🎯 Cross-platform**: Works on Windows, Linux, and macOS

## Requirements
- Python 3.6+
- psutil>=5.8.0

## Usage

```bash
# Display system information in table format
python system_info.py

# Show information in JSON format
python system_info.py --format json

# Save report to file
python system_info.py --output system_report.txt

# Save as JSON file
python system_info.py --format json --output system_info.json

# Quiet mode (no progress messages)
python system_info.py --quiet --output report.txt
```

## Installation

```bash
# Install dependencies
pip install -r requirements.txt

# Or install psutil directly
pip install psutil
```

## Examples

```bash
# Basic system information display
python system_info.py

# Generate JSON report for automation
python system_info.py --format json --output system_data.json

# Quick silent report generation
python system_info.py --quiet --output daily_report.txt

# View GPU information (requires nvidia-smi)
python system_info.py | grep -A 10 "GPU INFORMATION"
```

## Sample Output

```
================================================================================
                          🖥️  SYSTEM INFORMATION REPORT                          
================================================================================

📋 SYSTEM INFORMATION
----------------------------------------
Hostname                 : DESKTOP-ABC123
Platform                 : Windows-10-10.0.19041-SP0
Architecture             : AMD64
Processor                : Intel64 Family 6 Model 142 Stepping 10, GenuineIntel
Python Version           : 3.9.7
Boot Time                : 2023-12-27 08:30:15

🔧 CPU INFORMATION
----------------------------------------
Physical Cores           : 4
Total Cores             : 8
Max Frequency           : 2300.00Mhz
Current Frequency       : 2300.00Mhz
Total Cpu Usage         : 15.2%

💾 MEMORY INFORMATION
----------------------------------------
Total                   : 15.89GB
Available               : 8.12GB
Used                    : 7.77GB
Percentage              : 48.9%

🌐 NETWORK INFORMATION
----------------------------------------
Hostname                : DESKTOP-ABC123
IP Address              : 192.168.1.100
```

## Advanced Features

### GPU Information
The script automatically detects NVIDIA GPUs using `nvidia-smi` and displays:
- GPU model and name
- Total and used memory
- Current temperature
- Multiple GPU support

### Network Analysis
Comprehensive network information including:
- All network interfaces with IP addresses
- MAC addresses for each interface
- Network traffic statistics (bytes sent/received)
- Broadcast and netmask information

### Disk Analysis
Detailed storage information:
- All mounted drives and partitions
- File system types (NTFS, ext4, etc.)
- Total, used, and free space
- Usage percentages

<!-- 
Featured: This script provides essential system diagnostics and monitoring capabilities
-->

## Use Cases

- **System Administration**: Quick system health checks and inventory
- **Troubleshooting**: Gather system specs for support tickets
- **Monitoring**: Regular system status reports and logging
- **Documentation**: Generate system configuration documents
- **Development**: Environment validation and compatibility checking

## License
This script is part of the Nerva project and is licensed under MIT License.
