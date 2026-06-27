# GitHub Labels Setup Script for Nerva Repository
# PowerShell version - Creates all necessary labels for issue organization

Write-Host "🚀 Setting up GitHub labels for Nerva repository..." -ForegroundColor Green

# Check if GitHub CLI is installed
try {
    $ghVersion = gh --version
    Write-Host "✅ GitHub CLI found: $($ghVersion[0])" -ForegroundColor Green
} catch {
    Write-Host "❌ GitHub CLI (gh) is not installed. Please install it first." -ForegroundColor Red
    Write-Host "Run: winget install --id GitHub.cli" -ForegroundColor Yellow
    exit 1
}

# Check if user is authenticated
try {
    gh auth status | Out-Null
    Write-Host "✅ GitHub CLI authenticated" -ForegroundColor Green
} catch {
    Write-Host "❌ Please authenticate with GitHub CLI first:" -ForegroundColor Red
    Write-Host "Run: gh auth login" -ForegroundColor Yellow
    exit 1
}

Write-Host "📝 Creating labels..." -ForegroundColor Blue

# Define all labels
$labels = @(
    # Script Categories
    @{name="python"; color="3776ab"; description="Python scripts and issues"},
    @{name="javascript"; color="f1e05a"; description="JavaScript scripts and issues"},
    @{name="bash"; color="89e051"; description="Bash scripts and issues"},
    @{name="powershell"; color="012456"; description="PowerShell scripts and issues"},
    
    # Script Manager Specific
    @{name="script-manager"; color="e99695"; description="Script Manager related issues"},
    @{name="website"; color="1d76db"; description="Website integration issues"},
    @{name="automation"; color="0052cc"; description="Automation related issues"},
    
    # Priority Levels
    @{name="priority: high"; color="d73a4a"; description="High priority issues"},
    @{name="priority: medium"; color="fbca04"; description="Medium priority issues"},
    @{name="priority: low"; color="0e8a16"; description="Low priority issues"},
    
    # Difficulty Levels
    @{name="good first issue"; color="7057ff"; description="Good for newcomers"},
    @{name="help wanted"; color="008672"; description="Extra attention is needed"},
    @{name="advanced"; color="5319e7"; description="Requires advanced knowledge"},
    
    # Status Labels
    @{name="in progress"; color="fbca04"; description="Currently being worked on"},
    @{name="needs review"; color="0e8a16"; description="Ready for review"},
    @{name="blocked"; color="d93f0b"; description="Blocked by other issues"},
    
    # Security Related
    @{name="security"; color="d73a4a"; description="Security related issues"},
    @{name="vulnerability"; color="b60205"; description="Security vulnerability"},
    
    # Script Types
    @{name="utility"; color="7057ff"; description="Utility scripts"},
    @{name="networking"; color="0e8a16"; description="Network related scripts"},
    @{name="file-management"; color="c2e0c6"; description="File management scripts"},
    
    # Special Events
    @{name="hacktoberfest"; color="ff6b35"; description="Hacktoberfest eligible"},
    
    # Technical
    @{name="dependencies"; color="0366d6"; description="Dependency related issues"},
    @{name="performance"; color="c2e0c6"; description="Performance improvements"},
    @{name="breaking change"; color="b60205"; description="Breaking changes"}
)

# Create each label
$successCount = 0
$totalCount = $labels.Count

foreach ($label in $labels) {
    try {
        gh label create $label.name --color $label.color --description $label.description --force
        Write-Host "✅ Created: $($label.name)" -ForegroundColor Green
        $successCount++
    } catch {
        Write-Host "⚠️  Warning: Could not create '$($label.name)' - may already exist" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🎉 Label setup complete!" -ForegroundColor Green
Write-Host "📊 Successfully processed $successCount/$totalCount labels" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Pro tip: Use 'gh label list' to see all your repository labels." -ForegroundColor Blue
