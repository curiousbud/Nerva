#!/usr/bin/env python3
"""JSON Formatter - pretty-print, minify and validate JSON.

Reads JSON from a file or stdin and writes the result to stdout (or back to the
file with --in-place). Exits non-zero on invalid JSON so it composes well in
shell pipelines and CI checks.
"""

from __future__ import annotations

import argparse
import json
import sys
from typing import Optional


def parse_args(argv: Optional[list[str]] = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument(
        "file", nargs="?",
        help="JSON file to process (reads from stdin if omitted).",
    )
    parser.add_argument("--minify", action="store_true",
                        help="Output compact single-line JSON.")
    parser.add_argument("--validate", action="store_true",
                        help="Only check validity; print nothing on success.")
    parser.add_argument("--sort-keys", action="store_true",
                        help="Sort object keys alphabetically.")
    parser.add_argument("--indent", type=int, default=2,
                        help="Indent width for pretty output (default: 2).")
    parser.add_argument("--in-place", action="store_true",
                        help="Rewrite the input file with the result.")
    return parser.parse_args(argv)


def main(argv: Optional[list[str]] = None) -> int:
    args = parse_args(argv)

    if args.in_place and not args.file:
        print("Error: --in-place requires a file argument.", file=sys.stderr)
        return 2

    raw = (open(args.file, encoding="utf-8").read() if args.file
           else sys.stdin.read())

    try:
        data = json.loads(raw)
    except json.JSONDecodeError as exc:
        print(f"Invalid JSON: {exc}", file=sys.stderr)
        return 1

    if args.validate:
        print("Valid JSON.", file=sys.stderr)
        return 0

    if args.minify:
        output = json.dumps(data, separators=(",", ":"),
                            sort_keys=args.sort_keys, ensure_ascii=False)
    else:
        output = json.dumps(data, indent=args.indent,
                            sort_keys=args.sort_keys, ensure_ascii=False)

    if args.in_place:
        with open(args.file, "w", encoding="utf-8") as handle:
            handle.write(output + "\n")
        print(f"Formatted {args.file}", file=sys.stderr)
    else:
        print(output)
    return 0


if __name__ == "__main__":
    sys.exit(main())
