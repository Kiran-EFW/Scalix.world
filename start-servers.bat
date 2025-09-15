@echo off
echo 🚀 Starting Scalix Servers...
echo =================================

REM Clean up unwanted files
echo 🧹 Cleaning up unwanted files...

REM Remove screenshot files
for /r %%f in (*.png *.jpg *.jpeg) do (
    echo %%f | findstr /i "screenshot layout test debug fixed verified current" >nul
    if not errorlevel 1 del "%%f" /q
)

REM Remove test files
for /r %%f in (*.js) do (
    echo %%f | findstr /i "test debug examine verify navigate layout" >nul
    if not errorlevel 1 del "%%f" /q
)

echo ✅ Cleanup completed
echo.

REM Start Cloud API Server
echo 🔧 Starting Scalix Cloud API...
start "Cloud API" cmd /c "cd scalix-cloud-api && npm run dev-server"
timeout /t 3 /nobreak >nul

REM Start External Web App
echo 🔧 Starting Scalix.world Web...
start "External Web" cmd /c "cd \"Scalix.world web\" && npm run dev"
timeout /t 2 /nobreak >nul

REM Start Internal Admin App
echo 🔧 Starting Scalix Internal Admin...
start "Internal Admin" cmd /c "cd \"Scalix Internal Admin\" && npm run dev"

echo.
echo ⏳ Waiting for servers to initialize...
timeout /t 8 /nobreak >nul

echo.
echo 🎉 Server startup completed!
echo =================================
echo 📊 Cloud API:     http://localhost:8080
echo 🌐 External Web:  http://localhost:3000
echo 🔧 Internal Admin: http://localhost:3002
echo.
echo 💡 Servers are running in separate windows
echo 💡 Close the individual server windows to stop them
echo.
pause
