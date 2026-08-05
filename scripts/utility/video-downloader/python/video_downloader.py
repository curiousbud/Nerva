#!/usr/bin/env python3
"""
Bulk Video Downloader
---------------------
Reads a column of URLs (YouTube, Instagram, and hundreds of other sites)
from an Excel file and downloads each video using yt-dlp.

Usage:
    python video_downloader.py links.xlsx
    python video_downloader.py links.xlsx --sheet "Sheet1" --column "URL" --outdir downloads

Excel format expected:
    A single column containing one URL per row. By default the script
    looks for a column named "url" or "link" (case-insensitive), or
    falls back to the first column if no header matches.
"""

import argparse
import os
import sys
import time
import traceback
from pathlib import Path

try:
    import openpyxl
except ImportError:
    sys.exit("Missing dependency. Run: pip install openpyxl --break-system-packages")

try:
    import yt_dlp
except ImportError:
    sys.exit("Missing dependency. Run: pip install yt-dlp --break-system-packages")


def find_url_column(header_row, requested_column=None):
    """Return the index of the column to read URLs from."""
    headers = [str(c).strip().lower() if c is not None else "" for c in header_row]

    if requested_column:
        target = requested_column.strip().lower()
        if target in headers:
            return headers.index(target)
        raise ValueError(
            f"Column '{requested_column}' not found. Available columns: {header_row}"
        )

    for candidate in ("url", "link", "links", "urls", "video url", "video link"):
        if candidate in headers:
            return headers.index(candidate)

    # No recognizable header — assume first column holds URLs and there is no header row
    return 0


def read_urls_from_excel(filepath, sheet_name=None, column_name=None):
    """Extract a de-duplicated, ordered list of URLs from the given Excel file."""
    wb = openpyxl.load_workbook(filepath, data_only=True)
    ws = wb[sheet_name] if sheet_name else wb.active

    rows = list(ws.iter_rows(values_only=True))
    if not rows:
        return []

    first_row = rows[0]
    col_index = find_url_column(first_row, column_name)

    # Decide whether the first row is a header or actual data.
    first_cell = str(first_row[col_index]).strip() if first_row[col_index] else ""
    looks_like_header = first_cell.lower() in (
        "url", "link", "links", "urls", "video url", "video link"
    )
    data_rows = rows[1:] if looks_like_header else rows

    urls = []
    seen = set()
    for row in data_rows:
        if col_index >= len(row):
            continue
        value = row[col_index]
        if value is None:
            continue
        url = str(value).strip()
        if url and url not in seen and url.lower().startswith(("http://", "https://")):
            seen.add(url)
            urls.append(url)

    return urls


def sanitize_platform_folder(url):
    """Group downloads into subfolders by platform for tidiness."""
    url_lower = url.lower()
    if "instagram.com" in url_lower:
        return "instagram"
    if "youtube.com" in url_lower or "youtu.be" in url_lower:
        return "youtube"
    if "tiktok.com" in url_lower:
        return "tiktok"
    if "facebook.com" in url_lower or "fb.watch" in url_lower:
        return "facebook"
    if "twitter.com" in url_lower or "x.com" in url_lower:
        return "twitter_x"
    if "vimeo.com" in url_lower:
        return "vimeo"
    return "other"

def download_videos(urls, outdir="downloads", cookies_file=None, quality="best",
                     group_by_platform=True, retries=2, sleep_between=1.0):
    """Download each URL with yt-dlp, logging results as it goes."""
    os.makedirs(outdir, exist_ok=True)

    succeeded, failed = [], []

    for i, url in enumerate(urls, start=1):
        platform = sanitize_platform_folder(url) if group_by_platform else ""
        target_dir = os.path.join(outdir, platform) if platform else outdir
        os.makedirs(target_dir, exist_ok=True)

        print(f"\n[{i}/{len(urls)}] Downloading: {url}")

        ydl_opts = {
            "outtmpl": os.path.join(target_dir, "%(uploader)s - %(title).150B [%(id)s].%(ext)s"),
            "format": f"{quality}[ext=mp4]/{quality}",
            "merge_output_format": "mp4",
            "quiet": False,
            "no_warnings": False,
            "ignoreerrors": False,
            "retries": retries,
            "fragment_retries": retries,
            "noplaylist": False,  # set True if you only want single videos, not whole playlists
        }
        if cookies_file:
            ydl_opts["cookiefile"] = cookies_file

        attempt = 0
        last_error = None
        while attempt <= retries:
            try:
                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    ydl.download([url])
                succeeded.append(url)
                last_error = None
                break
            except Exception as e:
                last_error = e
                attempt += 1
                if attempt <= retries:
                    print(f"  Retry {attempt}/{retries} after error: {e}")
                    time.sleep(2)

        if last_error is not None:
            print(f"  FAILED: {last_error}")
            failed.append((url, str(last_error)))

        time.sleep(sleep_between)  # be polite to the source servers

    return succeeded, failed


def write_report(succeeded, failed, outdir):
    report_path = os.path.join(outdir, "download_report.txt")
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(f"Succeeded: {len(succeeded)}\n")
        f.write(f"Failed: {len(failed)}\n\n")
        if failed:
            f.write("--- Failed URLs ---\n")
            for url, err in failed:
                f.write(f"{url}\n  Error: {err}\n\n")
        if succeeded:
            f.write("--- Succeeded URLs ---\n")
            for url in succeeded:
                f.write(f"{url}\n")
    return report_path


def main():
    parser = argparse.ArgumentParser(description="Download videos from URLs listed in an Excel file.")
    parser.add_argument("excel_file", help="Path to the .xlsx file containing video URLs")
    parser.add_argument("--sheet", default=None, help="Sheet name to read (default: active sheet)")
    parser.add_argument("--column", default=None, help="Column header containing URLs (default: auto-detect 'url'/'link')")
    parser.add_argument("--outdir", default="downloads", help="Output directory for downloaded videos")
    parser.add_argument("--quality", default="best", help="yt-dlp format selector, e.g. 'best', 'bestvideo+bestaudio'")
    parser.add_argument("--cookies", default=None, help="Path to a cookies.txt file (needed for private/age-gated Instagram or YouTube content)")
    parser.add_argument("--no-platform-folders", action="store_true", help="Don't sort downloads into per-platform subfolders")
    parser.add_argument("--retries", type=int, default=2, help="Retries per video on failure")
    args = parser.parse_args()

    if not Path(args.excel_file).exists():
        sys.exit(f"File not found: {args.excel_file}")

    print(f"Reading URLs from {args.excel_file} ...")
    try:
        urls = read_urls_from_excel(args.excel_file, sheet_name=args.sheet, column_name=args.column)
    except Exception as e:
        traceback.print_exc()
        sys.exit(f"Could not read URLs: {e}")

    if not urls:
        sys.exit("No valid URLs found in the file. Check the sheet/column name and that cells start with http(s)://")

    print(f"Found {len(urls)} unique URL(s).")

    succeeded, failed = download_videos(
        urls,
        outdir=args.outdir,
        cookies_file=args.cookies,
        quality=args.quality,
        group_by_platform=not args.no_platform_folders,
        retries=args.retries,
    )

    report_path = write_report(succeeded, failed, args.outdir)

    print("\n" + "=" * 50)
    print(f"Done. Succeeded: {len(succeeded)}  Failed: {len(failed)}")
    print(f"Report saved to: {report_path}")
    print("=" * 50)


if __name__ == "__main__":
    main()
