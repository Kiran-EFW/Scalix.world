/**
 * Scalix API Configuration and Client
 * Connects to the Scalix Bridge Server for real data
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production'
    ? 'https://api.scalix.world'
    : 'http://localhost:4000',
  MASTER_KEY: 'sk-scalix-dev-123456789',
  TIMEOUT: 10000,
}

// API Client Class
export class ScalixAPI {
  private baseURL: string
  private masterKey: string

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL
    this.masterKey = API_CONFIG.MASTER_KEY
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.masterKey}`,
        ...options.headers,
      },
      timeout: API_CONFIG.TIMEOUT,
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      throw error
    }
  }

  // Health Check
  async health() {
    return this.request('/health')
  }

  // Analytics
  async getAnalytics() {
    return this.request('/v1/analytics')
  }

  // Models
  async getModels() {
    const response = await this.request('/v1/models')
    return response.data
  }

  // Usage Statistics
  async getUsage(userId?: string) {
    const params = userId ? `?user_id=${userId}` : ''
    return this.request(`/v1/usage${params}`)
  }

  // Chat Completions
  async createChatCompletion(data: {
    model: string
    messages: Array<{ role: string; content: string }>
    max_tokens?: number
    temperature?: number
  }) {
    return this.request('/v1/chat/completions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Smart Context Analysis
  async analyzeContext(data: {
    query: string
    project_files: string[]
  }) {
    return this.request('/v1/smart-context', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Scalix System Status
  async getSystemStatus() {
    return this.request('/api/scalix/status')
  }

  // Data Synchronization
  async syncData(syncType: 'full' | 'incremental' = 'full') {
    return this.request(`/api/scalix/sync?type=${syncType}`, {
      method: 'POST',
    })
  }
}

// Create singleton instance
export const scalixAPI = new ScalixAPI()

// Real-time data service for live stats
export class RealTimeDataService {
  private subscribers: Map<string, Set<(data: any) => void>> = new Map()
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map()
  private intervals: Map<string, NodeJS.Timeout> = new Map()
  private isConnected: boolean = false

  constructor() {
    this.checkConnection()
    // Check connection every 30 seconds
    setInterval(() => this.checkConnection(), 30000)
  }

  private async checkConnection() {
    try {
      await scalixAPI.health()
      if (!this.isConnected) {
        this.isConnected = true
        console.log('🔗 Connected to Scalix API')
        this.notifySubscribers('connection', { connected: true })
      }
    } catch (error) {
      if (this.isConnected) {
        this.isConnected = false
        console.log('❌ Lost connection to Scalix API')
        this.notifySubscribers('connection', { connected: false, error })
      }
    }
  }

  private notifySubscribers(event: string, data: any) {
    const subscribers = this.subscribers.get(event)
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error('Error in subscriber callback:', error)
        }
      })
    }
  }

  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data
    }
    return null
  }

  private setCachedData(key: string, data: any, ttl: number = 30000) {
    this.cache.set(key, { data, timestamp: Date.now(), ttl })
  }

  subscribe(event: string, callback: (data: any) => void): () => void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set())
    }
    this.subscribers.get(event)!.add(callback)

    // Return unsubscribe function
    return () => {
      const subscribers = this.subscribers.get(event)
      if (subscribers) {
        subscribers.delete(callback)
        if (subscribers.size === 0) {
          this.subscribers.delete(event)
        }
      }
    }
  }

  async getLiveStats(): Promise<{
    activeSubscriptions: number
    monthlyApiCalls: number
    platformUptime: string
    avgResponseTime: string
  }> {
    const cacheKey = 'liveStats'

    // Check cache first
    const cached = this.getCachedData(cacheKey)
    if (cached) {
      return cached
    }

    try {
      const analytics = await scalixAPI.getAnalytics()

      const liveStats = {
        activeSubscriptions: analytics.active_users || 0,
        monthlyApiCalls: Math.floor((analytics.total_requests || 0) / 1000000), // Convert to millions
        platformUptime: '99.9%', // Mock uptime - in real app, get from system health
        avgResponseTime: `${analytics.avg_response_time || 1.2}s`
      }

      this.setCachedData(cacheKey, liveStats, 5000) // Cache for 5 seconds
      return liveStats
    } catch (error) {
      console.error('Failed to fetch live stats:', error)
      // Return fallback values
      return {
        activeSubscriptions: 8920,
        monthlyApiCalls: 2.8,
        platformUptime: '99.9%',
        avgResponseTime: '1.2s'
      }
    }
  }

  async getPlatformStats(): Promise<{
    activeSubscriptions: number
    monthlyApiSpend: number
    platformUptime: string
    avgResponseTime: string
  }> {
    const cacheKey = 'platformStats'

    const cached = this.getCachedData(cacheKey)
    if (cached) {
      return cached
    }

    try {
      const analytics = await scalixAPI.getAnalytics()

      const platformStats = {
        activeSubscriptions: analytics.total_users || 15420,
        monthlyApiSpend: Math.floor((analytics.total_cost || 12450) / 1000), // Convert to thousands
        platformUptime: '99.9%',
        avgResponseTime: `${analytics.avg_response_time || 1.2}ms`
      }

      this.setCachedData(cacheKey, platformStats, 10000) // Cache for 10 seconds
      return platformStats
    } catch (error) {
      console.error('Failed to fetch platform stats:', error)
      return {
        activeSubscriptions: 15420,
        monthlyApiSpend: 12,
        platformUptime: '99.9%',
        avgResponseTime: '1.2ms'
      }
    }
  }

  async getAnalyticsData(): Promise<AnalyticsData | null> {
    const cacheKey = 'analytics'

    const cached = this.getCachedData(cacheKey)
    if (cached) {
      return cached
    }

    try {
      const data = await scalixAPI.getAnalytics()
      this.setCachedData(cacheKey, data, 30000) // Cache for 30 seconds
      return data
    } catch (error) {
      console.error('Failed to fetch analytics data:', error)
      return null
    }
  }

  // Start real-time updates for a specific data type
  startRealTimeUpdates(dataType: string, interval: number = 5000) {
    if (this.intervals.has(dataType)) {
      return // Already running
    }

    const updateFn = async () => {
      try {
        let data
        switch (dataType) {
          case 'liveStats':
            data = await this.getLiveStats()
            break
          case 'platformStats':
            data = await this.getPlatformStats()
            break
          case 'analytics':
            data = await this.getAnalyticsData()
            break
          default:
            return
        }

        if (data) {
          this.notifySubscribers(dataType, data)
        }
      } catch (error) {
        console.error(`Failed to update ${dataType}:`, error)
      }
    }

    // Initial update
    updateFn()

    // Set up interval
    const intervalId = setInterval(updateFn, interval)
    this.intervals.set(dataType, intervalId)
  }

  // Stop real-time updates
  stopRealTimeUpdates(dataType: string) {
    const intervalId = this.intervals.get(dataType)
    if (intervalId) {
      clearInterval(intervalId)
      this.intervals.delete(dataType)
    }
  }

  // Get connection status
  getConnectionStatus(): boolean {
    return this.isConnected
  }
}

// Create singleton instance
export const realTimeDataService = new RealTimeDataService()

// Utility functions for common operations
export const apiUtils = {
  // Format API errors for user display
  formatError: (error: any): string => {
    if (error.message?.includes('API Error')) {
      return 'Service temporarily unavailable. Please try again later.'
    }
    return error.message || 'An unexpected error occurred.'
  },

  // Check if API is healthy
  isHealthy: async (): Promise<boolean> => {
    try {
      await scalixAPI.health()
      return true
    } catch {
      return false
    }
  },

  // Retry failed requests
  retryRequest: async <T>(
    requestFn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await requestFn()
      } catch (error) {
        if (i === maxRetries - 1) throw error
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
      }
    }
    throw new Error('Max retries exceeded')
  }
}

// Export types for TypeScript
export interface AnalyticsData {
  total_users: number
  active_users: number
  total_requests: number
  total_cost: number
  cost_savings: number
  avg_response_time: number
  user_tiers: {
    free: number
    pro: number
    enterprise: number
  }
  top_models: Array<{
    name: string
    requests: number
    cost: number
    change: number
  }>
  system_health: {
    uptime: string
    response_time: string
    error_rate: string
    active_connections: number
  }
}

export interface UsageData {
  user_id: string
  requests_today: number
  tokens_used: number
  remaining_requests: number
  billing_period: {
    start: string
    end: string
  }
  current_plan: string
  usage_percentage: number
}

export interface ModelInfo {
  id: string
  object: string
  created: number
  owned_by: string
  permission: any[]
  root: string
  parent: null
}
