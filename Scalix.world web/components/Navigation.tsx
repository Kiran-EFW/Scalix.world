'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from './ui/Button'
import { SignInModal } from './auth/SignInModal'
import { ProModeSelector } from './pro/ProModeSelector'
import { UserMenu } from './auth/UserMenu'
import { useAuth } from '@/hooks/useAuth'
import { motion } from 'framer-motion'

export function Navigation() {
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const { user } = useAuth()

  const hasProKey = user?.plan === 'pro' || user?.plan === 'enterprise'

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Scalix</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </Link>
              <Link href="/chat" className="text-gray-600 hover:text-gray-900 transition-colors">
                AI Chat
              </Link>
              {user && (
                <Link href="/dashboard/api-keys" className="text-gray-600 hover:text-gray-900 transition-colors">
                  API Keys
                </Link>
              )}
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </Link>
              <Link href="/docs" className="text-gray-600 hover:text-gray-900 transition-colors">
                Docs
              </Link>
              <Link href="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">
                Blog
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </Link>
              <Link href="/community" className="text-gray-600 hover:text-gray-900 transition-colors">
                Community
              </Link>
            </div>

            {/* Auth & Pro Buttons */}
            <div className="flex items-center space-x-4">
              {/* Show Pro selector if user is logged in */}
              {user && (
                <ProModeSelector
                  settings={user}
                  onSettingsChange={(updates) => {
                    // Handle settings update
                    console.log('Settings update:', updates)
                  }}
                  hasProKey={hasProKey}
                />
              )}

              {user ? (
                <UserMenu user={user} />
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setIsSignInOpen(true)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => setIsSignInOpen(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white"
                  >
                    Get Started
                  </Button>
                </>
              )}

              {/* Mobile Menu Button */}
              <button className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
      />
    </>
  )
}