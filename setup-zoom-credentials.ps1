# PowerShell Script to Setup Zoom Credentials
# Run this script to create the .env file with your Zoom credentials

$envContent = @"
# Zoom API Credentials (Server-to-Server OAuth)
ZOOM_ACCOUNT_ID=Z0tB5P9gQaOutavP1N5qqg
ZOOM_CLIENT_ID=A1E8_nqeQ0mcgJbKR8eRrQ
ZOOM_CLIENT_SECRET=dQ4W8aXw9ENrjh4U2yhRco7kto41j3Is
ZOOM_WEBHOOK_SECRET_TOKEN=pXLTKYfnRgCa4dEfapAOMg

# Backward compatibility (uses same values as above)
ZOOM_API_KEY=A1E8_nqeQ0mcgJbKR8eRrQ
ZOOM_API_SECRET=dQ4W8aXw9ENrjh4U2yhRco7kto41j3Is

# MongoDB Connection
# Replace with your actual MongoDB connection string
MONGO_URI=mongodb://localhost:27017/forum-academy

# JWT Secret for authentication
# Replace with a secure random string in production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (Optional - for notifications)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-here

# Server Configuration
PORT=5000
NODE_ENV=development

# Client URL (Frontend)
CLIENT_URL=http://localhost:3000
"@

$envPath = Join-Path $PSScriptRoot "server\.env"

Write-Host "`n🔧 Setting up Zoom credentials..." -ForegroundColor Cyan
Write-Host "📁 Creating .env file at: $envPath`n" -ForegroundColor Yellow

# Create the .env file
$envContent | Out-File -FilePath $envPath -Encoding UTF8 -NoNewline

Write-Host "✅ .env file created successfully!" -ForegroundColor Green
Write-Host "`n📋 Your Zoom credentials have been configured:" -ForegroundColor Cyan
Write-Host "   Account ID: Z0tB5P9gQaOutavP1N5qqg" -ForegroundColor White
Write-Host "   Client ID: A1E8_nqeQ0mcgJbKR8eRrQ" -ForegroundColor White
Write-Host "   Client Secret: dQ4W8aX... (configured)" -ForegroundColor White

Write-Host "`n⚠️  Important Next Steps:" -ForegroundColor Yellow
Write-Host "1. Update MONGO_URI if you're not using local MongoDB" -ForegroundColor White
Write-Host "2. Change JWT_SECRET to a secure random string" -ForegroundColor White
Write-Host "3. Configure EMAIL_USER and EMAIL_PASS if you want email notifications" -ForegroundColor White

Write-Host "`n🚀 To start the server with real Zoom:" -ForegroundColor Cyan
Write-Host "   cd server" -ForegroundColor White
Write-Host "   npm start" -ForegroundColor White

Write-Host "`n✨ Your Live Class feature will now use real Zoom meetings!" -ForegroundColor Green
Write-Host ""

