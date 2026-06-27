#!/usr/bin/env python3
"""Port Scanner - a fast, multi-threaded TCP port scanner.

Scans a host for open TCP ports using non-blocking connect attempts spread
across a thread pool. Intended for diagnostics and authorized security testing
only.
"""

from __future__ import annotations

import argparse
import socket
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Iterable, Optional


def parse_ports(spec: str) -> list[int]:
    """Expand a port spec like ``22,80,8000-8010`` into a sorted list."""
    ports: set[int] = set()
    for part in spec.split(","):
        part = part.strip()
        if not part:
            continue
        if "-" in part:
            start, end = part.split("-", 1)
            ports.update(range(int(start), int(end) + 1))
        else:
            ports.add(int(part))
    invalid = [p for p in ports if not 0 < p < 65536]
    if invalid:
        raise ValueError(f"Port(s) out of range 1-65535: {invalid}")
    return sorted(ports)


def scan_port(host: str, port: int, timeout: float) -> Optional[int]:
    """Return ``port`` if a TCP connection succeeds, else ``None``."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(timeout)
        if sock.connect_ex((host, port)) == 0:
            return port
    return None


def scan(host: str, ports: Iterable[int], threads: int, timeout: float) -> list[int]:
    open_ports: list[int] = []
    with ThreadPoolExecutor(max_workers=threads) as pool:
        futures = {pool.submit(scan_port, host, p, timeout): p for p in ports}
        for future in as_completed(futures):
            result = future.result()
            if result is not None:
                open_ports.append(result)
    return sorted(open_ports)


def service_name(port: int) -> str:
    try:
        return socket.getservbyport(port)
    except OSError:
        return "unknown"


def main(argv: Optional[list[str]] = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("host", help="Hostname or IP address to scan.")
    parser.add_argument("-p", "--ports", default="1-1024",
                        help="Ports to scan, e.g. '22,80,8000-8010' (default: 1-1024).")
    parser.add_argument("--threads", type=int, default=100,
                        help="Number of concurrent workers (default: 100).")
    parser.add_argument("--timeout", type=float, default=1.0,
                        help="Per-port connection timeout in seconds (default: 1.0).")
    args = parser.parse_args(argv)

    try:
        host = socket.gethostbyname(args.host)
    except socket.gaierror:
        print(f"Error: could not resolve host '{args.host}'.", file=sys.stderr)
        return 1

    try:
        ports = parse_ports(args.ports)
    except ValueError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 2

    print(f"Scanning {args.host} ({host}) - {len(ports)} port(s)...")
    open_ports = scan(host, ports, args.threads, args.timeout)

    if not open_ports:
        print("No open ports found.")
        return 0

    print(f"\nOpen ports ({len(open_ports)}):")
    for port in open_ports:
        print(f"  {port:>5}/tcp  {service_name(port)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
