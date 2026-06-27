# Disk Usage Report

Quickly find what is eating your disk space. Reports the largest directories under a given path, sorted by size.

**Difficulty:** Beginner

## ✨ Features

- Lists the largest sub-directories under any path
- Configurable number of results
- Human-readable sizes (KB / MB / GB)
- Shows total usage of the target path
- Pure Bash + coreutils — no dependencies

## 📋 Requirements

- A POSIX shell with `du`, `sort` and `head` (standard library only)

## 🚀 Usage

```bash
# Top 10 directories under the current folder
bash disk-usage-report.sh

# Top 20 directories under /var
bash disk-usage-report.sh /var 20
```
