# Scalix Windows Installation Guide

## 📦 Installation Files

The Windows installer package includes:
- `Scalix-Setup-0.21.0.exe` - Main installer executable
- `Scalix-0.21.0-full.nupkg` - Complete application package
- `RELEASES` - Update information file

## 🚀 Installation Process

### Step 1: Download
Download the `Scalix-Setup-0.21.0.exe` file from our [releases page](https://github.com/scalix-world/scalix/releases).

### Step 2: Run Installer
1. **Administrator Rights**: The installer requires administrator privileges to install system-wide.
2. **Security Warning**: Windows may show a security warning - click "Run anyway" if prompted.
3. **UAC Prompt**: Accept the User Account Control prompt to proceed.

### Step 3: Installation Wizard
1. **Welcome Screen**: Click "Next" to begin installation
2. **License Agreement**: Read and accept the MIT License
3. **Installation Location**: Choose installation directory (default: `C:\Program Files\Scalix`)
4. **Installation Options**:
   - ✅ Create desktop shortcut
   - ✅ Add to Start Menu
   - ✅ Register file associations
5. **Install**: Click "Install" to begin the installation process

### Step 4: Post-Installation
After installation completes:
- A welcome message will appear
- Desktop shortcut is created
- Start Menu entries are added
- File associations are registered
- Welcome document is created in your Documents folder

## 🎯 What Gets Installed

### Program Files
- `C:\Program Files\Scalix\` - Main application directory
  - `scalix.exe` - Main executable
  - `resources\` - Application resources
  - `locales\` - Language files

### User Data
- `%APPDATA%\scalix\` - User-specific data and settings
- `%USERPROFILE%\Documents\Scalix Welcome.txt` - Welcome document

### Shortcuts
- Desktop: `Scalix.lnk`
- Start Menu: `Scalix\` folder with application and uninstall shortcuts

### Registry Entries
- Uninstall information in Windows Add/Remove Programs
- File association for `scalix://` protocol links

## 🔧 System Requirements

### Minimum Requirements
- **OS**: Windows 10 (64-bit) or later
- **RAM**: 4 GB
- **Storage**: 500 MB free space
- **Display**: 1280x720 resolution

### Recommended Requirements
- **OS**: Windows 11 (64-bit)
- **RAM**: 8 GB or more
- **Storage**: 1 GB free space
- **Display**: 1920x1080 resolution or higher

## 🛠️ Troubleshooting

### Installation Issues

#### "Administrator rights required" error
- Right-click the installer and select "Run as administrator"
- Ensure your user account has administrator privileges

#### "Windows protected your PC" message
- Click "More info" then "Run anyway"
- This is normal for unsigned executables

#### Installation fails silently
- Check Windows Event Viewer for error details
- Ensure antivirus software is not blocking the installation
- Try running the installer in compatibility mode

### Post-Installation Issues

#### Application won't start
- Check Task Manager for any running Scalix processes
- Try running as administrator
- Check `%APPDATA%\scalix\` for log files

#### Shortcuts not created
- Check if the Start Menu folder was created: `%APPDATA%\Microsoft\Windows\Start Menu\Programs\Scalix`
- Manually create shortcuts if needed

#### File associations not working
- Restart Windows Explorer or your computer
- Check registry key: `HKEY_CLASSES_ROOT\scalix`

## 🗑️ Uninstalling Scalix

### Method 1: Windows Settings (Recommended)
1. Open Settings → Apps → Apps & features
2. Find "Scalix" in the list
3. Click "Uninstall"
4. Follow the uninstallation wizard

### Method 2: Start Menu
1. Open Start Menu → Scalix
2. Click "Uninstall Scalix"
3. Follow the uninstallation wizard

### Method 3: Manual Uninstall
1. Navigate to `C:\Program Files\Scalix\`
2. Run `Uninstall Scalix.exe`
3. Follow the uninstallation wizard

### What Gets Removed
- All program files from `C:\Program Files\Scalix\`
- Desktop and Start Menu shortcuts
- Registry entries
- File associations
- Optional: User data in `%APPDATA%\scalix\` (you'll be asked)

## 📞 Support

If you encounter any issues:

1. **Check this guide** for common solutions
2. **Review logs** in `%APPDATA%\scalix\logs\`
3. **Visit our website**: https://www.scalix.world/
4. **Open an issue**: https://github.com/scalix-world/scalix/issues
5. **Community support**: https://www.reddit.com/r/scalixbuilders/

## 🔄 Updates

Scalix includes automatic update checking. Updates are:
- Downloaded in the background
- Installed when you restart the application
- Available via the "Check for Updates" menu option

You can also manually download updates from our [releases page](https://github.com/scalix-world/scalix/releases).

---

**Installation completed successfully!** 🎉

Welcome to Scalix - your local AI app builder!
