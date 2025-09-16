#!/bin/bash

echo "🔧 Setting up Firebase for Scalix Platform"
echo "=========================================="

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Login to Firebase (optional, will prompt user)
echo "🔐 Login to Firebase (skip if already logged in)"
firebase login --no-localhost

# Initialize Firebase project
echo "📁 Initializing Firebase project..."
firebase init --project scalix-ai-platform

# Install Firebase SDKs in each application
echo "📦 Installing Firebase SDKs..."

cd "Scalix Internal Admin"
npm install firebase
cd ..

cd "Scalix.world web"
npm install firebase
cd ..

cd "scalix-cloud-api"
npm install firebase-admin
cd ..

echo "✅ Firebase setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Create a Firebase project at https://console.firebase.google.com/"
echo "2. Enable Firestore and Authentication"
echo "3. Copy your Firebase config to the applications"
echo "4. Run 'firebase emulators:start' to start local development"
echo ""
echo "🚀 To start development with emulators:"
echo "firebase emulators:start --import=./firebase-data --export-on-exit=./firebase-data"
