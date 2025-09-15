// ============================================================================
// SCALIX WEB CLIENT
// ============================================================================
// Client SDK integration for the web application
// Provides consistent data access and user context management
// ============================================================================

import { ScalixClient } from '../../scalix-cloud-api/lib/client-sdk';

class ScalixWebClient extends ScalixClient {
  constructor(options = {}) {
    super({
      application: 'web',
      baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
      syncEnabled: true,
      realTimeEnabled: true,
      cacheEnabled: true,
      ...options
    });

    this.initializeWebClient();
  }

  private async initializeWebClient() {
    console.log('🌐 Initializing Scalix Web Client');

    // Set up web-specific event listeners
    this.setupWebEventListeners();

    // Initialize user context
    await this.initializeUserContext();
  }

  // ============================================================================
  // WEB-SPECIFIC METHODS
  // ============================================================================

  private setupWebEventListeners() {
    // Handle page visibility changes for sync
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          // Page became visible, sync data
          this.performBackgroundSync();
        }
      });
    }

    // Handle online/offline events
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        console.log('🌐 Back online - syncing data');
        this.performBackgroundSync();
      });

      window.addEventListener('offline', () => {
        console.log('📴 Gone offline - using cached data');
      });
    }
  }

  private async initializeUserContext() {
    try {
      const userContext = await this.getUserContext();

      // Set up feature flags based on user context
      this.applyFeatureFlags(userContext.featureFlags);

      // Initialize real-time subscriptions
      this.setupRealtimeSubscriptions(userContext);

    } catch (error) {
      console.error('Failed to initialize user context:', error);
      // Continue with limited functionality
    }
  }

  private applyFeatureFlags(featureFlags: Record<string, boolean>) {
    // Apply feature flags to global state or context
    if (typeof window !== 'undefined') {
      window.scalixFeatureFlags = featureFlags;
    }

    // Log enabled features
    const enabledFeatures = Object.entries(featureFlags)
      .filter(([_, enabled]) => enabled)
      .map(([feature, _]) => feature);

    console.log('✅ Enabled features:', enabledFeatures);
  }

  private setupRealtimeSubscriptions(userContext: any) {
    // Subscribe to real-time updates for relevant data
    const subscriptions = [
      'user',
      'plans',
      'notifications'
    ];

    if (userContext.role === 'admin' || userContext.role === 'super_admin') {
      subscriptions.push('admin_stats', 'system_health');
    }

    subscriptions.forEach(collection => {
      this.onDataChange(collection, (event, data) => {
        // Dispatch to global state management
        this.handleRealtimeUpdate(collection, event, data);
      });
    });
  }

  private handleRealtimeUpdate(collection: string, event: string, data: any) {
    // Emit custom events for React components to listen to
    if (typeof window !== 'undefined') {
      const customEvent = new CustomEvent('scalixDataUpdate', {
        detail: { collection, event, data }
      });
      window.dispatchEvent(customEvent);
    }

    console.log(`🔄 Real-time update: ${collection} ${event}`, data);
  }

  // ============================================================================
  // PUBLIC API METHODS
  // ============================================================================

  // Get user dashboard data
  async getDashboard() {
    return await this.getUserData('dashboard');
  }

  // Get user profile
  async getProfile() {
    return await this.getUserData('profile');
  }

  // Update user profile
  async updateProfile(updates: any) {
    return await this.updateData('profile', 'current', updates);
  }

  // Get user API keys
  async getApiKeys() {
    return await this.getUserData('api-keys');
  }

  // Create new API key
  async createApiKey(name: string) {
    return await this.createData('api-keys', { name });
  }

  // Delete API key
  async deleteApiKey(keyId: string) {
    return await this.deleteData('api-keys', keyId);
  }

  // Get user billing information
  async getBillingInfo() {
    return await this.getUserData('billing');
  }

  // Get user usage statistics
  async getUsageStats(period = 'month') {
    return await this.getUserData('usage', { period });
  }

  // Get available plans
  async getAvailablePlans() {
    return await this.getData('plans', { isActive: true, isPublic: true });
  }

  // Upgrade/downgrade plan
  async changePlan(planId: string) {
    return await this.request('/api/billing/change-plan', {
      method: 'POST',
      data: { planId }
    });
  }

  // Get notifications
  async getNotifications(limit = 50) {
    return await this.getUserData('notifications', { limit });
  }

  // Mark notification as read
  async markNotificationRead(notificationId: string) {
    return await this.updateData('notifications', notificationId, { read: true });
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  // Check if user has permission
  hasPermission(permission: string): boolean {
    if (typeof window !== 'undefined' && window.scalixUserContext) {
      return window.scalixUserContext.permissions?.includes(permission) || false;
    }
    return false;
  }

  // Check user role
  getUserRole(): string {
    if (typeof window !== 'undefined' && window.scalixUserContext) {
      return window.scalixUserContext.role || 'user';
    }
    return 'user';
  }

  // Get current user context
  getCurrentUserContext() {
    if (typeof window !== 'undefined') {
      return window.scalixUserContext;
    }
    return null;
  }

  // Check if feature is enabled
  isFeatureEnabled(feature: string): boolean {
    if (typeof window !== 'undefined' && window.scalixFeatureFlags) {
      return window.scalixFeatureFlags[feature] || false;
    }
    return false;
  }

  // ============================================================================
  // REACT INTEGRATION
  // ============================================================================

  // React hook for using Scalix client
  static useScalixClient() {
    // This would be implemented as a React hook
    // For now, return a singleton instance
    return scalixWebClient;
  }

  // React hook for data fetching with loading states
  static useScalixData(collection: string, filters = {}) {
    // This would be implemented as a React hook that:
    // - Manages loading state
    // - Handles errors
    // - Subscribes to real-time updates
    // - Provides refetch capability
    return {
      data: null,
      loading: false,
      error: null,
      refetch: () => {}
    };
  }
}

// ============================================================================
// GLOBAL SINGLETON INSTANCE
// ============================================================================

let scalixWebClient: ScalixWebClient | null = null;

export function getScalixClient(options = {}): ScalixWebClient {
  if (!scalixWebClient) {
    scalixWebClient = new ScalixWebClient(options);
  }
  return scalixWebClient;
}

export function initializeScalixClient(apiKey?: string) {
  return getScalixClient({ apiKey });
}

// ============================================================================
// BROWSER GLOBALS
// ============================================================================

if (typeof window !== 'undefined') {
  // Make available globally for debugging
  window.ScalixWebClient = ScalixWebClient;
  window.getScalixClient = getScalixClient;

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      getScalixClient();
    });
  } else {
    getScalixClient();
  }
}

export default ScalixWebClient;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

declare global {
  interface Window {
    ScalixWebClient: typeof ScalixWebClient;
    getScalixClient: typeof getScalixClient;
    scalixUserContext?: any;
    scalixFeatureFlags?: Record<string, boolean>;
  }
}
