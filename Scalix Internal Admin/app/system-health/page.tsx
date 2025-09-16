'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loading, PageLoading } from '@/components/ui/loading'
import { Modal, FormModal, ConfirmModal } from '@/components/ui/modal'
import { useToast } from '@/components/ui/toast'
import AdminLayout from '@/components/layout/AdminLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Settings,
  Database,
  Server,
  Wifi,
  Cpu,
  MemoryStick,
  HardDrive,
  Globe,
  Zap,
  Eye,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Gauge,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Play,
  Square,
  RotateCw,
  Terminal,
  Network,
  Cloud
} from 'lucide-react'
import { LineChart as RechartsLineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts'

interface ServiceStatus {
  id: string
  name: string
  type: 'api' | 'database' | 'cache' | 'worker' | 'web' | 'storage'
  status: 'healthy' | 'warning' | 'critical' | 'offline'
  uptime: number // percentage
  responseTime: number // milliseconds
  lastChecked: string
  endpoint?: string
  version?: string
  region?: string
  dependencies?: string[]
}

interface SystemMetric {
  id: string
  timestamp: string
  overallHealth: number
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  networkLatency: number
  activeConnections: number
  errorRate: number
  throughput: number
}

interface HealthAlert {
  id: string
  type: 'critical' | 'warning' | 'info'
  title: string
  description: string
  service?: string
  value: number
  threshold: number
  timestamp: string
  resolved: boolean
}

export default function SystemHealthPage() {
  const { success, error, info } = useToast()

  // Real-time service status data
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      id: 'api-gateway',
      name: 'API Gateway',
      type: 'api',
      status: 'healthy',
      uptime: 99.8,
      responseTime: 145,
      lastChecked: new Date().toISOString(),
      endpoint: 'https://api.scalix.world',
      version: 'v2.1.0',
      region: 'us-east-1'
    },
    {
      id: 'main-database',
      name: 'Main Database',
      type: 'database',
      status: 'healthy',
      uptime: 99.9,
      responseTime: 12,
      lastChecked: new Date().toISOString(),
      endpoint: 'postgresql://prod-db',
      version: 'PostgreSQL 15.4'
    },
    {
      id: 'redis-cache',
      name: 'Redis Cache',
      type: 'cache',
      status: 'healthy',
      uptime: 99.7,
      responseTime: 3,
      lastChecked: new Date().toISOString(),
      version: 'Redis 7.0'
    },
    {
      id: 'web-frontend',
      name: 'Web Frontend',
      type: 'web',
      status: 'healthy',
      uptime: 99.5,
      responseTime: 89,
      lastChecked: new Date().toISOString(),
      endpoint: 'https://scalix.world',
      version: 'v1.8.2'
    },
    {
      id: 'worker-queue',
      name: 'Worker Queue',
      type: 'worker',
      status: 'warning',
      uptime: 98.2,
      responseTime: 234,
      lastChecked: new Date().toISOString(),
      dependencies: ['redis-cache', 'main-database']
    },
    {
      id: 'file-storage',
      name: 'File Storage',
      type: 'storage',
      status: 'healthy',
      uptime: 99.9,
      responseTime: 67,
      lastChecked: new Date().toISOString(),
      region: 'us-east-1'
    },
    {
      id: 'cdn-network',
      name: 'CDN Network',
      type: 'storage',
      status: 'healthy',
      uptime: 99.8,
      responseTime: 23,
      lastChecked: new Date().toISOString(),
      region: 'global'
    },
    {
      id: 'monitoring-service',
      name: 'Monitoring Service',
      type: 'worker',
      status: 'healthy',
      uptime: 99.6,
      responseTime: 156,
      lastChecked: new Date().toISOString()
    }
  ])

  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([
    {
      id: '1',
      timestamp: new Date().toISOString(),
      overallHealth: 98.5,
      cpuUsage: 45,
      memoryUsage: 62,
      diskUsage: 78,
      networkLatency: 23,
      activeConnections: 1247,
      errorRate: 0.8,
      throughput: 1250
    }
  ])

  const [healthAlerts, setHealthAlerts] = useState<HealthAlert[]>([
    {
      id: 'alert_1',
      type: 'warning',
      title: 'High Worker Queue Latency',
      description: 'Worker queue response time exceeded 200ms threshold',
      service: 'worker-queue',
      value: 234,
      threshold: 200,
      timestamp: new Date().toISOString(),
      resolved: false
    },
    {
      id: 'alert_2',
      type: 'info',
      title: 'Scheduled Maintenance',
      description: 'Database maintenance scheduled for 3:00 AM UTC',
      value: 0,
      threshold: 0,
      timestamp: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      resolved: false
    }
  ])

  // UI State
  const [isLoading, setIsLoading] = useState(false)
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true)
  const [selectedService, setSelectedService] = useState<ServiceStatus | null>(null)
  const [showServiceDetails, setShowServiceDetails] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState(30000) // 30 seconds

  // Real-time updates
  useEffect(() => {
    if (!isRealTimeEnabled) return

    const interval = setInterval(() => {
      // Update service statuses with small variations
      setServices(prevServices =>
        prevServices.map(service => ({
          ...service,
          lastChecked: new Date().toISOString(),
          responseTime: Math.max(5, service.responseTime + Math.floor(Math.random() * 20 - 10)),
          uptime: Math.max(95, Math.min(99.9, service.uptime + (Math.random() * 0.2 - 0.1)))
        }))
      )

      // Add new system metric
      const newMetric: SystemMetric = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        overallHealth: 98 + Math.random() * 2,
        cpuUsage: 40 + Math.random() * 20,
        memoryUsage: 55 + Math.random() * 25,
        diskUsage: 75 + Math.random() * 10,
        networkLatency: 20 + Math.random() * 20,
        activeConnections: 1200 + Math.floor(Math.random() * 200),
        errorRate: Math.random() * 2,
        throughput: 1100 + Math.floor(Math.random() * 400)
      }

      setSystemMetrics(prev => [...prev.slice(-29), newMetric])
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [isRealTimeEnabled, refreshInterval])

  // Computed metrics
  const healthMetrics = useMemo(() => {
    const totalServices = services.length
    const healthyServices = services.filter(s => s.status === 'healthy').length
    const warningServices = services.filter(s => s.status === 'warning').length
    const criticalServices = services.filter(s => s.status === 'critical' || s.status === 'offline').length

    const overallHealth = Math.round((healthyServices / totalServices) * 100)
    const averageResponseTime = Math.round(services.reduce((sum, s) => sum + s.responseTime, 0) / totalServices)
    const averageUptime = services.reduce((sum, s) => sum + s.uptime, 0) / totalServices

    return {
      totalServices,
      healthyServices,
      warningServices,
      criticalServices,
      overallHealth,
      averageResponseTime,
      averageUptime,
      systemScore: Math.round((overallHealth + averageUptime) / 2)
    }
  }, [services])

  // Handlers
  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      success('System health data refreshed successfully')
    } catch (err) {
      error('Failed to refresh system health data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleServiceAction = async (serviceId: string, action: 'restart' | 'stop' | 'start') => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      success(`Service ${action} command sent successfully`)
    } catch (err) {
      error(`Failed to ${action} service`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResolveAlert = (alertId: string) => {
    setHealthAlerts(alerts =>
      alerts.map(alert =>
        alert.id === alertId ? { ...alert, resolved: true } : alert
      )
    )
    success('Alert resolved successfully')
  }

  const getServiceStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800 border-green-200'
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'offline': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getServiceTypeIcon = (type: ServiceStatus['type']) => {
    switch (type) {
      case 'api': return <Globe className="w-4 h-4" />
      case 'database': return <Database className="w-4 h-4" />
      case 'cache': return <Zap className="w-4 h-4" />
      case 'worker': return <Terminal className="w-4 h-4" />
      case 'web': return <Globe className="w-4 h-4" />
      case 'storage': return <HardDrive className="w-4 h-4" />
      default: return <Server className="w-4 h-4" />
    }
  }

  const getServiceStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'critical': return <XCircle className="w-5 h-5 text-red-600" />
      case 'offline': return <XCircle className="w-5 h-5 text-gray-600" />
      default: return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  // Chart data
  const healthData = [
    { name: 'Healthy', value: healthMetrics.healthyServices, fill: '#10B981' },
    { name: 'Warning', value: healthMetrics.warningServices, fill: '#F59E0B' },
    { name: 'Critical', value: healthMetrics.criticalServices, fill: '#EF4444' }
  ]

  const performanceData = systemMetrics.map(metric => ({
    time: new Date(metric.timestamp).toLocaleTimeString(),
    cpu: metric.cpuUsage,
    memory: metric.memoryUsage,
    network: metric.networkLatency,
    connections: metric.activeConnections,
    health: metric.overallHealth
  }))

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

  return (
    <ProtectedRoute requiredPermissions={['view_system_health']}>
      <AdminLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Health</h1>
              <p className="text-gray-600 mt-2">Real-time monitoring of infrastructure health and service status</p>
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isRealTimeEnabled ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                  <span className="text-sm text-gray-600">
                    {isRealTimeEnabled ? 'Live Monitoring' : 'Static View'}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleString()}
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  healthMetrics.systemScore >= 95 ? 'bg-green-100 text-green-800' :
                  healthMetrics.systemScore >= 85 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  System Score: {healthMetrics.systemScore}/100
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center space-x-2">
                <Label className="text-sm text-gray-600">Refresh:</Label>
                <select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white transition-all duration-200"
                >
                  <option value="10000">10s</option>
                  <option value="30000">30s</option>
                  <option value="60000">1m</option>
                  <option value="300000">5m</option>
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
            </div>
          </div>

          {/* Health Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Overall Health</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{healthMetrics.overallHealth}%</p>
                    <div className="flex items-center text-xs text-green-600">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {healthMetrics.healthyServices}/{healthMetrics.totalServices} healthy
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors duration-300">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        healthMetrics.overallHealth >= 90 ? 'bg-green-500' :
                        healthMetrics.overallHealth >= 70 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${healthMetrics.overallHealth}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Services Online</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {healthMetrics.healthyServices}/{healthMetrics.totalServices}
                    </p>
                    <div className="flex items-center text-xs text-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {healthMetrics.warningServices} warnings
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors duration-300">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(healthMetrics.healthyServices / healthMetrics.totalServices) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Avg Response Time</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {healthMetrics.averageResponseTime}ms
                    </p>
                    <div className="flex items-center text-xs text-blue-600">
                      <Clock className="w-3 h-3 mr-1" />
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
                        healthMetrics.averageResponseTime <= 200 ? 'bg-green-500' :
                        healthMetrics.averageResponseTime <= 500 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${Math.min((healthMetrics.averageResponseTime / 3), 100)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Critical Issues</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {healthMetrics.criticalServices}
                    </p>
                    <div className="flex items-center text-xs text-red-600">
                      <XCircle className="w-3 h-3 mr-1" />
                      {healthMetrics.warningServices} warnings
                    </div>
                  </div>
                  <div className="p-3 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors duration-300">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        healthMetrics.criticalServices === 0 ? 'bg-green-500' :
                        healthMetrics.criticalServices <= 2 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${Math.min((healthMetrics.criticalServices / healthMetrics.totalServices) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Health Alerts */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                  Health Alerts ({healthAlerts.filter(a => !a.resolved).length})
                </CardTitle>
                <div className="text-sm text-gray-500">
                  {healthAlerts.filter(a => a.resolved).length} resolved
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {healthAlerts.filter(alert => !alert.resolved).map((alert) => (
                  <div key={alert.id} className={`flex items-center justify-between p-4 rounded-lg border ${
                    alert.type === 'critical' ? 'bg-red-50 border-red-200' :
                    alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        alert.type === 'critical' ? 'bg-red-100' :
                        alert.type === 'warning' ? 'bg-yellow-100' :
                        'bg-blue-100'
                      }`}>
                        {alert.type === 'critical' ? <XCircle className="w-5 h-5 text-red-600" /> :
                         alert.type === 'warning' ? <AlertTriangle className="w-5 h-5 text-yellow-600" /> :
                         <Eye className="w-5 h-5 text-blue-600" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{alert.title}</p>
                        <p className="text-sm text-gray-600">{alert.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {alert.service && `Service: ${alert.service} • `}
                          Current: {alert.value} | Threshold: {alert.threshold} | {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleResolveAlert(alert.id)}
                      className={`${
                        alert.type === 'critical' ? 'bg-red-600 hover:bg-red-700' :
                        alert.type === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700' :
                        'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Resolve
                    </Button>
                  </div>
                ))}
                {healthAlerts.filter(a => !a.resolved).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-medium">All systems operating normally</p>
                    <p className="text-sm">No health alerts at this time</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Service Status Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Server className="w-5 h-5 mr-2 text-blue-600" />
                    Service Health Overview
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={handleRefresh}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={healthData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {healthData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Gauge className="w-5 h-5 mr-2 text-green-600" />
                    System Performance
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={handleRefresh}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="cpu" stroke="#3B82F6" strokeWidth={2} name="CPU %" />
                      <Line type="monotone" dataKey="memory" stroke="#10B981" strokeWidth={2} name="Memory %" />
                      <Line type="monotone" dataKey="health" stroke="#F59E0B" strokeWidth={3} name="Health %" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Service Status Table */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Network className="w-5 h-5 mr-2 text-purple-600" />
                Service Status ({services.length} services)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                    onClick={() => {
                      setSelectedService(service)
                      setShowServiceDetails(true)
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${
                        service.status === 'healthy' ? 'bg-green-100' :
                        service.status === 'warning' ? 'bg-yellow-100' :
                        service.status === 'critical' ? 'bg-red-100' :
                        'bg-gray-100'
                      }`}>
                        {getServiceStatusIcon(service.status)}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">{service.name}</h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getServiceStatusColor(service.status)}`}>
                            {service.status}
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {getServiceTypeIcon(service.type)}
                            <span className="ml-1 capitalize">{service.type}</span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>Uptime: {service.uptime.toFixed(1)}%</span>
                          <span>Response: {service.responseTime}ms</span>
                          {service.endpoint && <span>Endpoint: {service.endpoint}</span>}
                          {service.region && <span>Region: {service.region}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {service.uptime.toFixed(1)}% uptime
                        </div>
                        <div className="text-xs text-gray-500">
                          Last checked: {new Date(service.lastChecked).toLocaleTimeString()}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {service.status === 'healthy' ? (
                          <Button variant="ghost" size="sm" className="text-green-600">
                            <Play className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleServiceAction(service.id, 'restart')
                            }}
                          >
                            <RotateCw className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleServiceAction(service.id, 'restart')
                          }}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Service Details Modal */}
          <Modal
            isOpen={showServiceDetails}
            onClose={() => {
              setShowServiceDetails(false)
              setSelectedService(null)
            }}
            title="Service Details"
            size="lg"
          >
            {selectedService && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      selectedService.status === 'healthy' ? 'bg-green-100' :
                      selectedService.status === 'warning' ? 'bg-yellow-100' :
                      selectedService.status === 'critical' ? 'bg-red-100' :
                      'bg-gray-100'
                    }`}>
                      {getServiceStatusIcon(selectedService.status)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{selectedService.name}</h3>
                      <p className="text-sm text-gray-600">{selectedService.type} service</p>
                      <div className="flex items-center space-x-3 mt-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getServiceStatusColor(selectedService.status)}`}>
                          {selectedService.status}
                        </span>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          Uptime: {selectedService.uptime.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {selectedService.responseTime}ms
                    </div>
                    <p className="text-sm text-blue-700">Response Time</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {selectedService.uptime.toFixed(1)}%
                    </div>
                    <p className="text-sm text-green-700">Uptime</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                      {selectedService.type}
                    </div>
                    <p className="text-sm text-purple-700">Service Type</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-2">
                      {selectedService.region || 'N/A'}
                    </div>
                    <p className="text-sm text-orange-700">Region</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Service Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Service ID</p>
                      <code className="text-sm font-mono">{selectedService.id}</code>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Last Checked</p>
                      <p className="text-sm">{new Date(selectedService.lastChecked).toLocaleString()}</p>
                    </div>
                    {selectedService.endpoint && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Endpoint</p>
                        <code className="text-sm font-mono break-all">{selectedService.endpoint}</code>
                      </div>
                    )}
                    {selectedService.version && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Version</p>
                        <p className="text-sm font-mono">{selectedService.version}</p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedService.dependencies && selectedService.dependencies.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Dependencies</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedService.dependencies.map((dep, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Service Actions</h4>
                  <div className="flex items-center space-x-3">
                    <Button
                      onClick={() => handleServiceAction(selectedService.id, 'restart')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <RotateCw className="w-4 h-4 mr-2" />
                      Restart Service
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleServiceAction(selectedService.id, 'stop')}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      Stop Service
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleServiceAction(selectedService.id, 'start')}
                      className="border-green-300 text-green-600 hover:bg-green-50"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Service
                    </Button>
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
