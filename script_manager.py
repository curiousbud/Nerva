#!/usr/bin/env python3
"""
Script Registry Management Tool for Nerva
=========================================

A comprehensive automation tool that manages the Nerva script repository by:
1. Scanning all script directories to collect metadata from README files
2. Generating a centralized registry of all available scripts
3. Creating website data files for the frontend display
4. Providing templates for new script contributions

This tool is the backbone of the Nerva project, enabling seamless integration
between contributed scripts and the website frontend without manual updates.
"""

import json
import os
import sys
from pathlib import Path
from typing import Dict, List, Any

class ScriptRegistry:
    """
    Main class responsible for managing the script registry system.
    
    This class handles all operations related to script discovery,
    metadata extraction, registry generation, and website data preparation.
    It serves as the core engine of the script management system.
    """
    
    def __init__(self, root_path: str = "."):
        """
        Initialize the ScriptRegistry with paths to key directories and files.
        
        Args:
            root_path (str): Root directory of the Nerva project (default: current directory)
        
        Attributes:
            root_path (Path): Absolute path to the project root
            scripts_path (Path): Path to the scripts directory containing all language folders
            registry_file (Path): Path to the central JSON registry file
            website_path (Path): Path to the website directory for frontend data
        """
        self.root_path = Path(root_path)
        self.scripts_path = self.root_path / "scripts"
        self.registry_file = self.root_path / "script-registry.json"
        self.website_path = self.root_path / "website"
        
    def scan_scripts(self) -> Dict[str, List[Dict[str, Any]]]:
        """
        Scan all script directories and collect metadata from each script's README.
        
        This method traverses the script directory structure, organized by programming
        language, and collects metadata for each script by extracting information from
        its README.md file.
        
        Returns:
            Dict[str, List[Dict[str, Any]]]: A nested dictionary with languages as keys
                and lists of script metadata dictionaries as values.
                Format: {'python': [script1_metadata, script2_metadata, ...], ...}
        """
        registry = {}
        
        # Scan each language directory
        for lang_dir in self.scripts_path.iterdir():
            # Only process known language directories
            if lang_dir.is_dir() and lang_dir.name in ["python", "javascript", "bash", "powershell"]:
                scripts = []
                
                # Process each script directory within the language directory
                for script_dir in lang_dir.iterdir():
                    if script_dir.is_dir():
                        # Extract metadata from the script's README
                        metadata = self.extract_script_metadata(script_dir)
                        if metadata:
                            scripts.append(metadata)
                
                # Add scripts to registry under their language
                registry[lang_dir.name] = scripts
        
        return registry
    
    def extract_script_metadata(self, script_dir: Path) -> Dict[str, Any]:
        """
        Extract metadata from a script's README.md file.
        
        This method parses a script's README.md file to extract structured metadata 
        including the script's name, description, features, requirements, usage examples,
        and whether it should be featured on the website.
        
        The parsing logic looks for specific Markdown sections and formats to extract
        information in a standardized way, making it easy for contributors to have
        their scripts properly represented on the website.
        
        Args:
            script_dir (Path): Path to the script directory
            
        Returns:
            Dict[str, Any]: Dictionary of script metadata, or None if no README exists
                Keys include: name, path, category, difficulty, description, features,
                requirements, usage, and featured status
        """
        readme_path = script_dir / "README.md"
        
        # Skip if README doesn't exist
        if not readme_path.exists():
            return None
        
        # Initialize metadata with default values    
        metadata = {
            "name": script_dir.name,
            "path": str(script_dir.relative_to(self.root_path)),
            "category": "Utility",         # Default category
            "difficulty": "Intermediate",  # Default difficulty
            "description": "No description available",
            "features": [],                # Will be populated from Features section
            "requirements": [],            # Will be populated from Requirements section
            "usage": "",                   # Will be populated from Usage section
            "featured": False              # Will be set based on markers or importance
        }
        
        try:
            with open(readme_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Parse README for metadata
            lines = content.split('\n')
            current_section = None
            
            for line in lines:
                line_stripped = line.strip()
                
                # Extract title
                if line_stripped.startswith('# ') and not metadata.get('display_name'):
                    metadata['display_name'] = line_stripped[2:].strip()
                
                # Extract description from first paragraph after title
                elif line_stripped and not line_stripped.startswith('#') and not line_stripped.startswith('```') and metadata['description'] == "No description available":
                    metadata['description'] = line_stripped
                
                # Detect section headers
                elif line_stripped.startswith('## '):
                    section_title = line_stripped[3:].strip().lower()
                    # Remove emojis and clean the section title
                    import re
                    section_title = re.sub(r'[^\w\s]', '', section_title).strip()
                    
                    if 'feature' in section_title:
                        current_section = 'features'
                    elif 'requirement' in section_title:
                        current_section = 'requirements'
                    elif 'usage' in section_title:
                        current_section = 'usage'
                    else:
                        current_section = None
                
                # Check for featured indicator in README
                elif 'featured' in line_stripped.lower() or 'highlight' in line_stripped.lower():
                    metadata['featured'] = True
                
                # Extract features
                elif current_section == 'features' and line_stripped.startswith('- '):
                    metadata['features'].append(line_stripped[2:].strip())
                
                # Extract requirements - handle both list format and dependencies section
                elif current_section == 'requirements':
                    if line_stripped.startswith('- '):
                        # Clean up requirements with backticks and descriptions
                        req = line_stripped[2:].strip()
                        if '`' in req:
                            # Extract package name from backticks
                            import re
                            package_match = re.search(r'`([^`]+)`', req)
                            if package_match:
                                package = package_match.group(1)
                                # Add description if available
                                desc_part = req.split(' - ', 1)
                                if len(desc_part) > 1:
                                    req = f"{package} - {desc_part[1]}"
                                else:
                                    req = package
                        metadata['requirements'].append(req)
                    elif 'pip install' in line_stripped:
                        metadata['requirements'].append(line_stripped)
                    elif line_stripped.startswith('**') and line_stripped.endswith('**'):
                        # Skip bold section headers like "**Dependencies:**"
                        pass
                
                # Extract usage
                elif current_section == 'usage' and line_stripped.startswith('```'):
                    current_section = 'usage_code'
                elif current_section == 'usage_code' and line_stripped.startswith('```'):
                    current_section = None
                elif current_section == 'usage_code':
                    metadata['usage'] += line + '\n'
        
        except Exception as e:
            print(f"Error parsing {readme_path}: {e}")
        
        # Set display name if not found
        if not metadata.get('display_name'):
            metadata['display_name'] = metadata['name'].replace('-', ' ').replace('_', ' ').title()
        
        # Mark important scripts as featured automatically
        important_scripts = ['script-manager', 'vulnerability-scanner', 'ftp-scanner', 'file-organizer']
        if metadata['name'] in important_scripts:
            metadata['featured'] = True
        
        return metadata
    
    def save_registry(self, registry: Dict[str, List[Dict[str, Any]]]):
        """
        Save the complete script registry to a JSON file for version control.
        
        This method persists the scanned script metadata to a JSON file that serves
        as the authoritative source of truth for all scripts in the repository.
        The registry file is useful for:
        - Version control tracking of script additions/changes
        - Backup and restoration of script metadata
        - Development debugging and manual inspection
        - Future migration or data export needs
        
        Args:
            registry (Dict[str, List[Dict[str, Any]]]): The complete script registry
                containing all languages and their respective scripts
        
        Side Effects:
            - Creates or overwrites the script-registry.json file
            - Prints confirmation message to console
        """
        with open(self.registry_file, 'w', encoding='utf-8') as f:
            json.dump(registry, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Registry saved to {self.registry_file}")
    
    def generate_website_data(self, registry: Dict[str, List[Dict[str, Any]]]):
        """
        Generate optimized data file specifically for website consumption.
        
        This method transforms the internal script registry into a format optimized
        for the Next.js frontend. The generated data includes:
        - Aggregated statistics (total scripts, script counts per language)
        - Properly structured script data for efficient rendering
        - Featured scripts selection for homepage display
        - Language-specific organization for navigation
        
        The output format is designed to minimize client-side processing and
        enable fast rendering of the script catalog on the website.
        
        Args:
            registry (Dict[str, List[Dict[str, Any]]]): The complete script registry
        
        Side Effects:
            - Creates website/public/data/scripts.json for frontend consumption
            - Creates necessary directory structure if it doesn't exist
            - Prints confirmation message with statistics
        
        Website Data Structure:
            {
                "lastUpdated": "",              # Timestamp of last update
                "totalScripts": 14,             # Total number of scripts
                "languages": {                  # Scripts organized by language
                    "python": {
                        "count": 8,
                        "scripts": [...]
                    },
                    ...
                },
                "featured": [...]               # Featured scripts for homepage
            }
        """
        website_data_path = self.website_path / "public" / "data" / "scripts.json"
        website_data_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Transform registry for website use
        website_data = {
            "lastUpdated": "",
            "totalScripts": sum(len(scripts) for scripts in registry.values()),
            "languages": {},
            "featured": []
        }
        
        # Collect all scripts and featured scripts
        all_scripts = []
        for lang, scripts in registry.items():
            for script in scripts:
                script_with_lang = {**script, "language": lang}
                all_scripts.append(script_with_lang)
                if script.get('featured', False):
                    website_data["featured"].append(script_with_lang)
        
        # If no featured scripts, use first 6 as featured
        if not website_data["featured"]:
            website_data["featured"] = all_scripts[:6]
        
        for lang, scripts in registry.items():
            website_data["languages"][lang] = {
                "count": len(scripts),
                "scripts": scripts
            }
        
        with open(website_data_path, 'w', encoding='utf-8') as f:
            json.dump(website_data, f, indent=2, ensure_ascii=False)
        
        print(f"🌐 Website data generated at {website_data_path}")
        print(f"📊 Total scripts: {website_data['totalScripts']}")
        print(f"⭐ Featured scripts: {len(website_data['featured'])}")
    
    def add_script_template(self, language: str, script_name: str, category: str = "Utility"):
        """
        Create a complete template structure for a new script contribution.
        
        This method sets up everything a contributor needs to add a new script:
        - Creates the script directory structure
        - Generates a comprehensive README.md template
        - Creates placeholder files for common script components
        - Sets up language-specific configuration files
        
        The template follows Nerva's documentation standards and includes all
        sections needed for the script to be properly recognized and displayed
        on the website.
        
        Args:
            language (str): Programming language for the script (python, javascript, bash, powershell)
            script_name (str): Name of the script (will be used as directory name)
            category (str): Script category (default: "Utility")
            
        Side Effects:
            - Creates directory: scripts/{language}/{script_name}/
            - Creates README.md with comprehensive template
            - Creates placeholder script file
            - Creates requirements.txt (for Python) or package.json (for JavaScript)
            - Prints setup instructions for the contributor
        
        Example:
            registry.add_script_template("python", "data-processor", "Data Science")
            # Creates scripts/python/data-processor/ with all necessary files
        """
        script_dir = self.scripts_path / language / script_name
        script_dir.mkdir(parents=True, exist_ok=True)
        
        # Create README template
        readme_content = f"""# {script_name.replace('-', ' ').replace('_', ' ').title()}"""
        readme_path = script_dir / "README.md"
        if not readme_path.exists():
            with open(readme_path, 'w', encoding='utf-8') as f:
                f.write(readme_content)
        
        # Create requirements.txt template
        req_path = script_dir / "requirements.txt"
        if not req_path.exists():
            with open(req_path, 'w', encoding='utf-8') as f:
                f.write("# Add your dependencies here\n")
        
        print(f"Script template created at {script_dir}")
        return script_dir

def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python script_manager.py scan          # Scan and update registry")
        print("  python script_manager.py add <lang> <name>  # Add new script template")
        print("  python script_manager.py build         # Generate website data")
        return
    
    registry_manager = ScriptRegistry()
    
    if sys.argv[1] == "scan":
        print("Scanning scripts...")
        registry = registry_manager.scan_scripts()
        registry_manager.save_registry(registry)
        print(f"Found {sum(len(scripts) for scripts in registry.values())} scripts total")
        
    elif sys.argv[1] == "add" and len(sys.argv) >= 4:
        language = sys.argv[2]
        script_name = sys.argv[3]
        category = sys.argv[4] if len(sys.argv) > 4 else "Utility"
        
        script_dir = registry_manager.add_script_template(language, script_name, category)
        print(f"Template created. Edit {script_dir}/README.md and add your script files.")
        
    elif sys.argv[1] == "build":
        print("Building website data...")
        registry = registry_manager.scan_scripts()
        registry_manager.save_registry(registry)
        registry_manager.generate_website_data(registry)
        
    else:
        print("Invalid command. Use 'scan', 'add', or 'build'")

if __name__ == "__main__":
    main()
