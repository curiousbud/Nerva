#!/usr/bin/env python3
"""
Advanced Duplicate File Finder
Efficiently finds and manages duplicate files using MD5 hashing
"""

import os
import hashlib
import argparse
import logging
import shutil
from pathlib import Path
from collections import defaultdict
from typing import Dict, List, Set, Optional

class DuplicateFinder:
    def __init__(self):
        self.setup_logging()
        self.duplicates = defaultdict(list)
        self.stats = {
            "files_scanned": 0,
            "duplicates_found": 0,
            "bytes_processed": 0,
            "files_deleted": 0,
            "files_moved": 0,
            "space_saved": 0
        }
    
    def setup_logging(self):
        """Setup logging configuration"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('duplicate_finder.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
    
    def calculate_md5(self, file_path: str, chunk_size: int = 8192) -> str:
        """Calculate MD5 hash of a file"""
        hash_md5 = hashlib.md5()
        try:
            with open(file_path, "rb") as f:
                for chunk in iter(lambda: f.read(chunk_size), b""):
                    hash_md5.update(chunk)
            return hash_md5.hexdigest()
        except (IOError, PermissionError) as e:
            self.logger.warning(f"Cannot read file {file_path}: {e}")
            return None
    
    def should_include_file(self, file_path: str, min_size: int, 
                          file_extensions: Optional[List[str]]) -> bool:
        """Check if file should be included in scan"""
        try:
            file_stat = os.stat(file_path)
            
            # Check size requirement
            if file_stat.st_size < min_size:
                return False
            
            # Check extension requirement
            if file_extensions:
                file_ext = Path(file_path).suffix.lower()
                if file_ext not in [ext.lower() for ext in file_extensions]:
                    return False
            
            return True
        except (OSError, FileNotFoundError):
            return False
    
    def scan_directory(self, directory: str, min_size: int = 0, 
                      file_extensions: Optional[List[str]] = None,
                      recursive: bool = True) -> Dict[str, List[str]]:
        """Scan directory for duplicate files"""
        self.logger.info(f"Scanning directory: {directory}")
        
        if not os.path.exists(directory):
            self.logger.error(f"Directory does not exist: {directory}")
            return {}
        
        file_hashes = defaultdict(list)
        
        # Walk through directory
        if recursive:
            for root, dirs, files in os.walk(directory):
                for file in files:
                    file_path = os.path.join(root, file)
                    self._process_file(file_path, min_size, file_extensions, file_hashes)
        else:
            for file in os.listdir(directory):
                file_path = os.path.join(directory, file)
                if os.path.isfile(file_path):
                    self._process_file(file_path, min_size, file_extensions, file_hashes)
        
        # Filter out files with unique hashes (no duplicates)
        self.duplicates = {hash_val: paths for hash_val, paths in file_hashes.items() if len(paths) > 1}
        self.stats["duplicates_found"] = len(self.duplicates)
        
        self.logger.info(f"Scan complete: {self.stats['files_scanned']} files scanned, "
                        f"{self.stats['duplicates_found']} duplicate groups found")
        
        return dict(self.duplicates)
    
    def _process_file(self, file_path: str, min_size: int, 
                     file_extensions: Optional[List[str]], file_hashes: Dict):
        """Process a single file for duplicate checking"""
        if not self.should_include_file(file_path, min_size, file_extensions):
            return
        
        try:
            file_hash = self.calculate_md5(file_path)
            if file_hash:
                file_hashes[file_hash].append(file_path)
                self.stats["files_scanned"] += 1
                self.stats["bytes_processed"] += os.path.getsize(file_path)
                
                if self.stats["files_scanned"] % 100 == 0:
                    self.logger.info(f"Processed {self.stats['files_scanned']} files...")
        
        except Exception as e:
            self.logger.warning(f"Error processing {file_path}: {e}")
    
    def display_duplicates(self, show_sizes: bool = True):
        """Display found duplicates"""
        if not self.duplicates:
            print("No duplicates found!")
            return
        
        print("\n" + "="*80)
        print("DUPLICATE FILES FOUND")
        print("="*80)
        
        for i, (hash_val, paths) in enumerate(self.duplicates.items(), 1):
            print(f"\nGroup {i} ({len(paths)} files):")
            if show_sizes:
                try:
                    size = os.path.getsize(paths[0])
                    print(f"File size: {self.format_bytes(size)}")
                except:
                    pass
            
            for j, path in enumerate(paths):
                marker = "🔹" if j == 0 else "🔸"
                print(f"  {marker} {path}")
    
    def delete_duplicates(self, keep_original: bool = True, dry_run: bool = False):
        """Delete duplicate files"""
        if not self.duplicates:
            self.logger.info("No duplicates to delete")
            return
        
        self.logger.info(f"{'[DRY RUN] ' if dry_run else ''}Starting duplicate deletion...")
        
        for hash_val, paths in self.duplicates.items():
            # Keep the first file (usually the oldest or in the original location)
            files_to_delete = paths[1:] if keep_original else paths[:-1]
            
            for file_path in files_to_delete:
                try:
                    if not dry_run:
                        file_size = os.path.getsize(file_path)
                        os.remove(file_path)
                        self.stats["files_deleted"] += 1
                        self.stats["space_saved"] += file_size
                    
                    self.logger.info(f"{'[DRY RUN] ' if dry_run else ''}Deleted: {file_path}")
                
                except Exception as e:
                    self.logger.error(f"Error deleting {file_path}: {e}")
    
    def move_duplicates(self, destination: str, dry_run: bool = False):
        """Move duplicate files to a destination folder"""
        if not self.duplicates:
            self.logger.info("No duplicates to move")
            return
        
        if not dry_run:
            os.makedirs(destination, exist_ok=True)
        
        self.logger.info(f"{'[DRY RUN] ' if dry_run else ''}Moving duplicates to: {destination}")
        
        for hash_val, paths in self.duplicates.items():
            # Move all but the first file
            for file_path in paths[1:]:
                try:
                    filename = os.path.basename(file_path)
                    dest_path = os.path.join(destination, filename)
                    
                    # Handle naming conflicts
                    counter = 1
                    while os.path.exists(dest_path):
                        name, ext = os.path.splitext(filename)
                        dest_path = os.path.join(destination, f"{name}_{counter}{ext}")
                        counter += 1
                    
                    if not dry_run:
                        shutil.move(file_path, dest_path)
                        self.stats["files_moved"] += 1
                    
                    self.logger.info(f"{'[DRY RUN] ' if dry_run else ''}Moved: {file_path} → {dest_path}")
                
                except Exception as e:
                    self.logger.error(f"Error moving {file_path}: {e}")
    
    def generate_report(self, output_file: Optional[str] = None):
        """Generate a detailed report of duplicates"""
        if not self.duplicates:
            return
        
        report_lines = [
            "DUPLICATE FILES REPORT",
            "=" * 50,
            f"Total duplicate groups: {len(self.duplicates)}",
            f"Total files scanned: {self.stats['files_scanned']}",
            f"Total bytes processed: {self.format_bytes(self.stats['bytes_processed'])}",
            "",
            "DUPLICATE GROUPS:",
            "-" * 30
        ]
        
        for i, (hash_val, paths) in enumerate(self.duplicates.items(), 1):
            report_lines.append(f"\nGroup {i}:")
            report_lines.append(f"  Hash: {hash_val}")
            try:
                size = os.path.getsize(paths[0])
                report_lines.append(f"  Size: {self.format_bytes(size)}")
            except:
                pass
            
            for path in paths:
                report_lines.append(f"    {path}")
        
        report_content = "\n".join(report_lines)
        
        if output_file:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(report_content)
            self.logger.info(f"Report saved to: {output_file}")
        else:
            print(report_content)
    
    def format_bytes(self, bytes_val: int) -> str:
        """Format bytes in human readable format"""
        for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
            if bytes_val < 1024.0:
                return f"{bytes_val:.1f} {unit}"
            bytes_val /= 1024.0
        return f"{bytes_val:.1f} PB"
    
    def print_statistics(self):
        """Print final statistics"""
        print("\n" + "="*60)
        print("DUPLICATE FINDER STATISTICS")
        print("="*60)
        print(f"Files scanned: {self.stats['files_scanned']}")
        print(f"Bytes processed: {self.format_bytes(self.stats['bytes_processed'])}")
        print(f"Duplicate groups found: {self.stats['duplicates_found']}")
        print(f"Files deleted: {self.stats['files_deleted']}")
        print(f"Files moved: {self.stats['files_moved']}")
        print(f"Space saved: {self.format_bytes(self.stats['space_saved'])}")
        print("="*60)

def main():
    parser = argparse.ArgumentParser(description="Advanced Duplicate File Finder")
    parser.add_argument("directory", help="Directory to scan for duplicates")
    parser.add_argument("-s", "--min-size", type=int, default=0, 
                       help="Minimum file size in bytes (default: 0)")
    parser.add_argument("-e", "--extensions", nargs='+', 
                       help="File extensions to check (e.g., .jpg .png)")
    parser.add_argument("-r", "--recursive", action="store_true", default=True,
                       help="Scan subdirectories recursively")
    parser.add_argument("--no-recursive", action="store_false", dest="recursive",
                       help="Don't scan subdirectories")
    parser.add_argument("-a", "--action", choices=["list", "delete", "move"], 
                       default="list", help="Action to take on duplicates")
    parser.add_argument("-d", "--destination", help="Destination folder for move action")
    parser.add_argument("--dry-run", action="store_true", 
                       help="Preview actions without making changes")
    parser.add_argument("-o", "--output", help="Output file for report")
    parser.add_argument("--keep-newest", action="store_true",
                       help="Keep newest file instead of first found")
    
    args = parser.parse_args()
    
    # Validate arguments
    if args.action == "move" and not args.destination:
        parser.error("--destination is required when using move action")
    
    # Create finder instance
    finder = DuplicateFinder()
    
    # Scan for duplicates
    duplicates = finder.scan_directory(
        args.directory,
        args.min_size,
        args.extensions,
        args.recursive
    )
    
    if not duplicates:
        print("No duplicates found!")
        return
    
    # Display results
    finder.display_duplicates()
    
    # Perform requested action
    if args.action == "delete":
        if args.dry_run or input("\nDelete duplicates? (y/N): ").lower() == 'y':
            finder.delete_duplicates(
                keep_original=not args.keep_newest,
                dry_run=args.dry_run
            )
    elif args.action == "move":
        if args.dry_run or input(f"\nMove duplicates to {args.destination}? (y/N): ").lower() == 'y':
            finder.move_duplicates(args.destination, args.dry_run)
    
    # Generate report if requested
    if args.output:
        finder.generate_report(args.output)
    
    # Print statistics
    finder.print_statistics()

if __name__ == "__main__":
    main()
