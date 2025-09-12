'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Settings,
  X,
  Clock
} from 'lucide-react'
import { Notification, NotificationType } from './NotificationContext'

interface NotificationToastProps {
  notification: Notification
  onClose: (id: string) => void
  onAction?: (id: string) => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center'
}

const notificationIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  system: Settings
}

const notificationColors = {
  success: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    icon: 'text-green-600 dark:text-green-400',
    title: 'text-green-800 dark:text-green-200',
    message: 'text-green-700 dark:text-green-300'
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    icon: 'text-red-600 dark:text-red-400',
    title: 'text-red-800 dark:text-red-200',
    message: 'text-red-700 dark:text-red-300'
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    icon: 'text-yellow-600 dark:text-yellow-400',
    title: 'text-yellow-800 dark:text-yellow-200',
    message: 'text-yellow-700 dark:text-yellow-300'
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400',
    title: 'text-blue-800 dark:text-blue-200',
    message: 'text-blue-700 dark:text-blue-300'
  },
  system: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-200 dark:border-purple-800',
    icon: 'text-purple-600 dark:text-purple-400',
    title: 'text-purple-800 dark:text-purple-200',
    message: 'text-purple-700 dark:text-purple-300'
  }
}

export function NotificationToast({
  notification,
  onClose,
  onAction,
  position = 'top-right'
}: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(100)

  const Icon = notificationIcons[notification.type]
  const colors = notificationColors[notification.type]

  // Auto-dismiss progress bar
  useEffect(() => {
    if (notification.duration && !notification.persistent) {
      const startTime = Date.now()
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime
        const remaining = Math.max(0, notification.duration! - elapsed)
        const newProgress = (remaining / notification.duration!) * 100
        setProgress(newProgress)

        if (remaining <= 0) {
          setIsVisible(false)
          setTimeout(() => onClose(notification.id), 300)
          clearInterval(interval)
        }
      }, 50)

      return () => clearInterval(interval)
    }
  }, [notification.duration, notification.persistent, notification.id, onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose(notification.id), 300)
  }

  const handleAction = () => {
    if (notification.action) {
      notification.action.onClick()
      if (!notification.persistent) {
        handleClose()
      }
    }
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: position.includes('right') ? 300 : position.includes('left') ? -300 : 0, y: position.includes('top') ? -20 : 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: position.includes('right') ? 300 : position.includes('left') ? -300 : 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className={`
            relative max-w-sm w-full rounded-lg border shadow-lg backdrop-blur-sm
            ${colors.bg} ${colors.border}
            dark:shadow-2xl
          `}
          role="alert"
          aria-live={notification.type === 'error' ? 'assertive' : 'polite'}
        >
          <div className="p-4">
            <div className="flex items-start space-x-3">
              {/* Icon */}
              <div className={`flex-shrink-0 ${colors.icon}`}>
                <Icon className="w-5 h-5" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className={`text-sm font-semibold ${colors.title}`}>
                      {notification.title}
                    </h4>
                    <p className={`text-sm mt-1 ${colors.message}`}>
                      {notification.message}
                    </p>

                    {/* Timestamp */}
                    <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTimestamp(notification.timestamp)}
                    </div>
                  </div>

                  {/* Close button */}
                  <button
                    onClick={handleClose}
                    className="flex-shrink-0 ml-2 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    aria-label="Close notification"
                  >
                    <X className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
                  </button>
                </div>

                {/* Action button */}
                {notification.action && (
                  <div className="mt-3">
                    <button
                      onClick={handleAction}
                      className={`
                        text-xs font-medium px-3 py-1.5 rounded-md transition-colors
                        ${notification.type === 'success'
                          ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800 dark:text-green-200'
                          : notification.type === 'error'
                          ? 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-800 dark:text-red-200'
                          : notification.type === 'warning'
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-200'
                          : notification.type === 'info'
                          ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-200'
                          : 'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-800 dark:text-purple-200'
                        }
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
                      `}
                    >
                      {notification.action.label}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Progress bar for auto-dismiss */}
            {notification.duration && !notification.persistent && (
              <div className="mt-3">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                  <motion.div
                    className={`
                      h-1 rounded-full transition-colors
                      ${notification.type === 'success' ? 'bg-green-500' :
                        notification.type === 'error' ? 'bg-red-500' :
                        notification.type === 'warning' ? 'bg-yellow-500' :
                        notification.type === 'info' ? 'bg-blue-500' : 'bg-purple-500'
                      }
                    `}
                    style={{ width: `${progress}%` }}
                    initial={{ width: '100%' }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Hover pause effect */}
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none"
            whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Bulk notification actions component
interface NotificationActionsProps {
  onClearAll: () => void
  onClearByType: (type: NotificationType) => void
  notificationCount: number
}

export function NotificationActions({ onClearAll, onClearByType, notificationCount }: NotificationActionsProps) {
  const [showActions, setShowActions] = useState(false)

  if (notificationCount === 0) return null

  return (
    <div className="relative">
      <button
        onClick={() => setShowActions(!showActions)}
        className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded px-2 py-1"
      >
        Actions ({notificationCount})
      </button>

      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 min-w-[160px] z-50"
          >
            <button
              onClick={onClearAll}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              Clear All
            </button>
            <div className="border-t border-gray-200 dark:border-gray-600 my-1" />
            <button
              onClick={() => onClearByType('error')}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-red-600"
            >
              Clear Errors
            </button>
            <button
              onClick={() => onClearByType('warning')}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-yellow-600"
            >
              Clear Warnings
            </button>
            <button
              onClick={() => onClearByType('info')}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-blue-600"
            >
              Clear Info
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
