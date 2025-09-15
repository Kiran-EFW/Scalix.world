'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  Home,
  BarChart3,
  MessageSquare,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell
} from 'lucide-react'
import { useMobile } from './MobileProvider'

interface MobileNavigationProps {
  children?: React.ReactNode
  showSearch?: boolean
  showNotifications?: boolean
}

const navigationItems = [
  { icon: Home, label: 'Home', href: '/', active: true },
  { icon: BarChart3, label: 'Dashboard', href: '/dashboard', active: false },
  { icon: MessageSquare, label: 'AI Chat', href: '/chat', active: false },
  { icon: Settings, label: 'Settings', href: '/settings', active: false },
  { icon: User, label: 'Profile', href: '/profile', active: false }
]

export function MobileNavigation({ children, showSearch = true, showNotifications = true }: MobileNavigationProps) {
  const { isMobile, isTablet, isTouchDevice } = useMobile()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)

  // Touch gesture handling for navigation
  useEffect(() => {
    if (!isTouchDevice) return

    let startX = 0
    let startY = 0
    const minSwipeDistance = 50

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!startX || !startY) return

      const endX = e.changedTouches[0].clientX
      const endY = e.changedTouches[0].clientY
      const deltaX = endX - startX
      const deltaY = endY - startY

      // Only handle horizontal swipes
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          // Swipe right - go to previous tab
          setSwipeDirection('right')
          setActiveTab(prev => Math.max(0, prev - 1))
        } else {
          // Swipe left - go to next tab
          setSwipeDirection('left')
          setActiveTab(prev => Math.min(navigationItems.length - 1, prev + 1))
        }

        setTimeout(() => setSwipeDirection(null), 300)
      }
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isTouchDevice])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  // Don't show mobile navigation on desktop
  if (!isMobile && !isTablet) {
    return <>{children}</>
  }

  return (
    <>
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 safe-area-inset">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Menu Button */}
          <button
            onClick={toggleMenu}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo/Title */}
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Scalix AI
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {showSearch && (
              <button
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
            {showNotifications && (
              <button
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={closeMenu}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-xl z-50 safe-area-inset"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Navigation
                </h2>
                <button
                  onClick={closeMenu}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Menu Items */}
              <nav className="flex-1 overflow-y-auto py-4">
                <div className="space-y-2 px-4">
                  {navigationItems.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <motion.button
                        key={item.href}
                        onClick={() => {
                          setActiveTab(index)
                          closeMenu()
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                          activeTab === index
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                        {activeTab === index && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="w-2 h-2 bg-blue-500 rounded-full ml-auto"
                          />
                        )}
                      </motion.button>
                    )
                  })}
                </div>

                {/* Quick Actions */}
                <div className="mt-8 px-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 px-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors">
                      <MessageSquare className="w-5 h-5" />
                      <span>New Chat</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors">
                      <BarChart3 className="w-5 h-5" />
                      <span>View Analytics</span>
                    </button>
                  </div>
                </div>
              </nav>

              {/* Menu Footer */}
              <div className="border-t border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">User Name</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">user@example.com</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Tab Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 safe-area-inset">
        <div className="flex items-center justify-around px-2 py-2">
          {navigationItems.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.button
                key={item.href}
                onClick={() => setActiveTab(index)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-[60px] ${
                  activeTab === index
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                whileTap={{ scale: 0.9 }}
                aria-label={item.label}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
                {activeTab === index && (
                  <motion.div
                    layoutId="tabIndicator"
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-full"
                  />
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Swipe indicators for touch devices */}
        {isTouchDevice && (
          <>
            {activeTab > 0 && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={() => setActiveTab(activeTab - 1)}
                className="absolute left-4 bottom-20 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700"
                aria-label="Previous tab"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
            )}
            {activeTab < navigationItems.length - 1 && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={() => setActiveTab(activeTab + 1)}
                className="absolute right-4 bottom-20 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700"
                aria-label="Next tab"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            )}
          </>
        )}
      </nav>

      {/* Main Content with Mobile Adjustments */}
      <main className="pt-16 pb-20 safe-area-inset">
        <div className="min-h-screen">
          {children}
        </div>
      </main>

      {/* Swipe Feedback Animation */}
      <AnimatePresence>
        {swipeDirection && (
          <motion.div
            initial={{
              opacity: 0,
              x: swipeDirection === 'left' ? 20 : -20
            }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: swipeDirection === 'left' ? -20 : 20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
          >
            <div className="bg-black bg-opacity-80 text-white px-4 py-2 rounded-lg">
              {swipeDirection === 'left' ? '→' : '←'} {navigationItems[activeTab]?.label}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Mobile-specific drawer component
interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  position?: 'left' | 'right' | 'bottom'
}

export function MobileDrawer({
  isOpen,
  onClose,
  title,
  children,
  position = 'right'
}: MobileDrawerProps) {
  const { isMobile } = useMobile()

  if (!isMobile) return null

  const positionClasses = {
    left: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' }
    },
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' }
    },
    bottom: {
      initial: { y: '100%' },
      animate: { y: 0 },
      exit: { y: '100%' }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            {...positionClasses[position]}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`
              fixed z-50 bg-white dark:bg-gray-900 shadow-xl safe-area-inset
              ${position === 'bottom'
                ? 'bottom-0 left-0 right-0 max-h-[80vh]'
                : position === 'left'
                ? 'left-0 top-0 bottom-0 w-80 max-w-[85vw]'
                : 'right-0 top-0 bottom-0 w-80 max-w-[85vw]'
              }
            `}
          >
            {/* Header */}
            {(title || (onClose && typeof onClose === 'function')) && (
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                {title && (
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {title}
                  </h3>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
