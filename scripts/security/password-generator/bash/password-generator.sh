#!/usr/bin/env bash
#
# Password Generator
# Generate strong, random passwords using /dev/urandom.
#
# Usage: password-generator.sh [length] [count]
#   length  Number of characters per password (default: 16)
#   count   Number of passwords to generate      (default: 1)
#
set -euo pipefail

length="${1:-16}"
count="${2:-1}"

if ! [[ "$length" =~ ^[0-9]+$ ]] || (( length < 1 )); then
  echo "Error: length must be a positive integer." >&2
  exit 1
fi
if ! [[ "$count" =~ ^[0-9]+$ ]] || (( count < 1 )); then
  echo "Error: count must be a positive integer." >&2
  exit 1
fi

# Printable characters minus whitespace and shell-awkward quotes.
charset='A-Za-z0-9!@#$%^&*()_=+-'

for (( i = 0; i < count; i++ )); do
  LC_ALL=C tr -dc "$charset" < /dev/urandom | head -c "$length"
  echo
done
