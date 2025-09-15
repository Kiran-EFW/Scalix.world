/**
 * Development server for testing without Firebase
 * This allows us to test Electron app connectivity and basic API flows
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002', 'electron://scalix'],
  credentials: true
}));
app.use(express.json());

// Mock data for development testing
const mockPlans = {
  free: {
    id: 'free',
    name: 'free',
    displayName: 'Free',
    price: 0,
    maxAiTokens: 50000,
    maxApiCalls: 500,
    maxStorage: 5368709120, // 5GB
    maxTeamMembers: 1,
    maxProjects: 50,
    maxChats: 500,
    maxMessages: 5000,
    advancedFeatures: false,
    prioritySupport: false,
    features: ['basic_ai', 'basic_chat', 'basic_storage'],
    rateLimits: {
      requestsPerHour: 500,
      requestsPerDay: 2000,
      tokensPerHour: 25000,
      tokensPerDay: 100000
    }
  },
  pro: {
    id: 'pro',
    name: 'pro',
    displayName: 'Pro',
    price: 2999,
    maxAiTokens: 200000,
    maxApiCalls: 1000,
    maxStorage: 10737418240, // 10GB
    maxTeamMembers: 5,
    advancedFeatures: true,
    prioritySupport: true,
    features: ['advanced_ai_models', 'team_collaboration', 'priority_support'],
    rateLimits: {
      requestsPerHour: 5000,
      requestsPerDay: 20000,
      tokensPerHour: 100000,
      tokensPerDay: 500000
    }
  }
};

const mockApiKeys = new Map([
  ['test-free-key', { plan: 'free', userId: 'test-user-1', active: true }],
  ['test-pro-key', { plan: 'pro', userId: 'test-user-2', active: true }],
  ['dev-admin-key', { plan: 'enterprise', userId: 'dev-admin', active: true }]
]);

// Mock usage tracking (in-memory)
const mockUsage = new Map();

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Scalix Cloud API (Development Mode)',
    timestamp: new Date().toISOString(),
    version: 'dev-1.0.0'
  });
});

// API Key validation
app.post('/api/validate-key', (req, res) => {
  const { apiKey } = req.body;

  if (!apiKey) {
    return res.status(400).json({ error: 'API key required' });
  }

  const keyData = mockApiKeys.get(apiKey);

  if (!keyData || !keyData.active) {
    return res.status(401).json({
      isValid: false,
      error: 'Invalid or inactive API key'
    });
  }

  const planLimits = mockPlans[keyData.plan];

  if (!planLimits) {
    return res.status(500).json({ error: 'Plan configuration error' });
  }

  res.json({
    isValid: true,
    plan: keyData.plan,
    limits: planLimits,
    userId: keyData.userId,
    expiresAt: null // No expiration in dev mode
  });
});

// Usage tracking
app.post('/api/usage/track', (req, res) => {
  const { apiKey, metric, amount, metadata } = req.body;

  if (!apiKey || !metric || amount === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const keyData = mockApiKeys.get(apiKey);
  if (!keyData) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  // Store usage in memory (would be persisted in production)
  const usageKey = `${keyData.userId}_${metric}`;
  const currentUsage = mockUsage.get(usageKey) || 0;
  mockUsage.set(usageKey, currentUsage + amount);

  console.log(`📊 Usage tracked: ${metric}=${amount} for user ${keyData.userId}`);

  res.json({
    success: true,
    tracked: { metric, amount, total: currentUsage + amount }
  });
});

// Usage summary
app.get('/api/usage/summary', (req, res) => {
  const apiKey = req.headers.authorization?.replace('Bearer ', '');

  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }

  const keyData = mockApiKeys.get(apiKey);
  if (!keyData) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  const planLimits = mockPlans[keyData.plan];
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  // Generate mock usage data
  const currentMonthData = {};
  Object.keys(planLimits).forEach(key => {
    if (typeof planLimits[key] === 'number') {
      // Simulate some usage (20-80% of limits)
      const usagePercent = 0.2 + Math.random() * 0.6;
      currentMonthData[key] = Math.round(planLimits[key] * usagePercent);
    }
  });

  res.json({
    currentMonth: currentMonthData,
    limits: planLimits,
    period: currentMonth,
    userId: keyData.userId
  });
});

// Admin endpoints (mock)
app.get('/api/admin/plans', (req, res) => {
  res.json({ plans: Object.values(mockPlans) });
});

app.post('/api/admin/plans', (req, res) => {
  const planData = req.body;
  mockPlans[planData.id] = { ...planData, updatedAt: new Date().toISOString() };
  res.json({ success: true, plan: mockPlans[planData.id] });
});

// Desktop sync endpoint
app.post('/api/desktop/sync', (req, res) => {
  // Mock desktop sync - in production this would validate JWT
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token required' });
  }

  // Mock response - return a test API key
  res.json({
    success: true,
    apiKey: 'test-free-key',
    plan: 'free',
    limits: mockPlans.free
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Scalix Cloud API (Development Mode) running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔑 Test API keys: test-free-key, test-pro-key, dev-admin-key`);
  console.log(`📋 Available plans: free, pro, enterprise`);
});

// Export for testing
module.exports = app;
