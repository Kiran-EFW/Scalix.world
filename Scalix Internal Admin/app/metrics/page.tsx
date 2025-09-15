'use client'

import React, { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import AdminLayout from '@/components/layout/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loading } from '@/components/ui/loading'
import {
  Users,
  TrendingUp,
  TrendingDown,
  Activity,
  Database,
  Zap,
  Shield,
  CheckCircle,
  BarChart3,
  RefreshCw,
  Download,
  Filter
} from 'lucide-react'

export default function MetricsPage() {
  const [stats, setStats] = useState({
    totalUsers: 1247,
    activeUsers: 342,
    totalRevenue: 45230,
    apiRequests: 156000,
    systemUptime: 99.8,
    avgResponseTime: 89,
    errorRate: 0.03
  })

  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Simulate real-time data updates
  useEffect(() => {
    const updateStats = () => {
      setStats(prev => ({
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 3),
        activeUsers: Math.max(320, Math.min(400, prev.activeUsers + Math.floor(Math.random() * 20 - 10))),
        totalRevenue: prev.totalRevenue + Math.floor(Math.random() * 500),
        apiRequests: prev.apiRequests + Math.floor(Math.random() * 2000),
        systemUptime: Math.max(99.5, prev.systemUptime + (Math.random() * 0.1 - 0.05)),
        avgResponseTime: Math.max(70, Math.min(120, prev.avgResponseTime + (Math.random() * 10 - 5))),
        errorRate: Math.max(0.01, Math.min(0.1, prev.errorRate + (Math.random() * 0.02 - 0.01)))
      }))
      setLastUpdated(new Date())
    }

    // Update every 30 seconds
    const interval = setInterval(updateStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLastUpdated(new Date())
    setIsLoading(false)
  }

  const handleExport = () => {
    // Simulate export functionality
    console.log('Exporting metrics data...')
  }

  const metrics = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'from last month'
    },
    {
      title: 'Active Sessions',
      value: stats.activeUsers.toLocaleString(),
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'currently online'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: '+23.1%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'this month'
    },
    {
      title: 'System Uptime',
      value: `${stats.systemUptime.toFixed(1)}%`,
      change: 'Target: 99.9%',
      changeType: 'neutral' as const,
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'overall availability'
    },
    {
      title: 'API Requests',
      value: stats.apiRequests.toLocaleString(),
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'this week'
    },
    {
      title: 'Avg Response Time',
      value: `${stats.avgResponseTime}ms`,
      change: '-5.2%',
      changeType: 'positive' as const,
      icon: Database,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'improvement'
    },
    {
      title: 'Error Rate',
      value: `${stats.errorRate.toFixed(2)}%`,
      change: 'Within target',
      changeType: 'neutral' as const,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'system reliability'
    }
  ]

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-8 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center">
                <BarChart3 className="w-8 h-8 mr-3 text-primary" />
                System Metrics
              </h1>
              <p className="text-muted-foreground mt-2">
                Real-time performance and usage statistics
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

          {/* Last Updated */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live data • Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Auto-refresh: 30s</span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <Card
                key={metric.title}
                modern
                className="group hover:scale-[1.02] transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </CardTitle>
                  <div className={`p-2 ${metric.bgColor} rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                    <metric.icon className={`h-4 w-4 ${metric.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground mb-2">
                    {metric.value}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center text-xs ${
                      metric.changeType === 'positive' ? 'text-green-600' :
                      metric.changeType === 'negative' ? 'text-red-600' : 'text-muted-foreground'
                    }`}>
                      {metric.changeType === 'positive' && <TrendingUp className="w-3 h-3 mr-1" />}
                      {metric.changeType === 'negative' && <TrendingDown className="w-3 h-3 mr-1" />}
                      {metric.change}
                    </div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metric.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Performance Charts Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card modern>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                  User Growth Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Chart visualization would go here</p>
                    <p className="text-sm text-muted-foreground">Integration with charting library needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card modern>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-primary" />
                  API Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                  <div className="text-center">
                    <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Performance chart would go here</p>
                    <p className="text-sm text-muted-foreground">Real-time API metrics visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats Summary */}
          <Card modern>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2 text-primary" />
                System Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {((stats.totalUsers / 1000) * 100).toFixed(1)}%
                  </div>
                  <p className="text-sm text-muted-foreground">User Growth Rate</p>
                  <div className="flex items-center justify-center text-xs text-green-600 mt-2">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12.5% from last month
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {stats.systemUptime.toFixed(1)}%
                  </div>
                  <p className="text-sm text-muted-foreground">System Reliability</p>
                  <div className="flex items-center justify-center text-xs text-green-600 mt-2">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Above target
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {stats.avgResponseTime}ms
                  </div>
                  <p className="text-sm text-muted-foreground">Average Response</p>
                  <div className="flex items-center justify-center text-xs text-green-600 mt-2">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    -5.2% improvement
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
