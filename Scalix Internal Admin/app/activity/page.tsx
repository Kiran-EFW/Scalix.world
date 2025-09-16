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
  Activity,
  Users,
  Database,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  Settings,
  FileText,
  Mail,
  Zap,
  Shield,
  Crown,
  Key,
  BarChart3,
  PieChart,
  Calendar,
  ArrowUpDown,
  MoreHorizontal,
  MessageSquare
} from 'lucide-react'
import { LineChart as RechartsLineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface SystemActivity {
  id: string
  timestamp: string
  userId?: string
  userName?: string
  action: string
  resource: string
  details: string
  ipAddress: string
  userAgent: string
  status: 'success' | 'warning' | 'error' | 'info'
  category: 'user' | 'system' | 'api' | 'security' | 'billing'
  metadata?: Record<string, any>
}

interface ActivityMetrics {
  totalActivities: number
  activeUsers: number
  apiRequests: number
  systemEvents: number
  errorRate: number
  avgResponseTime: number
  topActivities: { action: string; count: number; percentage: number }[]
  activitiesByCategory: { category: string; count: number; percentage: number }[]
  activitiesByHour: { hour: string; count: number }[]
  userEngagement: { user: string; activities: number; lastActivity: string }[]
}

export default function ActivityPage() {
  const { success, error, info } = useToast()

  // Real-time activity data
  const [activities, setActivities] = useState<SystemActivity[]>([
    {
      id: 'act_001',
      timestamp: '2024-01-20T14:30:00Z',
      userId: 'user_001',
      userName: 'John Doe',
      action: 'User Login',
      resource: 'Authentication',
      details: 'Successful login from web application',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'success',
      category: 'user'
    },
    {
      id: 'act_002',
      timestamp: '2024-01-20T14:25:00Z',
      userId: 'user_002',
      userName: 'Jane Smith',
      action: 'API Request',
      resource: 'Chat Completions',
      details: 'POST /api/v1/chat/completions - 200 OK',
      ipAddress: '10.0.0.50',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15',
      status: 'success',
      category: 'api'
    },
    {
      id: 'act_003',
      timestamp: '2024-01-20T14:20:00Z',
      userId: 'user_003',
      userName: 'Bob Wilson',
      action: 'Rate Limit Exceeded',
      resource: 'API Gateway',
      details: 'Too many requests from IP 172.16.0.25',
      ipAddress: '172.16.0.25',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
      status: 'warning',
      category: 'security'
    },
    {
      id: 'act_004',
      timestamp: '2024-01-20T14:15:00Z',
      action: 'System Backup',
      resource: 'Database',
      details: 'Automated daily backup completed successfully',
      ipAddress: '10.0.0.1',
      userAgent: 'System Service',
      status: 'success',
      category: 'system'
    },
    {
      id: 'act_005',
      timestamp: '2024-01-20T14:10:00Z',
      userId: 'user_001',
      userName: 'John Doe',
      action: 'Payment Processed',
      resource: 'Billing',
      details: 'Monthly subscription payment of $299.00 processed',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'success',
      category: 'billing'
    }
  ])

  // UI State
  const [isLoading, setIsLoading] = useState(false)
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true)
  const [selectedActivity, setSelectedActivity] = useState<SystemActivity | null>(null)
  const [showActivityDetails, setShowActivityDetails] = useState(false)
  const [viewMode, setViewMode] = useState<'timeline' | 'analytics' | 'users'>('timeline')

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [timeRange, setTimeRange] = useState<string>('1h')

  // Real-time updates
  useEffect(() => {
    if (!isRealTimeEnabled) return

    const interval = setInterval(() => {
      const actions = [
        'User Login', 'API Request', 'File Upload', 'Settings Update',
        'Payment Processed', 'System Backup', 'Cache Clear', 'User Registration'
      ]
      const resources = [
        'Authentication', 'Chat Completions', 'Image Generation', 'User Profile',
        'Billing', 'Database', 'Cache', 'API Gateway'
      ]
      const categories: SystemActivity['category'][] = ['user', 'api', 'system', 'security', 'billing']
      const statuses: SystemActivity['status'][] = ['success', 'warning', 'error', 'info']

      const newActivity: SystemActivity = {
        id: `act_${Date.now()}`,
        timestamp: new Date().toISOString(),
        userId: Math.random() > 0.3 ? `user_${Math.floor(Math.random() * 100)}` : undefined,
        userName: Math.random() > 0.3 ? `User ${Math.floor(Math.random() * 100)}` : undefined,
        action: actions[Math.floor(Math.random() * actions.length)],
        resource: resources[Math.floor(Math.random() * resources.length)],
        details: `Activity details for ${resources[Math.floor(Math.random() * resources.length)]}`,
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        status: statuses[Math.floor(Math.random() * statuses.length)],
        category: categories[Math.floor(Math.random() * categories.length)]
      }

      setActivities(prev => [newActivity, ...prev.slice(0, 49)])
    }, 3000)

    return () => clearInterval(interval)
  }, [isRealTimeEnabled])

  // Computed metrics
  const metrics: ActivityMetrics = useMemo(() => {
    const totalActivities = activities.length
    const activeUsers = new Set(activities.filter(a => a.userId).map(a => a.userId)).size
    const apiRequests = activities.filter(a => a.category === 'api').length
    const systemEvents = activities.filter(a => a.category === 'system').length
    const errors = activities.filter(a => a.status === 'error').length
    const errorRate = totalActivities > 0 ? (errors / totalActivities) * 100 : 0
    const avgResponseTime = 145 // Mock value

    // Top activities
    const activityCounts = activities.reduce((acc, activity) => {
      acc[activity.action] = (acc[activity.action] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topActivities = Object.entries(activityCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([action, count]) => ({
        action,
        count,
        percentage: Math.round((count / totalActivities) * 100)
      }))

    // Activities by category
    const categoryCounts = activities.reduce((acc, activity) => {
      acc[activity.category] = (acc[activity.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const activitiesByCategory = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([category, count]) => ({
        category,
        count,
        percentage: Math.round((count / totalActivities) * 100)
      }))

    // Activities by hour (mock)
    const activitiesByHour = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i.toString().padStart(2, '0')}:00`,
      count: Math.floor(Math.random() * 50) + 10
    }))

    // User engagement (mock)
    const userEngagement = [
      { user: 'John Doe', activities: 45, lastActivity: '2 min ago' },
      { user: 'Jane Smith', activities: 32, lastActivity: '5 min ago' },
      { user: 'Bob Wilson', activities: 28, lastActivity: '8 min ago' },
      { user: 'Alice Brown', activities: 21, lastActivity: '12 min ago' },
      { user: 'Charlie Davis', activities: 18, lastActivity: '15 min ago' }
    ]

    return {
      totalActivities,
      activeUsers,
      apiRequests,
      systemEvents,
      errorRate,
      avgResponseTime,
      topActivities,
      activitiesByCategory,
      activitiesByHour,
      userEngagement
    }
  }, [activities])

  // Filtered data
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      const matchesSearch = !searchTerm ||
        activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.details.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || activity.status === statusFilter
      const matchesCategory = categoryFilter === 'all' || activity.category === categoryFilter

      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [activities, searchTerm, statusFilter, categoryFilter])

  const handleViewActivity = (activity: SystemActivity) => {
    setSelectedActivity(activity)
    setShowActivityDetails(true)
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      success('Activity data refreshed successfully')
    } catch (err) {
      error('Failed to refresh activity data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async (format: 'csv' | 'json') => {
    setIsLoading(true)
    try {
      // Simulate export
      await new Promise(resolve => setTimeout(resolve, 2000))
      success(`Activity data exported as ${format.toUpperCase()}`)
    } catch (err) {
      error('Failed to export activity data')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: SystemActivity['status']) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'error': return 'bg-red-100 text-red-800'
      case 'info': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: SystemActivity['category']) => {
    switch (category) {
      case 'user': return 'bg-blue-100 text-blue-800'
      case 'api': return 'bg-purple-100 text-purple-800'
      case 'system': return 'bg-green-100 text-green-800'
      case 'security': return 'bg-red-100 text-red-800'
      case 'billing': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: SystemActivity['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />
      case 'warning': return <AlertTriangle className="w-4 h-4" />
      case 'error': return <AlertTriangle className="w-4 h-4" />
      case 'info': return <Eye className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  const getCategoryIcon = (category: SystemActivity['category']) => {
    switch (category) {
      case 'user': return <Users className="w-4 h-4" />
      case 'api': return <Zap className="w-4 h-4" />
      case 'system': return <Settings className="w-4 h-4" />
      case 'security': return <Shield className="w-4 h-4" />
      case 'billing': return <TrendingUp className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  // Chart data
  const hourlyActivityData = metrics.activitiesByHour
  const categoryData = metrics.activitiesByCategory.map(cat => ({
    name: cat.category,
    value: cat.count,
    percentage: cat.percentage
  }))

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

  return (
    <ProtectedRoute requiredPermissions={['view_activities']}>
      <AdminLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Activity</h1>
              <p className="text-gray-600 mt-2">Real-time monitoring of all system activities and user interactions</p>
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isRealTimeEnabled ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                  <span className="text-sm text-gray-600">
                    {isRealTimeEnabled ? 'Live Activity Feed' : 'Static View'}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center space-x-2">
                <Label className="text-sm text-gray-600">Time Range:</Label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
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

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Activities</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{metrics.totalActivities}</p>
                    <div className="flex items-center text-xs text-green-600">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +15.2% from last hour
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors duration-300">
                    <Activity className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Active Users</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{metrics.activeUsers}</p>
                    <div className="flex items-center text-xs text-blue-600">
                      <Users className="w-3 h-3 mr-1" />
                      Currently online
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors duration-300">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">API Requests</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{metrics.apiRequests}</p>
                    <div className="flex items-center text-xs text-purple-600">
                      <Zap className="w-3 h-3 mr-1" />
                      {Math.round(metrics.apiRequests / metrics.totalActivities * 100)}% of activities
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors duration-300">
                    <Zap className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Error Rate</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{metrics.errorRate.toFixed(1)}%</p>
                    <div className="flex items-center text-xs text-red-600">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Target: &lt;2%
                    </div>
                  </div>
                  <div className="p-3 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors duration-300">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* View Mode Tabs */}
          <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                viewMode === 'timeline' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Clock className="w-4 h-4 inline mr-2" />
              Timeline
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                viewMode === 'analytics' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Analytics
            </button>
            <button
              onClick={() => setViewMode('users')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                viewMode === 'users' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Users
            </button>
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
                      placeholder="Search activities by action, user, resource..."
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
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                    <option value="info">Info</option>
                  </select>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white transition-all duration-200"
                  >
                    <option value="all">All Categories</option>
                    <option value="user">User</option>
                    <option value="api">API</option>
                    <option value="system">System</option>
                    <option value="security">Security</option>
                    <option value="billing">Billing</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analytics View */}
          {viewMode === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                      Top Activities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={metrics.topActivities}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis dataKey="action" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#3B82F6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PieChart className="w-5 h-5 mr-2 text-green-600" />
                      Activities by Category
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <LineChart className="w-5 h-5 mr-2 text-purple-600" />
                      Activity Trends (Last 24 Hours)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={hourlyActivityData}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis dataKey="hour" />
                          <YAxis />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="count"
                            stroke="#8B5CF6"
                            fill="#8B5CF6"
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* User Engagement View */}
          {viewMode === 'users' && (
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  User Engagement ({metrics.userEngagement.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.userEngagement.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {user.user.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.user}</p>
                          <p className="text-sm text-gray-500">Last activity: {user.lastActivity}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{user.activities} activities</p>
                          <p className="text-xs text-gray-500">Today</p>
                        </div>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${Math.min((user.activities / 50) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Activity Timeline View */}
          {viewMode === 'timeline' && (
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-red-600" />
                  Activity Timeline ({filteredActivities.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }, (_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {filteredActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                        onClick={() => handleViewActivity(activity)}
                      >
                        <div className="flex-shrink-0">
                          <div className={`p-2 rounded-lg ${
                            activity.status === 'success' ? 'bg-green-100' :
                            activity.status === 'warning' ? 'bg-yellow-100' :
                            activity.status === 'error' ? 'bg-red-100' :
                            'bg-blue-100'
                          }`}>
                            {getStatusIcon(activity.status)}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">{activity.action}</span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(activity.category)}`}>
                              <div className="flex items-center space-x-1">
                                {getCategoryIcon(activity.category)}
                                <span>{activity.category}</span>
                              </div>
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                              {activity.status}
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 mb-2">{activity.details}</p>

                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center space-x-4">
                              {activity.userName && (
                                <span>👤 {activity.userName}</span>
                              )}
                              <span>🌐 {activity.ipAddress}</span>
                              <span>📱 {activity.userAgent.split(' ')[0]}</span>
                            </div>
                            <span>{new Date(activity.timestamp).toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex-shrink-0">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Activity Details Modal */}
          <Modal
            isOpen={showActivityDetails}
            onClose={() => {
              setShowActivityDetails(false)
              setSelectedActivity(null)
            }}
            title="Activity Details"
            size="lg"
          >
            {selectedActivity && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      selectedActivity.status === 'success' ? 'bg-green-100' :
                      selectedActivity.status === 'warning' ? 'bg-yellow-100' :
                      selectedActivity.status === 'error' ? 'bg-red-100' :
                      'bg-blue-100'
                    }`}>
                      {getStatusIcon(selectedActivity.status)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{selectedActivity.action}</h3>
                      <p className="text-sm text-gray-600">{selectedActivity.resource} • {selectedActivity.category}</p>
                      <div className="flex items-center space-x-3 mt-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedActivity.status)}`}>
                          {selectedActivity.status}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(selectedActivity.category)}`}>
                          {selectedActivity.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {selectedActivity.userName || 'System'}
                    </div>
                    <p className="text-sm text-blue-700">User</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {selectedActivity.resource}
                    </div>
                    <p className="text-sm text-green-700">Resource</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                      {selectedActivity.ipAddress}
                    </div>
                    <p className="text-sm text-purple-700">IP Address</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-2">
                      {new Date(selectedActivity.timestamp).toLocaleTimeString()}
                    </div>
                    <p className="text-sm text-orange-700">Timestamp</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Activity Details</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                    {selectedActivity.details}
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Technical Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">User Agent</p>
                      <p className="font-medium text-sm">{selectedActivity.userAgent}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Activity ID</p>
                      <code className="text-sm font-mono">{selectedActivity.id}</code>
                    </div>
                  </div>
                </div>

                {selectedActivity.metadata && Object.keys(selectedActivity.metadata).length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Additional Metadata</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="text-sm text-gray-700">
                        {JSON.stringify(selectedActivity.metadata, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Modal>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
