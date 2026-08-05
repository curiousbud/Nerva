# 🎬 Bulk Video Downloader

Reads a column of video URLs (YouTube, Instagram, TikTok, Facebook and hundreds of other sites) from an Excel file and downloads each one with yt-dlp, organized into tidy per-platform folders.

**Difficulty:** Intermediate

## ✨ Features

- **Excel-driven**: Reads URLs from any sheet or column, auto-detecting 'url' or 'link' headers
- **De-duplication**: Skips duplicate and non-HTTP URLs automatically
- **Per-platform folders**: Groups downloads into youtube, instagram, tiktok, facebook, twitter_x, vimeo and other subfolders
- **Quality selection**: Full yt-dlp format selector support (e.g. best, bestvideo+bestaudio)
- **Retry & polite delays**: Configurable retries per video and a pause between downloads
- **Cookies support**: Pass a cookies.txt file for private or age-gated content
- **Download report**: Saves a report.txt listing succeeded and failed URLs with error details

## 📋 Requirements

- Python 3.8+
- `openpyxl`
- `yt-dlp`

## 🚀 Usage

```bash
pip install -r requirements.txt
python video_downloader.py links.xlsx
python video_downloader.py links.xlsx --sheet "Sheet1" --column "URL" --outdir downloads
```

The Excel file should contain one URL per row in a column named "url" or "link" (case-insensitive); if no matching header exists the first column is used.
