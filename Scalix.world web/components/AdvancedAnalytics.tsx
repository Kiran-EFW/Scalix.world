'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { realTimeDataService, AnalyticsData } from '@/lib/api'
import {
  BarChart3,
  TrendingUp,
  Users,
  Activity,
  Clock,
  Zap,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  TrendingDown,
  Eye,
  Target,
  Globe
} from 'lucide-react'

interface AdvancedAnalyticsProps {
  className?: string
}

export function AdvancedAnalytics({ className = '' }: AdvancedAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState('24h')
  const [selectedMetric, setSelectedMetric] = useState('users')

  const fetchAnalytics = async () => {
    try {
      setError(null)
      const data = await realTimeDataService.getAnalyticsData()
      if (data) {
        setAnalytics(data)
      } else {
        throw new Error('No analytics data available')
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err)
      setError('Failed to load analytics data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let unsubscribe: (() => void) | null = null

    const initializeAnalytics = async () => {
      try {
        // Subscribe to analytics updates
        unsubscribe = realTimeDataService.subscribe('analytics', (data) => {
          if (data) {
            setAnalytics(data)
            setError(null)
          }
        })

        // Start real-time updates
        realTimeDataService.startRealTimeUpdates('analytics', 30000)

        // Initial data fetch
        await fetchAnalytics()
      } catch (error) {
        console.error('Failed to initialize analytics:', error)
        setIsLoading(false)
      }
    }

    initializeAnalytics()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
      realTimeDataService.stopRealTimeUpdates('analytics')
    }
  }, [])

  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Loading analytics...</span>
        </div>
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 ${className}`}>
        <div className="flex items-center justify-center py-12 text-red-600">
          <AlertCircle className="w-8 h-8 mr-3" />
          <span>{error || 'Failed to load analytics'}</span>
        </div>
      </div>
    )
  }

  const metrics = [
    {
      key: 'users',
      title: 'Total Users',
      value: analytics.total_users.toLocaleString(),
      change: 12.5,
      icon: Users,
      color: 'blue',
      description: 'Registered users across all tiers'
    },
    {
      key: 'active',
      title: 'Active Users',
      value: analytics.active_users.toLocaleString(),
      change: 8.3,
      icon: Activity,
      color: 'green',
      description: 'Users active in the last 24 hours'
    },
    {
      key: 'requests',
      title: 'API Requests',
      value: (analytics.total_requests / 1000000).toFixed(1) + 'M',
      change: 15.7,
      icon: Zap,
      color: 'yellow',
      description: 'Total API calls processed'
    },
    {
      key: 'response_time',
      title: 'Avg Response',
      value: analytics.system_health.response_time,
      change: -5.2,
      icon: Clock,
      color: 'purple',
      description: 'Average API response time'
    }
  ]

  const selectedMetricData = metrics.find(m => m.key === selectedMetric) || metrics[0]

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
          <p className="text-gray-600 mt-1">Real-time insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <button
            onClick={fetchAnalytics}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            title="Refresh data"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative bg-white rounded-xl p-6 shadow-sm border-2 transition-all duration-300 cursor-pointer ${
              selectedMetric === metric.key
                ? `border-${metric.color}-500 bg-${metric.color}-50`
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
            onClick={() => setSelectedMetric(metric.key)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-${metric.color}-100 rounded-lg flex items-center justify-center`}>
                <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
              </div>
              <div className={`flex items-center text-sm ${
                metric.change > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change > 0 ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                {Math.abs(metric.change)}%
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{metric.value}</div>
            <div className="text-sm font-medium text-gray-600 mb-1">{metric.title}</div>
            <div className="text-xs text-gray-500">{metric.description}</div>

            {selectedMetric === metric.key && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`absolute -top-1 -right-1 w-4 h-4 bg-${metric.color}-500 rounded-full border-2 border-white`}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Detailed Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Trends Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Usage Trends</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {analytics.top_models.slice(0, 5).map((model, index) => (
              <div key={model.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{model.name}</div>
                    <div className="text-sm text-gray-500">{model.requests.toLocaleString()} requests</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">${model.cost.toFixed(2)}</div>
                  <div className={`text-sm flex items-center ${
                    model.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {model.change > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {model.change}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* User Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">User Distribution</h3>
            <Globe className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="font-medium text-gray-900">Free Users</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">{analytics.user_tiers.free.toLocaleString()}</div>
                <div className="text-sm text-gray-500">
                  {((analytics.user_tiers.free / analytics.total_users) * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-900">Pro Users</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">{analytics.user_tiers.pro.toLocaleString()}</div>
                <div className="text-sm text-gray-500">
                  {((analytics.user_tiers.pro / analytics.total_users) * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <span className="font-medium text-gray-900">Enterprise</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">{analytics.user_tiers.enterprise.toLocaleString()}</div>
                <div className="text-sm text-gray-500">
                  {((analytics.user_tiers.enterprise / analytics.total_users) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* System Health Overview */}
      {analytics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">All systems operational</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">99.9%</div>
            <div className="text-sm text-gray-600">System Uptime</div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{analytics?.avg_response_time || '1.2'}s</div>
            <div className="text-sm text-gray-600">Avg Response Time</div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">0.01%</div>
            <div className="text-sm text-gray-600">Error Rate</div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{analytics?.active_users?.toLocaleString() || '8,920'}</div>
            <div className="text-sm text-gray-600">Active Connections</div>
          </div>
        </div>
        </motion.div>
      )}

      {/* Performance Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Target className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Performance Insights</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-900">Cost Efficiency</span>
            </div>
            <p className="text-sm text-gray-600">
              ${analytics.cost_savings.toLocaleString()} saved through optimization
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">User Growth</span>
            </div>
            <p className="text-sm text-gray-600">
              {((analytics.active_users / analytics.total_users) * 100).toFixed(1)}% of users active daily
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-900">System Performance</span>
            </div>
            <p className="text-sm text-gray-600">
              Maintaining {analytics?.avg_response_time || '1.2'}s average response time
            </p>
          </div>
        </div>
        </motion.div>
    </div>
  )
}
