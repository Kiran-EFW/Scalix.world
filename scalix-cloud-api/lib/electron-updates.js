// ============================================================================
// ELECTRON REMOTE UPDATE SYSTEM
// ============================================================================
// Handles automatic updates for Electron applications
// Provides version management, update distribution, and rollback capabilities
// ============================================================================

const admin = require('firebase-admin');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

class ElectronUpdateManager {
  constructor() {
    this.db = admin.firestore();
    this.bucket = admin.storage().bucket();
    this.updateCache = new Map();
    this.cacheDuration = 10 * 60 * 1000; // 10 minutes
  }

  // ============================================================================
  // UPDATE PUBLISHING
  // ============================================================================

  // Publish a new update
  async publishUpdate(updateData) {
    const {
      version,
      platform,
      arch,
      filePath,
      releaseNotes,
      minimumVersion,
      forceUpdate = false,
      rolloutPercentage = 100
    } = updateData;

    console.log(`📦 Publishing Electron update: ${version} for ${platform}-${arch}`);

    try {
      // Validate update file
      const stats = await fs.stat(filePath);
      const fileSize = stats.size;
      const fileHash = await this.calculateFileHash(filePath);

      // Upload to cloud storage
      const fileName = `updates/${platform}/${arch}/${version}/${path.basename(filePath)}`;
      const file = this.bucket.file(fileName);

      await this.bucket.upload(filePath, {
        destination: fileName,
        metadata: {
          metadata: {
            version,
            platform,
            arch,
            fileSize: fileSize.toString(),
            fileHash,
            uploadedAt: new Date().toISOString()
          }
        }
      });

      // Make file publicly accessible
      await file.makePublic();

      // Get download URL
      const [downloadUrl] = await file.getSignedUrl({
        action: 'read',
        expires: '2030-01-01' // Long expiry for updates
      });

      // Store update metadata in Firestore
      const updateDoc = {
        version,
        platform,
        arch,
        downloadUrl,
        fileSize,
        fileHash,
        releaseNotes: releaseNotes || '',
        minimumVersion: minimumVersion || '0.0.0',
        forceUpdate,
        rolloutPercentage,
        status: 'active',
        downloadCount: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        publishedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      const docRef = await this.db.collection('electronUpdates').add(updateDoc);

      // Update latest version pointer
      await this.updateLatestVersion(platform, arch, version);

      console.log(`✅ Update published: ${version} (${docRef.id})`);
      return {
        id: docRef.id,
        ...updateDoc,
        downloadUrl
      };

    } catch (error) {
      console.error('❌ Failed to publish update:', error);
      throw error;
    }
  }

  // Update latest version pointer
  async updateLatestVersion(platform, arch, version) {
    const latestRef = this.db.collection('electronUpdates')
      .doc(`latest_${platform}_${arch}`);

    await latestRef.set({
      version,
      platform,
      arch,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  }

  // ============================================================================
  // UPDATE CHECKING
  // ============================================================================

  // Check for updates (called by Electron app)
  async checkForUpdates(clientInfo) {
    const {
      currentVersion,
      platform,
      arch,
      userId,
      deviceId
    } = clientInfo;

    console.log(`🔍 Checking updates for: ${platform}-${arch} v${currentVersion}`);

    try {
      // Get latest version for platform/arch
      const latestRef = this.db.collection('electronUpdates')
        .doc(`latest_${platform}_${arch}`);

      const latestDoc = await latestRef.get();

      if (!latestDoc.exists) {
        return { updateAvailable: false };
      }

      const latestVersion = latestDoc.data().version;

      // Compare versions
      if (this.isVersionNewer(latestVersion, currentVersion)) {
        // Get update details
        const updateQuery = await this.db.collection('electronUpdates')
          .where('version', '==', latestVersion)
          .where('platform', '==', platform)
          .where('arch', '==', arch)
          .where('status', '==', 'active')
          .limit(1)
          .get();

        if (!updateQuery.empty) {
          const updateDoc = updateQuery.docs[0];
          const updateData = updateDoc.data();

          // Check rollout percentage
          if (this.shouldRolloutToUser(updateData.rolloutPercentage, userId)) {
            // Record update check
            await this.recordUpdateCheck(userId, deviceId, {
              currentVersion,
              targetVersion: latestVersion,
              platform,
              arch
            });

            return {
              updateAvailable: true,
              version: latestVersion,
              downloadUrl: updateData.downloadUrl,
              fileSize: updateData.fileSize,
              fileHash: updateData.fileHash,
              releaseNotes: updateData.releaseNotes,
              forceUpdate: updateData.forceUpdate,
              minimumVersion: updateData.minimumVersion
            };
          }
        }
      }

      return { updateAvailable: false };

    } catch (error) {
      console.error('❌ Update check failed:', error);
      return { updateAvailable: false, error: error.message };
    }
  }

  // Record update download
  async recordUpdateDownload(userId, deviceId, version, platform, arch) {
    await this.db.collection('electronUpdateDownloads').add({
      userId,
      deviceId,
      version,
      platform,
      arch,
      downloadedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Increment download count
    const updateQuery = await this.db.collection('electronUpdates')
      .where('version', '==', version)
      .where('platform', '==', platform)
      .where('arch', '==', arch)
      .limit(1)
      .get();

    if (!updateQuery.empty) {
      const updateRef = updateQuery.docs[0].ref;
      await updateRef.update({
        downloadCount: admin.firestore.FieldValue.increment(1)
      });
    }
  }

  // ============================================================================
  // VERSION MANAGEMENT
  // ============================================================================

  // Compare version strings
  isVersionNewer(latestVersion, currentVersion) {
    const latest = latestVersion.split('.').map(Number);
    const current = currentVersion.split('.').map(Number);

    for (let i = 0; i < Math.max(latest.length, current.length); i++) {
      const latestPart = latest[i] || 0;
      const currentPart = current[i] || 0;

      if (latestPart > currentPart) return true;
      if (latestPart < currentPart) return false;
    }

    return false;
  }

  // Check if update should rollout to user (A/B testing)
  shouldRolloutToUser(rolloutPercentage, userId) {
    if (rolloutPercentage >= 100) return true;
    if (rolloutPercentage <= 0) return false;

    // Use user ID for consistent rollout
    const hash = crypto.createHash('md5').update(userId).digest('hex');
    const userRollout = parseInt(hash.substring(0, 8), 16) % 100;

    return userRollout < rolloutPercentage;
  }

  // Calculate file hash for integrity checking
  async calculateFileHash(filePath) {
    const fileBuffer = await fs.readFile(filePath);
    return crypto.createHash('sha256').update(fileBuffer).digest('hex');
  }

  // ============================================================================
  // ADMIN MANAGEMENT
  // ============================================================================

  // Get update statistics
  async getUpdateStats() {
    const stats = {
      totalUpdates: 0,
      totalDownloads: 0,
      platformStats: {},
      recentUpdates: []
    };

    // Count total updates
    const updatesSnapshot = await this.db.collection('electronUpdates').get();
    stats.totalUpdates = updatesSnapshot.size;

    // Count downloads
    const downloadsSnapshot = await this.db.collection('electronUpdateDownloads').get();
    stats.totalDownloads = downloadsSnapshot.size;

    // Platform statistics
    const platformStats = {};
    updatesSnapshot.forEach(doc => {
      const data = doc.data();
      const key = `${data.platform}-${data.arch}`;

      if (!platformStats[key]) {
        platformStats[key] = {
          updates: 0,
          downloads: 0,
          latestVersion: '0.0.0'
        };
      }

      platformStats[key].updates++;
      if (this.isVersionNewer(data.version, platformStats[key].latestVersion)) {
        platformStats[key].latestVersion = data.version;
      }
    });

    stats.platformStats = platformStats;

    // Recent updates
    const recentUpdatesQuery = await this.db.collection('electronUpdates')
      .orderBy('publishedAt', 'desc')
      .limit(10)
      .get();

    stats.recentUpdates = recentUpdatesQuery.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return stats;
  }

  // Rollback update
  async rollbackUpdate(version, platform, arch) {
    console.log(`🔄 Rolling back update: ${version} for ${platform}-${arch}`);

    // Mark update as rolled back
    const updateQuery = await this.db.collection('electronUpdates')
      .where('version', '==', version)
      .where('platform', '==', platform)
      .where('arch', '==', arch)
      .limit(1)
      .get();

    if (!updateQuery.empty) {
      const updateRef = updateQuery.docs[0].ref;
      await updateRef.update({
        status: 'rolled_back',
        rolledBackAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Update latest version to previous version
      const previousUpdateQuery = await this.db.collection('electronUpdates')
        .where('platform', '==', platform)
        .where('arch', '==', arch)
        .where('status', '==', 'active')
        .orderBy('version', 'desc')
        .limit(1)
        .get();

      if (!previousUpdateQuery.empty) {
        const previousVersion = previousUpdateQuery.docs[0].data().version;
        await this.updateLatestVersion(platform, arch, previousVersion);
      }

      console.log(`✅ Update rolled back: ${version}`);
      return true;
    }

    return false;
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  async recordUpdateCheck(userId, deviceId, updateInfo) {
    await this.db.collection('electronUpdateChecks').add({
      userId,
      deviceId,
      ...updateInfo,
      checkedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  // Clean up old update files (optional)
  async cleanupOldUpdates(keepVersions = 5) {
    console.log('🧹 Cleaning up old update files...');

    const platforms = ['win32', 'darwin', 'linux'];
    const arches = ['x64', 'arm64', 'ia32'];

    for (const platform of platforms) {
      for (const arch of arches) {
        const updatesQuery = await this.db.collection('electronUpdates')
          .where('platform', '==', platform)
          .where('arch', '==', arch)
          .where('status', '==', 'active')
          .orderBy('publishedAt', 'desc')
          .get();

        if (updatesQuery.size > keepVersions) {
          // Mark older updates as archived
          const updatesToArchive = updatesQuery.docs.slice(keepVersions);

          for (const doc of updatesToArchive) {
            await doc.ref.update({
              status: 'archived',
              archivedAt: admin.firestore.FieldValue.serverTimestamp()
            });
          }

          console.log(`   Archived ${updatesToArchive.length} old updates for ${platform}-${arch}`);
        }
      }
    }
  }
}

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

const updateManager = new ElectronUpdateManager();

module.exports = {
  ElectronUpdateManager,
  updateManager
};
