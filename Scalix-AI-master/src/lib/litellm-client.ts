/**
 * LiteLLM Client for Scalix Electron App
 * Handles communication with the LiteLLM proxy server
 */

import { IpcClient } from '../ipc/ipc_client'

export interface LiteLLMConfig {
  baseUrl: string
  masterKey: string
  defaultModel: string
  fallbackModels: string[]
  timeout: number
  retryAttempts: number
  rateLimitBuffer: number
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatCompletionRequest {
  model: string
  messages: ChatMessage[]
  max_tokens?: number
  temperature?: number
  stream?: boolean
}

export interface ChatCompletionResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: ChatMessage
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  processing_time?: number
}

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

export class LiteLLMClient {
  private config: LiteLLMConfig | null = null
  private ipcClient: IpcClient

  constructor() {
    this.ipcClient = IpcClient.getInstance()
  }

  async initialize(): Promise<void> {
    try {
      this.config = await this.ipcClient.request('get-litellm-config')
    } catch (error) {
      console.error('Failed to load LiteLLM config:', error)
      // Fallback configuration
      this.config = {
        baseUrl: 'http://localhost:4000',
        masterKey: 'sk-scalix-dev-123456789',
        defaultModel: 'gpt-4',
        fallbackModels: ['claude-3-opus-20240229', 'scalix-engine'],
        timeout: 30000,
        retryAttempts: 3,
        rateLimitBuffer: 0.8
      }
    }
  }

  async createChatCompletion(
    request: ChatCompletionRequest,
    retryCount = 0
  ): Promise<ChatCompletionResponse> {
    if (!this.config) {
      await this.initialize()
    }

    const payload = {
      ...request,
      model: request.model || this.config!.defaultModel
    }

    try {
      const response = await fetch(`${this.config!.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config!.masterKey}`,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(this.config!.timeout)
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Chat completion failed (attempt ${retryCount + 1}):`, error)

      // Retry with fallback models if available
      if (retryCount < this.config!.retryAttempts - 1) {
        const fallbackModel = this.config!.fallbackModels[retryCount]
        if (fallbackModel) {
          console.log(`Retrying with fallback model: ${fallbackModel}`)
          return this.createChatCompletion(
            { ...request, model: fallbackModel },
            retryCount + 1
          )
        }
      }

      throw error
    }
  }

  async getAnalytics(): Promise<AnalyticsData> {
    if (!this.config) {
      await this.initialize()
    }

    const response = await fetch(`${this.config!.baseUrl}/v1/analytics`, {
      headers: {
        'Authorization': `Bearer ${this.config!.masterKey}`,
      },
      signal: AbortSignal.timeout(this.config!.timeout)
    })

    if (!response.ok) {
      throw new Error(`Analytics API Error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  }

  async getModels(): Promise<any[]> {
    if (!this.config) {
      await this.initialize()
    }

    const response = await fetch(`${this.config!.baseUrl}/v1/models`, {
      headers: {
        'Authorization': `Bearer ${this.config!.masterKey}`,
      },
      signal: AbortSignal.timeout(this.config!.timeout)
    })

    if (!response.ok) {
      throw new Error(`Models API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.data
  }

  async getUsage(userId?: string): Promise<any> {
    if (!this.config) {
      await this.initialize()
    }

    const params = userId ? `?user_id=${userId}` : ''
    const response = await fetch(`${this.config!.baseUrl}/v1/usage${params}`, {
      headers: {
        'Authorization': `Bearer ${this.config!.masterKey}`,
      },
      signal: AbortSignal.timeout(this.config!.timeout)
    })

    if (!response.ok) {
      throw new Error(`Usage API Error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  }

  async healthCheck(): Promise<{ status: string; uptime_seconds: number }> {
    if (!this.config) {
      await this.initialize()
    }

    const response = await fetch(`${this.config!.baseUrl}/health`, {
      signal: AbortSignal.timeout(5000) // Shorter timeout for health checks
    })

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`)
    }

    return await response.json()
  }

  // Utility method to check if the service is available
  async isAvailable(): Promise<boolean> {
    try {
      await this.healthCheck()
      return true
    } catch {
      return false
    }
  }
}

// Export singleton instance
export const litellmClient = new LiteLLMClient()
