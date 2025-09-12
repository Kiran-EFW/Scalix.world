'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from './ui/Button'
import { SignInModal } from './auth/SignInModal'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Activity, Users, Zap, TrendingUp, Star, Sparkles, Rocket, Code, Globe, Wifi, WifiOff } from 'lucide-react'
import { realTimeDataService } from '@/lib/api'
import { ConnectionStatus } from './ConnectionStatus'

export function HeroSection() {
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [liveStats, setLiveStats] = useState({
    activeSubscriptions: 8920,
    monthlyApiCalls: 2.8,
    platformUptime: '99.9%',
    avgResponseTime: '1.2s'
  })
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 300], [0, -50])
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8])

  // Initialize real-time data updates
  useEffect(() => {
    let unsubscribe: (() => void) | null = null

    const initializeData = async () => {
      try {
        // Subscribe to connection status
        unsubscribe = realTimeDataService.subscribe('connection', (status) => {
          setIsConnected(status.connected)
        })

        // Subscribe to live stats updates
        realTimeDataService.subscribe('liveStats', (data) => {
          setLiveStats({
            activeSubscriptions: data.activeSubscriptions,
            monthlyApiCalls: data.monthlyApiCalls,
            platformUptime: data.platformUptime,
            avgResponseTime: data.avgResponseTime
          })
          setIsLoading(false)
        })

        // Start real-time updates
        realTimeDataService.startRealTimeUpdates('liveStats', 5000)

        // Initial data fetch
        const initialData = await realTimeDataService.getLiveStats()
        setLiveStats({
          activeSubscriptions: initialData.activeSubscriptions,
          monthlyApiCalls: initialData.monthlyApiCalls,
          platformUptime: initialData.platformUptime,
          avgResponseTime: initialData.avgResponseTime
        })
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to initialize live data:', error)
        setIsLoading(false)
      }
    }

    initializeData()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
      realTimeDataService.stopRealTimeUpdates('liveStats')
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          style={{ y, opacity }}
          className="absolute top-20 left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          style={{ y, opacity }}
          className="absolute top-40 right-32 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          style={{ y, opacity }}
          className="absolute bottom-20 left-1/2 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 270, 180, 0]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Enhanced Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center space-y-4 mb-8"
          >
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50 text-blue-700 text-sm font-semibold shadow-lg backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
              🚀 Real-Time AI Platform - Live Data
              <div className="w-2 h-2 bg-green-500 rounded-full ml-3 animate-pulse"></div>
            </div>

            {/* Connection Status */}
            <ConnectionStatus showDetails={true} />
          </motion.div>

          {/* Enhanced Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight"
          >
            Build AI Apps
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent animate-gradient-x">
              Without Compromising Privacy
            </span>
          </motion.h1>

          {/* Enhanced Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed"
          >
            Scalix is your <span className="font-semibold text-blue-600">comprehensive AI app builder platform</span> that provides tools to build, deploy, and manage AI applications with enterprise-grade features.
            Keep your data private with our local-first approach and powerful development tools.
          </motion.p>

          {/* Enhanced CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
          >
            <Link href="/dashboard">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-5 text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <Rocket className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                Start Building
                <svg className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>

            <Link href="/pricing">
              <Button
                variant="outline"
                size="lg"
                className="group px-10 py-5 text-lg font-semibold border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 rounded-2xl transition-all duration-300 transform hover:scale-105"
              >
                <Code className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                View Plans
              </Button>
            </Link>
          </motion.div>

          {/* Live Stats Display */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-16"
          >
            <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center justify-center mb-3">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-300 h-8 w-16 rounded"></div>
                ) : (
                  liveStats.activeSubscriptions.toLocaleString()
                )}
              </div>
              <div className="text-sm text-gray-600">Active Developers</div>
            </div>
            <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center justify-center mb-3">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-300 h-8 w-12 rounded"></div>
                ) : (
                  `${liveStats.monthlyApiCalls}K`
                )}
              </div>
              <div className="text-sm text-gray-600">Apps Built</div>
            </div>
            <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center justify-center mb-3">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-300 h-8 w-12 rounded"></div>
                ) : (
                  liveStats.platformUptime
                )}
              </div>
              <div className="text-sm text-gray-600">Platform Uptime</div>
            </div>
            <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center justify-center mb-3">
                <Globe className="w-8 h-8 text-cyan-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-300 h-8 w-10 rounded"></div>
                ) : (
                  liveStats.avgResponseTime
                )}
              </div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
          </motion.div>

          {/* Enhanced Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col lg:flex-row items-center justify-center gap-8 text-sm"
          >
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-lg rounded-full px-6 py-3 shadow-lg border border-white/20">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-2 border-white animate-pulse"></div>
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-2 border-white animate-pulse delay-100"></div>
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full border-2 border-white animate-pulse delay-200"></div>
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full border-2 border-white animate-pulse delay-300"></div>
              </div>
              <span className="text-gray-700 font-medium">Join 15,420+ developers</span>
            </div>

            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-lg rounded-full px-6 py-3 shadow-lg border border-white/20">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-gray-700 font-medium">4.9/5 from 1,200+ reviews</span>
            </div>

            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-lg rounded-full px-6 py-3 shadow-lg border border-white/20">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="text-gray-700 font-medium">All systems operational</span>
            </div>
          </motion.div>
        </div>

        {/* Demo Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 relative"
        >
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-2xl blur-3xl"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <div className="ml-4 text-sm text-gray-600">Scalix App Builder</div>
                </div>
              </div>
              <div className="p-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Build Your AI App?</h3>
                  <p className="text-gray-600 mb-6">Download Scalix and start building AI applications locally, for free.</p>
                  <Button
                    onClick={() => setIsSignInOpen(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white"
                  >
                    Download Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
      />
    </section>
  )
}
