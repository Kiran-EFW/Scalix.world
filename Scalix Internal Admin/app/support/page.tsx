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
  MessageSquare,
  Users,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit,
  Plus,
  CheckCircle,
  XCircle,
  Send,
  Star,
  TrendingUp,
  TrendingDown,
  User,
  Mail,
  Phone,
  Calendar,
  ArrowUpDown,
  MoreHorizontal,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Crown,
  Zap,
  Briefcase,
  Shield,
  Hash,
  FileText,
  Settings,
  Reply,
  Forward,
  Archive,
  Tag,
  UserCheck,
  AlertOctagon,
  Timer,
  Activity,
  ThumbsUp,
  Flag,
  HelpCircle
} from 'lucide-react'
import { LineChart as RechartsLineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface SupportTicket {
  id: string
  ticketNumber: string
  customerId: string
  customerName: string
  customerEmail: string
  subject: string
  description: string
  status: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: 'technical' | 'billing' | 'feature_request' | 'account' | 'other'
  assignedTo?: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  satisfaction?: number
  messages: TicketMessage[]
  tags: string[]
}

interface TicketMessage {
  id: string
  senderId: string
  senderName: string
  senderType: 'customer' | 'agent' | 'system'
  message: string
  timestamp: string
  attachments?: string[]
}

interface SupportMetrics {
  totalTickets: number
  openTickets: number
  resolvedTickets: number
  avgResolutionTime: number
  customerSatisfaction: number
  ticketsByPriority: { priority: string; count: number; percentage: number }[]
  ticketsByCategory: { category: string; count: number; percentage: number }[]
  ticketsByStatus: { status: string; count: number; percentage: number }[]
  resolutionTrend: { month: string; resolved: number; created: number }[]
  topAgents: { agent: string; resolved: number; satisfaction: number }[]
}

export default function SupportManagement() {
  const { success, error, info } = useToast()

  // Support data
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'tkt_001',
      ticketNumber: 'SUP-2024-001',
      customerId: 'cust_001',
      customerName: 'TechCorp Inc.',
      customerEmail: 'support@techcorp.com',
      subject: 'API Integration Issues',
      description: 'Unable to authenticate with the Scalix API after upgrading to v2.1',
      status: 'in_progress',
      priority: 'high',
      category: 'technical',
      assignedTo: 'Sarah Johnson',
      createdAt: '2024-01-10T09:30:00Z',
      updatedAt: '2024-01-12T14:20:00Z',
      tags: ['api', 'authentication', 'v2.1'],
      messages: [
        {
          id: 'msg_001',
          senderId: 'cust_001',
          senderName: 'TechCorp Support',
          senderType: 'customer',
          message: 'We upgraded to Scalix v2.1 and now our API authentication is failing. Please help.',
          timestamp: '2024-01-10T09:30:00Z'
        },
        {
          id: 'msg_002',
          senderId: 'agent_001',
          senderName: 'Sarah Johnson',
          senderType: 'agent',
          message: 'I\'m looking into this issue. Can you provide your API key and the error message you\'re receiving?',
          timestamp: '2024-01-10T10:15:00Z'
        }
      ]
    },
    {
      id: 'tkt_002',
      ticketNumber: 'SUP-2024-002',
      customerId: 'cust_002',
      customerName: 'Global Finance Ltd.',
      customerEmail: 'admin@globalfinance.com',
      subject: 'Billing Question - Max Plan',
      description: 'Need clarification on billing for additional API calls',
      status: 'waiting_customer',
      priority: 'medium',
      category: 'billing',
      assignedTo: 'Mike Chen',
      createdAt: '2024-01-11T11:45:00Z',
      updatedAt: '2024-01-11T15:30:00Z',
      tags: ['billing', 'max-plan', 'api-limits'],
      messages: [
        {
          id: 'msg_003',
          senderId: 'cust_002',
          senderName: 'Global Finance Admin',
          senderType: 'customer',
          message: 'We exceeded our API limits last month and got charged extra. Can you explain how the billing works?',
          timestamp: '2024-01-11T11:45:00Z'
        }
      ]
    },
    {
      id: 'tkt_003',
      ticketNumber: 'SUP-2024-003',
      customerId: 'cust_003',
      customerName: 'Healthcare Solutions',
      customerEmail: 'dev@healthcaresolutions.com',
      subject: 'Feature Request - Webhook Events',
      description: 'Request for additional webhook events for patient data updates',
      status: 'open',
      priority: 'medium',
      category: 'feature_request',
      createdAt: '2024-01-12T08:20:00Z',
      updatedAt: '2024-01-12T08:20:00Z',
      tags: ['feature-request', 'webhooks', 'healthcare'],
      messages: [
        {
          id: 'msg_004',
          senderId: 'cust_003',
          senderName: 'Healthcare Solutions',
          senderType: 'customer',
          message: 'We need webhook events for patient data updates to sync with our EHR system.',
          timestamp: '2024-01-12T08:20:00Z'
        }
      ]
    },
    {
      id: 'tkt_004',
      ticketNumber: 'SUP-2024-004',
      customerId: 'cust_004',
      customerName: 'Manufacturing Plus',
      customerEmail: 'support@manufacturingplus.com',
      subject: 'Account Access Issue',
      description: 'Team member unable to access dashboard after password reset',
      status: 'resolved',
      priority: 'high',
      category: 'account',
      assignedTo: 'Lisa Rodriguez',
      createdAt: '2024-01-09T14:15:00Z',
      updatedAt: '2024-01-10T16:45:00Z',
      resolvedAt: '2024-01-10T16:45:00Z',
      satisfaction: 5,
      tags: ['account', 'password-reset', 'access'],
      messages: [
        {
          id: 'msg_005',
          senderId: 'cust_004',
          senderName: 'Manufacturing Plus',
          senderType: 'customer',
          message: 'One of our team members can\'t log in after resetting their password.',
          timestamp: '2024-01-09T14:15:00Z'
        },
        {
          id: 'msg_006',
          senderId: 'agent_002',
          senderName: 'Lisa Rodriguez',
          senderType: 'agent',
          message: 'I\'ve reset the account and sent new login credentials. Please try again.',
          timestamp: '2024-01-10T16:45:00Z'
        }
      ]
    }
  ])

  // UI State
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [showTicketDetails, setShowTicketDetails] = useState(false)
  const [showCreateTicket, setShowCreateTicket] = useState(false)
  const [viewMode, setViewMode] = useState<'overview' | 'tickets' | 'analytics'>('overview')

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  // Computed metrics
  const metrics: SupportMetrics = useMemo(() => {
    const totalTickets = tickets.length
    const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in_progress' || t.status === 'waiting_customer').length
    const resolvedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length

    // Calculate average resolution time (mock)
    const avgResolutionTime = 4.2

    // Calculate customer satisfaction (mock)
    const customerSatisfaction = 4.7

    // Tickets by priority
    const priorityCounts = tickets.reduce((acc, ticket) => {
      acc[ticket.priority] = (acc[ticket.priority] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const ticketsByPriority = Object.entries(priorityCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([priority, count]) => ({
        priority: priority.charAt(0).toUpperCase() + priority.slice(1),
        count,
        percentage: Math.round((count / totalTickets) * 100)
      }))

    // Tickets by category
    const categoryCounts = tickets.reduce((acc, ticket) => {
      acc[ticket.category] = (acc[ticket.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const ticketsByCategory = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([category, count]) => ({
        category: category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        count,
        percentage: Math.round((count / totalTickets) * 100)
      }))

    // Tickets by status
    const statusCounts = tickets.reduce((acc, ticket) => {
      acc[ticket.status] = (acc[ticket.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const ticketsByStatus = Object.entries(statusCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([status, count]) => ({
        status: status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        count,
        percentage: Math.round((count / totalTickets) * 100)
      }))

    // Resolution trend (mock)
    const resolutionTrend = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
      resolved: Math.floor(Math.random() * 30) + 10,
      created: Math.floor(Math.random() * 35) + 15
    }))

    // Top agents (mock)
    const topAgents = [
      { agent: 'Sarah Johnson', resolved: 45, satisfaction: 4.8 },
      { agent: 'Mike Chen', resolved: 38, satisfaction: 4.6 },
      { agent: 'Lisa Rodriguez', resolved: 32, satisfaction: 4.9 },
      { agent: 'David Kim', resolved: 28, satisfaction: 4.7 },
      { agent: 'Anna Martinez', resolved: 25, satisfaction: 4.5 }
    ]

    return {
      totalTickets,
      openTickets,
      resolvedTickets,
      avgResolutionTime,
      customerSatisfaction,
      ticketsByPriority,
      ticketsByCategory,
      ticketsByStatus,
      resolutionTrend,
      topAgents
    }
  }, [tickets])

  // Filtered data
  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesSearch = !searchTerm ||
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter
      const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory
    })
  }, [tickets, searchTerm, statusFilter, priorityFilter, categoryFilter])

  const handleViewTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket)
    setShowTicketDetails(true)
  }

  const handleCreateTicket = () => {
    setShowCreateTicket(true)
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      success('Support data refreshed successfully')
    } catch (err) {
      error('Failed to refresh support data')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'waiting_customer': return 'bg-orange-100 text-orange-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open': return <HelpCircle className="w-4 h-4" />
      case 'in_progress': return <Clock className="w-4 h-4" />
      case 'waiting_customer': return <User className="w-4 h-4" />
      case 'resolved': return <CheckCircle className="w-4 h-4" />
      case 'closed': return <Archive className="w-4 h-4" />
      default: return <HelpCircle className="w-4 h-4" />
    }
  }

  const getPriorityIcon = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="w-4 h-4" />
      case 'high': return <Flag className="w-4 h-4" />
      case 'medium': return <Clock className="w-4 h-4" />
      case 'low': return <CheckCircle className="w-4 h-4" />
      default: return <CheckCircle className="w-4 h-4" />
    }
  }

  // Chart data
  const priorityData = metrics.ticketsByPriority.map(item => ({
    name: item.priority,
    value: item.count,
    percentage: item.percentage
  }))

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

  return (
    <ProtectedRoute requiredPermissions={['manage_support']}>
      <AdminLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Support Management</h1>
              <p className="text-gray-600 mt-2">Manage customer support tickets, track resolution metrics, and provide excellent customer service</p>
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-600">
                    {metrics.totalTickets} total tickets • {metrics.openTickets} open tickets
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleCreateTicket}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Ticket
              </Button>

              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Tickets</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {metrics.totalTickets}
                    </p>
                    <div className="flex items-center text-xs text-green-600">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +12% from last month
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors duration-300">
                    <MessageSquare className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Open Tickets</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {metrics.openTickets}
                    </p>
                    <div className="flex items-center text-xs text-orange-600">
                      <Clock className="w-3 h-3 mr-1" />
                      Requires attention
                    </div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-xl group-hover:bg-orange-100 transition-colors duration-300">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Avg Resolution</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {metrics.avgResolutionTime}h
                    </p>
                    <div className="flex items-center text-xs text-green-600">
                      <Timer className="w-3 h-3 mr-1" />
                      Within SLA
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
                    <p className="text-sm font-medium text-gray-600 mb-1">Satisfaction</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {metrics.customerSatisfaction}★
                    </p>
                    <div className="flex items-center text-xs text-purple-600">
                      <ThumbsUp className="w-3 h-3 mr-1" />
                      Customer rating
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors duration-300">
                    <Star className="h-6 w-6 text-purple-600" />
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
              onClick={() => setViewMode('tickets')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                viewMode === 'tickets' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Tickets
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

          {/* Overview Analytics */}
          {viewMode === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                      Tickets by Priority
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={priorityData}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value} tickets`, 'Count']} />
                          <Bar dataKey="value" fill="#3B82F6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Crown className="w-5 h-5 mr-2 text-purple-600" />
                      Top Performing Agents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {metrics.topAgents.map((agent, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {agent.agent.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{agent.agent}</p>
                              <p className="text-sm text-gray-500">{agent.resolved} tickets resolved</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                {agent.satisfaction}★ satisfaction
                              </p>
                              <p className="text-xs text-gray-500">Customer rating</p>
                            </div>
                            <div className={`w-2 h-8 rounded ${
                              agent.satisfaction >= 4.8 ? 'bg-green-500' :
                              agent.satisfaction >= 4.5 ? 'bg-yellow-500' :
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

          {/* Tickets View */}
          {viewMode === 'tickets' && (
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
                          placeholder="Search tickets by subject, customer, or ticket number..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all duration-200"
                      >
                        <option value="all">All Status</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="waiting_customer">Waiting Customer</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>

                      <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all duration-200"
                      >
                        <option value="all">All Priority</option>
                        <option value="urgent">Urgent</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>

                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all duration-200"
                      >
                        <option value="all">All Categories</option>
                        <option value="technical">Technical</option>
                        <option value="billing">Billing</option>
                        <option value="feature_request">Feature Request</option>
                        <option value="account">Account</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tickets List */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                    Support Tickets ({filteredTickets.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                        onClick={() => handleViewTicket(ticket)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
                            {getStatusIcon(ticket.status)}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-medium text-gray-900">{ticket.subject}</h3>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                                {getPriorityIcon(ticket.priority)}
                                <span className="ml-1">{ticket.priority}</span>
                              </span>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                {ticket.status.replace('_', ' ')}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>{ticket.customerName}</span>
                              <span>{ticket.ticketNumber}</span>
                              <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                              {ticket.assignedTo && <span>Assigned to: {ticket.assignedTo}</span>}
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                              {ticket.tags.map((tag, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                                  <Tag className="w-3 h-3 mr-1" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {ticket.messages.length} messages
                            </div>
                            <div className="text-xs text-gray-500">
                              Last: {new Date(ticket.updatedAt).toLocaleDateString()}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Reply className="w-4 h-4" />
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

          {/* Analytics View */}
          {viewMode === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-purple-600" />
                      Response Time Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full" />
                          <span className="text-sm font-medium">Within 1 hour</span>
                        </div>
                        <span className="text-sm font-bold">85%</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                          <span className="text-sm font-medium">Within 4 hours</span>
                        </div>
                        <span className="text-sm font-bold">12%</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-red-500 rounded-full" />
                          <span className="text-sm font-medium">Over 4 hours</span>
                        </div>
                        <span className="text-sm font-bold">3%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                      Support Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">4.7h</div>
                        <p className="text-sm text-gray-600">Average Resolution Time</p>
                        <div className="text-xs text-green-600 mt-1">↓ 12% from last month</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">94.2%</div>
                        <p className="text-sm text-gray-600">First Response SLA</p>
                        <div className="text-xs text-green-600 mt-1">↑ 3% from last month</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2">4.7★</div>
                        <p className="text-sm text-gray-600">Customer Satisfaction</p>
                        <div className="text-xs text-green-600 mt-1">↑ 0.2 from last month</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Ticket Details Modal */}
          <Modal
            isOpen={showTicketDetails}
            onClose={() => {
              setShowTicketDetails(false)
              setSelectedTicket(null)
            }}
            title="Ticket Details"
            size="lg"
          >
            {selectedTicket && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                      {getStatusIcon(selectedTicket.status)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{selectedTicket.subject}</h3>
                      <p className="text-sm text-gray-600">{selectedTicket.ticketNumber} • {selectedTicket.customerName}</p>
                      <div className="flex items-center space-x-3 mt-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                          {selectedTicket.status.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                          {selectedTicket.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {selectedTicket.ticketNumber}
                    </div>
                    <p className="text-sm text-blue-700">Ticket Number</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {selectedTicket.customerName}
                    </div>
                    <p className="text-sm text-green-700">Customer</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                      {selectedTicket.messages.length}
                    </div>
                    <p className="text-sm text-purple-700">Messages</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-2">
                      {selectedTicket.priority}
                    </div>
                    <p className="text-sm text-orange-700">Priority</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Description</h4>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedTicket.description}</p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Conversation ({selectedTicket.messages.length} messages)</h4>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {selectedTicket.messages.map((message, index) => (
                      <div key={index} className={`flex ${message.senderType === 'customer' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-md p-4 rounded-lg ${
                          message.senderType === 'customer'
                            ? 'bg-blue-50 border-l-4 border-blue-500'
                            : 'bg-green-50 border-l-4 border-green-500'
                        }`}>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium text-sm">{message.senderName}</span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              message.senderType === 'customer'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {message.senderType}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(message.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm">{message.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Ticket Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Created</p>
                      <p className="font-medium">{new Date(selectedTicket.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Last Updated</p>
                      <p className="font-medium">{new Date(selectedTicket.updatedAt).toLocaleString()}</p>
                    </div>
                    {selectedTicket.assignedTo && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Assigned To</p>
                        <p className="font-medium">{selectedTicket.assignedTo}</p>
                      </div>
                    )}
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
