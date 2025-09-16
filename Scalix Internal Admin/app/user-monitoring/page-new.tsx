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
  Eye,
  Users,
  Activity,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  Shield,
  Clock,
  MapPin,
  MousePointer,
  Smartphone,
  Monitor,
  Globe,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  Bell,
  Settings,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Crown,
  Zap,
  Briefcase,
  AlertOctagon,
  Timer,
  Calendar,
  Mail,
  Phone,
  Hash,
  FileText,
  Flag,
  ThumbsUp,
  ThumbsDown,
  Star,
  Heart,
  MessageSquare,
  Send,
  Reply,
  Forward,
  Archive,
  Tag,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { LineChart as RechartsLineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function UserMonitoring() {
  const { success, error, info } = useToast()

  // Mock data for demonstration
  const [userActivities, setUserActivities] = useState([
    {
      id: 'act_001',
      userId: 'usr_001',
      userName: 'John Smith',
      userEmail: 'john.smith@example.com',
      action: 'login',
      description: 'User logged into dashboard',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      location: 'New York, US',
      timestamp: '2024-01-12T10:30:00Z',
      sessionId: 'ses_001',
      pageUrl: '/dashboard',
      riskLevel: 'low'
    }
  ])

  const [viewMode, setViewMode] = useState<'overview' | 'activities' | 'sessions' | 'security'>('overview')

  return (
    <ProtectedRoute requiredPermissions={['view_user_monitoring']}>
      <AdminLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">User Behavior Monitoring</h1>
              <p className="text-gray-600 mt-2">Real-time monitoring of user activities, engagement patterns, and security metrics</p>
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-600">
                    1,247 active users • 3 security alerts
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Active Users</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">1,247</p>
                    <div className="flex items-center text-xs text-green-600">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +8.5% from yesterday
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors duration-300">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Avg Session</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">32m</p>
                    <div className="flex items-center text-xs text-green-600">
                      <Clock className="w-3 h-3 mr-1" />
                      +12.3% from last week
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors duration-300">
                    <Timer className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Conversion Rate</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">3.2%</p>
                    <div className="flex items-center text-xs text-green-600">
                      <Target className="w-3 h-3 mr-1" />
                      +15.8% from last month
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors duration-300">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Security Alerts</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">3</p>
                    <div className="flex items-center text-xs text-red-600">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Requires attention
                    </div>
                  </div>
                  <div className="p-3 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors duration-300">
                    <Shield className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* View Mode Tabs */}
          <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setViewMode('overview')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                viewMode === 'overview' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Target className="w-4 h-4 inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => setViewMode('activities')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                viewMode === 'activities' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Activity className="w-4 h-4 inline mr-2" />
              Activities
            </button>
            <button
              onClick={() => setViewMode('sessions')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                viewMode === 'sessions' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Sessions
            </button>
            <button
              onClick={() => setViewMode('security')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                viewMode === 'security' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Shield className="w-4 h-4 inline mr-2" />
              Security
            </button>
          </div>

          {/* Content based on view mode */}
          {viewMode === 'overview' && (
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle>User Monitoring Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Comprehensive user monitoring dashboard with real-time analytics, activity tracking, and security monitoring.
                </div>
              </CardContent>
            </Card>
          )}

          {viewMode === 'activities' && (
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle>User Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
                          <Activity className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{activity.userName}</h3>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                          <p className="text-xs text-gray-500">{activity.location} • {new Date(activity.timestamp).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          activity.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                          activity.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          activity.riskLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {activity.riskLevel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {viewMode === 'sessions' && (
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Real-time user session tracking and management interface.
                </div>
              </CardContent>
            </Card>
          )}

          {viewMode === 'security' && (
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle>Security Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Security alerts, threat detection, and incident response dashboard.
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
