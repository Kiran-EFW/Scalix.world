import { db } from './firebase'

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Error categories
export enum ErrorCategory {
  API = 'api',
  AUTHENTICATION = 'authentication',
  DATABASE = 'database',
  VALIDATION = 'validation',
  NETWORK = 'network',
  SYSTEM = 'system',
  USER_ACTION = 'user_action'
}

// Error log interface
export interface ErrorLog {
  id?: string
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

// Mock error logs for fallback
const mockErrorLogs: ErrorLog[] = [
  {
    id: 'error_1',
    timestamp: new Date('2025-01-16T10:30:00Z'),
    severity: ErrorSeverity.MEDIUM,
    category: ErrorCategory.API,
    message: 'Rate limit exceeded',
    details: { endpoint: '/api/usage', limit: 1000, current: 1001 },
    userId: 'admin',
    sessionId: 'session_123',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    url: '/dashboard/usage',
    resolved: false
  },
  {
    id: 'error_2',
    timestamp: new Date('2025-01-16T09:15:00Z'),
    severity: ErrorSeverity.HIGH,
    category: ErrorCategory.AUTHENTICATION,
    message: 'Invalid API key',
    details: { keyId: 'key_123', endpoint: '/api/projects' },
    userId: 'admin',
    sessionId: 'session_123',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    url: '/dashboard/projects',
    resolved: true,
    resolvedAt: new Date('2025-01-16T09:20:00Z'),
    resolvedBy: 'admin'
  },
  {
    id: 'error_3',
    timestamp: new Date('2025-01-16T08:45:00Z'),
    severity: ErrorSeverity.MEDIUM,
    category: ErrorCategory.SYSTEM,
    message: 'Model timeout',
    details: { model: 'scalix-advanced', timeout: 30000, actual: 35000 },
    userId: 'admin',
    sessionId: 'session_123',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    url: '/dashboard/usage',
    resolved: false
  }
]

class ErrorLogger {
  private static instance: ErrorLogger
  private firestoreAvailable: boolean = false

  private constructor() {
    this.checkFirestoreAvailability()
  }

  public static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger()
    }
    return ErrorLogger.instance
  }

  private async checkFirestoreAvailability(): Promise<void> {
    try {
      if (db) {
        // Test Firestore connection
        const { collection, getDocs, limit } = await import('firebase/firestore')
        const testRef = collection(db, 'error_logs')
        await getDocs(testRef, limit(1))
        this.firestoreAvailable = true
        console.log('✅ Error Logger: Firestore connected')
      }
    } catch (error) {
      this.firestoreAvailable = false
      console.log('⚠️ Error Logger: Using mock data fallback')
    }
  }

  public async logError(error: Omit<ErrorLog, 'id' | 'timestamp'>): Promise<string> {
    const errorLog: ErrorLog = {
      ...error,
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    }

    try {
      if (this.firestoreAvailable && db) {
        const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
        
        const errorLogsRef = collection(db, 'error_logs')
        const docRef = await addDoc(errorLogsRef, {
          ...errorLog,
          timestamp: serverTimestamp()
        })
        
        console.log('✅ Error logged to Firestore:', docRef.id)
        return docRef.id
      } else {
        // Fallback to mock data
        mockErrorLogs.push(errorLog)
        console.log('⚠️ Error logged to mock data:', errorLog.id)
        return errorLog.id!
      }
    } catch (error) {
      console.error('❌ Failed to log error:', error)
      // Still add to mock data as ultimate fallback
      mockErrorLogs.push(errorLog)
      return errorLog.id!
    }
  }

  public async getErrorLogs(limit: number = 50, severity?: ErrorSeverity): Promise<ErrorLog[]> {
    try {
      if (this.firestoreAvailable && db) {
        const { collection, getDocs, query, orderBy, limit: firestoreLimit, where } = await import('firebase/firestore')
        
        const errorLogsRef = collection(db, 'error_logs')
        let q = query(errorLogsRef, orderBy('timestamp', 'desc'), firestoreLimit(limit))
        
        if (severity) {
          q = query(errorLogsRef, where('severity', '==', severity), orderBy('timestamp', 'desc'), firestoreLimit(limit))
        }
        
        const snapshot = await getDocs(q)
        const errorLogs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date()
        })) as ErrorLog[]
        
        return errorLogs
      } else {
        // Fallback to mock data
        let filteredLogs = [...mockErrorLogs]
        if (severity) {
          filteredLogs = filteredLogs.filter(log => log.severity === severity)
        }
        return filteredLogs
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, limit)
      }
    } catch (error) {
      console.error('❌ Failed to fetch error logs:', error)
      return mockErrorLogs.slice(0, limit)
    }
  }

  public async resolveError(errorId: string, resolvedBy: string): Promise<boolean> {
    try {
      if (this.firestoreAvailable && db) {
        const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore')
        
        const errorRef = doc(db, 'error_logs', errorId)
        await updateDoc(errorRef, {
          resolved: true,
          resolvedAt: serverTimestamp(),
          resolvedBy
        })
        
        console.log('✅ Error resolved in Firestore:', errorId)
        return true
      } else {
        // Fallback to mock data
        const errorIndex = mockErrorLogs.findIndex(log => log.id === errorId)
        if (errorIndex !== -1) {
          mockErrorLogs[errorIndex].resolved = true
          mockErrorLogs[errorIndex].resolvedAt = new Date()
          mockErrorLogs[errorIndex].resolvedBy = resolvedBy
          console.log('⚠️ Error resolved in mock data:', errorId)
          return true
        }
        return false
      }
    } catch (error) {
      console.error('❌ Failed to resolve error:', error)
      return false
    }
  }

  public async getErrorStats(): Promise<{
    total: number
    unresolved: number
    bySeverity: Record<ErrorSeverity, number>
    byCategory: Record<ErrorCategory, number>
  }> {
    try {
      const errorLogs = await this.getErrorLogs(1000) // Get more logs for stats
      
      const stats = {
        total: errorLogs.length,
        unresolved: errorLogs.filter(log => !log.resolved).length,
        bySeverity: {
          [ErrorSeverity.LOW]: 0,
          [ErrorSeverity.MEDIUM]: 0,
          [ErrorSeverity.HIGH]: 0,
          [ErrorSeverity.CRITICAL]: 0
        },
        byCategory: {
          [ErrorCategory.API]: 0,
          [ErrorCategory.AUTHENTICATION]: 0,
          [ErrorCategory.DATABASE]: 0,
          [ErrorCategory.VALIDATION]: 0,
          [ErrorCategory.NETWORK]: 0,
          [ErrorCategory.SYSTEM]: 0,
          [ErrorCategory.USER_ACTION]: 0
        }
      }

      errorLogs.forEach(log => {
        stats.bySeverity[log.severity]++
        stats.byCategory[log.category]++
      })

      return stats
    } catch (error) {
      console.error('❌ Failed to get error stats:', error)
      return {
        total: 0,
        unresolved: 0,
        bySeverity: {
          [ErrorSeverity.LOW]: 0,
          [ErrorSeverity.MEDIUM]: 0,
          [ErrorSeverity.HIGH]: 0,
          [ErrorSeverity.CRITICAL]: 0
        },
        byCategory: {
          [ErrorCategory.API]: 0,
          [ErrorCategory.AUTHENTICATION]: 0,
          [ErrorCategory.DATABASE]: 0,
          [ErrorCategory.VALIDATION]: 0,
          [ErrorCategory.NETWORK]: 0,
          [ErrorCategory.SYSTEM]: 0,
          [ErrorCategory.USER_ACTION]: 0
        }
      }
    }
  }
}

// Export singleton instance
export const errorLogger = ErrorLogger.getInstance()

// Helper function to log errors easily
export const logError = async (
  message: string,
  severity: ErrorSeverity = ErrorSeverity.MEDIUM,
  category: ErrorCategory = ErrorCategory.SYSTEM,
  details?: any
): Promise<string> => {
  return errorLogger.logError({
    message,
    severity,
    category,
    details,
    userId: 'admin', // In production, get from auth context
    sessionId: 'session_' + Date.now(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server',
    url: typeof window !== 'undefined' ? window.location.href : 'Server'
  })
}

// Helper function to log API errors
export const logApiError = async (
  endpoint: string,
  error: any,
  severity: ErrorSeverity = ErrorSeverity.MEDIUM
): Promise<string> => {
  return logError(
    `API Error: ${endpoint}`,
    severity,
    ErrorCategory.API,
    {
      endpoint,
      error: error.message || error,
      stack: error.stack
    }
  )
}

// Helper function to log authentication errors
export const logAuthError = async (
  action: string,
  error: any,
  severity: ErrorSeverity = ErrorSeverity.HIGH
): Promise<string> => {
  return logError(
    `Authentication Error: ${action}`,
    severity,
    ErrorCategory.AUTHENTICATION,
    {
      action,
      error: error.message || error,
      stack: error.stack
    }
  )
}

export default errorLogger
