# 🗂️ Advanced File Organizer

## Description
A powerful Python tool that automatically organizes files in directories based on file extensions or creation dates. Features multiple organization modes, dry-run capability, and detailed logging.

## Features
- **Extension-based organization**: Sort files into folders by file type (Documents, Images, Videos, etc.)
- **Date-based organization**: Organize files by creation date (Year/Month structure)
- **Custom configuration**: Use JSON config files to define your own folder structures
- **Dry-run mode**: Preview changes before actually moving files
- **Duplicate handling**: Automatically renames files to avoid conflicts
- **Comprehensive logging**: Detailed logs of all operations
- **Statistics reporting**: Summary of files moved, folders created, and any errors

## Requirements
- Python 3.6+
- Standard library modules (no external dependencies)

## Usage

### Basic Extension-based Organization
```bash
# Organize files by extension in the current directory
python file_organizer.py /path/to/directory

# Preview changes without moving files
python file_organizer.py /path/to/directory --dry-run
```

### Date-based Organization
```bash
# Organize files by creation date
python file_organizer.py /path/to/directory --mode date
```

### Custom Configuration
```bash
# Use custom configuration file
python file_organizer.py /path/to/directory --config custom_config.json
```

## Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/Nerva.git
cd Nerva/scripts/python/file-organizer

# No additional dependencies required
python file_organizer.py --help
```

## Configuration

The default configuration organizes files into these categories:
- **Documents**: pdf, doc, docx, txt, rtf, odt
- **Images**: jpg, jpeg, png, gif, bmp, svg, webp, tiff
- **Videos**: mp4, avi, mkv, mov, wmv, flv, webm, m4v
- **Audio**: mp3, wav, flac, aac, ogg, wma, m4a
- **Archives**: zip, rar, 7z, tar, gz, bz2, xz
- **Programming**: py, js, html, css, java, cpp, c, h, php, rb, go
- **Spreadsheets**: xls, xlsx, csv, ods
- **Presentations**: ppt, pptx, odp
- **Executables**: exe, msi, deb, rpm, dmg, app

### Custom Configuration File
Create a `config.json` file with your preferred organization:

```json
{
  "Work_Documents": ["docx", "xlsx", "pptx"],
  "Personal_Photos": ["jpg", "png", "gif"],
  "Project_Files": ["py", "js", "html"]
}
```

## Examples

```bash
# Basic organization
python file_organizer.py ~/Downloads

# Preview what would happen
python file_organizer.py ~/Downloads --dry-run

# Organize by date with custom config
python file_organizer.py ~/Photos --mode date --config photo_config.json

# Organize with verbose logging
python file_organizer.py ~/Documents 2>&1 | tee organization.log
```

## Output
- Organized files moved to appropriate folders
- Log file `file_organizer.log` with detailed operation history
- Console output showing real-time progress
- Final statistics summary

## Safety Features
- **Dry-run mode**: See what would happen without making changes
- **Duplicate handling**: Files with same names are automatically renamed
- **Error recovery**: Individual file errors don't stop the entire process
- **Comprehensive logging**: Full audit trail of all operations

## License
This script is part of the Nerva project and is licensed under MIT License.
