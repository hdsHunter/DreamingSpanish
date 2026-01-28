# PowerShell script to deploy to GitHub Pages
# Run this after creating a GitHub repository

Write-Host "🚀 Deploying Dreaming Spanish Stats to GitHub Pages" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the web directory
if (-not (Test-Path "index.html")) {
    Write-Host "❌ Error: Please run this script from the web/ directory" -ForegroundColor Red
    exit 1
}

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "❌ Error: Git repository not initialized. Run git init first." -ForegroundColor Red
    exit 1
}

# Get repository URL from user
$repoUrl = Read-Host "Enter your GitHub repository URL (e.g., https://github.com/username/repo-name.git)"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "❌ Error: Repository URL is required" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Adding remote repository..." -ForegroundColor Yellow
git remote add origin $repoUrl 2>$null
if ($LASTEXITCODE -ne 0) {
    git remote set-url origin $repoUrl
}

Write-Host "📤 Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Go to your repository on GitHub"
    Write-Host "2. Click Settings → Pages"
    Write-Host "3. Under 'Source', select 'Deploy from a branch'"
    Write-Host "4. Select branch: main, folder: / (root)"
    Write-Host "5. Click Save"
    Write-Host ""
    Write-Host "Your site will be available at:" -ForegroundColor Cyan
    $repoName = $repoUrl -replace '.*github.com/(.+)/(.+)\.git', '$1/$2'
    Write-Host "https://$($repoName -replace '/', '.github.io/')" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Error pushing to GitHub. Make sure:" -ForegroundColor Red
    Write-Host "  - The repository exists on GitHub"
    Write-Host "  - You have push access"
    Write-Host "  - You're authenticated (use GitHub Desktop or git credential manager)"
}
