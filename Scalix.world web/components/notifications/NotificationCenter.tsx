'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Settings, Filter, Archive, Trash2 } from 'lucide-react'
import { useNotifications } from './NotificationContext'
import type { Notification } from './NotificationContext'
import { NotificationToast, NotificationActions } from './NotificationToast'
import { useMobile } from '../mobile/MobileProvider'

interface NotificationCenterProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center'
  maxVisible?: number
  enableSound?: boolean
  enableDesktopNotifications?: boolean
}

export function NotificationCenter({
  position = 'top-right',
  maxVisible = 5,
  enableSound = false,
  enableDesktopNotifications = false
}: NotificationCenterProps) {
  const { notifications, removeNotification, clearAllNotifications, clearNotificationsByType } = useNotifications()
  const { isMobile, isTablet } = useMobile()
  const [isExpanded, setIsExpanded] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all')
  const [showSettings, setShowSettings] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(enableSound)
  const [desktopEnabled, setDesktopEnabled] = useState(enableDesktopNotifications)

  // Mobile-specific adjustments
  const mobilePosition = isMobile ? 'bottom-right' : position
  const mobileMaxWidth = isMobile ? 'w-full max-w-none' : 'w-96 max-w-[calc(100vw-2rem)]'
  const mobilePositionClasses = {
    'top-right': isMobile ? 'bottom-24 right-4' : 'top-4 right-4',
    'top-left': isMobile ? 'bottom-24 left-4' : 'top-4 left-4',
    'bottom-right': isMobile ? 'bottom-24 right-4' : 'bottom-4 right-4',
    'bottom-left': isMobile ? 'bottom-24 left-4' : 'bottom-4 left-4',
    'top-center': isMobile ? 'bottom-24 left-4 right-4' : 'top-4 left-1/2 transform -translate-x-1/2'
  }

  // Filter notifications based on current filter
  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.data?.read
      case 'important':
        return notification.type === 'error' || notification.type === 'warning' || notification.persistent
      default:
        return true
    }
  })

  // Get visible notifications (most recent first)
  const visibleNotifications = filteredNotifications.slice(0, maxVisible)
  const hasMore = filteredNotifications.length > maxVisible

  // Sound notification
  useEffect(() => {
    if (soundEnabled && notifications.length > 0) {
      const audio = new Audio('/notification-sound.mp3')
      audio.volume = 0.3
      audio.play().catch(() => {
        // Ignore audio play errors (user interaction required)
      })
    }
  }, [notifications.length, soundEnabled])

  // Desktop notifications
  useEffect(() => {
    if (desktopEnabled && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission()
      }
    }
  }, [desktopEnabled])

  // Show desktop notification for important notifications
  useEffect(() => {
    if (desktopEnabled && 'Notification' in window && Notification.permission === 'granted') {
      const latestNotification = notifications[0]
      if (latestNotification && (latestNotification.type === 'error' || latestNotification.type === 'warning')) {
        new Notification(latestNotification.title, {
          body: latestNotification.message,
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        })
      }
    }
  }, [notifications, desktopEnabled])

  const positionClasses = mobilePositionClasses

  const unreadCount = notifications.filter(n => !n.data?.read).length
  const importantCount = notifications.filter(n =>
    n.type === 'error' || n.type === 'warning' || n.persistent
  ).length

  return (
    <>
      {/* Notification Bell Button */}
      <div className={`fixed ${positionClasses[position]} z-50`}>
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
          >
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />

            {/* Notification badge */}
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </motion.div>
            )}

            {/* Important notification indicator */}
            {importantCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center"
              />
            )}
          </motion.button>
        </div>

        {/* Expanded Notification Center */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{
                opacity: 0,
                scale: isMobile ? 1 : 0.95,
                y: isMobile ? 10 : -10,
                x: isMobile ? 0 : 0
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                x: 0
              }}
              exit={{
                opacity: 0,
                scale: isMobile ? 1 : 0.95,
                y: isMobile ? 10 : -10,
                x: 0
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={`
                absolute ${isMobile ? 'bottom-full mb-3' : 'top-full mt-3'}
                ${isMobile ? 'left-4 right-4' : 'right-0'}
                ${mobileMaxWidth}
                bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                rounded-xl shadow-2xl backdrop-blur-sm z-40
                ${isMobile ? 'max-h-[60vh]' : 'max-h-96'}
                safe-area-inset
              `}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {/* Settings button */}
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                    aria-label="Notification settings"
                  >
                    <Settings className="w-4 h-4" />
                  </button>

                  {/* Filter button */}
                  <div className="relative">
                    <button
                      onClick={() => setFilter(filter === 'all' ? 'unread' : filter === 'unread' ? 'important' : 'all')}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                      aria-label="Filter notifications"
                    >
                      <Filter className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Actions */}
                  <NotificationActions
                    onClearAll={clearAllNotifications}
                    onClearByType={clearNotificationsByType}
                    notificationCount={notifications.length}
                  />
                </div>
              </div>

              {/* Filter tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                {[
                  { key: 'all', label: 'All', count: notifications.length },
                  { key: 'unread', label: 'Unread', count: unreadCount },
                  { key: 'important', label: 'Important', count: importantCount }
                ].map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key as any)}
                    className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                      filter === key
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    {label} {count > 0 && `(${count})`}
                  </button>
                ))}
              </div>

              {/* Settings panel */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-b border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <div className="p-4 space-y-3">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Settings</h4>

                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={soundEnabled}
                            onChange={(e) => setSoundEnabled(e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-700 dark:text-gray-300">Sound notifications</span>
                        </label>

                        <label className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={desktopEnabled}
                            onChange={(e) => setDesktopEnabled(e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-700 dark:text-gray-300">Desktop notifications</span>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Notifications list */}
              <div className="max-h-96 overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-gray-400 dark:text-gray-500 mb-2">
                      <Bell className="w-8 h-8 mx-auto" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {filter === 'all' ? 'No notifications yet' :
                       filter === 'unread' ? 'No unread notifications' :
                       'No important notifications'}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onClose={removeNotification}
                      />
                    ))}
                  </div>
                )}

                {/* Load more indicator */}
                {hasMore && (
                  <div className="p-4 text-center border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {/* Load more logic */}}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                    >
                      Load more notifications...
                    </button>
                  </div>
                )}
              </div>

              {/* Footer with quick actions */}
              {notifications.length > 0 && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={clearAllNotifications}
                      className="flex items-center space-x-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Clear all</span>
                    </button>

                    <button
                      onClick={() => setIsExpanded(false)}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Click outside to close */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  )
}

// Individual notification item in the expanded view
function NotificationItem({
  notification,
  onClose
}: {
  notification: Notification
  onClose: (id: string) => void
}) {
  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const handleAction = () => {
    if (notification.action) {
      notification.action.onClick()
    }
  }

  return (
    <div className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
      !notification.data?.read ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : ''
    }`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {notification.type === 'success' && <div className="w-2 h-2 bg-green-500 rounded-full" />}
          {notification.type === 'error' && <div className="w-2 h-2 bg-red-500 rounded-full" />}
          {notification.type === 'warning' && <div className="w-2 h-2 bg-yellow-500 rounded-full" />}
          {notification.type === 'info' && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
          {notification.type === 'system' && <div className="w-2 h-2 bg-purple-500 rounded-full" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {notification.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {notification.message}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {formatTimestamp(notification.timestamp)}
              </p>
            </div>

            <button
              onClick={() => onClose(notification.id)}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
              aria-label="Close notification"
            >
              ×
            </button>
          </div>

          {notification.action && (
            <div className="mt-3">
              <button
                onClick={handleAction}
                className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {notification.action.label}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
