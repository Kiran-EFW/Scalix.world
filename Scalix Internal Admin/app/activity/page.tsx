'use client'

import React, { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import AdminLayout from '@/components/layout/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Activity,
  Users,
  Crown,
  Settings,
  Database,
  Zap,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  Search,
  RefreshCw,
  Download,
  Eye,
  MoreHorizontal
} from 'lucide-react'

export default function ActivityPage() {
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: 'user',
      message: 'New user registered: john.doe@example.com',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      icon: Users,
      isNew: true,
      severity: 'info' as const,
      category: 'authentication'
    },
    {
      id: 2,
      type: 'system',
      message: 'Tier limit updated for Pro Plan',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      icon: Crown,
      isNew: false,
      severity: 'info' as const,
      category: 'configuration'
    },
    {
      id: 3,
      type: 'admin',
      message: 'Bulk user update completed (150 users)',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      icon: Settings,
      isNew: false,
      severity: 'success' as const,
      category: 'management'
    },
    {
      id: 4,
      type: 'system',
      message: 'Database backup completed successfully',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      icon: Database,
      isNew: false,
      severity: 'success' as const,
      category: 'system'
    },
    {
      id: 5,
      type: 'system',
      message: 'API rate limit exceeded for user: premium@example.com',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      icon: Zap,
      isNew: false,
      severity: 'warning' as const,
      category: 'api'
    },
    {
      id: 6,
      type: 'security',
      message: 'Failed login attempt detected from IP: 192.168.1.100',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      icon: Shield,
      isNew: false,
      severity: 'warning' as const,
      category: 'security'
    }
  ])

  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Simulate new activities
  useEffect(() => {
    const activityTypes = [
      { type: 'user', message: 'New user registered', icon: Users, severity: 'info' as const, category: 'authentication' },
      { type: 'system', message: 'API rate limit updated', icon: Zap, severity: 'info' as const, category: 'api' },
      { type: 'admin', message: 'User tier changed', icon: Crown, severity: 'info' as const, category: 'management' },
      { type: 'system', message: 'Backup completed', icon: Database, severity: 'success' as const, category: 'system' },
      { type: 'security', message: 'Security scan completed', icon: Shield, severity: 'success' as const, category: 'security' }
    ]

    const addActivity = () => {
      const randomActivity = activityTypes[Math.floor(Math.random() * activityTypes.length)]
      const newActivity = {
        id: Date.now(),
        type: randomActivity.type,
        message: `${randomActivity.message}: ${Math.random().toString(36).substring(7)}`,
        timestamp: new Date(),
        icon: randomActivity.icon,
        isNew: true,
        severity: randomActivity.severity,
        category: randomActivity.category
      }

      setActivities(prev => [newActivity, ...prev.slice(0, 49)]) // Keep last 50 activities

      // Mark as not new after 5 seconds
      setTimeout(() => {
        setActivities(prev =>
          prev.map(activity =>
            activity.id === newActivity.id ? { ...activity, isNew: false } : activity
          )
        )
      }, 5000)
    }

    const interval = setInterval(addActivity, 45000) // New activity every 45 seconds
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const handleExport = () => {
    console.log('Exporting activity log...')
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200'
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'error': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'authentication': return 'bg-purple-100 text-purple-800'
      case 'configuration': return 'bg-blue-100 text-blue-800'
      case 'management': return 'bg-green-100 text-green-800'
      case 'system': return 'bg-gray-100 text-gray-800'
      case 'api': return 'bg-orange-100 text-orange-800'
      case 'security': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredActivities = activities.filter(activity => {
    const matchesFilter = filter === 'all' || activity.type === filter || activity.severity === filter
    const matchesSearch = activity.message.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const activityStats = {
    total: activities.length,
    new: activities.filter(a => a.isNew).length,
    errors: activities.filter(a => a.severity === 'error').length,
    warnings: activities.filter(a => a.severity === 'warning').length
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-8 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center">
                <Activity className="w-8 h-8 mr-3 text-primary" />
                Activity Monitor
              </h1>
              <p className="text-muted-foreground mt-2">
                Real-time system activity and event tracking
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Activity Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card modern>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Events</p>
                    <p className="text-2xl font-bold text-foreground">{activityStats.total}</p>
                  </div>
                  <Activity className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card modern>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">New Events</p>
                    <p className="text-2xl font-bold text-foreground">{activityStats.new}</p>
                  </div>
                  <div className="relative">
                    <Clock className="w-8 h-8 text-green-600" />
                    {activityStats.new > 0 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card modern>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Warnings</p>
                    <p className="text-2xl font-bold text-foreground">{activityStats.warnings}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            <Card modern>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Errors</p>
                    <p className="text-2xl font-bold text-foreground">{activityStats.errors}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card modern>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search activities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  {['all', 'user', 'system', 'admin', 'security'].map((filterType) => (
                    <Button
                      key={filterType}
                      variant={filter === filterType ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter(filterType)}
                      className="capitalize"
                    >
                      {filterType}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity List */}
          <Card modern>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="relative">
                  <Activity className="w-5 h-5 mr-2 text-primary" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                </div>
                Recent Activity
                <Badge variant="secondary" className="ml-2">
                  {filteredActivities.length} events
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredActivities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className={`flex items-start space-x-4 p-4 rounded-lg transition-all duration-300 ${
                      activity.isNew
                        ? 'bg-primary/5 border border-primary/20 shadow-sm animate-slide-up'
                        : 'hover:bg-muted/50'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex-shrink-0 relative">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activity.isNew ? 'bg-primary/10' : 'bg-muted'
                      }`}>
                        <activity.icon className={`w-5 h-5 ${
                          activity.isNew ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                      </div>
                      {activity.isNew && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            activity.isNew ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {activity.message}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {activity.timestamp.toLocaleString()}
                            </span>
                            <Badge variant="outline" className={getCategoryColor(activity.category)}>
                              {activity.category}
                            </Badge>
                            <Badge variant="outline" className={getSeverityColor(activity.severity)}>
                              {activity.severity}
                            </Badge>
                            {activity.isNew && (
                              <Badge variant="default" className="bg-primary text-primary-foreground">
                                New
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredActivities.length === 0 && (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No activities found matching your criteria</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
