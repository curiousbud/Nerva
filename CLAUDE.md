# CLAUDE.md

Guidance for working in the Nerva repository.

## What Nerva is

Nerva is a curated, open-source collection of practical scripts across multiple
languages (Python, JavaScript, Bash, PowerShell) **plus** a Next.js website that
showcases them. The two halves are connected by a Python CLI that turns each
script's `README.md` into the data the website renders.

```
contributor writes scripts/<category>/<tool>/README.md  (+ <language>/ source)
        │
        ▼
python script_manager.py build   ← the bridge
        │
        ├── script-registry.json                 (canonical registry, committed)
        └── website/public/data/scripts.json      (what the site fetches)
        │
        ▼
website (Next.js) fetches /data/scripts.json and renders one card per tool
```

## How scripts are stored (tool-first)

Scripts are grouped by **category**, then by **tool**, then by **language**.
A tool that exists in several languages is a single folder with one README and
one subfolder per language — no duplication:

```
scripts/
  security/
    password-generator/
      README.md            # one README for the whole tool
      python/   password_generator.py
      bash/     password-generator.sh
      powershell/ password-generator.ps1
    port-scanner/
      README.md
      python/   port-scanner.py
  utility/
    json-formatter/
      README.md
      python/ ...
      javascript/ ...
```

- **Category** is the folder — it is the source of truth, not a README marker.
- Each tool becomes one website card with a **language tray**; "View Script"
  opens the tool folder on GitHub, which shows every language at once.
- Categories are open-ended (add a new folder); the website filters adapt.

## Repository layout

| Path | Purpose |
| ---- | ------- |
| `script_manager.py` | The CLI that scans scripts and generates website data. See `docs/SCRIPT_MANAGER.md`. |
| `scripts/<category>/<tool>/` | One folder per tool: `README.md` (required, drives metadata) + a `<language>/` subfolder per language variant. |
| `script-registry.json` | Generated canonical registry. **Do not edit by hand** — run `build`. |
| `website/` | Next.js 14 (App Router) site. |
| `website/public/data/scripts.json` | Generated data the site fetches at runtime. **Do not edit by hand.** |
| `website/app/` | Pages: `page.tsx` (home), `scripts/page.tsx` (browse all). |
| `website/components/` | React components; `ui/` holds shadcn/Radix primitives. |
| `website/lib/` | `api.ts` (cached fetch), `cache.ts`, `github-config.ts`, `version.ts`. |
| `docs/` | Project docs, including the CLI reference. |
| `COMMANDS.md` | Grab-bag of PowerShell/npm/git commands for the website. |

## Common commands

### Script manager (run from repo root)

```bash
python script_manager.py build                          # regenerate registry + website data
python script_manager.py add my-tool python --category security   # scaffold a new tool
python script_manager.py add my-tool bash               # add a language variant to it
python script_manager.py list                           # summary of indexed tools
python script_manager.py --help                         # full reference
```

### Website (run from `website/`)

```bash
npm install        # install dependencies
npm run dev        # dev server (Next sets NODE_ENV itself — don't force it)
npm run build      # static export to website/out
npm run preview    # build + serve the static export
npm run lint       # ESLint
```

The site is a **static export** (`npm run start` serves `out/` via `npx serve`).
There is no live backend — data comes from the generated `scripts.json`.

## How data flows (important)

1. Each tool's `README.md` drives its metadata. The parser reads the title
   (first `# `), the first paragraph (description), the `## Features` list
   (shown as tags), and the inline `**Difficulty:**` marker. The **category**
   comes from the folder, and **featured** status from `ALWAYS_FEATURED` in
   `script_manager.py`. (Mapping table in `docs/SCRIPT_MANAGER.md`.)
2. `script_manager.py build` writes `script-registry.json` and
   `website/public/data/scripts.json` (a UTC `lastUpdated`, `totalTools` /
   `totalScripts`, per-language counts, per-category counts, a `tools` array —
   each with its language `variants` and tool-folder `path` — and `featured`).
3. `website/lib/api.ts` fetches `/data/scripts.json` with a three-tier cache
   (memory → sessionStorage → network) and the home/scripts pages render it.

**After changing any script or its README, run `build` and commit the
regenerated JSON files alongside your change.**

## Conventions

- **Never hand-edit** `script-registry.json` or `website/public/data/scripts.json`.
- New tools go under `scripts/<category>/<kebab-case-tool>/` with one `README.md`
  and a `<language>/` subfolder per variant. Use `add` to scaffold them.
- The folder is the source of truth for a tool's category; don't put a
  `**Category:**` marker in the README.
- GitHub URLs are centralized in `website/lib/github-config.ts` — change the
  username/repo there, not in individual components.
- The website theme is purple-based and token-driven via CSS variables in
  `website/app/globals.css` (`--primary`, `--accent`, etc.) consumed through
  Tailwind. Prefer theme tokens (`hsl(var(--primary))`) over hard-coded hex.
- Python: standard library preferred; target 3.9+; follow PEP 8.

## Gotchas

- Running on Windows, the CLI reconfigures stdout/stderr to UTF-8 so emoji in
  descriptions don't crash the console.
- The site is statically exported; client components fetch JSON at runtime, so
  there is no server-side data layer to update.
- `package.json` at the repo root is intentionally empty; the real Node project
  lives in `website/`.
