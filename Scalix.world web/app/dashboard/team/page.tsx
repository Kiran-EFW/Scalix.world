'use client'

import { useState } from 'react'
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
  Share2
} from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'member'
  avatar: string
  status: 'active' | 'inactive'
  lastActive: string
  projects: number
  joinedAt: string
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    role: 'owner',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    status: 'active',
    lastActive: '2 minutes ago',
    projects: 12,
    joinedAt: '2025-01-15'
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@company.com',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    status: 'active',
    lastActive: '1 hour ago',
    projects: 8,
    joinedAt: '2025-02-20'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily@company.com',
    role: 'member',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
    status: 'active',
    lastActive: '5 minutes ago',
    projects: 5,
    joinedAt: '2025-03-10'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david@company.com',
    role: 'member',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
    status: 'inactive',
    lastActive: '2 days ago',
    projects: 3,
    joinedAt: '2025-06-01'
  }
]

const roleConfig = {
  owner: {
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    icon: Crown,
    label: 'Owner'
  },
  admin: {
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    icon: Shield,
    label: 'Admin'
  },
  member: {
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: Users,
    label: 'Member'
  }
}

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')

  const filteredMembers = mockTeamMembers.filter(member => {
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
        <Button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white">
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </motion.div>

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
              <p className="text-2xl font-bold text-gray-900">{mockTeamMembers.length}</p>
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
              <p className="text-2xl font-bold text-gray-900">
                {mockTeamMembers.filter(m => m.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockTeamMembers.filter(m => m.role === 'admin').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Projects</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockTeamMembers.reduce((sum, m) => sum + m.projects, 0)}
              </p>
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
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
            <option value="member">Member</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline">Export Team</Button>
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
          const roleInfo = roleConfig[member.role]
          const RoleIcon = roleInfo.icon

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
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${roleInfo.bgColor} ${roleInfo.color}`}>
                    <RoleIcon className="w-3 h-3 mr-1" />
                    {roleInfo.label}
                  </div>

                  <div className={`w-2 h-2 rounded-full ${
                    member.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    member.status === 'active' ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {member.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Projects:</span>
                  <span className="font-medium text-gray-900">{member.projects}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Active:</span>
                  <span className="font-medium text-gray-900">{member.lastActive}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Joined:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(member.joinedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message
                </Button>

                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>

                <Button variant="outline" size="sm">
                  <MoreVertical className="w-4 h-4" />
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
    </div>
  )
}
