# Development Setup with Firebase Emulator
Write-Host "🚀 Starting Scalix Development Environment with Firebase Emulator" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan

# Check if Firebase CLI is installed
try {
    $firebaseVersion = firebase --version 2>$null
    Write-Host "✅ Firebase CLI: $firebaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Firebase CLI not found. Please run setup-firebase.ps1 first" -ForegroundColor Red
    exit 1
}

# Create data directory for emulator if it doesn't exist
if (!(Test-Path "scalix-cloud-api/firebase-data")) {
    New-Item -ItemType Directory -Path "scalix-cloud-api/firebase-data" -Force
    Write-Host "📁 Created firebase-data directory" -ForegroundColor Green
}

# Function to start Firebase emulator
function Start-FirebaseEmulator {
    Write-Host "🔥 Starting Firebase Emulator..." -ForegroundColor Yellow
    Push-Location "scalix-cloud-api"

    # Start emulator in background
    $emulatorJob = Start-Job -ScriptBlock {
        firebase emulators:start --import=./firebase-data --export-on-exit=./firebase-data
    }

    # Wait for emulator to start
    Start-Sleep -Seconds 5

    # Check if emulator is running
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:4000" -TimeoutSec 5 -ErrorAction Stop
        Write-Host "✅ Firebase Emulator UI: http://localhost:4000" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Firebase Emulator UI not accessible yet, but emulator may still be starting..." -ForegroundColor Yellow
    }

    Pop-Location
    return $emulatorJob
}

# Function to start Cloud API
function Start-CloudAPI {
    Write-Host "🌐 Starting Scalix Cloud API..." -ForegroundColor Yellow
    Push-Location "scalix-cloud-api"

    # Start API server in background
    $apiJob = Start-Job -ScriptBlock {
        npm run dev-server
    }

    # Wait for API to start
    Start-Sleep -Seconds 3

    # Check if API is running
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/health" -TimeoutSec 5 -ErrorAction Stop
        Write-Host "✅ Scalix Cloud API: http://localhost:8080" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  API not accessible yet, may still be starting..." -ForegroundColor Yellow
    }

    Pop-Location
    return $apiJob
}

# Function to start Web Application
function Start-WebApp {
    Write-Host "🌐 Starting Scalix Web Application..." -ForegroundColor Yellow
    Push-Location "Scalix.world web"

    # Start web app in background
    $webJob = Start-Job -ScriptBlock {
        npm run dev
    }

    # Wait for web app to start
    Start-Sleep -Seconds 5

    # Check if web app is running
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -ErrorAction Stop
        Write-Host "✅ Scalix Web App: http://localhost:3000" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Web app not accessible yet, may still be starting..." -ForegroundColor Yellow
    }

    Pop-Location
    return $webJob
}

# Function to start Internal Admin
function Start-InternalAdmin {
    Write-Host "⚙️  Starting Scalix Internal Admin..." -ForegroundColor Yellow
    Push-Location "Scalix Internal Admin"

    # Start admin app in background
    $adminJob = Start-Job -ScriptBlock {
        npm run dev
    }

    # Wait for admin app to start
    Start-Sleep -Seconds 5

    # Check if admin app is running
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3002" -TimeoutSec 5 -ErrorAction Stop
        Write-Host "✅ Scalix Internal Admin: http://localhost:3002" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Admin app not accessible yet, may still be starting..." -ForegroundColor Yellow
    }

    Pop-Location
    return $adminJob
}

# Start all services
Write-Host "" -ForegroundColor White
Write-Host "🔥 Starting Firebase Emulator..." -ForegroundColor Cyan
$emulatorJob = Start-FirebaseEmulator

Write-Host "" -ForegroundColor White
Write-Host "🌐 Starting Scalix Cloud API..." -ForegroundColor Cyan
$apiJob = Start-CloudAPI

Write-Host "" -ForegroundColor White
Write-Host "🌐 Starting Scalix Web Application..." -ForegroundColor Cyan
$webJob = Start-WebApp

Write-Host "" -ForegroundColor White
Write-Host "⚙️  Starting Scalix Internal Admin..." -ForegroundColor Cyan
$adminJob = Start-InternalAdmin

# Display status summary
Write-Host "" -ForegroundColor White
Write-Host "🎉 Development Environment Started!" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "🔥 Firebase Emulator UI:    http://localhost:4000" -ForegroundColor Green
Write-Host "🌐 Scalix Cloud API:        http://localhost:8080" -ForegroundColor Green
Write-Host "🌐 Scalix Web App:          http://localhost:3000" -ForegroundColor Green
Write-Host "⚙️  Scalix Internal Admin:   http://localhost:3002" -ForegroundColor Green
Write-Host "" -ForegroundColor White
Write-Host "💡 Tips:" -ForegroundColor Cyan
Write-Host "• Use Firebase Emulator UI to view data and authentication" -ForegroundColor White
Write-Host "• All services are running in the background" -ForegroundColor White
Write-Host "• Press Ctrl+C to stop all services" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "🛑 To stop all services:" -ForegroundColor Yellow
Write-Host "Get-Job | Stop-Job; Get-Job | Remove-Job" -ForegroundColor White

# Keep script running to maintain background jobs
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    # Cleanup on script exit
    Write-Host "" -ForegroundColor Yellow
    Write-Host "🛑 Stopping all services..." -ForegroundColor Yellow
    Get-Job | Stop-Job
    Get-Job | Remove-Job
    Write-Host "✅ All services stopped" -ForegroundColor Green
}
