@echo off
echo 🛑 Stopping Scalix Servers...
echo =================================

REM Stop all Node.js processes
taskkill /f /im node.exe >nul 2>&1

if errorlevel 1 (
    echo ✅ No Node.js processes found running
) else (
    echo ✅ All Node.js processes stopped
)

echo.
echo 🎉 Server shutdown completed!
echo =================================
pause
