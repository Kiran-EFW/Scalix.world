'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  Users,
  Activity,
  DollarSign,
  Clock,
  Download,
  RefreshCw,
  Calendar,
  Filter
} from 'lucide-react'

interface GlobalMetrics {
  totalUsers: number
  totalProjects: number
  totalRevenue: number
  totalApiCalls: number
  systemUptime: string
  avgResponseTime: number
}

interface UserAnalytics {
  date: string
  newUsers: number
  activeUsers: number
  churnedUsers: number
}

const mockGlobalMetrics: GlobalMetrics = {
  totalUsers: 15420,
  totalProjects: 8920,
  totalRevenue: 124508.90,
  totalApiCalls: 2847390,
  systemUptime: '99.9%',
  avgResponseTime: 1.2
}

const mockUserAnalytics: UserAnalytics[] = [
  { date: '2025-09-12', newUsers: 234, activeUsers: 1247, churnedUsers: 12 },
  { date: '2025-09-11', newUsers: 198, activeUsers: 1189, churnedUsers: 8 },
  { date: '2025-09-10', newUsers: 267, activeUsers: 1156, churnedUsers: 15 },
  { date: '2025-09-09', newUsers: 189, activeUsers: 1123, churnedUsers: 6 },
  { date: '2025-09-08', newUsers: 245, activeUsers: 1089, churnedUsers: 11 }
]

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d')
  const [metricType, setMetricType] = useState('users')

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Analytics</h1>
          <p className="text-gray-600 mt-2">Comprehensive analytics across all users and projects</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </motion.div>

      {/* Global Metrics Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{mockGlobalMetrics.totalUsers.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">+12% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">{mockGlobalMetrics.totalProjects.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">+8% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${mockGlobalMetrics.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">+15% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">API Calls</p>
              <p className="text-2xl font-bold text-gray-900">{mockGlobalMetrics.totalApiCalls.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">+22% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-cyan-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">System Uptime</p>
              <p className="text-2xl font-bold text-gray-900">{mockGlobalMetrics.systemUptime}</p>
              <p className="text-xs text-green-600 mt-1">Excellent performance</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-pink-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">{mockGlobalMetrics.avgResponseTime}s</p>
              <p className="text-xs text-green-600 mt-1">-5% improvement</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters and Controls */}
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
                value={metricType}
                onChange={(e) => setMetricType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="users">User Analytics</option>
                <option value="revenue">Revenue Analytics</option>
                <option value="performance">Performance Metrics</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline">View Detailed Charts</Button>
            <Button variant="outline">Generate Report</Button>
          </div>
        </div>
      </motion.div>

      {/* User Analytics Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">User Growth Analytics</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  New Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Churned Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Growth Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockUserAnalytics.map((data, index) => {
                const growthRate = ((data.newUsers - data.churnedUsers) / data.activeUsers * 100).toFixed(1)

                return (
                  <motion.tr
                    key={data.date}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(data.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="text-green-600 font-semibold">+{data.newUsers}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {data.activeUsers.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="text-red-600">-{data.churnedUsers}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`font-semibold ${
                        parseFloat(growthRate) > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {parseFloat(growthRate) > 0 ? '+' : ''}{growthRate}%
                      </span>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Revenue Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Breakdown</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">💎</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">$89,234</div>
            <div className="text-sm text-gray-600">Enterprise Plan</div>
            <div className="text-xs text-green-600 mt-1">45% of total revenue</div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🚀</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">$23,456</div>
            <div className="text-sm text-gray-600">Pro Plan</div>
            <div className="text-xs text-blue-600 mt-1">19% of total revenue</div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🎯</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">$11,819</div>
            <div className="text-sm text-gray-600">Free Tier</div>
            <div className="text-xs text-purple-600 mt-1">9.5% of total revenue</div>
          </div>
        </div>
      </motion.div>

      {/* System Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">API Performance</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Response Time</span>
              <span className="font-semibold">1.2s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">95th Percentile</span>
              <span className="font-semibold">2.8s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">99th Percentile</span>
              <span className="font-semibold">4.2s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Error Rate</span>
              <span className="font-semibold text-green-600">0.01%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Infrastructure Health</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">System Uptime</span>
              <span className="font-semibold text-green-600">99.9%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Servers</span>
              <span className="font-semibold">12/12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Database Health</span>
              <span className="font-semibold text-green-600">Optimal</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cache Hit Rate</span>
              <span className="font-semibold">94.2%</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
