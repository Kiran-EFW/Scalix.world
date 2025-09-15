// ============================================================================
// SCALIX CLIENT SDK
// ============================================================================
// Unified client library for all Scalix applications to interact with the
// cloud API and maintain data consistency across web, internal-admin, and electron apps
// ============================================================================

class ScalixClient {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || 'http://localhost:8080';
    this.apiKey = options.apiKey;
    this.application = options.application || 'web';
    this.version = options.version || '1.0.0';

    // Data sync settings
    this.syncEnabled = options.syncEnabled !== false;
    this.realTimeEnabled = options.realTimeEnabled || false;
    this.cacheEnabled = options.cacheEnabled !== false;

    // Internal state
    this.cache = new Map();
    this.listeners = new Map();
    this.syncInterval = null;

    // Initialize
    this.initialize();
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  async initialize() {
    console.log(`🚀 Initializing Scalix Client SDK v${this.version} for ${this.application}`);

    if (this.syncEnabled) {
      this.startPeriodicSync();
    }

    if (this.realTimeEnabled) {
      this.initializeRealtime();
    }

    // Test connection
    await this.testConnection();
  }

  async testConnection() {
    try {
      const response = await this.request('/health');
      console.log(`✅ Connected to Scalix Cloud API: ${response.version}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to connect to Scalix Cloud API:', error);
      return false;
    }
  }

  // ============================================================================
  // HTTP REQUEST METHODS
  // ============================================================================

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Application': this.application,
        'X-Client-Version': this.version,
        ...options.headers
      },
      ...options
    };

    // Add API key if available
    if (this.apiKey) {
      config.headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    // Add body for non-GET requests
    if (options.data && config.method !== 'GET') {
      config.body = JSON.stringify(options.data);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return await response.json();
  }

  // ============================================================================
  // DATA MANAGEMENT METHODS
  // ============================================================================

  // Get data with caching and sync
  async getData(collection, filters = {}, options = {}) {
    const cacheKey = this.generateCacheKey(collection, filters);

    // Check cache first
    if (this.cacheEnabled && this.cache.has(cacheKey) && !options.skipCache) {
      const cached = this.cache.get(cacheKey);
      if (this.isCacheValid(cached)) {
        return cached.data;
      }
    }

    // Fetch from API
    const data = await this.request(`/api/${collection}`, {
      method: 'GET',
      data: filters
    });

    // Cache the result
    if (this.cacheEnabled) {
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        collection,
        filters
      });
    }

    return data;
  }

  // Create new data
  async createData(collection, data) {
    const result = await this.request(`/api/${collection}`, {
      method: 'POST',
      data
    });

    // Invalidate relevant caches
    this.invalidateCache(collection);

    // Notify listeners
    this.notifyListeners(collection, 'create', result);

    return result;
  }

  // Update existing data
  async updateData(collection, id, data) {
    const result = await this.request(`/api/${collection}/${id}`, {
      method: 'PUT',
      data
    });

    // Invalidate relevant caches
    this.invalidateCache(collection, id);

    // Notify listeners
    this.notifyListeners(collection, 'update', result);

    return result;
  }

  // Delete data
  async deleteData(collection, id) {
    const result = await this.request(`/api/${collection}/${id}`, {
      method: 'DELETE'
    });

    // Invalidate relevant caches
    this.invalidateCache(collection, id);

    // Notify listeners
    this.notifyListeners(collection, 'delete', { id });

    return result;
  }

  // ============================================================================
  // USER CONTEXT METHODS
  // ============================================================================

  // Get current user context
  async getUserContext() {
    return await this.request('/api/user/context');
  }

  // Update user preferences
  async updateUserPreferences(preferences) {
    return await this.request('/api/user/preferences', {
      method: 'PATCH',
      data: { preferences }
    });
  }

  // Get user-specific data
  async getUserData(collection, options = {}) {
    const filters = {
      userId: 'current', // API will resolve this
      ...options.filters
    };

    return await this.getData(collection, filters, options);
  }

  // ============================================================================
  // SYNCHRONIZATION METHODS
  // ============================================================================

  // Get sync status
  async getSyncStatus() {
    return await this.request('/api/sync/status');
  }

  // Trigger manual sync
  async triggerSync(targetApp, collections) {
    return await this.request('/api/sync/trigger', {
      method: 'POST',
      data: {
        sourceApp: this.application,
        targetApp,
        collections
      }
    });
  }

  // Clear local cache
  clearCache(collection = null) {
    if (collection) {
      // Clear specific collection cache
      for (const [key, value] of this.cache.entries()) {
        if (value.collection === collection) {
          this.cache.delete(key);
        }
      }
    } else {
      // Clear all cache
      this.cache.clear();
    }

    console.log(`🗑️  Cleared ${collection ? collection : 'all'} cache`);
  }

  // Start periodic sync
  startPeriodicSync(interval = 30000) { // 30 seconds default
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(async () => {
      await this.performBackgroundSync();
    }, interval);

    console.log(`🔄 Started periodic sync every ${interval / 1000}s`);
  }

  // Stop periodic sync
  stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('⏹️  Stopped periodic sync');
    }
  }

  // Perform background sync
  async performBackgroundSync() {
    try {
      // Sync critical data collections
      const collections = ['plans', 'user', 'notifications'];

      for (const collection of this.getDirtyCollections()) {
        await this.syncCollection(collection);
      }
    } catch (error) {
      console.error('Background sync failed:', error);
    }
  }

  // Sync specific collection
  async syncCollection(collection) {
    try {
      const serverData = await this.getData(collection, {}, { skipCache: true });
      const localData = this.cache.get(this.generateCacheKey(collection, {}));

      if (this.hasDataChanged(localData?.data, serverData)) {
        // Update local cache
        this.cache.set(this.generateCacheKey(collection, {}), {
          data: serverData,
          timestamp: Date.now(),
          collection,
          filters: {}
        });

        // Notify listeners
        this.notifyListeners(collection, 'sync', serverData);

        console.log(`🔄 Synced ${collection}: ${Array.isArray(serverData) ? serverData.length : 1} items`);
      }
    } catch (error) {
      console.error(`Failed to sync ${collection}:`, error);
    }
  }

  // ============================================================================
  // REAL-TIME METHODS
  // ============================================================================

  // Initialize real-time connections
  initializeRealtime() {
    if (typeof WebSocket !== 'undefined') {
      this.initializeWebSocket();
    } else {
      // Fallback to polling for non-browser environments
      this.startPollingSync();
    }
  }

  // WebSocket connection for real-time updates
  initializeWebSocket() {
    const wsUrl = this.baseUrl.replace(/^http/, 'ws') + '/realtime';

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('🔌 Connected to real-time updates');
        this.ws.send(JSON.stringify({
          type: 'subscribe',
          application: this.application,
          collections: ['plans', 'user', 'notifications']
        }));
      };

      this.ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        this.handleRealtimeMessage(message);
      };

      this.ws.onclose = () => {
        console.log('🔌 Disconnected from real-time updates');
        // Reconnect after delay
        setTimeout(() => this.initializeWebSocket(), 5000);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
      this.startPollingSync();
    }
  }

  // Handle real-time messages
  handleRealtimeMessage(message) {
    const { type, collection, data } = message;

    switch (type) {
      case 'update':
        this.handleDataUpdate(collection, data);
        break;
      case 'delete':
        this.handleDataDelete(collection, data);
        break;
      case 'create':
        this.handleDataCreate(collection, data);
        break;
      default:
        console.log('Unknown real-time message type:', type);
    }
  }

  // Handle data updates
  handleDataUpdate(collection, data) {
    // Update cache
    const cacheKey = this.generateCacheKey(collection, {});
    const cached = this.cache.get(cacheKey);

    if (cached) {
      // Update the cached data
      this.cache.set(cacheKey, {
        ...cached,
        data,
        timestamp: Date.now()
      });
    }

    // Notify listeners
    this.notifyListeners(collection, 'update', data);
  }

  // Handle data creation
  handleDataCreate(collection, data) {
    // Add to cache if applicable
    const cacheKey = this.generateCacheKey(collection, {});
    const cached = this.cache.get(cacheKey);

    if (cached && Array.isArray(cached.data)) {
      this.cache.set(cacheKey, {
        ...cached,
        data: [...cached.data, data],
        timestamp: Date.now()
      });
    }

    // Notify listeners
    this.notifyListeners(collection, 'create', data);
  }

  // Handle data deletion
  handleDataDelete(collection, data) {
    // Remove from cache
    const cacheKey = this.generateCacheKey(collection, {});
    const cached = this.cache.get(cacheKey);

    if (cached && Array.isArray(cached.data)) {
      const filteredData = cached.data.filter(item => item.id !== data.id);
      this.cache.set(cacheKey, {
        ...cached,
        data: filteredData,
        timestamp: Date.now()
      });
    }

    // Notify listeners
    this.notifyListeners(collection, 'delete', data);
  }

  // Start polling for environments without WebSocket
  startPollingSync(interval = 60000) { // 1 minute default
    console.log('📡 Starting polling sync for real-time updates');

    setInterval(async () => {
      await this.performBackgroundSync();
    }, interval);
  }

  // ============================================================================
  // EVENT LISTENERS
  // ============================================================================

  // Subscribe to data changes
  onDataChange(collection, callback) {
    if (!this.listeners.has(collection)) {
      this.listeners.set(collection, []);
    }

    this.listeners.get(collection).push(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(collection);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }

  // Notify listeners of data changes
  notifyListeners(collection, event, data) {
    const listeners = this.listeners.get(collection);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(event, data);
        } catch (error) {
          console.error('Listener callback error:', error);
        }
      });
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  generateCacheKey(collection, filters) {
    const filterStr = JSON.stringify(filters);
    return `${collection}:${btoa(filterStr)}`;
  }

  isCacheValid(cached, maxAge = 300000) { // 5 minutes default
    return cached && (Date.now() - cached.timestamp) < maxAge;
  }

  invalidateCache(collection, id = null) {
    if (id) {
      // Invalidate specific item
      const cacheKey = this.generateCacheKey(collection, { id });
      this.cache.delete(cacheKey);
    } else {
      // Invalidate entire collection
      for (const [key, value] of this.cache.entries()) {
        if (value.collection === collection) {
          this.cache.delete(key);
        }
      }
    }
  }

  hasDataChanged(localData, serverData) {
    if (!localData) return true;
    return JSON.stringify(localData) !== JSON.stringify(serverData);
  }

  getDirtyCollections() {
    // Return collections that might have changes
    // In a real implementation, this would track dirty state
    return ['plans', 'user', 'notifications'];
  }

  // ============================================================================
  // APPLICATION-SPECIFIC METHODS
  // ============================================================================

  // Web application specific methods
  async getPublicPlans() {
    return await this.getData('plans', { isActive: true, isPublic: true });
  }

  async getUserDashboard() {
    return await this.getUserData('dashboard');
  }

  // Internal admin specific methods
  async getAdminStats() {
    return await this.getData('admin/stats');
  }

  async getSystemHealth() {
    return await this.getData('admin/health');
  }

  // Electron app specific methods
  async getDesktopSync() {
    return await this.request('/api/desktop/sync');
  }

  async updateDesktopSettings(settings) {
    return await this.request('/api/desktop/settings', {
      method: 'POST',
      data: { settings }
    });
  }
}

// ============================================================================
// FACTORY FUNCTIONS
// ============================================================================

// Create client for web application
function createWebClient(options = {}) {
  return new ScalixClient({
    application: 'web',
    baseUrl: options.baseUrl || 'http://localhost:8080',
    syncEnabled: true,
    realTimeEnabled: true,
    ...options
  });
}

// Create client for internal admin
function createInternalAdminClient(options = {}) {
  return new ScalixClient({
    application: 'internal-admin',
    baseUrl: options.baseUrl || 'http://localhost:8080',
    syncEnabled: true,
    realTimeEnabled: true,
    ...options
  });
}

// Create client for electron app
function createElectronClient(options = {}) {
  return new ScalixClient({
    application: 'electron',
    baseUrl: options.baseUrl || 'http://localhost:8080',
    syncEnabled: true,
    realTimeEnabled: false, // WebSocket might not be available
    ...options
  });
}

// ============================================================================
// BROWSER-SPECIFIC UTILITIES
// ============================================================================

// Auto-initialize for browser environments
if (typeof window !== 'undefined') {
  // Make available globally
  window.ScalixClient = ScalixClient;
  window.createWebClient = createWebClient;
  window.createInternalAdminClient = createInternalAdminClient;
}

module.exports = {
  ScalixClient,
  createWebClient,
  createInternalAdminClient,
  createElectronClient
};
