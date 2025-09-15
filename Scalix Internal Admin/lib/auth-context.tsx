'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'moderator' | 'viewer'
  avatar?: string
  lastLogin: Date
  permissions: string[]
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

// Mock authentication - in a real app, this would connect to your backend
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@scalix.world',
    name: 'Scalix Admin',
    role: 'admin',
    lastLogin: new Date(),
    permissions: ['read', 'write', 'delete', 'manage_users', 'manage_tiers', 'view_analytics', 'system_settings']
  },
  {
    id: '2',
    email: 'moderator@scalix.world',
    name: 'Scalix Moderator',
    role: 'moderator',
    lastLogin: new Date(Date.now() - 86400000), // 1 day ago
    permissions: ['read', 'write', 'manage_users', 'view_analytics']
  },
  {
    id: '3',
    email: 'viewer@scalix.world',
    name: 'Scalix Viewer',
    role: 'viewer',
    lastLogin: new Date(Date.now() - 3600000), // 1 hour ago
    permissions: ['read', 'view_analytics']
  }
]

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('scalix_user')
        if (savedUser) {
          const userData = JSON.parse(savedUser)
          // Verify the session is still valid (not expired)
          const sessionExpiry = localStorage.getItem('scalix_session_expiry')
          if (sessionExpiry && new Date(sessionExpiry) > new Date()) {
            setUser(userData)
          } else {
            // Session expired, clear it
            localStorage.removeItem('scalix_user')
            localStorage.removeItem('scalix_session_expiry')
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    try {
      // Mock authentication logic
      const foundUser = mockUsers.find(u => u.email === email)

      if (foundUser && password === 'password123') { // Simple mock password
        const sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

        setUser(foundUser)
        localStorage.setItem('scalix_user', JSON.stringify(foundUser))
        localStorage.setItem('scalix_session_expiry', sessionExpiry.toISOString())

        setIsLoading(false)
        return true
      } else {
        setIsLoading(false)
        return false
      }
    } catch (error) {
      console.error('Login failed:', error)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('scalix_user')
    localStorage.removeItem('scalix_session_expiry')
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
