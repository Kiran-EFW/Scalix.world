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
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  UserCheck,
  Settings,
  FileText,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ArrowUpDown,
  MoreHorizontal,
  Crown,
  Star,
  Briefcase,
  Shield,
  Zap,
  Target
} from 'lucide-react'
import { LineChart as RechartsLineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface EnterpriseCustomer {
  id: string
  companyName: string
  industry: string
  size: 'small' | 'medium' | 'large' | 'enterprise'
  revenue: number
  contractValue: number
  contractStart: string
  contractEnd: string
  status: 'active' | 'trial' | 'expired' | 'suspended'
  tier: 'free' | 'pro' | 'max' | 'enterprise'
  primaryContact: {
    name: string
    email: string
    phone: string
    title: string
  }
  accountManager: string
  lastActivity: string
  usage: {
    apiCalls: number
    users: number
    storage: number
  }
  specialRequirements?: string[]
  riskLevel: 'low' | 'medium' | 'high'
  npsScore?: number
}

interface EnterpriseMetrics {
  totalCustomers: number
  activeContracts: number
  totalRevenue: number
  averageContractValue: number
  churnRate: number
  growthRate: number
  customersBySize: { size: string; count: number; percentage: number }[]
  customersByIndustry: { industry: string; count: number; percentage: number }[]
  revenueByMonth: { month: string; revenue: number }[]
  topCustomers: { customer: string; revenue: number; growth: number }[]
}

export default function EnterpriseManagement() {
  const { success, error, info } = useToast()

  // Enterprise customers data
  const [customers, setCustomers] = useState<EnterpriseCustomer[]>([
    {
      id: 'ent_001',
      companyName: 'TechCorp Inc.',
      industry: 'Technology',
      size: 'large',
      revenue: 450000,
      contractValue: 120000,
      contractStart: '2024-01-15',
      contractEnd: '2025-01-15',
      status: 'active',
      tier: 'enterprise',
      primaryContact: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@techcorp.com',
        phone: '+1-555-0123',
        title: 'CTO'
      },
      accountManager: 'John Smith',
      lastActivity: new Date().toISOString(),
      usage: {
        apiCalls: 2500000,
        users: 450,
        storage: 500
      },
      specialRequirements: ['Custom SLA', 'Dedicated Support', 'White-label Solution'],
      riskLevel: 'low',
      npsScore: 9.2
    },
    {
      id: 'ent_002',
      companyName: 'Global Finance Ltd.',
      industry: 'Financial Services',
      size: 'enterprise',
      revenue: 890000,
      contractValue: 250000,
      contractStart: '2023-11-01',
      contractEnd: '2024-11-01',
      status: 'active',
      tier: 'enterprise',
      primaryContact: {
        name: 'Michael Chen',
        email: 'michael.chen@globalfinance.com',
        phone: '+1-555-0456',
        title: 'VP of Technology'
      },
      accountManager: 'Emily Davis',
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      usage: {
        apiCalls: 1800000,
        users: 320,
        storage: 800
      },
      specialRequirements: ['Compliance Requirements', 'Data Encryption', 'Audit Logs'],
      riskLevel: 'low',
      npsScore: 8.7
    },
    {
      id: 'ent_003',
      companyName: 'Healthcare Solutions',
      industry: 'Healthcare',
      size: 'medium',
      revenue: 280000,
      contractValue: 75000,
      contractStart: '2024-03-01',
      contractEnd: '2025-03-01',
      status: 'trial',
      tier: 'max',
      primaryContact: {
        name: 'Dr. Lisa Wang',
        email: 'lisa.wang@healthcaresolutions.com',
        phone: '+1-555-0789',
        title: 'Chief Medical Officer'
      },
      accountManager: 'Robert Brown',
      lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      usage: {
        apiCalls: 850000,
        users: 180,
        storage: 300
      },
      specialRequirements: ['HIPAA Compliance', 'Data Privacy'],
      riskLevel: 'medium',
      npsScore: 7.8
    },
    {
      id: 'ent_004',
      companyName: 'Manufacturing Plus',
      industry: 'Manufacturing',
      size: 'large',
      revenue: 620000,
      contractValue: 150000,
      contractStart: '2023-09-15',
      contractEnd: '2024-09-15',
      status: 'active',
      tier: 'max',
      primaryContact: {
        name: 'David Wilson',
        email: 'david.wilson@manufacturingplus.com',
        phone: '+1-555-0321',
        title: 'Operations Director'
      },
      accountManager: 'Anna Garcia',
      lastActivity: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      usage: {
        apiCalls: 1200000,
        users: 280,
        storage: 600
      },
      specialRequirements: ['IoT Integration', 'Real-time Monitoring'],
      riskLevel: 'low',
      npsScore: 8.5
    }
  ])

  // UI State
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<EnterpriseCustomer | null>(null)
  const [showCustomerDetails, setShowCustomerDetails] = useState(false)
  const [showAddCustomer, setShowAddCustomer] = useState(false)
  const [viewMode, setViewMode] = useState<'overview' | 'customers' | 'analytics'>('overview')

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [industryFilter, setIndustryFilter] = useState<string>('all')
  const [sizeFilter, setSizeFilter] = useState<string>('all')

  // Computed metrics
  const metrics: EnterpriseMetrics = useMemo(() => {
    const totalCustomers = customers.length
    const activeContracts = customers.filter(c => c.status === 'active').length
    const totalRevenue = customers.reduce((sum, c) => sum + c.revenue, 0)
    const averageContractValue = customers.reduce((sum, c) => sum + c.contractValue, 0) / totalCustomers
    const churnRate = 5.2 // Mock value
    const growthRate = 23.1 // Mock value

    // Customers by size
    const sizeCounts = customers.reduce((acc, customer) => {
      acc[customer.size] = (acc[customer.size] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const customersBySize = Object.entries(sizeCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([size, count]) => ({
        size,
        count,
        percentage: Math.round((count / totalCustomers) * 100)
      }))

    // Customers by industry
    const industryCounts = customers.reduce((acc, customer) => {
      acc[customer.industry] = (acc[customer.industry] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const customersByIndustry = Object.entries(industryCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([industry, count]) => ({
        industry,
        count,
        percentage: Math.round((count / totalCustomers) * 100)
      }))

    // Revenue by month (mock)
    const revenueByMonth = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
      revenue: Math.floor(Math.random() * 200000) + 100000
    }))

    // Top customers
    const topCustomers = customers
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map(customer => ({
        customer: customer.companyName,
        revenue: customer.revenue,
        growth: Math.floor(Math.random() * 40) + 10
      }))

    return {
      totalCustomers,
      activeContracts,
      totalRevenue,
      averageContractValue,
      churnRate,
      growthRate,
      customersBySize,
      customersByIndustry,
      revenueByMonth,
      topCustomers
    }
  }, [customers])

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = !searchTerm ||
        customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.primaryContact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.industry.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
      const matchesIndustry = industryFilter === 'all' || customer.industry === industryFilter
      const matchesSize = sizeFilter === 'all' || customer.size === sizeFilter

      return matchesSearch && matchesStatus && matchesIndustry && matchesSize
    })
  }, [customers, searchTerm, statusFilter, industryFilter, sizeFilter])

  const handleViewCustomer = (customer: EnterpriseCustomer) => {
    setSelectedCustomer(customer)
    setShowCustomerDetails(true)
  }

  const handleAddCustomer = () => {
    setShowAddCustomer(true)
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      success('Enterprise data refreshed successfully')
    } catch (err) {
      error('Failed to refresh enterprise data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async (format: 'csv' | 'json') => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      success(`Enterprise data exported as ${format.toUpperCase()}`)
    } catch (err) {
      error('Failed to export enterprise data')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: EnterpriseCustomer['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'trial': return 'bg-blue-100 text-blue-800'
      case 'expired': return 'bg-red-100 text-red-800'
      case 'suspended': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRiskColor = (risk: EnterpriseCustomer['riskLevel']) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSizeIcon = (size: EnterpriseCustomer['size']) => {
    switch (size) {
      case 'enterprise': return <Crown className="w-4 h-4" />
      case 'large': return <Building2 className="w-4 h-4" />
      case 'medium': return <Briefcase className="w-4 h-4" />
      case 'small': return <Users className="w-4 h-4" />
      default: return <Building2 className="w-4 h-4" />
    }
  }

  const getTierColor = (tier: EnterpriseCustomer['tier']) => {
    switch (tier) {
      case 'enterprise': return 'bg-purple-100 text-purple-800'
      case 'max': return 'bg-blue-100 text-blue-800'
      case 'pro': return 'bg-green-100 text-green-800'
      case 'free': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Chart data
  const revenueData = metrics.revenueByMonth
  const sizeData = metrics.customersBySize.map(item => ({
    name: item.size.charAt(0).toUpperCase() + item.size.slice(1),
    value: item.count,
    percentage: item.percentage
  }))

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

  return (
    <ProtectedRoute requiredPermissions={['view_enterprise']}>
      <AdminLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Enterprise Customer Management</h1>
              <p className="text-gray-600 mt-2">Manage enterprise customers, contracts, and special requirements</p>
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-600">
                    {metrics.totalCustomers} customers • {metrics.activeContracts} active contracts
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleAddCustomer}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Customer
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
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Customers</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{metrics.totalCustomers}</p>
                    <div className="flex items-center text-xs text-green-600">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +{metrics.growthRate}% growth
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors duration-300">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Active Contracts</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{metrics.activeContracts}</p>
                    <div className="flex items-center text-xs text-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {Math.round((metrics.activeContracts / metrics.totalCustomers) * 100)}% active rate
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
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      ${(metrics.totalRevenue / 1000).toFixed(0)}K
                    </p>
                    <div className="flex items-center text-xs text-blue-600">
                      <DollarSign className="w-3 h-3 mr-1" />
                      Avg: ${(metrics.averageContractValue / 1000).toFixed(0)}K/contract
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors duration-300">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Churn Rate</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{metrics.churnRate}%</p>
                    <div className="flex items-center text-xs text-red-600">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      Below target (&lt;7%)
                    </div>
                  </div>
                  <div className="p-3 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors duration-300">
                    <TrendingDown className="h-6 w-6 text-red-600" />
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
              onClick={() => setViewMode('customers')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                viewMode === 'customers' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Building2 className="w-4 h-4 inline mr-2" />
              Customers
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
          </div>

          {/* Analytics View */}
          {viewMode === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                      Customers by Size
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sizeData}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#3B82F6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <LineChart className="w-5 h-5 mr-2 text-green-600" />
                      Revenue Trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#10B981"
                            fill="#10B981"
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Crown className="w-5 h-5 mr-2 text-purple-600" />
                      Top Enterprise Customers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {metrics.topCustomers.map((customer, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {customer.customer.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{customer.customer}</p>
                              <p className="text-sm text-gray-500">${(customer.revenue / 1000).toFixed(0)}K annual revenue</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                +{customer.growth}% growth
                              </p>
                              <p className="text-xs text-gray-500">vs last year</p>
                            </div>
                            <div className={`w-2 h-8 rounded ${
                              customer.growth > 20 ? 'bg-green-500' :
                              customer.growth > 10 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Customers View */}
          {viewMode === 'customers' && (
            <>
              {/* Filters */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Search customers by name, contact, or industry..."
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
                        <option value="active">Active</option>
                        <option value="trial">Trial</option>
                        <option value="expired">Expired</option>
                        <option value="suspended">Suspended</option>
                      </select>

                      <select
                        value={industryFilter}
                        onChange={(e) => setIndustryFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white transition-all duration-200"
                      >
                        <option value="all">All Industries</option>
                        <option value="Technology">Technology</option>
                        <option value="Financial Services">Financial Services</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Manufacturing">Manufacturing</option>
                      </select>

                      <select
                        value={sizeFilter}
                        onChange={(e) => setSizeFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white transition-all duration-200"
                      >
                        <option value="all">All Sizes</option>
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer List */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                    Enterprise Customers ({filteredCustomers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredCustomers.map((customer) => (
                      <div
                        key={customer.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                        onClick={() => handleViewCustomer(customer)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
                            <Building2 className="w-6 h-6 text-blue-600" />
                          </div>

                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium text-gray-900">{customer.companyName}</h3>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTierColor(customer.tier)}`}>
                                {customer.tier}
                              </span>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                                {customer.status}
                              </span>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(customer.riskLevel)}`}>
                                {customer.riskLevel} risk
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                              <span>{customer.industry}</span>
                              <span className="flex items-center">
                                {getSizeIcon(customer.size)}
                                <span className="ml-1 capitalize">{customer.size}</span>
                              </span>
                              <span>👤 {customer.primaryContact.name}</span>
                              <span>📧 {customer.primaryContact.email}</span>
                              <span>💰 ${(customer.contractValue / 1000).toFixed(0)}K/month</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">
                              ${(customer.revenue / 1000).toFixed(0)}K revenue
                            </div>
                            <div className="text-xs text-gray-500">
                              {customer.usage.users} users • {customer.usage.apiCalls.toLocaleString()} API calls
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Customer Details Modal */}
          <Modal
            isOpen={showCustomerDetails}
            onClose={() => {
              setShowCustomerDetails(false)
              setSelectedCustomer(null)
            }}
            title="Customer Details"
            size="lg"
          >
            {selectedCustomer && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{selectedCustomer.companyName}</h3>
                      <p className="text-sm text-gray-600">{selectedCustomer.industry} • {selectedCustomer.size} company</p>
                      <div className="flex items-center space-x-3 mt-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getTierColor(selectedCustomer.tier)}`}>
                          {selectedCustomer.tier} tier
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedCustomer.status)}`}>
                          {selectedCustomer.status}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(selectedCustomer.riskLevel)}`}>
                          {selectedCustomer.riskLevel} risk
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      ${(selectedCustomer.contractValue / 1000).toFixed(0)}K
                    </div>
                    <p className="text-sm text-blue-700">Contract Value</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      ${(selectedCustomer.revenue / 1000).toFixed(0)}K
                    </div>
                    <p className="text-sm text-green-700">Annual Revenue</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                      {selectedCustomer.usage.users}
                    </div>
                    <p className="text-sm text-purple-700">Active Users</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-2">
                      {selectedCustomer.npsScore || 'N/A'}
                    </div>
                    <p className="text-sm text-orange-700">NPS Score</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Primary Contact</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{selectedCustomer.primaryContact.name}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Title</p>
                      <p className="font-medium">{selectedCustomer.primaryContact.title}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{selectedCustomer.primaryContact.email}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{selectedCustomer.primaryContact.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Usage Statistics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <div className="text-xl font-bold text-blue-600 mb-1">
                        {selectedCustomer.usage.apiCalls.toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-600">API Calls</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <div className="text-xl font-bold text-green-600 mb-1">
                        {selectedCustomer.usage.users}
                      </div>
                      <p className="text-sm text-gray-600">Active Users</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <div className="text-xl font-bold text-purple-600 mb-1">
                        {selectedCustomer.usage.storage}GB
                      </div>
                      <p className="text-sm text-gray-600">Storage Used</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Contract Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Contract Start</p>
                      <p className="font-medium">{new Date(selectedCustomer.contractStart).toLocaleDateString()}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Contract End</p>
                      <p className="font-medium">{new Date(selectedCustomer.contractEnd).toLocaleDateString()}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Account Manager</p>
                      <p className="font-medium">{selectedCustomer.accountManager}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Last Activity</p>
                      <p className="font-medium">{new Date(selectedCustomer.lastActivity).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {selectedCustomer.specialRequirements && selectedCustomer.specialRequirements.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Special Requirements</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCustomer.specialRequirements.map((req, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {req}
                        </span>
                      ))}
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
