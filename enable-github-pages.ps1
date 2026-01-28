# Script to enable GitHub Pages via GitHub API
# Requires a GitHub Personal Access Token with 'repo' and 'pages' permissions

param(
    [Parameter(Mandatory=$true)]
    [string]$Token,
    
    [Parameter(Mandatory=$false)]
    [string]$Owner = "hdsHunter",
    
    [Parameter(Mandatory=$false)]
    [string]$Repo = "DreamingSpanish"
)

Write-Host "🔧 Enabling GitHub Pages for $Owner/$Repo..." -ForegroundColor Cyan

$headers = @{
    "Authorization" = "token $Token"
    "Accept" = "application/vnd.github.v3+json"
}

$body = @{
    source = @{
        branch = "main"
        path = "/"
    }
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "https://api.github.com/repos/$Owner/$Repo/pages" `
        -Method Post `
        -Headers $headers `
        -Body $body `
        -ContentType "application/json"
    
    Write-Host "✅ GitHub Pages enabled successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your site will be available at:" -ForegroundColor Cyan
    Write-Host "https://$Owner.github.io/$Repo" -ForegroundColor Green
    Write-Host ""
    Write-Host "It may take 1-2 minutes to deploy." -ForegroundColor Yellow
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response.StatusCode -eq 422) {
        Write-Host "GitHub Pages may already be enabled. Check:" -ForegroundColor Yellow
        Write-Host "https://github.com/$Owner/$Repo/settings/pages" -ForegroundColor Cyan
    }
}
