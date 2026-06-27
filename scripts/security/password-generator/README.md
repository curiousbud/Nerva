# Password Generator

Generate strong, random passwords from the command line. Available in Python, Bash and PowerShell so you can use whichever runtime is already on your machine.

**Difficulty:** Beginner

## ✨ Features

- Cryptographically sourced randomness
- Configurable password length and count
- Mix of upper/lowercase letters, digits and symbols
- Zero third-party dependencies in every language
- Optional clipboard copy (PowerShell)

## 📋 Requirements

- **Python:** 3.8+ (standard library only)
- **Bash:** a POSIX shell with `tr` and `head`
- **PowerShell:** Windows PowerShell 5.1+ or PowerShell 7+

## 🚀 Usage

### Python

```bash
# Interactive — prompts for the desired length
python python/password_generator.py
```

### Bash

```bash
# password-generator.sh [length] [count]
bash bash/password-generator.sh 24 5
```

### PowerShell

```powershell
# Generate 5 passwords and copy the first to the clipboard
./powershell/password-generator.ps1 -Length 20 -Count 5 -Clip
```

## 🔒 Security Notes

Generated passwords are never written to disk. Store them in a reputable password manager.
