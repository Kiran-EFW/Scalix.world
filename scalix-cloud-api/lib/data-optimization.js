// ============================================================================
// DATA OPTIMIZATION SYSTEM
// ============================================================================
// Smart caching, selective synchronization, and API optimization
// Reduces infrastructure burden while maintaining data consistency
// ============================================================================

const admin = require('firebase-admin');

class DataOptimizationManager {
  constructor() {
    this.db = admin.firestore();
    this.cache = new Map();
    this.apiCallTracker = new Map();
    this.optimizationRules = new Map();
    this.cacheDuration = {
      static: 30 * 60 * 1000,    // 30 minutes for plans, features
      user: 15 * 60 * 1000,      // 15 minutes for user data
      dynamic: 5 * 60 * 1000,    // 5 minutes for usage, stats
      realtime: 60 * 1000        // 1 minute for real-time data
    };
  }

  // ============================================================================
  // SELECTIVE DATA SYNCHRONIZATION
  // ============================================================================

  // Get optimized data for Electron app
  async getOptimizedElectronData(userId, application = 'electron') {
    console.log(`🔄 Getting optimized data for Electron user: ${userId}`);

    const context = {
      userId,
      application,
      timestamp: new Date(),
      capabilities: await this.getDeviceCapabilities(userId)
    };

    // Get data based on optimization rules
    const optimizedData = {
      user: await this.getOptimizedUserData(userId),
      plans: await this.getCachedPlans(),
      usage: await this.getOptimizedUsageData(userId),
      notifications: await this.getOptimizedNotifications(userId),
      settings: await this.getOptimizedSettings(userId),
      features: await this.getOptimizedFeatures(userId)
    };

    // Apply data compression and filtering
    const compressedData = await this.compressData(optimizedData, context);

    // Track data transfer
    await this.trackDataTransfer(userId, compressedData);

    return {
      data: compressedData,
      metadata: {
        timestamp: new Date(),
        version: await this.getDataVersion(),
        compressionRatio: this.calculateCompressionRatio(optimizedData, compressedData),
        nextSync: this.calculateNextSyncTime(context)
      }
    };
  }

  // Get optimized user data (only essential fields)
  async getOptimizedUserData(userId) {
    const cacheKey = `user_${userId}`;

    // Check cache first
    if (this.isCacheValid(cacheKey, 'user')) {
      return this.cache.get(cacheKey);
    }

    const userDoc = await this.db.collection('users').doc(userId).get();
    if (!userDoc.exists) return null;

    const userData = userDoc.data();

    // Filter to essential fields only
    const optimizedUser = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      plan: userData.plan,
      role: userData.role,
      // Exclude sensitive data like full profile, payment info
      avatar: userData.avatar,
      createdAt: userData.createdAt,
      lastLoginAt: userData.lastLoginAt
    };

    // Cache the result
    this.setCache(cacheKey, optimizedUser, 'user');

    return optimizedUser;
  }

  // Get cached plans (rarely changes)
  async getCachedPlans() {
    const cacheKey = 'plans_public';

    if (this.isCacheValid(cacheKey, 'static')) {
      return this.cache.get(cacheKey);
    }

    const plansQuery = await this.db.collection('plans')
      .where('isActive', '==', true)
      .where('isPublic', '==', true)
      .get();

    const plans = plansQuery.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      displayName: doc.data().displayName,
      price: doc.data().price,
      currency: doc.data().currency,
      features: doc.data().features?.slice(0, 5) // Limit features
    }));

    this.setCache(cacheKey, plans, 'static');
    return plans;
  }

  // Get optimized usage data (aggregated, not detailed)
  async getOptimizedUsageData(userId) {
    const cacheKey = `usage_${userId}`;

    if (this.isCacheValid(cacheKey, 'dynamic')) {
      return this.cache.get(cacheKey);
    }

    // Get current month usage summary only
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const usageQuery = await this.db.collection('usageAggregates')
      .where('userId', '==', userId)
      .where('period', '==', 'month')
      .where('periodStart', '>=', currentMonth)
      .get();

    const usageSummary = {};
    usageQuery.forEach(doc => {
      const data = doc.data();
      usageSummary[data.metric] = data.total;
    });

    // Get plan limits for comparison
    const userData = await this.getOptimizedUserData(userId);
    const planLimits = await this.getPlanLimits(userData?.plan || 'free');

    const optimizedUsage = {
      currentMonth: usageSummary,
      limits: planLimits,
      utilization: this.calculateUtilization(usageSummary, planLimits),
      lastUpdated: new Date()
    };

    this.setCache(cacheKey, optimizedUsage, 'dynamic');
    return optimizedUsage;
  }

  // Get optimized notifications (recent and unread only)
  async getOptimizedNotifications(userId) {
    const notificationsQuery = await this.db.collection('userNotifications')
      .where('userId', '==', userId)
      .where('read', '==', false)
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();

    return notificationsQuery.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        message: data.message,
        type: data.type,
        priority: data.priority,
        createdAt: data.createdAt,
        actions: data.actions?.slice(0, 2) // Limit actions
      };
    });
  }

  // Get optimized settings (app-specific only)
  async getOptimizedSettings(userId) {
    const settingsQuery = await this.db.collection('userSettings')
      .where('userId', '==', userId)
      .where('application', '==', 'electron')
      .limit(1)
      .get();

    if (settingsQuery.empty) {
      return this.getDefaultElectronSettings();
    }

    const settings = settingsQuery.docs[0].data();

    // Return only Electron-relevant settings
    return {
      theme: settings.theme,
      notifications: settings.notifications,
      autoUpdate: settings.autoUpdate,
      dataSync: settings.dataSync,
      cacheSize: settings.cacheSize
    };
  }

  // Get optimized features (enabled features only)
  async getOptimizedFeatures(userId) {
    const userData = await this.getOptimizedUserData(userId);
    if (!userData) return [];

    const plan = userData.plan || 'free';

    // Return features that are actually enabled for the user's plan
    const features = {
      free: ['basic_ai', 'basic_chat', 'basic_storage'],
      pro: ['advanced_ai_models', 'team_collaboration', 'priority_support', 'unlimited_projects'],
      enterprise: ['advanced_ai_models', 'team_collaboration', 'priority_support', 'unlimited_projects', 'enterprise_sso']
    };

    return features[plan] || features.free;
  }

  // ============================================================================
  // API CALL OPTIMIZATION
  // ============================================================================

  // Track API calls and implement smart batching
  async trackApiCall(userId, endpoint, method, responseTime, success) {
    const callKey = `${userId}_${endpoint}_${method}`;
    const now = Date.now();

    // Track call frequency
    if (!this.apiCallTracker.has(callKey)) {
      this.apiCallTracker.set(callKey, {
        count: 0,
        lastCall: 0,
        responseTimes: []
      });
    }

    const callData = this.apiCallTracker.get(callKey);
    callData.count++;
    callData.lastCall = now;
    callData.responseTimes.push(responseTime);

    // Keep only last 10 response times
    if (callData.responseTimes.length > 10) {
      callData.responseTimes.shift();
    }

    // Store in database for analysis (throttled)
    if (callData.count % 10 === 0) {
      await this.db.collection('apiCallAnalytics').add({
        userId,
        endpoint,
        method,
        callCount: callData.count,
        avgResponseTime: callData.responseTimes.reduce((a, b) => a + b, 0) / callData.responseTimes.length,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  }

  // Check if API call should be throttled
  shouldThrottleApiCall(userId, endpoint, method) {
    const callKey = `${userId}_${endpoint}_${method}`;
    const callData = this.apiCallTracker.get(callKey);

    if (!callData) return false;

    const now = Date.now();
    const timeSinceLastCall = now - callData.lastCall;

    // Throttle based on endpoint
    const throttleRules = {
      '/api/usage': 30000,    // 30 seconds for usage calls
      '/api/chat': 5000,      // 5 seconds for chat
      '/api/user': 60000,     // 1 minute for user data
      default: 10000          // 10 seconds default
    };

    const throttleTime = throttleRules[endpoint] || throttleRules.default;
    return timeSinceLastCall < throttleTime;
  }

  // Implement smart caching for API responses
  async getCachedApiResponse(endpoint, params, userId) {
    const cacheKey = `api_${endpoint}_${JSON.stringify(params)}_${userId}`;
    const cached = this.cache.get(cacheKey);

    if (cached && this.isCacheValid(cacheKey, 'dynamic')) {
      return cached.data;
    }

    return null;
  }

  async setCachedApiResponse(endpoint, params, data, userId) {
    const cacheKey = `api_${endpoint}_${JSON.stringify(params)}_${userId}`;
    this.setCache(cacheKey, data, 'dynamic');
  }

  // ============================================================================
  // DATA COMPRESSION & OPTIMIZATION
  // ============================================================================

  // Compress data for Electron app
  async compressData(data, context) {
    const { capabilities } = context;

    // Remove unnecessary fields based on device capabilities
    const compressed = { ...data };

    // If device has limited storage, reduce data size
    if (capabilities.storageLimit < 100) { // Less than 100MB
      compressed.usage = this.compressUsageData(compressed.usage);
      compressed.notifications = compressed.notifications.slice(0, 5);
    }

    // If device has slow connection, prioritize essential data
    if (capabilities.connectionSpeed === 'slow') {
      compressed.plans = compressed.plans.slice(0, 3);
      compressed.features = compressed.features.slice(0, 10);
    }

    return compressed;
  }

  compressUsageData(usageData) {
    if (!usageData) return usageData;

    // Keep only essential metrics
    return {
      currentMonth: {
        ai_tokens: usageData.currentMonth?.ai_tokens || 0,
        api_calls: usageData.currentMonth?.api_calls || 0
      },
      limits: {
        maxAiTokens: usageData.limits?.maxAiTokens || 0,
        maxApiCalls: usageData.limits?.maxApiCalls || 0
      },
      utilization: {
        ai_tokens: usageData.utilization?.ai_tokens || 0,
        api_calls: usageData.utilization?.api_calls || 0
      },
      lastUpdated: usageData.lastUpdated
    };
  }

  // Calculate compression ratio
  calculateCompressionRatio(original, compressed) {
    const originalSize = JSON.stringify(original).length;
    const compressedSize = JSON.stringify(compressed).length;
    return ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
  }

  // ============================================================================
  // DEVICE CAPABILITIES & ADAPTIVE OPTIMIZATION
  // ============================================================================

  async getDeviceCapabilities(userId) {
    // Get device info from recent sessions
    const deviceQuery = await this.db.collection('sessions')
      .where('userId', '==', userId)
      .orderBy('startedAt', 'desc')
      .limit(1)
      .get();

    if (deviceQuery.empty) {
      return this.getDefaultCapabilities();
    }

    const deviceData = deviceQuery.docs[0].data();

    return {
      platform: deviceData.deviceInfo?.platform || 'unknown',
      storageLimit: this.estimateStorageLimit(deviceData.deviceInfo),
      connectionSpeed: this.estimateConnectionSpeed(deviceData),
      memoryLimit: this.estimateMemoryLimit(deviceData.deviceInfo),
      batteryLevel: deviceData.deviceInfo?.batteryLevel || 100
    };
  }

  getDefaultCapabilities() {
    return {
      platform: 'unknown',
      storageLimit: 1000, // 1GB default
      connectionSpeed: 'normal',
      memoryLimit: 1000, // 1GB default
      batteryLevel: 100
    };
  }

  estimateStorageLimit(deviceInfo) {
    // Estimate based on device type
    const platform = deviceInfo?.platform || 'unknown';
    const estimates = {
      'win32': 50000,   // 50GB for desktop
      'darwin': 25000,  // 25GB for macOS
      'linux': 10000,   // 10GB for Linux
      'unknown': 1000   // 1GB default
    };
    return estimates[platform] || estimates.unknown;
  }

  estimateConnectionSpeed(sessionData) {
    // Estimate based on response times and location
    const avgResponseTime = sessionData.avgResponseTime || 500;

    if (avgResponseTime < 100) return 'fast';
    if (avgResponseTime < 500) return 'normal';
    return 'slow';
  }

  estimateMemoryLimit(deviceInfo) {
    // Estimate based on device type
    const platform = deviceInfo?.platform || 'unknown';
    const estimates = {
      'win32': 8000,   // 8GB for desktop
      'darwin': 4000,  // 4GB for macOS
      'linux': 2000,   // 2GB for Linux
      'unknown': 1000  // 1GB default
    };
    return estimates[platform] || estimates.unknown;
  }

  // ============================================================================
  // CACHE MANAGEMENT
  // ============================================================================

  isCacheValid(cacheKey, cacheType) {
    const cached = this.cache.get(cacheKey);
    if (!cached) return false;

    const age = Date.now() - cached.timestamp;
    const maxAge = this.cacheDuration[cacheType] || this.cacheDuration.dynamic;

    return age < maxAge;
  }

  setCache(cacheKey, data, cacheType) {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      type: cacheType
    });
  }

  clearUserCache(userId) {
    for (const [key, value] of this.cache.entries()) {
      if (key.includes(userId)) {
        this.cache.delete(key);
      }
    }
  }

  getCacheStats() {
    const stats = {
      totalEntries: this.cache.size,
      byType: {},
      totalSize: 0
    };

    for (const [key, value] of this.cache.entries()) {
      const type = value.type || 'unknown';
      stats.byType[type] = (stats.byType[type] || 0) + 1;
      stats.totalSize += JSON.stringify(value.data).length;
    }

    return stats;
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  calculateUtilization(currentMonth, limits) {
    const utilization = {};
    Object.keys(limits).forEach(key => {
      if (typeof limits[key] === 'number' && limits[key] > 0) {
        utilization[key] = Math.round((currentMonth[key] || 0) / limits[key] * 100);
      }
    });
    return utilization;
  }

  async getPlanLimits(plan) {
    const cacheKey = `plan_limits_${plan}`;
    if (this.isCacheValid(cacheKey, 'static')) {
      return this.cache.get(cacheKey);
    }

    // Default limits (would be fetched from database)
    const defaultLimits = {
      free: { maxAiTokens: 50000, maxApiCalls: 500 },
      pro: { maxAiTokens: 500000, maxApiCalls: 5000 },
      enterprise: { maxAiTokens: 2000000, maxApiCalls: 50000 }
    };

    const limits = defaultLimits[plan] || defaultLimits.free;
    this.setCache(cacheKey, limits, 'static');
    return limits;
  }

  getDefaultElectronSettings() {
    return {
      theme: 'system',
      notifications: {
        enabled: true,
        sound: true,
        desktop: true
      },
      autoUpdate: true,
      dataSync: {
        enabled: true,
        interval: 300000, // 5 minutes
        onWifiOnly: false
      },
      cacheSize: 100 // MB
    };
  }

  calculateNextSyncTime(context) {
    const { capabilities } = context;
    const baseInterval = 300000; // 5 minutes

    // Adjust based on capabilities
    let multiplier = 1;

    if (capabilities.connectionSpeed === 'slow') multiplier *= 2;
    if (capabilities.batteryLevel < 20) multiplier *= 3;
    if (capabilities.storageLimit < 1000) multiplier *= 2;

    return new Date(Date.now() + (baseInterval * multiplier));
  }

  async getDataVersion() {
    // Simple version based on current timestamp
    // In production, this would be a proper versioning system
    return Math.floor(Date.now() / 1000000); // Change every ~1000 seconds
  }

  async trackDataTransfer(userId, data) {
    const dataSize = JSON.stringify(data).length;

    await this.db.collection('dataTransferAnalytics').add({
      userId,
      application: 'electron',
      dataSize,
      compressedSize: dataSize, // Would be different if actually compressed
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
  }
}

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

const optimizationManager = new DataOptimizationManager();

module.exports = {
  DataOptimizationManager,
  optimizationManager
};
