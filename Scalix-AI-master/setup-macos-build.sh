#!/bin/bash

# macOS Build Setup Script for Scalix
# This script helps set up the environment for building macOS apps

echo "🔧 Setting up macOS build environment for Scalix..."

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ This script must be run on macOS"
    exit 1
fi

# Check for Xcode Command Line Tools
echo "📋 Checking for Xcode Command Line Tools..."
if ! xcode-select -p &> /dev/null; then
    echo "❌ Xcode Command Line Tools not found"
    echo "🔧 Installing Xcode Command Line Tools..."
    xcode-select --install

    echo "⏳ Please complete the Xcode Command Line Tools installation, then re-run this script"
    exit 1
else
    echo "✅ Xcode Command Line Tools found"
fi

# Check for Node.js
echo "📋 Checking for Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found"
    echo "🔧 Please install Node.js from https://nodejs.org/"
    exit 1
else
    echo "✅ Node.js found: $(node --version)"
fi

# Check for npm
echo "📋 Checking for npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found"
    echo "🔧 npm should come with Node.js"
    exit 1
else
    echo "✅ npm found: $(npm --version)"
fi

# Check for .env file
echo "📋 Checking for .env file..."
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found"
    echo "🔧 Creating .env file from template..."
    cat > .env << 'EOF'
# Apple Developer Account Credentials (for macOS code signing and notarization)
# Get these from https://developer.apple.com/account/
APPLE_ID=your-apple-id@example.com
APPLE_PASSWORD=your-app-specific-password
APPLE_TEAM_ID=your-team-id

# Optional: Windows Code Signing (for Windows builds)
# WINDOWS_CERTIFICATE_FILE=path/to/certificate.pfx
# WINDOWS_CERTIFICATE_PASSWORD=your-certificate-password

# Optional: CI/CD Build Flags
# E2E_TEST_BUILD=true
EOF
    echo "✅ .env file created"
    echo "🔧 Please edit .env with your Apple Developer credentials"
else
    echo "✅ .env file found"
fi

# Install dependencies
echo "📋 Installing dependencies..."
npm install

# Test build (without code signing)
echo "📋 Testing build process..."
echo "🔧 Running: npm run package"
if npm run package; then
    echo "✅ Package creation successful"
else
    echo "❌ Package creation failed"
    exit 1
fi

echo ""
echo "🎉 macOS build environment setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env with your Apple Developer credentials"
echo "2. Run 'npm run make:mac' to build the macOS app"
echo "3. Check MACOS_BUILD_GUIDE.md for detailed instructions"
echo ""
echo "📖 For more information, see: MACOS_BUILD_GUIDE.md"
