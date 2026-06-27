# JSON Formatter

Pretty-print, minify and validate JSON from a file or standard input. Available in Python and Node.js — both are zero-dependency.

**Difficulty:** Beginner

## ✨ Features

- Pretty-print JSON with configurable indentation
- Minify JSON to a single compact line
- Validate JSON with a clear error and non-zero exit code
- Optionally sort object keys alphabetically
- Reads from a file argument or piped stdin

## 📋 Requirements

- **Python:** 3.8+ (standard library only)
- **JavaScript:** Node.js 14+ (no npm packages)

## 🚀 Usage

### Python

```bash
python python/json-formatter.py data.json            # pretty-print
python python/json-formatter.py data.json --minify   # compact
python python/json-formatter.py data.json --validate # check only
cat data.json | python python/json-formatter.py      # from stdin
```

### JavaScript

```bash
node javascript/json-formatter.js data.json --sort-keys --indent 4
cat data.json | node javascript/json-formatter.js
```
