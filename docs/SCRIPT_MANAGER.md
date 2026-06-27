# Nerva Script Manager CLI

`script_manager.py` is the automation tool that keeps the Nerva repository and
its website in sync. Scripts are stored **tool-first**:

```
scripts/<category>/<tool>/README.md          # one README per tool
scripts/<category>/<tool>/<language>/...      # source for each language variant
```

The CLI scans that tree, reads each tool's `README.md`, and generates
`script-registry.json` and `website/public/data/scripts.json`. You never edit
those JSON files by hand — the CLI owns them.

---

## Requirements

- Python 3.9 or newer (standard library only — no `pip install` needed)
- Run from the project root, or pass `--root <path>`

---

## Quick start

```bash
# Scaffold a brand-new tool (creates the category/tool/python folders + README)
python script_manager.py add my-cool-tool python --category automation

# Add another language to that same tool later
python script_manager.py add my-cool-tool bash

# ...edit the README and the source files, then publish to the website:
python script_manager.py build
```

---

## Commands

### `build` — the one you'll use most

Scans every tool, rewrites `script-registry.json`, and regenerates
`website/public/data/scripts.json` (with `lastUpdated`, totals, per-language and
per-category counts, the `tools` array and the `featured` list). Run it after
adding or changing any script.

```bash
python script_manager.py build
```

### `scan` — registry only

Discovers tools and updates `script-registry.json` **without** touching the
website data.

```bash
python script_manager.py scan
```

### `add` — scaffold a tool or a new language variant

```bash
python script_manager.py add <tool> <language> [options]
```

If the tool already exists under some category, the new language variant is
added to it. Otherwise a new tool folder is created under `--category`.

| Argument / option | Description | Default |
| ----------------- | ----------- | ------- |
| `tool` | Tool name (kebab-case recommended; it is slugified) | required |
| `language` | One of `python`, `javascript`, `bash`, `powershell` | required |
| `--category` | Category folder for a **new** tool (ignored if the tool exists) | `utility` |
| `--difficulty` | `Beginner` / `Intermediate` / `Advanced` (written into a new README) | `Intermediate` |
| `--force` | Overwrite existing files | off |

```bash
python script_manager.py add log-rotator bash --category devops --difficulty Beginner
```

### `list` — see what's indexed

Prints tools grouped by category, with their language variants. Featured tools
are marked with `*`.

```bash
python script_manager.py list
```

---

## Global options

| Option | Description |
| ------ | ----------- |
| `--root PATH` | Project root to operate on (default: current directory) |
| `-v, --verbose` | Debug-level logging |
| `-q, --quiet` | Only warnings and errors |
| `-h, --help` | Help for the CLI or any subcommand (`add --help`, etc.) |

The CLI exits `0` on success and `1` on a handled error (bad language, missing
`scripts/` directory, an existing variant without `--force`, …), so it's safe in
CI and pre-commit hooks.

---

## How a tool becomes website data

| Source | Becomes |
| ------ | ------- |
| Folder `scripts/<category>/...` | `category` (the folder is authoritative) |
| First `# Heading` in the README | `title` |
| First paragraph after the title | `description` |
| `## Features` bullet list | `features` (shown as tags) |
| `**Difficulty:** ...` line | `difficulty` |
| Each `<language>/` subfolder with files | a `variant` (`language` + folder `path`) |
| Folder name in `ALWAYS_FEATURED` | `featured` flag |

Each tool is one website card. The card's **language tray** lists every variant;
"View Script" opens the tool folder on GitHub (showing all languages), while a
tray chip opens that specific language's folder.

---

## Typical contributor workflow

1. `python script_manager.py add url-checker python --category networking`
2. Edit `scripts/networking/url-checker/README.md` (title, features, usage…)
3. Write the script in `scripts/networking/url-checker/python/url-checker.py`
4. (optional) Add more languages: `python script_manager.py add url-checker bash`
5. `python script_manager.py build`
6. Commit the tool **and** the regenerated data files, then open a PR.
