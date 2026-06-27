#!/usr/bin/env node
/*
 * JSON Formatter - pretty-print, minify and validate JSON.
 *
 * Reads JSON from a file argument or stdin and writes the result to stdout.
 * Exits non-zero on invalid JSON so it composes well in shell pipelines.
 */
'use strict';

const fs = require('fs');

function parseArgs(argv) {
  const opts = { file: null, minify: false, validate: false, sortKeys: false, indent: 2 };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case '--minify': opts.minify = true; break;
      case '--validate': opts.validate = true; break;
      case '--sort-keys': opts.sortKeys = true; break;
      case '--indent': opts.indent = parseInt(argv[++i], 10) || 2; break;
      default:
        if (!arg.startsWith('--')) opts.file = arg;
    }
  }
  return opts;
}

function sortDeep(value) {
  if (Array.isArray(value)) return value.map(sortDeep);
  if (value && typeof value === 'object') {
    return Object.keys(value).sort().reduce((acc, key) => {
      acc[key] = sortDeep(value[key]);
      return acc;
    }, {});
  }
  return value;
}

function readInput(file) {
  if (file) return fs.readFileSync(file, 'utf8');
  return fs.readFileSync(0, 'utf8'); // file descriptor 0 = stdin
}

function main() {
  const opts = parseArgs(process.argv.slice(2));

  let raw;
  try {
    raw = readInput(opts.file);
  } catch (err) {
    process.stderr.write(`Error reading input: ${err.message}\n`);
    process.exit(2);
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    process.stderr.write(`Invalid JSON: ${err.message}\n`);
    process.exit(1);
  }

  if (opts.validate) {
    process.stderr.write('Valid JSON.\n');
    process.exit(0);
  }

  if (opts.sortKeys) data = sortDeep(data);

  const output = opts.minify
    ? JSON.stringify(data)
    : JSON.stringify(data, null, opts.indent);

  process.stdout.write(output + '\n');
}

main();
