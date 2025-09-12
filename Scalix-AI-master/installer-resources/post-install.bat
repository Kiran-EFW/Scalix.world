@echo off
REM Scalix Post-Installation Script
REM This script runs after installation to set up the application properly

echo.
echo ======================================
echo    Scalix Installation Complete!
echo ======================================
echo.

echo Thank you for installing Scalix!
echo.
echo Scalix has been successfully installed on your system.
echo.
echo What you can do now:
echo - Launch Scalix from the desktop shortcut
echo - Find Scalix in your Start Menu
echo - Scalix will automatically check for updates
echo.
echo For support and documentation:
echo Website: https://www.scalix.world/
echo GitHub: https://github.com/scalix-world/scalix
echo.

REM Create a welcome file
echo Welcome to Scalix! > "%USERPROFILE%\Documents\Scalix Welcome.txt"
echo. >> "%USERPROFILE%\Documents\Scalix Welcome.txt"
echo This file was created during installation. >> "%USERPROFILE%\Documents\Scalix Welcome.txt"
echo. >> "%USERPROFILE%\Documents\Scalix Welcome.txt"
echo Your Scalix application is ready to use! >> "%USERPROFILE%\Documents\Scalix Welcome.txt"
echo Visit https://www.scalix.world/ for documentation and support. >> "%USERPROFILE%\Documents\Scalix Welcome.txt"

REM Optional: Ask user if they want to launch the application
echo.
set /p choice="Would you like to launch Scalix now? (Y/N): "
if /i "%choice%"=="Y" (
    echo Launching Scalix...
    start "" "%PROGRAMFILES%\Scalix\scalix.exe"
) else (
    echo You can launch Scalix anytime from the desktop shortcut or Start Menu.
)

echo.
echo Installation completed successfully!
echo.
pause
