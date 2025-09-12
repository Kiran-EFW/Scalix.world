'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import {
  Key,
  Plus,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Crown
} from 'lucide-react'

interface ApiKey {
  id: string
  name: string
  key: string
  createdAt: Date
  lastUsed: Date | null
  usage: number
  status: 'active' | 'inactive'
  userId: string
}

export function ApiKeysManager() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [creating, setCreating] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const [notification, setNotification] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  useEffect(() => {
    fetchApiKeys()
  }, [])

  const fetchApiKeys = async () => {
    try {
      const response = await fetch('/api/api-keys')
      const data = await response.json()

      if (data.success) {
        setApiKeys(data.data.map((key: any) => ({
          ...key,
          createdAt: new Date(key.createdAt),
          lastUsed: key.lastUsed ? new Date(key.lastUsed) : null
        })))
      }
    } catch (error) {
      console.error('Error fetching API keys:', error)
      setNotification({
        type: 'error',
        message: 'Failed to load API keys'
      })
    } finally {
      setLoading(false)
    }
  }

  const createApiKey = async () => {
    if (!newKeyName.trim()) return

    setCreating(true)
    try {
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newKeyName.trim() })
      })

      const data = await response.json()

      if (data.success) {
        setApiKeys(prev => [data.data, ...prev])
        setNewKeyName('')
        setShowCreateForm(false)
        setNotification({
          type: 'success',
          message: 'API key created successfully!'
        })
      } else {
        setNotification({
          type: 'error',
          message: data.error || 'Failed to create API key'
        })
      }
    } catch (error) {
      console.error('Error creating API key:', error)
      setNotification({
        type: 'error',
        message: 'Failed to create API key'
      })
    } finally {
      setCreating(false)
    }
  }

  const deleteApiKey = async (keyId: string) => {
    try {
      const response = await fetch(`/api/api-keys?id=${keyId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        setApiKeys(prev => prev.filter(key => key.id !== keyId))
        setNotification({
          type: 'success',
          message: 'API key deleted successfully'
        })
      } else {
        setNotification({
          type: 'error',
          message: data.error || 'Failed to delete API key'
        })
      }
    } catch (error) {
      console.error('Error deleting API key:', error)
      setNotification({
        type: 'error',
        message: 'Failed to delete API key'
      })
    }
  }

  const copyToClipboard = async (text: string, keyId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(keyId)
      setTimeout(() => setCopiedKey(null), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev)
      if (newSet.has(keyId)) {
        newSet.delete(keyId)
      } else {
        newSet.add(keyId)
      }
      return newSet
    })
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'Never'
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const maskApiKey = (key: string) => {
    return key.substring(0, 12) + '•'.repeat(20) + key.substring(key.length - 4)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Key className="w-6 h-6 text-primary-600" />
            <span>API Keys</span>
            <Crown className="w-5 h-5 text-yellow-500" />
          </h2>
          <p className="text-gray-600 mt-1">
            Manage your Scalix AI API keys for programmatic access
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create API Key</span>
        </Button>
      </div>

      {/* Usage Warning */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4"
      >
        <div className="flex items-start space-x-3">
          <Activity className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">API Usage</h3>
            <p className="text-sm text-blue-700 mt-1">
              Your API keys are used for accessing Scalix AI services. Keep them secure and never share them publicly.
              Monitor usage in your dashboard to stay within limits.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Create API Key Form */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New API Key</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key Name
                </label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g., Production App, Development, Mobile App"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && createApiKey()}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Choose a descriptive name to help you identify this key's purpose
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  onClick={createApiKey}
                  disabled={creating || !newKeyName.trim()}
                  className="flex items-center space-x-2"
                >
                  {creating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Key className="w-4 h-4" />
                  )}
                  <span>{creating ? 'Creating...' : 'Create API Key'}</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false)
                    setNewKeyName('')
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys.length === 0 ? (
          <div className="text-center py-12">
            <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No API Keys Yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first API key to start using Scalix AI programmatically
            </p>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First API Key</span>
            </Button>
          </div>
        ) : (
          apiKeys.map((apiKey) => (
            <motion.div
              key={apiKey.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {apiKey.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      apiKey.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {apiKey.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">API Key:</span>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                        {visibleKeys.has(apiKey.id) ? apiKey.key : maskApiKey(apiKey.key)}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        className="p-1 h-6 w-6"
                      >
                        {visibleKeys.has(apiKey.id) ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                        className="p-1 h-6 w-6"
                      >
                        {copiedKey === apiKey.id ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">{formatDate(apiKey.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Last Used:</span>
                      <span className="font-medium">{formatDate(apiKey.lastUsed)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Usage:</span>
                      <span className="font-medium">{apiKey.usage.toLocaleString()} requests</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteApiKey(apiKey.id)}
                  className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Usage Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Use Your API Keys</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">1. Include in Headers</h4>
            <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`curl -X POST https://api.scalix.ai/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`}
            </pre>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">2. Python Example</h4>
            <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`import requests

response = requests.post(
    'https://api.scalix.ai/v1/chat/completions',
    headers={
        'Authorization': f'Bearer {YOUR_API_KEY}',
        'Content-Type': 'application/json'
    },
    json={
        'model': 'gpt-4',
        'messages': [{'role': 'user', 'content': 'Hello!'}]
    }
)`}
            </pre>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">Security Reminder</h4>
                <p className="text-sm text-yellow-800 mt-1">
                  Never share your API keys publicly or commit them to version control.
                  Rotate keys regularly and delete unused ones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
              notification.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
