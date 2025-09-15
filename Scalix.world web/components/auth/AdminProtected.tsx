'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { isAdmin, isSuperAdmin } from '@/types'
import { Shield, AlertTriangle, Loader2 } from 'lucide-react'

interface AdminProtectedProps {
  children: React.ReactNode
  requiredPermission?: 'admin' | 'super_admin'
  fallback?: React.ReactNode
}

export default function AdminProtected({
  children,
  requiredPermission = 'admin',
  fallback
}: AdminProtectedProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [showUnauthorized, setShowUnauthorized] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      const hasAccess = requiredPermission === 'super_admin'
        ? isSuperAdmin(user)
        : isAdmin(user)

      if (!hasAccess) {
        setShowUnauthorized(true)
        // Redirect after showing error
        const timer = setTimeout(() => {
          router.push('/auth/signin?error=Admin access required')
        }, 3000)
        return () => clearTimeout(timer)
      }
    }
  }, [user, isLoading, requiredPermission, router])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  // Show unauthorized message
  if (showUnauthorized) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You don't have permission to access this admin area.
              {requiredPermission === 'super_admin' && ' Super admin privileges are required.'}
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Redirecting to sign-in...</p>
                  <p>Please contact your system administrator if you believe this is an error.</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => router.push('/')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  // User has access, render children
  return <>{children}</>
}

// Hook for checking admin permissions in components
export function useAdminAccess(requiredPermission: 'admin' | 'super_admin' = 'admin') {
  const { user } = useAuth()
  const hasAccess = requiredPermission === 'super_admin'
    ? isSuperAdmin(user)
    : isAdmin(user)

  return {
    hasAccess,
    user,
    isAdmin: isAdmin(user),
    isSuperAdmin: isSuperAdmin(user)
  }
}
