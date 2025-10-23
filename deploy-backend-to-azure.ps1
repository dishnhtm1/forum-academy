# Azure Backend Deployment Script
# This script deploys the server folder to Azure Web App

Write-Host "🚀 Azure Backend Deployment Script" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Check if Azure CLI is installed
Write-Host "📋 Checking Azure CLI..." -ForegroundColor Yellow
try {
    $azVersion = az --version 2>&1 | Select-String "azure-cli" | Out-String
    Write-Host "✅ Azure CLI is installed" -ForegroundColor Green
    Write-Host $azVersion -ForegroundColor Gray
} catch {
    Write-Host "❌ Azure CLI is not installed!" -ForegroundColor Red
    Write-Host "Please install: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Check if logged in
Write-Host "🔐 Checking Azure login status..." -ForegroundColor Yellow
$loginStatus = az account show 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Not logged in to Azure" -ForegroundColor Red
    Write-Host "🔓 Attempting to login..." -ForegroundColor Yellow
    az login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Login failed!" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Logged in to Azure" -ForegroundColor Green
Write-Host ""

# Configuration
$appName = "forum-backend-cnfrb6eubggucqda"
$resourceGroup = "forum-academy-rg"  # You may need to change this
$serverPath = ".\server"

Write-Host "📦 Deployment Configuration:" -ForegroundColor Cyan
Write-Host "   App Name: $appName" -ForegroundColor White
Write-Host "   Server Path: $serverPath" -ForegroundColor White
Write-Host ""

# Check if server folder exists
if (-not (Test-Path $serverPath)) {
    Write-Host "❌ Server folder not found at: $serverPath" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Server folder found" -ForegroundColor Green
Write-Host ""

# Create deployment package
Write-Host "📦 Creating deployment package..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$zipFile = "server_deploy_$timestamp.zip"

try {
    # Navigate to server directory
    Push-Location $serverPath
    
    # Install production dependencies
    Write-Host "📥 Installing production dependencies..." -ForegroundColor Yellow
    npm install --production
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ npm install failed!" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
    
    # Create zip file (excluding dev files)
    Write-Host "🗜️  Creating ZIP archive..." -ForegroundColor Yellow
    $excludeFiles = @(
        "node_modules/.cache",
        "*.log",
        ".env.local",
        "test",
        "tests"
    )
    
    # Use PowerShell Compress-Archive
    $sourceFiles = Get-ChildItem -Path . -Exclude ".git", ".gitignore", "*.md"
    Compress-Archive -Path $sourceFiles -DestinationPath "..\$zipFile" -Force
    
    Pop-Location
    
    Write-Host "✅ Deployment package created: $zipFile" -ForegroundColor Green
    Write-Host ""
    
} catch {
    Write-Host "❌ Failed to create deployment package: $_" -ForegroundColor Red
    Pop-Location
    exit 1
}

# Deploy to Azure
Write-Host "🚀 Deploying to Azure Web App..." -ForegroundColor Yellow
Write-Host "   This may take 2-5 minutes..." -ForegroundColor Gray
Write-Host ""

try {
    az webapp deployment source config-zip `
        --resource-group $resourceGroup `
        --name $appName `
        --src $zipFile
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Deployment failed!" -ForegroundColor Red
        Write-Host "Try deploying manually via Azure Portal" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host ""
    
} catch {
    Write-Host "❌ Deployment error: $_" -ForegroundColor Red
    exit 1
} finally {
    # Clean up zip file
    if (Test-Path $zipFile) {
        Remove-Item $zipFile -Force
        Write-Host "🧹 Cleaned up deployment package" -ForegroundColor Gray
    }
}

# Restart the app
Write-Host "🔄 Restarting Web App..." -ForegroundColor Yellow
try {
    az webapp restart --name $appName --resource-group $resourceGroup
    Write-Host "✅ App restarted" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not restart app automatically" -ForegroundColor Yellow
    Write-Host "Please restart manually in Azure Portal" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "✅ DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Verification
Write-Host "🔍 Verifying deployment..." -ForegroundColor Yellow
Write-Host "Waiting 10 seconds for app to start..." -ForegroundColor Gray
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "Testing health endpoint..." -ForegroundColor Yellow
try {
    $healthUrl = "https://$appName.azurewebsites.net/api/health"
    $response = Invoke-RestMethod -Uri $healthUrl -Method Get -ErrorAction Stop
    
    Write-Host "✅ Health check passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Available routes:" -ForegroundColor Cyan
    $response.routes | ForEach-Object { Write-Host "   - $_" -ForegroundColor White }
    
    # Check for zoom routes
    if ($response.routes -like "*zoom*") {
        Write-Host ""
        Write-Host "✅ Zoom routes are available!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "⚠️  Zoom routes not found in health check" -ForegroundColor Yellow
        Write-Host "Please check server logs in Azure Portal" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "⚠️  Could not verify deployment" -ForegroundColor Yellow
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check manually: https://$appName.azurewebsites.net/api/health" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Deployment process completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Test Zoom routes: https://$appName.azurewebsites.net/api/zoom/meetings" -ForegroundColor White
Write-Host "2. Check application logs in Azure Portal if issues persist" -ForegroundColor White
Write-Host "3. Verify environment variables are set correctly" -ForegroundColor White
Write-Host ""
