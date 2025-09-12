'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'system'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: Date
  duration?: number
  persistent?: boolean
  action?: {
    label: string
    onClick: () => void
  }
  data?: any
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => string
  removeNotification: (id: string) => void
  clearAllNotifications: () => void
  clearNotificationsByType: (type: NotificationType) => void
  updateNotification: (id: string, updates: Partial<Notification>) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
  maxNotifications?: number
  defaultDuration?: number
}

export function NotificationProvider({
  children,
  maxNotifications = 5,
  defaultDuration = 5000
}: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
      duration: notification.duration ?? (notification.persistent ? undefined : defaultDuration)
    }

    setNotifications(prev => {
      const filtered = prev.slice(0, maxNotifications - 1)
      return [newNotification, ...filtered]
    })

    // Auto-remove after duration if not persistent
    if (!notification.persistent && newNotification.duration) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }

    return id
  }, [maxNotifications, defaultDuration])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const clearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const clearNotificationsByType = useCallback((type: NotificationType) => {
    setNotifications(prev => prev.filter(n => n.type !== type))
  }, [])

  const updateNotification = useCallback((id: string, updates: Partial<Notification>) => {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, ...updates } : n
    ))
  }, [])

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    clearNotificationsByType,
    updateNotification
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

// Notification presets for common use cases
export const notificationPresets = {
  // Success notifications
  appCreated: (appName: string) => ({
    type: 'success' as NotificationType,
    title: 'App Created Successfully',
    message: `Your app "${appName}" has been created and is ready to use.`,
    action: {
      label: 'Open App',
      onClick: () => console.log('Open app:', appName)
    }
  }),

  modelSwitched: (modelName: string) => ({
    type: 'info' as NotificationType,
    title: 'Model Switched',
    message: `Successfully switched to ${modelName} model.`
  }),

  deploymentComplete: (appName: string) => ({
    type: 'success' as NotificationType,
    title: 'Deployment Complete',
    message: `App "${appName}" has been deployed successfully.`
  }),

  // Error notifications
  connectionLost: () => ({
    type: 'error' as NotificationType,
    title: 'Connection Lost',
    message: 'Lost connection to the server. Please check your internet connection.',
    persistent: true
  }),

  apiError: (service: string) => ({
    type: 'error' as NotificationType,
    title: 'API Error',
    message: `Failed to connect to ${service}. Please try again later.`
  }),

  saveFailed: (item: string) => ({
    type: 'error' as NotificationType,
    title: 'Save Failed',
    message: `Failed to save ${item}. Please try again.`
  }),

  // Warning notifications
  rateLimit: (resetTime: string) => ({
    type: 'warning' as NotificationType,
    title: 'Rate Limit Reached',
    message: `You've reached the rate limit. Resets in ${resetTime}.`
  }),

  storageWarning: (percentage: number) => ({
    type: 'warning' as NotificationType,
    title: 'Storage Warning',
    message: `Storage usage is at ${percentage}%. Consider freeing up space.`
  }),

  // System notifications
  updateAvailable: (version: string) => ({
    type: 'system' as NotificationType,
    title: 'Update Available',
    message: `Version ${version} is now available. Would you like to update?`,
    persistent: true,
    action: {
      label: 'Update Now',
      onClick: () => console.log('Update to version:', version)
    }
  }),

  maintenanceMode: (endTime: string) => ({
    type: 'system' as NotificationType,
    title: 'Maintenance Mode',
    message: `System maintenance scheduled until ${endTime}. Some features may be unavailable.`,
    persistent: true
  }),

  // Info notifications
  welcome: () => ({
    type: 'info' as NotificationType,
    title: 'Welcome to Scalix!',
    message: 'Get started by creating your first AI app.',
    action: {
      label: 'Create App',
      onClick: () => console.log('Navigate to app creation')
    }
  }),

  featureUnlocked: (feature: string) => ({
    type: 'info' as NotificationType,
    title: 'Feature Unlocked',
    message: `You can now use ${feature}!`
  })
}
