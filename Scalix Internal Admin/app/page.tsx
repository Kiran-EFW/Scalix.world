'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AdminLayout from '@/components/layout/AdminLayout'
import {
  Users,
  Crown,
  BarChart3,
  Settings,
  TrendingUp,
  Activity,
  Shield,
  CheckCircle
} from 'lucide-react'

export default function AdminDashboard() {
  const stats = {
    totalUsers: 1247,
    activeUsers: 342,
    totalRevenue: 45230,
    systemUptime: 99.8
  }

  const recentActivities = [
    {
      id: 1,
      message: 'New user registered: john.doe@example.com',
      timestamp: '2 minutes ago',
      icon: Users,
      isNew: true
    },
    {
      id: 2,
      message: 'Tier limit updated for Pro Plan',
      timestamp: '5 minutes ago',
      icon: Crown,
      isNew: false
    },
    {
      id: 3,
      message: 'System backup completed successfully',
      timestamp: '2 hours ago',
      icon: Shield,
      isNew: false
    }
  ]

  const systemHealth = [
    { name: 'Backend API', status: 'operational', uptime: '99.9%', color: 'green' },
    { name: 'Database', status: 'operational', uptime: '99.7%', color: 'green' },
    { name: 'Data Sync', status: 'operational', uptime: '99.8%', color: 'green' },
    { name: 'Tier Management', status: 'operational', uptime: '99.9%', color: 'green' }
  ]

  return (
    <AdminLayout>
      <div className="space-y-8">
          {/* Welcome Section */}
          <Card modern className="p-8 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 border-blue-200/30 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
                  Welcome to Scalix Admin
                </h1>
                <p className="text-lg text-foreground/90 max-w-2xl mb-4 font-medium">
                  Manage your Scalix infrastructure, monitor system performance, and configure settings
                  from this centralized administrative dashboard.
                </p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>Last updated: {new Date().toLocaleTimeString()}</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Live data</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="relative">
                  <Shield className="w-20 h-20 text-primary/30" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card modern className="group hover:scale-[1.02] transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 border-blue-200 dark:border-blue-800 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Users</CardTitle>
                <div className="p-2 bg-blue-200 dark:bg-blue-800 rounded-lg group-hover:bg-blue-300 dark:group-hover:bg-blue-700 transition-colors duration-300">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2 animate-slide-up">
                  {stats.totalUsers.toLocaleString()}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12.5% from last month
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </CardContent>
            </Card>

            <Card modern className="group hover:scale-[1.02] transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30 border-green-200 dark:border-green-800 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">Active Sessions</CardTitle>
                <div className="p-2 bg-green-200 dark:bg-green-800 rounded-lg group-hover:bg-green-300 dark:group-hover:bg-green-700 transition-colors duration-300">
                  <Activity className="h-4 w-4 text-green-600 dark:text-green-300" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2 animate-slide-up" style={{ animationDelay: '100ms' }}>
                  {stats.activeUsers}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +8.2% currently online
                  </div>
                  <div className="flex -space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card modern className="group hover:scale-[1.02] transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30 border-purple-200 dark:border-purple-800 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-200">Total Revenue</CardTitle>
                <div className="p-2 bg-purple-200 dark:bg-purple-800 rounded-lg group-hover:bg-purple-300 dark:group-hover:bg-purple-700 transition-colors duration-300">
                  <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-2 animate-slide-up" style={{ animationDelay: '200ms' }}>
                  ${stats.totalRevenue.toLocaleString()}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +23.1% this month
                  </div>
                  <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">+${Math.floor(Math.random() * 1000)}</div>
                </div>
              </CardContent>
            </Card>

            <Card modern className="group hover:scale-[1.02] transition-all duration-300 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/30 border-orange-200 dark:border-orange-800 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-800 dark:text-orange-200">System Uptime</CardTitle>
                <div className="p-2 bg-orange-200 dark:bg-orange-800 rounded-lg group-hover:bg-orange-300 dark:group-hover:bg-orange-700 transition-colors duration-300">
                  <Shield className="h-4 w-4 text-orange-600 dark:text-orange-300" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-900 dark:text-orange-100 mb-2 animate-slide-up" style={{ animationDelay: '300ms' }}>
                  {stats.systemUptime.toFixed(1)}%
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Target: 99.9%
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    stats.systemUptime >= 99.9 ? 'bg-green-400' : 'bg-yellow-400'
                  } animate-pulse`}></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Cards */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              Admin Sections
              <div className="ml-2 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card modern className="group hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden">
                <CardContent className="p-6">
                  <Link href="/metrics" className="block">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                      <BarChart3 className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      System Metrics
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      View detailed performance analytics and usage statistics
                    </p>
                    <div className="text-sm font-medium text-primary group-hover:text-primary/80 transition-colors flex items-center">
                      View Metrics →
                    </div>
                  </Link>
                </CardContent>
              </Card>

              <Card modern className="group hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden">
                <CardContent className="p-6">
                  <Link href="/activity" className="block">
                    <div className="w-12 h-12 bg-green-50 dark:bg-green-950/50 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-green-100 dark:group-hover:bg-green-900/50 group-hover:scale-110">
                      <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      Activity Monitor
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Monitor real-time system activity and events
                    </p>
                    <div className="text-sm font-medium text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors flex items-center">
                      View Activity →
                    </div>
                  </Link>
                </CardContent>
              </Card>

              <Card modern className="group hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden">
                <CardContent className="p-6">
                  <Link href="/system-health" className="block">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/50 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 group-hover:scale-110">
                      <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      System Health
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Check service status and infrastructure metrics
                    </p>
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors flex items-center">
                      View Health →
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card modern>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-primary" />
                  Recent Activity Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.slice(0, 3).map((activity) => (
                    <div
                      key={activity.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                        activity.isNew ? 'bg-primary/5 border border-primary/20' : 'hover:bg-muted/50'
                      }`}
                    >
                      <activity.icon className={`w-4 h-4 ${
                        activity.isNew ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {activity.message}
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                      </div>
                      {activity.isNew && (
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <Link href="/activity" className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
                    View all activity →
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card modern>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-primary" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemHealth.slice(0, 3).map((system, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          system.color === 'green' ? 'bg-green-400' :
                          system.color === 'yellow' ? 'bg-yellow-400' : 'bg-red-400'
                        } animate-pulse`} />
                        <div>
                          <p className="font-medium text-foreground">{system.name}</p>
                          <p className="text-xs text-muted-foreground">{system.uptime} uptime</p>
                        </div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        system.status === 'operational' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200' : 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200'
                      }`}>
                        {system.status}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <Link href="/system-health" className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
                    View system health →
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
      </div>
    </AdminLayout>
  )
}
