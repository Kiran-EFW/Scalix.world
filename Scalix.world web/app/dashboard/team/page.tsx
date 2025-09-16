'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import {
  Users,
  UserPlus,
  Mail,
  Shield,
  Crown,
  Edit,
  Trash2,
  MoreVertical,
  Search,
  Filter,
  Settings,
  MessageSquare,
  Share2,
  Loader2,
  Check,
  AlertTriangle,
  X,
  Download
} from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  lastActive: string | null
  joinedAt: string
  avatar: string | null
  permissions: string[]
}

interface TeamInvitation {
  id: string
  email: string
  role: string
  status: 'pending' | 'accepted' | 'expired'
  invitedAt: string
  invitedBy: string
  expiresAt: string
}

interface TeamStats {
  totalMembers: number
  activeMembers: number
  pendingInvitations: number
  roles: {
    owner: number
    developer: number
    analyst: number
    viewer: number
  }
}

const roleConfig = {
  Owner: {
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    icon: Crown,
    label: 'Owner'
  },
  Developer: {
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    icon: Shield,
    label: 'Developer'
  },
  Analyst: {
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: Users,
    label: 'Analyst'
  },
  Viewer: {
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    icon: Users,
    label: 'Viewer'
  }
}

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [invitations, setInvitations] = useState<TeamInvitation[]>([])
  const [stats, setStats] = useState<TeamStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  
  // Modal states
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('Developer')

  useEffect(() => {
    loadTeamData()
  }, [])

  const loadTeamData = async () => {
    setLoading(true)
    try {
      const [membersResponse, invitationsResponse, statsResponse] = await Promise.all([
        fetch('/api/team?action=members'),
        fetch('/api/team?action=invitations'),
        fetch('/api/team?action=stats')
      ])
      
      const [membersResult, invitationsResult, statsResult] = await Promise.all([
        membersResponse.json(),
        invitationsResponse.json(),
        statsResponse.json()
      ])
      
      if (membersResult.success) setTeamMembers(membersResult.data)
      if (invitationsResult.success) setInvitations(invitationsResult.data)
      if (statsResult.success) setStats(statsResult.data)
    } catch (error) {
      console.error('Error loading team data:', error)
      setErrorMessage('Failed to load team data')
    } finally {
      setLoading(false)
    }
  }

  const showSuccess = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const showError = (message: string) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(''), 5000)
  }

  const inviteMember = async () => {
    if (!inviteEmail.trim()) {
      showError('Please enter an email address')
      return
    }
    
    setActionLoading('invite')
    try {
      const response = await fetch('/api/team?action=invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole })
      })
      
      const result = await response.json()
      if (result.success) {
        setInvitations(prev => [...prev, result.data])
        setStats(prev => prev ? { ...prev, pendingInvitations: prev.pendingInvitations + 1 } : null)
        setShowInviteModal(false)
        setInviteEmail('')
        setInviteRole('Developer')
        showSuccess(result.message)
      } else {
        showError(result.error)
      }
    } catch (error) {
      console.error('Error inviting member:', error)
      showError('Failed to invite member')
    } finally {
      setActionLoading(null)
    }
  }

  const cancelInvitation = async (invitationId: string) => {
    setActionLoading(invitationId)
    try {
      const response = await fetch(`/api/team?action=cancel_invitation&invitationId=${invitationId}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      if (result.success) {
        setInvitations(prev => prev.filter(inv => inv.id !== invitationId))
        setStats(prev => prev ? { ...prev, pendingInvitations: prev.pendingInvitations - 1 } : null)
        showSuccess(result.message)
      } else {
        showError(result.error)
      }
    } catch (error) {
      console.error('Error cancelling invitation:', error)
      showError('Failed to cancel invitation')
    } finally {
      setActionLoading(null)
    }
  }

  const removeMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) {
      return
    }
    
    setActionLoading(memberId)
    try {
      const response = await fetch(`/api/team?action=remove_member&memberId=${memberId}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      if (result.success) {
        setTeamMembers(prev => prev.filter(member => member.id !== memberId))
        setStats(prev => prev ? { ...prev, totalMembers: prev.totalMembers - 1 } : null)
        showSuccess(result.message)
      } else {
        showError(result.error)
      }
    } catch (error) {
      console.error('Error removing member:', error)
      showError('Failed to remove member')
    } finally {
      setActionLoading(null)
    }
  }

  const exportTeam = async () => {
    setActionLoading('export')
    try {
      // In production, this would generate and download a CSV/Excel file
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate export
      showSuccess('Team data exported successfully!')
    } catch (error) {
      console.error('Error exporting team:', error)
      showError('Failed to export team data')
    } finally {
      setActionLoading(null)
    }
  }

  const messageMember = (memberId: string) => {
    // In production, this would open a messaging interface
    showSuccess('Messaging functionality coming soon!')
  }

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || member.role === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600 mt-2">Manage team members, roles, and permissions</p>
        </div>
        <Button 
          onClick={() => setShowInviteModal(true)}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </motion.div>

      {/* Success/Error Messages */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center"
        >
          <Check className="w-5 h-5 text-green-600 mr-3" />
          <span className="text-green-800">{successMessage}</span>
        </motion.div>
      )}

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center"
        >
          <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
          <span className="text-red-800">{errorMessage}</span>
        </motion.div>
      )}

      {/* Team Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalMembers || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Members</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.activeMembers || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Invitations</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.pendingInvitations || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Developers</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.roles?.developer || 0}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="Owner">Owner</option>
            <option value="Developer">Developer</option>
            <option value="Analyst">Analyst</option>
            <option value="Viewer">Viewer</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <Button 
            variant="outline"
            onClick={exportTeam}
            disabled={actionLoading === 'export'}
          >
            {actionLoading === 'export' ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Export Team
          </Button>
          <Button variant="outline">Bulk Actions</Button>
        </div>
      </motion.div>

      {/* Team Members Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredMembers.map((member, index) => {
          const roleInfo = roleConfig[member.role as keyof typeof roleConfig]
          const RoleIcon = roleInfo?.icon || Users

          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${roleInfo?.bgColor || 'bg-gray-100'} ${roleInfo?.color || 'text-gray-600'}`}>
                    <RoleIcon className="w-3 h-3 mr-1" />
                    {roleInfo?.label || member.role}
                  </div>

                  <div className={`w-2 h-2 rounded-full ${
                    member.status === 'active' ? 'bg-green-500' : 
                    member.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`} />
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    member.status === 'active' ? 'text-green-600' : 
                    member.status === 'pending' ? 'text-yellow-600' : 'text-gray-600'
                  }`}>
                    {member.status === 'active' ? 'Active' : 
                     member.status === 'pending' ? 'Pending' : 'Inactive'}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Active:</span>
                  <span className="font-medium text-gray-900">
                    {member.lastActive || 'Never'}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Joined:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(member.joinedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => messageMember(member.id)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message
                </Button>

                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => removeMember(member.id)}
                  disabled={actionLoading === member.id}
                >
                  {actionLoading === member.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {filteredMembers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Team Members
          </Button>
        </motion.div>
      )}

      {/* Team Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Team Activity</h3>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                <span className="font-medium">Sarah Johnson</span> invited <span className="font-medium">Emily Rodriguez</span> to the team
              </p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Settings className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                <span className="font-medium">Mike Chen</span> updated project permissions
              </p>
              <p className="text-xs text-gray-500">4 hours ago</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Share2 className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                <span className="font-medium">Emily Rodriguez</span> shared a project with the team
              </p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <Button variant="outline" className="w-full">
            View All Activity
          </Button>
        </div>
      </motion.div>

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Invitations</h3>
          <div className="space-y-3">
            {invitations.map((invitation) => (
              <div key={invitation.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{invitation.email}</p>
                  <p className="text-sm text-gray-600">
                    {invitation.role} • Invited {new Date(invitation.invitedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-600 text-sm font-medium">Pending</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => cancelInvitation(invitation.id)}
                    disabled={actionLoading === invitation.id}
                  >
                    {actionLoading === invitation.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Invite Team Member</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select 
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Developer">Developer</option>
                  <option value="Analyst">Analyst</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-3 mt-6">
              <Button 
                onClick={inviteMember}
                disabled={actionLoading === 'invite' || !inviteEmail.trim()}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white"
              >
                {actionLoading === 'invite' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4 mr-2" />
                )}
                {actionLoading === 'invite' ? 'Sending...' : 'Send Invitation'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowInviteModal(false)
                  setInviteEmail('')
                  setInviteRole('Developer')
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
