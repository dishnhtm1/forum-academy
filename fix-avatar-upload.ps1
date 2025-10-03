# Avatar Upload Fix Script for Azure Deployment
# This script helps diagnose and fix the missing upload-avatar endpoint

Write-Host "🔧 Avatar Upload Fix Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# 1. Check if the route exists in the current codebase
Write-Host "`n1. Checking if upload-avatar route exists in authRoutes.js..." -ForegroundColor Yellow
$authRoutesPath = "server\routes\authRoutes.js"
if (Test-Path $authRoutesPath) {
    $authRoutesContent = Get-Content $authRoutesPath -Raw
    if ($authRoutesContent -match "upload-avatar") {
        Write-Host "✅ upload-avatar route found in authRoutes.js" -ForegroundColor Green
    } else {
        Write-Host "❌ upload-avatar route NOT found in authRoutes.js" -ForegroundColor Red
        Write-Host "   This needs to be added to fix the issue." -ForegroundColor Red
    }
} else {
    Write-Host "❌ authRoutes.js file not found" -ForegroundColor Red
}

# 2. Check server files
Write-Host "`n2. Checking server files..." -ForegroundColor Yellow
$serverFiles = @("server\server.js", "server\server-simple.js")
foreach ($serverFile in $serverFiles) {
    if (Test-Path $serverFile) {
        Write-Host "✅ Found: $serverFile" -ForegroundColor Green
        $content = Get-Content $serverFile -Raw
        if ($content -match "express\.static.*uploads") {
            Write-Host "   ✅ Static file serving for uploads is configured" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Static file serving for uploads is NOT configured" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Not found: $serverFile" -ForegroundColor Red
    }
}

# 3. Check package.json main entry
Write-Host "`n3. Checking package.json configuration..." -ForegroundColor Yellow
$packageJsonPath = "server\package.json"
if (Test-Path $packageJsonPath) {
    $packageJson = Get-Content $packageJsonPath | ConvertFrom-Json
    Write-Host "✅ Main entry point: $($packageJson.main)" -ForegroundColor Green
    Write-Host "✅ Start script: $($packageJson.scripts.start)" -ForegroundColor Green
} else {
    Write-Host "❌ package.json not found" -ForegroundColor Red
}

# 4. Test Azure endpoint
Write-Host "`n4. Testing Azure endpoints..." -ForegroundColor Yellow
$azureBaseUrl = "https://forum-backend-cnfrb6eubggucqda.canadacentral-01.azurewebsites.net"

try {
    $healthResponse = Invoke-WebRequest -Uri "$azureBaseUrl/api/health" -Method GET -TimeoutSec 10
    Write-Host "✅ Azure server is responding (Status: $($healthResponse.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Azure server health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $uploadResponse = Invoke-WebRequest -Uri "$azureBaseUrl/api/auth/upload-avatar" -Method OPTIONS -TimeoutSec 10
    Write-Host "✅ upload-avatar endpoint responds to OPTIONS (Status: $($uploadResponse.StatusCode))" -ForegroundColor Green
} catch {
    if ($_.Exception.Message -match "404") {
        Write-Host "❌ upload-avatar endpoint returns 404 - Route is missing on Azure" -ForegroundColor Red
    } else {
        Write-Host "❌ upload-avatar endpoint test failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 5. Recommendations
Write-Host "`n🔍 DIAGNOSIS AND RECOMMENDATIONS:" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

Write-Host "`nBased on the analysis above, here are the recommended fixes:" -ForegroundColor White

Write-Host "`n1. IMMEDIATE FIX - Update Client Code (COMPLETED):" -ForegroundColor Green
Write-Host "   ✅ Updated AdminFacultyDashboard.js to handle missing endpoint gracefully" -ForegroundColor Green

Write-Host "`n2. SERVER DEPLOYMENT FIX:" -ForegroundColor Yellow
Write-Host "   • Your Azure deployment appears to be missing the upload-avatar route" -ForegroundColor White
Write-Host "   • This could be due to:" -ForegroundColor White
Write-Host "     - Outdated code deployment" -ForegroundColor White
Write-Host "     - Wrong server file being used" -ForegroundColor White
Write-Host "     - Deployment configuration issues" -ForegroundColor White

Write-Host "`n3. RECOMMENDED ACTIONS:" -ForegroundColor Yellow
Write-Host "   a) Redeploy your server to Azure with the latest code" -ForegroundColor White
Write-Host "   b) Ensure the deployment uses the correct server.js file" -ForegroundColor White
Write-Host "   c) Verify all routes are loaded properly after deployment" -ForegroundColor White

Write-Host "`n4. TESTING:" -ForegroundColor Yellow
Write-Host "   • Test locally first: npm run dev" -ForegroundColor White
Write-Host "   • Verify the route works locally before deploying" -ForegroundColor White
Write-Host "   • After deployment, test the Azure endpoint" -ForegroundColor White

Write-Host "`n📝 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Run 'npm run dev' in the server directory to test locally" -ForegroundColor White
Write-Host "2. If local test works, redeploy to Azure" -ForegroundColor White
Write-Host "3. Test the Azure endpoint after deployment" -ForegroundColor White
Write-Host "4. The client code has been updated to handle the missing endpoint gracefully" -ForegroundColor White

Write-Host "`n✅ Script completed!" -ForegroundColor Green