'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
// import { AdvancedAnalytics } from '@/components/AdvancedAnalytics'
import { OnboardingProvider } from '@/components/onboarding/OnboardingProvider'
import { OnboardingTooltip } from '@/components/onboarding/OnboardingTooltip'
import { WelcomeModal } from '@/components/onboarding/WelcomeModal'
import { QUICK_TOUR_STEPS } from '@/components/onboarding/OnboardingSteps'
import { HelpButton } from '@/components/HelpButton'
import { motion } from 'framer-motion'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
// import { useNotificationActions, useErrorNotifications, usePerformanceNotifications } from '@/components/notifications/NotificationService'
// import { notificationPresets } from '@/components/notifications/NotificationContext'
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  Users,
  Activity,
  Zap,
  RefreshCw,
  Download,
  Share2,
  Settings,
  Bell
} from 'lucide-react'

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('24h')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Notification hooks - temporarily disabled to fix 500 error
  const notifySuccess = () => {}
  const notifyError = () => {}
  const notifyWarning = () => {}
  const notifyInfo = () => {}
  const notifySystem = () => {}
  const handleError = () => {}
  const handleNetworkError = () => {}
  const trackOperation = () => {}
  const trackMemoryUsage = () => {}

  const handleRefresh = async () => {
    const startTime = Date.now()
    setIsRefreshing(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Track performance
      trackOperation('Dashboard refresh', startTime)

      // Show success notification
      notifySuccess(
        'Dashboard Updated',
        'All metrics and data have been refreshed successfully.',
        { duration: 3000 }
      )

      setIsRefreshing(false)
    } catch (error) {
      handleNetworkError(error, 'refresh dashboard')
      setIsRefreshing(false)
    }
  }

  // Demo notification functions for testing
  const showDemoNotifications = () => {
    // Success notification
    notifySuccess(
      'Model Training Complete',
      'Your AI model has been successfully trained and is ready for use.',
      {
        action: {
          label: 'Test Model',
          onClick: () => notifyInfo('Model Test', 'Running model validation tests...')
        }
      }
    )

    // Warning notification
    setTimeout(() => {
      notifyWarning(
        'High Resource Usage',
        'Your current plan is using 85% of available resources.',
        {
          action: {
            label: 'Upgrade Plan',
            onClick: () => notifyInfo('Plan Upgrade', 'Redirecting to billing...')
          }
        }
      )
    }, 1000)

    // System notification
    setTimeout(() => {
      notifySystem(
        'Scheduled Maintenance',
        'System maintenance is scheduled for tonight from 2:00 AM to 4:00 AM EST.',
        { persistent: true }
      )
    }, 2000)
  }

  // Check memory usage on mount
  useEffect(() => {
    trackMemoryUsage()
  }, [trackMemoryUsage])

  return (
    <OnboardingProvider steps={QUICK_TOUR_STEPS}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header/Navigation Landmark */}
        <header id="navigation" role="banner">
          <Navigation />
        </header>

        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4">
              <Breadcrumb items={[{ label: 'Dashboard' }]} className="mb-4" />

              <div className="flex items-center justify-between">
                <div>
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-3xl font-bold text-gray-900"
                  >
                    AI Development Dashboard
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-600 mt-1"
                  >
                    Build, deploy, and manage your AI applications with powerful development tools
                  </motion.p>
                </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>

              <Button
                onClick={showDemoNotifications}
                className="flex items-center bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Bell className="w-4 h-4 mr-2" />
                Demo Notifications
              </Button>

              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Button>

              <Button variant="outline" className="flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>

              <Button variant="outline" className="flex items-center">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>

              <Button variant="outline" className="flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">15,420</div>
              <div className="text-gray-600 text-sm">Active Subscriptions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">8,920</div>
              <div className="text-gray-600 text-sm">Monthly API Calls</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">$2,847</div>
              <div className="text-gray-600 text-sm">Monthly Spend</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-600">99.9%</div>
              <div className="text-gray-600 text-sm">Platform Uptime</div>
            </div>
          </div>
        </div>
      </motion.div>

          {/* Main Dashboard Content */}
        <main id="main-content" role="main" tabIndex={-1} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-onboarding="dashboard">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/chat">
                  <Button className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700">
                    <Activity className="w-4 h-4" />
                    <span>AI Chat</span>
                  </Button>
                </Link>
                <Link href="/dashboard/api-keys">
                  <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>API Keys</span>
                  </Button>
                </Link>
                <Link href="/dashboard/billing">
                  <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
                    <BarChart3 className="w-4 h-4" />
                    <span>Billing</span>
                  </Button>
                </Link>
                <Link href="/docs">
                  <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Docs</span>
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <Link href="/dashboard/usage">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">API key "Production App" created</span>
                  <span className="text-gray-400 ml-auto">2 hours ago</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">15,420 API requests processed</span>
                  <span className="text-gray-400 ml-auto">4 hours ago</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-600">Billing cycle started</span>
                  <span className="text-gray-400 ml-auto">1 day ago</span>
                </div>
              </div>
            </motion.div>

          {/* Temporarily disabled AdvancedAnalytics to fix loading issues */}
      {/* <AdvancedAnalytics /> */}
        </main>

        {/* API Performance Section */}
        <div data-onboarding="performance" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
          >
            <div className="text-center mb-8">
              <Zap className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">API Performance Overview</h3>
              <p className="text-gray-600">
                Real-time performance metrics for your AI API subscriptions
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">47ms</div>
                <div className="text-gray-600">Avg Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">15,420</div>
                <div className="text-gray-600">Total Requests</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-600 mb-2">$2,847</div>
                <div className="text-gray-600">Monthly Cost</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Landmark */}
        <footer id="footer" role="contentinfo">
          <Footer />
        </footer>

        {/* Onboarding Components */}
        <OnboardingTooltip />
        <WelcomeModal />
        <HelpButton />

        {/* Screen reader announcements */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Scalix Analytics Dashboard loaded successfully
        </div>
      </div>
    </OnboardingProvider>
  )
}
