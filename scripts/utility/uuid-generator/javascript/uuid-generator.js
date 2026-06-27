#!/usr/bin/env node
/*
 * UUID Generator - print one or more RFC 4122 v4 UUIDs.
 *
 * Uses Node's built-in crypto.randomUUID for cryptographically secure values.
 */
'use strict';

const crypto = require('crypto');

function parseArgs(argv) {
  const opts = { count: 1, upper: false, hyphens: true };
  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case '--count':
      case '-c':
        opts.count = Math.max(1, parseInt(argv[++i], 10) || 1);
        break;
      case '--upper':
        opts.upper = true;
        break;
      case '--no-hyphens':
        opts.hyphens = false;
        break;
      default:
        process.stderr.write(`Unknown option: ${argv[i]}\n`);
        process.exit(2);
    }
  }
  return opts;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  for (let i = 0; i < opts.count; i++) {
    let id = crypto.randomUUID();
    if (!opts.hyphens) id = id.replace(/-/g, '');
    if (opts.upper) id = id.toUpperCase();
    process.stdout.write(id + '\n');
  }
}

main();
