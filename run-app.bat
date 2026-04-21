@echo off
REM ====================================
REM Music Store App - Auto Setup & Run
REM Windows Batch Script
REM ====================================

title Music Store Application - Setup & Run
color 0A

echo.
echo ╔════════════════════════════════════════╗
echo ║   🎵 Music Store App - Auto Setup      ║
echo ╚════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
echo [1/4] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo.
    echo ERROR: Node.js is not installed!
    echo.
    echo Download Node.js from: https://nodejs.org/
    echo Install it, then run this script again.
    echo.
    pause
    exit /b 1
)
echo Node.js found
echo.

REM Install server dependencies only if not already installed
echo [2/4] Checking server dependencies...
if not exist "server\node_modules" (
    echo Installing server dependencies...
    cd server
    call npm install
    if errorlevel 1 (
        color 0C
        echo ERROR: Server installation failed!
        pause
        exit /b 1
    )
    cd ..
    echo Server setup complete
) else (
    echo Server dependencies already installed, skipping...
)
echo.

REM Install client dependencies only if not already installed
echo [3/4] Checking client dependencies...
if not exist "client\node_modules" (
    echo Installing client dependencies...
    cd client
    call npm install
    if errorlevel 1 (
        color 0C
        echo ERROR: Client installation failed!
        pause
        exit /b 1
    )
    cd ..
    echo Client setup complete
) else (
    echo Client dependencies already installed, skipping...
)
echo.

color 0B
echo ╔════════════════════════════════════════╗
echo ║   Setup Complete! Starting servers...  ║
echo ╚════════════════════════════════════════╝
echo.
echo    Server: http://localhost:5000
echo    Client: http://localhost:3000
echo.
echo NOTE: Keep both windows open while using the app!
echo NOTE: The browser will open automatically when the client is ready.
echo.

REM Start server in a new window
start "Music Store - Server (Keep this open!)" cmd /k "cd server && npm start"

REM Wait for server to start before launching client
timeout /t 4 /nobreak >nul

REM Start client in a new window
REM React will open the browser automatically when ready - no need to open it manually
start "Music Store - Client (Keep this open!)" cmd /k "cd client && set REACT_APP_API_URL=http://localhost:5000 && npm start"

echo.
echo Both servers are starting...
echo The browser will open automatically in a moment.
echo.
pause
