# 🐍 Python Scripts

This directory contains Python scripts for various automation and security tasks.

## 📋 Available Scripts

| Script | Category | Description |
|--------|----------|-------------|
| [FTP Scanner](./ftp-scanner/) | Security | Anonymous FTP login scanner |
| [Vulnerability Scanner](./vulnerability-scanner/) | Security | Advanced vulnerability scanner with YAML templates |
| [URL Status Checker](./url-status-checker/) | Networking | Bulk URL status checker |

## 🔧 General Requirements

Most Python scripts in this collection require:
- Python 3.6 or higher
- pip for package management

## 📦 Common Dependencies

Install common dependencies used across multiple scripts:

\`\`\`bash
pip install requests pyyaml dnspython aiohttp
\`\`\`

## 🚀 Quick Start

1. Navigate to the specific script folder
2. Read the individual README.md
3. Install script-specific requirements
4. Follow the usage examples

## 💡 Best Practices

When using these Python scripts:
- Use virtual environments to avoid dependency conflicts
- Check Python version compatibility
- Review security implications before running security tools
- Test scripts in safe environments first

## 🤝 Contributing Python Scripts

When adding new Python scripts:
- Follow PEP 8 style guidelines
- Include comprehensive docstrings
- Add error handling and logging
- Provide clear usage examples
- Include requirements.txt if needed
\`\`\`

```python file="scripts/python/ftp-scanner/ftp_scanner.py"
import ftplib
import argparse
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

def check_anonymous_ftp(hostname, timeout=10):
    """
    Check if anonymous FTP login is allowed on a given hostname.
    
    Args:
        hostname (str): The hostname or IP address to check
        timeout (int): Connection timeout in seconds
        
    Returns:
        tuple: (hostname, success, error_message)
    """
    try:
        ftp = ftplib.FTP(timeout=timeout)
        ftp.connect(hostname, 21)
        ftp.login('anonymous', 'anonymous@example.com')
        
        # Try to list directory to confirm access
        try:
            files = ftp.nlst()
            file_count = len(files)
        except:
            file_count = "Unknown"
        
        ftp.quit()
        return (hostname, True, f"Anonymous login successful. Files visible: {file_count}")
        
    except ftplib.error_perm as e:
        return (hostname, False, f"Permission denied: {str(e)}")
    except ftplib.error_temp as e:
        return (hostname, False, f"Temporary error: {str(e)}")
    except Exception as e:
        return (hostname, False, f"Connection failed: {str(e)}")

def scan_single_host(hostname, timeout=10, verbose=False):
    """Scan a single host for anonymous FTP access."""
    if verbose:
        print(f"[*] Checking {hostname}...")
    
    hostname, success, message = check_anonymous_ftp(hostname, timeout)
    
    if success:
        print(f"[+] {hostname}: {message}")
        return True
    else:
        if verbose:
            print(f"[-] {hostname}: {message}")
        return False

def scan_multiple_hosts(hostnames, timeout=10, threads=10, verbose=False):
    """Scan multiple hosts concurrently."""
    vulnerable_hosts = []
    
    print(f"[*] Starting scan of {len(hostnames)} hosts with {threads} threads...")
    print(f"[*] Timeout: {timeout} seconds per host")
    print("-" * 60)
    
    start_time = time.time()
    
    with ThreadPoolExecutor(max_workers=threads) as executor:
        # Submit all tasks
        future_to_host = {
            executor.submit(check_anonymous_ftp, hostname, timeout): hostname 
            for hostname in hostnames
        }
        
        # Process completed tasks
        for future in as_completed(future_to_host):
            hostname = future_to_host[future]
            try:
                host, success, message = future.result()
                
                if success:
                    print(f"[+] {host}: {message}")
                    vulnerable_hosts.append(host)
                elif verbose:
                    print(f"[-] {host}: {message}")
                    
            except Exception as e:
                if verbose:
                    print(f"[-] {hostname}: Unexpected error: {str(e)}")
    
    end_time = time.time()
    
    print("-" * 60)
    print(f"[*] Scan completed in {end_time - start_time:.2f} seconds")
    print(f"[*] Vulnerable hosts found: {len(vulnerable_hosts)}")
    
    if vulnerable_hosts:
        print("\n[!] Hosts with anonymous FTP access:")
        for host in vulnerable_hosts:
            print(f"    - {host}")
    
    return vulnerable_hosts

def load_hosts_from_file(filename):
    """Load hostnames from a text file (one per line)."""
    try:
        with open(filename, 'r') as f:
            hosts = [line.strip() for line in f if line.strip() and not line.startswith('#')]
        return hosts
    except FileNotFoundError:
        print(f"[-] Error: File '{filename}' not found")
        sys.exit(1)
    except Exception as e:
        print(f"[-] Error reading file '{filename}': {str(e)}")
        sys.exit(1)

def main():
    parser = argparse.ArgumentParser(
        description='FTP Anonymous Login Scanner',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s -t example.com
  %(prog)s -t example.com -v --timeout 5
  %(prog)s -f hosts.txt --threads 20
  %(prog)s -t 192.168.1.1 192.168.1.2 192.168.1.3
        """
    )
    
    parser.add_argument(
        '-t', '--target',
        nargs='+',
        help='Target hostname(s) or IP address(es)'
    )
    
    parser.add_argument(
        '-f', '--file',
        help='File containing hostnames (one per line)'
    )
    
    parser.add_argument(
        '--timeout',
        type=int,
        default=10,
        help='Connection timeout in seconds (default: 10)'
    )
    
    parser.add_argument(
        '--threads',
        type=int,
        default=10,
        help='Number of concurrent threads (default: 10)'
    )
    
    parser.add_argument(
        '-v', '--verbose',
        action='store_true',
        help='Show failed connection attempts'
    )
    
    parser.add_argument(
        '-o', '--output',
        help='Save vulnerable hosts to file'
    )
    
    args = parser.parse_args()
    
    # Collect hostnames
    hostnames = []
    
    if args.file:
        hostnames.extend(load_hosts_from_file(args.file))
    
    if args.target:
        hostnames.extend(args.target)
    
    if not hostnames:
        print("[-] Error: No targets specified. Use -t or -f option.")
        parser.print_help()
        sys.exit(1)
    
    # Remove duplicates while preserving order
    hostnames = list(dict.fromkeys(hostnames))
    
    # Scan hosts
    if len(hostnames) == 1:
        vulnerable = scan_single_host(hostnames[0], args.timeout, args.verbose)
        vulnerable_hosts = [hostnames[0]] if vulnerable else []
    else:
        vulnerable_hosts = scan_multiple_hosts(
            hostnames, 
            args.timeout, 
            args.threads, 
            args.verbose
        )
    
    # Save results if requested
    if args.output and vulnerable_hosts:
        try:
            with open(args.output, 'w') as f:
                for host in vulnerable_hosts:
                    f.write(f"{host}\n")
            print(f"[*] Vulnerable hosts saved to '{args.output}'")
        except Exception as e:
            print(f"[-] Error saving to file: {str(e)}")

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n[!] Scan interrupted by user")
        sys.exit(1)
