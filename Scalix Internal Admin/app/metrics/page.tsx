'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loading, PageLoading } from '@/components/ui/loading'
import { useToast } from '@/components/ui/toast'
import AdminLayout from '@/components/layout/AdminLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import {
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  Settings,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Gauge,
  Database,
  Server,
  Wifi,
  Cpu,
  MemoryStick,
  HardDrive,
  Globe,
  Shield,
  Eye,
  Calendar,
  Filter
} from 'lucide-react'
import { LineChart as RechartsLineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, RadialBarChart, RadialBar } from 'recharts'

interface SystemMetric {
  id: string
  timestamp: string
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  networkTraffic: number
  activeUsers: number
  apiRequests: number
  responseTime: number
  errorRate: number
  databaseConnections: number
  cacheHitRate: number
}

interface PerformanceAlert {
  id: string
  type: 'warning' | 'error' | 'info'
  title: string
  description: string
  value: number
  threshold: number
  timestamp: string
  resolved: boolean
}

export default function MetricsPage() {
  const { success, error, info } = useToast()

  // Real-time metrics data
  const [metricsData, setMetricsData] = useState<SystemMetric[]>([
    {
      id: '1',
      timestamp: '2024-01-20T10:00:00Z',
      cpuUsage: 45,
      memoryUsage: 62,
      diskUsage: 78,
      networkTraffic: 1200,
      activeUsers: 245,
      apiRequests: 1250,
      responseTime: 145,
      errorRate: 0.8,
      databaseConnections: 45,
      cacheHitRate: 94.2
    },
    {
      id: '2',
      timestamp: '2024-01-20T10:05:00Z',
      cpuUsage: 52,
      memoryUsage: 68,
      diskUsage: 78,
      networkTraffic: 1350,
      activeUsers: 267,
      apiRequests: 1420,
      responseTime: 132,
      errorRate: 0.6,
      databaseConnections: 48,
      cacheHitRate: 95.1
    },
    {
      id: '3',
      timestamp: '2024-01-20T10:10:00Z',
      cpuUsage: 38,
      memoryUsage: 58,
      diskUsage: 79,
      networkTraffic: 1180,
      activeUsers: 234,
      apiRequests: 1180,
      responseTime: 158,
      errorRate: 1.2,
      databaseConnections: 42,
      cacheHitRate: 93.8
    }
  ])

  const [performanceAlerts, setPerformanceAlerts] = useState<PerformanceAlert[]>([
    {
      id: 'alert_1',
      type: 'warning',
      title: 'High Memory Usage',
      description: 'Memory usage has exceeded 80% threshold',
      value: 85,
      threshold: 80,
      timestamp: '2024-01-20T10:15:00Z',
      resolved: false
    },
    {
      id: 'alert_2',
      type: 'error',
      title: 'API Response Time Spike',
      description: 'Average response time exceeded 200ms',
      value: 245,
      threshold: 200,
      timestamp: '2024-01-20T10:12:00Z',
      resolved: true
    },
    {
      id: 'alert_3',
      type: 'info',
      title: 'Traffic Spike Detected',
      description: 'API requests increased by 35% in the last hour',
      value: 35,
      threshold: 30,
      timestamp: '2024-01-20T10:08:00Z',
      resolved: false
    }
  ])

  // UI State
  const [isLoading, setIsLoading] = useState(false)
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true)
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h')
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['cpu', 'memory', 'api'])
  const [expandedCharts, setExpandedCharts] = useState<Set<string>>(new Set())

  // Real-time updates
  useEffect(() => {
    if (!isRealTimeEnabled) return

    const interval = setInterval(() => {
      const newMetric: SystemMetric = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        cpuUsage: Math.floor(Math.random() * 30) + 40,
        memoryUsage: Math.floor(Math.random() * 20) + 55,
        diskUsage: 78 + Math.floor(Math.random() * 5),
        networkTraffic: Math.floor(Math.random() * 500) + 1000,
        activeUsers: Math.floor(Math.random() * 50) + 220,
        apiRequests: Math.floor(Math.random() * 300) + 1100,
        responseTime: Math.floor(Math.random() * 50) + 120,
        errorRate: Math.random() * 2,
        databaseConnections: Math.floor(Math.random() * 10) + 40,
        cacheHitRate: 90 + Math.random() * 8
      }

      setMetricsData(prev => [...prev.slice(-29), newMetric])
    }, 5000)

    return () => clearInterval(interval)
  }, [isRealTimeEnabled])

  // Computed metrics
  const currentMetrics = useMemo(() => {
    if (metricsData.length === 0) return null
    return metricsData[metricsData.length - 1]
  }, [metricsData])

  const averageMetrics = useMemo(() => {
    if (metricsData.length === 0) return null

    const sum = metricsData.reduce((acc, metric) => ({
      cpuUsage: acc.cpuUsage + metric.cpuUsage,
      memoryUsage: acc.memoryUsage + metric.memoryUsage,
      responseTime: acc.responseTime + metric.responseTime,
      apiRequests: acc.apiRequests + metric.apiRequests,
      errorRate: acc.errorRate + metric.errorRate,
      activeUsers: acc.activeUsers + metric.activeUsers
    }), { cpuUsage: 0, memoryUsage: 0, responseTime: 0, apiRequests: 0, errorRate: 0, activeUsers: 0 })

    const count = metricsData.length
    return {
      avgCpu: sum.cpuUsage / count,
      avgMemory: sum.memoryUsage / count,
      avgResponseTime: sum.responseTime / count,
      totalApiRequests: sum.apiRequests,
      avgErrorRate: sum.errorRate / count,
      avgActiveUsers: sum.activeUsers / count
    }
  }, [metricsData])

  const performanceScore = useMemo(() => {
    if (!currentMetrics) return 0

    const cpuScore = Math.max(0, 100 - currentMetrics.cpuUsage)
    const memoryScore = Math.max(0, 100 - currentMetrics.memoryUsage)
    const responseScore = Math.max(0, 200 - currentMetrics.responseTime) / 2
    const errorScore = Math.max(0, 5 - currentMetrics.errorRate) * 20

    return Math.round((cpuScore + memoryScore + responseScore + errorScore) / 4)
  }, [currentMetrics])

  // Handlers
  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      success('Metrics data refreshed successfully')
    } catch (err) {
      error('Failed to refresh metrics data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async (format: 'csv' | 'json') => {
    setIsLoading(true)
    try {
      // Simulate export
      await new Promise(resolve => setTimeout(resolve, 2000))
      success(`Metrics data exported as ${format.toUpperCase()}`)
    } catch (err) {
      error('Failed to export metrics data')
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

  const resolveAlert = (alertId: string) => {
    setPerformanceAlerts(alerts =>
      alerts.map(alert =>
        alert.id === alertId ? { ...alert, resolved: true } : alert
      )
    )
    success('Alert resolved successfully')
  }

  // Chart data preparation
  const chartData = useMemo(() => {
    return metricsData.map(metric => ({
      time: new Date(metric.timestamp).toLocaleTimeString(),
      cpu: metric.cpuUsage,
      memory: metric.memoryUsage,
      disk: metric.diskUsage,
      users: metric.activeUsers,
      api: metric.apiRequests,
      responseTime: metric.responseTime,
      errorRate: metric.errorRate,
      network: metric.networkTraffic
    }))
  }, [metricsData])

  const systemHealthData = [
    { name: 'CPU', value: currentMetrics?.cpuUsage || 0, fill: '#3B82F6' },
    { name: 'Memory', value: currentMetrics?.memoryUsage || 0, fill: '#10B981' },
    { name: 'Disk', value: currentMetrics?.diskUsage || 0, fill: '#F59E0B' }
  ]

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

  return (
    <ProtectedRoute requiredPermissions={['view_metrics']}>
      <AdminLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Metrics</h1>
              <p className="text-gray-600 mt-2">Real-time monitoring of system performance, health, and key metrics</p>
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isRealTimeEnabled ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                  <span className="text-sm text-gray-600">
                    {isRealTimeEnabled ? 'Live Data' : 'Static Data'}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Last updated: {currentMetrics ? new Date(currentMetrics.timestamp).toLocaleString() : 'N/A'}
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  performanceScore >= 80 ? 'bg-green-100 text-green-800' :
                  performanceScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  Performance: {performanceScore}/100
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center space-x-2">
                <Label className="text-sm text-gray-600">Time Range:</Label>
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white transition-all duration-200"
                >
                  <option value="5m">Last 5 minutes</option>
                  <option value="15m">Last 15 minutes</option>
                  <option value="1h">Last hour</option>
                  <option value="24h">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                </select>
              </div>

              <Button
                variant="outline"
                onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
                className={isRealTimeEnabled ? 'bg-green-50 border-green-300 text-green-700' : ''}
              >
                {isRealTimeEnabled ? 'Pause' : 'Resume'} Live
              </Button>

              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>

              <Button
                variant="outline"
                onClick={() => handleExport('csv')}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">CPU Usage</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {currentMetrics?.cpuUsage || 0}%
                    </p>
                    <div className="flex items-center text-xs text-green-600">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      Avg: {averageMetrics?.avgCpu.toFixed(1)}%
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors duration-300">
                    <Cpu className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        (currentMetrics?.cpuUsage || 0) > 80 ? 'bg-red-500' :
                        (currentMetrics?.cpuUsage || 0) > 60 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${currentMetrics?.cpuUsage || 0}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Memory Usage</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {currentMetrics?.memoryUsage || 0}%
                    </p>
                    <div className="flex items-center text-xs text-green-600">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      Avg: {averageMetrics?.avgMemory.toFixed(1)}%
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors duration-300">
                    <MemoryStick className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        (currentMetrics?.memoryUsage || 0) > 80 ? 'bg-red-500' :
                        (currentMetrics?.memoryUsage || 0) > 60 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${currentMetrics?.memoryUsage || 0}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Response Time</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {currentMetrics?.responseTime || 0}ms
                    </p>
                    <div className="flex items-center text-xs text-green-600">
                      <Target className="w-3 h-3 mr-1" />
                      Target: &lt;200ms
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors duration-300">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        (currentMetrics?.responseTime || 0) > 200 ? 'bg-red-500' :
                        (currentMetrics?.responseTime || 0) > 150 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((currentMetrics?.responseTime || 0) / 3, 100)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Active Users</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {currentMetrics?.activeUsers || 0}
                    </p>
                    <div className="flex items-center text-xs text-blue-600">
                      <Users className="w-3 h-3 mr-1" />
                      Peak: {Math.max(...(metricsData.map(m => m.activeUsers)))}
                    </div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-xl group-hover:bg-orange-100 transition-colors duration-300">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${((currentMetrics?.activeUsers || 0) / 300) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Alerts */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                  Performance Alerts ({performanceAlerts.filter(a => !a.resolved).length})
                </CardTitle>
                <div className="text-sm text-gray-500">
                  {performanceAlerts.filter(a => a.resolved).length} resolved
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceAlerts.filter(alert => !alert.resolved).map((alert) => (
                  <div key={alert.id} className={`flex items-center justify-between p-4 rounded-lg border ${
                    alert.type === 'error' ? 'bg-red-50 border-red-200' :
                    alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        alert.type === 'error' ? 'bg-red-100' :
                        alert.type === 'warning' ? 'bg-yellow-100' :
                        'bg-blue-100'
                      }`}>
                        {alert.type === 'error' ? <AlertTriangle className="w-5 h-5 text-red-600" /> :
                         alert.type === 'warning' ? <AlertTriangle className="w-5 h-5 text-yellow-600" /> :
                         <Eye className="w-5 h-5 text-blue-600" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{alert.title}</p>
                        <p className="text-sm text-gray-600">{alert.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Current: {alert.value} | Threshold: {alert.threshold} | {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => resolveAlert(alert.id)}
                      className={`${
                        alert.type === 'error' ? 'bg-red-600 hover:bg-red-700' :
                        alert.type === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700' :
                        'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Resolve
                    </Button>
                  </div>
                ))}
                {performanceAlerts.filter(a => !a.resolved).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-medium">All systems operating normally</p>
                    <p className="text-sm">No performance alerts at this time</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* System Health Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gauge className="w-5 h-5 mr-2 text-blue-600" />
                  System Health Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={systemHealthData}>
                      <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
                      <Tooltip />
                      <Legend />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                    Resource Usage
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleChartExpansion('resources')}
                  >
                    {expandedCharts.has('resources') ? 'Minimize' : 'Expand'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className={`${expandedCharts.has('resources') ? 'h-96' : 'h-64'} transition-all duration-300`}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="cpu" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="CPU %" />
                      <Area type="monotone" dataKey="memory" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Memory %" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-purple-600" />
                    API Performance
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleChartExpansion('api')}
                  >
                    {expandedCharts.has('api') ? 'Minimize' : 'Expand'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className={`${expandedCharts.has('api') ? 'h-96' : 'h-64'} transition-all duration-300`}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="time" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="api" fill="#8B5CF6" name="API Requests" />
                      <Line yAxisId="right" type="monotone" dataKey="responseTime" stroke="#EF4444" name="Response Time (ms)" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-orange-600" />
                    User Activity & Errors
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleChartExpansion('users')}
                  >
                    {expandedCharts.has('users') ? 'Minimize' : 'Expand'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className={`${expandedCharts.has('users') ? 'h-96' : 'h-64'} transition-all duration-300`}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="time" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="users" stroke="#F59E0B" strokeWidth={3} name="Active Users" />
                      <Line yAxisId="right" type="monotone" dataKey="errorRate" stroke="#EF4444" strokeWidth={2} name="Error Rate (%)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Metrics Grid */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2 text-blue-600" />
                System Resources & Database
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {currentMetrics?.databaseConnections || 0}
                  </div>
                  <p className="text-sm text-blue-700 font-medium">DB Connections</p>
                  <p className="text-xs text-blue-600 mt-1">Active connections</p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {currentMetrics?.cacheHitRate.toFixed(1)}%
                  </div>
                  <p className="text-sm text-green-700 font-medium">Cache Hit Rate</p>
                  <p className="text-xs text-green-600 mt-1">Performance metric</p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-2">
                    {currentMetrics?.diskUsage || 0}%
                  </div>
                  <p className="text-sm text-purple-700 font-medium">Disk Usage</p>
                  <p className="text-xs text-purple-600 mt-1">Storage utilization</p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 mb-2">
                    {currentMetrics?.networkTraffic || 0}KB/s
                  </div>
                  <p className="text-sm text-orange-700 font-medium">Network Traffic</p>
                  <p className="text-xs text-orange-600 mt-1">Data throughput</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
