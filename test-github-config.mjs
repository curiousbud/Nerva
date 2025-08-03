/**
 * Test script to verify GitHub configuration is working correctly
 * Since we can't import TypeScript directly, we'll recreate the config here for testing
 */

const GITHUB_CONFIG = {
  USERNAME: 'curiousbud',
  REPO_NAME: 'Nerva',
  BRANCH: 'main',
  
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
  
  getScriptPath: function(scriptPath) {
    const cleanPath = scriptPath.replace(/\\/g, '/');
    return `${this.TREE_URL}/${cleanPath}`;
  },
  
  getLanguagePath: function(language) {
    return `${this.TREE_URL}/scripts/${language}`;
  }
};

console.log('🧪 Testing GitHub Configuration...\n');

console.log('📋 Current Configuration:');
console.log(`  Username: ${GITHUB_CONFIG.USERNAME}`);
console.log(`  Repository: ${GITHUB_CONFIG.REPO_NAME}`);
console.log(`  Branch: ${GITHUB_CONFIG.BRANCH}\n`);

console.log('🔗 Generated URLs:');
console.log(`  Base URL: ${GITHUB_CONFIG.BASE_URL}`);
console.log(`  Tree URL: ${GITHUB_CONFIG.TREE_URL}`);
console.log(`  Fork URL: ${GITHUB_CONFIG.FORK_URL}`);
console.log(`  Contributing: ${GITHUB_CONFIG.CONTRIBUTING_URL}\n`);

console.log('📁 Sample Paths:');
console.log(`  Python scripts: ${GITHUB_CONFIG.getLanguagePath('python')}`);
console.log(`  JavaScript scripts: ${GITHUB_CONFIG.getLanguagePath('javascript')}`);
console.log(`  Sample script: ${GITHUB_CONFIG.getScriptPath('scripts/python/file-organizer')}\n`);

console.log('✅ All URLs generated successfully!');
console.log('\n💡 To change username, edit website/lib/github-config.ts');
