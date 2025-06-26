# 🔍 Advanced Duplicate File Finder

A powerful Python script that efficiently finds and manages duplicate files using MD5 hashing. Perfect for cleaning up storage, organizing files, and identifying redundant content across your filesystem.

## ✨ Features

- **Fast MD5 Hashing**: Efficiently identifies duplicates using cryptographic hashing
- **Flexible Scanning**: Recursive directory scanning with size and extension filters
- **Multiple Actions**: List, delete, or move duplicate files
- **Smart Preservation**: Keeps original files while removing duplicates
- **Detailed Reporting**: Comprehensive statistics and exportable reports
- **Dry Run Mode**: Preview actions before making changes
- **Progress Tracking**: Real-time scanning progress with file counts
- **Logging Support**: Detailed logs for audit trails and troubleshooting
- **Cross-Platform**: Works on Windows, macOS, and Linux

## 📋 Requirements

```bash
# No external dependencies required - uses Python standard library only!
```

**Built-in modules used:**
- `hashlib` - MD5 hash calculation
- `pathlib` - Modern path handling
- `argparse` - Command-line interface
- `logging` - Comprehensive logging
- `shutil` - File operations

## 🚀 Usage

### Basic Examples

```bash
# Find duplicates in current directory
python duplicate_finder.py .

# Scan specific directory recursively
python duplicate_finder.py /path/to/directory

# Find duplicates with minimum file size (1MB)
python duplicate_finder.py . --min-size 1048576

# Only check specific file types
python duplicate_finder.py . --extensions .jpg .png .gif .mp4
```

### Advanced Operations

```bash
# List duplicates without taking action
python duplicate_finder.py . --action list

# Delete duplicates (keeps first occurrence)
python duplicate_finder.py . --action delete

# Move duplicates to backup folder
python duplicate_finder.py . --action move --destination ./duplicates_backup

# Dry run to preview actions
python duplicate_finder.py . --action delete --dry-run

# Generate detailed report
python duplicate_finder.py . --output duplicate_report.txt
```

### Filter Options

```bash
# Scan only large files (10MB+)
python duplicate_finder.py . --min-size 10485760

# Check only image files
python duplicate_finder.py . --extensions .jpg .jpeg .png .gif .bmp .tiff

# Non-recursive scan (current directory only)
python duplicate_finder.py . --no-recursive

# Keep newest file instead of first found
python duplicate_finder.py . --action delete --keep-newest
```

## 📊 Sample Output

```
================================================================================
DUPLICATE FILES FOUND
================================================================================

Group 1 (3 files):
File size: 2.5 MB
  🔹 /home/user/photos/vacation_2023.jpg
  🔸 /home/user/backup/vacation_2023.jpg
  🔸 /home/user/duplicates/vacation_2023_copy.jpg

Group 2 (2 files):
File size: 856.3 KB
  🔹 /home/user/documents/report.pdf
  🔸 /home/user/downloads/report.pdf

============================================================
DUPLICATE FINDER STATISTICS
============================================================
Files scanned: 1,247
Bytes processed: 3.2 GB
Duplicate groups found: 2
Files deleted: 0
Files moved: 0
Space saved: 0 B
============================================================
```

## 🔧 Command Line Options

| Option | Description |
|--------|-------------|
| `directory` | Directory to scan for duplicates |
| `-s, --min-size` | Minimum file size in bytes |
| `-e, --extensions` | File extensions to check |
| `-r, --recursive` | Scan subdirectories (default) |
| `--no-recursive` | Don't scan subdirectories |
| `-a, --action` | Action: list, delete, or move |
| `-d, --destination` | Destination folder for move action |
| `--dry-run` | Preview actions without changes |
| `-o, --output` | Output file for detailed report |
| `--keep-newest` | Keep newest file instead of first |

## 🛡️ Safety Features

- **Dry Run Mode**: Test operations before execution
- **Smart Preservation**: Always keeps at least one copy
- **Detailed Logging**: All operations logged to `duplicate_finder.log`
- **Error Handling**: Graceful handling of permission errors and corrupted files
- **Confirmation Prompts**: Interactive confirmation for destructive operations

## 📈 Performance Notes

- **Memory Efficient**: Processes files one at a time
- **Fast Hashing**: Optimized chunk-based MD5 calculation
- **Progress Feedback**: Shows progress every 100 files processed
- **Scalable**: Tested with directories containing 100K+ files

## ⚠️ Important Warnings

- **Backup First**: Always backup important data before deletion
- **Test with Dry Run**: Use `--dry-run` to preview operations
- **Check Permissions**: Ensure proper file access permissions
- **MD5 Limitations**: Very rare possibility of hash collisions with different files

## 🔍 How It Works

1. **File Discovery**: Recursively scans directories for files matching criteria
2. **Hash Calculation**: Computes MD5 hash for each file using efficient chunked reading
3. **Duplicate Detection**: Groups files with identical hashes
4. **Action Execution**: Performs requested action (list/delete/move) on duplicates
5. **Reporting**: Generates detailed statistics and optional reports

## 🤝 Contributing

This script is part of the Nerva project. Feel free to submit issues, improvements, and feature requests!

## 📄 License

This script is part of the Nerva project and is licensed under MIT License.
