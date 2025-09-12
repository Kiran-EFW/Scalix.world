'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { realTimeDataService } from '@/lib/api'

const features = [
  {
    icon: '🔒',
    title: 'Local-First Architecture',
    description: 'Keep your code and data private with our local-first approach. No cloud dependencies or external servers.',
  },
  {
    icon: '🚀',
    title: 'AI-Powered Development',
    description: 'Build intelligent applications faster with AI-assisted coding, debugging, and optimization tools.',
  },
  {
    icon: '⚡',
    title: 'Lightning Fast Performance',
    description: 'Optimized for speed with intelligent caching, lazy loading, and performance monitoring.',
  },
  {
    icon: '🔧',
    title: 'Enterprise-Grade Tools',
    description: 'Professional development tools including version control, testing frameworks, and deployment automation.',
  },
  {
    icon: '🛡️',
    title: 'Privacy by Design',
    description: 'Your code and data never leaves your machine. Built-in encryption and security features.',
  },
  {
    icon: '📦',
    title: 'Cross-Platform Support',
    description: 'Build apps for desktop, web, and mobile with unified development experience.',
  },
]

export function FeaturesSection() {
  const [platformStats, setPlatformStats] = useState({
    activeSubscriptions: 15420,
    monthlyApiSpend: 12,
    platformUptime: '99.9%',
    avgResponseTime: '1.2ms'
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Subscribe to platform stats updates
        realTimeDataService.subscribe('platformStats', (data) => {
          setPlatformStats({
            activeSubscriptions: data.activeSubscriptions,
            monthlyApiSpend: data.monthlyApiSpend,
            platformUptime: data.platformUptime,
            avgResponseTime: data.avgResponseTime
          })
          setIsLoading(false)
        })

        // Start real-time updates
        realTimeDataService.startRealTimeUpdates('platformStats', 10000)

        // Initial data fetch
        const initialData = await realTimeDataService.getPlatformStats()
        setPlatformStats({
          activeSubscriptions: initialData.activeSubscriptions,
          monthlyApiSpend: initialData.monthlyApiSpend,
          platformUptime: initialData.platformUptime,
          avgResponseTime: initialData.avgResponseTime
        })
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to initialize platform stats:', error)
        setIsLoading(false)
      }
    }

    initializeData()

    return () => {
      realTimeDataService.stopRealTimeUpdates('platformStats')
    }
  }, [])

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for AI Development
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to build, deploy, and manage AI applications with enterprise-grade features
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 bg-white rounded-2xl p-8 shadow-sm border border-gray-200"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {isLoading ? (
                  <div className="animate-pulse bg-blue-200 h-8 w-20 rounded mx-auto"></div>
                ) : (
                  platformStats.activeSubscriptions.toLocaleString()
                )}
              </div>
              <div className="text-gray-600">Active Developers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {isLoading ? (
                  <div className="animate-pulse bg-blue-200 h-8 w-12 rounded mx-auto"></div>
                ) : (
                  `${platformStats.monthlyApiSpend}K`
                )}
              </div>
              <div className="text-gray-600">Apps Built</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {isLoading ? (
                  <div className="animate-pulse bg-blue-200 h-8 w-12 rounded mx-auto"></div>
                ) : (
                  platformStats.platformUptime
                )}
              </div>
              <div className="text-gray-600">Platform Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {isLoading ? (
                  <div className="animate-pulse bg-blue-200 h-8 w-10 rounded mx-auto"></div>
                ) : (
                  platformStats.avgResponseTime
                )}
              </div>
              <div className="text-gray-600">Avg Response Time</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
