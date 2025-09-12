@echo off
REM Scalix.world Development Server Launcher (Batch Version)
REM This script starts all services for the Scalix ecosystem

echo.
echo ========================================================
echo   🚀 SCALIX.WORLD DEVELOPMENT LAUNCHER
echo ========================================================
echo.

set "BASE_DIR=C:\Users\kiran\Downloads\crea-AI-master"
set "WEB_DIR=%BASE_DIR%\Scalix.world web"
set "BACKEND_DIR=%BASE_DIR%\litellm-main\litellm-main"

echo 📍 Base Directory: %BASE_DIR%
echo 🌐 Web Directory: %WEB_DIR%
echo 🤖 Backend Directory: %BACKEND_DIR%
echo.

REM Check if directories exist
if not exist "%WEB_DIR%" (
    echo ❌ Web directory not found: %WEB_DIR%
    goto :error
)

if not exist "%BACKEND_DIR%" (
    echo ❌ Backend directory not found: %BACKEND_DIR%
    goto :error
)

echo ✅ All directories verified
echo.

echo 🚀 Starting Scalix.world Web Application...
echo   📁 Changing to: %WEB_DIR%

cd /d "%WEB_DIR%"

REM Check if npm is available
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm not found. Please install Node.js
    goto :error
)

REM Start Next.js server in background
echo 📡 Starting Next.js server...
start /B npm run dev > nul 2>&1

echo   ⏳ Waiting for web server to start...
timeout /t 5 /nobreak > nul

REM Test web server
echo 🔍 Testing web server...
curl -s http://localhost:3000 >nul 2>&1
if errorlevel 1 (
    echo ❌ Web server not responding
) else (
    echo ✅ Web Application: Running (http://localhost:3000)
    echo   🏢 Admin Dashboard: http://localhost:3000/admin
)

echo.
echo 🤖 Starting Backend Services...
echo   📁 Changing to: %BACKEND_DIR%

cd /d "%BACKEND_DIR%"

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found. Please install Python
    goto :error
)

REM Start Mock LiteLLM Server (Port 4000)
echo 🚀 Starting Mock LiteLLM Server (Port 4000)...
start /B python mock_litellm_server.py > nul 2>&1

echo   ⏳ Waiting for LiteLLM server to start...
timeout /t 3 /nobreak > nul

REM Test LiteLLM server
echo 🔍 Testing LiteLLM server...
curl -s http://localhost:4000/health >nul 2>&1
if errorlevel 1 (
    echo ❌ LiteLLM server not responding
) else (
    echo ✅ LiteLLM Server: Running (http://localhost:4000)
    echo   🎯 AI API Gateway: http://localhost:4000
    echo   📊 Analytics API: http://localhost:4000/v1/analytics
    echo   🤖 Chat API: http://localhost:4000/v1/chat/completions
)

REM Start Bridge Server (Port 4001)
echo 🔗 Starting Scalix Bridge Server (Port 4001)...
start /B python scalix_bridge_server.py > nul 2>&1

echo   ⏳ Waiting for bridge server to start...
timeout /t 3 /nobreak > nul

REM Test bridge server
echo 🔍 Testing bridge server...
curl -s http://localhost:4001/api/scalix/status >nul 2>&1
if errorlevel 1 (
    echo ❌ Bridge server not responding
) else (
    echo ✅ Bridge Server: Running (http://localhost:4001)
    echo   🔗 Scalix Status: http://localhost:4001/api/scalix/status
    echo   📡 Data Sync: http://localhost:4001/api/scalix/sync
)

echo.
echo ========================================================
echo   🎯 DEPLOYMENT COMPLETE
echo ========================================================
echo.
echo 🌐 Access your Scalix.world application:
echo   • Main App:        http://localhost:3000
echo   • Admin Dashboard: http://localhost:3000/admin
echo   • LiteLLM API:     http://localhost:4000
echo   • Bridge Server:   http://localhost:4001
echo.
echo 💡 Management Commands:
echo   • Check Status: curl http://localhost:3000 && curl http://localhost:4000/health && curl http://localhost:4001/api/scalix/status
echo   • Stop Services: Use Task Manager or restart command prompt
echo   • Restart: Run this script again
echo.
echo ========================================================

goto :end

:error
echo.
echo ❌ DEPLOYMENT FAILED
echo Please check the error messages above and ensure:
echo   • Node.js is installed (npm available)
echo   • Python is installed
echo   • All directories exist
echo   • Ports 3000, 4000, and 4001 are not in use
echo.
pause
exit /b 1

:end
echo.
echo 🎉 Scalix.world is now running!
echo Press any key to continue...
pause > nul
