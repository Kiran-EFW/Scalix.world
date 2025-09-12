'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import {
  Shield,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
  UserX,
  Activity,
  Clock,
  Server,
  Database,
  Globe,
  RefreshCw,
  Download,
  Settings,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface SecurityEvent {
  id: string
  timestamp: string
  type: 'login' | 'failed_login' | 'suspicious' | 'api_key' | 'admin_action'
  user: string
  ip: string
  location: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
}

interface SecurityMetrics {
  activeSessions: number
  failedLogins: number
  suspiciousActivities: number
  blockedIPs: number
  apiKeyUsage: number
  encryptionStatus: 'secure' | 'warning' | 'error'
}

const mockSecurityEvents: SecurityEvent[] = [
  {
    id: '1',
    timestamp: '2025-09-12T10:30:00Z',
    type: 'login',
    user: 'admin@scalix.world',
    ip: '192.168.1.100',
    location: 'San Francisco, CA',
    severity: 'low',
    description: 'Successful admin login'
  },
  {
    id: '2',
    timestamp: '2025-09-12T09:15:00Z',
    type: 'failed_login',
    user: 'unknown@external.com',
    ip: '203.0.113.45',
    location: 'Unknown',
    severity: 'medium',
    description: 'Failed login attempt - invalid credentials'
  },
  {
    id: '3',
    timestamp: '2025-09-12T08:45:00Z',
    type: 'suspicious',
    user: 'user@domain.com',
    ip: '198.51.100.23',
    location: 'New York, NY',
    severity: 'high',
    description: 'Unusual login pattern detected'
  },
  {
    id: '4',
    timestamp: '2025-09-12T07:20:00Z',
    type: 'api_key',
    user: 'developer@company.com',
    ip: '104.236.45.12',
    location: 'Austin, TX',
    severity: 'low',
    description: 'New API key generated'
  }
]

const mockSecurityMetrics: SecurityMetrics = {
  activeSessions: 47,
  failedLogins: 23,
  suspiciousActivities: 5,
  blockedIPs: 12,
  apiKeyUsage: 892,
  encryptionStatus: 'secure'
}

export default function AdminSecurityPage() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'events' | 'settings'>('overview')
  const [showBlockedIPs, setShowBlockedIPs] = useState(false)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'failed_login': return <XCircle className="w-4 h-4 text-red-600" />
      case 'suspicious': return <AlertTriangle className="w-4 h-4 text-orange-600" />
      case 'api_key': return <Shield className="w-4 h-4 text-blue-600" />
      case 'admin_action': return <Settings className="w-4 h-4 text-purple-600" />
      default: return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Security Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor and manage system security across all services</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Security Report
          </Button>
          <Button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Security Metrics Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{mockSecurityMetrics.activeSessions}</p>
              <p className="text-xs text-green-600 mt-1">All sessions monitored</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Failed Logins</p>
              <p className="text-2xl font-bold text-gray-900">{mockSecurityMetrics.failedLogins}</p>
              <p className="text-xs text-red-600 mt-1">+12% from yesterday</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Suspicious Activities</p>
              <p className="text-2xl font-bold text-gray-900">{mockSecurityMetrics.suspiciousActivities}</p>
              <p className="text-xs text-orange-600 mt-1">Requires attention</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Blocked IPs</p>
              <p className="text-2xl font-bold text-gray-900">{mockSecurityMetrics.blockedIPs}</p>
              <p className="text-xs text-purple-600 mt-1">IP protection active</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">API Key Usage</p>
              <p className="text-2xl font-bold text-gray-900">{mockSecurityMetrics.apiKeyUsage}</p>
              <p className="text-xs text-blue-600 mt-1">Keys monitored</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              mockSecurityMetrics.encryptionStatus === 'secure'
                ? 'bg-green-100'
                : mockSecurityMetrics.encryptionStatus === 'warning'
                ? 'bg-yellow-100'
                : 'bg-red-100'
            }`}>
              <Lock className={`w-6 h-6 ${
                mockSecurityMetrics.encryptionStatus === 'secure'
                  ? 'text-green-600'
                  : mockSecurityMetrics.encryptionStatus === 'warning'
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Encryption Status</p>
              <p className="text-2xl font-bold text-gray-900 capitalize">{mockSecurityMetrics.encryptionStatus}</p>
              <p className="text-xs text-green-600 mt-1">End-to-end encrypted</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="border-b border-gray-200">
          <nav className="flex">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'events', label: 'Security Events' },
              { id: 'settings', label: 'Security Settings' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  selectedTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">System Security Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Firewall</span>
                      <span className="text-green-600 font-semibold">Active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">DDoS Protection</span>
                      <span className="text-green-600 font-semibold">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">SSL/TLS</span>
                      <span className="text-green-600 font-semibold">Valid</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Rate Limiting</span>
                      <span className="text-green-600 font-semibold">Active</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Security Alerts</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Unusual Login Pattern</p>
                        <p className="text-xs text-gray-600">Detected 5 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Multiple Failed Attempts</p>
                        <p className="text-xs text-gray-600">From IP 203.0.113.45</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Security Scan Completed</p>
                        <p className="text-xs text-gray-600">All systems secure</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'events' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Security Events Log</h3>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    Export
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {mockSecurityEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      {getEventIcon(event.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-sm font-medium text-gray-900">{event.description}</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(event.severity)}`}>
                          {event.severity}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-xs text-gray-600">
                        <span>User: {event.user}</span>
                        <span>IP: {event.ip}</span>
                        <span>Location: {event.location}</span>
                        <span>{new Date(event.timestamp).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <Button variant="outline" size="sm">
                        Investigate
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Security Configuration</h3>
                <p className="text-gray-600">Configure security policies and settings for your organization.</p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-md font-medium text-gray-900">Multi-Factor Authentication</h4>
                      <p className="text-gray-600 text-sm">Require MFA for all admin accounts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-md font-medium text-gray-900">IP Whitelisting</h4>
                      <p className="text-gray-600 text-sm">Restrict access to specific IP addresses</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-md font-medium text-gray-900">Session Timeout</h4>
                      <p className="text-gray-600 text-sm">Automatically log out inactive users</p>
                    </div>
                    <select className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>2 hours</option>
                      <option>4 hours</option>
                      <option>Never</option>
                    </select>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Blocked IP Addresses</h4>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600 text-sm">
                      {mockSecurityMetrics.blockedIPs} IP addresses are currently blocked
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setShowBlockedIPs(!showBlockedIPs)}
                    >
                      {showBlockedIPs ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                      {showBlockedIPs ? 'Hide' : 'Show'} List
                    </Button>
                  </div>

                  {showBlockedIPs && (
                    <div className="mt-4 p-4 bg-white rounded border">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>203.0.113.45</span>
                          <Button variant="outline" size="sm">Unblock</Button>
                        </div>
                        <div className="flex justify-between">
                          <span>198.51.100.23</span>
                          <Button variant="outline" size="sm">Unblock</Button>
                        </div>
                        <div className="flex justify-between">
                          <span>104.236.45.12</span>
                          <Button variant="outline" size="sm">Unblock</Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline">Reset to Defaults</Button>
                  <Button>Save Security Settings</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
