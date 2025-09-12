'use client'

import React, { useState, useEffect } from 'react'
import {
  Activity,
  Users,
  Server,
  Database,
  Globe,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
  BarChart3,
  Zap,
  Shield,
  Clock
} from 'lucide-react'

// Mock data for demonstration - in real app this would come from APIs
const systemStatus = {
  webApp: { status: 'operational', uptime: '99.9%', responseTime: '245ms' },
  litellmProxy: { status: 'operational', uptime: '99.7%', responseTime: '89ms' },
  desktopApp: { status: 'operational', uptime: '99.8%', responseTime: '156ms' },
  database: { status: 'operational', uptime: '99.9%', responseTime: '23ms' },
  cdn: { status: 'operational', uptime: '99.9%', responseTime: '12ms' }
}

const recentActivity = [
  {
    id: 1,
    type: 'user',
    message: 'New user registration: john.doe@example.com',
    timestamp: '2 minutes ago',
    severity: 'info'
  },
  {
    id: 2,
    type: 'system',
    message: 'LiteLLM proxy restarted successfully',
    timestamp: '5 minutes ago',
    severity: 'success'
  },
  {
    id: 3,
    type: 'error',
    message: 'Failed login attempt from IP 192.168.1.100',
    timestamp: '8 minutes ago',
    severity: 'warning'
  },
  {
    id: 4,
    type: 'system',
    message: 'Database backup completed',
    timestamp: '15 minutes ago',
    severity: 'success'
  },
  {
    id: 5,
    type: 'user',
    message: 'Admin login from user: admin@scalix.ai',
    timestamp: '20 minutes ago',
    severity: 'info'
  }
]

const performanceMetrics = {
  totalUsers: 1247,
  activeUsers: 342,
  totalRequests: 45230,
  avgResponseTime: 89,
  errorRate: 0.03,
  uptime: 99.8
}

export default function AdminDashboard() {
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setRefreshing(false)
    setLastUpdated(new Date())
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-600'
      case 'degraded': return 'text-yellow-600'
      case 'down': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="w-5 h-5" />
      case 'degraded': return <AlertTriangle className="w-5 h-5" />
      case 'down': return <XCircle className="w-5 h-5" />
      default: return <Activity className="w-5 h-5" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'text-red-600 bg-red-50'
      case 'warning': return 'text-yellow-600 bg-yellow-50'
      case 'success': return 'text-green-600 bg-green-50'
      default: return 'text-blue-600 bg-blue-50'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Centralized management of the entire Scalix ecosystem
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{performanceMetrics.totalUsers.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">+12.5%</span>
            <span className="text-gray-500 ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-3xl font-bold text-gray-900">{performanceMetrics.activeUsers}</p>
            </div>
            <Activity className="w-8 h-8 text-green-600" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">+8.2%</span>
            <span className="text-gray-500 ml-2">currently online</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">API Requests</p>
              <p className="text-3xl font-bold text-gray-900">{performanceMetrics.totalRequests.toLocaleString()}</p>
            </div>
            <Zap className="w-8 h-8 text-purple-600" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">+15.3%</span>
            <span className="text-gray-500 ml-2">this week</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Uptime</p>
              <p className="text-3xl font-bold text-gray-900">{performanceMetrics.uptime}%</p>
            </div>
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">99.9%</span>
            <span className="text-gray-500 ml-2">target SLA</span>
          </div>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Server className="w-5 h-5 mr-2" />
              System Health
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(systemStatus).map(([system, status]) => (
                <div key={system} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(status.status)}
                    <div>
                      <p className="font-medium text-gray-900 capitalize">
                        {system.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Uptime: {status.uptime} • Response: {status.responseTime}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${getStatusColor(status.status)}`}>
                    {status.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Recent Activity
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.severity === 'error' ? 'bg-red-500' :
                    activity.severity === 'warning' ? 'bg-yellow-500' :
                    activity.severity === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all activity →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Quick Actions
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <Database className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Backup Database</p>
                  <p className="text-sm text-gray-500">Manual backup trigger</p>
                </div>
              </div>
            </button>

            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <Server className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Restart Services</p>
                  <p className="text-sm text-gray-500">Restart all systems</p>
                </div>
              </div>
            </button>

            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">User Management</p>
                  <p className="text-sm text-gray-500">Manage user accounts</p>
                </div>
              </div>
            </button>

            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-medium text-gray-900">System Logs</p>
                  <p className="text-sm text-gray-500">View detailed logs</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* System Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            System Configuration
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">scalix.world (Web App)</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="text-sm font-medium text-green-600">Running</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Port</span>
                  <span className="text-sm font-medium">3001</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Version</span>
                  <span className="text-sm font-medium">v2.1.0</span>
                </div>
              </div>
              <button className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Restart Service
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">LiteLLM Proxy</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="text-sm font-medium text-green-600">Running</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Port</span>
                  <span className="text-sm font-medium">4000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Models</span>
                  <span className="text-sm font-medium">12</span>
                </div>
              </div>
              <button className="w-full px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                Configure Models
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Scalix Desktop App</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="text-sm font-medium text-green-600">Running</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Connected Users</span>
                  <span className="text-sm font-medium">342</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Version</span>
                  <span className="text-sm font-medium">v1.8.3</span>
                </div>
              </div>
              <button className="w-full px-3 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700">
                Push Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
