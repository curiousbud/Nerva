import requests
import argparse
import concurrent.futures
import time
import csv
import json
from urllib.parse import urlparse, urljoin
import sys
from datetime import datetime
import threading

class URLStatusChecker:
    def __init__(self, timeout=10, max_workers=10, user_agent=None):
        self.timeout = timeout
        self.max_workers = max_workers
        self.user_agent = user_agent or 'Mozilla/5.0 (URL Status Checker/1.0)'
        self.results = []
        self.lock = threading.Lock()
        
    def normalize_url(self, url):
        """Normalize URL by adding scheme if missing."""
        if not url.startswith(('http://', 'https://')):
            # Try HTTPS first, then HTTP
            return [f'https://{url}', f'http://{url}']
        return [url]
    
    def check_url(self, url, follow_redirects=True, check_method='HEAD'):
        """
        Check if a URL is accessible.
        
        Args:
            url (str): URL to check
            follow_redirects (bool): Whether to follow redirects
            check_method (str): HTTP method to use ('HEAD' or 'GET')
        
        Returns:
            dict: Result dictionary with status information
        """
        headers = {
            'User-Agent': self.user_agent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
        }
        
        result = {
            'original_url': url,
            'final_url': url,
            'status': 'UNKNOWN',
            'status_code': None,
            'response_time': None,
            'content_length': None,
            'content_type': None,
            'server': None,
            'redirect_count': 0,
            'error': None,
            'timestamp': datetime.now().isoformat()
        }
        
        start_time = time.time()
        
        try:
            # Validate URL format
            parsed = urlparse(url)
            if not parsed.scheme:
                result['error'] = 'Invalid URL format'
                result['status'] = 'ERROR'
                return result
            
            # Make request
            method = check_method.upper()
            if method == 'HEAD':
                response = requests.head(
                    url,
                    headers=headers,
                    allow_redirects=follow_redirects,
                    timeout=self.timeout,
                    verify=True
                )
            else:
                response = requests.get(
                    url,
                    headers=headers,
                    allow_redirects=follow_redirects,
                    timeout=self.timeout,
                    verify=True,
                    stream=True  # Don't download full content
                )
                response.close()  # Close connection immediately
            
            # Calculate response time
            result['response_time'] = round((time.time() - start_time) * 1000, 2)  # ms
            
            # If HEAD method returns 405, try GET
            if method == 'HEAD' and response.status_code == 405:
                return self.check_url(url, follow_redirects, 'GET')
            
            # Extract response information
            result['status_code'] = response.status_code
            result['final_url'] = response.url
            result['content_length'] = response.headers.get('Content-Length')
            result['content_type'] = response.headers.get('Content-Type', '').split(';')[0]
            result['server'] = response.headers.get('Server')
            
            # Count redirects
            if hasattr(response, 'history'):
                result['redirect_count'] = len(response.history)
            
            # Determine status
            if response.status_code < 400:
                result['status'] = 'UP'
            elif response.status_code < 500:
                result['status'] = 'CLIENT_ERROR'
            else:
                result['status'] = 'SERVER_ERROR'
                
        except requests.exceptions.SSLError as e:
            result['status'] = 'SSL_ERROR'
            result['error'] = str(e)
            result['response_time'] = round((time.time() - start_time) * 1000, 2)
            
        except requests.exceptions.ConnectionError as e:
            result['status'] = 'CONNECTION_ERROR'
            result['error'] = str(e)
            result['response_time'] = round((time.time() - start_time) * 1000, 2)
            
        except requests.exceptions.Timeout as e:
            result['status'] = 'TIMEOUT'
            result['error'] = f'Request timed out after {self.timeout}s'
            result['response_time'] = self.timeout * 1000
            
        except requests.exceptions.RequestException as e:
            result['status'] = 'ERROR'
            result['error'] = str(e)
            result['response_time'] = round((time.time() - start_time) * 1000, 2)
            
        except Exception as e:
            result['status'] = 'UNKNOWN_ERROR'
            result['error'] = str(e)
            result['response_time'] = round((time.time() - start_time) * 1000, 2)
        
        return result
    
    def check_url_with_fallback(self, url):
        """Check URL with HTTP/HTTPS fallback."""
        urls_to_try = self.normalize_url(url)
        
        for test_url in urls_to_try:
            result = self.check_url(test_url)
            
            # If successful or it's a client/server error (not connection issue), return result
            if result['status'] in ['UP', 'CLIENT_ERROR', 'SERVER_ERROR']:
                return result
            
            # If it's the last URL and still failed, return the result
            if test_url == urls_to_try[-1]:
                return result
        
        return result
    
    def check_urls_batch(self, urls, follow_redirects=True, show_progress=True):
        """Check multiple URLs concurrently."""
        total_urls = len(urls)
        completed = 0
        
        def check_and_store(url):
            nonlocal completed
            result = self.check_url_with_fallback(url)
            
            with self.lock:
                self.results.append(result)
                completed += 1
                
                if show_progress:
                    progress = (completed / total_urls) * 100
                    print(f'\rProgress: {completed}/{total_urls} ({progress:.1f}%)', end='', flush=True)
        
        print(f"Checking {total_urls} URLs with {self.max_workers} workers...")
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            futures = [executor.submit(check_and_store, url) for url in urls]
            concurrent.futures.wait(futures)
        
        if show_progress:
            print()  # New line after progress
        
        return self.results
    
    def print_results(self, format_type='table', show_details=False):
        """Print results in specified format."""
        if not self.results:
            print("No results to display.")
            return
        
        if format_type == 'table':
            self._print_table(show_details)
        elif format_type == 'summary':
            self._print_summary()
        elif format_type == 'json':
            print(json.dumps(self.results, indent=2))
    
    def _print_table(self, show_details=False):
        """Print results in table format."""
        if show_details:
            print(f"{'URL':<50} | {'Status':<15} | {'Code':<5} | {'Time(ms)':<8} | {'Size':<10} | {'Type':<20}")
            print('-' * 120)
            
            for result in self.results:
                url = result['original_url'][:47] + '...' if len(result['original_url']) > 50 else result['original_url']
                status = result['status']
                code = str(result['status_code']) if result['status_code'] else 'N/A'
                time_ms = str(result['response_time']) if result['response_time'] else 'N/A'
                size = result['content_length'] or 'N/A'
                content_type = (result['content_type'] or 'N/A')[:17] + '...' if result['content_type'] and len(result['content_type']) > 20 else (result['content_type'] or 'N/A')
                
                print(f"{url:<50} | {status:<15} | {code:<5} | {time_ms:<8} | {size:<10} | {content_type:<20}")
        else:
            print(f"{'URL':<60} | {'Status':<15} | {'Code':<5} | {'Time(ms)':<8}")
            print('-' * 95)
            
            for result in self.results:
                url = result['original_url'][:57] + '...' if len(result['original_url']) > 60 else result['original_url']
                status = result['status']
                code = str(result['status_code']) if result['status_code'] else 'N/A'
                time_ms = str(result['response_time']) if result['response_time'] else 'N/A'
                
                print(f"{url:<60} | {status:<15} | {code:<5} | {time_ms:<8}")
    
    def _print_summary(self):
        """Print summary statistics."""
        if not self.results:
            return
        
        status_counts = {}
        total_time = 0
        successful_requests = 0
        
        for result in self.results:
            status = result['status']
            status_counts[status] = status_counts.get(status, 0) + 1
            
            if result['response_time']:
                total_time += result['response_time']
                successful_requests += 1
        
        print("\n=== SUMMARY ===")
        print(f"Total URLs checked: {len(self.results)}")
        print(f"Average response time: {total_time/successful_requests:.2f}ms" if successful_requests > 0 else "Average response time: N/A")
        print("\nStatus breakdown:")
        
        for status, count in sorted(status_counts.items()):
            percentage = (count / len(self.results)) * 100
            print(f"  {status}: {count} ({percentage:.1f}%)")
    
    def save_results(self, filename, format_type='csv'):
        """Save results to file."""
        if not self.results:
            print("No results to save.")
            return
        
        try:
            if format_type == 'csv':
                with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
                    fieldnames = ['original_url', 'final_url', 'status', 'status_code', 'response_time', 
                                'content_length', 'content_type', 'server', 'redirect_count', 'error', 'timestamp']
                    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                    writer.writeheader()
                    writer.writerows(self.results)
                    
            elif format_type == 'json':
                with open(filename, 'w', encoding='utf-8') as jsonfile:
                    json.dump(self.results, jsonfile, indent=2)
                    
            print(f"Results saved to {filename}")
            
        except Exception as e:
            print(f"Error saving results: {e}")

def load_urls_from_file(filename):
    """Load URLs from file (one per line)."""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            urls = []
            for line_num, line in enumerate(f, 1):
                line = line.strip()
                if line and not line.startswith('#'):
                    urls.append(line)
            return urls
    except FileNotFoundError:
        print(f"Error: File '{filename}' not found")
        sys.exit(1)
    except Exception as e:
        print(f"Error reading file '{filename}': {e}")
        sys.exit(1)

def main():
    parser = argparse.ArgumentParser(
        description='Advanced URL Status Checker',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s -u https://example.com
  %(prog)s -u example.com google.com github.com
  %(prog)s -f urls.txt --timeout 30 --workers 20
  %(prog)s -u example.com --output results.csv --format csv
  %(prog)s -f urls.txt --show-details --save-json results.json
        """
    )
    
    # Input options
    parser.add_argument('-u', '--urls', nargs='+', help='URLs to check')
    parser.add_argument('-f', '--file', help='File containing URLs (one per line)')
    
    # Request options
    parser.add_argument('--timeout', type=int, default=10, help='Request timeout in seconds (default: 10)')
    parser.add_argument('--workers', type=int, default=10, help='Number of concurrent workers (default: 10)')
    parser.add_argument('--user-agent', help='Custom User-Agent string')
    parser.add_argument('--no-redirects', action='store_true', help='Don\'t follow redirects')
    
    # Output options
    parser.add_argument('--format', choices=['table', 'summary', 'json'], default='table', help='Output format')
    parser.add_argument('--show-details', action='store_true', help='Show detailed information in table format')
    parser.add_argument('--quiet', action='store_true', help='Suppress progress output')
    
    # Save options
    parser.add_argument('--output', help='Save results to file')
    parser.add_argument('--save-format', choices=['csv', 'json'], default='csv', help='Save format (default: csv)')
    
    args = parser.parse_args()
    
    # Collect URLs
    urls = []
    
    if args.file:
        urls.extend(load_urls_from_file(args.file))
    
    if args.urls:
        urls.extend(args.urls)
    
    if not urls:
        print("Error: No URLs provided. Use -u or -f option.")
        parser.print_help()
        sys.exit(1)
    
    # Remove duplicates while preserving order
    urls = list(dict.fromkeys(urls))
    
    # Initialize checker
    checker = URLStatusChecker(
        timeout=args.timeout,
        max_workers=args.workers,
        user_agent=args.user_agent
    )
    
    # Check URLs
    start_time = time.time()
    checker.check_urls_batch(
        urls, 
        follow_redirects=not args.no_redirects,
        show_progress=not args.quiet
    )
    total_time = time.time() - start_time
    
    # Display results
    if not args.quiet:
        print(f"\nCompleted in {total_time:.2f} seconds")
    
    checker.print_results(args.format, args.show_details)
    
    # Save results if requested
    if args.output:
        checker.save_results(args.output, args.save_format)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nOperation cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}")
        sys.exit(1)
