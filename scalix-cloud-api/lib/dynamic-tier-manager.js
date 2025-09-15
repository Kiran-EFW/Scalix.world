// ============================================================================
// DYNAMIC TIER MANAGEMENT SYSTEM
// ============================================================================
// Handles global tier updates, API key management, and scalable user tiers
// Supports future tier additions and dynamic usage limit changes
// ============================================================================

const admin = require('firebase-admin');

class DynamicTierManager {
  constructor() {
    this.db = admin.firestore();
    this.cache = new Map();
    this.cacheDuration = 5 * 60 * 1000; // 5 minutes
    this.tierUpdateListeners = new Map();
  }

  // ============================================================================
  // TIER MANAGEMENT SYSTEM
  // ============================================================================

  // Get all available tiers
  async getAllTiers() {
    const cacheKey = 'all_tiers';

    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const tiersSnapshot = await this.db.collection('tiers')
        .orderBy('sortOrder', 'asc')
        .get();

      const tiers = [];
      tiersSnapshot.forEach(doc => {
        tiers.push({ id: doc.id, ...doc.data() });
      });

      this.setCache(cacheKey, tiers);
      return tiers;

    } catch (error) {
      console.error('Error fetching tiers:', error);
      // Return default tiers if database fails
      return this.getDefaultTiers();
    }
  }

  // Get specific tier by ID
  async getTier(tierId) {
    const cacheKey = `tier_${tierId}`;

    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const tierDoc = await this.db.collection('tiers').doc(tierId).get();

      if (!tierDoc.exists) {
        throw new Error(`Tier ${tierId} not found`);
      }

      const tier = { id: tierDoc.id, ...tierDoc.data() };
      this.setCache(cacheKey, tier);
      return tier;

    } catch (error) {
      console.error(`Error fetching tier ${tierId}:`, error);
      return null;
    }
  }

  // Create new tier
  async createTier(tierData) {
    try {
      const {
        id,
        name,
        displayName,
        description,
        price,
        currency = 'usd',
        sortOrder = 0,
        isActive = true,
        isDefault = false,
        features = [],
        limits = {},
        metadata = {}
      } = tierData;

      // Validate required fields
      if (!id || !name || !displayName) {
        throw new Error('Missing required fields: id, name, displayName');
      }

      const tierDoc = {
        id,
        name,
        displayName,
        description: description || '',
        price: price || 0,
        currency,
        sortOrder,
        isActive,
        isDefault,
        features,
        limits,
        metadata,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await this.db.collection('tiers').doc(id).set(tierDoc);

      // Clear cache
      this.clearTierCache();

      // Notify listeners
      this.notifyTierUpdate('create', tierDoc);

      console.log(`✅ Created new tier: ${displayName} (${id})`);
      return { id, ...tierDoc };

    } catch (error) {
      console.error('Error creating tier:', error);
      throw error;
    }
  }

  // Update existing tier
  async updateTier(tierId, updates) {
    try {
      const updateData = {
        ...updates,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await this.db.collection('tiers').doc(tierId).update(updateData);

      // Clear cache
      this.clearTierCache();

      // Get updated tier
      const updatedTier = await this.getTier(tierId);

      // Notify listeners
      this.notifyTierUpdate('update', updatedTier);

      console.log(`✅ Updated tier: ${tierId}`);
      return updatedTier;

    } catch (error) {
      console.error(`Error updating tier ${tierId}:`, error);
      throw error;
    }
  }

  // Delete tier
  async deleteTier(tierId) {
    try {
      // Check if tier is in use
      const usersUsingTier = await this.db.collection('users')
        .where('tierId', '==', tierId)
        .limit(1)
        .get();

      if (!usersUsingTier.empty) {
        throw new Error(`Cannot delete tier ${tierId}: users are currently assigned to it`);
      }

      await this.db.collection('tiers').doc(tierId).delete();

      // Clear cache
      this.clearTierCache();

      // Notify listeners
      this.notifyTierUpdate('delete', { id: tierId });

      console.log(`✅ Deleted tier: ${tierId}`);
      return true;

    } catch (error) {
      console.error(`Error deleting tier ${tierId}:`, error);
      throw error;
    }
  }

  // ============================================================================
  // USER TIER MANAGEMENT
  // ============================================================================

  // Update user tier
  async updateUserTier(userId, newTierId, options = {}) {
    try {
      const { notifyUser = true, updateApiKey = true } = options;

      // Get user and new tier info
      const [userDoc, newTier] = await Promise.all([
        this.db.collection('users').doc(userId).get(),
        this.getTier(newTierId)
      ]);

      if (!userDoc.exists) {
        throw new Error(`User ${userId} not found`);
      }

      if (!newTier) {
        throw new Error(`Tier ${newTierId} not found`);
      }

      const userData = userDoc.data();
      const oldTierId = userData.tierId;

      // Update user tier
      const updateData = {
        tierId: newTierId,
        tierName: newTier.name,
        tierLimits: newTier.limits,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await this.db.collection('users').doc(userId).update(updateData);

      // Update API key if requested
      if (updateApiKey) {
        await this.updateApiKeyForTier(userId, newTier);
      }

      // Log tier change
      await this.logTierChange(userId, oldTierId, newTierId, 'admin_update');

      // Notify user if requested
      if (notifyUser) {
        await this.notifyUserOfTierChange(userId, oldTierId, newTierId, newTier);
      }

      // Notify tier update listeners
      this.notifyTierUpdate('user_tier_changed', {
        userId,
        oldTierId,
        newTierId,
        newTier
      });

      console.log(`✅ Updated user ${userId} from tier ${oldTierId} to ${newTierId}`);
      return { success: true, oldTierId, newTierId };

    } catch (error) {
      console.error(`Error updating user tier for ${userId}:`, error);
      throw error;
    }
  }

  // Bulk update user tiers
  async bulkUpdateUserTiers(updates, options = {}) {
    try {
      const { notifyUsers = true, updateApiKeys = true } = options;

      console.log(`🔄 Starting bulk tier update for ${updates.length} users`);

      const results = [];
      const batch = this.db.batch();

      for (const update of updates) {
        const { userId, newTierId } = update;

        // Get new tier info
        const newTier = await this.getTier(newTierId);
        if (!newTier) {
          results.push({ userId, success: false, error: `Tier ${newTierId} not found` });
          continue;
        }

        // Get current user data
        const userRef = this.db.collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
          results.push({ userId, success: false, error: 'User not found' });
          continue;
        }

        const userData = userDoc.data();
        const oldTierId = userData.tierId;

        // Prepare update
        const updateData = {
          tierId: newTierId,
          tierName: newTier.name,
          tierLimits: newTier.limits,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        batch.update(userRef, updateData);

        results.push({ userId, success: true, oldTierId, newTierId });

        // Log tier change
        await this.logTierChange(userId, oldTierId, newTierId, 'bulk_update');
      }

      // Commit batch
      await batch.commit();

      // Update API keys if requested
      if (updateApiKeys) {
        for (const result of results) {
          if (result.success) {
            try {
              const newTier = await this.getTier(result.newTierId);
              await this.updateApiKeyForTier(result.userId, newTier);
            } catch (error) {
              console.error(`Failed to update API key for user ${result.userId}:`, error);
            }
          }
        }
      }

      // Notify users if requested
      if (notifyUsers) {
        for (const result of results) {
          if (result.success) {
            try {
              const newTier = await this.getTier(result.newTierId);
              await this.notifyUserOfTierChange(result.userId, result.oldTierId, result.newTierId, newTier);
            } catch (error) {
              console.error(`Failed to notify user ${result.userId}:`, error);
            }
          }
        }
      }

      // Clear cache
      this.clearTierCache();

      console.log(`✅ Bulk tier update completed: ${results.filter(r => r.success).length}/${results.length} successful`);
      return results;

    } catch (error) {
      console.error('Error in bulk tier update:', error);
      throw error;
    }
  }

  // ============================================================================
  // API KEY MANAGEMENT
  // ============================================================================

  // Update API key when tier changes
  async updateApiKeyForTier(userId, newTier) {
    try {
      // Get user's active API key
      const apiKeyQuery = await this.db.collection('apiKeys')
        .where('userId', '==', userId)
        .where('isActive', '==', true)
        .limit(1)
        .get();

      if (apiKeyQuery.empty) {
        console.log(`No active API key found for user ${userId}, skipping update`);
        return;
      }

      const apiKeyDoc = apiKeyQuery.docs[0];
      const apiKeyRef = apiKeyDoc.ref;

      // Update API key with new tier limits and features
      const updateData = {
        tierId: newTier.id,
        tierName: newTier.name,
        limits: newTier.limits,
        features: newTier.features,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await apiKeyRef.update(updateData);

      console.log(`✅ Updated API key for user ${userId} to tier ${newTier.displayName}`);

      // Notify user of API key update
      await this.notifyUserOfApiKeyUpdate(userId, newTier);

    } catch (error) {
      console.error(`Error updating API key for user ${userId}:`, error);
      throw error;
    }
  }

  // ============================================================================
  // USAGE LIMIT MANAGEMENT
  // ============================================================================

  // Update usage limits for a tier
  async updateTierLimits(tierId, newLimits) {
    try {
      const updateData = {
        limits: newLimits,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await this.db.collection('tiers').doc(tierId).update(updateData);

      // Update all users with this tier
      const usersWithTier = await this.db.collection('users')
        .where('tierId', '==', tierId)
        .get();

      const batch = this.db.batch();

      usersWithTier.forEach(doc => {
        batch.update(doc.ref, {
          tierLimits: newLimits,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });

      await batch.commit();

      // Update API keys for all affected users
      for (const doc of usersWithTier.docs) {
        const userId = doc.id;
        const tier = await this.getTier(tierId);
        await this.updateApiKeyForTier(userId, { ...tier, limits: newLimits });
      }

      // Clear cache
      this.clearTierCache();

      // Notify all affected users
      await this.notifyUsersOfLimitChange(usersWithTier.docs.map(doc => doc.id), newLimits);

      console.log(`✅ Updated limits for tier ${tierId} and ${usersWithTier.size} users`);
      return { updatedUsers: usersWithTier.size, newLimits };

    } catch (error) {
      console.error(`Error updating tier limits for ${tierId}:`, error);
      throw error;
    }
  }

  // ============================================================================
  // NOTIFICATION SYSTEM
  // ============================================================================

  // Notify user of tier change
  async notifyUserOfTierChange(userId, oldTierId, newTierId, newTier) {
    try {
      const oldTier = await this.getTier(oldTierId);
      const notification = {
        title: 'Tier Updated',
        message: `Your account has been updated from ${oldTier?.displayName || 'previous tier'} to ${newTier.displayName}`,
        type: 'success',
        priority: 'high',
        category: 'billing',
        targetUsers: [userId],
        actions: [
          {
            id: 'view_features',
            label: 'View New Features',
            type: 'primary',
            url: '/features'
          }
        ],
        metadata: {
          oldTierId,
          newTierId,
          tierChange: true
        }
      };

      // This would integrate with the global notification system
      console.log(`📢 Notifying user ${userId} of tier change to ${newTier.displayName}`);

    } catch (error) {
      console.error(`Error notifying user ${userId} of tier change:`, error);
    }
  }

  // Notify user of API key update
  async notifyUserOfApiKeyUpdate(userId, newTier) {
    try {
      const notification = {
        title: 'API Access Updated',
        message: `Your API access has been updated for ${newTier.displayName} tier`,
        type: 'info',
        priority: 'medium',
        category: 'system',
        targetUsers: [userId],
        metadata: {
          apiKeyUpdate: true,
          tierId: newTier.id
        }
      };

      console.log(`📢 Notifying user ${userId} of API key update for ${newTier.displayName}`);

    } catch (error) {
      console.error(`Error notifying user ${userId} of API key update:`, error);
    }
  }

  // Notify users of limit changes
  async notifyUsersOfLimitChange(userIds, newLimits) {
    try {
      const notification = {
        title: 'Usage Limits Updated',
        message: 'Your usage limits have been updated. Check your dashboard for details.',
        type: 'info',
        priority: 'medium',
        category: 'system',
        targetUsers: userIds,
        actions: [
          {
            id: 'view_limits',
            label: 'View Limits',
            type: 'primary',
            url: '/dashboard'
          }
        ],
        metadata: {
          limitUpdate: true,
          newLimits
        }
      };

      console.log(`📢 Notifying ${userIds.length} users of limit changes`);

    } catch (error) {
      console.error('Error notifying users of limit changes:', error);
    }
  }

  // ============================================================================
  // ANALYTICS & REPORTING
  // ============================================================================

  // Get tier analytics
  async getTierAnalytics() {
    try {
      const tiers = await this.getAllTiers();
      const analytics = {};

      for (const tier of tiers) {
        // Count users in this tier
        const userCount = await this.db.collection('users')
          .where('tierId', '==', tier.id)
          .count()
          .get();

        // Get usage statistics for this tier
        const usageStats = await this.getTierUsageStats(tier.id);

        analytics[tier.id] = {
          tier: tier.displayName,
          userCount: userCount.data().count,
          usageStats,
          revenue: tier.price * userCount.data().count
        };
      }

      return analytics;

    } catch (error) {
      console.error('Error getting tier analytics:', error);
      return {};
    }
  }

  // Get usage statistics for a tier
  async getTierUsageStats(tierId) {
    try {
      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setHours(0, 0, 0, 0);

      const usageQuery = await this.db.collection('usageAggregates')
        .where('tierId', '==', tierId)
        .where('period', '==', 'month')
        .where('periodStart', '>=', currentMonth)
        .get();

      const stats = {};
      usageQuery.forEach(doc => {
        const data = doc.data();
        stats[data.metric] = (stats[data.metric] || 0) + data.total;
      });

      return stats;

    } catch (error) {
      console.error(`Error getting usage stats for tier ${tierId}:`, error);
      return {};
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  // Get default tiers (fallback)
  getDefaultTiers() {
    return [
      {
        id: 'starter',
        name: 'starter',
        displayName: 'Starter',
        description: 'Perfect for getting started',
        price: 0,
        currency: 'usd',
        sortOrder: 0,
        isActive: true,
        isDefault: true,
        features: ['basic_ai', 'basic_chat'],
        limits: {
          aiTokens: 10000,
          apiCalls: 100,
          storage: 536870912, // 512MB
          teamMembers: 1
        }
      },
      {
        id: 'pro',
        name: 'pro',
        displayName: 'Pro',
        description: 'Advanced features for growing teams',
        price: 2900, // $29
        currency: 'usd',
        sortOrder: 1,
        isActive: true,
        features: ['advanced_ai', 'team_collaboration', 'priority_support'],
        limits: {
          aiTokens: 100000,
          apiCalls: 1000,
          storage: 5368709120, // 5GB
          teamMembers: 5
        }
      },
      {
        id: 'max',
        name: 'max',
        displayName: 'Max',
        description: 'Maximum power for serious users',
        price: 9900, // $99
        currency: 'usd',
        sortOrder: 2,
        isActive: true,
        features: ['advanced_ai', 'unlimited_projects', 'enterprise_support'],
        limits: {
          aiTokens: 500000,
          apiCalls: 5000,
          storage: 10737418240, // 10GB
          teamMembers: 25
        }
      },
      {
        id: 'enterprise',
        name: 'enterprise',
        displayName: 'Enterprise',
        description: 'Complete solution for large organizations',
        price: 29900, // $299
        currency: 'usd',
        sortOrder: 3,
        isActive: true,
        features: ['advanced_ai', 'enterprise_sso', 'dedicated_support'],
        limits: {
          aiTokens: 2000000,
          apiCalls: 50000,
          storage: 107374182400, // 100GB
          teamMembers: 100
        }
      }
    ];
  }

  // Cache management
  isCacheValid(cacheKey) {
    const cached = this.cache.get(cacheKey);
    if (!cached) return false;

    const age = Date.now() - cached.timestamp;
    return age < this.cacheDuration;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clearTierCache() {
    for (const [key] of this.cache.entries()) {
      if (key.startsWith('tier_') || key === 'all_tiers') {
        this.cache.delete(key);
      }
    }
  }

  // Event listeners for tier updates
  onTierUpdate(callback) {
    const id = Date.now() + Math.random();
    this.tierUpdateListeners.set(id, callback);
    return () => this.tierUpdateListeners.delete(id);
  }

  notifyTierUpdate(event, data) {
    this.tierUpdateListeners.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Tier update listener error:', error);
      }
    });
  }

  // Logging
  async logTierChange(userId, oldTierId, newTierId, reason) {
    await this.db.collection('tierChangeLogs').add({
      userId,
      oldTierId,
      newTierId,
      reason,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  // ============================================================================
  // HEALTH & MONITORING
  // ============================================================================

  // Get tier statistics for health endpoint
  async getTierStats() {
    try {
      const cacheKey = 'tier_stats';
      const now = Date.now();

      // Return cached stats if less than 1 minute old
      if (this.isCacheValid(cacheKey) && (now - this.cache.get(cacheKey).timestamp) < 60000) {
        return this.cache.get(cacheKey).data;
      }

      // Get all tiers
      const tiers = await this.getAllTiers();
      const totalTiers = tiers.length;
      const activeTiers = tiers.filter(t => t.isActive).length;

      // Get user distribution
      const tierDistribution = {};
      let totalUsers = 0;

      for (const tier of tiers) {
        try {
          const userCount = await this.db.collection('users')
            .where('tierId', '==', tier.id)
            .count()
            .get();

          tierDistribution[tier.id] = {
            displayName: tier.displayName,
            userCount: userCount.data().count,
            isActive: tier.isActive,
            price: tier.price
          };

          totalUsers += userCount.data().count;
        } catch (error) {
          console.error(`Error getting user count for tier ${tier.id}:`, error);
          tierDistribution[tier.id] = {
            displayName: tier.displayName,
            userCount: 0,
            isActive: tier.isActive,
            price: tier.price
          };
        }
      }

      const stats = {
        totalTiers,
        activeTiers,
        totalUsers,
        tierDistribution,
        lastTierUpdate: new Date().toISOString(),
        cacheStatus: 'active'
      };

      // Cache the stats
      this.setCache(cacheKey, stats);

      return stats;

    } catch (error) {
      console.error('Error getting tier stats:', error);
      return {
        totalTiers: 0,
        activeTiers: 0,
        totalUsers: 0,
        tierDistribution: {},
        lastTierUpdate: null,
        cacheStatus: 'error',
        error: error.message
      };
    }
  }

  // Get detailed tier analytics
  async getDetailedAnalytics() {
    try {
      const basicStats = await this.getTierStats();
      const tiers = await this.getAllTiers();

      const analytics = {
        ...basicStats,
        tierPerformance: {},
        revenue: {},
        utilization: {}
      };

      for (const tier of tiers) {
        // Get usage stats for this tier
        const usageStats = await this.getTierUsageStats(tier.id);

        // Calculate revenue
        const userCount = basicStats.tierDistribution[tier.id]?.userCount || 0;
        const revenue = (tier.price * userCount) / 100; // Convert cents to dollars

        analytics.tierPerformance[tier.id] = {
          tier: tier.displayName,
          userCount,
          usageStats,
          revenue,
          limits: tier.limits,
          features: tier.features.length
        };
      }

      return analytics;

    } catch (error) {
      console.error('Error getting detailed analytics:', error);
      return basicStats;
    }
  }
}

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

const tierManager = new DynamicTierManager();

module.exports = {
  DynamicTierManager,
  tierManager
};
