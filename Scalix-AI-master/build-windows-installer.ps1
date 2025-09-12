# Scalix Windows Installer Build Script (PowerShell)
# This script builds the Windows installer (.exe) for Scalix

param(
    [switch]$Clean,
    [switch]$SkipDeps,
    [switch]$Verbose
)

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "   Scalix Windows Installer Builder" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Function to write colored output
function Write-Step {
    param([string]$Message)
    Write-Host "[STEP] $Message" -ForegroundColor Yellow
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

# Check prerequisites
Write-Step "Checking prerequisites..."

try {
    $nodeVersion = & node --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Node.js is not installed or not in PATH"
        Write-Host "Please install Node.js from https://nodejs.org/"
        exit 1
    }
    Write-Success "Node.js found: $nodeVersion"
} catch {
    Write-Error "Node.js check failed"
    exit 1
}

try {
    $npmVersion = & npm --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Error "npm is not available"
        exit 1
    }
    Write-Success "npm found: v$npmVersion"
} catch {
    Write-Error "npm check failed"
    exit 1
}

# Clean if requested
if ($Clean) {
    Write-Step "Cleaning project..."
    if (Test-Path "node_modules") {
        Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
        Write-Success "Removed node_modules"
    }
    if (Test-Path "out") {
        Remove-Item -Recurse -Force "out" -ErrorAction SilentlyContinue
        Write-Success "Removed out directory"
    }
    if (Test-Path "package-lock.json") {
        Remove-Item "package-lock.json" -ErrorAction SilentlyContinue
        Write-Success "Removed package-lock.json"
    }
}

# Install dependencies
if (-not $SkipDeps) {
    Write-Step "Installing dependencies..."
    try {
        if ($Verbose) {
            & npm install
        } else {
            & npm install 2>$null
        }
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to install dependencies"
            exit 1
        }
        Write-Success "Dependencies installed"
    } catch {
        Write-Error "Failed to install dependencies: $($_.Exception.Message)"
        exit 1
    }
} else {
    Write-Step "Skipping dependency installation"
}

# Build application
Write-Step "Building application..."
try {
    if ($Verbose) {
        & npm run ts:main
    } else {
        & npm run ts:main 2>$null
    }
    if ($LASTEXITCODE -ne 0) {
        Write-Error "TypeScript compilation failed"
        exit 1
    }
    Write-Success "TypeScript compilation completed"
} catch {
    Write-Error "Build failed: $($_.Exception.Message)"
    exit 1
}

# Create Windows installer
Write-Step "Creating Windows installer..."
try {
    if ($Verbose) {
        & npm run make
    } else {
        & npm run make 2>$null
    }
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to create installer"
        Write-Host ""
        Write-Host "Common issues:" -ForegroundColor Yellow
        Write-Host "- Check if all dependencies are installed" -ForegroundColor Yellow
        Write-Host "- Ensure you have write permissions" -ForegroundColor Yellow
        Write-Host "- Try running as Administrator" -ForegroundColor Yellow
        Write-Host "- Check for antivirus interference" -ForegroundColor Yellow
        exit 1
    }
    Write-Success "Windows installer created"
} catch {
    Write-Error "Installer creation failed: $($_.Exception.Message)"
    exit 1
}

# Check results
Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "         BUILD SUMMARY" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$installerPath = "out\make\squirrel.windows\x64\Scalix-Setup-0.21.0.exe"
$nupkgPath = "out\make\squirrel.windows\x64\Scalix-0.21.0-full.nupkg"
$releasesPath = "out\make\squirrel.windows\x64\RELEASES"

if (Test-Path $installerPath) {
    Write-Success "Installer created successfully!"
    Write-Host "📁 Location: $(Resolve-Path "out\make\squirrel.windows\x64\")" -ForegroundColor Blue
    Write-Host "📄 File: Scalix-Setup-0.21.0.exe" -ForegroundColor Blue
    Write-Host "📄 File: Scalix-0.21.0-full.nupkg" -ForegroundColor Blue
    Write-Host "📄 File: RELEASES" -ForegroundColor Blue
    Write-Host ""
    Write-Host "🚀 Ready for distribution!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Test the installer on a clean Windows system" -ForegroundColor Yellow
    Write-Host "2. Upload to GitHub releases" -ForegroundColor Yellow
    Write-Host "3. Update download links on your website" -ForegroundColor Yellow
} else {
    Write-Host "⚠️  Installer files not found in expected location" -ForegroundColor Yellow
    Write-Host "📁 Check: $(Resolve-Path "out\make\squirrel.windows\x64\")" -ForegroundColor Blue
    Write-Host ""
    Write-Host "The build may have completed but files might be in a different location." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Build completed successfully!" -ForegroundColor Green
