// API Service that connects to existing scalix-cloud-api
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

class ApiService {
  private static async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'x-internal-admin': 'true', // Identify as internal admin
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    return response.json()
  }

// ==========================================
// TEAM MANAGEMENT API
// ==========================================
export class TeamService {
  static async getMembers() {
    return ApiService.request('/api/admin/team/members')
  }

  static async addMember(memberData: any) {
    return ApiService.request('/api/admin/team/members', {
      method: 'POST',
      body: JSON.stringify(memberData)
    })
  }

  static async updateMember(memberId: string, updates: any) {
    return ApiService.request(`/api/admin/team/members/${memberId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    })
  }

  static async deleteMember(memberId: string) {
    return ApiService.request(`/api/admin/team/members/${memberId}`, {
      method: 'DELETE'
    })
  }

  static async getRoles() {
    return ApiService.request('/api/admin/team/roles')
  }

  static async updateRolePermissions(roleId: string, permissions: any[]) {
    return ApiService.request(`/api/admin/team/roles/${roleId}/permissions`, {
      method: 'PUT',
      body: JSON.stringify({ permissions })
    })
  }

  static async inviteMember(invitationData: any) {
    return ApiService.request('/api/admin/team/invitations', {
      method: 'POST',
      body: JSON.stringify(invitationData)
    })
  }

  static async getInvitations() {
    return ApiService.request('/api/admin/team/invitations')
  }

  static async updateInvitationStatus(invitationId: string, status: string) {
    return ApiService.request(`/api/admin/team/invitations/${invitationId}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    })
  }
}

// ==========================================
// METRICS & ANALYTICS API
// ==========================================
export class MetricsService {
  static async getMetrics(timeRange: string = '24h') {
    return ApiService.request(`/api/admin/metrics?range=${timeRange}`)
  }

  static async getSystemHealth() {
    return ApiService.request('/api/admin/system/health')
  }

  static async getActivityLogs(filters: any = {}) {
    const queryParams = new URLSearchParams(filters).toString()
    return ApiService.request(`/api/admin/activity?${queryParams}`)
  }

  static async getUserMonitoring(filters: any = {}) {
    const queryParams = new URLSearchParams(filters).toString()
    return ApiService.request(`/api/admin/users/monitoring?${queryParams}`)
  }
}

// ==========================================
// ENTERPRISE & BILLING API
// ==========================================
export class EnterpriseService {
  static async getCustomers(filters: any = {}) {
    const queryParams = new URLSearchParams(filters).toString()
    return ApiService.request(`/api/admin/enterprise/customers?${queryParams}`)
  }

  static async addCustomer(customerData: any) {
    return ApiService.request('/api/admin/enterprise/customers', {
      method: 'POST',
      body: JSON.stringify(customerData)
    })
  }

  static async updateCustomer(customerId: string, updates: any) {
    return ApiService.request(`/api/admin/enterprise/customers/${customerId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    })
  }

  static async getBillingData(filters: any = {}) {
    const queryParams = new URLSearchParams(filters).toString()
    return ApiService.request(`/api/admin/billing?${queryParams}`)
  }

  static async getInvoices(filters: any = {}) {
    const queryParams = new URLSearchParams(filters).toString()
    return ApiService.request(`/api/admin/billing/invoices?${queryParams}`)
  }

  static async getPayments(filters: any = {}) {
    const queryParams = new URLSearchParams(filters).toString()
    return ApiService.request(`/api/admin/billing/payments?${queryParams}`)
  }
}

// ==========================================
// API KEYS MANAGEMENT
// ==========================================
export class ApiKeysService {
  static async getApiKeys(filters: any = {}) {
    const queryParams = new URLSearchParams(filters).toString()
    return ApiService.request(`/api/admin/api-keys?${queryParams}`)
  }

  static async createApiKey(apiKeyData: any) {
    return ApiService.request('/api/admin/api-keys', {
      method: 'POST',
      body: JSON.stringify(apiKeyData)
    })
  }

  static async revokeApiKey(apiKeyId: string) {
    return ApiService.request(`/api/admin/api-keys/${apiKeyId}/revoke`, {
      method: 'PUT'
    })
  }

  static async deleteApiKey(apiKeyId: string) {
    return ApiService.request(`/api/admin/api-keys/${apiKeyId}`, {
      method: 'DELETE'
    })
  }
}

// ==========================================
// SUPPORT MANAGEMENT
// ==========================================
export class SupportService {
  static async getTickets(filters: any = {}) {
    const queryParams = new URLSearchParams(filters).toString()
    return ApiService.request(`/api/admin/support/tickets?${queryParams}`)
  }

  static async updateTicket(ticketId: string, updates: any) {
    return ApiService.request(`/api/admin/support/tickets/${ticketId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    })
  }

  static async assignTicket(ticketId: string, assigneeId: string) {
    return ApiService.request(`/api/admin/support/tickets/${ticketId}/assign`, {
      method: 'PUT',
      body: JSON.stringify({ assigneeId })
    })
  }
}

// ==========================================
// SETTINGS & CONFIGURATION
// ==========================================
export class SettingsService {
  static async getSettings() {
    return ApiService.request('/api/admin/settings')
  }

  static async updateSettings(settingsData: any) {
    return ApiService.request('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData)
    })
  }

  static async exportSettings() {
    return ApiService.request('/api/admin/settings/export')
  }

  static async importSettings(settingsData: any) {
    return ApiService.request('/api/admin/settings/import', {
      method: 'POST',
      body: JSON.stringify(settingsData)
    })
  }

  static async getSystemInfo() {
    return ApiService.request('/api/admin/system/info')
  }
}

// ==========================================
// SYSTEM HEALTH & MONITORING
// ==========================================
export class SystemService {
  static async getHealthStatus() {
    return ApiService.request('/api/admin/system/health')
  }

  static async getPerformanceMetrics() {
    return ApiService.request('/api/admin/system/performance')
  }

  static async restartService(serviceName: string) {
    return ApiService.request(`/api/admin/system/services/${serviceName}/restart`, {
      method: 'POST'
    })
  }

  static async stopService(serviceName: string) {
    return ApiService.request(`/api/admin/system/services/${serviceName}/stop`, {
      method: 'POST'
    })
  }

  static async startService(serviceName: string) {
    return ApiService.request(`/api/admin/system/services/${serviceName}/start`, {
      method: 'POST'
    })
  }
}
