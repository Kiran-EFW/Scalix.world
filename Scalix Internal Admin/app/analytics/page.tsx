'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts'
import DatePicker from 'react-datepicker'
import { format, subDays, subMonths, startOfDay, endOfDay, eachDayOfInterval } from 'date-fns'
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
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Zap,
  DollarSign,
  Activity,
  Calendar,
  Download,
  RefreshCw,
  Eye,
  Clock,
  Settings,
  Filter,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  FileText,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Target,
  AlertTriangle,
  CheckCircle,
  X,
  ChevronDown,
  ChevronUp,
  Share,
  Printer
} from 'lucide-react'

// Color schemes for charts
const COLORS = ['#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981', '#F97316']
const GRADIENT_COLORS = {
  primary: ['#3B82F6', '#1D4ED8'],
  secondary: ['#8B5CF6', '#7C3AED'],
  success: ['#10B981', '#059669'],
  warning: ['#F59E0B', '#D97706']
}

export default function AnalyticsPage() {
  const { success, error, info } = useToast()

  // State management
  const [isLoading, setIsLoading] = useState(false)
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true)
  const [realTimeInterval, setRealTimeInterval] = useState<NodeJS.Timeout | null>(null)

  // Date range state
  const [dateRange, setDateRange] = useState({
    startDate: subDays(new Date(), 30),
    endDate: new Date()
  })
  const [customDateModal, setCustomDateModal] = useState(false)

  // Data state
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalUsers: 1247,
      activeUsers: 892,
      totalRevenue: 45230,
      apiRequests: 156789,
      avgSessionDuration: '12m 34s',
      bounceRate: '23.4%',
      conversionRate: 3.2,
      churnRate: 8.1,
      systemUptime: 99.8
    },
    revenue: {
      daily: [],
      monthly: [],
      growth: 15.3
    },
    users: {
      daily: [],
      growth: 12.8
    },
    apiUsage: {
      byTier: [
        { tier: 'Starter', usage: 23450, percentage: 15, color: '#3B82F6' },
        { tier: 'Pro', usage: 67890, percentage: 43, color: '#8B5CF6' },
        { tier: 'Enterprise', usage: 65449, percentage: 42, color: '#F59E0B' }
      ],
      byEndpoint: []
    },
    performance: {
      responseTime: [],
      errorRate: [],
      throughput: []
    }
  })

  // UI state
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['users', 'revenue', 'api'])
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar' | 'composed'>('area')
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'realtime'>('overview')
  const [expandedCharts, setExpandedCharts] = useState<Set<string>>(new Set())

  // Modal states
  const [showExportModal, setShowExportModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)

  // Generate mock data based on date range
  const generateMockData = () => {
    const days = eachDayOfInterval({
      start: dateRange.startDate,
      end: dateRange.endDate
    })

    // Generate revenue data
    const revenueData = days.map((day, index) => ({
      date: format(day, 'MMM dd'),
      fullDate: format(day, 'yyyy-MM-dd'),
      revenue: Math.floor(Math.random() * 2000) + 3000 + (index * 50),
      users: Math.floor(Math.random() * 100) + 200 + (index * 2),
      apiCalls: Math.floor(Math.random() * 5000) + 8000 + (index * 100),
      responseTime: Math.floor(Math.random() * 200) + 150,
      errors: Math.floor(Math.random() * 50)
    }))

    // Generate performance data
    const performanceData = days.map((day, index) => ({
      date: format(day, 'MMM dd'),
      responseTime: Math.floor(Math.random() * 100) + 120 + Math.sin(index * 0.1) * 20,
      errorRate: Math.random() * 2 + 0.5,
      throughput: Math.floor(Math.random() * 1000) + 2000 + Math.cos(index * 0.1) * 200
    }))

    setAnalyticsData(prev => ({
      ...prev,
      revenue: {
        ...prev.revenue,
        daily: revenueData
      },
      users: {
        ...prev.users,
        daily: revenueData.map(d => ({ date: d.date, users: d.users }))
      },
      performance: {
        responseTime: performanceData,
        errorRate: performanceData,
        throughput: performanceData
      }
    }))
  }

  // Initialize data
  useEffect(() => {
    generateMockData()
  }, [dateRange])

  // Real-time updates
  useEffect(() => {
    if (isRealTimeEnabled && viewMode === 'realtime') {
      const interval = setInterval(() => {
        setAnalyticsData(prev => ({
          ...prev,
          overview: {
            ...prev.overview,
            apiRequests: prev.overview.apiRequests + Math.floor(Math.random() * 10),
            activeUsers: prev.overview.activeUsers + Math.floor(Math.random() * 3) - 1
          }
        }))
      }, 2000)
      setRealTimeInterval(interval)
      return () => clearInterval(interval)
    } else if (realTimeInterval) {
      clearInterval(realTimeInterval)
      setRealTimeInterval(null)
    }
  }, [isRealTimeEnabled, viewMode])

  // Computed values
  const totalRevenue = useMemo(() => {
    return analyticsData.revenue.daily.reduce((sum, day) => sum + day.revenue, 0)
  }, [analyticsData.revenue.daily])

  const avgResponseTime = useMemo(() => {
    return analyticsData.performance.responseTime.reduce((sum, day) => sum + day.responseTime, 0) / analyticsData.performance.responseTime.length
  }, [analyticsData.performance.responseTime])

  const totalApiCalls = useMemo(() => {
    return analyticsData.revenue.daily.reduce((sum, day) => sum + day.apiCalls, 0)
  }, [analyticsData.revenue.daily])

  // Handlers
  const handleDateRangeChange = (preset: string) => {
    const now = new Date()
    let start: Date

    switch (preset) {
      case '7d':
        start = subDays(now, 7)
        break
      case '30d':
        start = subDays(now, 30)
        break
      case '90d':
        start = subDays(now, 90)
        break
      case '1y':
        start = subMonths(now, 12)
        break
      default:
        start = subDays(now, 30)
    }

    setDateRange({ startDate: start, endDate: now })
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      generateMockData()
      success('Analytics data refreshed successfully')
    } catch (err) {
      error('Failed to refresh analytics data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async (format: 'csv' | 'json' | 'pdf') => {
    setIsLoading(true)
    try {
      // Simulate export
      await new Promise(resolve => setTimeout(resolve, 2000))
      success(`Analytics report exported as ${format.toUpperCase()}`)
      setShowExportModal(false)
    } catch (err) {
      error('Failed to export analytics report')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleChartExpansion = (chartId: string) => {
    setExpandedCharts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(chartId)) {
        newSet.delete(chartId)
      } else {
        newSet.add(chartId)
      }
      return newSet
    })
  }

  // Recent activity (mock data with timestamps)
  const recentActivity = useMemo(() => [
    {
      id: 1,
      time: new Date(Date.now() - 2 * 60 * 60 * 1000),
      event: 'Peak API usage reached',
      value: '2,847 req/min',
      type: 'performance',
      severity: 'info'
    },
    {
      id: 2,
      time: new Date(Date.now() - 4 * 60 * 60 * 1000),
      event: 'New user milestone',
      value: '1,247 total users',
      type: 'growth',
      severity: 'success'
    },
    {
      id: 3,
      time: new Date(Date.now() - 6 * 60 * 60 * 1000),
      event: 'Revenue target achieved',
      value: '$45,230/month',
      type: 'revenue',
      severity: 'success'
    },
    {
      id: 4,
      time: new Date(Date.now() - 24 * 60 * 60 * 1000),
      event: 'System performance improved',
      value: 'Response time -12%',
      type: 'performance',
      severity: 'success'
    },
    {
      id: 5,
      time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      event: 'High error rate detected',
      value: '2.3% error rate',
      type: 'error',
      severity: 'warning'
    }
  ], [])

  const topFeatures = useMemo(() => [
    { name: 'AI Chat Completion', usage: 45230, growth: 18.5, category: 'ai' },
    { name: 'Image Generation', usage: 28940, growth: 24.7, category: 'creative' },
    { name: 'Code Generation', usage: 19850, growth: 15.2, category: 'development' },
    { name: 'Data Analysis', usage: 15680, growth: 31.8, category: 'analytics' },
    { name: 'Translation', usage: 12890, growth: 8.9, category: 'language' },
    { name: 'Voice Synthesis', usage: 9870, growth: -2.1, category: 'audio' }
  ], [])

  return (
    <ProtectedRoute requiredPermissions={['view_analytics']}>
      <AdminLayout>
        <div className="space-y-8">
          {/* Enhanced Header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Analytics & Reports</h1>
              <p className="text-gray-600 mt-2">Advanced analytics with real-time data, interactive charts, and custom reporting</p>
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isRealTimeEnabled ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                  <span className="text-sm text-gray-600">
                    {isRealTimeEnabled ? 'Live Data' : 'Static Data'}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Last updated: {format(new Date(), 'MMM dd, HH:mm:ss')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* View Mode Selector */}
              <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
                {[
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'detailed', label: 'Detailed', icon: LineChartIcon },
                  { id: 'realtime', label: 'Real-time', icon: Activity }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setViewMode(id as typeof viewMode)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center space-x-1 ${
                      viewMode === id
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettingsModal(true)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExportModal(true)}
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {/* Date Range Controls */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="font-medium text-gray-900">Date Range:</span>
                </div>

                <div className="flex items-center space-x-2">
                  {['7d', '30d', '90d', '1y'].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleDateRangeChange(preset)}
                      className={`px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                        format(dateRange.startDate, 'yyyy-MM-dd') === format(
                          preset === '7d' ? subDays(new Date(), 7) :
                          preset === '30d' ? subDays(new Date(), 30) :
                          preset === '90d' ? subDays(new Date(), 90) :
                          subMonths(new Date(), 12), 'yyyy-MM-dd'
                        )
                          ? 'bg-red-100 text-red-700 font-medium'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {preset === '7d' ? '7 Days' :
                       preset === '30d' ? '30 Days' :
                       preset === '90d' ? '90 Days' : '1 Year'}
                    </button>
                  ))}

                  <button
                    onClick={() => setCustomDateModal(true)}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md transition-all duration-200"
                  >
                    Custom
                  </button>
                </div>

                <div className="flex-1 text-sm text-gray-600">
                  {format(dateRange.startDate, 'MMM dd, yyyy')} - {format(dateRange.endDate, 'MMM dd, yyyy')}
                  <span className="ml-2 text-gray-400">
                    ({Math.ceil((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24))} days)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
                <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-2 animate-in slide-in-from-bottom-2 duration-500">
                  {analyticsData.overview.totalUsers.toLocaleString()}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-green-600">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{analyticsData.users.growth}% growth
                  </div>
                  <div className="text-xs text-blue-600 font-medium">
                    {analyticsData.overview.activeUsers} active
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Revenue</CardTitle>
                <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors duration-300">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-2 animate-in slide-in-from-bottom-2 duration-500 delay-100">
                  ${totalRevenue.toLocaleString()}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-green-600">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{analyticsData.revenue.growth}% this period
                  </div>
                  <div className="text-xs text-green-600 font-medium">
                    Avg: ${(totalRevenue / analyticsData.revenue.daily.length).toFixed(0)}/day
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">API Usage</CardTitle>
                <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors duration-300">
                  <Zap className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-2 animate-in slide-in-from-bottom-2 duration-500 delay-200">
                  {totalApiCalls.toLocaleString()}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-green-600">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +23.1% increase
                  </div>
                  <div className="text-xs text-purple-600 font-medium">
                    {Math.round(totalApiCalls / analyticsData.revenue.daily.length)}/day avg
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Performance</CardTitle>
                <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors duration-300">
                  <Activity className="h-4 w-4 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-2 animate-in slide-in-from-bottom-2 duration-500 delay-300">
                  {avgResponseTime.toFixed(0)}ms
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {analyticsData.overview.systemUptime}% uptime
                  </div>
                  <div className="text-xs text-orange-600 font-medium">
                    Target: &lt;200ms
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Charts Section */}
          <div className="space-y-6">
            {/* Chart Controls */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">Metrics:</span>
                    {[
                      { id: 'users', label: 'Users', color: 'blue' },
                      { id: 'revenue', label: 'Revenue', color: 'green' },
                      { id: 'api', label: 'API Calls', color: 'purple' }
                    ].map(({ id, label, color }) => (
                      <label key={id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedMetrics.includes(id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMetrics([...selectedMetrics, id])
                            } else {
                              setSelectedMetrics(selectedMetrics.filter(m => m !== id))
                            }
                          }}
                          className={`w-4 h-4 text-${color}-600 bg-gray-100 border-gray-300 rounded focus:ring-${color}-500`}
                        />
                        <span className="text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">Chart Type:</span>
                    {[
                      { id: 'line', label: 'Line', icon: LineChartIcon },
                      { id: 'area', label: 'Area', icon: BarChart3 },
                      { id: 'bar', label: 'Bar', icon: BarChart3 },
                      { id: 'composed', label: 'Composed', icon: PieChartIcon }
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => setChartType(id as typeof chartType)}
                        className={`px-3 py-2 text-sm rounded-md transition-all duration-200 flex items-center space-x-1 ${
                          chartType === id
                            ? 'bg-red-100 text-red-700 font-medium'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Analytics Chart */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-red-600" />
                    Analytics Overview
                    {viewMode === 'realtime' && (
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full animate-pulse">
                        LIVE
                      </span>
                    )}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleChartExpansion('main')}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {expandedCharts.has('main') ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className={`${expandedCharts.has('main') ? 'h-96' : 'h-80'} transition-all duration-300`}>
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'line' ? (
                      <LineChart data={analyticsData.revenue.daily}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Legend />
                        {selectedMetrics.includes('users') && (
                          <Line
                            type="monotone"
                            dataKey="users"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            name="Users"
                            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                          />
                        )}
                        {selectedMetrics.includes('revenue') && (
                          <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#10B981"
                            strokeWidth={2}
                            name="Revenue ($)"
                            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                          />
                        )}
                        {selectedMetrics.includes('api') && (
                          <Line
                            type="monotone"
                            dataKey="apiCalls"
                            stroke="#8B5CF6"
                            strokeWidth={2}
                            name="API Calls"
                            dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                          />
                        )}
                      </LineChart>
                    ) : chartType === 'area' ? (
                      <AreaChart data={analyticsData.revenue.daily}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Legend />
                        {selectedMetrics.includes('users') && (
                          <Area
                            type="monotone"
                            dataKey="users"
                            stackId="1"
                            stroke="#3B82F6"
                            fill="#3B82F6"
                            fillOpacity={0.6}
                            name="Users"
                          />
                        )}
                        {selectedMetrics.includes('revenue') && (
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stackId="2"
                            stroke="#10B981"
                            fill="#10B981"
                            fillOpacity={0.6}
                            name="Revenue ($)"
                          />
                        )}
                        {selectedMetrics.includes('api') && (
                          <Area
                            type="monotone"
                            dataKey="apiCalls"
                            stackId="3"
                            stroke="#8B5CF6"
                            fill="#8B5CF6"
                            fillOpacity={0.6}
                            name="API Calls"
                          />
                        )}
                      </AreaChart>
                    ) : chartType === 'bar' ? (
                      <BarChart data={analyticsData.revenue.daily}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Legend />
                        {selectedMetrics.includes('users') && (
                          <Bar dataKey="users" fill="#3B82F6" name="Users" />
                        )}
                        {selectedMetrics.includes('revenue') && (
                          <Bar dataKey="revenue" fill="#10B981" name="Revenue ($)" />
                        )}
                        {selectedMetrics.includes('api') && (
                          <Bar dataKey="apiCalls" fill="#8B5CF6" name="API Calls" />
                        )}
                      </BarChart>
                    ) : (
                      <ComposedChart data={analyticsData.revenue.daily}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Legend />
                        {selectedMetrics.includes('users') && (
                          <Bar dataKey="users" fill="#3B82F6" name="Users" />
                        )}
                        {selectedMetrics.includes('revenue') && (
                          <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#10B981"
                            strokeWidth={3}
                            name="Revenue ($)"
                            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                          />
                        )}
                        {selectedMetrics.includes('api') && (
                          <Area
                            type="monotone"
                            dataKey="apiCalls"
                            stroke="#8B5CF6"
                            fill="#8B5CF6"
                            fillOpacity={0.3}
                            name="API Calls"
                          />
                        )}
                      </ComposedChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Performance Charts */}
            {viewMode !== 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-orange-600" />
                      Response Time & Throughput
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analyticsData.performance.responseTime}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis dataKey="date" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="responseTime"
                            stroke="#F59E0B"
                            strokeWidth={2}
                            name="Response Time (ms)"
                            dot={{ fill: '#F59E0B', strokeWidth: 2, r: 3 }}
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="throughput"
                            stroke="#EF4444"
                            strokeWidth={2}
                            name="Throughput (req/min)"
                            dot={{ fill: '#EF4444', strokeWidth: 2, r: 3 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                      Error Rate Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analyticsData.performance.errorRate}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="errorRate"
                            stroke="#EF4444"
                            fill="#EF4444"
                            fillOpacity={0.3}
                            name="Error Rate (%)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* API Usage by Tier */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChartIcon className="w-5 h-5 mr-2 text-purple-600" />
                  API Usage Distribution by Tier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analyticsData.apiUsage.byTier}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="percentage"
                        >
                          {analyticsData.apiUsage.byTier.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-4">
                    {analyticsData.apiUsage.byTier.map((tier, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: tier.color }}
                          />
                          <div>
                            <p className="font-medium text-gray-900">{tier.tier}</p>
                            <p className="text-sm text-gray-600">{tier.usage.toLocaleString()} requests</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{tier.percentage}%</p>
                          <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${tier.percentage}%`,
                                backgroundColor: tier.color
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Features */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-600" />
                  Top Features by Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg hover:shadow-sm transition-all duration-200 group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">
                            {feature.name}
                          </p>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            feature.category === 'ai' ? 'bg-blue-100 text-blue-700' :
                            feature.category === 'creative' ? 'bg-purple-100 text-purple-700' :
                            feature.category === 'development' ? 'bg-green-100 text-green-700' :
                            feature.category === 'analytics' ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {feature.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{feature.usage.toLocaleString()} uses</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className={`flex items-center space-x-1 text-sm font-medium ${
                          feature.growth > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {feature.growth > 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span>{feature.growth > 0 ? '+' : ''}{feature.growth}%</span>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${
                          feature.growth > 15 ? 'bg-green-400' :
                          feature.growth > 0 ? 'bg-yellow-400' : 'bg-red-400'
                        } animate-pulse`} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-600" />
                  Recent Activity & Milestones
                  <div className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    Live Feed
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={activity.id}
                      className={`flex items-start space-x-3 p-3 rounded-lg transition-all duration-200 hover:shadow-sm ${
                        activity.severity === 'success' ? 'bg-green-50 border border-green-200' :
                        activity.severity === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                        'bg-blue-50 border border-blue-200'
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex-shrink-0 mt-1">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${
                          activity.severity === 'success' ? 'bg-green-400' :
                          activity.severity === 'warning' ? 'bg-yellow-400' :
                          'bg-blue-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.event}</p>
                        <p className="text-sm text-gray-600 mt-1">{activity.value}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-500">
                            {format(activity.time, 'MMM dd, HH:mm')}
                          </p>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            activity.type === 'performance' ? 'bg-orange-100 text-orange-700' :
                            activity.type === 'growth' ? 'bg-green-100 text-green-700' :
                            activity.type === 'revenue' ? 'bg-blue-100 text-blue-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {activity.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                    View all activity →
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Advanced Metrics Grid */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
                Advanced Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {analyticsData.overview.conversionRate.toFixed(1)}%
                  </div>
                  <p className="text-sm text-blue-700 font-medium">Conversion Rate</p>
                  <div className="flex items-center justify-center text-xs text-blue-600 mt-2">
                    <Target className="w-3 h-3 mr-1" />
                    Target: &gt;3%
                  </div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 mb-2">
                    {analyticsData.overview.churnRate.toFixed(1)}%
                  </div>
                  <p className="text-sm text-red-700 font-medium">Churn Rate</p>
                  <div className="flex items-center justify-center text-xs text-red-600 mt-2">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Industry avg: 5.2%
                  </div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {analyticsData.overview.systemUptime}%
                  </div>
                  <p className="text-sm text-green-700 font-medium">System Uptime</p>
                  <div className="flex items-center justify-center text-xs text-green-600 mt-2">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    SLA: 99.9%
                  </div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-2">
                    {Math.round(totalApiCalls / analyticsData.overview.totalUsers).toLocaleString()}
                  </div>
                  <p className="text-sm text-purple-700 font-medium">API Calls per User</p>
                  <div className="flex items-center justify-center text-xs text-purple-600 mt-2">
                    <Zap className="w-3 h-3 mr-1" />
                    Avg utilization
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Modals */}
          {/* Custom Date Range Modal */}
          <Modal
            isOpen={customDateModal}
            onClose={() => setCustomDateModal(false)}
            title="Custom Date Range"
            size="md"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <DatePicker
                    id="startDate"
                    selected={dateRange.startDate}
                    onChange={(date: Date) => date && setDateRange(prev => ({ ...prev, startDate: date }))}
                    dateFormat="MMM dd, yyyy"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <DatePicker
                    id="endDate"
                    selected={dateRange.endDate}
                    onChange={(date: Date) => date && setDateRange(prev => ({ ...prev, endDate: date }))}
                    dateFormat="MMM dd, yyyy"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setCustomDateModal(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setCustomDateModal(false)
                    generateMockData()
                  }}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Apply Range
                </Button>
              </div>
            </div>
          </Modal>

          {/* Export Modal */}
          <Modal
            isOpen={showExportModal}
            onClose={() => setShowExportModal(false)}
            title="Export Analytics Report"
          >
            <div className="space-y-4">
              <div>
                <Label>Export Format</Label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {[
                    { id: 'csv', label: 'CSV', icon: FileText },
                    { id: 'json', label: 'JSON', icon: FileText },
                    { id: 'pdf', label: 'PDF', icon: FileText }
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => handleExport(id as 'csv' | 'json' | 'pdf')}
                      disabled={isLoading}
                      className="p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all duration-200 flex flex-col items-center space-y-2"
                    >
                      <Icon className="w-6 h-6 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Date Range: {format(dateRange.startDate, 'MMM dd')} - {format(dateRange.endDate, 'MMM dd, yyyy')}</span>
                <span>{analyticsData.revenue.daily.length} data points</span>
              </div>
            </div>
          </Modal>

          {/* Settings Modal */}
          <Modal
            isOpen={showSettingsModal}
            onClose={() => setShowSettingsModal(false)}
            title="Analytics Settings"
          >
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Real-time Updates</Label>
                    <p className="text-sm text-gray-600">Automatically refresh data every 2 seconds</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isRealTimeEnabled}
                      onChange={(e) => setIsRealTimeEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-medium">Default Metrics</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'users', label: 'User Analytics' },
                      { id: 'revenue', label: 'Revenue Tracking' },
                      { id: 'api', label: 'API Usage' },
                      { id: 'performance', label: 'Performance Metrics' }
                    ].map(({ id, label }) => (
                      <label key={id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedMetrics.includes(id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMetrics([...selectedMetrics, id])
                            } else {
                              setSelectedMetrics(selectedMetrics.filter(m => m !== id))
                            }
                          }}
                          className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}

