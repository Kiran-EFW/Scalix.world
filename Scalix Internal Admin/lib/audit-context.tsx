'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface AuditLogEntry {
  id: string
  timestamp: Date
  userId: string
  userEmail: string
  action: string
  resource: string
  resourceId?: string
  method: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'EXPORT' | 'IMPORT'
  status: 'success' | 'failure' | 'warning'
  ipAddress?: string
  userAgent?: string
  metadata?: Record<string, any>
  duration?: number
  errorMessage?: string
}

interface AuditContextType {
  logs: AuditLogEntry[]
  addLog: (log: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void
  getLogs: (filters?: {
    userId?: string
    action?: string
    resource?: string
    status?: 'success' | 'failure' | 'warning'
    dateFrom?: Date
    dateTo?: Date
  }) => AuditLogEntry[]
  exportLogs: (format: 'csv' | 'json') => void
  clearLogs: (daysOld?: number) => void
}

const AuditContext = createContext<AuditContextType | undefined>(undefined)

export const useAudit = () => {
  const context = useContext(AuditContext)
  if (context === undefined) {
    throw new Error('useAudit must be used within an AuditProvider')
  }
  return context
}

interface AuditProviderProps {
  children: ReactNode
}

export function AuditProvider({ children }: AuditProviderProps) {
  const [logs, setLogs] = useState<AuditLogEntry[]>([])

  // Load audit logs from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('scalix_audit_logs')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const logsWithDates = parsed.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp)
        }))
        setLogs(logsWithDates)
      } catch (error) {
        console.error('Failed to load audit logs:', error)
      }
    }
  }, [])

  // Save logs to localStorage (keep only last 1000 entries)
  useEffect(() => {
    const recentLogs = logs.slice(-1000)
    localStorage.setItem('scalix_audit_logs', JSON.stringify(recentLogs))
  }, [logs])

  const addLog = (logData: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const log: AuditLogEntry = {
      ...logData,
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    }

    setLogs(prev => [...prev, log])

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[AUDIT] ${log.method} ${log.resource}${log.resourceId ? `:${log.resourceId}` : ''} by ${log.userEmail} - ${log.status}`)
    }
  }

  const getLogs = (filters?: {
    userId?: string
    action?: string
    resource?: string
    status?: 'success' | 'failure' | 'warning'
    dateFrom?: Date
    dateTo?: Date
  }) => {
    let filteredLogs = logs

    if (filters) {
      if (filters.userId) {
        filteredLogs = filteredLogs.filter(log => log.userId === filters.userId)
      }
      if (filters.action) {
        filteredLogs = filteredLogs.filter(log => log.action.toLowerCase().includes(filters.action!.toLowerCase()))
      }
      if (filters.resource) {
        filteredLogs = filteredLogs.filter(log => log.resource.toLowerCase().includes(filters.resource!.toLowerCase()))
      }
      if (filters.status) {
        filteredLogs = filteredLogs.filter(log => log.status === filters.status)
      }
      if (filters.dateFrom) {
        filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.dateFrom!)
      }
      if (filters.dateTo) {
        filteredLogs = filteredLogs.filter(log => log.timestamp <= filters.dateTo!)
      }
    }

    return filteredLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  const exportLogs = (format: 'csv' | 'json') => {
    const data = getLogs()

    if (format === 'json') {
      const content = JSON.stringify(data, null, 2)
      downloadFile(content, 'audit-logs.json', 'application/json')
    } else {
      const csvHeaders = [
        'Timestamp',
        'User Email',
        'Action',
        'Resource',
        'Resource ID',
        'Method',
        'Status',
        'IP Address',
        'Duration (ms)',
        'Error Message'
      ]

      const csvRows = data.map(log => [
        log.timestamp.toISOString(),
        log.userEmail,
        log.action,
        log.resource,
        log.resourceId || '',
        log.method,
        log.status,
        log.ipAddress || '',
        log.duration || '',
        log.errorMessage || ''
      ])

      const csvContent = [csvHeaders, ...csvRows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n')

      downloadFile(csvContent, 'audit-logs.csv', 'text/csv')
    }
  }

  const clearLogs = (daysOld: number = 30) => {
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000)
    setLogs(prev => prev.filter(log => log.timestamp > cutoffDate))
  }

  // Helper function to download files
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const value: AuditContextType = {
    logs,
    addLog,
    getLogs,
    exportLogs,
    clearLogs
  }

  return (
    <AuditContext.Provider value={value}>
      {children}
    </AuditContext.Provider>
  )
}

// Helper hook for logging common actions
export const useAuditLogger = () => {
  const { addLog } = useAudit()

  const logAction = (
    action: string,
    resource: string,
    method: AuditLogEntry['method'],
    status: AuditLogEntry['status'] = 'success',
    options?: {
      resourceId?: string
      metadata?: Record<string, any>
      duration?: number
      errorMessage?: string
    }
  ) => {
    // Get current user (mock implementation)
    const currentUser = {
      id: 'admin',
      email: 'admin@scalix.world'
    }

    addLog({
      userId: currentUser.id,
      userEmail: currentUser.email,
      action,
      resource,
      method,
      status,
      ipAddress: '127.0.0.1', // Would be detected in real implementation
      userAgent: navigator.userAgent,
      ...options
    })
  }

  return { logAction }
}
