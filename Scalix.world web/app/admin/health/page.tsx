'use client'

import React, { useState, useEffect } from 'react'
import {
  Server,
  Database,
  Globe,
  Smartphone,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Settings,
  BarChart3,
  Zap,
  Shield,
  Clock,
  Cpu,
  HardDrive,
  Wifi
} from 'lucide-react'

const systemMetrics = {
  webApp: {
    status: 'operational',
    uptime: '99.9%',
    responseTime: '245ms',
    cpu: 23,
    memory: 67,
    requests: 1250,
    errors: 3
  },
  litellmProxy: {
    status: 'operational',
    uptime: '99.7%',
    responseTime: '89ms',
    cpu: 45,
    memory: 78,
    requests: 3200,
    errors: 12
  },
  desktopApp: {
    status: 'operational',
    uptime: '99.8%',
    responseTime: '156ms',
    cpu: 18,
    memory: 45,
    requests: 890,
    errors: 1
  },
  database: {
    status: 'operational',
    uptime: '99.9%',
    responseTime: '23ms',
    cpu: 12,
    memory: 34,
    connections: 156,
    queries: 4500
  }
}

const alerts = [
  {
    id: 1,
    severity: 'warning',
    title: 'High Memory Usage',
    message: 'LiteLLM proxy memory usage at 78%',
    system: 'LiteLLM Proxy',
    timestamp: '5 minutes ago',
    acknowledged: false
  },
  {
    id: 2,
    severity: 'info',
    title: 'Scheduled Maintenance',
    message: 'Database maintenance scheduled for tonight',
    system: 'Database',
    timestamp: '1 hour ago',
    acknowledged: true
  },
  {
    id: 3,
    severity: 'error',
    title: 'API Rate Limit',
    message: 'Multiple rate limit hits detected',
    system: 'Web App',
    timestamp: '15 minutes ago',
    acknowledged: false
  }
]

export default function SystemHealthPage() {
  const [selectedSystem, setSelectedSystem] = useState('all')
  const [refreshing, setRefreshing] = useState(false)
  const [timeRange, setTimeRange] = useState('1h')

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setRefreshing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-600 bg-green-100'
      case 'degraded': return 'text-yellow-600 bg-yellow-100'
      case 'down': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'text-red-600 bg-red-50 border-red-200'
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const filteredAlerts = alerts.filter(alert =>
    selectedSystem === 'all' || alert.system.toLowerCase().includes(selectedSystem.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Health</h1>
          <p className="text-gray-600 mt-1">
            Real-time monitoring and health checks for all Scalix systems
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="5m">Last 5 minutes</option>
            <option value="1h">Last hour</option>
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
          </select>

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

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(systemMetrics).map(([system, metrics]) => (
          <div key={system} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {system === 'webApp' && <Globe className="w-6 h-6 text-blue-600" />}
                {system === 'litellmProxy' && <Server className="w-6 h-6 text-green-600" />}
                {system === 'desktopApp' && <Smartphone className="w-6 h-6 text-purple-600" />}
                {system === 'database' && <Database className="w-6 h-6 text-orange-600" />}
                <div>
                  <p className="font-semibold text-gray-900 capitalize">
                    {system.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </p>
                  <p className={`text-sm font-medium ${getStatusColor(metrics.status)} px-2 py-1 rounded-full inline-block`}>
                    {metrics.status}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{metrics.uptime}</p>
                <p className="text-sm text-gray-500">uptime</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Response Time</span>
                <span className="text-sm font-medium">{metrics.responseTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">CPU Usage</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-2 rounded-full ${metrics.cpu > 80 ? 'bg-red-500' : metrics.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${metrics.cpu}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{metrics.cpu}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Memory</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-2 rounded-full ${metrics.memory > 80 ? 'bg-red-500' : metrics.memory > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${metrics.memory}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{metrics.memory}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {system === 'database' ? 'Connections' : 'Requests/min'}
                </span>
                <span className="text-sm font-medium">
                  {system === 'database' ? metrics.connections : metrics.requests}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* System Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CPU & Memory Usage */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Resource Usage
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {/* CPU Chart Placeholder */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">CPU Usage</span>
                  <span className="text-sm text-gray-500">Average: 24.5%</span>
                </div>
                <div className="h-32 bg-gray-100 rounded-lg flex items-end justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Chart visualization</p>
                    <p className="text-xs text-gray-400">Real-time data would be displayed here</p>
                  </div>
                </div>
              </div>

              {/* Memory Chart Placeholder */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Memory Usage</span>
                  <span className="text-sm text-gray-500">Average: 56.1%</span>
                </div>
                <div className="h-32 bg-gray-100 rounded-lg flex items-end justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Chart visualization</p>
                    <p className="text-xs text-gray-400">Real-time data would be displayed here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Network & Requests */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Wifi className="w-5 h-5 mr-2" />
              Network & Performance
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {/* Response Time */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Response Time</span>
                  <span className="text-sm text-gray-500">Avg: 128ms</span>
                </div>
                <div className="h-32 bg-gray-100 rounded-lg flex items-end justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Response times stable</p>
                    <p className="text-xs text-gray-400">98% under 200ms</p>
                  </div>
                </div>
              </div>

              {/* Error Rate */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Error Rate</span>
                  <span className="text-sm text-gray-500">0.08%</span>
                </div>
                <div className="h-32 bg-gray-100 rounded-lg flex items-end justify-center">
                  <div className="text-center">
                    <TrendingDown className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Error rate decreasing</p>
                    <p className="text-xs text-gray-400">-15% from yesterday</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Active Alerts
            </h2>
            <select
              value={selectedSystem}
              onChange={(e) => setSelectedSystem(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Systems</option>
              <option value="web">Web App</option>
              <option value="litellm">LiteLLM Proxy</option>
              <option value="desktop">Desktop App</option>
              <option value="database">Database</option>
            </select>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      alert.severity === 'error' ? 'bg-red-500' :
                      alert.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900">{alert.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          alert.severity === 'error' ? 'bg-red-100 text-red-800' :
                          alert.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {alert.system}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                      <p className="text-xs text-gray-500">{alert.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!alert.acknowledged && (
                      <button className="px-3 py-1 text-sm bg-white text-gray-700 rounded hover:bg-gray-50 transition-colors">
                        Acknowledge
                      </button>
                    )}
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      alert.acknowledged ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {alert.acknowledged ? 'Acknowledged' : 'Active'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAlerts.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-500">All systems are running smoothly!</p>
              <p className="text-sm text-gray-400 mt-1">No active alerts to display.</p>
            </div>
          )}
        </div>
      </div>

      {/* System Configuration Panel */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            System Configuration
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Monitoring Settings */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Monitoring</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Real-time monitoring</span>
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Auto-alerts</span>
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Performance tracking</span>
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                </label>
              </div>
            </div>

            {/* Alert Thresholds */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Alert Thresholds</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-700">CPU Usage (%)</label>
                  <input
                    type="number"
                    defaultValue="80"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700">Memory Usage (%)</label>
                  <input
                    type="number"
                    defaultValue="85"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700">Response Time (ms)</label>
                  <input
                    type="number"
                    defaultValue="1000"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Maintenance */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Maintenance</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Run Health Check
                </button>
                <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Clear System Cache
                </button>
                <button className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                  Generate Report
                </button>
                <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Emergency Restart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
