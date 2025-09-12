# macOS Build Guide for Scalix

This guide will help you create a macOS application (.dmg) for Scalix.

## Prerequisites

### 1. Apple Developer Account
- You need an Apple Developer account ($99/year)
- Visit: https://developer.apple.com/programs/

### 2. App-Specific Password
- Go to: https://appleid.apple.com/account/manage
- Generate an "App-Specific Password" for Electron builds
- **Important**: This is different from your Apple ID password

### 3. Team ID
- In your Apple Developer account, go to "Account" → "Membership"
- Copy your "Team ID"

### 4. macOS Development Environment
- Xcode Command Line Tools: `xcode-select --install`
- Node.js and npm installed

## Environment Setup

Create a `.env` file in the project root with:

```bash
# Apple Developer Credentials
APPLE_ID=your-apple-id@example.com
APPLE_PASSWORD=your-app-specific-password
APPLE_TEAM_ID=your-team-id
```

## Build Commands

### Build for macOS (Universal Binary - Intel + Apple Silicon)
```bash
npm run make:mac
```

### Build for Apple Silicon (M1/M2/M3) only
```bash
npm run make:mac-arm64
```

### Build for Intel Macs only
```bash
npm run make:mac-x64
```

## Output Location

The built .dmg file will be created in:
```
out/Scalix-darwin-x64/Scalix-0.21.0.dmg (Intel)
out/Scalix-darwin-arm64/Scalix-0.21.0.dmg (Apple Silicon)
```

## Code Signing and Notarization

The build process automatically:
1. **Code Signs** the app using your Apple Developer certificate
2. **Notarizes** the app with Apple (required for macOS 10.15+)
3. **Staples** the notarization ticket to the app

## Troubleshooting

### Common Issues

1. **"App cannot be opened because the developer cannot be verified"**
   - This means code signing failed
   - Check your APPLE_TEAM_ID and ensure your Apple Developer account is active

2. **Notarization fails**
   - Verify APPLE_ID and APPLE_PASSWORD are correct
   - Make sure the app-specific password is recent
   - Check Apple's developer status: https://developer.apple.com/system-status/

3. **Build fails on Windows/Linux**
   - macOS builds must be done on macOS
   - Use a Mac with Xcode installed

### Manual Code Signing (if needed)

If you need to manually sign the app:

```bash
# Sign the app
codesign --deep --force --verbose --sign "Developer ID Application: Your Name (TEAM_ID)" out/Scalix-darwin-x64/Scalix.app

# Verify signing
codesign --verify --verbose out/Scalix-darwin-x64/Scalix.app
```

## Distribution

### App Store Distribution
For App Store distribution, you'll need:
- Additional app store configuration
- App Store Connect setup
- Different build configuration

### Direct Distribution
For direct download distribution:
1. The .dmg file is ready to distribute
2. Users can double-click to install
3. The app will be installed in `/Applications`

## Security Notes

- Never commit your `.env` file to version control
- Keep your app-specific password secure
- Rotate app-specific passwords regularly
- Only share builds from trusted sources

## Testing Your Build

1. Open the .dmg file
2. Drag Scalix.app to Applications
3. Launch Scalix from Applications
4. Verify all features work correctly

## CI/CD Integration

For automated builds, set these environment variables in your CI/CD system:
- `APPLE_ID`
- `APPLE_PASSWORD`
- `APPLE_TEAM_ID`

Example GitHub Actions setup:
```yaml
- name: Build macOS App
  env:
    APPLE_ID: ${{ secrets.APPLE_ID }}
    APPLE_PASSWORD: ${{ secrets.APPLE_PASSWORD }}
    APPLE_TEAM_ID: ${{ secrets.APPLE_TEAM_ID }}
  run: npm run make:mac
```
