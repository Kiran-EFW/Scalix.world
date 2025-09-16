'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Play,
  Pause,
  Edit,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Loader2
} from 'lucide-react'

interface Project {
  id: string
  name: string
  description: string
  status: 'running' | 'stopped' | 'error'
  model: string
  createdAt: string
  lastDeployed: string
  requests: number
  cost: number
}

// Initial mock data for development
const initialProjects: Project[] = [
  {
    id: '1',
    name: 'Customer Support Chatbot',
    description: 'AI-powered customer support system for handling common inquiries',
    status: 'running',
    model: 'Scalix Advanced',
    createdAt: '2025-09-01',
    lastDeployed: '2025-09-10',
    requests: 15420,
    cost: 45.80
  },
  {
    id: '2',
    name: 'Code Review Assistant',
    description: 'Automated code review and suggestions for developers',
    status: 'running',
    model: 'Scalix Analyst',
    createdAt: '2025-08-15',
    lastDeployed: '2025-09-08',
    requests: 8920,
    cost: 67.30
  },
  {
    id: '3',
    name: 'Content Generator',
    description: 'AI content creation tool for marketing and blogging',
    status: 'stopped',
    model: 'Scalix Standard',
    createdAt: '2025-07-20',
    lastDeployed: '2025-09-05',
    requests: 5430,
    cost: 23.45
  }
]

const statusConfig = {
  running: {
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: CheckCircle,
    label: 'Running'
  },
  stopped: {
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    icon: Pause,
    label: 'Stopped'
  },
  error: {
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    icon: AlertCircle,
    label: 'Error'
  }
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [loading, setLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDescription, setNewProjectDescription] = useState('')
  const [newProjectModel, setNewProjectModel] = useState('Scalix Standard')
  const [creating, setCreating] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Load projects on component mount
  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()
      if (data.success) {
        setProjects(data.data)
      }
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const createProject = async () => {
    if (!newProjectName.trim()) return

    setCreating(true)
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newProjectName.trim(),
          description: newProjectDescription.trim(),
          model: newProjectModel
        })
      })

      const data = await response.json()
      if (data.success) {
        setProjects(prev => [data.data, ...prev])
        setShowCreateModal(false)
        setNewProjectName('')
        setNewProjectDescription('')
        setNewProjectModel('Scalix Standard')
        // Show success message
        alert('Project created successfully!')
      } else {
        alert('Failed to create project: ' + data.error)
      }
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Failed to create project')
    } finally {
      setCreating(false)
    }
  }

  const updateProjectStatus = async (projectId: string, newStatus: 'running' | 'stopped') => {
    setActionLoading(projectId)
    try {
      const response = await fetch(`/api/projects?id=${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      const data = await response.json()
      if (data.success) {
        setProjects(prev => prev.map(p => p.id === projectId ? data.data : p))
        alert(`Project ${newStatus === 'running' ? 'started' : 'stopped'} successfully!`)
      } else {
        alert('Failed to update project: ' + data.error)
      }
    } catch (error) {
      console.error('Error updating project:', error)
      alert('Failed to update project')
    } finally {
      setActionLoading(null)
    }
  }

  const deleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return
    }

    setActionLoading(projectId)
    try {
      const response = await fetch(`/api/projects?id=${projectId}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      if (data.success) {
        setProjects(prev => prev.filter(p => p.id !== projectId))
        alert('Project deleted successfully!')
      } else {
        alert('Failed to delete project: ' + data.error)
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project')
    } finally {
      setActionLoading(null)
    }
  }

  const viewProject = (projectId: string) => {
    // For now, just show an alert. In a real app, this would navigate to project details
    const project = projects.find(p => p.id === projectId)
    alert(`Viewing project: ${project?.name}\n\nDescription: ${project?.description}\nStatus: ${project?.status}\nModel: ${project?.model}`)
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus
    return matchesSearch && matchesFilter
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
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-2">Manage and monitor your AI applications</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Running</p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.filter(p => p.status === 'running').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.reduce((sum, p) => sum + p.requests, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 font-bold text-lg">$</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Cost</p>
              <p className="text-2xl font-bold text-gray-900">
                ${projects.reduce((sum, p) => sum + p.cost, 0).toFixed(2)}
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
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="running">Running</option>
            <option value="stopped">Stopped</option>
            <option value="error">Error</option>
          </select>
        </div>
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredProjects.map((project, index) => {
          const statusInfo = statusConfig[project.status]
          const StatusIcon = statusInfo.icon

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {project.model}
                    </span>
                    <span>{project.requests.toLocaleString()} requests</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusInfo.label}
                  </div>

                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Created {project.createdAt}</span>
                <span>${project.cost.toFixed(2)}/month</span>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => viewProject(project.id)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>

                {project.status === 'running' ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-orange-600 hover:text-orange-700"
                    onClick={() => updateProjectStatus(project.id, 'stopped')}
                    disabled={actionLoading === project.id}
                  >
                    {actionLoading === project.id ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Pause className="w-4 h-4 mr-2" />
                    )}
                    Stop
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 hover:text-green-700"
                    onClick={() => updateProjectStatus(project.id, 'running')}
                    disabled={actionLoading === project.id}
                  >
                    {actionLoading === project.id ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    Start
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteProject(project.id)}
                  disabled={actionLoading === project.id}
                  className="text-red-600 hover:text-red-700"
                >
                  {actionLoading === project.id ? (
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

      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Project
          </Button>
        </motion.div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Project</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Enter project name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="Enter project description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI Model
                </label>
                <select
                  value={newProjectModel}
                  onChange={(e) => setNewProjectModel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Scalix Standard">Scalix Standard</option>
                  <option value="Scalix Advanced">Scalix Advanced</option>
                  <option value="Scalix Analyst">Scalix Analyst</option>
                  <option value="Scalix Coder">Scalix Coder</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-6">
              <Button
                onClick={createProject}
                disabled={creating || !newProjectName.trim()}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white"
              >
                {creating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                {creating ? 'Creating...' : 'Create Project'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateModal(false)
                  setNewProjectName('')
                  setNewProjectDescription('')
                  setNewProjectModel('Scalix Standard')
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
