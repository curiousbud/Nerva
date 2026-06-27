#!/usr/bin/env python3
"""
Nerva Script Manager
====================

A command-line tool that manages the Nerva script repository. Scripts are stored
tool-first, grouped by category, with one folder per language variant:

    scripts/<category>/<tool>/README.md          (one README per tool)
    scripts/<category>/<tool>/<language>/...      (the source for each language)

The manager scans that tree, reads each tool's ``README.md`` for its metadata,
and generates:

* ``script-registry.json``               - the canonical, version-controlled registry
* ``website/public/data/scripts.json``   - the data the Next.js site renders

Because tools are stored together, a tool that exists in several languages is a
single entry with multiple "variants" — no duplication.

Run ``python script_manager.py --help`` for the full command reference, or see
``docs/SCRIPT_MANAGER.md``.
"""

from __future__ import annotations

import argparse
import json
import logging
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

# --------------------------------------------------------------------------- #
# Configuration
# --------------------------------------------------------------------------- #

#: Languages Nerva accepts, mapped to the conventions used when scaffolding a
#: new variant (source-file extension + optional dependency manifest).
SUPPORTED_LANGUAGES: dict[str, dict[str, Optional[str]]] = {
    "python":     {"ext": "py",  "deps": "requirements.txt"},
    "javascript": {"ext": "js",  "deps": "package.json"},
    "bash":       {"ext": "sh",  "deps": None},
    "powershell": {"ext": "ps1", "deps": None},
}

#: Order in which language variants are presented (the first is the "primary").
LANGUAGE_PRIORITY = ["python", "javascript", "typescript", "bash", "powershell"]

#: Tools always surfaced on the website home page, by folder name.
ALWAYS_FEATURED = {
    "script-manager",
    "vulnerability-scanner",
    "ftp-scanner",
    "file-organizer",
    "password-generator",
    "json-formatter",
    "github-label-setup",
}

#: Fallback when nothing is explicitly featured.
FALLBACK_FEATURED_COUNT = 6

#: Nicer display names for category folders where title-casing isn't enough.
CATEGORY_DISPLAY_OVERRIDES = {
    "devops": "DevOps",
    "ai-ml": "AI/ML",
}

logger = logging.getLogger("nerva")


def language_rank(language: str) -> int:
    try:
        return LANGUAGE_PRIORITY.index(language.lower())
    except ValueError:
        return len(LANGUAGE_PRIORITY)


def slug_to_title(slug: str) -> str:
    if slug in CATEGORY_DISPLAY_OVERRIDES:
        return CATEGORY_DISPLAY_OVERRIDES[slug]
    return " ".join(word.capitalize() for word in re.split(r"[-_]+", slug) if word)


# --------------------------------------------------------------------------- #
# Registry engine
# --------------------------------------------------------------------------- #

class ScriptRegistry:
    """Discovers tools, extracts metadata and emits the data files."""

    def __init__(self, root_path: Path | str = ".") -> None:
        self.root_path = Path(root_path).resolve()
        self.scripts_path = self.root_path / "scripts"
        self.registry_file = self.root_path / "script-registry.json"
        self.website_data_file = (
            self.root_path / "website" / "public" / "data" / "scripts.json"
        )

    # ------------------------------------------------------------------ #
    # Discovery
    # ------------------------------------------------------------------ #

    def scan_tools(self) -> list[dict[str, Any]]:
        """Walk ``scripts/<category>/<tool>/`` and collect one entry per tool."""
        if not self.scripts_path.is_dir():
            raise FileNotFoundError(
                f"Scripts directory not found: {self.scripts_path}. "
                "Run from the Nerva project root or pass --root."
            )

        tools: list[dict[str, Any]] = []

        for category_dir in sorted(p for p in self.scripts_path.iterdir() if p.is_dir()):
            for tool_dir in sorted(p for p in category_dir.iterdir() if p.is_dir()):
                tool = self._scan_tool(tool_dir, category_dir.name)
                if tool is None:
                    logger.warning(
                        "Skipping %s/%s - no README.md found",
                        category_dir.name, tool_dir.name,
                    )
                    continue
                if not tool["variants"]:
                    logger.warning(
                        "Skipping %s/%s - no language variants found",
                        category_dir.name, tool_dir.name,
                    )
                    continue
                tools.append(tool)
                logger.debug("Indexed %s (%d variant(s))",
                             tool["key"], len(tool["variants"]))

        tools.sort(key=lambda t: (t["category"], t["title"].lower()))
        return tools

    def _scan_tool(self, tool_dir: Path, category_slug: str) -> Optional[dict[str, Any]]:
        readme = tool_dir / "README.md"
        if not readme.exists():
            return None

        meta = {
            "title": "",
            "description": "No description available",
            "features": [],
            "difficulty": "Intermediate",
        }
        try:
            self._parse_readme(readme.read_text(encoding="utf-8"), meta)
        except OSError as exc:
            logger.error("Could not read %s: %s", readme, exc)

        variants = []
        for sub in tool_dir.iterdir():
            if (sub.is_dir()
                    and sub.name in SUPPORTED_LANGUAGES
                    and any(f.is_file() for f in sub.iterdir())):
                variants.append({
                    "language": sub.name,
                    "path": self._rel(sub),
                })
        variants.sort(key=lambda v: language_rank(v["language"]))

        return {
            "key": tool_dir.name,
            "title": meta["title"] or slug_to_title(tool_dir.name),
            "description": meta["description"],
            "category": slug_to_title(category_slug),
            "difficulty": meta["difficulty"],
            "features": meta["features"],
            "featured": tool_dir.name in ALWAYS_FEATURED,
            "path": self._rel(tool_dir),
            "variants": variants,
        }

    @staticmethod
    def _parse_readme(content: str, meta: dict[str, Any]) -> None:
        """Populate ``meta`` in place from raw README ``content``."""
        section: Optional[str] = None

        for line in content.splitlines():
            stripped = line.strip()

            if stripped.startswith("# ") and not meta["title"]:
                meta["title"] = stripped[2:].strip()
                continue

            # Inline difficulty marker like "**Difficulty:** Beginner" (the colon
            # may sit inside or outside the bold, so match on a *-stripped line).
            # Category is intentionally NOT read here — the folder is authoritative.
            plain = stripped.replace("*", "").strip()
            marker = re.match(r"difficulty\s*:\s*(.+)", plain, re.IGNORECASE)
            if marker:
                meta["difficulty"] = marker.group(1).strip()
                continue

            if stripped.startswith("## "):
                title = re.sub(r"[^\w\s]", "", stripped[3:]).strip().lower()
                section = "features" if "feature" in title else None
                continue

            if (
                section is None
                and stripped
                and not stripped.startswith(("#", "```", ">", "!", "|", "*", "-"))
                and meta["description"] == "No description available"
            ):
                meta["description"] = stripped
                continue

            if section == "features" and stripped.startswith(("- ", "* ")):
                feature = re.sub(r"\*\*", "", stripped[2:]).strip()
                # Keep tags short and tidy: drop any "Label: explanation" detail.
                meta["features"].append(feature.split(":", 1)[0].strip())

    # ------------------------------------------------------------------ #
    # Output
    # ------------------------------------------------------------------ #

    def save_registry(self, tools: list[dict[str, Any]]) -> None:
        self._write_json(self.registry_file, {"tools": tools})
        logger.info("Registry saved to %s", self._rel(self.registry_file))

    def generate_website_data(self, tools: list[dict[str, Any]]) -> dict[str, Any]:
        languages = {lang: {"count": 0} for lang in SUPPORTED_LANGUAGES}
        categories: dict[str, int] = {}
        total_variants = 0

        for tool in tools:
            categories[tool["category"]] = categories.get(tool["category"], 0) + 1
            for variant in tool["variants"]:
                total_variants += 1
                languages.setdefault(variant["language"], {"count": 0})
                languages[variant["language"]]["count"] += 1

        featured = [t for t in tools if t["featured"]] or tools[:FALLBACK_FEATURED_COUNT]

        website_data = {
            "lastUpdated": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "totalTools": len(tools),
            "totalScripts": total_variants,
            "languages": languages,
            "categories": categories,
            "tools": tools,
            "featured": featured,
        }

        self.website_data_file.parent.mkdir(parents=True, exist_ok=True)
        self._write_json(self.website_data_file, website_data)

        logger.info("Website data generated at %s", self._rel(self.website_data_file))
        logger.info(
            "Tools: %d | Variants: %d | Featured: %d",
            len(tools), total_variants, len(featured),
        )
        return website_data

    # ------------------------------------------------------------------ #
    # Scaffolding
    # ------------------------------------------------------------------ #

    def add_variant(
        self,
        tool: str,
        language: str,
        category: str = "utility",
        difficulty: str = "Intermediate",
        force: bool = False,
    ) -> Path:
        """Scaffold ``scripts/<category>/<tool>/<language>/`` for a new variant.

        If the tool already exists under some category, the new language variant
        is added to it; otherwise a new tool folder is created under ``category``.
        """
        if language not in SUPPORTED_LANGUAGES:
            raise ValueError(
                f"Unsupported language '{language}'. "
                f"Choose from: {', '.join(SUPPORTED_LANGUAGES)}."
            )

        tool_slug = re.sub(r"[^a-z0-9]+", "-", tool.lower()).strip("-")
        if not tool_slug:
            raise ValueError(f"Invalid tool name: {tool!r}")

        tool_dir = self._find_tool(tool_slug)
        if tool_dir is None:
            category_slug = re.sub(r"[^a-z0-9]+", "-", category.lower()).strip("-") or "utility"
            tool_dir = self.scripts_path / category_slug / tool_slug

        variant_dir = tool_dir / language
        conventions = SUPPORTED_LANGUAGES[language]
        title = slug_to_title(tool_slug)

        source = variant_dir / f"{tool_slug}.{conventions['ext']}"
        if source.exists() and not force:
            raise FileExistsError(
                f"{self._rel(source)} already exists. Use --force to overwrite."
            )
        variant_dir.mkdir(parents=True, exist_ok=True)

        self._write_text(source, self._starter_source(language, title), force)
        if conventions["deps"] == "requirements.txt":
            self._write_text(variant_dir / "requirements.txt",
                             "# Add your Python dependencies here, one per line.\n", force)
        elif conventions["deps"] == "package.json":
            self._write_text(
                variant_dir / "package.json",
                json.dumps({"name": tool_slug, "version": "1.0.0",
                            "main": f"{tool_slug}.js", "dependencies": {}}, indent=2) + "\n",
                force,
            )

        readme = tool_dir / "README.md"
        if not readme.exists():
            self._write_text(readme, self._readme_template(title, difficulty), force)

        logger.info("Variant scaffolded at %s", self._rel(variant_dir))
        return variant_dir

    def _find_tool(self, tool_slug: str) -> Optional[Path]:
        """Return the existing tool folder for ``tool_slug``, if any."""
        if not self.scripts_path.is_dir():
            return None
        for category_dir in self.scripts_path.iterdir():
            candidate = category_dir / tool_slug
            if category_dir.is_dir() and candidate.is_dir():
                return candidate
        return None

    @staticmethod
    def _readme_template(title: str, difficulty: str) -> str:
        return f"""# {title}

One-sentence description of what {title} does and why it is useful.

**Difficulty:** {difficulty}

## ✨ Features

- Describe the first key feature here
- Describe another feature

## 📋 Requirements

- List any dependencies (or note that only the standard library is used)

## 🚀 Usage

```bash
# Show how to run each language variant, e.g.
python python/{title.lower().replace(' ', '-')}.py
```
"""

    @staticmethod
    def _starter_source(language: str, title: str) -> str:
        if language == "python":
            return (
                '#!/usr/bin/env python3\n'
                f'"""{title} - describe what this script does."""\n\n\n'
                'def main() -> None:\n'
                f'    print("Hello from {title}!")\n\n\n'
                'if __name__ == "__main__":\n'
                '    main()\n'
            )
        if language == "javascript":
            return (
                f'// {title} - describe what this script does.\n\n'
                'function main() {\n'
                f'  console.log("Hello from {title}!");\n'
                '}\n\n'
                'main();\n'
            )
        if language == "bash":
            return (
                '#!/usr/bin/env bash\n'
                f'# {title} - describe what this script does.\n'
                'set -euo pipefail\n\n'
                f'echo "Hello from {title}!"\n'
            )
        return (  # powershell
            f'<#\n.SYNOPSIS\n    {title} - describe what this script does.\n#>\n\n'
            f'Write-Host "Hello from {title}!"\n'
        )

    # ------------------------------------------------------------------ #
    # Helpers
    # ------------------------------------------------------------------ #

    def _rel(self, path: Path) -> str:
        try:
            return str(path.relative_to(self.root_path)).replace("\\", "/")
        except ValueError:
            return str(path)

    @staticmethod
    def _write_json(path: Path, data: Any) -> None:
        path.write_text(
            json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8",
        )

    @staticmethod
    def _write_text(path: Path, text: str, force: bool) -> None:
        if path.exists() and not force:
            logger.debug("Keeping existing %s", path.name)
            return
        path.write_text(text, encoding="utf-8")


# --------------------------------------------------------------------------- #
# Command handlers
# --------------------------------------------------------------------------- #

def cmd_scan(registry: ScriptRegistry, args: argparse.Namespace) -> int:
    tools = registry.scan_tools()
    registry.save_registry(tools)
    variants = sum(len(t["variants"]) for t in tools)
    logger.info("Found %d tool(s), %d variant(s)", len(tools), variants)
    return 0


def cmd_build(registry: ScriptRegistry, args: argparse.Namespace) -> int:
    tools = registry.scan_tools()
    registry.save_registry(tools)
    registry.generate_website_data(tools)
    return 0


def cmd_add(registry: ScriptRegistry, args: argparse.Namespace) -> int:
    variant_dir = registry.add_variant(
        args.tool, args.language, args.category, args.difficulty, args.force,
    )
    logger.info(
        "Next: edit the README and source under %s, then run "
        "'python script_manager.py build'.",
        registry._rel(variant_dir.parent),
    )
    return 0


def cmd_list(registry: ScriptRegistry, args: argparse.Namespace) -> int:
    tools = registry.scan_tools()
    by_category: dict[str, list[dict[str, Any]]] = {}
    for tool in tools:
        by_category.setdefault(tool["category"], []).append(tool)

    for category in sorted(by_category):
        bucket = by_category[category]
        print(f"\n{category} ({len(bucket)})")
        for tool in bucket:
            langs = ", ".join(v["language"] for v in tool["variants"])
            star = "*" if tool["featured"] else " "
            print(f"  {star} {tool['title']}  [{langs}]")
    print(f"\nTotal: {len(tools)} tool(s), "
          f"{sum(len(t['variants']) for t in tools)} variant(s)")
    return 0


# --------------------------------------------------------------------------- #
# CLI
# --------------------------------------------------------------------------- #

def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="script_manager.py",
        description="Manage the Nerva script repository and website data.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Examples:\n"
            "  python script_manager.py build\n"
            "  python script_manager.py add port-scanner python --category security\n"
            "  python script_manager.py add port-scanner bash      # add a variant\n"
            "  python script_manager.py list\n"
        ),
    )
    parser.add_argument("--root", default=".", metavar="PATH",
                        help="Path to the Nerva project root (default: current directory).")
    parser.add_argument("-v", "--verbose", action="store_true",
                        help="Show debug-level logging.")
    parser.add_argument("-q", "--quiet", action="store_true",
                        help="Only show warnings and errors.")

    sub = parser.add_subparsers(dest="command", metavar="<command>", required=True)

    p_scan = sub.add_parser("scan", help="Discover tools and update the registry.")
    p_scan.set_defaults(func=cmd_scan)

    p_build = sub.add_parser(
        "build", help="Scan, update the registry and regenerate website data.")
    p_build.set_defaults(func=cmd_build)

    p_add = sub.add_parser("add", help="Scaffold a new tool or language variant.")
    p_add.add_argument("tool", help="Tool name (kebab-case recommended).")
    p_add.add_argument("language", choices=sorted(SUPPORTED_LANGUAGES),
                       help="Language variant to scaffold.")
    p_add.add_argument("--category", default="utility",
                       help="Category folder for a NEW tool (default: utility). "
                            "Ignored if the tool already exists.")
    p_add.add_argument("--difficulty", default="Intermediate",
                       help="Difficulty level for a new tool's README.")
    p_add.add_argument("--force", action="store_true",
                       help="Overwrite existing files.")
    p_add.set_defaults(func=cmd_add)

    p_list = sub.add_parser("list", help="Print a summary of indexed tools.")
    p_list.set_defaults(func=cmd_list)

    return parser


def configure_logging(verbose: bool, quiet: bool) -> None:
    for stream in (sys.stdout, sys.stderr):
        reconfigure = getattr(stream, "reconfigure", None)
        if reconfigure is not None:
            reconfigure(encoding="utf-8", errors="replace")

    level = logging.DEBUG if verbose else logging.WARNING if quiet else logging.INFO
    logging.basicConfig(level=level, format="%(message)s", stream=sys.stderr)


def main(argv: Optional[list[str]] = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    configure_logging(args.verbose, args.quiet)

    registry = ScriptRegistry(args.root)
    try:
        return args.func(registry, args)
    except (FileNotFoundError, FileExistsError, ValueError) as exc:
        logger.error("%s", exc)
        return 1
    except KeyboardInterrupt:
        logger.error("Interrupted.")
        return 130


if __name__ == "__main__":
    sys.exit(main())
