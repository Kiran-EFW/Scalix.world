// ============================================================================
// SCALIX WEB CLIENT - FIXED VERSION
// ============================================================================
// Standalone client implementation that doesn't depend on scalix-cloud-api
// Can be deployed independently while maintaining compatibility
// ============================================================================

interface ScalixClientOptions {
  baseUrl?: string;
  apiKey?: string;
  userId?: string;
  application?: string;
  syncEnabled?: boolean;
  realTimeEnabled?: boolean;
  cacheEnabled?: boolean;
}

interface UserContext {
  id: string;
  email: string;
  name?: string;
  plan: string;
  role: string;
  permissions: string[];
  featureFlags: Record<string, boolean>;
}

interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  error?: string;
  metadata?: any;
}

class ScalixWebClient {
  private baseUrl: string;
  private apiKey?: string;
  private userId?: string;
  private application: string;
  private cache: Map<string, any>;
  private listeners: Map<string, Function[]>;

  constructor(options: ScalixClientOptions = {}) {
    this.baseUrl = options.baseUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    this.apiKey = options.apiKey;
    this.userId = options.userId;
    this.application = options.application || 'web';
    this.cache = new Map();
    this.listeners = new Map();

    console.log(`🌐 Scalix Web Client initialized for ${this.application}`);
  }

  // ============================================================================
  // CORE HTTP METHODS
  // ============================================================================

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Application': this.application,
        ...options.headers
      },
      ...options
    };

    // Add API key if available
    if (this.apiKey) {
      (config.headers as any)['Authorization'] = `Bearer ${this.apiKey}`;
    }

    // Add body for non-GET requests
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
        data,
        success: true
      };

    } catch (error) {
      console.error(`❌ API request failed: ${endpoint}`, error);
      return {
        data: null,
        success: false,
        error: error.message
      };
    }
  }

  // ============================================================================
  // AUTHENTICATION METHODS
  // ============================================================================

  async signIn(email: string, password: string) {
    return this.request('/api/auth/signin', {
      method: 'POST',
      body: { email, password }
    });
  }

  async signUp(email: string, password: string, name?: string) {
    return this.request('/api/auth/signup', {
      method: 'POST',
      body: { email, password, name }
    });
  }

  async signOut() {
    const result = await this.request('/api/auth/signout', {
      method: 'POST'
    });

    if (result.success) {
      this.clearCache();
      this.userId = undefined;
      this.apiKey = undefined;
    }

    return result;
  }

  async getCurrentUser() {
    return this.request<UserContext>('/api/auth/me');
  }

  async updateProfile(updates: any) {
    return this.request('/api/auth/profile', {
      method: 'PATCH',
      body: updates
    });
  }

  // ============================================================================
  // DATA METHODS
  // ============================================================================

  async getDashboard() {
    return this.request('/api/dashboard');
  }

  async getUsage() {
    return this.request('/api/usage');
  }

  async getApiKeys() {
    return this.request('/api/api-keys');
  }

  async createApiKey(name: string) {
    return this.request('/api/api-keys', {
      method: 'POST',
      body: { name }
    });
  }

  async deleteApiKey(keyId: string) {
    return this.request(`/api/api-keys/${keyId}`, {
      method: 'DELETE'
    });
  }

  async getPlans() {
    return this.request('/api/plans');
  }

  async getBilling() {
    return this.request('/api/billing');
  }

  async upgradePlan(planId: string) {
    return this.request('/api/billing/upgrade', {
      method: 'POST',
      body: { planId }
    });
  }

  // ============================================================================
  // NOTIFICATION METHODS
  // ============================================================================

  async getNotifications() {
    return this.request('/api/notifications');
  }

  async markNotificationRead(notificationId: string) {
    return this.request('/api/notifications/mark-read', {
      method: 'POST',
      body: { notificationId, userId: this.userId }
    });
  }

  // ============================================================================
  // CACHE MANAGEMENT
  // ============================================================================

  private getCacheKey(endpoint: string, params?: any): string {
    return `${endpoint}_${JSON.stringify(params || {})}`;
  }

  private setCache(key: string, data: any, ttl: number = 300000) { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private getCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clearCache() {
    this.cache.clear();
  }

  // ============================================================================
  // EVENT SYSTEM
  // ============================================================================

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  isAuthenticated(): boolean {
    return !!(this.apiKey && this.userId);
  }

  // ============================================================================
  // ADMIN METHODS REMOVED - moved to internal admin app
  // ============================================================================
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let scalixClient: ScalixWebClient | null = null;

export function getScalixClient(options?: ScalixClientOptions): ScalixWebClient {
  if (!scalixClient) {
    scalixClient = new ScalixWebClient(options);
  }
  return scalixClient;
}

export function initializeScalixClient(apiKey?: string, userId?: string) {
  const client = getScalixClient();
  if (apiKey) client.setApiKey(apiKey);
  if (userId) client.setUserId(userId);
  return client;
}

// ============================================================================
// REACT HOOKS
// ============================================================================

export function useScalixClient() {
  return getScalixClient();
}

export default ScalixWebClient;
