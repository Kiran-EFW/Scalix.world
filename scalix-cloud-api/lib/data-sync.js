// ============================================================================
// DATA SYNCHRONIZATION SYSTEM
// ============================================================================
// This module provides data synchronization utilities for all Scalix applications
// to maintain consistency across web app, internal admin, and electron app
// ============================================================================

const admin = require('firebase-admin');
const crypto = require('crypto');

// ============================================================================
// SYNCHRONIZATION MANAGER
// ============================================================================

class DataSyncManager {
  constructor() {
    this.db = admin.firestore();
    this.syncCache = new Map();
    this.cacheDuration = 5 * 60 * 1000; // 5 minutes
  }

  // ============================================================================
  // REAL-TIME DATA SYNC
  // ============================================================================

  // Get data with real-time sync capabilities
  async getSyncedData(collection, filters = {}, options = {}) {
    const {
      userId,
      application,
      realTime = false,
      cache = true,
      maxAge = this.cacheDuration
    } = options;

    const cacheKey = this.generateCacheKey(collection, filters, userId);

    // Check cache first
    if (cache && this.syncCache.has(cacheKey)) {
      const cached = this.syncCache.get(cacheKey);
      if ((Date.now() - cached.timestamp) < maxAge) {
        return cached.data;
      }
    }

    // Fetch fresh data
    const data = await this.fetchFilteredData(collection, filters, { userId, application });

    // Cache the result
    if (cache) {
      this.syncCache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        filters,
        collection
      });
    }

    // Set up real-time listener if requested
    if (realTime) {
      this.setupRealtimeListener(collection, filters, cacheKey, { userId, application });
    }

    return data;
  }

  // Set up real-time data synchronization
  setupRealtimeListener(collection, filters, cacheKey, context) {
    let query = this.db.collection(collection);

    // Apply filters
    Object.entries(filters).forEach(([field, value]) => {
      if (value !== undefined) {
        query = query.where(field, '==', value);
      }
    });

    // Set up listener
    const unsubscribe = query.onSnapshot(
      async (snapshot) => {
        const data = [];
        snapshot.forEach(doc => {
          data.push({ id: doc.id, ...doc.data() });
        });

        // Filter data based on user context
        const filteredData = await this.filterDataForUser(data, collection, context);

        // Update cache
        this.syncCache.set(cacheKey, {
          data: filteredData,
          timestamp: Date.now(),
          filters,
          collection
        });

        // Broadcast update to connected clients
        this.broadcastUpdate(collection, filteredData, context);
      },
      (error) => {
        console.error(`Realtime sync error for ${collection}:`, error);
      }
    );

    return unsubscribe;
  }

  // ============================================================================
  // DATA FILTERING FOR USER CONTEXT
  // ============================================================================

  async filterDataForUser(data, collection, context) {
    const { userId, application } = context;

    // Get user information (in production, this would come from auth)
    const user = await this.getUserContext(userId);

    if (!user) {
      return this.getPublicData(data, collection);
    }

    // Apply role-based filtering
    switch (user.role) {
      case 'super_admin':
        return data; // Super admins see everything
      case 'admin':
        return this.filterForAdmin(data, collection, user, application);
      default:
        return this.filterForUser(data, collection, user, application);
    }
  }

  filterForAdmin(data, collection, user, application) {
    // Admins can see most data but with some restrictions
    switch (collection) {
      case 'users':
        // Admins can see all users but limited fields
        return data.map(user => ({
          id: user.id,
          email: user.email,
          name: user.name,
          plan: user.plan,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt
        }));

      case 'plans':
        return data; // Admins can see all plans

      case 'usage':
        return data; // Admins can see usage data

      default:
        return data;
    }
  }

  filterForUser(data, collection, user, application) {
    // Regular users only see their own data
    switch (collection) {
      case 'users':
        return data.filter(item => item.id === user.id);

      case 'apiKeys':
        return data.filter(item => item.userId === user.id);

      case 'usage':
        return data.filter(item => item.userId === user.id);

      case 'projects':
        return data.filter(item => item.userId === user.id);

      default:
        return data.filter(item => item.userId === user.id);
    }
  }

  getPublicData(data, collection) {
    // Public data for unauthenticated users
    switch (collection) {
      case 'plans':
        return data.filter(plan => plan.isActive && !plan.isInternal);

      default:
        return [];
    }
  }

  // ============================================================================
  // DATA SYNCHRONIZATION UTILITIES
  // ============================================================================

  // Sync data between applications
  async syncApplicationData(sourceApp, targetApp, collections = []) {
    const syncId = crypto.randomUUID();

    console.log(`🔄 Starting data sync ${syncId}: ${sourceApp} → ${targetApp}`);

    try {
      const results = {};

      for (const collection of collections) {
        const sourceData = await this.getApplicationData(sourceApp, collection);
        const targetData = await this.getApplicationData(targetApp, collection);

        // Find differences
        const differences = this.findDataDifferences(sourceData, targetData);

        if (differences.hasChanges) {
          // Apply changes
          await this.applyDataChanges(targetApp, collection, differences);

          results[collection] = {
            synced: true,
            changes: differences.changes,
            timestamp: new Date()
          };
        } else {
          results[collection] = {
            synced: false,
            message: 'No changes detected'
          };
        }
      }

      // Log sync operation
      await this.logSyncOperation(syncId, sourceApp, targetApp, results);

      console.log(`✅ Data sync ${syncId} completed successfully`);
      return { syncId, results };

    } catch (error) {
      console.error(`❌ Data sync ${syncId} failed:`, error);
      await this.logSyncError(syncId, sourceApp, targetApp, error);
      throw error;
    }
  }

  // Get data specific to an application
  async getApplicationData(application, collection) {
    const query = this.db.collection(collection)
      .where('application', '==', application);

    const snapshot = await query.get();
    const data = [];

    snapshot.forEach(doc => {
      data.push({ id: doc.id, ...doc.data() });
    });

    return data;
  }

  // Find differences between two datasets
  findDataDifferences(sourceData, targetData) {
    const sourceMap = new Map(sourceData.map(item => [item.id, item]));
    const targetMap = new Map(targetData.map(item => [item.id, item]));

    const changes = {
      added: [],
      modified: [],
      deleted: []
    };

    // Find added and modified items
    sourceMap.forEach((sourceItem, id) => {
      const targetItem = targetMap.get(id);

      if (!targetItem) {
        changes.added.push(sourceItem);
      } else if (this.hasItemChanged(sourceItem, targetItem)) {
        changes.modified.push({
          id,
          source: sourceItem,
          target: targetItem
        });
      }
    });

    // Find deleted items
    targetMap.forEach((targetItem, id) => {
      if (!sourceMap.has(id)) {
        changes.deleted.push(targetItem);
      }
    });

    return {
      hasChanges: changes.added.length > 0 || changes.modified.length > 0 || changes.deleted.length > 0,
      changes
    };
  }

  // Check if an item has changed
  hasItemChanged(sourceItem, targetItem) {
    // Compare relevant fields (exclude timestamps)
    const compareFields = Object.keys(sourceItem).filter(key =>
      !['updatedAt', 'lastModified', 'syncTimestamp'].includes(key)
    );

    for (const field of compareFields) {
      if (JSON.stringify(sourceItem[field]) !== JSON.stringify(targetItem[field])) {
        return true;
      }
    }

    return false;
  }

  // Apply data changes to target application
  async applyDataChanges(targetApp, collection, differences) {
    const batch = this.db.batch();

    // Handle additions
    differences.changes.added.forEach(item => {
      const docRef = this.db.collection(collection).doc(item.id);
      const dataToAdd = {
        ...item,
        application: targetApp,
        syncTimestamp: admin.firestore.FieldValue.serverTimestamp(),
        syncedFrom: item.application || 'unknown'
      };
      batch.set(docRef, dataToAdd);
    });

    // Handle modifications
    differences.changes.modified.forEach(change => {
      const docRef = this.db.collection(collection).doc(change.id);
      const dataToUpdate = {
        ...change.source,
        syncTimestamp: admin.firestore.FieldValue.serverTimestamp(),
        syncedFrom: change.source.application || 'unknown'
      };
      batch.set(docRef, dataToUpdate, { merge: true });
    });

    // Handle deletions
    differences.changes.deleted.forEach(item => {
      const docRef = this.db.collection(collection).doc(item.id);
      batch.update(docRef, {
        isDeleted: true,
        deletedAt: admin.firestore.FieldValue.serverTimestamp(),
        syncTimestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    await batch.commit();
  }

  // ============================================================================
  // BROADCASTING & REAL-TIME UPDATES
  // ============================================================================

  // Broadcast data updates to connected clients
  broadcastUpdate(collection, data, context) {
    // This would integrate with WebSocket or Server-Sent Events
    // For now, we'll log the update
    console.log(`📡 Broadcasting update for ${collection}: ${data.length} items`);

    // In a real implementation, this would:
    // 1. Find all connected clients for the application/context
    // 2. Send real-time updates via WebSocket/SSE
    // 3. Handle connection management and reconnection
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  generateCacheKey(collection, filters, userId) {
    const filterStr = JSON.stringify(filters);
    return crypto.createHash('md5')
      .update(`${collection}:${filterStr}:${userId || 'anonymous'}`)
      .digest('hex');
  }

  async getUserContext(userId) {
    if (!userId) return null;

    try {
      const userDoc = await this.db.collection('users').doc(userId).get();
      if (userDoc.exists) {
        return { id: userDoc.id, ...userDoc.data() };
      }
    } catch (error) {
      console.error('Error getting user context:', error);
    }

    return null;
  }

  async logSyncOperation(syncId, sourceApp, targetApp, results) {
    await this.db.collection('syncLogs').add({
      syncId,
      sourceApp,
      targetApp,
      results,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: 'completed'
    });
  }

  async logSyncError(syncId, sourceApp, targetApp, error) {
    await this.db.collection('syncLogs').add({
      syncId,
      sourceApp,
      targetApp,
      error: error.message,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: 'failed'
    });
  }

  // Clear cache for specific collection
  clearCache(collection) {
    for (const [key, value] of this.syncCache.entries()) {
      if (value.collection === collection) {
        this.syncCache.delete(key);
      }
    }
  }

  // Get cache statistics
  getCacheStats() {
    const stats = {
      totalEntries: this.syncCache.size,
      collections: {},
      totalSize: 0
    };

    for (const [key, value] of this.syncCache.entries()) {
      const collection = value.collection;
      if (!stats.collections[collection]) {
        stats.collections[collection] = 0;
      }
      stats.collections[collection]++;
      stats.totalSize += JSON.stringify(value.data).length;
    }

    return stats;
  }
}

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

// Singleton instance
const dataSyncManager = new DataSyncManager();

// Express middleware for data sync
function withDataSync(options = {}) {
  return async (req, res, next) => {
    req.dataSync = dataSyncManager;
    req.syncOptions = options;

    // Add sync utilities to response
    res.syncData = async (collection, filters) => {
      return await dataSyncManager.getSyncedData(collection, filters, {
        userId: req.user?.id,
        application: req.application,
        ...options
      });
    };

    next();
  };
}

// API endpoints for data synchronization
function setupSyncEndpoints(app) {
  // Get sync status
  app.get('/api/sync/status', async (req, res) => {
    const stats = dataSyncManager.getCacheStats();
    res.json({
      status: 'active',
      cache: stats,
      timestamp: new Date().toISOString()
    });
  });

  // Trigger manual sync
  app.post('/api/sync/trigger', async (req, res) => {
    const { sourceApp, targetApp, collections } = req.body;

    if (!sourceApp || !targetApp || !collections) {
      return res.status(400).json({
        error: 'Missing required parameters: sourceApp, targetApp, collections'
      });
    }

    try {
      const result = await dataSyncManager.syncApplicationData(
        sourceApp,
        targetApp,
        collections
      );

      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      console.error('Manual sync failed:', error);
      res.status(500).json({
        error: 'Sync failed',
        details: error.message
      });
    }
  });

  // Clear sync cache
  app.post('/api/sync/clear-cache', async (req, res) => {
    const { collection } = req.body;

    if (collection) {
      dataSyncManager.clearCache(collection);
    } else {
      // Clear all cache - would need admin permissions in production
      dataSyncManager.syncCache.clear();
    }

    res.json({ success: true, message: 'Cache cleared' });
  });
}

module.exports = {
  DataSyncManager,
  dataSyncManager,
  withDataSync,
  setupSyncEndpoints
};
