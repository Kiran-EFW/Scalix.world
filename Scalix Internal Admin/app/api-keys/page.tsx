'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loading, PageLoading, TableSkeleton } from '@/components/ui/loading'
import { Modal, FormModal, ConfirmModal } from '@/components/ui/modal'
import { useToast } from '@/components/ui/toast'
import AdminLayout from '@/components/layout/AdminLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import {
  Key,
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Trash2,
  Edit,
  Download,
  Upload,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Zap,
  BarChart3,
  Filter,
  Settings,
  Lock,
  Unlock,
  RotateCw
} from 'lucide-react'

interface APIKey {
  id: string
  name: string
  description: string
  key: string
  userId: string
  userName: string
  userEmail: string
  tierName: string
  status: 'active' | 'inactive' | 'expired' | 'revoked'
  createdAt: string
  lastUsed: string
  expiresAt: string
  usageCount: number
  usageLimit: number
  rateLimit: number
  permissions: string[]
  ipWhitelist?: string[]
}

export default function APIKeysManagement() {
  const { success, error, info } = useToast()

  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: 'key_001',
      name: 'Production API Key',
      description: 'Main production API key for enterprise client',
      key: 'sk_prod_scalix_123456789abcdef123456789abcdef123456789abcdef',
      userId: 'user_001',
      userName: 'Acme Corp',
      userEmail: 'admin@acmecorp.com',
      tierName: 'Enterprise Plan',
      status: 'active',
      createdAt: '2024-01-15T10:30:00Z',
      lastUsed: '2024-01-20T14:45:00Z',
      expiresAt: '2025-01-15T10:30:00Z',
      usageCount: 45678,
      usageLimit: 1000000,
      rateLimit: 1000,
      permissions: ['read', 'write', 'delete', 'admin'],
      ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8']
    }
  ])

  // UI State
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedKey, setSelectedKey] = useState<APIKey | null>(null)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [tierFilter, setTierFilter] = useState<string>('all')

  // Computed metrics
  const metrics = useMemo(() => {
    const total = apiKeys.length
    const active = apiKeys.filter(k => k.status === 'active').length
    const totalUsage = apiKeys.reduce((sum, k) => sum + k.usageCount, 0)

    return { total, active, totalUsage }
  }, [apiKeys])

  const filteredKeys = useMemo(() => {
    return apiKeys.filter(key => {
      const matchesSearch = !searchTerm ||
        key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        key.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        key.key.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || key.status === statusFilter
      const matchesTier = tierFilter === 'all' || key.tierName.toLowerCase().includes(tierFilter.toLowerCase())

      return matchesSearch && matchesStatus && matchesTier
    })
  }, [apiKeys, searchTerm, statusFilter, tierFilter])

  const handleViewKey = (key: APIKey) => {
    setSelectedKey(key)
    setShowDetailsModal(true)
  }

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys)
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId)
    } else {
      newVisible.add(keyId)
    }
    setVisibleKeys(newVisible)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    success('Copied to clipboard')
  }

  const getStatusColor = (status: APIKey['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-yellow-100 text-yellow-800'
      case 'expired': return 'bg-red-100 text-red-800'
      case 'revoked': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'starter': return 'bg-blue-100 text-blue-800'
      case 'pro': return 'bg-purple-100 text-purple-800'
      case 'enterprise': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <ProtectedRoute requiredPermissions={['manage_api_keys']}>
      <AdminLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">API Key Management</h1>
              <p className="text-gray-600 mt-2">Create, manage, and monitor API keys for all Scalix AI tiers</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsLoading(true)
                  setTimeout(() => setIsLoading(false), 1000)
                }}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={() => setShowCreateForm(true)} className="bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" />
                Create API Key
              </Button>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Total API Keys</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{metrics.total}</p>
                    <div className="flex items-center text-xs text-blue-600">
                      <Key className="w-3 h-3 mr-1" />
                      Across all tiers
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors duration-300">
                    <Key className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Active Keys</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{metrics.active}</p>
                    <div className="flex items-center text-xs text-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {Math.round((metrics.active / metrics.total) * 100)}% of total
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors duration-300">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Usage</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{metrics.totalUsage.toLocaleString()}</p>
                    <div className="flex items-center text-xs text-purple-600">
                      <Activity className="w-3 h-3 mr-1" />
                      API calls this month
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors duration-300">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Expiring Soon</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {apiKeys.filter(k => {
                        const expiresAt = new Date(k.expiresAt)
                        const now = new Date()
                        const daysUntilExpiry = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                        return daysUntilExpiry <= 30 && daysUntilExpiry > 0
                      }).length}
                    </p>
                    <div className="flex items-center text-xs text-orange-600">
                      <Clock className="w-3 h-3 mr-1" />
                      Within 30 days
                    </div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-xl group-hover:bg-orange-100 transition-colors duration-300">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search API keys by name, user, or key..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white transition-all duration-200"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="expired">Expired</option>
                    <option value="revoked">Revoked</option>
                  </select>

                  <select
                    value={tierFilter}
                    onChange={(e) => setTierFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white transition-all duration-200"
                  >
                    <option value="all">All Tiers</option>
                    <option value="starter">Starter</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Keys Table */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="w-5 h-5 mr-2 text-red-600" />
                API Keys ({filteredKeys.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <TableSkeleton rows={5} columns={8} />
              ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">API Key</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tier</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Usage</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Expires</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredKeys.map((key) => (
                        <tr key={key.id} className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-medium text-gray-900">{key.name}</p>
                              <p className="text-sm text-gray-500">{key.description}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center space-x-2">
                              <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                                {visibleKeys.has(key.id)
                                  ? key.key
                                  : `${key.key.substring(0, 20)}...`}
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleKeyVisibility(key.id)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                {visibleKeys.has(key.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(key.key)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-medium text-gray-900">{key.userName}</p>
                              <p className="text-sm text-gray-500">{key.userEmail}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTierColor(key.tierName)}`}>
                              {key.tierName}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(key.status)}`}>
                              {key.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-medium text-gray-900">{key.usageCount.toLocaleString()}</p>
                              <p className="text-sm text-gray-500">of {key.usageLimit.toLocaleString()}</p>
                              <div className="w-16 bg-gray-200 rounded-full h-1 mt-1">
                                <div
                                  className="bg-blue-600 h-1 rounded-full"
                                  style={{ width: `${Math.min((key.usageCount / key.usageLimit) * 100, 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div>
                              <p className="text-sm text-gray-900">
                                {new Date(key.expiresAt).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-gray-500">
                                {Math.ceil((new Date(key.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewKey(key)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewKey(key)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => success('Regenerated API key')}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <RotateCw className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* API Key Details Modal */}
          <Modal
            isOpen={showDetailsModal}
            onClose={() => {
              setShowDetailsModal(false)
              setSelectedKey(null)
            }}
            title="API Key Details"
            size="lg"
          >
            {selectedKey && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      selectedKey.status === 'active' ? 'bg-green-100' :
                      selectedKey.status === 'inactive' ? 'bg-gray-100' :
                      selectedKey.status === 'expired' ? 'bg-red-100' :
                      'bg-orange-100'
                    }`}>
                      <Key className="w-6 h-6 text-current" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{selectedKey.name}</h3>
                      <p className="text-sm text-gray-600">{selectedKey.description}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedKey.status)}`}>
                    {selectedKey.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">{selectedKey.usageCount.toLocaleString()}</div>
                    <p className="text-sm text-blue-700">Current Usage</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">{selectedKey.usageLimit.toLocaleString()}</div>
                    <p className="text-sm text-green-700">Usage Limit</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-2">{selectedKey.rateLimit}</div>
                    <p className="text-sm text-purple-700">Rate Limit</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-2">{selectedKey.permissions.length}</div>
                    <p className="text-sm text-orange-700">Permissions</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Key Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">API Key ID</span>
                        <code className="text-sm font-mono">{selectedKey.id}</code>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">User</span>
                        <span className="font-medium">{selectedKey.userName}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Tier</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getTierColor(selectedKey.tierName)}`}>
                          {selectedKey.tierName}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Created</span>
                        <span>{new Date(selectedKey.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Last Used</span>
                        <span>{selectedKey.lastUsed ? new Date(selectedKey.lastUsed).toLocaleString() : 'Never'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Security & Access</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Expires</span>
                        <span>{new Date(selectedKey.expiresAt).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">IP Whitelist</span>
                        <span className="font-medium">{selectedKey.ipWhitelist?.length || 0} IPs</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Permissions</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedKey.permissions.map((permission, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
