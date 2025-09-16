'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  RefreshCw,
  Search,
  X,
  Eye,
  EyeOff,
  Download,
  Trash2
} from 'lucide-react'
import { ErrorSeverity, ErrorCategory } from '@/lib/errorLogger'

interface ErrorLog {
  id: string
  timestamp: Date
  severity: ErrorSeverity
  category: ErrorCategory
  message: string
  details?: any
  userId?: string
  sessionId?: string
  userAgent?: string
  url?: string
  stack?: string
  resolved?: boolean
  resolvedAt?: Date
  resolvedBy?: string
}

interface ErrorStats {
  total: number
  unresolved: number
  bySeverity: Record<ErrorSeverity, number>
  byCategory: Record<ErrorCategory, number>
}

export default function ErrorsPage() {
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([])
  const [stats, setStats] = useState<ErrorStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [severityFilter, setSeverityFilter] = useState<ErrorSeverity | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState<ErrorCategory | 'all'>('all')
  const [resolvedFilter, setResolvedFilter] = useState<'all' | 'resolved' | 'unresolved'>('all')
  const [expandedErrors, setExpandedErrors] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadErrorData()
  }, [])

  const loadErrorData = async () => {
    setLoading(true)
    try {
      const [logsResponse, statsResponse] = await Promise.all([
        fetch('/api/errors?action=logs&limit=100'),
        fetch('/api/errors?action=stats')
      ])
      
      const [logsResult, statsResult] = await Promise.all([
        logsResponse.json(),
        statsResponse.json()
      ])
      
      if (logsResult.success) {
        setErrorLogs(logsResult.data.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp)
        })))
      }
      
      if (statsResult.success) {
        setStats(statsResult.data)
      }
    } catch (error) {
      console.error('Error loading error data:', error)
      setErrorMessage('Failed to load error data')
    } finally {
      setLoading(false)
    }
  }

  const resolveError = async (errorId: string) => {
    setActionLoading(errorId)
    try {
      const response = await fetch('/api/errors?action=resolve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          errorId,
          resolvedBy: 'admin'
        })
      })

      const result = await response.json()

      if (result.success) {
        setErrorLogs(prev => prev.map(log => 
          log.id === errorId 
            ? { ...log, resolved: true, resolvedAt: new Date(), resolvedBy: 'admin' }
            : log
        ))
        setSuccessMessage('Error resolved successfully')
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        setErrorMessage(result.error || 'Failed to resolve error')
        setTimeout(() => setErrorMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error resolving error:', error)
      setErrorMessage('Failed to resolve error')
      setTimeout(() => setErrorMessage(''), 3000)
    } finally {
      setActionLoading(null)
    }
  }

  const toggleErrorExpansion = (errorId: string) => {
    setExpandedErrors(prev => {
      const newSet = new Set(prev)
      if (newSet.has(errorId)) {
        newSet.delete(errorId)
      } else {
        newSet.add(errorId)
      }
      return newSet
    })
  }

  const getSeverityColor = (severity: ErrorSeverity) => {
    switch (severity) {
      case ErrorSeverity.LOW: return 'bg-blue-100 text-blue-800'
      case ErrorSeverity.MEDIUM: return 'bg-yellow-100 text-yellow-800'
      case ErrorSeverity.HIGH: return 'bg-orange-100 text-orange-800'
      case ErrorSeverity.CRITICAL: return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: ErrorCategory) => {
    switch (category) {
      case ErrorCategory.API: return 'bg-purple-100 text-purple-800'
      case ErrorCategory.AUTHENTICATION: return 'bg-red-100 text-red-800'
      case ErrorCategory.DATABASE: return 'bg-blue-100 text-blue-800'
      case ErrorCategory.VALIDATION: return 'bg-yellow-100 text-yellow-800'
      case ErrorCategory.NETWORK: return 'bg-green-100 text-green-800'
      case ErrorCategory.SYSTEM: return 'bg-gray-100 text-gray-800'
      case ErrorCategory.USER_ACTION: return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const filteredErrors = errorLogs.filter(error => {
    const matchesSearch = error.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         error.details?.endpoint?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = severityFilter === 'all' || error.severity === severityFilter
    const matchesCategory = categoryFilter === 'all' || error.category === categoryFilter
    const matchesResolved = resolvedFilter === 'all' || 
                           (resolvedFilter === 'resolved' && error.resolved) ||
                           (resolvedFilter === 'unresolved' && !error.resolved)
    
    return matchesSearch && matchesSeverity && matchesCategory && matchesResolved
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <span>Error Logs</span>
          </h2>
          <p className="text-gray-600 mt-1">
            Monitor and manage system errors and issues
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={loadErrorData}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Total Errors</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Unresolved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.unresolved}</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total - stats.unresolved}</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Filter className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Critical</p>
                <p className="text-2xl font-bold text-gray-900">{stats.bySeverity[ErrorSeverity.CRITICAL]}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search errors..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as ErrorSeverity | 'all')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Severities</option>
              <option value={ErrorSeverity.LOW}>Low</option>
              <option value={ErrorSeverity.MEDIUM}>Medium</option>
              <option value={ErrorSeverity.HIGH}>High</option>
              <option value={ErrorSeverity.CRITICAL}>Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as ErrorCategory | 'all')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value={ErrorCategory.API}>API</option>
              <option value={ErrorCategory.AUTHENTICATION}>Authentication</option>
              <option value={ErrorCategory.DATABASE}>Database</option>
              <option value={ErrorCategory.VALIDATION}>Validation</option>
              <option value={ErrorCategory.NETWORK}>Network</option>
              <option value={ErrorCategory.SYSTEM}>System</option>
              <option value={ErrorCategory.USER_ACTION}>User Action</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={resolvedFilter}
              onChange={(e) => setResolvedFilter(e.target.value as 'all' | 'resolved' | 'unresolved')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="unresolved">Unresolved</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Logs */}
      <div className="space-y-4">
        {filteredErrors.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Errors Found</h3>
            <p className="text-gray-600">
              {errorLogs.length === 0 
                ? "No errors have been logged yet"
                : "No errors match your current filters"
              }
            </p>
          </div>
        ) : (
          filteredErrors.map((error) => (
            <motion.div
              key={error.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {error.message}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(error.severity)}`}>
                      {error.severity}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(error.category)}`}>
                      {error.category}
                    </span>
                    {error.resolved ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Resolved
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                        Unresolved
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{formatDate(error.timestamp)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">URL:</span>
                      <span className="font-medium">{error.url || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">User:</span>
                      <span className="font-medium">{error.userId || 'N/A'}</span>
                    </div>
                  </div>

                  {expandedErrors.has(error.id) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <h4 className="font-medium text-gray-900 mb-2">Error Details</h4>
                      {error.details && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 mb-1">Details:</p>
                          <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                            {JSON.stringify(error.details, null, 2)}
                          </pre>
                        </div>
                      )}
                      {error.stack && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Stack Trace:</p>
                          <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                            {error.stack}
                          </pre>
                        </div>
                      )}
                      {error.resolved && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-sm text-gray-600">
                            Resolved by {error.resolvedBy} on {error.resolvedAt ? formatDate(error.resolvedAt) : 'Unknown'}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleErrorExpansion(error.id)}
                    className="p-1 h-8 w-8"
                  >
                    {expandedErrors.has(error.id) ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  {!error.resolved && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resolveError(error.id)}
                      disabled={actionLoading === error.id}
                      className="text-green-600 border-green-300 hover:bg-green-50 hover:border-green-400"
                    >
                      {actionLoading === error.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 bg-green-500 text-white"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>{successMessage}</span>
              <button onClick={() => setSuccessMessage('')}>
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 bg-red-500 text-white"
          >
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>{errorMessage}</span>
              <button onClick={() => setErrorMessage('')}>
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
