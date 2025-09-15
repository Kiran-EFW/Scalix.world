// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api'

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const token = typeof window !== 'undefined' ? localStorage.getItem('scalix_auth_token') : null

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        errorData.message || `HTTP ${response.status}`,
        response.status,
        errorData.code
      )
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return await response.json()
    }

    return {} as T
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    // Network or other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    )
  }
}

// Authentication API
export const authApi = {
  signIn: (email: string, password: string) =>
    apiRequest<{ user: any; token: string }>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  signUp: (email: string, password: string, name?: string) =>
    apiRequest<{ user: any; token: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),

  signOut: () =>
    apiRequest('/auth/signout', {
      method: 'POST',
    }),

  getCurrentUser: () =>
    apiRequest<{ user: any }>('/auth/me'),

  updateProfile: (updates: any) =>
    apiRequest<{ user: any }>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

  resetPassword: (email: string) =>
    apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  verifyEmail: (token: string) =>
    apiRequest('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),
}

// Billing API
export const billingApi = {
  getSubscription: () =>
    apiRequest<{ subscription: any }>('/billing/subscription'),

  getInvoices: (page = 1, limit = 20) =>
    apiRequest<{ invoices: any[]; pagination: any }>(
      `/billing/invoices?page=${page}&limit=${limit}`
    ),

  getInvoice: (id: string) =>
    apiRequest<{ invoice: any }>(`/billing/invoices/${id}`),

  createPaymentMethod: (paymentMethodData: any) =>
    apiRequest<{ paymentMethod: any }>('/billing/payment-methods', {
      method: 'POST',
      body: JSON.stringify(paymentMethodData),
    }),

  getPaymentMethods: () =>
    apiRequest<{ paymentMethods: any[] }>('/billing/payment-methods'),

  updatePaymentMethod: (id: string, updates: any) =>
    apiRequest<{ paymentMethod: any }>(`/billing/payment-methods/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

  deletePaymentMethod: (id: string) =>
    apiRequest(`/billing/payment-methods/${id}`, {
      method: 'DELETE',
    }),

  upgradeSubscription: (planId: string) =>
    apiRequest<{ subscription: any }>('/billing/upgrade', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    }),

  cancelSubscription: () =>
    apiRequest('/billing/cancel', {
      method: 'POST',
    }),
}

// Usage API
export const usageApi = {
  getUsageStats: (period?: string) =>
    apiRequest<{ stats: any }>(`/usage/stats${period ? `?period=${period}` : ''}`),

  getUsageHistory: (page = 1, limit = 50) =>
    apiRequest<{ events: any[]; pagination: any }>(
      `/usage/history?page=${page}&limit=${limit}`
    ),

  exportUsageData: (format: 'json' | 'csv' = 'json') =>
    apiRequest<Blob>(`/usage/export?format=${format}`, {
      headers: {
        'Accept': format === 'csv' ? 'text/csv' : 'application/json',
      },
    }),
}

// Projects API
export const projectsApi = {
  getProjects: (page = 1, limit = 20) =>
    apiRequest<{ projects: any[]; pagination: any }>(
      `/projects?page=${page}&limit=${limit}`
    ),

  getProject: (id: string) =>
    apiRequest<{ project: any }>(`/projects/${id}`),

  createProject: (projectData: any) =>
    apiRequest<{ project: any }>('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    }),

  updateProject: (id: string, updates: any) =>
    apiRequest<{ project: any }>(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

  deleteProject: (id: string) =>
    apiRequest(`/projects/${id}`, {
      method: 'DELETE',
    }),
}

// Teams API
export const teamsApi = {
  getTeams: () =>
    apiRequest<{ teams: any[] }>('/teams'),

  getTeam: (id: string) =>
    apiRequest<{ team: any }>(`/teams/${id}`),

  createTeam: (teamData: any) =>
    apiRequest<{ team: any }>('/teams', {
      method: 'POST',
      body: JSON.stringify(teamData),
    }),

  updateTeam: (id: string, updates: any) =>
    apiRequest<{ team: any }>(`/teams/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

  deleteTeam: (id: string) =>
    apiRequest(`/teams/${id}`, {
      method: 'DELETE',
    }),

  inviteMember: (teamId: string, email: string, role: string) =>
    apiRequest<{ invitation: any }>(`/teams/${teamId}/members`, {
      method: 'POST',
      body: JSON.stringify({ email, role }),
    }),

  removeMember: (teamId: string, userId: string) =>
    apiRequest(`/teams/${teamId}/members/${userId}`, {
      method: 'DELETE',
    }),
}

// Admin API removed - moved to internal admin app

// API Keys API
export const apiKeysApi = {
  getApiKeys: () =>
    apiRequest<{ apiKeys: any[] }>('/api-keys'),

  createApiKey: (keyData: any) =>
    apiRequest<{ apiKey: any; secret: string }>('/api-keys', {
      method: 'POST',
      body: JSON.stringify(keyData),
    }),

  deleteApiKey: (id: string) =>
    apiRequest(`/api-keys/${id}`, {
      method: 'DELETE',
    }),
}

// Support API
export const supportApi = {
  createTicket: (ticketData: any) =>
    apiRequest<{ ticket: any }>('/support/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    }),

  getTickets: (page = 1, limit = 20) =>
    apiRequest<{ tickets: any[]; pagination: any }>(
      `/support/tickets?page=${page}&limit=${limit}`
    ),

  getTicket: (id: string) =>
    apiRequest<{ ticket: any }>(`/support/tickets/${id}`),

  addTicketMessage: (ticketId: string, message: string) =>
    apiRequest<{ message: any }>(`/support/tickets/${ticketId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),
}

// Utility functions
export function handleApiError(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return 'Invalid request. Please check your input.'
      case 401:
        return 'Please sign in to continue.'
      case 403:
        return 'You don\'t have permission to perform this action.'
      case 404:
        return 'The requested resource was not found.'
      case 429:
        return 'Too many requests. Please try again later.'
      case 500:
        return 'Server error. Please try again later.'
      default:
        return error.message
    }
  }
  return 'An unexpected error occurred.'
}

export { ApiError }
