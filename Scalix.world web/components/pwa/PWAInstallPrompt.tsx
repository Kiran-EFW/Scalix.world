'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Smartphone, Monitor, Zap } from 'lucide-react'
import { useMobile } from '../mobile/MobileProvider'
import { useServiceWorker } from './ServiceWorkerProvider'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallPrompt() {
  const { isMobile } = useMobile()
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      // Check if running in standalone mode (PWA)
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://')

      setIsStandalone(isStandaloneMode)

      // Check if app is installed
      const isInstalledApp = isStandaloneMode ||
        window.matchMedia('(display-mode: standalone)').matches

      setIsInstalled(isInstalledApp)
    }

    checkInstalled()

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Show prompt after a delay and some user interaction
      setTimeout(() => {
        if (!isInstalled && !isStandalone) {
          setShowPrompt(true)
        }
      }, 30000) // Show after 30 seconds of usage
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    mediaQuery.addEventListener('change', checkInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      mediaQuery.removeEventListener('change', checkInstalled)
    }
  }, [isInstalled, isStandalone])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
        setIsInstalled(true)
      } else {
        console.log('User dismissed the install prompt')
      }

      setDeferredPrompt(null)
      setShowPrompt(false)
    } catch (error) {
      console.error('Error during installation:', error)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Remember user dismissed to not show again for some time
    if (typeof window !== 'undefined') {
      localStorage.setItem('pwa-install-dismissed', Date.now().toString())
    }
    setLastDismissed(Date.now().toString())
  }

  // Don't show if already installed or running standalone
  if (isInstalled || isStandalone) {
    return null
  }

  // Check if user recently dismissed - use state instead of direct localStorage
  const [lastDismissed, setLastDismissed] = useState<string | null>(null)

  useEffect(() => {
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem('pwa-install-dismissed')
      setLastDismissed(dismissed)
    }
  }, [])

  // Don't show if recently dismissed
  if (lastDismissed) {
    const daysSinceDismissed = (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60 * 24)
    if (daysSinceDismissed < 7) { // Don't show again for 7 days
      return null
    }
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleDismiss}
          />

          {/* Install Prompt */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 20
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: 20
            }}
            className={`fixed z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 max-w-sm mx-4 ${
              isMobile
                ? 'bottom-20 left-4 right-4'
                : 'top-4 right-4'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Install Scalix AI
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Add to your home screen
                  </p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close install prompt"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Faster Loading
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Instant app startup
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  {isMobile ? (
                    <Smartphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <Monitor className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Native Experience
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Works offline, push notifications
                  </p>
                </div>
              </div>
            </div>

            {/* Install Button */}
            <button
              onClick={handleInstall}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Install App
            </button>

            {/* Alternative for browsers without prompt support */}
            {!deferredPrompt && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-300 text-center">
                  To install, use your browser's "Add to Home Screen" option from the menu
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// PWA Update Prompt Component
interface PWAUpdatePromptProps {
  registration: ServiceWorkerRegistration | null
}

export function PWAUpdatePrompt({ registration }: PWAUpdatePromptProps) {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false)
  const [newWorker, setNewWorker] = useState<ServiceWorker | null>(null)

  useEffect(() => {
    if (!registration) return

    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing
      if (newWorker) {
        setNewWorker(newWorker)

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version available
            setShowUpdatePrompt(true)
          }
        })
      }
    })
  }, [registration])

  const handleUpdate = () => {
    if (newWorker) {
      newWorker.postMessage({ type: 'SKIP_WAITING' })
      setShowUpdatePrompt(false)
      // Reload to get the new version
      window.location.reload()
    }
  }

  const handleDismiss = () => {
    setShowUpdatePrompt(false)
  }

  if (!showUpdatePrompt) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-4 left-4 right-4 z-50 bg-blue-600 text-white p-4 rounded-lg shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <p className="font-medium">Update Available</p>
              <p className="text-sm text-blue-100">A new version of Scalix AI is ready</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDismiss}
              className="px-3 py-1 text-sm bg-white bg-opacity-20 hover:bg-opacity-30 rounded transition-colors"
            >
              Later
            </button>
            <button
              onClick={handleUpdate}
              className="px-3 py-1 text-sm bg-white text-blue-600 hover:bg-blue-50 rounded transition-colors font-medium"
            >
              Update
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// PWA Update Prompt Wrapper (uses ServiceWorker context)
export function PWAUpdatePromptWrapper() {
  const { registration } = useServiceWorker()

  return <PWAUpdatePrompt registration={registration} />
}

// PWA Status Indicator Component
export function PWAStatusIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isStandalone, setIsStandalone] = useState(false)
  const [serviceWorkerStatus, setServiceWorkerStatus] = useState<'installing' | 'installed' | 'error' | null>(null)

  useEffect(() => {
    // Check if running in standalone mode
    const checkStandalone = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone === true
      setIsStandalone(standalone)
    }

    checkStandalone()

    // Listen for online/offline
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Listen for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        setServiceWorkerStatus('installed')
      }).catch(() => {
        setServiceWorkerStatus('error')
      })
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const getStatusColor = () => {
    if (!isOnline) return 'bg-red-500'
    if (serviceWorkerStatus === 'error') return 'bg-yellow-500'
    if (isStandalone) return 'bg-green-500'
    return 'bg-blue-500'
  }

  const getStatusText = () => {
    if (!isOnline) return 'Offline'
    if (serviceWorkerStatus === 'error') return 'PWA Error'
    if (isStandalone) return 'Installed'
    return 'Online'
  }

  return (
    <div className="fixed bottom-4 right-4 z-30">
      <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-2 shadow-lg">
        <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
          {getStatusText()}
        </span>
      </div>
    </div>
  )
}
