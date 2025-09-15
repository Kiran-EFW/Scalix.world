'use client'

import React, { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import AdminLayout from '@/components/layout/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Shield,
  Database,
  Zap,
  Server,
  Activity,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Download,
  Settings,
  Monitor,
  HardDrive,
  Cpu,
  MemoryStick,
  Wifi,
  Globe
} from 'lucide-react'

export default function SystemHealthPage() {
  const [systemHealth, setSystemHealth] = useState({
    overall: 'operational' as const,
    lastCheck: new Date(),
    uptime: '99.8%'
  })

  const [services, setServices] = useState([
    { 
      name: 'Backend API', 
      status: 'operational' as const, 
      uptime: '99.9%', 
      responseTime: 45,
      lastIncident: null,
      icon: Server,
      color: 'green'
    },
    { 
      name: 'Database', 
      status: 'operational' as const, 
      uptime: '99.7%', 
      responseTime: 12,
      lastIncident: null,
      icon: Database,
      color: 'green'
    },
    { 
      name: 'Data Sync', 
      status: 'operational' as const, 
      uptime: '99.8%', 
      responseTime: 89,
      lastIncident: null,
      icon: Activity,
      color: 'green'
    },
    { 
      name: 'Tier Management', 
      status: 'operational' as const, 
      uptime: '99.9%', 
      responseTime: 23,
      lastIncident: null,
      icon: Settings,
      color: 'green'
    },
    { 
      name: 'Authentication', 
      status: 'degraded' as const, 
      uptime: '98.2%', 
      responseTime: 156,
      lastIncident: '2 hours ago',
      icon: Shield,
      color: 'yellow'
    },
    { 
      name: 'File Storage', 
      status: 'operational' as const, 
      uptime: '99.5%', 
      responseTime: 67,
      lastIncident: null,
      icon: HardDrive,
      color: 'green'
    }
  ])

  const [infrastructure, setInfrastructure] = useState({
    cpu: { usage: 45, cores: 8, temperature: 65 },
    memory: { usage: 68, total: 32, available: 10.2 },
    disk: { usage: 42, total: 1000, available: 580 },
    network: { latency: 12, throughput: 850, packets: 1250000 }
  })

  const [isLoading, setIsLoading] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    const updateMetrics = () => {
      setInfrastructure(prev => ({
        cpu: {
          ...prev.cpu,
          usage: Math.max(20, Math.min(80, prev.cpu.usage + (Math.random() * 10 - 5))),
          temperature: Math.max(50, Math.min(85, prev.cpu.temperature + (Math.random() * 4 - 2)))
        },
        memory: {
          ...prev.memory,
          usage: Math.max(50, Math.min(85, prev.memory.usage + (Math.random() * 6 - 3))),
          available: Math.max(8, Math.min(15, prev.memory.available + (Math.random() * 2 - 1)))
        },
        disk: {
          ...prev.disk,
          usage: Math.max(35, Math.min(55, prev.disk.usage + (Math.random() * 2 - 1))),
          available: Math.max(500, Math.min(700, prev.disk.available + (Math.random() * 20 - 10)))
        },
        network: {
          ...prev.network,
          latency: Math.max(8, Math.min(25, prev.network.latency + (Math.random() * 4 - 2))),
          throughput: Math.max(700, Math.min(1000, prev.network.throughput + (Math.random() * 100 - 50))),
          packets: prev.network.packets + Math.floor(Math.random() * 10000)
        }
      }))

      setSystemHealth(prev => ({
        ...prev,
        lastCheck: new Date()
      }))
    }

    const interval = setInterval(updateMetrics, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSystemHealth(prev => ({ ...prev, lastCheck: new Date() }))
    setIsLoading(false)
  }

  const handleExport = () => {
    console.log('Exporting system health report...')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-600 bg-green-100 border-green-200'
      case 'degraded': return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'outage': return 'text-red-600 bg-red-100 border-red-200'
      default: return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return CheckCircle
      case 'degraded': return AlertCircle
      case 'outage': return XCircle
      default: return AlertCircle
    }
  }

  const getUsageColor = (usage: number) => {
    if (usage < 50) return 'text-green-600'
    if (usage < 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-8 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center">
                <Shield className="w-8 h-8 mr-3 text-primary" />
                System Health
              </h1>
              <p className="text-muted-foreground mt-2">
                Monitor system performance and service availability
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
                Export Report
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

          {/* Overall Status */}
          <Card modern className="border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Shield className="w-12 h-12 text-primary" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">System Operational</h2>
                    <p className="text-muted-foreground">
                      All critical systems are running normally
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <span>Overall Uptime: {systemHealth.uptime}</span>
                      <span>Last Check: {systemHealth.lastCheck.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">99.8%</div>
                  <p className="text-sm text-muted-foreground">Uptime</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Status */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Monitor className="w-5 h-5 mr-2 text-primary" />
              Service Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service, index) => {
                const StatusIcon = getStatusIcon(service.status)
                return (
                  <Card
                    key={service.name}
                    modern
                    className="group hover:scale-[1.02] transition-all duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            service.color === 'green' ? 'bg-green-50' :
                            service.color === 'yellow' ? 'bg-yellow-50' : 'bg-red-50'
                          }`}>
                            <service.icon className={`w-5 h-5 ${
                              service.color === 'green' ? 'text-green-600' :
                              service.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'
                            }`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{service.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Response: {service.responseTime}ms
                            </p>
                          </div>
                        </div>
                        <StatusIcon className={`w-5 h-5 ${
                          service.status === 'operational' ? 'text-green-600' :
                          service.status === 'degraded' ? 'text-yellow-600' : 'text-red-600'
                        }`} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(service.status)}>
                          {service.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {service.uptime} uptime
                        </span>
                      </div>
                      {service.lastIncident && (
                        <div className="mt-2 text-xs text-yellow-600">
                          Last incident: {service.lastIncident}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Infrastructure Metrics */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Cpu className="w-5 h-5 mr-2 text-primary" />
              Infrastructure Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card modern>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Cpu className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-foreground">CPU</span>
                    </div>
                    <span className={`text-sm font-medium ${getUsageColor(infrastructure.cpu.usage)}`}>
                      {infrastructure.cpu.usage}%
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{infrastructure.cpu.cores} cores</span>
                      <span>{infrastructure.cpu.temperature}°C</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          infrastructure.cpu.usage < 50 ? 'bg-green-500' :
                          infrastructure.cpu.usage < 75 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${infrastructure.cpu.usage}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card modern>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <MemoryStick className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-foreground">Memory</span>
                    </div>
                    <span className={`text-sm font-medium ${getUsageColor(infrastructure.memory.usage)}`}>
                      {infrastructure.memory.usage}%
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{infrastructure.memory.available}GB available</span>
                      <span>{infrastructure.memory.total}GB total</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          infrastructure.memory.usage < 50 ? 'bg-green-500' :
                          infrastructure.memory.usage < 75 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${infrastructure.memory.usage}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card modern>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <HardDrive className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-foreground">Storage</span>
                    </div>
                    <span className={`text-sm font-medium ${getUsageColor(infrastructure.disk.usage)}`}>
                      {infrastructure.disk.usage}%
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{infrastructure.disk.available}GB available</span>
                      <span>{infrastructure.disk.total}GB total</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          infrastructure.disk.usage < 50 ? 'bg-green-500' :
                          infrastructure.disk.usage < 75 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${infrastructure.disk.usage}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card modern>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Wifi className="w-5 h-5 text-orange-600" />
                      <span className="font-medium text-foreground">Network</span>
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      {infrastructure.network.latency}ms
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{infrastructure.network.throughput} Mbps</span>
                      <span>{infrastructure.network.packets.toLocaleString()} packets</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-green-500 transition-all duration-300"
                        style={{ width: `${Math.min(100, (infrastructure.network.throughput / 10))}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Incidents */}
          <Card modern>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-primary" />
                Recent Incidents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">Authentication Service Degraded</h4>
                    <p className="text-sm text-muted-foreground">
                      Increased response times detected. Investigation in progress.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    Investigating
                  </Badge>
                </div>
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <p>No other recent incidents</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
