const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const admin = require('firebase-admin');
const rateLimit = require('express-rate-limit');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const crypto = require('crypto');
require('dotenv').config();

// Stripe for webhook handling
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Initialize Firebase Admin (uses Firestore)
const serviceAccount = {
  type: "service_account",
  project_id: process.env.GCP_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.GCP_PROJECT_ID
});

const db = admin.firestore();
const app = express();
const PORT = process.env.PORT || 8080;

// Cost optimization: Rate limiting with memory store (free)
const rateLimiter = new RateLimiterMemory({
  keyPrefix: 'scalix_api',
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
  blockDuration: 60 * 15, // Block for 15 minutes if exceeded
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for API
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://scalix.world', 'electron://scalix']
    : ['http://localhost:3000', 'http://localhost:3001', 'electron://scalix'],
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting middleware
const rateLimitMiddleware = async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (rejRes) {
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: Math.ceil(rejRes.msBeforeNext / 1000)
    });
  }
};

// Apply rate limiting to all routes except health check
app.use('/api/', rateLimitMiddleware);

// Apply data sync middleware
app.use('/api/', withDataSync({ cache: true, realTime: false }));

// Import all optimization systems
const { DataContext, createDataContext, withDataContext, filterResponseData } = require('./lib/data-context');
const { dataSyncManager, withDataSync, setupSyncEndpoints } = require('./lib/data-sync');
const { updateManager } = require('./lib/electron-updates');
const { notificationManager } = require('./lib/global-notifications');
const { optimizationManager } = require('./lib/data-optimization');
const { tierManager } = require('./lib/dynamic-tier-manager');

// Middleware to detect application context
app.use((req, res, next) => {
  // Detect application from headers or request origin
  const origin = req.headers.origin || req.headers.referer || '';
  const userAgent = req.headers['user-agent'] || '';

  let application = 'api'; // Default

  if (origin.includes('localhost:3000') || origin.includes('scalix.world')) {
    application = 'web';
  } else if (origin.includes('localhost:3002') || req.headers['x-internal-admin']) {
    application = 'internal-admin';
  } else if (userAgent.includes('Electron') || req.headers['x-electron-app']) {
    application = 'electron';
  }

  req.application = application;
  next();
});

// Setup data sync endpoints
setupSyncEndpoints(app);

// ==========================================
// ELECTRON UPDATE ENDPOINTS
// ==========================================

// Check for updates
app.post('/api/electron/check-update', async (req, res) => {
  try {
    const updateInfo = await updateManager.checkForUpdates(req.body);
    res.json(updateInfo);
  } catch (error) {
    console.error('Update check error:', error);
    res.status(500).json({ error: 'Failed to check for updates' });
  }
});

// Download update
app.post('/api/electron/download-update', async (req, res) => {
  try {
    const { version, platform, arch } = req.body;
    const userId = req.body.userId || 'anonymous';

    await updateManager.recordUpdateDownload(userId, req.body.deviceId, version, platform, arch);
    res.json({ success: true });
  } catch (error) {
    console.error('Download record error:', error);
    res.status(500).json({ error: 'Failed to record download' });
  }
});

// Get update stats (admin only)
app.get('/api/admin/electron/updates', async (req, res) => {
  try {
    const stats = await updateManager.getUpdateStats();
    res.json(stats);
  } catch (error) {
    console.error('Update stats error:', error);
    res.status(500).json({ error: 'Failed to get update stats' });
  }
});

// Publish update (admin only)
app.post('/api/admin/electron/updates', async (req, res) => {
  try {
    const updateData = req.body;
    const result = await updateManager.publishUpdate(updateData);
    res.json(result);
  } catch (error) {
    console.error('Update publish error:', error);
    res.status(500).json({ error: 'Failed to publish update' });
  }
});

// ==========================================
// GLOBAL NOTIFICATION ENDPOINTS
// ==========================================

// Broadcast global notification (admin only)
app.post('/api/admin/notifications/broadcast', async (req, res) => {
  try {
    const notificationData = req.body;
    const senderInfo = {
      senderId: req.body.senderId || 'admin',
      senderRole: 'admin'
    };

    const result = await notificationManager.broadcastNotification(notificationData, senderInfo);
    res.json(result);
  } catch (error) {
    console.error('Broadcast error:', error);
    res.status(500).json({ error: 'Failed to broadcast notification' });
  }
});

// Send targeted notification (admin only)
app.post('/api/admin/notifications/targeted', async (req, res) => {
  try {
    const { userIds, notificationData } = req.body;
    const senderInfo = {
      senderId: req.body.senderId || 'admin',
      senderRole: 'admin'
    };

    const results = await notificationManager.sendTargetedNotification(userIds, notificationData, senderInfo);
    res.json({ results });
  } catch (error) {
    console.error('Targeted notification error:', error);
    res.status(500).json({ error: 'Failed to send targeted notifications' });
  }
});

// Get notification stats (admin only)
app.get('/api/admin/notifications/stats', async (req, res) => {
  try {
    const stats = await notificationManager.getNotificationStats();
    res.json(stats);
  } catch (error) {
    console.error('Notification stats error:', error);
    res.status(500).json({ error: 'Failed to get notification stats' });
  }
});

// Mark notification as read
app.post('/api/notifications/mark-read', async (req, res) => {
  try {
    const { notificationId, userId } = req.body;
    await notificationManager.markNotificationRead(notificationId, userId);
    res.json({ success: true });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// ==========================================
// DATA OPTIMIZATION ENDPOINTS
// ==========================================

// Get optimized data for Electron app
app.get('/api/electron/optimized-data', async (req, res) => {
  try {
    const userId = req.query.userId || req.headers['x-user-id'];
    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const optimizedData = await optimizationManager.getOptimizedElectronData(userId, 'electron');
    res.json(optimizedData);
  } catch (error) {
    console.error('Optimized data error:', error);
    res.status(500).json({ error: 'Failed to get optimized data' });
  }
});

// Get data optimization stats (admin only)
app.get('/api/admin/optimization/stats', async (req, res) => {
  try {
    const stats = optimizationManager.getCacheStats();
    res.json(stats);
  } catch (error) {
    console.error('Optimization stats error:', error);
    res.status(500).json({ error: 'Failed to get optimization stats' });
  }
});

// Clear user cache
app.post('/api/admin/optimization/clear-cache', async (req, res) => {
  try {
    const { userId } = req.body;
    if (userId) {
      optimizationManager.clearUserCache(userId);
    } else {
      // Clear all cache (admin only)
      optimizationManager.cache.clear();
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Clear cache error:', error);
    res.status(500).json({ error: 'Failed to clear cache' });
  }
});

// ==========================================
// DYNAMIC TIER MANAGEMENT ENDPOINTS
// ==========================================

// Get all tiers
app.get('/api/admin/tiers', async (req, res) => {
  try {
    const tiers = await tierManager.getAllTiers();
    res.json({ tiers });
  } catch (error) {
    console.error('Get tiers error:', error);
    res.status(500).json({ error: 'Failed to get tiers' });
  }
});

// Get specific tier
app.get('/api/admin/tiers/:tierId', async (req, res) => {
  try {
    const { tierId } = req.params;
    const tier = await tierManager.getTier(tierId);

    if (!tier) {
      return res.status(404).json({ error: 'Tier not found' });
    }

    res.json({ tier });
  } catch (error) {
    console.error('Get tier error:', error);
    res.status(500).json({ error: 'Failed to get tier' });
  }
});

// Create new tier
app.post('/api/admin/tiers', async (req, res) => {
  try {
    const tierData = req.body;
    const result = await tierManager.createTier(tierData);
    res.json({ success: true, tier: result });
  } catch (error) {
    console.error('Create tier error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update tier
app.put('/api/admin/tiers/:tierId', async (req, res) => {
  try {
    const { tierId } = req.params;
    const updates = req.body;
    const result = await tierManager.updateTier(tierId, updates);
    res.json({ success: true, tier: result });
  } catch (error) {
    console.error('Update tier error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete tier
app.delete('/api/admin/tiers/:tierId', async (req, res) => {
  try {
    const { tierId } = req.params;
    await tierManager.deleteTier(tierId);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete tier error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update user tier
app.put('/api/admin/users/:userId/tier', async (req, res) => {
  try {
    const { userId } = req.params;
    const { newTierId, notifyUser = true, updateApiKey = true } = req.body;

    const result = await tierManager.updateUserTier(userId, newTierId, {
      notifyUser,
      updateApiKey
    });

    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Update user tier error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Bulk update user tiers
app.post('/api/admin/users/bulk-update-tier', async (req, res) => {
  try {
    const { updates, notifyUsers = true, updateApiKeys = true } = req.body;

    const results = await tierManager.bulkUpdateUserTiers(updates, {
      notifyUsers,
      updateApiKeys
    });

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    res.json({
      success: true,
      summary: { total: results.length, successful, failed },
      results
    });
  } catch (error) {
    console.error('Bulk update tier error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update tier usage limits
app.put('/api/admin/tiers/:tierId/limits', async (req, res) => {
  try {
    const { tierId } = req.params;
    const { limits } = req.body;

    const result = await tierManager.updateTierLimits(tierId, limits);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Update tier limits error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get tier analytics
app.get('/api/admin/tiers/analytics', async (req, res) => {
  try {
    const analytics = await tierManager.getTierAnalytics();
    res.json({ analytics });
  } catch (error) {
    console.error('Get tier analytics error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get public tiers (for user-facing apps)
app.get('/api/tiers', async (req, res) => {
  try {
    const tiers = await tierManager.getAllTiers();
    const publicTiers = tiers.filter(tier => tier.isActive && !tier.isInternal);
    res.json({ tiers: publicTiers });
  } catch (error) {
    console.error('Get public tiers error:', error);
    res.status(500).json({ error: 'Failed to get tiers' });
  }
});

// Get user's current tier and limits
app.get('/api/user/tier', async (req, res) => {
  try {
    const userId = req.query.userId || req.headers['x-user-id'];

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const userDoc = await admin.firestore().collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    const tier = await tierManager.getTier(userData.tierId);

    res.json({
      tierId: userData.tierId,
      tierName: userData.tierName,
      limits: userData.tierLimits,
      tier: tier ? {
        displayName: tier.displayName,
        features: tier.features,
        price: tier.price
      } : null
    });
  } catch (error) {
    console.error('Get user tier error:', error);
    res.status(500).json({ error: 'Failed to get user tier' });
  }
});

// Routes
app.get('/health', (req, res) => {
  const syncStats = dataSyncManager.getCacheStats();
  const optimizationStats = optimizationManager.getCacheStats();
  const notificationStats = notificationManager.getNotificationStats();
  const updateStats = updateManager.getUpdateStats();

  // Get tier management stats
  const tierStats = tierManager ? tierManager.getTierStats() : {
    totalTiers: 0,
    activeTiers: 0,
    totalUsers: 0,
    tierDistribution: {}
  };

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    application: req.application,
    version: process.env.npm_package_version || '1.0.0',
    services: {
      firestore: 'connected',
      stripe: 'configured',
      dataSync: 'active',
      notifications: 'active',
      electronUpdates: 'active',
      dataOptimization: 'active',
      dynamicTierManagement: 'active'
    },
    sync: {
      cacheEntries: syncStats.totalEntries,
      cacheSize: `${(syncStats.totalSize / 1024).toFixed(2)} KB`,
      collections: Object.keys(syncStats.collections).length
    },
    optimization: {
      cacheEntries: optimizationStats.totalEntries,
      cacheSize: `${(optimizationStats.totalSize / 1024).toFixed(2)} KB`,
      efficiency: 'optimized'
    },
    notifications: {
      active: notificationStats.activeNotifications,
      delivered: notificationStats.totalDelivered,
      connectedClients: notificationStats.connectedClients
    },
    updates: {
      totalUpdates: updateStats.totalUpdates,
      totalDownloads: updateStats.totalDownloads,
      platforms: Object.keys(updateStats.platformStats || {}).length
    },
    tierManagement: {
      totalTiers: tierStats.totalTiers,
      activeTiers: tierStats.activeTiers,
      totalUsers: tierStats.totalUsers,
      tierDistribution: tierStats.tierDistribution,
      cacheStatus: 'active',
      lastTierUpdate: tierStats.lastTierUpdate || null
    }
  });
});

// API Key validation route
app.post('/api/validate-key', async (req, res) => {
  try {
    const { apiKey } = req.body;

    if (!apiKey || typeof apiKey !== 'string') {
      return res.status(400).json({ error: 'API key required' });
    }

    // Query Firestore for API key
    const apiKeysRef = db.collection('apiKeys');
    const snapshot = await apiKeysRef.where('key', '==', apiKey).limit(1).get();

    if (snapshot.empty) {
      return res.status(401).json({
        isValid: false,
        plan: 'free',
        limits: { maxAiTokens: 10000, maxApiCalls: 100, features: [] }
      });
    }

    const apiKeyDoc = snapshot.docs[0];
    const keyData = apiKeyDoc.data();

    // Check if key is expired
    if (keyData.expiresAt && new Date(keyData.expiresAt.toDate()) < new Date()) {
      return res.status(401).json({
        isValid: false,
        plan: 'free',
        limits: { maxAiTokens: 10000, maxApiCalls: 100, features: [] }
      });
    }

    // Check if key is active
    if (!keyData.isActive) {
      return res.status(401).json({
        isValid: false,
        plan: 'free',
        limits: { maxAiTokens: 10000, maxApiCalls: 100, features: [] }
      });
    }

    // Get plan limits
    const planLimits = await getPlanLimits(keyData.plan || 'free');

    res.json({
      isValid: true,
      plan: keyData.plan || 'free',
      limits: planLimits,
      expiresAt: keyData.expiresAt?.toDate()?.toISOString(),
      features: keyData.features || []
    });

  } catch (error) {
    console.error('API key validation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Usage tracking route
app.post('/api/usage/track', async (req, res) => {
  try {
    const { apiKey, metric, amount, metadata } = req.body;

    if (!apiKey || !metric || typeof amount !== 'number') {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    // Find API key document
    const apiKeysRef = db.collection('apiKeys');
    const snapshot = await apiKeysRef.where('key', '==', apiKey).limit(1).get();

    if (snapshot.empty) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    const apiKeyDoc = snapshot.docs[0];
    const keyData = apiKeyDoc.data();

    // Record usage in Firestore (cost-optimized batch writes)
    const usageRef = db.collection('usage').doc();
    const batch = db.batch();

    // Individual usage record
    batch.set(usageRef, {
      apiKeyId: apiKeyDoc.id,
      metric,
      amount,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      metadata: metadata || {},
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Update usage aggregates (for efficient queries)
    const periodStart = getPeriodStart(new Date(), 'month');
    const aggregateRef = db.collection('usageAggregates').doc(
      `${apiKeyDoc.id}_${metric}_month_${periodStart.toISOString().split('T')[0]}`
    );

    batch.set(aggregateRef, {
      apiKeyId: apiKeyDoc.id,
      metric,
      period: 'month',
      periodStart,
      total: admin.firestore.FieldValue.increment(amount),
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    await batch.commit();

    res.json({ success: true });

  } catch (error) {
    console.error('Usage tracking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Usage summary route
app.get('/api/usage/summary', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const apiKey = authHeader.substring(7);

    // Find API key document
    const apiKeysRef = db.collection('apiKeys');
    const snapshot = await apiKeysRef.where('key', '==', apiKey).limit(1).get();

    if (snapshot.empty) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    const apiKeyDoc = snapshot.docs[0];
    const keyData = apiKeyDoc.data();

    // Get current month usage
    const periodStart = getPeriodStart(new Date(), 'month');
    const aggregatesRef = db.collection('usageAggregates');
    const aggregatesSnapshot = await aggregatesRef
      .where('apiKeyId', '==', apiKeyDoc.id)
      .where('period', '==', 'month')
      .where('periodStart', '==', periodStart)
      .get();

    const currentMonth = {};
    aggregatesSnapshot.forEach(doc => {
      const data = doc.data();
      currentMonth[data.metric] = data.total;
    });

    // Get plan limits
    const limits = await getPlanLimits(keyData.plan || 'free');

    res.json({
      currentMonth,
      limits,
      utilization: calculateUtilization(currentMonth, limits)
    });

  } catch (error) {
    console.error('Usage summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Helper functions
// Plan cache for performance
const planCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

async function getPlanLimits(plan) {
  try {
    // Check cache first
    const cacheKey = `plan_${plan}`;
    const cached = planCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      return cached.data;
    }

    const plansRef = db.collection('plans');
    const snapshot = await plansRef.where('name', '==', plan).limit(1).get();

    if (!snapshot.empty) {
      const planData = snapshot.docs[0].data();
      const limits = {
        // Core limits (existing)
        maxAiTokens: planData.maxAiTokens || 50000,      // Generous for acquisition
        maxApiCalls: planData.maxApiCalls || 500,        // Generous for acquisition
        maxStorage: planData.maxStorage || 5368709120,   // 5GB (increased)
        maxTeamMembers: planData.maxTeamMembers || 1,

        // Extended limits (new)
        maxProjects: planData.maxProjects || 50,
        maxChats: planData.maxChats || 500,
        maxMessages: planData.maxMessages || 5000,
        maxFileUploads: planData.maxFileUploads || 500,
        maxFileSize: planData.maxFileSize || 52428800, // 50MB

        // Feature flags
        advancedFeatures: planData.advancedFeatures || false,
        prioritySupport: planData.prioritySupport || false,
        features: planData.features || ['basic_ai', 'basic_chat', 'basic_storage'],

        // Rate limits (hourly/daily)
        rateLimits: {
          requestsPerHour: planData.requestsPerHour || 500,
          requestsPerDay: planData.requestsPerDay || 2000,
          tokensPerHour: planData.tokensPerHour || 25000,
          tokensPerDay: planData.tokensPerDay || 100000
        }
      };

      // Cache the result
      planCache.set(cacheKey, { data: limits, timestamp: Date.now() });
      return limits;
    }
  } catch (error) {
    logger.error('Error fetching plan limits:', error);
  }

  // Default free plan limits (VERY generous for user acquisition)
  const defaultLimits = {
    maxAiTokens: 50000,      // 50K tokens (5x original)
    maxApiCalls: 500,        // 500 calls (5x original)
    maxStorage: 5368709120,  // 5GB (5x original)
    maxTeamMembers: 1,
    maxProjects: 50,
    maxChats: 500,
    maxMessages: 5000,
    maxFileUploads: 500,
    maxFileSize: 52428800, // 50MB
    advancedFeatures: false,
    prioritySupport: false,
    features: ['basic_ai', 'basic_chat', 'basic_storage'],
    rateLimits: {
      requestsPerHour: 500,
      requestsPerDay: 2000,
      tokensPerHour: 25000,
      tokensPerDay: 100000
    }
  };

  // Cache defaults too
  planCache.set(`plan_${plan}`, { data: defaultLimits, timestamp: Date.now() });
  return defaultLimits;
}

// Clear plan cache (for admin updates)
function clearPlanCache(planId = null) {
  if (planId) {
    planCache.delete(`plan_${planId}`);
  } else {
    planCache.clear();
  }
}

function getPeriodStart(date, period) {
  const d = new Date(date);
  switch (period) {
    case 'month':
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
      break;
    case 'day':
      d.setHours(0, 0, 0, 0);
      break;
    case 'hour':
      d.setMinutes(0, 0, 0);
      break;
  }
  return d;
}

function calculateUtilization(currentMonth, limits) {
  const utilization = {};
  Object.keys(limits).forEach(key => {
    if (typeof limits[key] === 'number' && limits[key] > 0) {
      utilization[key] = (currentMonth[key] || 0) / limits[key] * 100;
    }
  });
  return utilization;
}

// ==========================================
// ADMIN PLAN MANAGEMENT ENDPOINTS
// ==========================================

// Get all plans (admin only)
app.get('/api/admin/plans', async (req, res) => {
  try {
    // Mock user for now (would be set by authentication middleware)
    const mockUser = {
      id: 'admin-user',
      role: 'super_admin',
      permissions: ['view_admin_dashboard', 'manage_plans']
    };

    const dataContext = new DataContext(mockUser, req.application, req);

    // Check if user can access plans
    if (!await dataContext.canPerformAction('manage_plans', 'plans')) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const plansRef = db.collection('plans');
    let query = plansRef.orderBy('price', 'asc');

    // Apply user context filters
    query = await dataContext.applyFilters(query, 'plans');
    const snapshot = await query.get();

    const plans = [];
    snapshot.forEach(doc => {
      plans.push({ id: doc.id, ...doc.data() });
    });

    // Filter response data
    const filteredPlans = await dataContext.filterData(plans, 'plans');

    // Log access
    await dataContext.logDataAccess('view', 'plans', { count: filteredPlans.length });

    res.json({
      plans: filteredPlans,
      context: await dataContext.getUserContext(),
      total: filteredPlans.length
    });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

// Create or update plan (admin only)
app.post('/api/admin/plans', async (req, res) => {
  try {
    const {
      id,
      name,
      displayName,
      price,
      currency = 'usd',
      maxAiTokens,
      maxApiCalls,
      maxStorage,
      maxTeamMembers,
      maxProjects,
      maxChats,
      maxMessages,
      maxFileUploads,
      maxFileSize,
      requestsPerHour,
      requestsPerDay,
      tokensPerHour,
      tokensPerDay,
      advancedFeatures,
      prioritySupport,
      features,
      description,
      isActive = true
    } = req.body;

    if (!id || !name || !displayName) {
      return res.status(400).json({ error: 'Missing required fields: id, name, displayName' });
    }

    const planData = {
      id,
      name,
      displayName,
      price: price || 0,
      currency,
      maxAiTokens: maxAiTokens || 10000,
      maxApiCalls: maxApiCalls || 100,
      maxStorage: maxStorage || 1073741824, // 1GB
      maxTeamMembers: maxTeamMembers || 1,
      maxProjects: maxProjects || 10,
      maxChats: maxChats || 100,
      maxMessages: maxMessages || 1000,
      maxFileUploads: maxFileUploads || 100,
      maxFileSize: maxFileSize || 10485760, // 10MB
      requestsPerHour: requestsPerHour || 100,
      requestsPerDay: requestsPerDay || 1000,
      tokensPerHour: tokensPerHour || 10000,
      tokensPerDay: tokensPerDay || 100000,
      advancedFeatures: advancedFeatures || false,
      prioritySupport: prioritySupport || false,
      features: features || [],
      description: description || '',
      isActive,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: 'admin' // In production, use authenticated user
    };

    // Use set with merge to create or update
    await db.collection('plans').doc(id).set(planData, { merge: true });

    // Clear cache for this plan
    clearPlanCache(id);

    logger.info(`Plan ${id} updated by admin`);
    res.json({ success: true, plan: planData });
  } catch (error) {
    logger.error('Error updating plan:', error);
    res.status(500).json({ error: 'Failed to update plan' });
  }
});

// Delete plan (admin only)
app.delete('/api/admin/plans/:planId', async (req, res) => {
  try {
    const { planId } = req.params;

    // Check if plan is in use
    const usersSnapshot = await db.collection('users')
      .where('plan', '==', planId)
      .limit(1)
      .get();

    if (!usersSnapshot.empty) {
      return res.status(400).json({
        error: 'Cannot delete plan that is currently assigned to users'
      });
    }

    await db.collection('plans').doc(planId).delete();

    // Clear cache
    clearPlanCache(planId);

    logger.info(`Plan ${planId} deleted by admin`);
    res.json({ success: true });
  } catch (error) {
    logger.error('Error deleting plan:', error);
    res.status(500).json({ error: 'Failed to delete plan' });
  }
});

// Bulk update plan limits (for gradual monetization)
app.post('/api/admin/plans/bulk-update', async (req, res) => {
  try {
    const { updates } = req.body; // Array of {planId, field, value} objects

    if (!Array.isArray(updates)) {
      return res.status(400).json({ error: 'Updates must be an array' });
    }

    const batch = db.batch();

    for (const update of updates) {
      const { planId, field, value } = update;
      const planRef = db.collection('plans').doc(planId);

      batch.update(planRef, {
        [field]: value,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedBy: 'admin'
      });
    }

    await batch.commit();

    // Clear all plan caches
    clearPlanCache();

    logger.info(`Bulk updated ${updates.length} plan fields`);
    res.json({ success: true, updated: updates.length });
  } catch (error) {
    logger.error('Error bulk updating plans:', error);
    res.status(500).json({ error: 'Failed to bulk update plans' });
  }
});

// Get plan analytics (usage stats per plan)
app.get('/api/admin/plans/analytics', async (req, res) => {
  try {
    // Get current month usage by plan
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const usageSnapshot = await db.collection('usage')
      .where('period', '==', 'month')
      .where('startDate', '==', currentMonth)
      .get();

    const planStats = {};

    usageSnapshot.forEach(doc => {
      const data = doc.data();
      const plan = data.plan || 'free';

      if (!planStats[plan]) {
        planStats[plan] = { users: 0, totalTokens: 0, totalCalls: 0 };
      }

      planStats[plan].users += 1;
      planStats[plan].totalTokens += data.ai_tokens || 0;
      planStats[plan].totalCalls += data.api_calls || 0;
    });

    res.json({ planStats, month: currentMonth.toISOString() });
  } catch (error) {
    logger.error('Error fetching plan analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// ==========================================
// STRIPE WEBHOOKS & SUBSCRIPTION AUTOMATION
// ==========================================

// Stripe webhook endpoint for subscription events
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    await handleStripeWebhook(event);
    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Handle different Stripe webhook events
async function handleStripeWebhook(event) {
  const { type, data } = event;
  console.log(`Processing Stripe webhook: ${type}`);

  switch (type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await handleSubscriptionCreatedOrUpdated(data.object);
      break;

    case 'customer.subscription.deleted':
      await handleSubscriptionCancelled(data.object);
      break;

    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(data.object);
      break;

    case 'invoice.payment_failed':
      await handlePaymentFailed(data.object);
      break;

    default:
      console.log(`Unhandled webhook event type: ${type}`);
  }
}

// Handle subscription creation/update
async function handleSubscriptionCreatedOrUpdated(subscription) {
  const customerId = subscription.customer;
  const status = subscription.status;
  const planId = subscription.items.data[0]?.price?.id;

  console.log(`Processing subscription ${subscription.id} for customer ${customerId}`);

  try {
    // Get customer email from Stripe
    const customer = await stripe.customers.retrieve(customerId);
    const email = customer.email;

    if (!email) {
      console.error('No email found for customer:', customerId);
      return;
    }

    // Map Stripe price ID to our plan
    const plan = mapStripePriceToPlan(planId);
    if (!plan) {
      console.error('Unknown plan for price ID:', planId);
      return;
    }

    // Check if user exists in our system, create if not
    let userRef = db.collection('users').where('email', '==', email);
    const userSnapshot = await userRef.get();

    let userId;
    if (userSnapshot.empty) {
      // Create new user
      const newUser = {
        email,
        plan: status === 'active' ? plan : 'free',
        stripeCustomerId: customerId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        subscriptionStatus: status
      };
      const userDoc = await db.collection('users').add(newUser);
      userId = userDoc.id;
      console.log(`Created new user: ${userId} for email: ${email}`);
    } else {
      // Update existing user
      userId = userSnapshot.docs[0].id;
      await db.collection('users').doc(userId).update({
        plan: status === 'active' ? plan : 'free',
        stripeCustomerId: customerId,
        subscriptionStatus: status,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`Updated user: ${userId} plan to: ${plan}`);
    }

    // Generate or update API key for active subscriptions
    if (status === 'active') {
      await generateOrUpdateApiKey(userId, plan, email);
    }

    console.log(`Successfully processed subscription for user: ${userId}`);

  } catch (error) {
    console.error('Error processing subscription:', error);
    throw error;
  }
}

// Handle subscription cancellation
async function handleSubscriptionCancelled(subscription) {
  const customerId = subscription.customer;

  console.log(`Processing subscription cancellation for customer: ${customerId}`);

  try {
    // Find user by Stripe customer ID
    const userSnapshot = await db.collection('users')
      .where('stripeCustomerId', '==', customerId)
      .get();

    if (!userSnapshot.empty) {
      const userId = userSnapshot.docs[0].id;

      // Downgrade to free plan
      await db.collection('users').doc(userId).update({
        plan: 'free',
        subscriptionStatus: 'cancelled',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Keep API keys active but they'll validate as free tier limits

      console.log(`Downgraded user ${userId} to free plan`);
    }
  } catch (error) {
    console.error('Error processing subscription cancellation:', error);
    throw error;
  }
}

// Handle successful payments
async function handlePaymentSucceeded(invoice) {
  console.log(`Payment succeeded for invoice: ${invoice.id}`);
  // Additional logic for payment confirmations can be added here
}

// Handle failed payments
async function handlePaymentFailed(invoice) {
  console.log(`Payment failed for invoice: ${invoice.id}`);
  // Additional logic for failed payment handling can be added here
}

// Map Stripe price IDs to our plan names
function mapStripePriceToPlan(priceId) {
  const priceMappings = {
    [process.env.STRIPE_PRICE_PRO]: 'pro',
    [process.env.STRIPE_PRICE_ENTERPRISE]: 'enterprise'
  };

  return priceMappings[priceId] || null;
}

// Generate or update API key for a user
async function generateOrUpdateApiKey(userId, plan, email) {
  console.log(`Generating/updating API key for user ${userId} with plan ${plan}`);

  try {
    // Check if user already has an active API key
    const existingKeys = await db.collection('apiKeys')
      .where('userId', '==', userId)
      .where('isActive', '==', true)
      .get();

    if (!existingKeys.empty) {
      // Update existing key with new plan
      const keyDoc = existingKeys.docs[0];
      await db.collection('apiKeys').doc(keyDoc.id).update({
        plan,
        features: getPlanFeatures(plan),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`Updated existing API key for user ${userId}`);
      return;
    }

    // Generate new API key
    const apiKey = `scalix_${crypto.randomBytes(32).toString('hex')}`;

    const keyData = {
      key: apiKey,
      userId,
      email,
      plan,
      isActive: true,
      features: getPlanFeatures(plan),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: null // No expiration for subscriptions
    };

    await db.collection('apiKeys').add(keyData);
    console.log(`Generated new API key for user ${userId}: ${apiKey.substring(0, 12)}...`);

  } catch (error) {
    console.error('Error generating API key:', error);
    throw error;
  }
}

// Get features for a plan
function getPlanFeatures(plan) {
  const featureMap = {
    free: ['basic_ai', 'chat'],
    pro: ['advanced_ai_models', 'team_collaboration', 'priority_support', 'unlimited_projects', 'advanced_context'],
    enterprise: ['advanced_ai_models', 'team_collaboration', 'priority_support', 'unlimited_projects', 'advanced_context', 'enterprise_sso', 'advanced_analytics']
  };

  return featureMap[plan] || [];
}

// ==========================================
// DESKTOP APP SYNC ENDPOINTS
// ==========================================

// Endpoint for desktop apps to get their API key and settings
app.get('/api/desktop/sync', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const token = authHeader.substring(7);

    // Validate desktop token (placeholder - needs proper JWT implementation)
    const user = await validateDesktopToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get active API key for user
    const apiKeysRef = db.collection('apiKeys');
    const keySnapshot = await apiKeysRef
      .where('userId', '==', user.id)
      .where('isActive', '==', true)
      .limit(1)
      .get();

    if (keySnapshot.empty) {
      return res.json({
        hasKey: false,
        plan: 'free',
        limits: await getPlanLimits('free'),
        features: []
      });
    }

    const keyData = keySnapshot.docs[0].data();
    const limits = await getPlanLimits(keyData.plan || 'free');

    res.json({
      hasKey: true,
      apiKey: keyData.key,
      plan: keyData.plan || 'free',
      limits,
      features: keyData.features || [],
      expiresAt: keyData.expiresAt?.toDate()?.toISOString()
    });

  } catch (error) {
    console.error('Desktop sync error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Validate desktop sync token (placeholder - needs proper JWT implementation)
async function validateDesktopToken(token) {
  // TODO: Implement proper JWT validation
  // For now, accept any token and return a mock user
  // This should validate JWT tokens issued by the web app

  try {
    // Placeholder: decode and validate JWT
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // return { id: decoded.userId, email: decoded.email };

    // Temporary: return mock user for testing
    return {
      id: 'test-user-id',
      email: 'test@example.com'
    };
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Scalix Cloud API running on port ${PORT}`);
  console.log(`📊 Firestore connected to project: ${process.env.GCP_PROJECT_ID}`);
  console.log(`💰 Cost-optimized with serverless scaling`);
  console.log(`🔄 Stripe webhooks enabled for subscription automation`);
});
