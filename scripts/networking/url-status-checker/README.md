# 🌐 URL Status Checker

A comprehensive Python tool for checking the status of URLs in bulk. Perfect for monitoring website availability, validating link lists, and performing health checks on web services.

## ✨ Features

- **Bulk URL Checking**: Check hundreds of URLs concurrently.
- **Smart URL Handling**: Automatically tries HTTP/HTTPS for URLs without schemes.
- **Detailed Reporting**: Response times, content types, server information.
- **Multiple Output Formats**: Table, summary, JSON, and CSV export.
- **Concurrent Processing**: Multi-threaded for fast execution.
- **Redirect Handling**: Optional redirect following with count tracking.
- **Error Classification**: Detailed error categorization and reporting.
- **Progress Tracking**: Real-time progress indication.
- **Flexible Input**: Command line URLs or file-based input.

## 📋 Requirements

```bash
pip install requests
```

> **Note:** `requests` is the only external dependency. All other modules are part of Python's standard library.

## 🚀 Usage

### Basic Examples

```bash
# Check a single URL
python url-status.py -u https://example.com

# Check multiple URLs
python url-status.py -u example.com google.com github.com

# Check URLs from file
python url-status.py -f urls.txt

# Show detailed information
python url-status.py -u example.com --show-details
```

### Advanced Usage

```bash
# Custom timeout and workers
python url-status.py -f urls.txt --timeout 30 --workers 20

# Don't follow redirects
python url-status.py -u example.com --no-redirects

# Custom User-Agent
python url-status.py -u example.com --user-agent "MyBot/1.0"

# Save results to CSV
python url-status.py -f urls.txt --output results.csv

# JSON output format
python url-status.py -u example.com --format json

# Summary statistics only
python url-status.py -f urls.txt --format summary
```

## 📝 Input File Format

Create a text file with one URL per line:

```
https://example.com
google.com
https://github.com
# This is a comment and will be ignored
subdomain.example.org
192.168.1.1:8080
```

## 📊 Output Formats

### Table Format (Default)

```
URL                                                 | Status          | Code  | Time(ms)
-----------------------------------------------------------------------------------------
https://example.com                                 | UP              | 200   | 245.3
https://google.com                                  | UP              | 200   | 156.7
https://nonexistent-site-12345.com                  | CONNECTION_ERROR| N/A   | 5000.0
```

### Detailed Table Format

```
URL                                   | Status          | Code | Time(ms) | Size   | Type
------------------------------------------------------------------------------------------
https://example.com                   | UP              | 200  | 245.3    | 1256   | text/html
https://api.github.com                | UP              | 200  | 189.4    | N/A    | application/json
```

### Summary Format

```
=== SUMMARY ===
Total URLs checked: 100
Average response time: 234.56ms

Status breakdown:
  UP: 85 (85.0%)
  CONNECTION_ERROR: 10 (10.0%)
  TIMEOUT: 3 (3.0%)
```
