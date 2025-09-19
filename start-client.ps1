# Forum Academy Client Starter Script
Write-Host "Starting Forum Academy Client Development Server..." -ForegroundColor Green
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow

Set-Location "C:\SchoolWebsiteProject\forum-academy\client"
Write-Host "Changed to: $(Get-Location)" -ForegroundColor Yellow

Write-Host "Running: npm start" -ForegroundColor Green
npm start

Read-Host "Press Enter to close..."
