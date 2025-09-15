'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loading, TableSkeleton, PageLoading } from '@/components/ui/loading'
import { Modal, FormModal, ConfirmModal } from '@/components/ui/modal'
import { useToast } from '@/components/ui/toast'
import AdminLayout from '@/components/layout/AdminLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import {
  Users,
  Search,
  Filter,
  MoreHorizontal,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Crown,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Edit,
  Eye,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  SlidersHorizontal,
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  TrendingUp
} from 'lucide-react'

interface User {
  id: string
  email: string
  name: string
  tierName: string
  tierId: string
  status: 'active' | 'inactive' | 'suspended'
  lastLogin: string
  createdAt: string
  apiUsage: number
  avatar?: string
  phone?: string
  location?: string
  signupMethod: 'email' | 'google' | 'github'
  totalSpent: number
  lastActivity: string
  subscriptionStart: string
}

type SortField = 'name' | 'email' | 'tierName' | 'createdAt' | 'lastLogin' | 'apiUsage' | 'totalSpent'
type SortDirection = 'asc' | 'desc'

export default function UsersManagement() {
  const { success, error, info } = useToast()

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      email: 'john.doe@example.com',
      name: 'John Doe',
      tierName: 'Pro Plan',
      tierId: 'pro',
      status: 'active',
      lastLogin: '2 hours ago',
      createdAt: '2024-01-15',
      apiUsage: 1250,
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      signupMethod: 'email',
      totalSpent: 2990,
      lastActivity: '2 hours ago',
      subscriptionStart: '2024-01-15'
    },
    {
      id: '2',
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      tierName: 'Enterprise Plan',
      tierId: 'enterprise',
      status: 'active',
      lastLogin: '1 day ago',
      createdAt: '2024-02-20',
      apiUsage: 8500,
      phone: '+1 (555) 987-6543',
      location: 'San Francisco, CA',
      signupMethod: 'google',
      totalSpent: 9990,
      lastActivity: '1 day ago',
      subscriptionStart: '2024-02-20'
    },
    {
      id: '3',
      email: 'bob.wilson@example.com',
      name: 'Bob Wilson',
      tierName: 'Starter Plan',
      tierId: 'starter',
      status: 'inactive',
      lastLogin: '1 week ago',
      createdAt: '2024-03-10',
      apiUsage: 150,
      phone: '+1 (555) 456-7890',
      location: 'Austin, TX',
      signupMethod: 'github',
      totalSpent: 990,
      lastActivity: '1 week ago',
      subscriptionStart: '2024-03-10'
    },
    {
      id: '4',
      email: 'alice.brown@example.com',
      name: 'Alice Brown',
      tierName: 'Pro Plan',
      tierId: 'pro',
      status: 'active',
      lastLogin: '30 minutes ago',
      createdAt: '2024-01-08',
      apiUsage: 3200,
      phone: '+1 (555) 234-5678',
      location: 'Chicago, IL',
      signupMethod: 'email',
      totalSpent: 2990,
      lastActivity: '30 minutes ago',
      subscriptionStart: '2024-01-08'
    },
    {
      id: '5',
      email: 'charlie.davis@example.com',
      name: 'Charlie Davis',
      tierName: 'Enterprise Plan',
      tierId: 'enterprise',
      status: 'suspended',
      lastLogin: '2 weeks ago',
      createdAt: '2024-02-14',
      apiUsage: 0,
      phone: '+1 (555) 345-6789',
      location: 'Seattle, WA',
      signupMethod: 'google',
      totalSpent: 9990,
      lastActivity: '2 weeks ago',
      subscriptionStart: '2024-02-14'
    }
  ])

  // UI State
  const [isLoading, setIsLoading] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Filtering and Search
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [tierFilter, setTierFilter] = useState<string>('all')
  const [signupMethodFilter, setSignupMethodFilter] = useState<string>('all')
  const [dateRangeFilter, setDateRangeFilter] = useState({ start: '', end: '' })
  const [activityFilter, setActivityFilter] = useState<string>('all')

  // Sorting
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Bulk Operations
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = useState(false)

  // Modals
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [bulkActionType, setBulkActionType] = useState<string>('')

  // Export
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv')
  const [exportFields, setExportFields] = useState<Set<string>>(
    new Set(['name', 'email', 'tier', 'status', 'createdAt', 'apiUsage'])
  )

  // Advanced filtering logic
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = !searchTerm ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.location?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || user.status === statusFilter
      const matchesTier = tierFilter === 'all' || user.tierId === tierFilter
      const matchesSignupMethod = signupMethodFilter === 'all' || user.signupMethod === signupMethodFilter

      // Date range filtering
      const matchesDateRange = (!dateRangeFilter.start || !dateRangeFilter.end) ||
        (new Date(user.createdAt) >= new Date(dateRangeFilter.start) &&
         new Date(user.createdAt) <= new Date(dateRangeFilter.end))

      // Activity level filtering
      const matchesActivity = activityFilter === 'all' ||
        (activityFilter === 'high' && user.apiUsage > 5000) ||
        (activityFilter === 'medium' && user.apiUsage >= 1000 && user.apiUsage <= 5000) ||
        (activityFilter === 'low' && user.apiUsage < 1000)

      return matchesSearch && matchesStatus && matchesTier && matchesSignupMethod && matchesDateRange && matchesActivity
    })
  }, [users, searchTerm, statusFilter, tierFilter, signupMethodFilter, dateRangeFilter, activityFilter])

  // Sorting logic
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      // Handle numeric fields
      if (sortField === 'apiUsage' || sortField === 'totalSpent') {
        aValue = Number(aValue)
        bValue = Number(bValue)
      }

      // Handle date fields
      if (sortField === 'createdAt' || sortField === 'lastLogin') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
      }
    })
  }, [filteredUsers, sortField, sortDirection])

  // Pagination logic
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage)
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleStatusChange = (userId: string, newStatus: User['status']) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, status: newStatus } : user
    ))
  }

  const handleTierChange = (userId: string, newTierId: string) => {
    const tierNames: { [key: string]: string } = {
      'starter': 'Starter Plan',
      'pro': 'Pro Plan',
      'enterprise': 'Enterprise Plan'
    }

    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, tierId: newTierId, tierName: tierNames[newTierId] }
        : user
    ))
  }

  // Bulk Operations
  const handleSelectUser = (userId: string) => {
    const newSelected = new Set(selectedUsers)
    if (newSelected.has(userId)) {
      newSelected.delete(userId)
    } else {
      newSelected.add(userId)
    }
    setSelectedUsers(newSelected)
    setSelectAll(newSelected.size === paginatedUsers.length)
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers(new Set())
    } else {
      setSelectedUsers(new Set(paginatedUsers.map(user => user.id)))
    }
    setSelectAll(!selectAll)
  }

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.size === 0) return

    setBulkActionType(action)
    setShowConfirmDialog(true)
  }

  const executeBulkAction = async () => {
    setIsLoading(true)
    try {
      const selectedUsersArray = Array.from(selectedUsers)

      switch (bulkActionType) {
        case 'activate':
          setUsers(users.map(user =>
            selectedUsersArray.includes(user.id) ? { ...user, status: 'active' as const } : user
          ))
          success(`Activated ${selectedUsersArray.length} users`)
          break
        case 'deactivate':
          setUsers(users.map(user =>
            selectedUsersArray.includes(user.id) ? { ...user, status: 'inactive' as const } : user
          ))
          success(`Deactivated ${selectedUsersArray.length} users`)
          break
        case 'suspend':
          setUsers(users.map(user =>
            selectedUsersArray.includes(user.id) ? { ...user, status: 'suspended' as const } : user
          ))
          success(`Suspended ${selectedUsersArray.length} users`)
          break
        case 'delete':
          setUsers(users.filter(user => !selectedUsersArray.includes(user.id)))
          success(`Deleted ${selectedUsersArray.length} users`)
          break
      }

      setSelectedUsers(new Set())
      setSelectAll(false)
    } catch (err) {
      error('Bulk action failed')
    } finally {
      setIsLoading(false)
      setShowConfirmDialog(false)
      setBulkActionType('')
    }
  }

  // Sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setSelectedUsers(new Set()) // Clear selection on page change
    setSelectAll(false)
  }

  // Export functionality
  const handleExport = () => {
    setShowExportModal(true)
  }

  const executeExport = () => {
    const fields = Array.from(exportFields)
    const dataToExport = filteredUsers.map(user => {
      const exportUser: any = {}
      fields.forEach(field => {
        switch (field) {
          case 'name':
            exportUser.Name = user.name
            break
          case 'email':
            exportUser.Email = user.email
            break
          case 'tier':
            exportUser.Tier = user.tierName
            break
          case 'status':
            exportUser.Status = user.status
            break
          case 'createdAt':
            exportUser['Created Date'] = user.createdAt
            break
          case 'apiUsage':
            exportUser['API Usage'] = user.apiUsage
            break
          case 'totalSpent':
            exportUser['Total Spent'] = `$${(user.totalSpent / 100).toFixed(2)}`
            break
          case 'location':
            exportUser.Location = user.location
            break
          case 'phone':
            exportUser.Phone = user.phone
            break
        }
      })
      return exportUser
    })

    if (exportFormat === 'csv') {
      const csvContent = [
        Object.keys(dataToExport[0]).join(','),
        ...dataToExport.map(row => Object.values(row).map(val => `"${val}"`).join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } else {
      const jsonContent = JSON.stringify(dataToExport, null, 2)
      const blob = new Blob([jsonContent], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `users-export-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      window.URL.revokeObjectURL(url)
    }

    success(`Exported ${dataToExport.length} users as ${exportFormat.toUpperCase()}`)
    setShowExportModal(false)
  }

  // User details modal
  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setShowUserDetails(true)
  }

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setTierFilter('all')
    setSignupMethodFilter('all')
    setDateRangeFilter({ start: '', end: '' })
    setActivityFilter('all')
    setCurrentPage(1)
  }

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-yellow-100 text-yellow-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTierColor = (tierId: string) => {
    switch (tierId) {
      case 'starter': return 'bg-blue-100 text-blue-800'
      case 'pro': return 'bg-purple-100 text-purple-800'
      case 'enterprise': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <ProtectedRoute requiredPermissions={['manage_users']}>
      <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">User Management</h1>
            <p className="text-gray-600 mt-2">Manage user accounts, tiers, and permissions with advanced filtering and bulk operations</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsLoading(true)
                setTimeout(() => setIsLoading(false), 1000)
              }}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={handleExport}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            {selectedUsers.size > 0 && (
              <Button
                onClick={() => setShowBulkActions(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                Bulk Actions ({selectedUsers.size})
              </Button>
            )}
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Basic Search and Quick Filters */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search users by name, email, or location..."
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
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>

                  <select
                    value={tierFilter}
                    onChange={(e) => setTierFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white transition-all duration-200"
                  >
                    <option value="all">All Tiers</option>
                    <option value="starter">Starter</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                  </select>

                  <Button
                    variant="outline"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className={`transition-all duration-200 ${
                      showAdvancedFilters ? 'bg-red-50 border-red-300 text-red-700' : ''
                    }`}
                  >
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    {showAdvancedFilters ? 'Hide' : 'Advanced'}
                  </Button>
                </div>
              </div>

              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <div className="border-t pt-4 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Signup Method</Label>
                      <select
                        value={signupMethodFilter}
                        onChange={(e) => setSignupMethodFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                      >
                        <option value="all">All Methods</option>
                        <option value="email">Email</option>
                        <option value="google">Google</option>
                        <option value="github">GitHub</option>
                      </select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Activity Level</Label>
                      <select
                        value={activityFilter}
                        onChange={(e) => setActivityFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                      >
                        <option value="all">All Activity</option>
                        <option value="high">High (&gt;5K API calls)</option>
                        <option value="medium">Medium (1K-5K)</option>
                        <option value="low">Low (&lt;1K)</option>
                      </select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Created From</Label>
                      <Input
                        type="date"
                        value={dateRangeFilter.start}
                        onChange={(e) => setDateRangeFilter(prev => ({ ...prev, start: e.target.value }))}
                        className="focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Created To</Label>
                      <Input
                        type="date"
                        value={dateRangeFilter.end}
                        onChange={(e) => setDateRangeFilter(prev => ({ ...prev, end: e.target.value }))}
                        className="focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      Showing {paginatedUsers.length} of {filteredUsers.length} users
                      {(searchTerm || statusFilter !== 'all' || tierFilter !== 'all' || signupMethodFilter !== 'all' || activityFilter !== 'all' || dateRangeFilter.start || dateRangeFilter.end) && (
                        <span className="text-red-600 font-medium"> (filtered)</span>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      onClick={resetFilters}
                      size="sm"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reset Filters
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{filteredUsers.length}</p>
                  <div className="flex items-center text-xs text-green-600">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12.5% from last month
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors duration-300">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Active Users</p>
                  <p className="text-3xl font-bold text-green-600 mb-2">
                    {filteredUsers.filter(u => u.status === 'active').length}
                  </p>
                  <div className="flex items-center text-xs text-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {Math.round((filteredUsers.filter(u => u.status === 'active').length / filteredUsers.length) * 100)}% of total
                  </div>
                </div>
                <div className="p-3 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors duration-300">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Suspended Users</p>
                  <p className="text-3xl font-bold text-red-600 mb-2">
                    {filteredUsers.filter(u => u.status === 'suspended').length}
                  </p>
                  <div className="flex items-center text-xs text-red-600">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Requires attention
                  </div>
                </div>
                <div className="p-3 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors duration-300">
                  <UserX className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-purple-600 mb-2">
                    ${(filteredUsers.reduce((sum, u) => sum + u.totalSpent, 0) / 100).toFixed(0)}K
                  </p>
                  <div className="flex items-center text-xs text-green-600">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +23.1% this month
                  </div>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors duration-300">
                  <Crown className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-4">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-red-600" />
                Users ({filteredUsers.length})
                {selectedUsers.size > 0 && (
                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                    {selectedUsers.size} selected
                  </span>
                )}
              </CardTitle>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-600">Show:</Label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value))
                      setCurrentPage(1)
                    }}
                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span className="text-sm text-gray-600">per page</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <TableSkeleton rows={itemsPerPage} columns={7} />
            ) : (
              <div className="space-y-4">
                {/* Bulk Actions Bar */}
                {selectedUsers.size > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CheckSquare className="w-5 h-5 text-red-600" />
                        <span className="font-medium text-red-900">
                          {selectedUsers.size} user{selectedUsers.size !== 1 ? 's' : ''} selected
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleBulkAction('activate')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <UserCheck className="w-4 h-4 mr-2" />
                          Activate
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleBulkAction('deactivate')}
                          variant="outline"
                        >
                          <UserX className="w-4 h-4 mr-2" />
                          Deactivate
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleBulkAction('suspend')}
                          className="bg-yellow-600 hover:bg-yellow-700"
                        >
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Suspend
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleBulkAction('delete')}
                          variant="destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="w-12 px-4 py-3">
                          <button
                            onClick={handleSelectAll}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {selectAll ? (
                              <CheckSquare className="w-4 h-4" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </th>
                        <th className="px-4 py-3 text-left">
                          <button
                            onClick={() => handleSort('name')}
                            className="flex items-center space-x-1 text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-gray-900 transition-colors"
                          >
                            <span>User</span>
                            <ArrowUpDown className="w-3 h-3" />
                          </button>
                        </th>
                        <th className="px-4 py-3 text-left">
                          <button
                            onClick={() => handleSort('email')}
                            className="flex items-center space-x-1 text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-gray-900 transition-colors"
                          >
                            <span>Email</span>
                            <ArrowUpDown className="w-3 h-3" />
                          </button>
                        </th>
                        <th className="px-4 py-3 text-left">
                          <button
                            onClick={() => handleSort('tierName')}
                            className="flex items-center space-x-1 text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-gray-900 transition-colors"
                          >
                            <span>Tier</span>
                            <ArrowUpDown className="w-3 h-3" />
                          </button>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left">
                          <button
                            onClick={() => handleSort('apiUsage')}
                            className="flex items-center space-x-1 text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-gray-900 transition-colors"
                          >
                            <span>API Usage</span>
                            <ArrowUpDown className="w-3 h-3" />
                          </button>
                        </th>
                        <th className="px-4 py-3 text-left">
                          <button
                            onClick={() => handleSort('totalSpent')}
                            className="flex items-center space-x-1 text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-gray-900 transition-colors"
                          >
                            <span>Revenue</span>
                            <ArrowUpDown className="w-3 h-3" />
                          </button>
                        </th>
                        <th className="px-4 py-3 text-left">
                          <button
                            onClick={() => handleSort('createdAt')}
                            className="flex items-center space-x-1 text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-gray-900 transition-colors"
                          >
                            <span>Joined</span>
                            <ArrowUpDown className="w-3 h-3" />
                          </button>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {paginatedUsers.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="px-4 py-12 text-center text-gray-500">
                            <div className="flex flex-col items-center space-y-2">
                              <Users className="w-12 h-12 text-gray-300" />
                              <p className="text-lg font-medium">No users found</p>
                              <p className="text-sm">Try adjusting your filters or search terms</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        paginatedUsers.map((user, index) => (
                          <tr
                            key={user.id}
                            className="hover:bg-gray-50 transition-colors duration-200"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            {/* Bulk Select Checkbox */}
                            <td className="px-4 py-4">
                              <button
                                onClick={() => handleSelectUser(user.id)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                {selectedUsers.has(user.id) ? (
                                  <CheckSquare className="w-4 h-4 text-red-600" />
                                ) : (
                                  <Square className="w-4 h-4" />
                                )}
                              </button>
                            </td>

                            {/* User Info */}
                            <td className="px-4 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
                                  <span className="text-white font-semibold text-sm">
                                    {user.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{user.name}</p>
                                  <p className="text-sm text-gray-500">{user.location}</p>
                                </div>
                              </div>
                            </td>

                            {/* Email */}
                            <td className="px-4 py-4">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-900">{user.email}</span>
                                <div className="flex items-center space-x-1">
                                  {user.signupMethod === 'google' && (
                                    <div className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
                                      <span className="text-xs text-red-600 font-bold">G</span>
                                    </div>
                                  )}
                                  {user.signupMethod === 'github' && (
                                    <div className="w-4 h-4 bg-gray-800 rounded-full flex items-center justify-center">
                                      <span className="text-xs text-white font-bold">G</span>
                                    </div>
                                  )}
                                  {user.signupMethod === 'email' && (
                                    <Mail className="w-4 h-4 text-gray-400" />
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Tier */}
                            <td className="px-4 py-4">
                              <select
                                value={user.tierId}
                                onChange={(e) => handleTierChange(user.id, e.target.value)}
                                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white transition-all duration-200"
                              >
                                <option value="starter">Starter</option>
                                <option value="pro">Pro</option>
                                <option value="enterprise">Enterprise</option>
                              </select>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                  user.status === 'active' ? 'bg-green-400' :
                                  user.status === 'inactive' ? 'bg-yellow-400' :
                                  'bg-red-400'
                                }`}></div>
                                {user.status}
                              </span>
                            </td>

                            {/* API Usage */}
                            <td className="px-4 py-4">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-900">
                                  {user.apiUsage.toLocaleString()}
                                </span>
                                <div className="flex items-center space-x-1">
                                  {user.apiUsage > 5000 && <Activity className="w-3 h-3 text-green-500" />}
                                  {user.apiUsage > 1000 && user.apiUsage <= 5000 && <Activity className="w-3 h-3 text-blue-500" />}
                                  {user.apiUsage <= 1000 && <Activity className="w-3 h-3 text-gray-400" />}
                                </div>
                              </div>
                            </td>

                            {/* Revenue */}
                            <td className="px-4 py-4">
                              <span className="text-sm font-medium text-gray-900">
                                ${(user.totalSpent / 100).toFixed(2)}
                              </span>
                            </td>

                            {/* Joined Date */}
                            <td className="px-4 py-4">
                              <div className="flex flex-col">
                                <span className="text-sm text-gray-900">
                                  {new Date(user.createdAt).toLocaleDateString()}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days ago
                                </span>
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-4">
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewUser(user)}
                                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                >
                                  <Mail className="w-4 h-4" />
                                </Button>
                                <div className="relative">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                  >
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
              </table>

                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center space-x-2 text-sm text-gray-700">
                      <span>Page {currentPage} of {totalPages}</span>
                      <span className="text-gray-500">•</span>
                      <span>{filteredUsers.length} total users</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center space-x-1"
                      >
                        <ChevronDown className="w-4 h-4 rotate-90" />
                        <span>Previous</span>
                      </Button>

                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                          if (pageNum > totalPages) return null

                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-8 h-8 p-0 ${
                                currentPage === pageNum ? 'bg-red-600 hover:bg-red-700' : ''
                              }`}
                            >
                              {pageNum}
                            </Button>
                          )
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center space-x-1"
                      >
                        <span>Next</span>
                        <ChevronDown className="w-4 h-4 -rotate-90" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User Details Modal */}
    <Modal
      isOpen={showUserDetails}
      onClose={() => setShowUserDetails(false)}
      title="User Details"
      size="lg"
    >
      {selectedUser && (
        <div className="space-y-6">
          <div className="flex items-center space-x-4 pb-4 border-b">
            <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {selectedUser.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
              <p className="text-gray-600">{selectedUser.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Status:</strong> {selectedUser.status}</div>
            <div><strong>Tier:</strong> {selectedUser.tierName}</div>
            <div><strong>API Usage:</strong> {selectedUser.apiUsage.toLocaleString()}</div>
            <div><strong>Revenue:</strong> ${(selectedUser.totalSpent / 100).toFixed(2)}</div>
          </div>
        </div>
      )}
    </Modal>

    {/* Bulk Actions Modal */}
    <Modal
      isOpen={showBulkActions}
      onClose={() => setShowBulkActions(false)}
      title="Bulk Actions"
    >
      <div className="grid grid-cols-2 gap-3">
        <Button onClick={() => handleBulkAction('activate')} className="bg-green-600 hover:bg-green-700">
          <UserCheck className="w-4 h-4 mr-2" />
          Activate
        </Button>
        <Button onClick={() => handleBulkAction('deactivate')} variant="outline">
          <UserX className="w-4 h-4 mr-2" />
          Deactivate
        </Button>
        <Button onClick={() => handleBulkAction('suspend')} className="bg-yellow-600 hover:bg-yellow-700">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Suspend
        </Button>
        <Button onClick={() => handleBulkAction('delete')} variant="destructive">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>
    </Modal>

    {/* Export Modal */}
    <Modal
      isOpen={showExportModal}
      onClose={() => setShowExportModal(false)}
      title="Export Users"
    >
      <div className="space-y-4">
        <div>
          <Label>Format:</Label>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as 'csv' | 'json')}
            className="w-full mt-1 border rounded px-3 py-2"
          >
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
          </select>
        </div>
        <Button onClick={executeExport} className="w-full bg-red-600 hover:bg-red-700">
          <Download className="w-4 h-4 mr-2" />
          Export {filteredUsers.length} Users
        </Button>
      </div>
    </Modal>

    {/* Confirmation Dialog */}
    <ConfirmModal
      isOpen={showConfirmDialog}
      onClose={() => setShowConfirmDialog(false)}
      onConfirm={executeBulkAction}
      title={`Confirm ${bulkActionType}`}
      description={`Apply ${bulkActionType} to ${selectedUsers.size} selected users?`}
      variant={bulkActionType === 'delete' ? 'danger' : 'warning'}
      isLoading={isLoading}
    />
    </AdminLayout>
    </ProtectedRoute>
  )
}

