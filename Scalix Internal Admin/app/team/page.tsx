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
  Users,
  UserPlus,
  Search,
  Filter,
  MoreHorizontal,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Crown,
  Shield,
  Key,
  Settings,
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
  TrendingUp,
  Plus,
  Send,
  User,
  Briefcase,
  Star,
  Zap,
  Building2,
  FileText,
  Award,
  Lock,
  Unlock,
  Tag,
  MessageSquare,
  Phone,
  MapPin,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Wifi,
  WifiOff,
  Bell,
  BellOff
} from 'lucide-react'

interface TeamMember {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'developer' | 'designer' | 'support' | 'analyst'
  department: 'engineering' | 'design' | 'support' | 'sales' | 'marketing' | 'operations'
  status: 'active' | 'inactive' | 'on_leave' | 'terminated'
  permissions: Permission[]
  lastLogin: string
  createdAt: string
  avatar?: string
  phone?: string
  location?: string
  timezone: string
  managerId?: string
  hireDate: string
  salary?: number
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  skills: string[]
  certifications: string[]
  projects: string[]
  twoFactorEnabled: boolean
  lastActivity: string
}

interface Permission {
  id: string
  name: string
  description: string
  category: 'system' | 'users' | 'billing' | 'support' | 'analytics' | 'settings'
  granted: boolean
}

interface RoleTemplate {
  id: string
  name: string
  description: string
  permissions: Permission[]
  color: string
  icon: any
}

interface TeamMetrics {
  totalMembers: number
  activeMembers: number
  departments: { department: string; count: number; percentage: number }[]
  roles: { role: string; count: number; percentage: number }[]
  newHires: number
  turnoverRate: number
  averageTenure: number
  engagementScore: number
}

type SortField = 'name' | 'email' | 'role' | 'department' | 'createdAt' | 'lastLogin' | 'hireDate'
type SortDirection = 'asc' | 'desc'

export default function TeamManagement() {
  const { success, error, info } = useToast()

  // Team data
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: 'team_001',
      email: 'admin@scalix.world',
      name: 'John Admin',
      role: 'admin',
      department: 'operations',
      status: 'active',
      permissions: [
        { id: 'perm_001', name: 'System Admin', description: 'Full system access', category: 'system', granted: true },
        { id: 'perm_002', name: 'User Management', description: 'Manage user accounts', category: 'users', granted: true },
        { id: 'perm_003', name: 'Billing Admin', description: 'Manage billing and payments', category: 'billing', granted: true }
      ],
      lastLogin: '2 hours ago',
      createdAt: '2023-01-15',
      location: 'San Francisco, CA',
      timezone: 'PST',
      hireDate: '2023-01-15',
      skills: ['Leadership', 'System Administration', 'Project Management'],
      certifications: ['AWS Certified Solutions Architect', 'CISSP'],
      projects: ['Scalix Platform', 'AI Integration', 'Security Framework'],
      twoFactorEnabled: true,
      lastActivity: '2 hours ago'
    },
    {
      id: 'team_002',
      email: 'sarah.dev@scalix.world',
      name: 'Sarah Developer',
      role: 'developer',
      department: 'engineering',
      status: 'active',
      permissions: [
        { id: 'perm_004', name: 'Code Access', description: 'Access to codebase', category: 'system', granted: true },
        { id: 'perm_005', name: 'API Development', description: 'Develop and modify APIs', category: 'system', granted: true }
      ],
      lastLogin: '1 hour ago',
      createdAt: '2023-03-20',
      location: 'Austin, TX',
      timezone: 'CST',
      hireDate: '2023-03-20',
      skills: ['React', 'Node.js', 'TypeScript', 'Python', 'AWS'],
      certifications: ['AWS Developer Associate'],
      projects: ['Scalix API', 'Frontend Dashboard', 'Mobile App'],
      twoFactorEnabled: true,
      lastActivity: '1 hour ago'
    },
    {
      id: 'team_003',
      email: 'mike.support@scalix.world',
      name: 'Mike Support',
      role: 'support',
      department: 'support',
      status: 'active',
      permissions: [
        { id: 'perm_006', name: 'Support Access', description: 'Access support tickets', category: 'support', granted: true },
        { id: 'perm_007', name: 'User Data View', description: 'View user data for support', category: 'users', granted: true }
      ],
      lastLogin: '30 minutes ago',
      createdAt: '2023-06-10',
      location: 'New York, NY',
      timezone: 'EST',
      hireDate: '2023-06-10',
      skills: ['Customer Service', 'Technical Support', 'Troubleshooting'],
      certifications: [],
      projects: ['Customer Support', 'Documentation'],
      twoFactorEnabled: false,
      lastActivity: '30 minutes ago'
    },
    {
      id: 'team_004',
      email: 'lisa.design@scalix.world',
      name: 'Lisa Designer',
      role: 'designer',
      department: 'design',
      status: 'active',
      permissions: [
        { id: 'perm_008', name: 'Design Tools', description: 'Access to design tools', category: 'system', granted: true }
      ],
      lastLogin: '4 hours ago',
      createdAt: '2023-04-15',
      location: 'Los Angeles, CA',
      timezone: 'PST',
      hireDate: '2023-04-15',
      skills: ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Prototyping'],
      certifications: ['Google UX Design Certificate'],
      projects: ['Scalix UI Redesign', 'Mobile App Design'],
      twoFactorEnabled: true,
      lastActivity: '4 hours ago'
    }
  ])

  // Role templates
  const [roleTemplates] = useState<RoleTemplate[]>([
    {
      id: 'role_admin',
      name: 'Administrator',
      description: 'Full system access and management',
      color: 'red',
      icon: Crown,
      permissions: [
        { id: 'perm_001', name: 'System Admin', description: 'Full system access', category: 'system', granted: true },
        { id: 'perm_002', name: 'User Management', description: 'Manage user accounts', category: 'users', granted: true },
        { id: 'perm_003', name: 'Billing Admin', description: 'Manage billing and payments', category: 'billing', granted: true },
        { id: 'perm_009', name: 'Analytics Access', description: 'Access all analytics', category: 'analytics', granted: true },
        { id: 'perm_010', name: 'Settings Management', description: 'Modify system settings', category: 'settings', granted: true }
      ]
    },
    {
      id: 'role_developer',
      name: 'Developer',
      description: 'Code development and technical implementation',
      color: 'blue',
      icon: Settings,
      permissions: [
        { id: 'perm_004', name: 'Code Access', description: 'Access to codebase', category: 'system', granted: true },
        { id: 'perm_005', name: 'API Development', description: 'Develop and modify APIs', category: 'system', granted: true },
        { id: 'perm_011', name: 'Deployment Access', description: 'Deploy applications', category: 'system', granted: true }
      ]
    },
    {
      id: 'role_support',
      name: 'Support Specialist',
      description: 'Customer support and technical assistance',
      color: 'green',
      icon: MessageSquare,
      permissions: [
        { id: 'perm_006', name: 'Support Access', description: 'Access support tickets', category: 'support', granted: true },
        { id: 'perm_007', name: 'User Data View', description: 'View user data for support', category: 'users', granted: true },
        { id: 'perm_012', name: 'Read-only Analytics', description: 'View basic analytics', category: 'analytics', granted: true }
      ]
    },
    {
      id: 'role_designer',
      name: 'Designer',
      description: 'UI/UX design and creative work',
      color: 'purple',
      icon: Palette,
      permissions: [
        { id: 'perm_008', name: 'Design Tools', description: 'Access to design tools', category: 'system', granted: true },
        { id: 'perm_013', name: 'Asset Management', description: 'Manage design assets', category: 'system', granted: true }
      ]
    }
  ])

  // UI State
  const [isLoading, setIsLoading] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'members' | 'roles' | 'invitations' | 'permissions'>('members')

  // Filtering and Search
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')
  const [dateRangeFilter, setDateRangeFilter] = useState({ start: '', end: '' })

  // Sorting
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Bulk Operations
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = useState(false)

  // Modals
  const [showMemberDetails, setShowMemberDetails] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [showEditMember, setShowEditMember] = useState(false)
  const [showRoleManagement, setShowRoleManagement] = useState(false)
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [bulkActionType, setBulkActionType] = useState<string>('')

  // Invitations
  const [pendingInvitations, setPendingInvitations] = useState<any[]>([
    {
      id: 'inv_001',
      email: 'newhire@scalix.world',
      role: 'developer',
      department: 'engineering',
      invitedBy: 'admin@scalix.world',
      invitedAt: '2024-01-10T10:00:00Z',
      expiresAt: '2024-01-17T10:00:00Z',
      status: 'pending'
    }
  ])

  // Computed metrics
  const metrics: TeamMetrics = useMemo(() => {
    const totalMembers = teamMembers.length
    const activeMembers = teamMembers.filter(m => m.status === 'active').length

    // Department breakdown
    const departmentCounts = teamMembers.reduce((acc, member) => {
      acc[member.department] = (acc[member.department] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const departments = Object.entries(departmentCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([department, count]) => ({
        department: department.charAt(0).toUpperCase() + department.slice(1),
        count,
        percentage: Math.round((count / totalMembers) * 100)
      }))

    // Role breakdown
    const roleCounts = teamMembers.reduce((acc, member) => {
      acc[member.role] = (acc[member.role] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const roles = Object.entries(roleCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([role, count]) => ({
        role: role.charAt(0).toUpperCase() + role.slice(1),
        count,
        percentage: Math.round((count / totalMembers) * 100)
      }))

    return {
      totalMembers,
      activeMembers,
      departments,
      roles,
      newHires: 2, // Mock value
      turnoverRate: 5.2, // Mock value
      averageTenure: 18, // Mock value in months
      engagementScore: 8.7 // Mock value
    }
  }, [teamMembers])

  // Filtered data
  const filteredMembers = useMemo(() => {
    return teamMembers.filter(member => {
      const matchesSearch = !searchTerm ||
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.location?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || member.status === statusFilter
      const matchesRole = roleFilter === 'all' || member.role === roleFilter
      const matchesDepartment = departmentFilter === 'all' || member.department === departmentFilter

      // Date range filtering
      const matchesDateRange = (!dateRangeFilter.start || !dateRangeFilter.end) ||
        (new Date(member.createdAt) >= new Date(dateRangeFilter.start) &&
         new Date(member.createdAt) <= new Date(dateRangeFilter.end))

      return matchesSearch && matchesStatus && matchesRole && matchesDepartment && matchesDateRange
    })
  }, [teamMembers, searchTerm, statusFilter, roleFilter, departmentFilter, dateRangeFilter])

  // Sorting logic
  const sortedMembers = useMemo(() => {
    return [...filteredMembers].sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      // Handle date fields
      if (sortField === 'createdAt' || sortField === 'hireDate') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
      }
    })
  }, [filteredMembers, sortField, sortDirection])

  // Pagination logic
  const totalPages = Math.ceil(sortedMembers.length / itemsPerPage)
  const paginatedMembers = sortedMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleViewMember = (member: TeamMember) => {
    setSelectedMember(member)
    setShowMemberDetails(true)
  }

  const handleEditMember = (member: TeamMember) => {
    setSelectedMember(member)
    setShowEditMember(true)
  }

  const handleAddMember = () => {
    setShowAddMember(true)
  }

  const handleInviteMember = () => {
    setShowInviteModal(true)
  }

  const handleStatusChange = (memberId: string, newStatus: TeamMember['status']) => {
    setTeamMembers(members =>
      members.map(member =>
        member.id === memberId ? { ...member, status: newStatus } : member
      )
    )
  }

  const handleRoleChange = (memberId: string, newRole: TeamMember['role']) => {
    setTeamMembers(members =>
      members.map(member =>
        member.id === memberId ? { ...member, role: newRole } : member
      )
    )
  }

  // Bulk Operations
  const handleSelectMember = (memberId: string) => {
    const newSelected = new Set(selectedMembers)
    if (newSelected.has(memberId)) {
      newSelected.delete(memberId)
    } else {
      newSelected.add(memberId)
    }
    setSelectedMembers(newSelected)
    setSelectAll(newSelected.size === paginatedMembers.length)
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedMembers(new Set())
    } else {
      setSelectedMembers(new Set(paginatedMembers.map(member => member.id)))
    }
    setSelectAll(!selectAll)
  }

  const handleBulkAction = async (action: string) => {
    if (selectedMembers.size === 0) return

    setBulkActionType(action)
    setShowConfirmDialog(true)
  }

  const executeBulkAction = async () => {
    setIsLoading(true)
    try {
      const selectedMembersArray = Array.from(selectedMembers)

      switch (bulkActionType) {
        case 'activate':
          setTeamMembers(members =>
            members.map(member =>
              selectedMembersArray.includes(member.id) ? { ...member, status: 'active' as const } : member
            )
          )
          success(`Activated ${selectedMembersArray.length} team members`)
          break
        case 'deactivate':
          setTeamMembers(members =>
            members.map(member =>
              selectedMembersArray.includes(member.id) ? { ...member, status: 'inactive' as const } : member
            )
          )
          success(`Deactivated ${selectedMembersArray.length} team members`)
          break
        case 'terminate':
          setTeamMembers(members =>
            members.filter(member => !selectedMembersArray.includes(member.id))
          )
          success(`Terminated ${selectedMembersArray.length} team members`)
          break
      }

      setSelectedMembers(new Set())
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
    setSelectedMembers(new Set()) // Clear selection on page change
    setSelectAll(false)
  }

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setRoleFilter('all')
    setDepartmentFilter('all')
    setDateRangeFilter({ start: '', end: '' })
    setCurrentPage(1)
  }

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-yellow-100 text-yellow-800'
      case 'on_leave': return 'bg-blue-100 text-blue-800'
      case 'terminated': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleColor = (role: TeamMember['role']) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'manager': return 'bg-purple-100 text-purple-800'
      case 'developer': return 'bg-blue-100 text-blue-800'
      case 'designer': return 'bg-pink-100 text-pink-800'
      case 'support': return 'bg-green-100 text-green-800'
      case 'analyst': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDepartmentColor = (department: TeamMember['department']) => {
    switch (department) {
      case 'engineering': return 'bg-blue-100 text-blue-800'
      case 'design': return 'bg-pink-100 text-pink-800'
      case 'support': return 'bg-green-100 text-green-800'
      case 'sales': return 'bg-yellow-100 text-yellow-800'
      case 'marketing': return 'bg-purple-100 text-purple-800'
      case 'operations': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleIcon = (role: TeamMember['role']) => {
    switch (role) {
      case 'admin': return <Crown className="w-4 h-4" />
      case 'manager': return <Briefcase className="w-4 h-4" />
      case 'developer': return <Settings className="w-4 h-4" />
      case 'designer': return <Star className="w-4 h-4" />
      case 'support': return <MessageSquare className="w-4 h-4" />
      case 'analyst': return <TrendingUp className="w-4 h-4" />
      default: return <User className="w-4 h-4" />
    }
  }

  return (
    <ProtectedRoute requiredPermissions={['manage_team']}>
      <AdminLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Team Management</h1>
              <p className="text-gray-600 mt-2">Manage internal team members, roles, permissions, and access control</p>
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-600">
                    {metrics.totalMembers} team members • {metrics.activeMembers} active
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleInviteMember}
              >
                <Mail className="w-4 h-4 mr-2" />
                Invite Member
              </Button>

              <Button
                onClick={handleAddMember}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Member
              </Button>

              {selectedMembers.size > 0 && (
                <Button
                  onClick={() => setShowBulkActions(true)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Bulk Actions ({selectedMembers.size})
                </Button>
              )}
            </div>
          </div>

          {/* View Mode Tabs */}
          <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setViewMode('members')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                viewMode === 'members' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Members
            </button>
            <button
              onClick={() => setViewMode('roles')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                viewMode === 'roles' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Shield className="w-4 h-4 inline mr-2" />
              Roles
            </button>
            <button
              onClick={() => setViewMode('invitations')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                viewMode === 'invitations' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Mail className="w-4 h-4 inline mr-2" />
              Invitations
            </button>
            <button
              onClick={() => setViewMode('permissions')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                viewMode === 'permissions' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Key className="w-4 h-4 inline mr-2" />
              Permissions
            </button>
          </div>

          {/* Overview Metrics */}
          {viewMode === 'members' && (
            <>
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">Total Members</p>
                        <p className="text-3xl font-bold text-gray-900 mb-2">
                          {metrics.totalMembers}
                        </p>
                        <div className="flex items-center text-xs text-green-600">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +{metrics.newHires} new this month
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
                        <p className="text-sm font-medium text-gray-600 mb-1">Active Members</p>
                        <p className="text-3xl font-bold text-green-600 mb-2">
                          {metrics.activeMembers}
                        </p>
                        <div className="flex items-center text-xs text-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {Math.round((metrics.activeMembers / metrics.totalMembers) * 100)}% of total
                        </div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors duration-300">
                        <UserCheck className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">Engagement Score</p>
                        <p className="text-3xl font-bold text-purple-600 mb-2">
                          {metrics.engagementScore}/10
                        </p>
                        <div className="flex items-center text-xs text-green-600">
                          <Star className="w-3 h-3 mr-1" />
                          Above average
                        </div>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors duration-300">
                        <Star className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">Avg Tenure</p>
                        <p className="text-3xl font-bold text-orange-600 mb-2">
                          {metrics.averageTenure}mo
                        </p>
                        <div className="flex items-center text-xs text-green-600">
                          <Clock className="w-3 h-3 mr-1" />
                          {metrics.turnoverRate}% turnover rate
                        </div>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-xl group-hover:bg-orange-100 transition-colors duration-300">
                        <Calendar className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
                            placeholder="Search team members by name, email, or location..."
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
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="on_leave">On Leave</option>
                          <option value="terminated">Terminated</option>
                        </select>

                        <select
                          value={roleFilter}
                          onChange={(e) => setRoleFilter(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all duration-200"
                        >
                          <option value="all">All Roles</option>
                          <option value="admin">Admin</option>
                          <option value="manager">Manager</option>
                          <option value="developer">Developer</option>
                          <option value="designer">Designer</option>
                          <option value="support">Support</option>
                          <option value="analyst">Analyst</option>
                        </select>

                        <select
                          value={departmentFilter}
                          onChange={(e) => setDepartmentFilter(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all duration-200"
                        >
                          <option value="all">All Departments</option>
                          <option value="engineering">Engineering</option>
                          <option value="design">Design</option>
                          <option value="support">Support</option>
                          <option value="sales">Sales</option>
                          <option value="marketing">Marketing</option>
                          <option value="operations">Operations</option>
                        </select>

                        <Button
                          variant="outline"
                          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                          className={`transition-all duration-200 ${showAdvancedFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}`}
                        >
                          <SlidersHorizontal className="w-4 h-4 mr-2" />
                          {showAdvancedFilters ? 'Hide' : 'Advanced'}
                        </Button>
                      </div>
                    </div>

                    {/* Advanced Filters */}
                    {showAdvancedFilters && (
                      <div className="border-t pt-4 animate-in slide-in-from-top-2 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2 block">Hired From</Label>
                            <Input
                              type="date"
                              value={dateRangeFilter.start}
                              onChange={(e) => setDateRangeFilter(prev => ({ ...prev, start: e.target.value }))}
                              className="focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2 block">Hired To</Label>
                            <Input
                              type="date"
                              value={dateRangeFilter.end}
                              onChange={(e) => setDateRangeFilter(prev => ({ ...prev, end: e.target.value }))}
                              className="focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-4 pt-4 border-t">
                          <div className="text-sm text-gray-600">
                            Showing {paginatedMembers.length} of {filteredMembers.length} team members
                            {(searchTerm || statusFilter !== 'all' || roleFilter !== 'all' || departmentFilter !== 'all' || dateRangeFilter.start || dateRangeFilter.end) && (
                              <span className="text-blue-600 font-medium"> (filtered)</span>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            onClick={resetFilters}
                            size="sm"
                            className="text-blue-600 border-blue-300 hover:bg-blue-50"
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

              {/* Team Members Table */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                    <CardTitle className="flex items-center">
                      <Users className="w-5 h-5 mr-2 text-blue-600" />
                      Team Members ({filteredMembers.length})
                      {selectedMembers.size > 0 && (
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                          {selectedMembers.size} selected
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
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <div className="flex items-center justify-center py-12">
                      <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Bulk Actions Bar */}
                      {selectedMembers.size > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-in slide-in-from-top-2 duration-300">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <CheckSquare className="w-5 h-5 text-blue-600" />
                              <span className="font-medium text-blue-900">
                                {selectedMembers.size} member{selectedMembers.size !== 1 ? 's' : ''} selected
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
                                onClick={() => handleBulkAction('terminate')}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                Terminate
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
                                  <span>Member</span>
                                  <ArrowUpDown className="w-3 h-3" />
                                </button>
                              </th>
                              <th className="px-4 py-3 text-left">
                                <button
                                  onClick={() => handleSort('role')}
                                  className="flex items-center space-x-1 text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-gray-900 transition-colors"
                                >
                                  <span>Role</span>
                                  <ArrowUpDown className="w-3 h-3" />
                                </button>
                              </th>
                              <th className="px-4 py-3 text-left">
                                <button
                                  onClick={() => handleSort('department')}
                                  className="flex items-center space-x-1 text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-gray-900 transition-colors"
                                >
                                  <span>Department</span>
                                  <ArrowUpDown className="w-3 h-3" />
                                </button>
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-4 py-3 text-left">
                                <button
                                  onClick={() => handleSort('lastLogin')}
                                  className="flex items-center space-x-1 text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-gray-900 transition-colors"
                                >
                                  <span>Last Login</span>
                                  <ArrowUpDown className="w-3 h-3" />
                                </button>
                              </th>
                              <th className="px-4 py-3 text-left">
                                <button
                                  onClick={() => handleSort('hireDate')}
                                  className="flex items-center space-x-1 text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-gray-900 transition-colors"
                                >
                                  <span>Hired</span>
                                  <ArrowUpDown className="w-3 h-3" />
                                </button>
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {paginatedMembers.length === 0 ? (
                              <tr>
                                <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                                  <div className="flex flex-col items-center space-y-2">
                                    <Users className="w-12 h-12 text-gray-300" />
                                    <p className="text-lg font-medium">No team members found</p>
                                    <p className="text-sm">Try adjusting your filters or add new members</p>
                                  </div>
                                </td>
                              </tr>
                            ) : (
                              paginatedMembers.map((member) => (
                                <tr
                                  key={member.id}
                                  className="hover:bg-gray-50 transition-colors duration-200"
                                >
                                  {/* Bulk Select Checkbox */}
                                  <td className="px-4 py-4">
                                    <button
                                      onClick={() => handleSelectMember(member.id)}
                                      className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                      {selectedMembers.has(member.id) ? (
                                        <CheckSquare className="w-4 h-4 text-blue-600" />
                                      ) : (
                                        <Square className="w-4 h-4" />
                                      )}
                                    </button>
                                  </td>

                                  {/* Member Info */}
                                  <td className="px-4 py-4">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-semibold text-sm">
                                          {member.name.charAt(0).toUpperCase()}
                                        </span>
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-900">{member.name}</p>
                                        <p className="text-sm text-gray-500">{member.email}</p>
                                        <p className="text-xs text-gray-400">{member.location}</p>
                                      </div>
                                    </div>
                                  </td>

                                  {/* Role */}
                                  <td className="px-4 py-4">
                                    <select
                                      value={member.role}
                                      onChange={(e) => handleRoleChange(member.id, e.target.value as TeamMember['role'])}
                                      className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all duration-200"
                                    >
                                      <option value="admin">Admin</option>
                                      <option value="manager">Manager</option>
                                      <option value="developer">Developer</option>
                                      <option value="designer">Designer</option>
                                      <option value="support">Support</option>
                                      <option value="analyst">Analyst</option>
                                    </select>
                                  </td>

                                  {/* Department */}
                                  <td className="px-4 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDepartmentColor(member.department)}`}>
                                      {member.department}
                                    </span>
                                  </td>

                                  {/* Status */}
                                  <td className="px-4 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                                      <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                        member.status === 'active' ? 'bg-green-400' :
                                        member.status === 'inactive' ? 'bg-yellow-400' :
                                        member.status === 'on_leave' ? 'bg-blue-400' :
                                        'bg-red-400'
                                      }`}></div>
                                      {member.status.replace('_', ' ')}
                                    </span>
                                  </td>

                                  {/* Last Login */}
                                  <td className="px-4 py-4">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm text-gray-900">{member.lastLogin}</span>
                                      {member.twoFactorEnabled && (
                                        <Shield className="w-3 h-3 text-green-500" title="2FA Enabled" />
                                      )}
                                    </div>
                                  </td>

                                  {/* Hire Date */}
                                  <td className="px-4 py-4">
                                    <div className="flex flex-col">
                                      <span className="text-sm text-gray-900">
                                        {new Date(member.hireDate).toLocaleDateString()}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {Math.floor((new Date().getTime() - new Date(member.hireDate).getTime()) / (1000 * 60 * 60 * 24))} days ago
                                      </span>
                                    </div>
                                  </td>

                                  {/* Actions */}
                                  <td className="px-4 py-4">
                                    <div className="flex items-center space-x-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleViewMember(member)}
                                        className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                      >
                                        <Eye className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEditMember(member)}
                                        className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                      >
                                        <Edit className="w-4 h-4" />
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
                            <span>{filteredMembers.length} total members</span>
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
                                      currentPage === pageNum ? 'bg-blue-600 hover:bg-blue-700' : ''
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
            </>
          )}

          {/* Roles View */}
          {viewMode === 'roles' && (
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-red-600" />
                  Role Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {roleTemplates.map((role) => (
                    <Card key={role.id} className="hover:shadow-lg transition-shadow duration-300">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 bg-${role.color}-100 rounded-lg`}>
                              <role.icon className={`w-5 h-5 text-${role.color}-600`} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{role.name}</h3>
                              <p className="text-sm text-gray-600">{role.description}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Permissions:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {role.permissions.filter(p => p.granted).length}/{role.permissions.length}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {role.permissions.filter(p => p.granted).slice(0, 3).map((permission) => (
                              <span key={permission.id} className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                                {permission.name}
                              </span>
                            ))}
                            {role.permissions.filter(p => p.granted).length > 3 && (
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                                +{role.permissions.filter(p => p.granted).length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Invitations View */}
          {viewMode === 'invitations' && (
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-blue-600" />
                  Pending Invitations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingInvitations.map((invitation) => (
                    <div key={invitation.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
                          <Mail className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{invitation.email}</h3>
                          <p className="text-sm text-gray-600">
                            Role: {invitation.role} • Department: {invitation.department}
                          </p>
                          <p className="text-xs text-gray-500">
                            Invited by {invitation.invitedBy} • Expires {new Date(invitation.expiresAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          invitation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          invitation.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {invitation.status}
                        </span>
                        <Button variant="outline" size="sm">
                          <Mail className="w-4 h-4 mr-2" />
                          Resend
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Permissions View */}
          {viewMode === 'permissions' && (
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="w-5 h-5 mr-2 text-purple-600" />
                  Permission Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Advanced permission management interface with granular access control.
                </div>
              </CardContent>
            </Card>
          )}

          {/* Member Details Modal */}
          <Modal
            isOpen={showMemberDetails}
            onClose={() => setShowMemberDetails(false)}
            title="Team Member Details"
            size="lg"
          >
            {selectedMember && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4 pb-4 border-b">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {selectedMember.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{selectedMember.name}</h3>
                    <p className="text-gray-600">{selectedMember.email}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(selectedMember.role)}`}>
                        {getRoleIcon(selectedMember.role)}
                        <span className="ml-1">{selectedMember.role}</span>
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDepartmentColor(selectedMember.department)}`}>
                        {selectedMember.department}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedMember.status)}`}>
                        {selectedMember.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {selectedMember.timezone}
                    </div>
                    <p className="text-sm text-blue-700">Timezone</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {selectedMember.lastLogin}
                    </div>
                    <p className="text-sm text-green-700">Last Login</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                      {new Date(selectedMember.hireDate).toLocaleDateString()}
                    </div>
                    <p className="text-sm text-purple-700">Hire Date</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-2">
                      {selectedMember.twoFactorEnabled ? 'Yes' : 'No'}
                    </div>
                    <p className="text-sm text-orange-700">2FA Enabled</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{selectedMember.phone || 'Not provided'}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium">{selectedMember.location}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Skills & Certifications</h4>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.skills.map((skill, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedMember.certifications.map((cert, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                          <Award className="w-3 h-3 mr-1" />
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Current Projects</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.projects.map((project, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">
                        <Briefcase className="w-3 h-3 mr-1" />
                        {project}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Permissions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedMember.permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-900">{permission.name}</span>
                        {permission.granted ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Modal>

          {/* Add Member Modal */}
          <Modal
            isOpen={showAddMember}
            onClose={() => setShowAddMember(false)}
            title="Add Team Member"
            size="lg"
          >
            <div className="text-center py-8 text-gray-500">
              Add new team member form with role assignment and permission setup.
            </div>
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
              <Button onClick={() => handleBulkAction('terminate')} className="bg-red-600 hover:bg-red-700">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Terminate
              </Button>
              <Button onClick={() => handleBulkAction('delete')} variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </Modal>

          {/* Confirmation Dialog */}
          <ConfirmModal
            isOpen={showConfirmDialog}
            onClose={() => setShowConfirmDialog(false)}
            onConfirm={executeBulkAction}
            title={`Confirm ${bulkActionType}`}
            description={`Apply ${bulkActionType} to ${selectedMembers.size} selected team members?`}
            variant={bulkActionType === 'terminate' || bulkActionType === 'delete' ? 'danger' : 'warning'}
            isLoading={isLoading}
          />
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
