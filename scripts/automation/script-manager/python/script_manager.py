#!/usr/bin/env python3
"""
Script Registry Management Tool for Nerva
Automatically generates script cards and updates the website
"""

import json
import os
import sys
from pathlib import Path
from typing import Dict, List, Any

class ScriptRegistry:
    def __init__(self, root_path: str = "."):
        self.root_path = Path(root_path)
        self.scripts_path = self.root_path / "scripts"
        self.registry_file = self.root_path / "script-registry.json"
        self.website_path = self.root_path / "website"
        
    def scan_scripts(self) -> Dict[str, List[Dict[str, Any]]]:
        """Scan all script directories and collect metadata"""
        registry = {}
        
        for lang_dir in self.scripts_path.iterdir():
            if lang_dir.is_dir() and lang_dir.name in ["python", "javascript", "bash", "powershell"]:
                scripts = []
                
                for script_dir in lang_dir.iterdir():
                    if script_dir.is_dir():
                        metadata = self.extract_script_metadata(script_dir)
                        if metadata:
                            scripts.append(metadata)
                
                registry[lang_dir.name] = scripts
        
        return registry
    
    def extract_script_metadata(self, script_dir: Path) -> Dict[str, Any]:
        """Extract metadata from a script directory"""
        readme_path = script_dir / "README.md"
        
        if not readme_path.exists():
            return None
            
        metadata = {
            "name": script_dir.name,
            "path": str(script_dir.relative_to(self.root_path)),
            "category": "Utility",
            "difficulty": "Intermediate",
            "description": "No description available",
            "features": [],
            "requirements": [],
            "usage": ""
        }
        
        try:
            with open(readme_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Parse README for metadata
            lines = content.split('\n')
            current_section = None
            
            for line in lines:
                line = line.strip()
                
                # Extract title
                if line.startswith('# ') and not metadata.get('display_name'):
                    metadata['display_name'] = line[2:].strip()
                
                # Extract description from first paragraph
                elif line and not line.startswith('#') and metadata['description'] == "No description available":
                    metadata['description'] = line
                
                # Extract features
                elif line.startswith('## ') and 'feature' in line.lower():
                    current_section = 'features'
                elif current_section == 'features' and line.startswith('- '):
                    metadata['features'].append(line[2:].strip())
                
                # Extract requirements
                elif line.startswith('## ') and 'requirement' in line.lower():
                    current_section = 'requirements'
                elif current_section == 'requirements' and line.startswith('- '):
                    metadata['requirements'].append(line[2:].strip())
                
                # Extract usage
                elif line.startswith('## ') and 'usage' in line.lower():
                    current_section = 'usage'
                elif current_section == 'usage' and line.startswith('```'):
                    current_section = 'usage_code'
                elif current_section == 'usage_code' and line.startswith('```'):
                    current_section = None
                elif current_section == 'usage_code':
                    metadata['usage'] += line + '\n'
        
        except Exception as e:
            print(f"Error parsing {readme_path}: {e}")
        
        # Set display name if not found
        if not metadata.get('display_name'):
            metadata['display_name'] = metadata['name'].replace('-', ' ').replace('_', ' ').title()
        
        return metadata
    
    def save_registry(self, registry: Dict[str, List[Dict[str, Any]]]):
        """Save the script registry to JSON file"""
        with open(self.registry_file, 'w', encoding='utf-8') as f:
            json.dump(registry, f, indent=2, ensure_ascii=False)
        
        print(f"Registry saved to {self.registry_file}")
    
    def generate_website_data(self, registry: Dict[str, List[Dict[str, Any]]]):
        """Generate data file for website consumption"""
        website_data_path = self.website_path / "public" / "data" / "scripts.json"
        website_data_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Transform registry for website use
        website_data = {
            "lastUpdated": "",
            "totalScripts": sum(len(scripts) for scripts in registry.values()),
            "languages": {}
        }
        
        for lang, scripts in registry.items():
            website_data["languages"][lang] = {
                "count": len(scripts),
                "scripts": scripts
            }
        
        with open(website_data_path, 'w', encoding='utf-8') as f:
            json.dump(website_data, f, indent=2, ensure_ascii=False)
        
        print(f"Website data generated at {website_data_path}")
    
    def add_script_template(self, language: str, script_name: str, category: str = "Utility"):
        """Create a template for a new script"""
        script_dir = self.scripts_path / language / script_name
        script_dir.mkdir(parents=True, exist_ok=True)
        
        # Create README template
        readme_content = f"""# {script_name.replace('-', ' ').replace('_', ' ').title()}

## Description
Brief description of what this script does.

## Features
- Feature 1
- Feature 2
- Feature 3

## Requirements
- Python 3.6+
- Required packages (add to requirements.txt)

## Usage

```bash
# Basic usage example
python {script_name}.py --help
```

## Installation

```bash
# Install dependencies
pip install -r requirements.txt
```

## Examples

```bash
# Example 1
python {script_name}.py --option value

# Example 2
python {script_name}.py --input file.txt --output result.txt
```

## License
This script is part of the Nerva project and is licensed under MIT License.
"""
        
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
