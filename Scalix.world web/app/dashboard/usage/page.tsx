'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { useRealtimeUsageData } from '@/hooks/useRealtimeData'
import { RealtimeStatusCompact } from '@/components/ui/RealtimeStatus'
import {
  BarChart3,
  TrendingUp,
  Clock,
  Zap,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  Loader2,
  Check,
  AlertTriangle
} from 'lucide-react'

interface UsageSummary {
  totalRequests: number
  totalCost: number
  totalTokens: number
  averageResponseTime: number
  successRate: number
  period: string
}

interface DailyUsage {
  date: string
  requests: number
  cost: number
  tokens: number
  avgResponseTime: number
}

interface ModelUsage {
  model: string
  requests: number
  cost: number
  tokens: number
  percentage: number
}

interface ProjectUsage {
  projectId: string
  projectName: string
  requests: number
  cost: number
  tokens: number
  percentage: number
}

interface HourlyUsage {
  hour: string
  requests: number
  cost: number
  tokens: number
}

interface ErrorLog {
  timestamp: string
  error: string
  requests: number
  cost: number
}

export default function UsagePage() {
  // Real-time data hook
  const { 
    data: realtimeUsageData, 
    loading: realtimeLoading, 
    error: realtimeError,
    lastUpdate,
    refresh: refreshRealtime
  } = useRealtimeUsageData('admin', true)
  
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedModel, setSelectedModel] = useState('all')
  const [selectedProject, setSelectedProject] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  
  // Data states
  const [summary, setSummary] = useState<UsageSummary | null>(null)
  const [dailyUsage, setDailyUsage] = useState<DailyUsage[]>([])
  const [modelUsage, setModelUsage] = useState<ModelUsage[]>([])
  const [projectUsage, setProjectUsage] = useState<ProjectUsage[]>([])
  const [hourlyUsage, setHourlyUsage] = useState<HourlyUsage[]>([])
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([])
  
  // UI states
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    loadUsageData()
  }, [timeRange, selectedModel, selectedProject, startDate, endDate])

  // Sync real-time data with local state
  useEffect(() => {
    if (realtimeUsageData && realtimeUsageData.length > 0) {
      // Process real-time usage data and update local state
      const latestData = realtimeUsageData[0] // Get the latest usage data
      if (latestData) {
        setSummary(latestData.summary || null)
        setDailyUsage(latestData.dailyUsage || [])
        setModelUsage(latestData.modelUsage || [])
        setProjectUsage(latestData.projectUsage || [])
        setHourlyUsage(latestData.hourlyUsage || [])
        setErrorLogs(latestData.errorLogs || [])
      }
    }
  }, [realtimeUsageData])

  const loadUsageData = async () => {
    setLoading(true)
    try {
      const [summaryResponse, dailyResponse, modelsResponse, projectsResponse, hourlyResponse, errorsResponse] = await Promise.all([
        fetch(`/api/usage?action=summary&period=${timeRange}`),
        fetch(`/api/usage?action=daily&period=${timeRange}&startDate=${startDate}&endDate=${endDate}`),
        fetch(`/api/usage?action=models&model=${selectedModel}`),
        fetch(`/api/usage?action=projects&projectId=${selectedProject}`),
        fetch('/api/usage?action=hourly'),
        fetch('/api/usage?action=errors')
      ])
      
      const [summaryResult, dailyResult, modelsResult, projectsResult, hourlyResult, errorsResult] = await Promise.all([
        summaryResponse.json(),
        dailyResponse.json(),
        modelsResponse.json(),
        projectsResponse.json(),
        hourlyResponse.json(),
        errorsResponse.json()
      ])
      
      if (summaryResult.success) setSummary(summaryResult.data)
      if (dailyResult.success) setDailyUsage(dailyResult.data)
      if (modelsResult.success) setModelUsage(modelsResult.data)
      if (projectsResult.success) setProjectUsage(projectsResult.data)
      if (hourlyResult.success) setHourlyUsage(hourlyResult.data)
      if (errorsResult.success) setErrorLogs(errorsResult.data)
    } catch (error) {
      console.error('Error loading usage data:', error)
      setErrorMessage('Failed to load usage data')
    } finally {
      setLoading(false)
    }
  }

  const showSuccess = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const showError = (message: string) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(''), 5000)
  }

  const refreshData = async () => {
    setActionLoading('refresh')
    try {
      const response = await fetch('/api/usage?action=refresh', {
        method: 'POST'
      })
      
      const result = await response.json()
      if (result.success) {
        await loadUsageData()
        showSuccess(result.message)
      } else {
        showError(result.error)
      }
    } catch (error) {
      console.error('Error refreshing data:', error)
      showError('Failed to refresh data')
    } finally {
      setActionLoading(null)
    }
  }

  const exportData = async () => {
    setActionLoading('export')
    try {
      const response = await fetch(`/api/usage?action=export&format=csv&period=${timeRange}`)
      
      const result = await response.json()
      if (result.success) {
        showSuccess(result.message)
        // In production, this would trigger a file download
      } else {
        showError(result.error)
      }
    } catch (error) {
      console.error('Error exporting data:', error)
      showError('Failed to export data')
    } finally {
      setActionLoading(null)
    }
  }

  const applyFilters = async () => {
    setActionLoading('filter')
    try {
      const response = await fetch('/api/usage?action=filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          period: timeRange,
          startDate,
          endDate,
          model: selectedModel,
          projectId: selectedProject
        })
      })
      
      const result = await response.json()
      if (result.success) {
        setDailyUsage(result.data.dailyUsage)
        setModelUsage(result.data.modelUsage)
        setProjectUsage(result.data.projectUsage)
        showSuccess(result.message)
      } else {
        showError(result.error)
      }
    } catch (error) {
      console.error('Error applying filters:', error)
      showError('Failed to apply filters')
    } finally {
      setActionLoading(null)
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
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900">Usage Analytics</h1>
            <RealtimeStatusCompact />
          </div>
          <p className="text-gray-600 mt-2">Track your API usage, costs, and performance metrics</p>
          {lastUpdate && (
            <p className="text-xs text-gray-500 mt-1">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={exportData}
            disabled={actionLoading === 'export'}
          >
            {actionLoading === 'export' ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Export
          </Button>
          <Button 
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white"
            onClick={refreshData}
            disabled={actionLoading === 'refresh'}
          >
            {actionLoading === 'refresh' ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Success/Error Messages */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center"
        >
          <Check className="w-5 h-5 text-green-600 mr-3" />
          <span className="text-green-800">{successMessage}</span>
        </motion.div>
      )}

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center"
        >
          <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
          <span className="text-red-800">{errorMessage}</span>
        </motion.div>
      )}

      {/* Overview Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary?.totalRequests.toLocaleString() || '0'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tokens</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary?.totalTokens.toLocaleString() || '0'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 font-bold text-lg">$</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Cost</p>
              <p className="text-2xl font-bold text-gray-900">
                ${summary?.totalCost.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary?.averageResponseTime.toFixed(1) || '0.0'}s
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Models</option>
                <option value="Scalix Standard">Scalix Standard</option>
                <option value="Scalix Advanced">Scalix Advanced</option>
                <option value="Scalix Analyst">Scalix Analyst</option>
                <option value="Scalix Coder">Scalix Coder</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Projects</option>
                <option value="1">Customer Support Chatbot</option>
                <option value="2">Content Generation API</option>
                <option value="3">Data Analysis Tool</option>
                <option value="4">Code Review Assistant</option>
                <option value="5">Marketing Copy Generator</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="End Date"
            />
            <Button 
              variant="outline"
              onClick={applyFilters}
              disabled={actionLoading === 'filter'}
            >
              {actionLoading === 'filter' ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Filter className="w-4 h-4 mr-2" />
              )}
              Apply Filters
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Usage Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Daily Usage History</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requests
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tokens
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Response Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dailyUsage.map((item, index) => (
                <motion.tr
                  key={item.date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.requests.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.tokens.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${item.cost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.avgResponseTime.toFixed(1)}s
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Model Usage Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Usage Breakdown</h3>
        <div className="space-y-4">
          {modelUsage.map((model, index) => (
            <motion.div
              key={model.model}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">{model.model}</p>
                  <p className="text-sm text-gray-600">{model.requests.toLocaleString()} requests</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">${model.cost.toFixed(2)}</p>
                <p className="text-sm text-gray-600">{model.percentage.toFixed(1)}%</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Project Usage Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Usage Breakdown</h3>
        <div className="space-y-4">
          {projectUsage.map((project, index) => (
            <motion.div
              key={project.projectId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">{project.projectName}</p>
                  <p className="text-sm text-gray-600">{project.requests.toLocaleString()} requests</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">${project.cost.toFixed(2)}</p>
                <p className="text-sm text-gray-600">{project.percentage.toFixed(1)}%</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Error Logs */}
      {errorLogs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Errors</h3>
          <div className="space-y-3">
            {errorLogs.slice(0, 5).map((error, index) => (
              <motion.div
                key={error.timestamp}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
              >
                <div>
                  <p className="font-medium text-red-900">{error.error}</p>
                  <p className="text-sm text-red-600">
                    {new Date(error.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-red-600">{error.requests} requests</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
