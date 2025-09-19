# PowerShell script to switch to Local configuration
Write-Host "🏠 Switching to Local Configuration..." -ForegroundColor Blue

# Update server .env for Local
$serverEnvPath = "server\.env"
$serverContent = Get-Content $serverEnvPath -Raw

# Comment out Azure config and uncomment local config
$serverContent = $serverContent -replace "CLIENT_URL=https://wonderful-meadow-0e35b381e.6.azurestaticapps.net", "# CLIENT_URL=https://wonderful-meadow-0e35b381e.6.azurestaticapps.net"
$serverContent = $serverContent -replace "MONGO_URI=mongodb\+srv://Meshaka77:Forumteam2@forumacademy-db.global.mongocluster.cosmos.azure.com/forum-academy\?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000", "# MONGO_URI=mongodb+srv://Meshaka77:Forumteam2@forumacademy-db.global.mongocluster.cosmos.azure.com/forum-academy?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000"
$serverContent = $serverContent -replace "# CLIENT_URL=http://localhost:3000", "CLIENT_URL=http://localhost:3000"
$serverContent = $serverContent -replace "# MONGO_URI=mongodb://localhost:27017/forum-academy", "MONGO_URI=mongodb://localhost:27017/forum-academy"

Set-Content $serverEnvPath $serverContent

# Update client .env for Local
$clientEnvPath = "client\.env"
$clientContent = Get-Content $clientEnvPath -Raw

# Comment out Azure config and uncomment local config
$clientContent = $clientContent -replace "REACT_APP_API_URL=https://forum-backend-api-a7hgg9g7hmgegrh3.eastasia-01.azurewebsites.net", "# REACT_APP_API_URL=https://forum-backend-api-a7hgg9g7hmgegrh3.eastasia-01.azurewebsites.net"
$clientContent = $clientContent -replace "# REACT_APP_API_URL=http://localhost:5000", "REACT_APP_API_URL=http://localhost:5000"

Set-Content $clientEnvPath $clientContent

Write-Host "✅ Successfully switched to Local configuration!" -ForegroundColor Green
Write-Host "📝 Server will now connect to local MongoDB (mongodb://localhost:27017)" -ForegroundColor Yellow
Write-Host "📝 Client will now connect to local server (http://localhost:5000)" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  Make sure MongoDB is running locally before starting the server!" -ForegroundColor Red
Write-Host "💡 You can install MongoDB locally or use Docker: docker run -d -p 27017:27017 mongo" -ForegroundColor Cyan