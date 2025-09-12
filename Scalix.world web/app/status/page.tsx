'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Activity,
  Server,
  Globe,
  Zap,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  Shield,
  Database
} from 'lucide-react'

const services = [
  {
    name: 'Scalix API',
    url: 'https://api.scalix.world',
    status: 'operational',
    uptime: '99.9%',
    responseTime: '120ms',
    lastIncident: null
  },
  {
    name: 'LiteLLM Proxy',
    url: 'https://llm-gateway.scalix.world',
    status: 'operational',
    uptime: '99.8%',
    responseTime: '85ms',
    lastIncident: '2024-09-08 14:30 UTC'
  },
  {
    name: 'Scalix Engine',
    url: 'https://engine.scalix.world',
    status: 'operational',
    uptime: '99.9%',
    responseTime: '145ms',
    lastIncident: null
  },
  {
    name: 'Scalix Gateway',
    url: 'https://gateway.scalix.world',
    status: 'operational',
    uptime: '99.7%',
    responseTime: '95ms',
    lastIncident: '2024-09-10 09:15 UTC'
  },
  {
    name: 'Dashboard API',
    url: 'https://dashboard.scalix.world/api',
    status: 'operational',
    uptime: '99.9%',
    responseTime: '78ms',
    lastIncident: null
  },
  {
    name: 'Community Forums',
    url: 'https://community.scalix.world',
    status: 'operational',
    uptime: '99.5%',
    responseTime: '234ms',
    lastIncident: '2024-09-09 16:45 UTC'
  }
]

const performanceMetrics = [
  {
    name: 'API Response Time',
    current: '95ms',
    change: -5,
    trend: 'down',
    status: 'good'
  },
  {
    name: 'Error Rate',
    current: '0.1%',
    change: -0.05,
    trend: 'down',
    status: 'good'
  },
  {
    name: 'Active Connections',
    current: '1,247',
    change: 12,
    trend: 'up',
    status: 'good'
  },
  {
    name: 'Requests/min',
    current: '2,840',
    change: 8.5,
    trend: 'up',
    status: 'good'
  }
]

const recentIncidents = [
  {
    id: 'INC-2024-001',
    title: 'Brief API slowdown in US-West region',
    status: 'resolved',
    severity: 'minor',
    started: '2024-09-10 09:15 UTC',
    resolved: '2024-09-10 09:32 UTC',
    duration: '17 minutes',
    description: 'A temporary network issue caused slightly elevated response times for requests routed through the US-West region. All services have been restored to normal performance.',
    affectedServices: ['Scalix Gateway']
  },
  {
    id: 'INC-2024-002',
    title: 'Community forum maintenance',
    status: 'resolved',
    severity: 'minor',
    started: '2024-09-09 16:45 UTC',
    resolved: '2024-09-09 17:15 UTC',
    duration: '30 minutes',
    description: 'Scheduled maintenance to update forum software and improve performance. Some users experienced temporary access issues.',
    affectedServices: ['Community Forums']
  },
  {
    id: 'INC-2024-003',
    title: 'LiteLLM proxy optimization',
    status: 'resolved',
    severity: 'minor',
    started: '2024-09-08 14:30 UTC',
    resolved: '2024-09-08 15:05 UTC',
    duration: '35 minutes',
    description: 'Performance optimization deployment caused brief response time increases. No data was lost and all requests were successfully processed.',
    affectedServices: ['LiteLLM Proxy']
  }
]

const uptimeData = [
  { date: 'Sep 11', uptime: 99.9 },
  { date: 'Sep 10', uptime: 99.8 },
  { date: 'Sep 9', uptime: 99.7 },
  { date: 'Sep 8', uptime: 99.9 },
  { date: 'Sep 7', uptime: 99.9 },
  { date: 'Sep 6', uptime: 99.8 },
  { date: 'Sep 5', uptime: 99.9 }
]

export default function StatusPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLastUpdated(new Date())
    setIsRefreshing(false)
  }

  useEffect(() => {
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      setLastUpdated(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-600'
      case 'degraded': return 'text-yellow-600'
      case 'outage': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="w-5 h-5" />
      case 'degraded': return <AlertTriangle className="w-5 h-5" />
      case 'outage': return <XCircle className="w-5 h-5" />
      default: return <Clock className="w-5 h-5" />
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Header */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">System Status</h1>
              <p className="text-gray-300">Live status of all Scalix services and infrastructure</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-gray-700 hover:bg-gray-600"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Overall Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8"
        >
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-4" />
            <div>
              <h2 className="text-xl font-bold text-green-800">All Systems Operational</h2>
              <p className="text-green-700 mt-1">
                Scalix is running smoothly with 99.8% uptime across all services.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Service Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-8"
        >
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Service Status</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {services.map((service, index) => (
              <div key={service.name} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={getStatusColor(service.status)}>
                      {getStatusIcon(service.status)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">{service.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          service.status === 'operational' ? 'bg-green-100 text-green-800' :
                          service.status === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {service.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {service.url} • {service.uptime} uptime • {service.responseTime} avg response
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      {service.lastIncident ? `Last incident: ${service.lastIncident}` : 'No recent incidents'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {performanceMetrics.map((metric, index) => (
            <div key={metric.name} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">{metric.name}</h3>
                <div className={`flex items-center ${
                  metric.trend === 'up' ? 'text-green-600' :
                  metric.trend === 'down' ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {metric.trend === 'up' ? <TrendingUp className="w-4 h-4" /> :
                   metric.trend === 'down' ? <TrendingDown className="w-4 h-4" /> :
                   <Minus className="w-4 h-4" />}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{metric.current}</div>
              <div className={`text-sm ${
                metric.change > 0 ? 'text-green-600' :
                metric.change < 0 ? 'text-blue-600' : 'text-gray-600'
              }`}>
                {metric.change > 0 ? '+' : ''}{metric.change}{typeof metric.change === 'number' && metric.change % 1 !== 0 ? '%' : ''} vs yesterday
              </div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Uptime Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4">7-Day Uptime</h2>
            <div className="space-y-3">
              {uptimeData.map((day) => (
                <div key={day.date} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 w-16">{day.date}</span>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${day.uptime}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{day.uptime}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* System Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4">System Resources</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">CPU Usage</span>
                  <span className="text-sm font-medium text-gray-900">23%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '23%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Memory Usage</span>
                  <span className="text-sm font-medium text-gray-900">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Storage Usage</span>
                  <span className="text-sm font-medium text-gray-900">67%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Network I/O</span>
                  <span className="text-sm font-medium text-gray-900">12%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Recent Incidents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white border border-gray-200 rounded-lg overflow-hidden mt-8"
        >
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Recent Incidents</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentIncidents.map((incident) => (
              <div key={incident.id} className="px-6 py-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      incident.severity === 'minor' ? 'bg-yellow-100 text-yellow-800' :
                      incident.severity === 'major' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {incident.severity}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      incident.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      incident.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {incident.status}
                    </span>
                    <h3 className="font-medium text-gray-900">{incident.title}</h3>
                  </div>
                  <span className="text-sm text-gray-500">{incident.id}</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{incident.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div>
                    <span>Started: {incident.started}</span>
                    <span className="mx-2">•</span>
                    <span>Resolved: {incident.resolved}</span>
                    <span className="mx-2">•</span>
                    <span>Duration: {incident.duration}</span>
                  </div>
                  <div>
                    Affected: {incident.affectedServices.join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Status Page Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="w-6 h-6 text-gray-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Status Page Information</h3>
                <p className="text-sm text-gray-600 mt-1">
                  This status page is updated in real-time and shows the current operational status of all Scalix services.
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Subscribe to Updates
              </Button>
              <Link href="/docs/status-api">
                <Button variant="outline" size="sm">
                  Status API
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

      </div>

      <Footer />
    </div>
  )
}
