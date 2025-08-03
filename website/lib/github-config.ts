// GitHub Repository Configuration
// This file centralizes all GitHub-related URLs and usernames
// Update the GITHUB_USERNAME constant to change all links across the application

export const GITHUB_CONFIG = {
  // Main GitHub username/organization
  USERNAME: 'curiousbud',
  
  // Repository name
  REPO_NAME: 'Nerva',
  
  // Branch name (usually 'main' or 'master')
  BRANCH: 'main',
  
  // Generated URLs (automatically constructed from above values)
  get BASE_URL() {
    return `https://github.com/${this.USERNAME}/${this.REPO_NAME}`;
  },
  
  get TREE_URL() {
    return `${this.BASE_URL}/tree/${this.BRANCH}`;
  },
  
  get FORK_URL() {
    return `${this.BASE_URL}/fork`;
  },
  
  get CONTRIBUTING_URL() {
    return `${this.BASE_URL}/blob/${this.BRANCH}/CONTRIBUTING.md`;
  },
  
  // Helper functions
  getScriptPath: (scriptPath: string) => {
    const cleanPath = scriptPath.replace(/\\/g, '/');
    return `${GITHUB_CONFIG.TREE_URL}/${cleanPath}`;
  },
  
  getLanguagePath: (language: string) => {
    return `${GITHUB_CONFIG.TREE_URL}/scripts/${language}`;
  }
};

// Export individual values for convenience
export const { USERNAME, REPO_NAME, BRANCH, BASE_URL, TREE_URL, FORK_URL, CONTRIBUTING_URL } = GITHUB_CONFIG;
