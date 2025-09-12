'use client'

import { useNotifications, notificationPresets } from './NotificationContext'
import { useCallback, useEffect, useRef } from 'react'

interface NotificationServiceProps {
  enableRealTimeUpdates?: boolean
  enableConnectionMonitoring?: boolean
  enableModelMonitoring?: boolean
}

export function NotificationService({
  enableRealTimeUpdates = true,
  enableConnectionMonitoring = true,
  enableModelMonitoring = true
}: NotificationServiceProps) {
  const { addNotification } = useNotifications()
  const connectionStatusRef = useRef<'online' | 'offline' | 'connecting'>('connecting')
  const lastModelStatusRef = useRef<Record<string, any>>({})

  // Connection monitoring
  useEffect(() => {
    if (!enableConnectionMonitoring) return

    const checkConnection = async () => {
      try {
        // Check health endpoint
        const response = await fetch('/api/health', {
          method: 'GET',
          headers: { 'Cache-Control': 'no-cache' }
        })

        if (!response.ok) throw new Error('Health check failed')

        if (connectionStatusRef.current !== 'online') {
          addNotification({
            type: 'success',
            title: 'Connection Restored',
            message: 'Successfully connected to Scalix services.',
            duration: 3000
          })
          connectionStatusRef.current = 'online'
        }
      } catch (error) {
        if (connectionStatusRef.current === 'online') {
          addNotification(notificationPresets.connectionLost())
          connectionStatusRef.current = 'offline'
        }
      }
    }

    // Initial check
    checkConnection()

    // Periodic health checks
    const interval = setInterval(checkConnection, 30000) // Every 30 seconds

    // Listen for online/offline events
    const handleOnline = () => {
      addNotification({
        type: 'info',
        title: 'Network Restored',
        message: 'Internet connection has been restored.',
        duration: 3000
      })
      checkConnection()
    }

    const handleOffline = () => {
      addNotification({
        type: 'warning',
        title: 'Network Lost',
        message: 'Internet connection has been lost. Some features may be unavailable.',
        persistent: true
      })
      connectionStatusRef.current = 'offline'
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      clearInterval(interval)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [addNotification, enableConnectionMonitoring])

  // Model monitoring
  useEffect(() => {
    if (!enableModelMonitoring) return

    const checkModelStatus = async () => {
      try {
        const response = await fetch('/api/models/status')
        if (!response.ok) throw new Error('Model status check failed')

        const modelStatuses = await response.json()

        // Check for model changes
        Object.entries(modelStatuses).forEach(([modelId, status]: [string, any]) => {
          const lastStatus = lastModelStatusRef.current[modelId]

          if (!lastStatus) {
            // First time seeing this model
            addNotification({
              type: 'info',
              title: 'Model Available',
              message: `${status.name} model is now available.`,
              duration: 5000
            })
          } else if (status.available !== lastStatus.available) {
            if (status.available) {
              addNotification({
                type: 'success',
                title: 'Model Restored',
                message: `${status.name} model is back online.`,
                duration: 5000
              })
            } else {
              addNotification({
                type: 'warning',
                title: 'Model Unavailable',
                message: `${status.name} model is currently unavailable.`,
                duration: 10000
              })
            }
          } else if (status.load !== lastStatus.load && Math.abs(status.load - lastStatus.load) > 20) {
            if (status.load > 80) {
              addNotification({
                type: 'warning',
                title: 'High Model Load',
                message: `${status.name} is experiencing high load (${status.load}%).`,
                duration: 5000
              })
            }
          }

          lastModelStatusRef.current[modelId] = status
        })
      } catch (error) {
        console.warn('Failed to check model status:', error)
      }
    }

    checkModelStatus()
    const interval = setInterval(checkModelStatus, 60000) // Every minute

    return () => clearInterval(interval)
  }, [addNotification, enableModelMonitoring])

  // Real-time updates via WebSocket or Server-Sent Events
  useEffect(() => {
    if (!enableRealTimeUpdates) return

    let eventSource: EventSource | null = null

    const connectRealtime = () => {
      try {
        eventSource = new EventSource('/api/events')

        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data)

          switch (data.type) {
            case 'app_created':
              addNotification(notificationPresets.appCreated(data.appName))
              break

            case 'deployment_complete':
              addNotification(notificationPresets.deploymentComplete(data.appName))
              break

            case 'model_switched':
              addNotification(notificationPresets.modelSwitched(data.modelName))
              break

            case 'rate_limit':
              addNotification(notificationPresets.rateLimit(data.resetTime))
              break

            case 'storage_warning':
              addNotification(notificationPresets.storageWarning(data.percentage))
              break

            case 'update_available':
              addNotification(notificationPresets.updateAvailable(data.version))
              break

            case 'maintenance_mode':
              addNotification(notificationPresets.maintenanceMode(data.endTime))
              break

            case 'feature_unlocked':
              addNotification(notificationPresets.featureUnlocked(data.feature))
              break

            case 'error':
              addNotification(notificationPresets.apiError(data.service))
              break

            default:
              // Generic notification
              addNotification({
                type: data.notificationType || 'info',
                title: data.title,
                message: data.message,
                duration: data.duration,
                persistent: data.persistent
              })
          }
        }

        eventSource.onerror = () => {
          console.warn('Real-time connection lost, retrying...')
          setTimeout(connectRealtime, 5000)
        }

        eventSource.onopen = () => {
          console.log('Real-time notifications connected')
        }
      } catch (error) {
        console.warn('Failed to connect to real-time updates:', error)
      }
    }

    connectRealtime()

    return () => {
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [addNotification, enableRealTimeUpdates])

  // Keyboard shortcuts for notifications
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + N to show notifications
      if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault()
        // Focus notification center (this would need to be implemented in the parent)
        const notificationButton = document.querySelector('[aria-label*="Notifications"]') as HTMLElement
        if (notificationButton) {
          notificationButton.click()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return null // This is a service component, no UI
}

// Utility functions for manual notifications
export const useNotificationActions = () => {
  const { addNotification, removeNotification, clearAllNotifications } = useNotifications()

  const notifySuccess = useCallback((title: string, message: string, options?: Partial<Parameters<typeof addNotification>[0]>) => {
    return addNotification({
      type: 'success',
      title,
      message,
      ...options
    })
  }, [addNotification])

  const notifyError = useCallback((title: string, message: string, options?: Partial<Parameters<typeof addNotification>[0]>) => {
    return addNotification({
      type: 'error',
      title,
      message,
      ...options
    })
  }, [addNotification])

  const notifyWarning = useCallback((title: string, message: string, options?: Partial<Parameters<typeof addNotification>[0]>) => {
    return addNotification({
      type: 'warning',
      title,
      message,
      ...options
    })
  }, [addNotification])

  const notifyInfo = useCallback((title: string, message: string, options?: Partial<Parameters<typeof addNotification>[0]>) => {
    return addNotification({
      type: 'info',
      title,
      message,
      ...options
    })
  }, [addNotification])

  const notifySystem = useCallback((title: string, message: string, options?: Partial<Parameters<typeof addNotification>[0]>) => {
    return addNotification({
      type: 'system',
      title,
      message,
      ...options
    })
  }, [addNotification])

  return {
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    notifySystem,
    removeNotification,
    clearAll: clearAllNotifications
  }
}

// Error boundary integration
export const useErrorNotifications = () => {
  const { addNotification } = useNotifications()

  const handleError = useCallback((error: Error, context?: string) => {
    console.error('Application error:', error)

    addNotification({
      type: 'error',
      title: 'Application Error',
      message: `${context ? `${context}: ` : ''}${error.message}`,
      persistent: true,
      action: {
        label: 'Report Issue',
        onClick: () => {
          // Open issue reporting dialog or navigate to support
          window.open('/support', '_blank')
        }
      }
    })
  }, [addNotification])

  const handleNetworkError = useCallback((error: any, operation: string) => {
    let message = `Failed to ${operation}.`

    if (error?.status === 429) {
      message = `Rate limit exceeded for ${operation}. Please try again later.`
    } else if (error?.status >= 500) {
      message = `Server error during ${operation}. Please try again later.`
    } else if (!navigator.onLine) {
      message = `Network connection lost. Please check your internet connection.`
    }

    addNotification({
      type: 'error',
      title: 'Network Error',
      message,
      duration: 10000
    })
  }, [addNotification])

  return {
    handleError,
    handleNetworkError
  }
}

// Performance monitoring notifications
export const usePerformanceNotifications = () => {
  const { addNotification } = useNotifications()
  const slowOperationThreshold = 3000 // 3 seconds

  const trackOperation = useCallback((operationName: string, startTime: number) => {
    const duration = Date.now() - startTime

    if (duration > slowOperationThreshold) {
      addNotification({
        type: 'warning',
        title: 'Slow Operation',
        message: `${operationName} took ${Math.round(duration / 1000)}s to complete.`,
        duration: 5000
      })
    }
  }, [addNotification])

  const trackMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memInfo = (performance as any).memory
      const usagePercent = (memInfo.usedJSHeapSize / memInfo.totalJSHeapSize) * 100

      if (usagePercent > 80) {
        addNotification({
          type: 'warning',
          title: 'High Memory Usage',
          message: `Memory usage is at ${Math.round(usagePercent)}%. Consider refreshing the page.`,
          duration: 10000
        })
      }
    }
  }, [addNotification])

  return {
    trackOperation,
    trackMemoryUsage
  }
}
