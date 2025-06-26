#!/usr/bin/env python3
"""
GitHub Labels Setup Script for Nerva Repository
Python version - Creates all necessary labels for issue organization
"""

import subprocess
import sys
from typing import List, Dict, Any

def check_gh_cli() -> bool:
    """Check if GitHub CLI is installed and accessible."""
    try:
        result = subprocess.run(['gh', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ GitHub CLI found: {result.stdout.split()[0]}")
            return True
    except FileNotFoundError:
        pass
    
    print("❌ GitHub CLI (gh) is not installed. Please install it first.")
    print("Visit: https://cli.github.com/")
    return False

def check_auth() -> bool:
    """Check if user is authenticated with GitHub CLI."""
    try:
        result = subprocess.run(['gh', 'auth', 'status'], capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ GitHub CLI authenticated")
            return True
    except:
        pass
    
    print("❌ Please authenticate with GitHub CLI first:")
    print("Run: gh auth login")
    return False

def create_label(name: str, color: str, description: str) -> bool:
    """Create a single label using GitHub CLI."""
    try:
        cmd = ['gh', 'label', 'create', name, '--color', color, '--description', description, '--force']
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"✅ Created: {name}")
            return True
        else:
            print(f"⚠️  Warning: Could not create '{name}' - {result.stderr.strip()}")
            return False
    except Exception as e:
        print(f"❌ Error creating '{name}': {e}")
        return False

def main():
    """Main function to set up all GitHub labels."""
    print("🚀 Setting up GitHub labels for Nerva repository...")
    
    # Check prerequisites
    if not check_gh_cli():
        sys.exit(1)
    
    if not check_auth():
        sys.exit(1)
    
    print("📝 Creating labels...")
    
    # Define all labels
    labels: List[Dict[str, str]] = [
        # Script Categories
        {"name": "python", "color": "3776ab", "description": "Python scripts and issues"},
        {"name": "javascript", "color": "f1e05a", "description": "JavaScript scripts and issues"},
        {"name": "bash", "color": "89e051", "description": "Bash scripts and issues"},
        {"name": "powershell", "color": "012456", "description": "PowerShell scripts and issues"},
        
        # Script Manager Specific
        {"name": "script-manager", "color": "e99695", "description": "Script Manager related issues"},
        {"name": "website", "color": "1d76db", "description": "Website integration issues"},
        {"name": "automation", "color": "0052cc", "description": "Automation related issues"},
        
        # Priority Levels
        {"name": "priority: high", "color": "d73a4a", "description": "High priority issues"},
        {"name": "priority: medium", "color": "fbca04", "description": "Medium priority issues"},
        {"name": "priority: low", "color": "0e8a16", "description": "Low priority issues"},
        
        # Difficulty Levels
        {"name": "good first issue", "color": "7057ff", "description": "Good for newcomers"},
        {"name": "help wanted", "color": "008672", "description": "Extra attention is needed"},
        {"name": "advanced", "color": "5319e7", "description": "Requires advanced knowledge"},
        
        # Status Labels
        {"name": "in progress", "color": "fbca04", "description": "Currently being worked on"},
        {"name": "needs review", "color": "0e8a16", "description": "Ready for review"},
        {"name": "blocked", "color": "d93f0b", "description": "Blocked by other issues"},
        
        # Security Related
        {"name": "security", "color": "d73a4a", "description": "Security related issues"},
        {"name": "vulnerability", "color": "b60205", "description": "Security vulnerability"},
        
        # Script Types
        {"name": "utility", "color": "7057ff", "description": "Utility scripts"},
        {"name": "networking", "color": "0e8a16", "description": "Network related scripts"},
        {"name": "file-management", "color": "c2e0c6", "description": "File management scripts"},
        
        # Special Events
        {"name": "hacktoberfest", "color": "ff6b35", "description": "Hacktoberfest eligible"},
        
        # Technical
        {"name": "dependencies", "color": "0366d6", "description": "Dependency related issues"},
        {"name": "performance", "color": "c2e0c6", "description": "Performance improvements"},
        {"name": "breaking change", "color": "b60205", "description": "Breaking changes"},
    ]
    
    # Create all labels
    success_count = 0
    total_count = len(labels)
    
    for label in labels:
        if create_label(label["name"], label["color"], label["description"]):
            success_count += 1
    
    print()
    print("🎉 Label setup complete!")
    print(f"📊 Successfully processed {success_count}/{total_count} labels")
    print()
    print("💡 Pro tip: Use 'gh label list' to see all your repository labels.")

if __name__ == "__main__":
    main()
