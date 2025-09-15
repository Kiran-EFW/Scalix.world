'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface NotificationItem {
  id: string
  title: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  priority: 'low' | 'medium' | 'high' | 'critical'
  category: 'system' | 'security' | 'billing' | 'user' | 'performance' | 'api'
  timestamp: Date
  read: boolean
  targetUsers?: string[]
  actions?: NotificationAction[]
  metadata?: Record<string, any>
  expiresAt?: Date
}

export interface NotificationAction {
  id: string
  label: string
  type: 'primary' | 'secondary'
  url?: string
  onClick?: () => void
}

interface NotificationContextType {
  notifications: NotificationItem[]
  unreadCount: number
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => string
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
  isConnected: boolean
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [isConnected, setIsConnected] = useState(false)

  // Load notifications from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('scalix_notifications')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const notificationsWithDates = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
          expiresAt: n.expiresAt ? new Date(n.expiresAt) : undefined
        }))
        setNotifications(notificationsWithDates)
      } catch (error) {
        console.error('Failed to load notifications:', error)
      }
    }

    // Simulate connection to notification service
    setTimeout(() => setIsConnected(true), 1000)
  }, [])

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('scalix_notifications', JSON.stringify(notifications))
  }, [notifications])

  // Clean up expired notifications
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications(prev =>
        prev.filter(n => !n.expiresAt || n.expiresAt > new Date())
      )
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const addNotification = (notificationData: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const notification: NotificationItem = {
      ...notificationData,
      id,
      timestamp: new Date(),
      read: false
    }

    setNotifications(prev => [notification, ...prev])

    // Auto-expire low priority notifications after 7 days
    if (notification.priority === 'low') {
      notification.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }

    // Show browser notification for high priority items
    if (notification.priority === 'high' || notification.priority === 'critical') {
      showBrowserNotification(notification)
    }

    return id
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  // Browser notification API
  const showBrowserNotification = (notification: NotificationItem) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id
      })
    }
  }

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    isConnected
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}
