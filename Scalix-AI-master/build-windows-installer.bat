@echo off
REM Scalix Windows Installer Build Script
REM This script builds the Windows installer (.exe) for Scalix

echo.
echo ======================================
echo    Scalix Windows Installer Builder
echo ======================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is available
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not available
    echo Please reinstall Node.js
    pause
    exit /b 1
)

echo [1/4] Installing dependencies...
echo.

REM Clean and install dependencies
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/4] Building application...
echo.

REM Build the application
call npm run ts:main
if errorlevel 1 (
    echo ERROR: TypeScript compilation failed
    pause
    exit /b 1
)

echo.
echo [3/4] Creating Windows installer...
echo.

REM Create the Windows installer using Electron Forge
call npm run make
if errorlevel 1 (
    echo ERROR: Failed to create installer
    echo.
    echo Common issues:
    echo - Check if all dependencies are installed
    echo - Ensure you have write permissions
    echo - Try running as Administrator
    echo.
    pause
    exit /b 1
)

echo.
echo [4/4] Build completed successfully!
echo.
echo ======================================
echo         BUILD SUMMARY
echo ======================================
echo.

REM Check if the installer was created
if exist "out\make\squirrel.windows\x64\Scalix-Setup-0.21.0.exe" (
    echo ✅ Installer created successfully!
    echo 📁 Location: %CD%\out\make\squirrel.windows\x64\
    echo 📄 File: Scalix-Setup-0.21.0.exe
    echo 📄 File: Scalix-0.21.0-full.nupkg
    echo 📄 File: RELEASES
    echo.
    echo 🚀 Ready for distribution!
    echo.
    echo Next steps:
    echo 1. Test the installer on a clean Windows system
    echo 2. Upload to GitHub releases
    echo 3. Update download links on your website
    echo.
) else (
    echo ⚠️  Installer files not found in expected location
    echo 📁 Check: %CD%\out\make\squirrel.windows\x64\
    echo.
    echo The build may have completed but files might be in a different location.
    echo.
)

echo Press any key to exit...
pause >nul
