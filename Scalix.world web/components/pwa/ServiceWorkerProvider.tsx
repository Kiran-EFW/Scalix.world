'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface ServiceWorkerContextType {
  registration: ServiceWorkerRegistration | null
  isUpdating: boolean
  updateAvailable: boolean
  error: string | null
  updateApp: () => void
}

const ServiceWorkerContext = createContext<ServiceWorkerContextType | undefined>(undefined)

export const useServiceWorker = () => {
  const context = useContext(ServiceWorkerContext)
  if (!context) {
    throw new Error('useServiceWorker must be used within a ServiceWorkerProvider')
  }
  return context
}

interface ServiceWorkerProviderProps {
  children: ReactNode
  onUpdateAvailable?: () => void
  onUpdateComplete?: () => void
}

export function ServiceWorkerProvider({
  children,
  onUpdateAvailable,
  onUpdateComplete
}: ServiceWorkerProviderProps) {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      console.log('Service workers not supported')
      return
    }

    const registerServiceWorker = async () => {
      try {
        console.log('Registering service worker...')

        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        })

        console.log('Service Worker registered:', registration)

        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            console.log('New service worker found')

            newWorker.addEventListener('statechange', () => {
              console.log('Service worker state:', newWorker.state)

              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New version available
                  console.log('New version available')
                  setUpdateAvailable(true)
                  setRegistration(registration)
                  onUpdateAvailable?.()
                } else {
                  // First time installation
                  console.log('Service worker installed for first time')
                }
              }
            })
          }
        })

        // Handle controller change (new SW activated)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('Service worker controller changed - reloading')
          setIsUpdating(false)
          setUpdateAvailable(false)
          onUpdateComplete?.()
          window.location.reload()
        })

        // Handle messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          console.log('Message from service worker:', event.data)

          if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
            setUpdateAvailable(true)
            onUpdateAvailable?.()
          }
        })

        setRegistration(registration)

      } catch (error) {
        console.error('Service Worker registration failed:', error)
        setError('Failed to register service worker')
      }
    }

    registerServiceWorker()

    // Cleanup function
    return () => {
      if (registration) {
        // Don't unregister on component unmount in production
        // registration.unregister()
      }
    }
  }, [onUpdateAvailable, onUpdateComplete])

  const updateApp = () => {
    if (!registration) return

    setIsUpdating(true)

    // Tell the new service worker to skip waiting
    registration.waiting?.postMessage({ type: 'SKIP_WAITING' })

    // Or if we have an installing worker
    registration.installing?.postMessage({ type: 'SKIP_WAITING' })
  }

  const value: ServiceWorkerContextType = {
    registration,
    isUpdating,
    updateAvailable,
    error,
    updateApp
  }

  return (
    <ServiceWorkerContext.Provider value={value}>
      {children}
    </ServiceWorkerContext.Provider>
  )
}

// Hook for checking PWA installation status
export function usePWAInstall() {
  const [canInstall, setCanInstall] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    const checkInstallability = () => {
      // Check if app is already installed
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          (window.navigator as any).standalone === true

      setIsInstalled(isStandalone)

      // Check if installation is possible
      const canInstall = 'beforeinstallprompt' in window && !isStandalone
      setCanInstall(canInstall)
    }

    checkInstallability()

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setCanInstall(true)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setCanInstall(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    mediaQuery.addEventListener('change', checkInstallability)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      mediaQuery.removeEventListener('change', checkInstallability)
    }
  }, [])

  const install = async () => {
    if (!deferredPrompt) return false

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        setIsInstalled(true)
        setCanInstall(false)
        setDeferredPrompt(null)
        return true
      }

      return false
    } catch (error) {
      console.error('PWA installation failed:', error)
      return false
    }
  }

  return {
    canInstall,
    isInstalled,
    install
  }
}

// Hook for offline/online status
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [connectionType, setConnectionType] = useState<string>('unknown')

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Get connection type if available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      if (connection) {
        setConnectionType(connection.effectiveType || 'unknown')
        connection.addEventListener('change', () => {
          setConnectionType(connection.effectiveType || 'unknown')
        })
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return {
    isOnline,
    connectionType,
    isSlowConnection: connectionType === 'slow-2g' || connectionType === '2g'
  }
}

// Hook for cache status
export function useCacheStatus() {
  const [cacheSize, setCacheSize] = useState<number>(0)
  const [isCachingEnabled, setIsCachingEnabled] = useState(false)

  useEffect(() => {
    const checkCacheStatus = async () => {
      if (!('caches' in window)) return

      try {
        const cacheNames = await caches.keys()
        let totalSize = 0

        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName)
          const keys = await cache.keys()

          for (const request of keys) {
            try {
              const response = await cache.match(request)
              if (response) {
                const blob = await response.blob()
                totalSize += blob.size
              }
            } catch (error) {
              // Skip problematic cache entries
            }
          }
        }

        setCacheSize(totalSize)
        setIsCachingEnabled(true)
      } catch (error) {
        console.error('Failed to check cache status:', error)
        setIsCachingEnabled(false)
      }
    }

    checkCacheStatus()

    // Check cache status periodically
    const interval = setInterval(checkCacheStatus, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const clearCache = async () => {
    if (!('caches' in window)) return false

    try {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      )
      setCacheSize(0)
      return true
    } catch (error) {
      console.error('Failed to clear cache:', error)
      return false
    }
  }

  const formatCacheSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return {
    cacheSize,
    isCachingEnabled,
    clearCache,
    formattedCacheSize: formatCacheSize(cacheSize)
  }
}
