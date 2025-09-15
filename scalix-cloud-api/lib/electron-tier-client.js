// ============================================================================
// ELECTRON TIER MANAGEMENT CLIENT
// ============================================================================
// Handles dynamic tier updates and usage limit changes in Electron apps
// Automatically adapts to tier changes and API key updates
// ============================================================================

class ElectronTierClient {
  constructor(options = {}) {
    this.apiUrl = options.apiUrl || 'http://localhost:8080';
    this.apiKey = options.apiKey;
    this.userId = options.userId;
    this.deviceId = options.deviceId || this.generateDeviceId();

    // Tier and usage state
    this.currentTier = null;
    this.currentLimits = null;
    this.usageStats = {};
    this.lastTierCheck = 0;
    this.checkInterval = options.checkInterval || 300000; // 5 minutes

    // Event listeners
    this.listeners = new Map();

    // Initialize usage enforcement system
    this.initializeUsageEnforcement();

    // Auto-check for tier updates
    if (options.autoCheck !== false) {
      this.startTierMonitoring();
    }

    console.log(`🎯 Electron Tier Client initialized for user: ${this.userId}`);
  }

  // ============================================================================
  // TIER MONITORING
  // ============================================================================

  // Start monitoring for tier changes
  startTierMonitoring() {
    console.log(`👀 Starting tier monitoring every ${this.checkInterval / 1000 / 60} minutes`);

    // Initial check
    this.checkTierUpdates();

    // Set up periodic checks
    this.monitorInterval = setInterval(() => {
      this.checkTierUpdates();
    }, this.checkInterval);
  }

  // Stop monitoring
  stopTierMonitoring() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
      console.log('⏹️ Stopped tier monitoring');
    }
  }

  // Check for tier updates
  async checkTierUpdates() {
    try {
      const response = await this.request('/api/user/tier', {
        headers: {
          'X-User-Id': this.userId
        }
      });

      if (!response.success) {
        console.warn('Failed to check tier updates:', response.error);
        return;
      }

      const tierData = response.data;
      const hasTierChanged = this.hasTierChanged(tierData);
      const hasLimitsChanged = this.hasLimitsChanged(tierData.limits);

      if (hasTierChanged) {
        console.log(`🎯 Tier changed to: ${tierData.tier?.displayName || tierData.tierId}`);
        this.handleTierChange(tierData);
      }

      if (hasLimitsChanged) {
        console.log('📊 Usage limits updated');
        this.handleLimitsChange(tierData.limits);
      }

      // Update local state
      this.currentTier = tierData;
      this.currentLimits = tierData.limits;
      this.lastTierCheck = Date.now();

    } catch (error) {
      console.error('Error checking tier updates:', error);
      this.emit('error', error);
    }
  }

  // Check if tier has changed
  hasTierChanged(newTierData) {
    if (!this.currentTier) return true;

    return (
      this.currentTier.tierId !== newTierData.tierId ||
      this.currentTier.tierName !== newTierData.tierName ||
      JSON.stringify(this.currentTier.tier?.features || []) !== JSON.stringify(newTierData.tier?.features || [])
    );
  }

  // Check if limits have changed
  hasLimitsChanged(newLimits) {
    if (!this.currentLimits) return true;

    return JSON.stringify(this.currentLimits) !== JSON.stringify(newLimits);
  }

  // ============================================================================
  // TIER CHANGE HANDLERS
  // ============================================================================

  // Handle tier change
  handleTierChange(newTierData) {
    console.log(`🔄 Handling tier change to ${newTierData.tier?.displayName}`);

    // Update local tier state
    this.currentTier = newTierData;

    // Notify the main Electron process
    if (typeof window !== 'undefined' && window.electronAPI) {
      window.electronAPI.send('tier-changed', newTierData);
    }

    // Emit event for listeners
    this.emit('tier-changed', {
      oldTier: this.currentTier,
      newTier: newTierData,
      tierData: newTierData
    });

    // Update UI elements based on new tier
    this.updateUIBasedOnTier(newTierData);

    // Check for feature changes
    this.handleFeatureChanges(newTierData);
  }

  // Handle usage limits change
  handleLimitsChange(newLimits) {
    console.log('📈 Handling usage limits change');

    // Update local limits state
    this.currentLimits = newLimits;

    // Notify the main Electron process
    if (typeof window !== 'undefined' && window.electronAPI) {
      window.electronAPI.send('limits-changed', newLimits);
    }

    // Emit event for listeners
    this.emit('limits-changed', {
      oldLimits: this.currentLimits,
      newLimits: newLimits
    });

    // Update usage tracking
    this.updateUsageTracking(newLimits);
  }

  // Update UI based on new tier
  updateUIBasedOnTier(tierData) {
    const tier = tierData.tier;

    if (!tier) return;

    // Update UI elements that depend on tier features
    const features = tier.features || [];

    // Example: Show/hide premium features
    this.updateFeatureVisibility(features);

    // Update pricing/limit displays
    this.updateLimitDisplays(tierData.limits);

    // Update tier name displays
    this.updateTierNameDisplays(tier.displayName);
  }

  // Handle feature changes
  handleFeatureChanges(newTierData) {
    const newFeatures = newTierData.tier?.features || [];
    const oldFeatures = this.currentTier?.tier?.features || [];

    const addedFeatures = newFeatures.filter(f => !oldFeatures.includes(f));
    const removedFeatures = oldFeatures.filter(f => !newFeatures.includes(f));

    if (addedFeatures.length > 0) {
      console.log('✨ New features unlocked:', addedFeatures);
      this.emit('features-added', addedFeatures);
    }

    if (removedFeatures.length > 0) {
      console.log('🚫 Features removed:', removedFeatures);
      this.emit('features-removed', removedFeatures);
    }
  }

  // ============================================================================
  // USAGE TRACKING & LIMITS ENFORCEMENT
  // ============================================================================

  // Initialize usage enforcement
  initializeUsageEnforcement() {
    this.usageEnforcement = {
      blockedRequests: new Map(),
      fallbackMode: false,
      exceededMetrics: new Set(),
      customApiKey: null,
      gracePeriodEnd: null
    };

    console.log('🛡️ Usage enforcement system initialized');
  }

  // Check if request should be blocked due to limits
  async shouldBlockRequest(requestType, estimatedCost = 1) {
    try {
      await this.refreshUsageStats();

      const limits = this.currentLimits;
      const currentUsage = this.usageStats.current || {};

      if (!limits) {
        console.log('No limits defined, allowing request');
        return { blocked: false };
      }

      // Check each metric
      for (const [metric, limit] of Object.entries(limits)) {
        if (typeof limit === 'number' && limit > 0) {
          const current = currentUsage[metric] || 0;
          const projected = current + estimatedCost;

          if (projected > limit) {
            const exceededBy = projected - limit;
            const percentage = Math.round((projected / limit) * 100);

            console.log(`🚫 Request blocked: ${metric} would exceed limit by ${exceededBy} (${percentage}%)`);

            this.usageEnforcement.exceededMetrics.add(metric);
            this.emit('limit-exceeded', {
              metric,
              limit,
              current,
              projected,
              exceededBy,
              percentage
            });

            return {
              blocked: true,
              reason: `${metric} limit exceeded`,
              metric,
              limit,
              current,
              projected,
              exceededBy,
              percentage,
              upgradeRequired: true
            };
          }
        }
      }

      // Check if we're in fallback mode
      if (this.usageEnforcement.fallbackMode) {
        return {
          blocked: false,
          fallbackMode: true,
          customApiRequired: !this.usageEnforcement.customApiKey
        };
      }

      return { blocked: false };

    } catch (error) {
      console.error('Error checking request limits:', error);
      // Allow request on error to prevent false blocking
      return { blocked: false };
    }
  }

  // Update usage tracking based on new limits
  updateUsageTracking(newLimits) {
    // Update local usage tracking with new limits
    this.usageStats.limits = newLimits;

    // Recalculate usage percentages
    this.updateUsagePercentages();

    // Check if user is approaching limits
    this.checkUsageWarnings();

    // Check for limit exceedance
    this.checkLimitExceedance();
  }

  // Update usage percentages
  updateUsagePercentages() {
    const limits = this.currentLimits;
    const currentUsage = this.usageStats.current || {};

    if (limits && currentUsage) {
      const percentages = {};

      Object.keys(limits).forEach(key => {
        if (typeof limits[key] === 'number' && limits[key] > 0) {
          percentages[key] = Math.round((currentUsage[key] || 0) / limits[key] * 100);
        }
      });

      this.usageStats.percentages = percentages;
      this.emit('usage-updated', percentages);
    }
  }

  // Check for usage warnings
  checkUsageWarnings() {
    const percentages = this.usageStats.percentages || {};
    const warnings = [];

    Object.entries(percentages).forEach(([metric, percentage]) => {
      if (percentage >= 100) {
        warnings.push({
          metric,
          percentage,
          level: 'exceeded',
          message: `${this.formatMetricName(metric)} usage has exceeded the limit!`,
          action: 'upgrade_or_custom_key'
        });
      } else if (percentage >= 90) {
        warnings.push({
          metric,
          percentage,
          level: 'critical',
          message: `${this.formatMetricName(metric)} usage is at ${percentage}% - upgrade soon!`,
          action: 'upgrade_recommended'
        });
      } else if (percentage >= 75) {
        warnings.push({
          metric,
          percentage,
          level: 'warning',
          message: `${this.formatMetricName(metric)} usage is at ${percentage}%`,
          action: 'monitor'
        });
      }
    });

    if (warnings.length > 0) {
      this.emit('usage-warnings', warnings);
    }
  }

  // Check for limit exceedance and trigger fallback
  checkLimitExceedance() {
    const limits = this.currentLimits;
    const currentUsage = this.usageStats.current || {};

    if (!limits || !currentUsage) return;

    let hasExceeded = false;
    const exceededMetrics = [];

    Object.entries(limits).forEach(([metric, limit]) => {
      if (typeof limit === 'number' && limit > 0) {
        const current = currentUsage[metric] || 0;
        if (current > limit) {
          hasExceeded = true;
          exceededMetrics.push({
            metric,
            limit,
            current,
            exceededBy: current - limit,
            percentage: Math.round((current / limit) * 100)
          });
        }
      }
    });

    if (hasExceeded) {
      this.handleLimitExceedance(exceededMetrics);
    } else if (this.usageEnforcement.fallbackMode) {
      // Check if we can exit fallback mode
      this.checkFallbackModeExit();
    }
  }

  // Handle when limits are exceeded
  handleLimitExceedance(exceededMetrics) {
    console.log('🚨 LIMITS EXCEEDED - Activating fallback mode');

    this.usageEnforcement.fallbackMode = true;
    this.usageEnforcement.exceededMetrics = new Set(exceededMetrics.map(m => m.metric));

    // Set grace period (optional buffer time)
    this.usageEnforcement.gracePeriodEnd = Date.now() + (24 * 60 * 60 * 1000); // 24 hours

    // Emit comprehensive limit exceeded event
    this.emit('limits-exceeded', {
      exceededMetrics,
      fallbackMode: true,
      gracePeriodEnd: this.usageEnforcement.gracePeriodEnd,
      recommendations: [
        {
          type: 'upgrade',
          title: 'Upgrade Your Plan',
          description: 'Get higher limits and premium features',
          action: 'upgrade'
        },
        {
          type: 'custom_key',
          title: 'Use Your Own API Key',
          description: 'Continue using your preferred AI models',
          action: 'configure_custom_key'
        },
        {
          type: 'wait',
          title: 'Wait for Reset',
          description: 'Limits reset at the start of next billing cycle',
          action: 'wait'
        }
      ]
    });

    // Show user notification
    this.showLimitExceededNotification(exceededMetrics);
  }

  // Show user-friendly notification about exceeded limits
  showLimitExceededNotification(exceededMetrics) {
    const primaryMetric = exceededMetrics[0]; // Most critical one
    const notification = {
      title: 'Usage Limit Exceeded',
      message: `You've exceeded your ${this.formatMetricName(primaryMetric.metric)} limit. Choose how to continue:`,
      type: 'warning',
      priority: 'high',
      persistent: true,
      actions: [
        {
          id: 'upgrade',
          label: 'Upgrade Plan',
          type: 'primary',
          action: 'upgrade'
        },
        {
          id: 'custom_key',
          label: 'Use My API Key',
          type: 'secondary',
          action: 'configure_custom_key'
        },
        {
          id: 'learn_more',
          label: 'Learn More',
          type: 'link',
          action: 'show_limits_info'
        }
      ],
      metadata: {
        exceededMetrics,
        fallbackMode: true,
        gracePeriodEnd: this.usageEnforcement.gracePeriodEnd
      }
    };

    this.emit('show-notification', notification);
  }

  // Configure custom API key for fallback
  async configureCustomApiKey(apiKey, provider = 'openai') {
    try {
      // Validate the API key
      const isValid = await this.validateCustomApiKey(apiKey, provider);

      if (!isValid) {
        throw new Error('Invalid API key provided');
      }

      this.usageEnforcement.customApiKey = {
        key: apiKey,
        provider,
        configuredAt: Date.now(),
        lastUsed: null
      };

      this.emit('custom-api-key-configured', {
        provider,
        configured: true
      });

      console.log(`✅ Custom API key configured for ${provider}`);
      return { success: true };

    } catch (error) {
      console.error('Error configuring custom API key:', error);
      this.emit('custom-api-key-error', {
        error: error.message,
        provider
      });
      return { success: false, error: error.message };
    }
  }

  // Validate custom API key
  async validateCustomApiKey(apiKey, provider) {
    try {
      // This would make a test request to validate the key
      // For now, we'll do basic validation
      if (!apiKey || apiKey.length < 20) {
        return false;
      }

      // Provider-specific validation
      switch (provider) {
        case 'openai':
          return apiKey.startsWith('sk-');
        case 'anthropic':
          return apiKey.startsWith('sk-ant-');
        case 'google':
          return apiKey.length > 30;
        default:
          return true; // Allow custom providers
      }
    } catch (error) {
      console.error('Error validating API key:', error);
      return false;
    }
  }

  // Check if we can exit fallback mode
  checkFallbackModeExit() {
    const limits = this.currentLimits;
    const currentUsage = this.usageStats.current || {};

    if (!limits || !currentUsage) return;

    let canExit = true;

    for (const [metric, limit] of Object.entries(limits)) {
      if (typeof limit === 'number' && limit > 0) {
        const current = currentUsage[metric] || 0;
        if (current > limit) {
          canExit = false;
          break;
        }
      }
    }

    if (canExit) {
      console.log('✅ Usage back within limits - exiting fallback mode');
      this.usageEnforcement.fallbackMode = false;
      this.usageEnforcement.exceededMetrics.clear();

      this.emit('fallback-mode-exited', {
        message: 'Usage is back within limits',
        customApiKeyConfigured: !!this.usageEnforcement.customApiKey
      });
    }
  }

  // Get current usage stats
  async getUsageStats() {
    try {
      const response = await this.request('/api/usage', {
        headers: {
          'X-User-Id': this.userId
        }
      });

      if (response.success) {
        this.usageStats.current = response.data.currentMonth || {};
        this.updateUsagePercentages();
        return this.usageStats;
      }

      return null;
    } catch (error) {
      console.error('Error getting usage stats:', error);
      return null;
    }
  }

  // ============================================================================
  // API KEY MANAGEMENT
  // ============================================================================

  // Check if API key needs updating
  async checkApiKeyStatus() {
    try {
      const response = await this.request('/api/validate-key', {
        method: 'POST',
        body: { apiKey: this.apiKey }
      });

      if (response.success) {
        const keyData = response.data;

        // Check if tier has changed
        if (keyData.plan !== this.currentTier?.tierId) {
          console.log('🔑 API key tier mismatch, requesting update');
          this.emit('api-key-outdated', {
            currentTier: keyData.plan,
            newTier: this.currentTier?.tierId
          });
        }

        return keyData;
      }

      return null;
    } catch (error) {
      console.error('Error checking API key status:', error);
      return null;
    }
  }

  // Update API key
  async updateApiKey() {
    try {
      console.log('🔄 Requesting API key update');

      // This would typically be handled by the main process
      // sending a request to update the API key
      if (typeof window !== 'undefined' && window.electronAPI) {
        window.electronAPI.send('update-api-key', {
          userId: this.userId,
          currentTier: this.currentTier?.tierId
        });
      }

      this.emit('api-key-update-requested', {
        userId: this.userId,
        tierId: this.currentTier?.tierId
      });

    } catch (error) {
      console.error('Error updating API key:', error);
      this.emit('api-key-update-error', error);
    }
  }

  // ============================================================================
  // UI UPDATE METHODS
  // ============================================================================

  // Update feature visibility based on tier
  updateFeatureVisibility(features) {
    // This would update the UI to show/hide features based on the current tier
    const featureElements = {
      'advanced_ai': document.querySelectorAll('[data-feature="advanced_ai"]'),
      'team_collaboration': document.querySelectorAll('[data-feature="team_collaboration"]'),
      'priority_support': document.querySelectorAll('[data-feature="priority_support"]'),
      'unlimited_projects': document.querySelectorAll('[data-feature="unlimited_projects"]'),
      'enterprise_sso': document.querySelectorAll('[data-feature="enterprise_sso"]'),
      'advanced_analytics': document.querySelectorAll('[data-feature="advanced_analytics"]')
    };

    Object.entries(featureElements).forEach(([feature, elements]) => {
      const isEnabled = features.includes(feature);
      elements.forEach(element => {
        if (isEnabled) {
          element.style.display = '';
          element.classList.remove('feature-disabled');
        } else {
          element.style.display = 'none';
          element.classList.add('feature-disabled');
        }
      });
    });
  }

  // Update limit displays
  updateLimitDisplays(limits) {
    if (!limits) return;

    // Update UI elements that show limits
    const limitElements = {
      'ai_tokens': document.querySelectorAll('[data-limit="ai_tokens"]'),
      'api_calls': document.querySelectorAll('[data-limit="api_calls"]'),
      'storage': document.querySelectorAll('[data-limit="storage"]'),
      'team_members': document.querySelectorAll('[data-limit="team_members"]')
    };

    Object.entries(limitElements).forEach(([limit, elements]) => {
      const value = limits[limit];
      if (value) {
        const formattedValue = this.formatLimitValue(limit, value);
        elements.forEach(element => {
          element.textContent = formattedValue;
        });
      }
    });
  }

  // Update tier name displays
  updateTierNameDisplays(tierName) {
    const tierElements = document.querySelectorAll('[data-tier-name]');
    tierElements.forEach(element => {
      element.textContent = tierName;
    });
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  // HTTP request helper
  async request(endpoint, options = {}) {
    const url = `${this.apiUrl}${endpoint}`;
    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    if (this.apiKey) {
      config.headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();

      return {
        success: true,
        data
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Format limit values for display
  formatLimitValue(limitType, value) {
    switch (limitType) {
      case 'storage':
        return this.formatBytes(value);
      case 'ai_tokens':
      case 'api_calls':
        return this.formatNumber(value);
      default:
        return value.toString();
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatNumber(num) {
    return new Intl.NumberFormat().format(num);
  }

  generateDeviceId() {
    return `electron_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // ============================================================================
  // ADDITIONAL UTILITY METHODS
  // ============================================================================

  // Refresh usage stats from server
  async refreshUsageStats() {
    try {
      const stats = await this.getUsageStats();
      if (stats) {
        this.usageStats = stats;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error refreshing usage stats:', error);
      return false;
    }
  }

  // Format metric names for display
  formatMetricName(metric) {
    const nameMap = {
      aiTokens: 'AI Tokens',
      apiCalls: 'API Calls',
      storage: 'Storage',
      teamMembers: 'Team Members',
      projects: 'Projects',
      chats: 'Chats',
      messages: 'Messages',
      fileUploads: 'File Uploads',
      fileSize: 'File Size'
    };

    return nameMap[metric] || metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  // ============================================================================
  // PUBLIC API METHODS
  // ============================================================================

  // Get fallback mode status
  isInFallbackMode() {
    return this.usageEnforcement?.fallbackMode || false;
  }

  // Get custom API key status
  hasCustomApiKey() {
    return !!(this.usageEnforcement?.customApiKey);
  }

  // Get exceeded metrics
  getExceededMetrics() {
    return Array.from(this.usageEnforcement?.exceededMetrics || []);
  }

  // Get usage enforcement status
  getUsageEnforcementStatus() {
    return {
      fallbackMode: this.isInFallbackMode(),
      customApiKeyConfigured: this.hasCustomApiKey(),
      exceededMetrics: this.getExceededMetrics(),
      gracePeriodEnd: this.usageEnforcement?.gracePeriodEnd || null,
      customApiKeyProvider: this.usageEnforcement?.customApiKey?.provider || null
    };
  }

  // Force refresh of all data
  async forceRefresh() {
    console.log('🔄 Forcing full refresh of tier and usage data');

    await Promise.all([
      this.checkTierUpdates(),
      this.refreshUsageStats()
    ]);

    return {
      tier: this.currentTier,
      limits: this.currentLimits,
      usage: this.usageStats,
      enforcement: this.getUsageEnforcementStatus()
    };
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
  // PUBLIC API
  // ============================================================================

  // Get current tier information
  getCurrentTier() {
    return this.currentTier;
  }

  // Get current limits
  getCurrentLimits() {
    return this.currentLimits;
  }

  // Get usage statistics
  getUsageStats() {
    return this.usageStats;
  }

  // Manually trigger tier check
  async refreshTier() {
    await this.checkTierUpdates();
  }

  // Force API key update
  async forceApiKeyUpdate() {
    await this.updateApiKey();
  }

  // Cleanup
  destroy() {
    this.stopTierMonitoring();
    this.listeners.clear();
  }
}

// ============================================================================
// ELECTRON INTEGRATION
// ============================================================================

// For Electron main process
function createElectronTierManager(options = {}) {
  return new ElectronTierClient(options);
}

// For Electron renderer process (React/Vue/Angular components)
function useElectronTierManager(options = {}) {
  // This would be implemented as a React hook
  // For now, return a singleton instance
  if (typeof window !== 'undefined' && window.electronTierManager) {
    return window.electronTierManager;
  }

  const manager = new ElectronTierClient(options);

  if (typeof window !== 'undefined') {
    window.electronTierManager = manager;
  }

  return manager;
}

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

if (typeof window !== 'undefined') {
  window.ElectronTierClient = ElectronTierClient;
  window.createElectronTierManager = createElectronTierManager;
  window.useElectronTierManager = useElectronTierManager;
}

module.exports = {
  ElectronTierClient,
  createElectronTierManager,
  useElectronTierManager
};
