'use client'

import { useAuth } from '@/hooks/useAuth'
import { AlertTriangle, Shield, User } from 'lucide-react'

export function DevModeIndicator() {
  const { user } = useAuth()

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-yellow-800 flex items-center">
              <Shield className="w-4 h-4 mr-1" />
              Development Mode Active
            </h4>
            <div className="mt-2 text-sm text-yellow-700">
              <p className="mb-1">
                <strong>Auto-authenticated as:</strong>
              </p>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span className="font-medium">{user?.name || 'Admin'}</span>
                <span className="text-xs bg-yellow-200 px-2 py-1 rounded">
                  {user?.plan || 'enterprise'}
                </span>
              </div>
              <p className="mt-2 text-xs">
                All authentication is bypassed for development.
                Sign in with any credentials to test features.
              </p>
            </div>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={() => {
            const el = document.querySelector('[data-dev-indicator]')
            if (el) el.style.display = 'none'
          }}
          className="absolute top-2 right-2 text-yellow-600 hover:text-yellow-800"
          aria-label="Close development indicator"
        >
          ×
        </button>
      </div>
    </div>
  )
}
