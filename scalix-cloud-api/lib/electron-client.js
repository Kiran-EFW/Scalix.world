// ============================================================================
// ELECTRON UPDATE CLIENT
// ============================================================================
// Client library for Electron apps to handle automatic updates
// Integrates with the Scalix cloud API for update management
// ============================================================================

const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

class ElectronUpdateClient {
  constructor(options = {}) {
    this.apiUrl = options.apiUrl || 'http://localhost:8080';
    this.apiKey = options.apiKey;
    this.userId = options.userId;
    this.deviceId = options.deviceId || this.generateDeviceId();
    this.currentVersion = options.currentVersion || '1.0.0';
    this.platform = options.platform || process.platform;
    this.arch = options.arch || process.arch;
    this.autoCheck = options.autoCheck !== false;
    this.checkInterval = options.checkInterval || 3600000; // 1 hour
    this.downloadPath = options.downloadPath || path.join(require('os').tmpdir(), 'scalix-updates');

    // Update state
    this.updateInfo = null;
    this.downloadProgress = null;
    this.checkIntervalId = null;

    // Event listeners
    this.listeners = new Map();

    // Initialize
    this.initialize();
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  async initialize() {
    console.log(`🔄 Initializing Electron Update Client v${this.currentVersion}`);

    // Create download directory
    await this.ensureDownloadDirectory();

    // Start automatic update checks
    if (this.autoCheck) {
      this.startAutoCheck();
    }

    // Check for updates immediately
    await this.checkForUpdates();
  }

  async ensureDownloadDirectory() {
    try {
      await fs.mkdir(this.downloadPath, { recursive: true });
    } catch (error) {
      console.error('Failed to create download directory:', error);
    }
  }

  generateDeviceId() {
    const machineId = require('node-machine-id');
    try {
      return machineId.machineIdSync();
    } catch (error) {
      // Fallback to random ID
      return crypto.randomUUID();
    }
  }

  // ============================================================================
  // UPDATE CHECKING
  // ============================================================================

  async checkForUpdates() {
    try {
      console.log('🔍 Checking for updates...');

      const response = await fetch(`${this.apiUrl}/api/electron/check-update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.apiKey ? `Bearer ${this.apiKey}` : undefined
        },
        body: JSON.stringify({
          currentVersion: this.currentVersion,
          platform: this.platform,
          arch: this.arch,
          userId: this.userId,
          deviceId: this.deviceId
        })
      });

      if (!response.ok) {
        throw new Error(`Update check failed: ${response.status}`);
      }

      const updateInfo = await response.json();

      if (updateInfo.updateAvailable) {
        console.log(`📦 Update available: ${updateInfo.version}`);
        this.updateInfo = updateInfo;
        this.emit('update-available', updateInfo);
      } else {
        console.log('✅ No updates available');
        this.emit('no-update');
      }

      return updateInfo;

    } catch (error) {
      console.error('❌ Update check failed:', error);
      this.emit('error', error);
      return { updateAvailable: false, error: error.message };
    }
  }

  startAutoCheck() {
    console.log(`⏰ Starting automatic update checks every ${this.checkInterval / 1000 / 60} minutes`);

    this.checkIntervalId = setInterval(async () => {
      await this.checkForUpdates();
    }, this.checkInterval);
  }

  stopAutoCheck() {
    if (this.checkIntervalId) {
      clearInterval(this.checkIntervalId);
      this.checkIntervalId = null;
      console.log('⏹️ Stopped automatic update checks');
    }
  }

  // ============================================================================
  // UPDATE DOWNLOADING
  // ============================================================================

  async downloadUpdate(updateInfo = null) {
    const info = updateInfo || this.updateInfo;

    if (!info || !info.updateAvailable) {
      throw new Error('No update available to download');
    }

    try {
      console.log(`⬇️ Downloading update: ${info.version}`);

      this.emit('download-start', info);

      const response = await fetch(info.downloadUrl);

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      const contentLength = parseInt(response.headers.get('content-length'), 10);
      const fileName = `scalix-${info.version}-${this.platform}-${this.arch}`;
      const filePath = path.join(this.downloadPath, fileName);

      const fileStream = require('fs').createWriteStream(filePath);
      const reader = response.body.getReader();

      let downloaded = 0;

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        fileStream.write(value);
        downloaded += value.length;

        // Emit progress
        if (contentLength) {
          const progress = (downloaded / contentLength) * 100;
          this.emit('download-progress', {
            downloaded,
            total: contentLength,
            progress: Math.round(progress)
          });
        }
      }

      fileStream.end();

      // Verify download integrity
      await this.verifyDownload(filePath, info.fileHash);

      // Record download
      await this.recordDownload(info);

      console.log(`✅ Update downloaded: ${filePath}`);
      this.emit('download-complete', { filePath, info });

      return filePath;

    } catch (error) {
      console.error('❌ Download failed:', error);
      this.emit('download-error', error);
      throw error;
    }
  }

  async verifyDownload(filePath, expectedHash) {
    console.log('🔐 Verifying download integrity...');

    const fileBuffer = await fs.readFile(filePath);
    const actualHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    if (actualHash !== expectedHash) {
      throw new Error(`Download verification failed. Expected: ${expectedHash}, Got: ${actualHash}`);
    }

    console.log('✅ Download integrity verified');
  }

  async recordDownload(updateInfo) {
    try {
      await fetch(`${this.apiUrl}/api/electron/download-update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.apiKey ? `Bearer ${this.apiKey}` : undefined
        },
        body: JSON.stringify({
          version: updateInfo.version,
          platform: this.platform,
          arch: this.arch,
          userId: this.userId,
          deviceId: this.deviceId
        })
      });
    } catch (error) {
      console.warn('Failed to record download:', error);
    }
  }

  // ============================================================================
  // UPDATE INSTALLATION
  // ============================================================================

  async installUpdate(filePath, updateInfo = null) {
    const info = updateInfo || this.updateInfo;

    if (!info) {
      throw new Error('No update information available');
    }

    try {
      console.log(`🔧 Installing update: ${info.version}`);

      this.emit('install-start', info);

      if (this.platform === 'win32') {
        await this.installWindows(filePath, info);
      } else if (this.platform === 'darwin') {
        await this.installMacOS(filePath, info);
      } else if (this.platform === 'linux') {
        await this.installLinux(filePath, info);
      } else {
        throw new Error(`Unsupported platform: ${this.platform}`);
      }

      console.log('✅ Update installed successfully');
      this.emit('install-complete', info);

      // Clean up downloaded file
      await fs.unlink(filePath).catch(() => {});

      return true;

    } catch (error) {
      console.error('❌ Installation failed:', error);
      this.emit('install-error', error);
      throw error;
    }
  }

  async installWindows(filePath, info) {
    // For Windows, assume it's an installer executable
    const installCommand = `"${filePath}" /SILENT /NORESTART`;

    await execAsync(installCommand);
  }

  async installMacOS(filePath, info) {
    // For macOS, assume it's a .dmg or .pkg file
    if (filePath.endsWith('.dmg')) {
      // Mount DMG and install
      const mountCommand = `hdiutil attach "${filePath}"`;
      const mountResult = await execAsync(mountCommand);

      // Extract mount point
      const mountPoint = mountResult.stdout.trim().split('\n').pop().split('\t')[2];

      // Copy app to Applications
      const appName = `Scalix.app`; // Adjust based on actual app name
      const copyCommand = `cp -R "${mountPoint}/${appName}" /Applications/`;

      try {
        await execAsync(copyCommand);
      } finally {
        // Unmount DMG
        await execAsync(`hdiutil detach "${mountPoint}"`);
      }
    } else if (filePath.endsWith('.pkg')) {
      const installCommand = `installer -pkg "${filePath}" -target /`;
      await execAsync(installCommand);
    }
  }

  async installLinux(filePath, info) {
    // For Linux, assume it's a .deb or .rpm package
    if (filePath.endsWith('.deb')) {
      const installCommand = `sudo dpkg -i "${filePath}"`;
      await execAsync(installCommand);
    } else if (filePath.endsWith('.rpm')) {
      const installCommand = `sudo rpm -i "${filePath}"`;
      await execAsync(installCommand);
    } else if (filePath.endsWith('.tar.gz') || filePath.endsWith('.tar.xz')) {
      // Extract and install manually
      const extractDir = path.join(require('os').tmpdir(), 'scalix-extract');
      await fs.mkdir(extractDir, { recursive: true });

      const extractCommand = `tar -xf "${filePath}" -C "${extractDir}"`;
      await execAsync(extractCommand);

      // Copy files to installation directory
      const installDir = '/opt/scalix'; // Adjust based on your installation path
      const copyCommand = `sudo cp -R "${extractDir}"/* "${installDir}/"`;
      await execAsync(copyCommand);
    }
  }

  // ============================================================================
  // FULL UPDATE PROCESS
  // ============================================================================

  async updateNow() {
    try {
      console.log('🚀 Starting automatic update process...');

      // Check for updates
      const updateInfo = await this.checkForUpdates();

      if (!updateInfo.updateAvailable) {
        console.log('✅ No updates available');
        return false;
      }

      // Check if update is mandatory
      if (updateInfo.forceUpdate) {
        console.log('⚠️ Force update required');
      }

      // Download update
      const filePath = await this.downloadUpdate(updateInfo);

      // Install update
      await this.installUpdate(filePath, updateInfo);

      console.log('🎉 Update completed successfully!');
      return true;

    } catch (error) {
      console.error('❌ Update process failed:', error);
      this.emit('update-error', error);
      return false;
    }
  }

  // ============================================================================
  // EVENT SYSTEM
  // ============================================================================

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Event listener error for ${event}:`, error);
        }
      });
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  getCurrentVersion() {
    return this.currentVersion;
  }

  getUpdateInfo() {
    return this.updateInfo;
  }

  isUpdateAvailable() {
    return this.updateInfo && this.updateInfo.updateAvailable;
  }

  getDownloadProgress() {
    return this.downloadProgress;
  }

  // Clean up downloaded files
  async cleanup() {
    try {
      const files = await fs.readdir(this.downloadPath);
      for (const file of files) {
        const filePath = path.join(this.downloadPath, file);
        await fs.unlink(filePath);
      }
      console.log('🧹 Cleaned up downloaded files');
    } catch (error) {
      console.warn('Failed to cleanup files:', error);
    }
  }

  // Force check for updates
  async forceCheck() {
    return await this.checkForUpdates();
  }

  // Get client status
  getStatus() {
    return {
      currentVersion: this.currentVersion,
      platform: this.platform,
      arch: this.arch,
      updateAvailable: this.isUpdateAvailable(),
      updateInfo: this.updateInfo,
      autoCheckEnabled: this.autoCheck,
      downloadProgress: this.downloadProgress
    };
  }
}

// ============================================================================
// ELECTRON INTEGRATION
// ============================================================================

// For Electron main process
function createElectronUpdater(options = {}) {
  // Get Electron app information
  const electron = require('electron');
  const app = electron.app || electron.remote.app;

  const defaultOptions = {
    currentVersion: app.getVersion(),
    platform: process.platform,
    arch: process.arch,
    userId: options.userId,
    apiKey: options.apiKey,
    apiUrl: options.apiUrl
  };

  return new ElectronUpdateClient({ ...defaultOptions, ...options });
}

// ============================================================================
// AUTO-UPDATER INTEGRATION
// ============================================================================

// Integration with electron-updater
function setupElectronUpdaterIntegration(updateClient) {
  const { autoUpdater } = require('electron-updater');

  // Override electron-updater's update check
  autoUpdater.checkForUpdates = async () => {
    const updateInfo = await updateClient.checkForUpdates();

    if (updateInfo.updateAvailable) {
      return {
        updateInfo: {
          version: updateInfo.version,
          files: [{
            url: updateInfo.downloadUrl,
            sha512: updateInfo.fileHash,
            size: updateInfo.fileSize
          }]
        }
      };
    }

    return null;
  };

  return autoUpdater;
}

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

module.exports = {
  ElectronUpdateClient,
  createElectronUpdater,
  setupElectronUpdaterIntegration
};
