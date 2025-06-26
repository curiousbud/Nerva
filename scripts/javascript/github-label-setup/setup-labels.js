// GitHub Labels Setup Script for Nerva Repository
// Node.js version - Creates all necessary labels for issue organization

const { execSync } = require('child_process');

// Color constants for console output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m'
};

function log(message, color = 'reset') {
    console.log(colors[color] + message + colors.reset);
}

function checkGHCli() {
    try {
        const version = execSync('gh --version', { encoding: 'utf8' });
        log(`✅ GitHub CLI found: ${version.split('\n')[0]}`, 'green');
        return true;
    } catch (error) {
        log('❌ GitHub CLI (gh) is not installed. Please install it first.', 'red');
        log('Visit: https://cli.github.com/', 'yellow');
        return false;
    }
}

function checkAuth() {
    try {
        execSync('gh auth status', { stdio: 'pipe' });
        log('✅ GitHub CLI authenticated', 'green');
        return true;
    } catch (error) {
        log('❌ Please authenticate with GitHub CLI first:', 'red');
        log('Run: gh auth login', 'yellow');
        return false;
    }
}

function createLabel(name, color, description) {
    try {
        execSync(`gh label create "${name}" --color "${color}" --description "${description}" --force`, { stdio: 'pipe' });
        log(`✅ Created: ${name}`, 'green');
        return true;
    } catch (error) {
        log(`⚠️  Warning: Could not create '${name}' - may already exist`, 'yellow');
        return false;
    }
}

function main() {
    log('🚀 Setting up GitHub labels for Nerva repository...', 'blue');
    
    // Check prerequisites
    if (!checkGHCli()) {
        process.exit(1);
    }
    
    if (!checkAuth()) {
        process.exit(1);
    }
    
    log('📝 Creating labels...', 'blue');
    
    // Define all labels
    const labels = [
        // Script Categories
        { name: "python", color: "3776ab", description: "Python scripts and issues" },
        { name: "javascript", color: "f1e05a", description: "JavaScript scripts and issues" },
        { name: "bash", color: "89e051", description: "Bash scripts and issues" },
        { name: "powershell", color: "012456", description: "PowerShell scripts and issues" },
        
        // Script Manager Specific
        { name: "script-manager", color: "e99695", description: "Script Manager related issues" },
        { name: "website", color: "1d76db", description: "Website integration issues" },
        { name: "automation", color: "0052cc", description: "Automation related issues" },
        
        // Priority Levels
        { name: "priority: high", color: "d73a4a", description: "High priority issues" },
        { name: "priority: medium", color: "fbca04", description: "Medium priority issues" },
        { name: "priority: low", color: "0e8a16", description: "Low priority issues" },
        
        // Difficulty Levels
        { name: "good first issue", color: "7057ff", description: "Good for newcomers" },
        { name: "help wanted", color: "008672", description: "Extra attention is needed" },
        { name: "advanced", color: "5319e7", description: "Requires advanced knowledge" },
        
        // Status Labels
        { name: "in progress", color: "fbca04", description: "Currently being worked on" },
        { name: "needs review", color: "0e8a16", description: "Ready for review" },
        { name: "blocked", color: "d93f0b", description: "Blocked by other issues" },
        
        // Security Related
        { name: "security", color: "d73a4a", description: "Security related issues" },
        { name: "vulnerability", color: "b60205", description: "Security vulnerability" },
        
        // Script Types
        { name: "utility", color: "7057ff", description: "Utility scripts" },
        { name: "networking", color: "0e8a16", description: "Network related scripts" },
        { name: "file-management", color: "c2e0c6", description: "File management scripts" },
        
        // Special Events
        { name: "hacktoberfest", color: "ff6b35", description: "Hacktoberfest eligible" },
        
        // Technical
        { name: "dependencies", color: "0366d6", description: "Dependency related issues" },
        { name: "performance", color: "c2e0c6", description: "Performance improvements" },
        { name: "breaking change", color: "b60205", description: "Breaking changes" }
    ];
    
    // Create all labels
    let successCount = 0;
    const totalCount = labels.length;
    
    labels.forEach(label => {
        if (createLabel(label.name, label.color, label.description)) {
            successCount++;
        }
    });
    
    console.log();
    log('🎉 Label setup complete!', 'green');
    log(`📊 Successfully processed ${successCount}/${totalCount} labels`, 'cyan');
    console.log();
    log('💡 Pro tip: Use \'gh label list\' to see all your repository labels.', 'blue');
}

if (require.main === module) {
    main();
}
