# 🔍 FTP Anonymous Login Scanner

A Python script to check for anonymous FTP access on single or multiple hosts. This tool is useful for security assessments and network reconnaissance.

## ✨ Features

- **Single & Bulk Scanning**: Check one host or scan multiple hosts from a file.
- **Concurrent Scanning**: Multi-threaded scanning for faster results.
- **Detailed Reporting**: Shows successful logins and file counts.
- **Flexible Input**: Accept hostnames, IP addresses, or mixed lists.
- **Export Results**: Save vulnerable hosts to a file.
- **Timeout Control**: Configurable connection timeouts.
- **Verbose Mode**: Optional detailed output for failed attempts.

## 📋 Requirements

```bash
python3 -m pip install --upgrade pip
```

> **Note:** `ftplib` is part of Python's standard library, so no additional installation is typically required.

## 🚀 Usage

### Basic Usage

```bash
# Check a single host
python ftp-scanner.py -t example.com

# Check multiple hosts
python ftp-scanner.py -t host1.com host2.com 192.168.1.1

# Scan from file
python ftp-scanner.py -f hosts.txt
```

### Advanced Options

```bash
# Verbose mode with custom timeout
python ftp-scanner.py -t example.com -v --timeout 5

# Multi-threaded scanning
python ftp-scanner.py -f hosts.txt --threads 20

# Save results to file
python ftp-scanner.py -f hosts.txt -o vulnerable_hosts.txt
```

## 📝 Input File Format

Create a text file with one hostname/IP per line:

```
example.com
192.168.1.1
ftp.example.org
# This is a comment and will be ignored
another-host.com
```

## 📊 Output Example

### Successful Detection

```
[*] Starting scan of 3 hosts with 10 threads...
[*] Timeout: 10 seconds per host
------------------------------------------------------------
[+] ftp.example.com: Anonymous login successful. Files visible: 15
[-] secure.example.com: Permission denied: 530 Login incorrect
[+] old-server.com: Anonymous login successful. Files visible: 3
------------------------------------------------------------
[*] Scan completed in 2.34 seconds
[*] Vulnerable hosts found: 2

[!] Hosts with anonymous FTP access:
    - ftp.example.com
    - old-server.com
```

## ⚙️ Command Line Options

| Option            | Description                               | Default |
|-------------------|-------------------------------------------|---------|
| `-t, --target`    | Target hostname(s) or IP address(es)      | None    |
| `-f, --file`      | File containing hostnames (one per line)  | None    |
| `--timeout`       | Connection timeout in seconds             | 10      |
| `--threads`       | Number of concurrent threads              | 10      |
| `-v, --verbose`   | Show failed connection attempts           | False   |
| `-o, --output`    | Save vulnerable hosts to file             | None    |

## 🔒 Security Considerations

- **Legal Use Only:** Only scan systems you own or have explicit permission to test.
- **Rate Limiting:** Use appropriate thread counts to avoid overwhelming target systems.
- **Network Policies:** Respect network policies and terms of service.
- **Responsible Disclosure:** Report vulnerabilities through proper channels.

## 🛠 Technical Details

(Expand this section with script internals or add references to source code comments if needed.)
