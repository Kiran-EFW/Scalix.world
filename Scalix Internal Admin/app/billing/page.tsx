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
  DollarSign,
  CreditCard,
  Receipt,
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
  Calendar,
  ArrowUpDown,
  MoreHorizontal,
  Crown,
  Star,
  Briefcase,
  Shield,
  Zap,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Banknote,
  Wallet,
  ReceiptIcon,
  FileSpreadsheet,
  AlertOctagon,
  CalendarDays,
  Users,
  Building2,
  Hash
} from 'lucide-react'
import { LineChart as RechartsLineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Invoice {
  id: string
  invoiceNumber: string
  customerId: string
  customerName: string
  amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  dueDate: string
  paidDate?: string
  paymentMethod?: string
  tier: 'free' | 'pro' | 'max' | 'enterprise'
  items: InvoiceItem[]
  createdAt: string
  updatedAt: string
}

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

interface Payment {
  id: string
  invoiceId: string
  customerId: string
  customerName: string
  amount: number
  paymentMethod: 'credit_card' | 'bank_transfer' | 'paypal' | 'crypto'
  transactionId: string
  status: 'completed' | 'pending' | 'failed' | 'refunded'
  processedAt: string
}

interface Subscription {
  id: string
  customerId: string
  customerName: string
  tier: 'free' | 'pro' | 'max' | 'enterprise'
  amount: number
  billingCycle: 'monthly' | 'yearly'
  status: 'active' | 'paused' | 'cancelled' | 'past_due'
  nextBillingDate: string
  trialEndDate?: string
  autoRenew: boolean
  createdAt: string
}

interface BillingMetrics {
  totalRevenue: number
  monthlyRecurringRevenue: number
  averageRevenuePerUser: number
  churnRate: number
  paymentSuccessRate: number
  outstandingInvoices: number
  overdueAmount: number
  revenueGrowthRate: number
  revenueByTier: { tier: string; amount: number; percentage: number }[]
  revenueByMonth: { month: string; revenue: number; subscriptions: number }[]
  paymentMethods: { method: string; count: number; percentage: number }[]
  topCustomers: { customer: string; revenue: number; growth: number }[]
}

export default function BillingManagement() {
  const { success, error, info } = useToast()

  // Billing data
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'inv_001',
      invoiceNumber: 'INV-2024-001',
      customerId: 'cust_001',
      customerName: 'TechCorp Inc.',
      amount: 2500,
      status: 'paid',
      dueDate: '2024-01-15',
      paidDate: '2024-01-14',
      paymentMethod: 'credit_card',
      tier: 'enterprise',
      items: [
        { id: 'item_001', description: 'Enterprise Plan - Annual', quantity: 1, unitPrice: 2500, total: 2500 }
      ],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-14T00:00:00Z'
    },
    {
      id: 'inv_002',
      invoiceNumber: 'INV-2024-002',
      customerId: 'cust_002',
      customerName: 'Global Finance Ltd.',
      amount: 750,
      status: 'sent',
      dueDate: '2024-01-20',
      tier: 'max',
      items: [
        { id: 'item_002', description: 'Max Plan - Monthly', quantity: 1, unitPrice: 750, total: 750 }
      ],
      createdAt: '2024-01-05T00:00:00Z',
      updatedAt: '2024-01-05T00:00:00Z'
    },
    {
      id: 'inv_003',
      invoiceNumber: 'INV-2024-003',
      customerId: 'cust_003',
      customerName: 'Healthcare Solutions',
      amount: 225,
      status: 'overdue',
      dueDate: '2024-01-10',
      tier: 'pro',
      items: [
        { id: 'item_003', description: 'Pro Plan - Monthly', quantity: 1, unitPrice: 225, total: 225 }
      ],
      createdAt: '2024-01-03T00:00:00Z',
      updatedAt: '2024-01-03T00:00:00Z'
    },
    {
      id: 'inv_004',
      invoiceNumber: 'INV-2024-004',
      customerId: 'cust_004',
      customerName: 'Manufacturing Plus',
      amount: 1500,
      status: 'paid',
      dueDate: '2024-01-12',
      paidDate: '2024-01-11',
      paymentMethod: 'bank_transfer',
      tier: 'max',
      items: [
        { id: 'item_004', description: 'Max Plan - Annual', quantity: 1, unitPrice: 1500, total: 1500 }
      ],
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-11T00:00:00Z'
    }
  ])

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: 'sub_001',
      customerId: 'cust_001',
      customerName: 'TechCorp Inc.',
      tier: 'enterprise',
      amount: 2500,
      billingCycle: 'yearly',
      status: 'active',
      nextBillingDate: '2025-01-15',
      autoRenew: true,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'sub_002',
      customerId: 'cust_002',
      customerName: 'Global Finance Ltd.',
      tier: 'max',
      amount: 750,
      billingCycle: 'monthly',
      status: 'active',
      nextBillingDate: '2024-02-01',
      autoRenew: true,
      createdAt: '2023-11-01T00:00:00Z'
    },
    {
      id: 'sub_003',
      customerId: 'cust_003',
      customerName: 'Healthcare Solutions',
      tier: 'pro',
      amount: 225,
      billingCycle: 'monthly',
      status: 'past_due',
      nextBillingDate: '2024-01-15',
      autoRenew: false,
      createdAt: '2024-01-01T00:00:00Z'
    }
  ])

  const [payments, setPayments] = useState<Payment[]>([
    {
      id: 'pay_001',
      invoiceId: 'inv_001',
      customerId: 'cust_001',
      customerName: 'TechCorp Inc.',
      amount: 2500,
      paymentMethod: 'credit_card',
      transactionId: 'txn_abc123',
      status: 'completed',
      processedAt: '2024-01-14T10:30:00Z'
    },
    {
      id: 'pay_002',
      invoiceId: 'inv_004',
      customerId: 'cust_004',
      customerName: 'Manufacturing Plus',
      amount: 1500,
      paymentMethod: 'bank_transfer',
      transactionId: 'txn_def456',
      status: 'completed',
      processedAt: '2024-01-11T14:20:00Z'
    }
  ])

  // UI State
  const [isLoading, setIsLoading] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false)
  const [showCreateInvoice, setShowCreateInvoice] = useState(false)
  const [viewMode, setViewMode] = useState<'overview' | 'invoices' | 'subscriptions' | 'payments'>('overview')

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [tierFilter, setTierFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState<string>('30d')

  // Computed metrics
  const metrics: BillingMetrics = useMemo(() => {
    const totalRevenue = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.amount, 0)

    const monthlyRecurringRevenue = subscriptions
      .filter(sub => sub.status === 'active')
      .reduce((sum, sub) => sum + (sub.billingCycle === 'monthly' ? sub.amount : sub.amount / 12), 0)

    const activeUsers = 1247 // Mock value
    const averageRevenuePerUser = totalRevenue / activeUsers

    const churnRate = 5.2 // Mock value
    const paymentSuccessRate = 98.5 // Mock value

    const outstandingInvoices = invoices.filter(inv => inv.status === 'sent').length
    const overdueAmount = invoices
      .filter(inv => inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.amount, 0)

    const revenueGrowthRate = 23.1 // Mock value

    // Revenue by tier
    const tierRevenue = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((acc, inv) => {
        acc[inv.tier] = (acc[inv.tier] || 0) + inv.amount
        return acc
      }, {} as Record<string, number>)

    const revenueByTier = Object.entries(tierRevenue)
      .sort(([, a], [, b]) => b - a)
      .map(([tier, amount]) => ({
        tier: tier.charAt(0).toUpperCase() + tier.slice(1),
        amount,
        percentage: Math.round((amount / totalRevenue) * 100)
      }))

    // Revenue by month (mock)
    const revenueByMonth = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
      revenue: Math.floor(Math.random() * 100000) + 50000,
      subscriptions: Math.floor(Math.random() * 50) + 20
    }))

    // Payment methods
    const paymentMethods = payments.reduce((acc, payment) => {
      acc[payment.paymentMethod] = (acc[payment.paymentMethod] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const paymentMethodStats = Object.entries(paymentMethods)
      .sort(([, a], [, b]) => b - a)
      .map(([method, count]) => ({
        method: method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        count,
        percentage: Math.round((count / payments.length) * 100)
      }))

    // Top customers (mock)
    const topCustomers = [
      { customer: 'TechCorp Inc.', revenue: 2500, growth: 15 },
      { customer: 'Global Finance Ltd.', revenue: 750, growth: 8 },
      { customer: 'Manufacturing Plus', revenue: 1500, growth: 22 },
      { customer: 'Healthcare Solutions', revenue: 225, growth: 12 },
      { customer: 'Retail Solutions Inc.', revenue: 450, growth: 18 }
    ]

    return {
      totalRevenue,
      monthlyRecurringRevenue,
      averageRevenuePerUser,
      churnRate,
      paymentSuccessRate,
      outstandingInvoices,
      overdueAmount,
      revenueGrowthRate,
      revenueByTier,
      revenueByMonth,
      paymentMethods: paymentMethodStats,
      topCustomers
    }
  }, [invoices, subscriptions, payments])

  // Filtered data
  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
      const matchesSearch = !searchTerm ||
        invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter
      const matchesTier = tierFilter === 'all' || invoice.tier === tierFilter

      return matchesSearch && matchesStatus && matchesTier
    })
  }, [invoices, searchTerm, statusFilter, tierFilter])

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setShowInvoiceDetails(true)
  }

  const handleCreateInvoice = () => {
    setShowCreateInvoice(true)
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      success('Billing data refreshed successfully')
    } catch (err) {
      error('Failed to refresh billing data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async (format: 'csv' | 'json') => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      success(`Billing data exported as ${format.toUpperCase()}`)
    } catch (err) {
      error('Failed to export billing data')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'sent': return 'bg-blue-100 text-blue-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTierColor = (tier: Invoice['tier']) => {
    switch (tier) {
      case 'enterprise': return 'bg-purple-100 text-purple-800'
      case 'max': return 'bg-blue-100 text-blue-800'
      case 'pro': return 'bg-green-100 text-green-800'
      case 'free': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentMethodIcon = (method: Payment['paymentMethod']) => {
    switch (method) {
      case 'credit_card': return <CreditCard className="w-4 h-4" />
      case 'bank_transfer': return <Banknote className="w-4 h-4" />
      case 'paypal': return <Wallet className="w-4 h-4" />
      case 'crypto': return <Zap className="w-4 h-4" />
      default: return <CreditCard className="w-4 h-4" />
    }
  }

  // Chart data
  const revenueData = metrics.revenueByMonth
  const tierData = metrics.revenueByTier.map(item => ({
    name: item.tier,
    value: item.amount,
    percentage: item.percentage
  }))

  const paymentMethodData = metrics.paymentMethods.map(item => ({
    name: item.method,
    value: item.count,
    percentage: item.percentage
  }))

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

  return (
    <ProtectedRoute requiredPermissions={['view_billing']}>
      <AdminLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Billing & Revenue Management</h1>
              <p className="text-gray-600 mt-2">Manage invoices, payments, subscriptions, and revenue analytics</p>
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-600">
                    ${metrics.totalRevenue.toLocaleString()} total revenue • {metrics.outstandingInvoices} pending invoices
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleCreateInvoice}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Invoice
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
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      ${(metrics.totalRevenue / 1000).toFixed(0)}K
                    </p>
                    <div className="flex items-center text-xs text-green-600">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +{metrics.revenueGrowthRate}% from last month
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors duration-300">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">MRR</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      ${(metrics.monthlyRecurringRevenue / 1000).toFixed(0)}K
                    </p>
                    <div className="flex items-center text-xs text-blue-600">
                      <Calendar className="w-3 h-3 mr-1" />
                      Monthly recurring revenue
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors duration-300">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Outstanding</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {metrics.outstandingInvoices}
                    </p>
                    <div className="flex items-center text-xs text-orange-600">
                      <Clock className="w-3 h-3 mr-1" />
                      ${(metrics.overdueAmount / 1000).toFixed(0)}K overdue
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors duration-300">
                    <Receipt className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Success Rate</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {metrics.paymentSuccessRate}%
                    </p>
                    <div className="flex items-center text-xs text-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Payment success rate
                    </div>
                  </div>
                  <div className="p-3 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors duration-300">
                    <CreditCard className="h-6 w-6 text-red-600" />
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
              onClick={() => setViewMode('invoices')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                viewMode === 'invoices' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Receipt className="w-4 h-4 inline mr-2" />
              Invoices
            </button>
            <button
              onClick={() => setViewMode('subscriptions')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                viewMode === 'subscriptions' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Subscriptions
            </button>
            <button
              onClick={() => setViewMode('payments')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                viewMode === 'payments' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Banknote className="w-4 h-4 inline mr-2" />
              Payments
            </button>
          </div>

          {/* Overview Analytics */}
          {viewMode === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                      Revenue by Tier
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={tierData}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
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
                      Top Revenue Customers
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
                              <p className="text-sm text-gray-500">${customer.revenue.toLocaleString()} monthly</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                +{customer.growth}% growth
                              </p>
                              <p className="text-xs text-gray-500">vs last month</p>
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

          {/* Invoices View */}
          {viewMode === 'invoices' && (
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
                          placeholder="Search invoices by customer or invoice number..."
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
                        <option value="paid">Paid</option>
                        <option value="sent">Sent</option>
                        <option value="overdue">Overdue</option>
                        <option value="draft">Draft</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <select
                        value={tierFilter}
                        onChange={(e) => setTierFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white transition-all duration-200"
                      >
                        <option value="all">All Tiers</option>
                        <option value="free">Free</option>
                        <option value="pro">Pro</option>
                        <option value="max">Max</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Invoice List */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Receipt className="w-5 h-5 mr-2 text-blue-600" />
                    Invoices ({filteredInvoices.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredInvoices.map((invoice) => (
                      <div
                        key={invoice.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                        onClick={() => handleViewInvoice(invoice)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
                            <Receipt className="w-6 h-6 text-blue-600" />
                          </div>

                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium text-gray-900">{invoice.invoiceNumber}</h3>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTierColor(invoice.tier)}`}>
                                {invoice.tier}
                              </span>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                                {invoice.status}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                              <span>{invoice.customerName}</span>
                              <span>Due: {new Date(invoice.dueDate).toLocaleDateString()}</span>
                              {invoice.paidDate && <span>Paid: {new Date(invoice.paidDate).toLocaleDateString()}</span>}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">
                              ${invoice.amount.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {invoice.items.length} item{invoice.items.length !== 1 ? 's' : ''}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
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

          {/* Subscriptions View */}
          {viewMode === 'subscriptions' && (
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                  Active Subscriptions ({subscriptions.filter(s => s.status === 'active').length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subscriptions.map((subscription) => (
                    <div key={subscription.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg">
                          <Calendar className="w-6 h-6 text-purple-600" />
                        </div>

                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900">{subscription.customerName}</h3>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTierColor(subscription.tier)}`}>
                              {subscription.tier}
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                              subscription.status === 'past_due' ? 'bg-red-100 text-red-800' :
                              subscription.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {subscription.status}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span>${subscription.amount}/{subscription.billingCycle}</span>
                            <span>Next billing: {new Date(subscription.nextBillingDate).toLocaleDateString()}</span>
                            <span>Auto-renew: {subscription.autoRenew ? 'Yes' : 'No'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payments View */}
          {viewMode === 'payments' && (
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Banknote className="w-5 h-5 mr-2 text-green-600" />
                  Payment History ({payments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-lg">
                          {getPaymentMethodIcon(payment.paymentMethod)}
                        </div>

                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900">{payment.customerName}</h3>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                              payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {payment.status}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span>{payment.paymentMethod.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                            <span>Transaction: {payment.transactionId}</span>
                            <span>{new Date(payment.processedAt).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          ${payment.amount.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          Processed
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Invoice Details Modal */}
          <Modal
            isOpen={showInvoiceDetails}
            onClose={() => {
              setShowInvoiceDetails(false)
              setSelectedInvoice(null)
            }}
            title="Invoice Details"
            size="lg"
          >
            {selectedInvoice && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                      <Receipt className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{selectedInvoice.invoiceNumber}</h3>
                      <p className="text-sm text-gray-600">{selectedInvoice.customerName} • {selectedInvoice.tier} tier</p>
                      <div className="flex items-center space-x-3 mt-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedInvoice.status)}`}>
                          {selectedInvoice.status}
                        </span>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          ${selectedInvoice.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {selectedInvoice.invoiceNumber}
                    </div>
                    <p className="text-sm text-blue-700">Invoice Number</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {selectedInvoice.amount.toLocaleString()}
                    </div>
                    <p className="text-sm text-green-700">Total Amount</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                      {new Date(selectedInvoice.dueDate).toLocaleDateString()}
                    </div>
                    <p className="text-sm text-purple-700">Due Date</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-2">
                      {selectedInvoice.status}
                    </div>
                    <p className="text-sm text-orange-700">Status</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Invoice Items</h4>
                  <div className="space-y-2">
                    {selectedInvoice.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.description}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${item.total.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">${item.unitPrice} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Payment Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Payment Status</p>
                      <p className="font-medium capitalize">{selectedInvoice.status}</p>
                    </div>
                    {selectedInvoice.paymentMethod && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Payment Method</p>
                        <p className="font-medium capitalize">{selectedInvoice.paymentMethod.replace('_', ' ')}</p>
                      </div>
                    )}
                    {selectedInvoice.paidDate && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Paid Date</p>
                        <p className="font-medium">{new Date(selectedInvoice.paidDate).toLocaleString()}</p>
                      </div>
                    )}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Created</p>
                      <p className="font-medium">{new Date(selectedInvoice.createdAt).toLocaleString()}</p>
                    </div>
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
