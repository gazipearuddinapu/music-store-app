# Music Store App - PowerShell Auto Setup & Run
# Windows PowerShell Script

Write-Host "`n" -NoNewline
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   🎵 Music Store App - Auto Setup      ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host "`n"

# Check Node.js
Write-Host "[1/4] Checking Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "❌ Node.js not found!" -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor White
    Read-Host "Press Enter to exit"
    exit
}
Write-Host "✅ Node.js $nodeVersion found" -ForegroundColor Green
Write-Host "`n"

# Install server
Write-Host "[2/4] Installing server dependencies..." -ForegroundColor Yellow
Set-Location server
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Server installation failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit
}
Set-Location ..
Write-Host "✅ Server setup complete" -ForegroundColor Green
Write-Host "`n"

# Install client
Write-Host "[3/4] Installing client dependencies..." -ForegroundColor Yellow
Set-Location client
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Client installation failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit
}
Set-Location ..
Write-Host "✅ Client setup complete" -ForegroundColor Green
Write-Host "`n"

# Success
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   ✅ Setup Complete!                   ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Green
Write-Host "`n"

Write-Host "Starting servers..." -ForegroundColor Yellow
Write-Host "🚀 Opening Server and Client..." -ForegroundColor Cyan
Write-Host "   Server: http://localhost:5000" -ForegroundColor White
Write-Host "   Client: http://localhost:3000" -ForegroundColor White
Write-Host "`n"

# Start server
Write-Host "Starting Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "cd '$PWD\server'; npm start" -WindowStyle Normal -PassThru

# Wait
Start-Sleep -Seconds 3

# Start client
Write-Host "Starting Client..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "cd '$PWD\client'; npm start" -WindowStyle Normal -PassThru

# Wait and open browser
Start-Sleep -Seconds 3
Start-Process "http://localhost:3000"

Write-Host "`n"
Write-Host "✅ Servers are starting..." -ForegroundColor Green
Write-Host "🌐 Browser will open in a moment..." -ForegroundColor Cyan
Write-Host "`n"
Write-Host "NOTE: Keep both windows open while using the app!" -ForegroundColor Yellow
Write-Host "`n"

Read-Host "Press Enter when done to close this window"
