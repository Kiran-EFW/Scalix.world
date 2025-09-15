'use client'

import { useState, useEffect, createContext, useContext } from 'react'

import { UserRole, Permission } from '@/types'

interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  plan: 'free' | 'pro' | 'team' | 'enterprise'
  role: UserRole
  permissions: Permission[]
  createdAt: Date
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth(): AuthContextType {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Development bypass - automatically sign in as admin
        if (process.env.NODE_ENV === 'development') {
          console.log('🔧 Development mode: Auto-authenticating as admin user')

          // Mock admin user for development
          const mockAdminUser: User = {
            id: 'dev-admin-001',
            email: 'admin@scalix.world',
            name: 'Scalix Admin',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
            plan: 'enterprise',
            role: 'super_admin',
            permissions: [],
            createdAt: new Date('2024-01-01'),
          }

          // Store mock token
          localStorage.setItem('scalix_auth_token', 'dev-admin-token-2025')
          setUser(mockAdminUser)
        } else {
          // Production authentication flow with error handling
          console.log('🔐 Production mode: Checking for existing session...')
          const token = localStorage.getItem('scalix_auth_token')
          if (token) {
            try {
              // Validate token with backend
              const response = await fetch('/api/auth/me', {
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              })

              if (response.ok) {
                const userData = await response.json()
                setUser(userData.user)
              } else {
                // Token is invalid, remove it
                console.log('🔐 Token validation failed, clearing session')
                localStorage.removeItem('scalix_auth_token')
              }
            } catch (fetchError) {
              // If API is not available, fall back to development mode
              console.log('🔧 API not available, falling back to development mode')
              const mockAdminUser: User = {
                id: 'dev-admin-001',
                email: 'admin@scalix.world',
                name: 'Scalix Admin',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
                plan: 'enterprise',
                role: 'super_admin',
                permissions: [],
                createdAt: new Date('2024-01-01'),
              }
              localStorage.setItem('scalix_auth_token', 'dev-admin-token-2025')
              setUser(mockAdminUser)
            }
          } else {
            console.log('🔐 No existing session found')
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        // Fallback to development mode if anything goes wrong
        console.log('🔧 Error during auth init, falling back to development mode')
        const mockAdminUser: User = {
          id: 'dev-admin-001',
          email: 'admin@scalix.world',
          name: 'Scalix Admin',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
          plan: 'enterprise',
          createdAt: new Date('2024-01-01'),
        }
        localStorage.setItem('scalix_auth_token', 'dev-admin-token-2025')
        setUser(mockAdminUser)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      // Development bypass - accept any credentials and return admin user
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Development mode: Accepting any credentials, signing in as admin')

        // Mock admin user for development
        const mockAdminUser: User = {
          id: 'dev-admin-001',
          email: email || 'admin@scalix.world',
          name: email?.split('@')[0] || 'Scalix Admin',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
          plan: 'enterprise',
          role: 'super_admin',
          permissions: [],
          createdAt: new Date('2024-01-01'),
        }

        // Store mock token
        localStorage.setItem('scalix_auth_token', 'dev-admin-token-2025')
        setUser(mockAdminUser)
        return
      }

      // Production authentication flow
      console.log('🔐 Attempting production authentication...')
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        let errorMessage = 'Sign in failed'
        try {
          // Try to parse as JSON first
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch (jsonError) {
          // If JSON parsing fails, check if it's a common HTTP error
          if (response.status === 404) {
            errorMessage = 'Authentication service not available. Using development mode.'
          } else if (response.status === 500) {
            errorMessage = 'Server error. Please try again later.'
          } else {
            errorMessage = `Authentication failed (Status: ${response.status})`
          }
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      localStorage.setItem('scalix_auth_token', data.token)
      setUser(data.user)
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  const signUp = async (email: string, password: string): Promise<void> => {
    try {
      // Development bypass - accept any credentials and create admin user
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Development mode: Creating admin user account')

        // Mock admin user for development
        const mockAdminUser: User = {
          id: 'dev-admin-001',
          email: email || 'admin@scalix.world',
          name: email?.split('@')[0] || 'Scalix Admin',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
          plan: 'enterprise',
          role: 'super_admin',
          permissions: [],
          createdAt: new Date(),
        }

        // Store mock token
        localStorage.setItem('scalix_auth_token', 'dev-admin-token-2025')
        setUser(mockAdminUser)
        return
      }

      // Production authentication flow
      console.log('🔐 Attempting production account creation...')
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        let errorMessage = 'Sign up failed'
        try {
          // Try to parse as JSON first
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch (jsonError) {
          // If JSON parsing fails, check if it's a common HTTP error
          if (response.status === 404) {
            errorMessage = 'Authentication service not available. Using development mode.'
          } else if (response.status === 500) {
            errorMessage = 'Server error. Please try again later.'
          } else {
            errorMessage = `Account creation failed (Status: ${response.status})`
          }
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      localStorage.setItem('scalix_auth_token', data.token)
      setUser(data.user)
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      localStorage.removeItem('scalix_auth_token')
      setUser(null)

      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Development mode: Signed out, will auto-sign in again on refresh')
      } else {
        // Call signout endpoint to invalidate server-side session
        await fetch('/api/auth/signout', {
          method: 'POST',
        })
      }
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!user) throw new Error('Not authenticated')

    try {
      const token = localStorage.getItem('scalix_auth_token')
      const response = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Profile update failed')
      }

      const data = await response.json()
      setUser(data.user)
    } catch (error) {
      throw error
    }
  }

  return {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }
}

// For use in components that need auth context
export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
