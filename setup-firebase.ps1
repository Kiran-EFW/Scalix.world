# Firebase Setup Script for Scalix Platform
Write-Host "🔧 Setting up Firebase for Scalix Platform" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Check if Firebase CLI is installed
try {
    $firebaseVersion = firebase --version 2>$null
    Write-Host "✅ Firebase CLI found: $firebaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Firebase CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g firebase-tools
}

# Change to scalix-cloud-api directory for Firebase operations
Write-Host "📁 Changing to scalix-cloud-api directory..." -ForegroundColor Yellow
Push-Location "scalix-cloud-api"

# Login to Firebase (optional, will prompt user)
Write-Host "🔐 Login to Firebase (skip if already logged in)" -ForegroundColor Yellow
firebase login --no-localhost

# Initialize Firebase project
Write-Host "📁 Initializing Firebase project..." -ForegroundColor Yellow
firebase init --project scalix-ai-platform

# Return to root directory
Pop-Location

# Install Firebase SDKs in each application
Write-Host "📦 Installing Firebase SDKs..." -ForegroundColor Yellow

Push-Location "Scalix Internal Admin"
npm install firebase
Pop-Location

Push-Location "Scalix.world web"
npm install firebase
Pop-Location

Push-Location "scalix-cloud-api"
npm install firebase-admin
Pop-Location

Write-Host "✅ Firebase setup complete!" -ForegroundColor Green
Write-Host "" -ForegroundColor White
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Create a Firebase project at https://console.firebase.google.com/" -ForegroundColor White
Write-Host "2. Enable Firestore and Authentication" -ForegroundColor White
Write-Host "3. Copy your Firebase config to the applications" -ForegroundColor White
Write-Host "4. Run the emulator from scalix-cloud-api directory:" -ForegroundColor White
Write-Host "   cd scalix-cloud-api && firebase emulators:start" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "🚀 To start development with emulators:" -ForegroundColor Green
Write-Host "cd scalix-cloud-api && firebase emulators:start --import=./firebase-data --export-on-exit=./firebase-data" -ForegroundColor White
