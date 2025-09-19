# PowerShell script to check current configuration status
Write-Host "🔍 Forum Academy Configuration Status" -ForegroundColor Blue
Write-Host "=====================================" -ForegroundColor Blue
Write-Host ""

# Check server configuration
Write-Host "🖥️  SERVER CONFIGURATION:" -ForegroundColor Yellow
$serverEnvPath = "server\.env"
if (Test-Path $serverEnvPath) {
    $serverContent = Get-Content $serverEnvPath -Raw
    
    if ($serverContent -match "^CLIENT_URL=http://localhost:3000" -and $serverContent -match "^MONGO_URI=mongodb://localhost:27017") {
        Write-Host "   Status: 🏠 LOCAL MODE" -ForegroundColor Green
        Write-Host "   Database: Local MongoDB (mongodb://localhost:27017)" -ForegroundColor Gray
        Write-Host "   Client URL: http://localhost:3000" -ForegroundColor Gray
    } elseif ($serverContent -match "^CLIENT_URL=https://wonderful-meadow" -and $serverContent -match "^MONGO_URI=mongodb\+srv://") {
        Write-Host "   Status: 🌐 AZURE MODE" -ForegroundColor Cyan
        Write-Host "   Database: Azure Cosmos DB" -ForegroundColor Gray
        Write-Host "   Client URL: Azure Static Web App" -ForegroundColor Gray
    } else {
        Write-Host "   Status: ⚠️  MIXED/UNKNOWN" -ForegroundColor Red
    }
} else {
    Write-Host "   Status: ❌ .env file not found" -ForegroundColor Red
}

Write-Host ""

# Check client configuration
Write-Host "💻 CLIENT CONFIGURATION:" -ForegroundColor Yellow
$clientEnvPath = "client\.env"
if (Test-Path $clientEnvPath) {
    $clientContent = Get-Content $clientEnvPath -Raw
    
    if ($clientContent -match "^REACT_APP_API_URL=http://localhost:5000") {
        Write-Host "   Status: 🏠 LOCAL MODE" -ForegroundColor Green
        Write-Host "   API URL: http://localhost:5000" -ForegroundColor Gray
    } elseif ($clientContent -match "^REACT_APP_API_URL=https://forum-backend") {
        Write-Host "   Status: 🌐 AZURE MODE" -ForegroundColor Cyan
        Write-Host "   API URL: Azure Web App" -ForegroundColor Gray
    } else {
        Write-Host "   Status: ⚠️  MIXED/UNKNOWN" -ForegroundColor Red
    }
} else {
    Write-Host "   Status: ❌ .env file not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "📝 AVAILABLE COMMANDS:" -ForegroundColor Yellow
Write-Host "   .\switch-to-local.ps1   - Switch to local development" -ForegroundColor White
Write-Host "   .\switch-to-azure.ps1   - Switch to Azure production" -ForegroundColor White
Write-Host "   cd server; node test-db.js - Test database connection" -ForegroundColor White
Write-Host ""