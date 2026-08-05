# 📂 Downloads Folder Sorter

A zero-config Python script that automatically sorts your Downloads folder into subfolders named after each file extension (PDF, JPG, EXE, ...) so you never have to clean it manually.

**Difficulty:** Beginner

## ✨ Features

- **One-click sorting**: Moves every file in the Downloads folder into a folder named after its extension
- **Extension groups**: Files without an extension are grouped into an "Others" folder
- **Cross-platform**: Uses pathlib + shutil, so it works on Windows, macOS and Linux
- **Zero dependencies**: Pure Python standard library, nothing to install
- **Safe defaults**: Skips directories, so already-sorted folders are left untouched

## 📋 Requirements

- Python 3.6+
- No third-party packages

## 🚀 Usage

```bash
python downloads_sorter.py
```

The script locates the current user's Downloads folder automatically and moves every loose file into a subfolder named after its extension (uppercase). Run it again any time the folder gets messy.
