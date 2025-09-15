# ============================================================================
# SCALIX SYSTEM INTEGRATION TESTS
# ============================================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " SCALIX SYSTEM INTEGRATION TESTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if API server is running
Write-Host "🔍 Checking if API server is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/health" -Method GET -TimeoutSec 5
    Write-Host "✅ API server is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Scalix API server is not running on localhost:8080" -ForegroundColor Red
    Write-Host ""
    Write-Host "📋 To start the API server:" -ForegroundColor Cyan
    Write-Host "   cd scalix-cloud-api" -ForegroundColor White
    Write-Host "   npm run dev" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host ""

# Seed test data
Write-Host "🌱 Seeding test data..." -ForegroundColor Yellow
Set-Location "scalix-cloud-api"
try {
    & node test-data-seeder.js
    if ($LASTEXITCODE -ne 0) {
        throw "Test data seeding failed"
    }
    Write-Host "✅ Test data seeded successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to seed test data: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Run integration tests
Write-Host "🧪 Running integration tests..." -ForegroundColor Yellow
try {
    & node test-integration.js
    if ($LASTEXITCODE -ne 0) {
        throw "Integration tests failed"
    }
    Write-Host "✅ Integration tests completed" -ForegroundColor Green
} catch {
    Write-Host "❌ Some tests failed" -ForegroundColor Red
    Write-Host ""
    Write-Host "📖 Check TESTING_README.md for troubleshooting" -ForegroundColor Cyan
    exit 1
}

Write-Host ""
Write-Host "🎉 ALL TESTS PASSED!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Test Summary:" -ForegroundColor Cyan
Write-Host "   • 4 user accounts created (regular, pro, admin, super_admin)" -ForegroundColor White
Write-Host "   • 3 subscription plans configured" -ForegroundColor White
Write-Host "   • API keys and usage data populated" -ForegroundColor White
Write-Host "   • Data consistency verified across user roles" -ForegroundColor White
Write-Host "   • Real-time sync functionality tested" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Your Scalix system is working correctly!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Start web app: cd '../Scalix.world web'; npm run dev" -ForegroundColor White
Write-Host "   2. Start internal admin: cd '../Scalix Internal Admin'; npm run dev" -ForegroundColor White
Write-Host "   3. Test manual connections using the seeded data" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit"
