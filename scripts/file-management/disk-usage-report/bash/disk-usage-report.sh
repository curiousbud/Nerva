#!/usr/bin/env bash
#
# Disk Usage Report
# Show the largest directories under a path, sorted by size.
#
# Usage: disk-usage-report.sh [path] [count]
#   path   Directory to analyse (default: current directory)
#   count  Number of entries to show (default: 10)
#
set -euo pipefail

target="${1:-.}"
count="${2:-10}"

if [[ ! -d "$target" ]]; then
  echo "Error: '$target' is not a directory." >&2
  exit 1
fi
if ! [[ "$count" =~ ^[0-9]+$ ]] || (( count < 1 )); then
  echo "Error: count must be a positive integer." >&2
  exit 1
fi

echo "Largest $count directories under: $target"
echo "------------------------------------------------------------"

# -h human readable, one level deep; skip the target itself with tail.
du -h --max-depth=1 "$target" 2>/dev/null \
  | sort -rh \
  | head -n "$((count + 1))"

echo "------------------------------------------------------------"
printf "Total: %s\n" "$(du -sh "$target" 2>/dev/null | cut -f1)"
