#!/usr/bin/env python3
"""
Advanced File Organizer
A powerful file organization tool with multiple modes and configurations
"""

import os
import shutil
import json
import argparse
import logging
from pathlib import Path
from typing import Dict, List, Optional

class FileOrganizer:
    def __init__(self, config_file: Optional[str] = None):
        self.setup_logging()
        self.config = self.load_config(config_file)
        self.stats = {"moved": 0, "created_folders": 0, "errors": 0}
    
    def setup_logging(self):
        """Setup logging configuration"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('file_organizer.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
    
    def load_config(self, config_file: Optional[str] = None) -> Dict:
        """Load configuration from JSON file or use defaults"""
        default_config = {
            "Documents": ["pdf", "doc", "docx", "txt", "rtf", "odt"],
            "Images": ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"],
            "Videos": ["mp4", "avi", "mkv", "mov", "wmv", "flv", "webm"],
            "Audio": ["mp3", "wav", "flac", "aac", "ogg", "wma"],
            "Archives": ["zip", "rar", "7z", "tar", "gz", "bz2"],
            "Programming": ["py", "js", "html", "css", "java", "cpp", "c", "h"],
            "Spreadsheets": ["xls", "xlsx", "csv", "ods"],
            "Presentations": ["ppt", "pptx", "odp"],
            "Executables": ["exe", "msi", "deb", "rpm", "dmg", "app"]
        }
        
        if config_file and os.path.exists(config_file):
            try:
                with open(config_file, 'r') as f:
                    loaded_config = json.load(f)
                self.logger.info(f"Loaded configuration from {config_file}")
                return loaded_config
            except Exception as e:
                self.logger.warning(f"Error loading config file: {e}. Using defaults.")
        
        return default_config
    
    def get_folder_for_extension(self, extension: str) -> str:
        """Determine which folder an extension belongs to"""
        extension = extension.lower()
        for folder, extensions in self.config.items():
            if extension in [ext.lower() for ext in extensions]:
                return folder
        return "Others"
    
    def create_folder_if_needed(self, folder_path: str) -> bool:
        """Create folder if it doesn't exist"""
        if not os.path.exists(folder_path):
            try:
                os.makedirs(folder_path)
                self.logger.info(f"Created folder: {folder_path}")
                self.stats["created_folders"] += 1
                return True
            except Exception as e:
                self.logger.error(f"Error creating folder {folder_path}: {e}")
                self.stats["errors"] += 1
                return False
        return True
    
    def get_unique_filename(self, dest_path: str, filename: str) -> str:
        """Generate unique filename if file already exists"""
        base_name, extension = os.path.splitext(filename)
        counter = 1
        new_filename = filename
        
        while os.path.exists(os.path.join(dest_path, new_filename)):
            new_filename = f"{base_name}_{counter}{extension}"
            counter += 1
        
        return new_filename
    
    def organize_directory(self, directory: str, dry_run: bool = False) -> None:
        """Organize files in the specified directory"""
        if not os.path.exists(directory):
            self.logger.error(f"Directory does not exist: {directory}")
            return
        
        self.logger.info(f"Starting organization of: {directory}")
        if dry_run:
            self.logger.info("DRY RUN MODE - No files will be moved")
        
        files = [f for f in os.listdir(directory) 
                if os.path.isfile(os.path.join(directory, f))]
        
        for filename in files:
            try:
                file_path = os.path.join(directory, filename)
                
                # Get file extension
                _, extension = os.path.splitext(filename)
                extension = extension[1:] if extension else "no_extension"
                
                # Determine destination folder
                folder_name = self.get_folder_for_extension(extension)
                dest_folder = os.path.join(directory, folder_name)
                
                # Create destination folder
                if not dry_run:
                    if not self.create_folder_if_needed(dest_folder):
                        continue
                
                # Handle duplicate filenames
                unique_filename = self.get_unique_filename(dest_folder, filename)
                dest_path = os.path.join(dest_folder, unique_filename)
                
                # Move file
                if not dry_run:
                    shutil.move(file_path, dest_path)
                    self.stats["moved"] += 1
                
                self.logger.info(f"{'[DRY RUN] ' if dry_run else ''}Moved: {filename} → {folder_name}/{unique_filename}")
                
            except Exception as e:
                self.logger.error(f"Error processing {filename}: {e}")
                self.stats["errors"] += 1
    
    def organize_by_date(self, directory: str, dry_run: bool = False) -> None:
        """Organize files by creation date"""
        if not os.path.exists(directory):
            self.logger.error(f"Directory does not exist: {directory}")
            return
        
        self.logger.info(f"Starting date-based organization of: {directory}")
        
        files = [f for f in os.listdir(directory) 
                if os.path.isfile(os.path.join(directory, f))]
        
        for filename in files:
            try:
                file_path = os.path.join(directory, filename)
                
                # Get file creation date
                creation_time = os.path.getctime(file_path)
                from datetime import datetime
                date = datetime.fromtimestamp(creation_time)
                
                # Create year/month folder structure
                year_month = date.strftime("%Y/%m-%B")
                dest_folder = os.path.join(directory, year_month)
                
                # Create destination folder
                if not dry_run:
                    if not self.create_folder_if_needed(dest_folder):
                        continue
                
                # Handle duplicate filenames
                unique_filename = self.get_unique_filename(dest_folder, filename)
                dest_path = os.path.join(dest_folder, unique_filename)
                
                # Move file
                if not dry_run:
                    shutil.move(file_path, dest_path)
                    self.stats["moved"] += 1
                
                self.logger.info(f"{'[DRY RUN] ' if dry_run else ''}Moved: {filename} → {year_month}/{unique_filename}")
                
            except Exception as e:
                self.logger.error(f"Error processing {filename}: {e}")
                self.stats["errors"] += 1
    
    def print_statistics(self):
        """Print organization statistics"""
        print("\n" + "="*50)
        print("ORGANIZATION COMPLETE")
        print("="*50)
        print(f"Files moved: {self.stats['moved']}")
        print(f"Folders created: {self.stats['created_folders']}")
        print(f"Errors: {self.stats['errors']}")
        print("="*50)

def main():
    parser = argparse.ArgumentParser(description="Advanced File Organizer")
    parser.add_argument("directory", help="Directory to organize")
    parser.add_argument("-c", "--config", help="Configuration file path")
    parser.add_argument("-d", "--dry-run", action="store_true", help="Preview changes without moving files")
    parser.add_argument("-m", "--mode", choices=["extension", "date"], default="extension", 
                       help="Organization mode: by extension (default) or by date")
    
    args = parser.parse_args()
    
    # Create organizer instance
    organizer = FileOrganizer(args.config)
    
    # Organize based on selected mode
    if args.mode == "extension":
        organizer.organize_directory(args.directory, args.dry_run)
    elif args.mode == "date":
        organizer.organize_by_date(args.directory, args.dry_run)
    
    # Print results
    organizer.print_statistics()

if __name__ == "__main__":
    main()
