# PowerShell script to switch to Azure configuration
Write-Host "🌐 Switching to Azure Configuration..." -ForegroundColor Blue

# Update server .env for Azure
$serverEnvPath = "server\.env"
$serverContent = Get-Content $serverEnvPath -Raw

# Comment out local config and uncomment Azure config
$serverContent = $serverContent -replace "CLIENT_URL=http://localhost:3000", "# CLIENT_URL=http://localhost:3000"
$serverContent = $serverContent -replace "MONGO_URI=mongodb://localhost:27017/forum-academy", "# MONGO_URI=mongodb://localhost:27017/forum-academy"
$serverContent = $serverContent -replace "# CLIENT_URL=https://wonderful-meadow-0e35b381e.6.azurestaticapps.net", "CLIENT_URL=https://wonderful-meadow-0e35b381e.6.azurestaticapps.net"
$serverContent = $serverContent -replace "# MONGO_URI=mongodb\+srv://Meshaka77:Forumteam2@forumacademy-db.global.mongocluster.cosmos.azure.com/forum-academy\?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000", "MONGO_URI=mongodb+srv://Meshaka77:Forumteam2@forumacademy-db.global.mongocluster.cosmos.azure.com/forum-academy?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000"

Set-Content $serverEnvPath $serverContent

# Update client .env for Azure
$clientEnvPath = "client\.env"
$clientContent = Get-Content $clientEnvPath -Raw

# Comment out local config and uncomment Azure config
$clientContent = $clientContent -replace "REACT_APP_API_URL=http://localhost:5000", "# REACT_APP_API_URL=http://localhost:5000"
$clientContent = $clientContent -replace "# REACT_APP_API_URL=https://forum-backend-api-a7hgg9g7hmgegrh3.eastasia-01.azurewebsites.net", "REACT_APP_API_URL=https://forum-backend-api-a7hgg9g7hmgegrh3.eastasia-01.azurewebsites.net"

Set-Content $clientEnvPath $clientContent

Write-Host "✅ Successfully switched to Azure configuration!" -ForegroundColor Green
Write-Host "📝 Server will now connect to Azure Cosmos DB" -ForegroundColor Yellow
Write-Host "📝 Client will now connect to Azure Web App backend" -ForegroundColor Yellow
Write-Host ""
Write-Host "🚀 You can now run your application with Azure services" -ForegroundColor Cyan