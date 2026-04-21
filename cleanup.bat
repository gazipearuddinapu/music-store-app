@echo off
REM Clean and reinstall dependencies

title Music Store - Cleanup & Fresh Install
color 0A

echo.
echo ╔════════════════════════════════════════╗
echo ║   🧹 Cleaning up broken packages...    ║
echo ╚════════════════════════════════════════╝
echo.

echo [1/4] Removing old server packages...
cd server
rmdir /s /q node_modules 2>nul
del /f package-lock.json 2>nul
echo ✅ Done
cd ..

echo.
echo [2/4] Removing old client packages...
cd client
rmdir /s /q node_modules 2>nul
del /f package-lock.json 2>nul
echo ✅ Done
cd ..

echo.
echo [3/4] Installing server dependencies (clean)...
cd server
npm install
if errorlevel 1 (
    color 0C
    echo ❌ Server installation failed!
    pause
    exit /b 1
)
echo ✅ Server OK
cd ..

echo.
echo [4/4] Installing client dependencies (clean)...
cd client
npm install
if errorlevel 1 (
    color 0C
    echo ❌ Client installation failed!
    pause
    exit /b 1
)
echo ✅ Client OK
cd ..

echo.
color 0B
echo ╔════════════════════════════════════════╗
echo ║   ✅ Cleanup & Install Complete!      ║
echo ╚════════════════════════════════════════╝
echo.
echo Now run: run-app.bat
echo.
pause
