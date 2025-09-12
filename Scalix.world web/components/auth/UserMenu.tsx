'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '../ui/Button'

interface UserMenuProps {
  user: {
    id: string
    email: string
    name?: string
    avatar?: string
    plan: 'free' | 'pro' | 'team' | 'enterprise'
  }
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free':
        return 'bg-gray-100 text-gray-800'
      case 'pro':
        return 'bg-primary-100 text-primary-800'
      case 'team':
        return 'bg-purple-100 text-purple-800'
      case 'enterprise':
        return 'bg-gold-100 text-gold-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {/* Avatar */}
        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name || user.email}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <span className="text-white font-medium text-sm">
              {(user.name || user.email).charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* User info */}
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-gray-900">
            {user.name || user.email.split('@')[0]}
          </div>
          <div className="text-xs text-gray-500 capitalize">
            {user.plan} Plan
          </div>
        </div>

        {/* Dropdown arrow */}
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || user.email}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <span className="text-white font-medium">
                      {(user.name || user.email).charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {user.name || user.email.split('@')[0]}
                  </div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getPlanColor(user.plan)}`}>
                    {user.plan} Plan
                  </div>
                </div>
              </div>
            </div>

            <div className="py-2">
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/auth/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Profile Settings
              </Link>
              <Link
                href="/dashboard/billing"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Billing & Plans
              </Link>
              <Link
                href="/dashboard/usage"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Usage & Analytics
              </Link>
              {user.plan === 'enterprise' && (
                <Link
                  href="/admin"
                  className="block px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
            </div>

            <div className="border-t border-gray-200 py-2">
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
