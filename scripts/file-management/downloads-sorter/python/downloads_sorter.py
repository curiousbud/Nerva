import shutil
from pathlib import Path

def sort_downloads_folder():
    # Automatically locate the user's Downloads folder (works on Windows, Mac, and Linux)
    downloads_path = Path.home() / "Downloads"

    if not downloads_path.exists():
        print(f"Error: Could not locate the Downloads folder at {downloads_path}")
        return

    print(f"Scanning folder: {downloads_path}\n")
    moved_count = 0

    # Iterate through all items in the Downloads folder
    for file_path in downloads_path.iterdir():
        # Skip directories to avoid moving already sorted folders
        if file_path.is_dir():
            continue

        # Extract the extension (e.g., '.pdf'), convert to lowercase, and remove the dot
        extension = file_path.suffix.lower().lstrip('.')

        # If the file has no extension, group it in an "Others" folder
        if not extension:
            folder_name = "Others"
        else:
            folder_name = extension.upper() # e.g., 'PDF', 'JPG', 'EXE'

        # Define the path for the new subfolder
        target_folder = downloads_path / folder_name

        # Create the subfolder if it doesn't already exist
        target_folder.mkdir(exist_ok=True)

        # Define the exact destination path for the file
        target_path = target_folder / file_path.name

        try:
            # Move the file to its new categorized folder
            shutil.move(str(file_path), str(target_path))
            print(f"Moved: {file_path.name}  -->  {folder_name}/")
            moved_count += 1
        except Exception as e:
            print(f"Failed to move {file_path.name}: {e}")

    print(f"\nSorting complete! Successfully moved {moved_count} files.")

if __name__ == "__main__":
    sort_downloads_folder()
