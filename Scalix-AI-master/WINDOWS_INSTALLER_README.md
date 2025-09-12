# Scalix Windows Installer Setup

## 📦 Windows Installation Package

This directory contains everything needed to create a professional Windows installer (.exe) for Scalix with an excellent user experience.

## 🎯 Features

### ✅ Professional Installation Experience
- **Administrator Installation**: Properly installs for all users
- **Desktop Shortcuts**: Automatic desktop shortcut creation
- **Start Menu Integration**: Complete Start Menu folder with app and uninstall shortcuts
- **File Associations**: Registers `scalix://` protocol for deep linking
- **Add/Remove Programs**: Full integration with Windows Add/Remove Programs
- **Automatic Updates**: Built-in Squirrel.Windows update mechanism

### ✅ User-Friendly Experience
- **Post-Installation Welcome**: Interactive welcome screen after installation
- **Comprehensive Documentation**: Detailed installation and troubleshooting guide
- **Uninstaller Included**: Professional uninstaller that cleans up everything
- **Progress Feedback**: Clear progress indicators during installation

### ✅ Developer Experience
- **Automated Build Scripts**: One-click build process for Windows installers
- **Cross-Platform Support**: Works on Windows, macOS, and Linux development machines
- **Code Signing Ready**: Configured for Windows code signing certificates
- **Environment Variables**: Support for CI/CD pipeline integration

## 🚀 Quick Start

### Build the Installer

#### Option 1: Batch Script (Windows)
```batch
# Run the automated build script
build-windows-installer.bat
```

#### Option 2: PowerShell Script (Windows)
```powershell
# Basic build
.\build-windows-installer.ps1

# Clean build with verbose output
.\build-windows-installer.ps1 -Clean -Verbose

# Skip dependency installation
.\build-windows-installer.ps1 -SkipDeps
```

#### Option 3: Manual Build (Any Platform)
```bash
# Install dependencies
npm install

# Build TypeScript
npm run ts:main

# Create Windows installer
npm run make
```

## 📁 Output Files

After successful build, you'll find these files in `out/make/squirrel.windows/x64/`:

### 📦 Primary Files
- **`Scalix-Setup-0.21.0.exe`** - Main installer executable (35-50MB)
- **`Scalix-0.21.0-full.nupkg`** - Complete application package
- **`RELEASES`** - Update information for Squirrel.Windows

### 📋 File Details
```
Scalix-Setup-0.21.0.exe    # Main installer (run this)
├── Embedded installer
├── Application files
├── Uninstaller
└── Update mechanism

Scalix-0.21.0-full.nupkg   # Application package
├── scalix.exe            # Main executable
├── resources/            # Application resources
├── locales/              # Language files
└── app/                  # Electron app files

RELEASES                  # Update manifest
└── Version and file info
```

## 🛠️ Configuration Files

### Main Configuration (`forge.config.ts`)
```typescript
new MakerSquirrel({
  name: "scalix",
  exe: "scalix.exe",
  setupExe: "Scalix-Setup-0.21.0.exe",
  setupIcon: "./assets/icon/logo.ico",
  authors: "Kiran Ravi",
  description: "Free, local, open-source AI app builder",
  // ... enhanced Windows options
})
```

### Build Scripts
- **`build-windows-installer.bat`** - Windows batch script
- **`build-windows-installer.ps1`** - PowerShell script with advanced options

### Installation Resources
- **`installer-resources/installer.nsi`** - Custom NSIS installer script
- **`installer-resources/post-install.bat`** - Post-installation script
- **`installer-resources/INSTALL_README.md`** - User installation guide

## 🔧 Environment Variables

Configure these for enhanced functionality:

### Code Signing (Production)
```bash
# Windows code signing certificate
WINDOWS_CERTIFICATE_FILE=/path/to/certificate.p12
WINDOWS_CERTIFICATE_PASSWORD=your_password

# Existing signing (if used)
SM_CODE_SIGNING_CERT_SHA1_HASH=your_cert_hash
```

### Build Configuration
```bash
# Skip E2E tests during build
E2E_TEST_BUILD=false

# Apple notarization (for macOS builds)
APPLE_ID=your_apple_id
APPLE_PASSWORD=your_app_password
APPLE_TEAM_ID=your_team_id
```

## 📋 Installation Process

### For Users
1. **Download**: `Scalix-Setup-0.21.0.exe` from releases
2. **Run**: Double-click the installer (may require administrator)
3. **Follow**: Installation wizard with progress indicators
4. **Complete**: Post-install welcome screen appears
5. **Launch**: Use desktop shortcut or Start Menu

### What Gets Installed
```
C:\Program Files\Scalix\          # Main application
├── scalix.exe                   # Main executable
├── resources\                   # App resources
├── locales\                     # Language files
└── Uninstall Scalix.exe         # Uninstaller

C:\Users\{user}\AppData\Roaming\scalix\  # User data
├── config.json                  # User settings
├── logs\                        # Application logs
└── data\                        # User data files

Desktop\                         # Shortcuts
└── Scalix.lnk

Start Menu\Programs\Scalix\       # Start Menu
├── Scalix.lnk
└── Uninstall Scalix.lnk
```

## 🔄 Updates and Auto-Updates

### How It Works
- **Squirrel.Windows**: Handles updates automatically
- **Background Updates**: Downloads in background
- **Silent Installation**: Updates install when app restarts
- **Delta Updates**: Only downloads changed files

### Update Process
1. App checks for updates on startup
2. Downloads update package in background
3. Shows notification when ready
4. Installs on next app restart
5. User data preserved automatically

## 🧪 Testing the Installer

### Test Environment
```bash
# Create a clean test environment
# Use a virtual machine or separate user account
# Test on both administrator and standard user accounts
```

### Test Checklist
- [ ] Clean installation on fresh Windows system
- [ ] Administrator vs standard user installation
- [ ] Desktop shortcut creation
- [ ] Start Menu integration
- [ ] File association registration
- [ ] Add/Remove Programs entry
- [ ] Application launches correctly
- [ ] Uninstaller works properly
- [ ] No leftover files after uninstall

### Automated Testing
```bash
# Run E2E tests (if configured)
npm run pre:e2e
npm run e2e
```

## 🚀 Distribution

### GitHub Releases
1. **Upload Files**: Upload all files from `out/make/squirrel.windows/x64/`
2. **Mark as Pre-release**: For beta versions
3. **Add Release Notes**: Describe changes and improvements
4. **Set as Latest**: For stable releases

### Download Links
```
# Direct Download
https://github.com/scalix-world/scalix/releases/download/v0.21.0/Scalix-Setup-0.21.0.exe

# Release Page
https://github.com/scalix-world/scalix/releases/tag/v0.21.0
```

### Website Integration
```html
<!-- Download button -->
<a href="https://github.com/scalix-world/scalix/releases/download/v0.21.0/Scalix-Setup-0.21.0.exe"
   class="download-btn">
  Download Scalix for Windows
</a>
```

## 🐛 Troubleshooting

### Build Issues

#### "Cannot find module" errors
```bash
# Clean and reinstall
npm run clean
npm install
```

#### Permission errors
```bash
# Run as administrator
# Or check antivirus exclusions
```

#### Code signing failures
```bash
# Verify certificate paths
# Check certificate password
# Ensure timestamp server is accessible
```

### Installation Issues

#### "Administrator rights required"
- Right-click installer → "Run as administrator"
- Or disable UAC temporarily (not recommended)

#### "Windows protected your PC"
- Click "More info" → "Run anyway"
- Expected for self-signed or unsigned executables

#### Installation fails silently
- Check Windows Event Viewer
- Disable antivirus temporarily
- Try compatibility mode

### Runtime Issues

#### App won't start after installation
```bash
# Check logs in %APPDATA%\scalix\logs\
# Verify all files were copied
# Try running as administrator
```

#### Shortcuts not created
```bash
# Check if Start Menu folder exists
# Manually create shortcuts if needed
# Verify installation completed successfully
```

## 🔒 Security Considerations

### Code Signing (Recommended for Production)
```bash
# Get Windows code signing certificate
# Configure in forge.config.ts
# Set environment variables
# Test signed builds
```

### Antivirus False Positives
- Expected for new unsigned applications
- Code signing reduces false positives
- Consider submitting to antivirus vendors

### User Data Protection
- User data stored in `%APPDATA%\scalix\`
- Automatic backup during updates
- Clean uninstall removes all data

## 📈 Performance Optimization

### Installer Size
- Current: ~35-50MB (compressed)
- Optimize by excluding unnecessary files
- Consider separate downloads for large assets

### Installation Speed
- Native dependencies pre-built
- Minimal registry operations
- Efficient file copying

### Update Efficiency
- Delta updates (only changed files)
- Background downloading
- Silent installation

## 🎉 Success Metrics

### Installation Success
- [ ] Installer downloads and runs without errors
- [ ] All shortcuts created correctly
- [ ] Application launches successfully
- [ ] File associations work
- [ ] Add/Remove Programs shows entry

### User Experience
- [ ] Clear progress indicators
- [ ] Helpful error messages
- [ ] Post-install welcome screen
- [ ] Easy uninstall process
- [ ] Automatic updates work

### Distribution Ready
- [ ] Files uploaded to GitHub releases
- [ ] Download links tested
- [ ] Release notes written
- [ ] Community notified

---

## 🚀 Ready to Distribute!

Your professional Windows installer is ready! Users will have an excellent installation experience with:

- ✅ One-click installation
- ✅ Professional installer UI
- ✅ Automatic shortcuts and integration
- ✅ Built-in uninstaller
- ✅ Automatic updates
- ✅ Comprehensive documentation

**Next Steps:**
1. Test the installer on a clean Windows system
2. Upload to GitHub releases
3. Update your website download links
4. Share with your community!

🎊 **Happy distributing!** 🎊
