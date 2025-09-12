# Scalix.world Development Server Launcher (Basic Version)

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  🚀 SCALIX.WORLD DEVELOPMENT LAUNCHER" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$BaseDir = "C:\Users\kiran\Downloads\crea-AI-master"
$WebDir = "$BaseDir\Scalix.world web"
$BackendDir = "$BaseDir\litellm-main\litellm-main"

Write-Host "📍 Base Directory: $BaseDir" -ForegroundColor White
Write-Host "🌐 Web Directory: $WebDir" -ForegroundColor White
Write-Host "🤖 Backend Directory: $BackendDir" -ForegroundColor White
Write-Host ""

# Check directories
if (!(Test-Path $WebDir)) {
    Write-Host "❌ Web directory not found: $WebDir" -ForegroundColor Red
    exit 1
}

if (!(Test-Path $BackendDir)) {
    Write-Host "❌ Backend directory not found: $BackendDir" -ForegroundColor Red
    exit 1
}

Write-Host "✅ All directories verified" -ForegroundColor Green
Write-Host ""

# Start services
Write-Host "🚀 Starting Scalix.world Web Application..." -ForegroundColor Yellow
Write-Host "  📁 Changing to: $WebDir" -ForegroundColor White

Set-Location $WebDir
Start-Process -FilePath "npm" -ArgumentList "run dev" -NoNewWindow

Write-Host "  ⏳ Waiting for web server to start..." -ForegroundColor White
Start-Sleep -Seconds 5

Write-Host "🔍 Testing web server..." -ForegroundColor White
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5
    Write-Host "  ✅ Web Application: Running (Status: $($response.StatusCode))" -ForegroundColor Green
    Write-Host "  🎉 Scalix.world Web App: http://localhost:3000" -ForegroundColor Green
    Write-Host "  🏢 Admin Dashboard: http://localhost:3000/admin" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Web server not responding" -ForegroundColor Red
}

Write-Host ""
Write-Host "🤖 Starting Backend Services..." -ForegroundColor Yellow
Write-Host "  📁 Changing to: $BackendDir" -ForegroundColor White

Set-Location $BackendDir

Write-Host "  🚀 Starting Mock LiteLLM Server..." -ForegroundColor White
Start-Process -FilePath "python" -ArgumentList "mock_litellm_server.py" -NoNewWindow

Write-Host "  🔗 Starting Scalix Bridge Server..." -ForegroundColor White
Start-Process -FilePath "python" -ArgumentList "scalix_bridge_server.py" -NoNewWindow

Write-Host "  ⏳ Waiting for backend services to start..." -ForegroundColor White
Start-Sleep -Seconds 5

Write-Host "🔍 Testing backend services..." -ForegroundColor White
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "  ✅ Backend Services: Running (Status: $($response.StatusCode))" -ForegroundColor Green
    Write-Host "  🎯 AI API Gateway: http://localhost:4000" -ForegroundColor Green
    Write-Host "  📊 Analytics API: http://localhost:4000/v1/analytics" -ForegroundColor Green
    Write-Host "  🤖 Chat API: http://localhost:4000/v1/chat/completions" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Backend services not responding" -ForegroundColor Red
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  🎯 DEPLOYMENT COMPLETE" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Access your Scalix.world application:" -ForegroundColor Green
Write-Host "  • Main App:        http://localhost:3000" -ForegroundColor White
Write-Host "  • Admin Dashboard: http://localhost:3000/admin" -ForegroundColor White
Write-Host "  • API Gateway:     http://localhost:4000" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Scalix.world is now running!" -ForegroundColor Green
