@echo off
echo ========================================
echo  SCALIX SYSTEM INTEGRATION TESTS
echo ========================================
echo.

echo 🔍 Checking if API server is running...
curl -s http://localhost:8080/health >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Scalix API server is not running on localhost:8080
    echo.
    echo 📋 To start the API server:
    echo    cd scalix-cloud-api
    echo    npm run dev
    echo.
    pause
    exit /b 1
)

echo ✅ API server is running
echo.

echo 🌱 Seeding test data...
cd scalix-cloud-api
node test-data-seeder.js
if %errorlevel% neq 0 (
    echo ❌ Failed to seed test data
    pause
    exit /b 1
)

echo.
echo 🧪 Running integration tests...
node test-integration.js
if %errorlevel% neq 0 (
    echo ❌ Some tests failed
    echo.
    echo 📖 Check TESTING_README.md for troubleshooting
    pause
    exit /b 1
)

echo.
echo 🎉 ALL TESTS PASSED!
echo.
echo 📊 Test Summary:
echo    • 4 user accounts created (regular, pro, admin, super_admin)
echo    • 3 subscription plans configured
echo    • API keys and usage data populated
echo    • Data consistency verified across user roles
echo    • Real-time sync functionality tested
echo.
echo 🚀 Your Scalix system is working correctly!
echo.
echo 📋 Next Steps:
echo    1. Start web app: cd "../Scalix.world web" && npm run dev
echo    2. Start internal admin: cd "../Scalix Internal Admin" && npm run dev
echo    3. Test manual connections using the seeded data
echo.

pause
