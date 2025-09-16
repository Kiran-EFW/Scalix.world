'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wifi, WifiOff, AlertCircle, CheckCircle } from 'lucide-react'
import { useRealtimeStatus } from '@/hooks/useRealtimeData'

interface RealtimeStatusProps {
  className?: string
  showDetails?: boolean
}

export function RealtimeStatus({ className = '', showDetails = false }: RealtimeStatusProps) {
  const { isConnected, isFirestoreAvailable, activeListeners } = useRealtimeStatus()
  const [showTooltip, setShowTooltip] = useState(false)

  const getStatusColor = () => {
    if (isConnected && isFirestoreAvailable) return 'text-green-600'
    if (isConnected && !isFirestoreAvailable) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStatusIcon = () => {
    if (isConnected && isFirestoreAvailable) return CheckCircle
    if (isConnected && !isFirestoreAvailable) return AlertCircle
    return WifiOff
  }

  const getStatusText = () => {
    if (isConnected && isFirestoreAvailable) return 'Real-time Connected'
    if (isConnected && !isFirestoreAvailable) return 'Mock Real-time'
    return 'Real-time Disconnected'
  }

  const getStatusDescription = () => {
    if (isConnected && isFirestoreAvailable) {
      return `Connected to Firestore with ${activeListeners.length} active listeners`
    }
    if (isConnected && !isFirestoreAvailable) {
      return 'Using mock real-time updates (Firestore not configured)'
    }
    return 'Real-time updates are disabled'
  }

  const StatusIcon = getStatusIcon()

  return (
    <div className={`relative ${className}`}>
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <motion.div
          animate={{ 
            scale: isConnected ? [1, 1.1, 1] : 1,
            opacity: isConnected ? [1, 0.7, 1] : 0.5
          }}
          transition={{ 
            duration: 2, 
            repeat: isConnected ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          <StatusIcon className={`w-4 h-4 ${getStatusColor()}`} />
        </motion.div>
        
        {showDetails && (
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        )}
      </div>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50"
          >
            <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg max-w-xs">
              <div className="font-medium mb-1">{getStatusText()}</div>
              <div className="text-gray-300">{getStatusDescription()}</div>
              {activeListeners.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-700">
                  <div className="text-gray-400">Active Listeners:</div>
                  <div className="text-gray-300">{activeListeners.length}</div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Compact version for headers
export function RealtimeStatusCompact() {
  return <RealtimeStatus showDetails={false} />
}

// Full version with text
export function RealtimeStatusFull() {
  return <RealtimeStatus showDetails={true} />
}

// Connection status badge
export function RealtimeStatusBadge() {
  const { isConnected, isFirestoreAvailable } = useRealtimeStatus()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        isConnected && isFirestoreAvailable
          ? 'bg-green-100 text-green-800'
          : isConnected && !isFirestoreAvailable
          ? 'bg-yellow-100 text-yellow-800'
          : 'bg-red-100 text-red-800'
      }`}
    >
      <motion.div
        animate={{ 
          scale: isConnected ? [1, 1.2, 1] : 1,
        }}
        transition={{ 
          duration: 1.5, 
          repeat: isConnected ? Infinity : 0,
          ease: "easeInOut"
        }}
        className="w-2 h-2 rounded-full mr-1.5"
        style={{
          backgroundColor: isConnected && isFirestoreAvailable
            ? '#10b981'
            : isConnected && !isFirestoreAvailable
            ? '#f59e0b'
            : '#ef4444'
        }}
      />
      {isConnected && isFirestoreAvailable
        ? 'Live'
        : isConnected && !isFirestoreAvailable
        ? 'Mock'
        : 'Offline'
      }
    </motion.div>
  )
}
