# Port Scanner

A fast, multi-threaded TCP port scanner for checking which ports are open on a host. Useful for quick network diagnostics and authorized security assessments.

**Difficulty:** Intermediate

## ✨ Features

- Concurrent scanning with a configurable thread pool
- Scan single ports, ranges, or comma-separated lists
- Adjustable connection timeout
- Optional service-name lookup for open ports
- Clean, sorted summary of open ports

## 📋 Requirements

- Python 3.8+ (standard library only — `socket`, `concurrent.futures`, `argparse`)

## 🚀 Usage

```bash
# Scan the common ports 1-1024
python port-scanner.py example.com

# Scan a specific range
python port-scanner.py 192.168.1.1 -p 20-25

# Scan a custom list with more threads and a short timeout
python port-scanner.py example.com -p 22,80,443,8080 --threads 200 --timeout 0.5
```

## 🔒 Security Considerations

Only scan systems you own or have explicit written permission to test.
