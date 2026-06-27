# UUID Generator

Generate RFC 4122 version-4 UUIDs from the command line with a single zero-dependency Node.js script.

**Difficulty:** Beginner

## ✨ Features

- Cryptographically secure UUIDs via Node's built-in `crypto` module
- Generate one or many UUIDs at once
- Optional uppercase output
- Optional removal of hyphens for compact IDs
- No npm packages required

## 📋 Requirements

- Node.js 14.17+ (uses the built-in `crypto.randomUUID`)

## 🚀 Usage

```bash
# Generate a single UUID
node uuid-generator.js

# Generate 10 UUIDs
node uuid-generator.js --count 10

# Uppercase, no hyphens
node uuid-generator.js --upper --no-hyphens
```
