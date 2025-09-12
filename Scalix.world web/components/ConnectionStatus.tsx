'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wifi, WifiOff, AlertCircle, CheckCircle } from 'lucide-react'
import { realTimeDataService } from '@/lib/api'

interface ConnectionStatusProps {
  className?: string
  showDetails?: boolean
}

export function ConnectionStatus({ className = '', showDetails = false }: ConnectionStatusProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let unsubscribe: (() => void) | null = null

    const initializeConnection = async () => {
      try {
        // Subscribe to connection status updates
        unsubscribe = realTimeDataService.subscribe('connection', (status) => {
          setIsConnected(status.connected)
          if (!status.connected && status.error) {
            setConnectionError(status.error.message || 'Connection lost')
            setRetryCount(prev => prev + 1)
          } else {
            setConnectionError(null)
            setRetryCount(0)
          }
        })

        // Check initial connection status
        const initialStatus = realTimeDataService.getConnectionStatus()
        setIsConnected(initialStatus)
      } catch (error) {
        console.error('Failed to initialize connection status:', error)
        setConnectionError('Failed to check connection')
      }
    }

    initializeConnection()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  if (!showDetails) {
    // Simple connection indicator
    return (
      <div className={`inline-flex items-center space-x-2 ${className}`}>
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
        <span className={`text-xs font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
    )
  }

  // Detailed connection status with animation
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`inline-flex items-center space-x-3 px-4 py-2 rounded-full border backdrop-blur-sm ${
          isConnected
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-red-50 border-red-200 text-red-700'
        } ${className}`}
      >
        <motion.div
          animate={{ scale: isConnected ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 2, repeat: isConnected ? Infinity : 0 }}
          className="flex items-center space-x-2"
        >
          {isConnected ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600" />
          )}
          <span className="text-sm font-medium">
            {isConnected ? 'API Connected' : 'API Disconnected'}
          </span>
        </motion.div>

        {!isConnected && connectionError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded"
          >
            {connectionError}
          </motion.div>
        )}

        {retryCount > 0 && !isConnected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-orange-600"
          >
            Retry #{retryCount}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

// Error boundary component for handling API errors gracefully
export function APIErrorBoundary({
  children,
  fallback
}: {
  children: React.ReactNode
  fallback: React.ReactNode
}) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('API Error Boundary caught error:', event.error)
      setError(event.error)
      setHasError(true)
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  if (hasError) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
      >
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h3>
        <p className="text-red-600 mb-4">
          {error?.message || 'An unexpected error occurred while loading data.'}
        </p>
        <button
          onClick={() => {
            setHasError(false)
            setError(null)
            window.location.reload()
          }}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </motion.div>
    )
  }

  return <>{children}</>
}
