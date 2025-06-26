# 🌐 URL Status Checker

A comprehensive Python tool for checking the status of URLs in bulk. Perfect for monitoring website availability, validating link lists, and performing health checks on web services.

## ✨ Features

- **Bulk URL Checking**: Check hundreds of URLs concurrently
- **Smart URL Handling**: Automatically tries HTTP/HTTPS for URLs without schemes
- **Detailed Reporting**: Response times, content types, server information
- **Multiple Output Formats**: Table, summary, JSON, and CSV export
- **Concurrent Processing**: Multi-threaded for fast execution
- **Redirect Handling**: Optional redirect following with count tracking
- **Error Classification**: Detailed error categorization and reporting
- **Progress Tracking**: Real-time progress indication
- **Flexible Input**: Command line URLs or file-based input

## 📋 Requirements

\`\`\`bash
pip install requests
\`\`\`

> **Note**: `requests` is the only external dependency. All other modules are part of Python's standard library.

## 🚀 Usage

### Basic Examples

\`\`\`bash
# Check a single URL
python url-status.py -u https://example.com

# Check multiple URLs
python url-status.py -u example.com google.com github.com

# Check URLs from file
python url-status.py -f urls.txt

# Show detailed information
python url-status.py -u example.com --show-details
\`\`\`

### Advanced Usage

\`\`\`bash
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
\`\`\`

## 📝 Input File Format

Create a text file with one URL per line:

\`\`\`
https://example.com
google.com
https://github.com
# This is a comment and will be ignored
subdomain.example.org
192.168.1.1:8080
\`\`\`

## 📊 Output Formats

### Table Format (Default)
\`\`\`
URL                                                          | Status          | Code  | Time(ms)
---------------------------------------------------------------------------------------------
https://example.com                                          | UP              | 200   | 245.3
https://google.com                                           | UP              | 200   | 156.7
https://nonexistent-site-12345.com                          | CONNECTION_ERROR| N/A   | 5000.0
\`\`\`

### Detailed Table Format
\`\`\`
URL                                          | Status          | Code | Time(ms) | Size      | Type
--------------------------------------------------------------------------------------------------------
https://example.com                          | UP              | 200  | 245.3    | 1256      | text/html
https://api.github.com                       | UP              | 200  | 189.4    | N/A       | application/json
\`\`\`

### Summary Format
\`\`\`
=== SUMMARY ===
Total URLs checked: 100
Average response time: 234.56ms

Status breakdown:
  UP: 85 (85.0%)
  CONNECTION_ERROR: 10 (10.0%)
  TIMEOUT: 3 (3.0%)
  CLIENT_ERROR: 2 (2.0%)
\`\`\`

### JSON Format
\`\`\`json
[
  {
    "original_url": "https://example.com",
    "final_url": "https://example.com/",
    "status": "UP",
    "status_code": 200,
    "response_time": 245.3,
    "content_length": "1256",
    "content_type": "text/html",
    "server": "nginx/1.18.0",
    "redirect_count": 1,
    "error": null,
    "timestamp": "2024-01-15T14:30:22.123456"
  }
]
\`\`\`

## ⚙️ Command Line Options

### Input Options
| Option | Description |
|--------|-------------|
| `-u, --urls` | URLs to check (space-separated) |
| `-f, --file` | File containing URLs (one per line) |

### Request Options
| Option | Description | Default |
|--------|-------------|---------|
| `--timeout` | Request timeout in seconds | 10 |
| `--workers` | Number of concurrent workers | 10 |
| `--user-agent` | Custom User-Agent string | Mozilla/5.0... |
| `--no-redirects` | Don't follow redirects | False |

### Output Options
| Option | Description | Default |
|--------|-------------|---------|
| `--format` | Output format (table/summary/json) | table |
| `--show-details` | Show detailed table information | False |
| `--quiet` | Suppress progress output | False |

### Save Options
| Option | Description | Default |
|--------|-------------|---------|
| `--output` | Save results to file | None |
| `--save-format` | Save format (csv/json) | csv |

## 📈 Status Classifications

| Status | Description |
|--------|-------------|
| `UP` | HTTP status code < 400 |
| `CLIENT_ERROR` | HTTP status code 400-499 |
| `SERVER_ERROR` | HTTP status code 500+ |
| `CONNECTION_ERROR` | Network connection failed |
| `TIMEOUT` | Request timed out |
| `SSL_ERROR` | SSL/TLS certificate error |
| `ERROR` | Other HTTP-related error |
| `UNKNOWN_ERROR` | Unexpected error occurred |

## 🔧 Performance Tuning

### Optimal Settings for Different Scenarios

**Small Lists (< 50 URLs)**
\`\`\`bash
python url-status.py -f urls.txt --workers 5 --timeout 10
\`\`\`

**Medium Lists (50-500 URLs)**
\`\`\`bash
python url-status.py -f urls.txt --workers 10 --timeout 15
\`\`\`

**Large Lists (500+ URLs)**
\`\`\`bash
python url-status.py -f urls.txt --workers 20 --timeout 30
\`\`\`

**Slow Networks**
\`\`\`bash
python url-status.py -f urls.txt --workers 5 --timeout 60
\`\`\`

### Memory Usage
- Approximately 1-2 MB per 1000 URLs
- Results are stored in memory until completion
- For very large lists (10k+ URLs), consider processing in batches

## 🛠 Advanced Features

### Smart URL Normalization
The tool automatically handles URLs without schemes:
- `example.com` → tries `https://example.com` then `http://example.com`
- Preserves existing schemes in URLs

### Redirect Tracking
- Counts number of redirects followed
- Reports final URL after redirects
- Option to disable redirect following

### Error Handling
- Comprehensive error classification
- Detailed error messages in results
- Graceful handling of network issues

## 📋 CSV Export Fields

When saving to CSV, the following fields are included:

| Field | Description |
|-------|-------------|
| `original_url` | URL as provided in input |
| `final_url` | Final URL after redirects |
| `status` | Status classification |
| `status_code` | HTTP status code |
| `response_time` | Response time in milliseconds |
| `content_length` | Content-Length header value |
| `content_type` | Content-Type header value |
| `server` | Server header value |
| `redirect_count` | Number of redirects followed |
| `error` | Error message if applicable |
| `timestamp` | ISO timestamp of check |

## 🐛 Troubleshooting

### Common Issues

**SSL Certificate Errors**
\`\`\`bash
# Some sites have SSL issues - these will be reported as SSL_ERROR
# The tool validates certificates by default for security
\`\`\`

**High Memory Usage**
\`\`\`bash
# For very large URL lists, process in smaller batches
split -l 1000 large_urls.txt batch_
for file in batch_*; do
    python url-status.py -f "$file" --output "results_$file.csv"
done
\`\`\`

**Slow Performance**
\`\`\`bash
# Reduce workers for slow networks
python url-status.py -f urls.txt --workers 5

# Increase timeout for slow sites
python url-status.py -f urls.txt --timeout 60
\`\`\`

**Rate Limiting**
\`\`\`bash
# Some sites may rate limit - reduce concurrent workers
python url-status.py -f urls.txt --workers 3 --timeout 30
\`\`\`

## 💡 Use Cases

- **Website Monitoring**: Check if your websites are accessible
- **Link Validation**: Validate links in documentation or websites
- **API Health Checks**: Monitor API endpoint availability
- **SEO Auditing**: Check for broken links on websites
- **Network Diagnostics**: Test connectivity to multiple services
- **Uptime Monitoring**: Regular health checks of web services

## 🤝 Contributing

Improvements and features welcome! Consider adding:
- Support for custom HTTP headers
- Authentication support (Basic, Bearer tokens)
- Response content validation
- Integration with monitoring systems
- Database storage options

## 📄 License

This script is provided for legitimate website monitoring and testing purposes. Respect robots.txt and terms of service of target websites.
