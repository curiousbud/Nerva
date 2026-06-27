#!/usr/bin/env python3
"""
Advanced URL Status Checker

A comprehensive tool for checking the status and accessibility of URLs with support for:
- Concurrent URL checking with configurable thread pool
- Multiple output formats (table, summary, JSON)
- Automatic HTTP/HTTPS fallback for URLs without scheme
- Detailed response information including headers and timing
- Export results to CSV or JSON format
- Robust error handling for various network conditions
- Progress tracking for batch operations

Author: Nerva Project
License: MIT
"""

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
    """
    A comprehensive URL status checker with concurrent processing capabilities.
    
    This class provides methods to check the accessibility and status of URLs,
    handle various error conditions, and format results in multiple ways.
    
    Attributes:
        timeout (int): Request timeout in seconds
        max_workers (int): Maximum number of concurrent threads
        user_agent (str): User-Agent string for HTTP requests
        results (list): List of check results
        lock (threading.Lock): Thread lock for result storage
    """
    
    def __init__(self, timeout=10, max_workers=10, user_agent=None):
        """
        Initialize the URL status checker.
        
        Args:
            timeout (int): Request timeout in seconds (default: 10)
            max_workers (int): Maximum concurrent threads (default: 10)
            user_agent (str): Custom User-Agent string (optional)
        """
        self.timeout = timeout
        self.max_workers = max_workers
        self.user_agent = user_agent or 'Mozilla/5.0 (URL Status Checker/1.0)'
        self.results = []
        self.lock = threading.Lock()  # Thread-safe access to results list
        
    def normalize_url(self, url):
        """
        Normalize URL by adding scheme if missing.
        
        Attempts HTTPS first, then HTTP as fallback for scheme-less URLs.
        This ensures maximum compatibility with modern websites.
        
        Args:
            url (str): URL to normalize
            
        Returns:
            list: List of URLs to try (with schemes added if needed)
        """
        if not url.startswith(('http://', 'https://')):
            # Try HTTPS first, then HTTP
            return [f'https://{url}', f'http://{url}']
        return [url]
    
    def check_url(self, url, follow_redirects=True, check_method='HEAD'):
        """
        Check if a URL is accessible and gather detailed response information.
        
        Performs HTTP request to check URL accessibility and extracts detailed
        information about the response including status codes, headers, timing,
        and error conditions. Automatically falls back from HEAD to GET if needed.
        
        Args:
            url (str): URL to check
            follow_redirects (bool): Whether to follow HTTP redirects
            check_method (str): HTTP method to use ('HEAD' or 'GET')
        
        Returns:
            dict: Comprehensive result dictionary containing:
                - original_url: The input URL
                - final_url: Final URL after redirects
                - status: High-level status (UP, DOWN, ERROR, etc.)
                - status_code: HTTP status code
                - response_time: Response time in milliseconds
                - content_length: Content length from headers
                - content_type: MIME type from headers
                - server: Server header value
                - redirect_count: Number of redirects followed
                - error: Error message if request failed
                - timestamp: ISO timestamp of the check
        """
        # Standard browser-like headers to avoid bot detection
        headers = {
            'User-Agent': self.user_agent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
        }
        
        # Initialize result dictionary with default values
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
        
        start_time = time.time()  # Track request timing
        
        try:
            # Validate URL format before making request
            parsed = urlparse(url)
            if not parsed.scheme:
                result['error'] = 'Invalid URL format'
                result['status'] = 'ERROR'
                return result
            
            # Make HTTP request using specified method
            method = check_method.upper()
            if method == 'HEAD':
                # HEAD request - faster but some servers don't support it
                response = requests.head(
                    url,
                    headers=headers,
                    allow_redirects=follow_redirects,
                    timeout=self.timeout,
                    verify=True  # Verify SSL certificates
                )
            else:
                # GET request - more reliable but slower
                response = requests.get(
                    url,
                    headers=headers,
                    allow_redirects=follow_redirects,
                    timeout=self.timeout,
                    verify=True,
                    stream=True  # Don't download full content immediately
                )
                response.close()  # Close connection to free resources
            
            # Calculate response time in milliseconds
            result['response_time'] = round((time.time() - start_time) * 1000, 2)
            
            # If HEAD method returns 405 (Method Not Allowed), retry with GET
            if method == 'HEAD' and response.status_code == 405:
                return self.check_url(url, follow_redirects, 'GET')
            
            # Extract detailed response information from headers
            result['status_code'] = response.status_code
            result['final_url'] = response.url
            result['content_length'] = response.headers.get('Content-Length')
            result['content_type'] = response.headers.get('Content-Type', '').split(';')[0]  # Remove charset info
            result['server'] = response.headers.get('Server')
            
            # Count number of redirects followed
            if hasattr(response, 'history'):
                result['redirect_count'] = len(response.history)
            
            # Categorize status based on HTTP status codes
            if response.status_code < 400:
                result['status'] = 'UP'  # 2xx, 3xx - success/redirect
            elif response.status_code < 500:
                result['status'] = 'CLIENT_ERROR'  # 4xx - client error
            else:
                result['status'] = 'SERVER_ERROR'  # 5xx - server error
                
        # Handle specific exception types with appropriate error messages
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
            result['response_time'] = self.timeout * 1000  # Full timeout duration
            
        except requests.exceptions.RequestException as e:
            result['status'] = 'ERROR'
            result['error'] = str(e)
            result['response_time'] = round((time.time() - start_time) * 1000, 2)
            
        except Exception as e:
            # Catch-all for unexpected errors
            result['status'] = 'UNKNOWN_ERROR'
            result['error'] = str(e)
            result['response_time'] = round((time.time() - start_time) * 1000, 2)
        
        return result
    
    def check_url_with_fallback(self, url):
        """
        Check URL with automatic HTTP/HTTPS fallback.
        
        For URLs without a scheme, this method tries HTTPS first, then HTTP.
        This maximizes compatibility while preferring secure connections.
        
        Args:
            url (str): URL to check (with or without scheme)
            
        Returns:
            dict: Result from the first successful check or last attempt
        """
        urls_to_try = self.normalize_url(url)
        
        for test_url in urls_to_try:
            result = self.check_url(test_url)
            
            # Return immediately if successful or meaningful error (not connection issue)
            if result['status'] in ['UP', 'CLIENT_ERROR', 'SERVER_ERROR']:
                return result
            
            # If this is the last URL to try, return whatever result we got
            if test_url == urls_to_try[-1]:
                return result
        
        return result
    
    def check_urls_batch(self, urls, follow_redirects=True, show_progress=True):
        """
        Check multiple URLs concurrently using thread pool.
        
        Processes URLs in parallel for improved performance while maintaining
        thread-safe result storage and optional progress tracking.
        
        Args:
            urls (list): List of URLs to check
            follow_redirects (bool): Whether to follow HTTP redirects
            show_progress (bool): Whether to display progress information
            
        Returns:
            list: List of result dictionaries for all URLs
        """
        total_urls = len(urls)
        completed = 0
        
        def check_and_store(url):
            """Inner function to check URL and store result thread-safely."""
            nonlocal completed
            result = self.check_url_with_fallback(url)
            
            # Thread-safe result storage and progress tracking
            with self.lock:
                self.results.append(result)
                completed += 1
                
                if show_progress:
                    progress = (completed / total_urls) * 100
                    print(f'\rProgress: {completed}/{total_urls} ({progress:.1f}%)', end='', flush=True)
        
        print(f"Checking {total_urls} URLs with {self.max_workers} workers...")
        
        # Use ThreadPoolExecutor for concurrent processing
        with concurrent.futures.ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            futures = [executor.submit(check_and_store, url) for url in urls]
            concurrent.futures.wait(futures)  # Wait for all tasks to complete
        
        if show_progress:
            print()  # New line after progress display
        
        return self.results
    
    def print_results(self, format_type='table', show_details=False):
        """
        Print results in the specified format.
        
        Args:
            format_type (str): Output format ('table', 'summary', 'json')
            show_details (bool): Whether to show detailed information in table format
        """
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
        """
        Print results in formatted table layout.
        
        Args:
            show_details (bool): Include additional columns like content type and size
        """
        if show_details:
            # Detailed table with extra columns
            print(f"{'URL':<50} | {'Status':<15} | {'Code':<5} | {'Time(ms)':<8} | {'Size':<10} | {'Type':<20}")
            print('-' * 120)
            
            for result in self.results:
                # Truncate long URLs for display
                url = result['original_url'][:47] + '...' if len(result['original_url']) > 50 else result['original_url']
                status = result['status']
                code = str(result['status_code']) if result['status_code'] else 'N/A'
                time_ms = str(result['response_time']) if result['response_time'] else 'N/A'
                size = result['content_length'] or 'N/A'
                # Truncate content type for display
                content_type = (result['content_type'] or 'N/A')[:17] + '...' if result['content_type'] and len(result['content_type']) > 20 else (result['content_type'] or 'N/A')
                
                print(f"{url:<50} | {status:<15} | {code:<5} | {time_ms:<8} | {size:<10} | {content_type:<20}")
        else:
            # Simple table with essential columns
            print(f"{'URL':<60} | {'Status':<15} | {'Code':<5} | {'Time(ms)':<8}")
            print('-' * 95)
            
            for result in self.results:
                # Truncate long URLs for display
                url = result['original_url'][:57] + '...' if len(result['original_url']) > 60 else result['original_url']
                status = result['status']
                code = str(result['status_code']) if result['status_code'] else 'N/A'
                time_ms = str(result['response_time']) if result['response_time'] else 'N/A'
                
                print(f"{url:<60} | {status:<15} | {code:<5} | {time_ms:<8}")
    
    def _print_summary(self):
        """
        Print statistical summary of all URL check results.
        
        Displays total count, average response time, and breakdown by status.
        """
        if not self.results:
            return
        
        # Calculate statistics from results
        status_counts = {}
        total_time = 0
        successful_requests = 0
        
        for result in self.results:
            status = result['status']
            status_counts[status] = status_counts.get(status, 0) + 1
            
            # Only include successful requests in timing calculations
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
        """
        Save results to file in specified format.
        
        Args:
            filename (str): Output file path
            format_type (str): File format ('csv' or 'json')
        """
        if not self.results:
            print("No results to save.")
            return
        
        try:
            if format_type == 'csv':
                # Save as CSV with all available fields
                with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
                    fieldnames = ['original_url', 'final_url', 'status', 'status_code', 'response_time', 
                                'content_length', 'content_type', 'server', 'redirect_count', 'error', 'timestamp']
                    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                    writer.writeheader()
                    writer.writerows(self.results)
                    
            elif format_type == 'json':
                # Save as JSON with full structure
                with open(filename, 'w', encoding='utf-8') as jsonfile:
                    json.dump(self.results, jsonfile, indent=2)
                    
            print(f"Results saved to {filename}")
            
        except Exception as e:
            print(f"Error saving results: {e}")


def load_urls_from_file(filename):
    """
    Load URLs from a text file.
    
    Reads URLs from file, one per line. Ignores empty lines and comments
    (lines starting with #). Useful for batch processing large URL lists.
    
    Args:
        filename (str): Path to file containing URLs
        
    Returns:
        list: List of URLs read from file
        
    Raises:
        SystemExit: If file cannot be read or doesn't exist
    """
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            urls = []
            for line_num, line in enumerate(f, 1):
                line = line.strip()
                # Skip empty lines and comments
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
    """
    Main entry point for the URL Status Checker.
    
    Handles command line argument parsing, URL collection from various sources,
    and orchestrates the checking process with appropriate output formatting.
    """
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
