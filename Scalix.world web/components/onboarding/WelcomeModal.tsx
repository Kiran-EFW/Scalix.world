'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { useOnboarding } from './OnboardingProvider'
import {
  Sparkles,
  Rocket,
  MessageCircle,
  BarChart3,
  X,
  Play,
  BookOpen,
  Users,
  Zap,
  CheckCircle
} from 'lucide-react'

export function WelcomeModal() {
  const { isCompleted, startTour, skipTour } = useOnboarding()
  const [isVisible, setIsVisible] = useState(false)
  const [selectedOption, setSelectedOption] = useState<'tour' | 'explore' | null>(null)

  useEffect(() => {
    // Show modal for new users who haven't completed onboarding
    if (!isCompleted) {
      const timer = setTimeout(() => setIsVisible(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [isCompleted])

  const handleStartTour = () => {
    setIsVisible(false)
    setSelectedOption('tour')
    setTimeout(() => startTour(), 300)
  }

  const handleExplore = () => {
    setIsVisible(false)
    setSelectedOption('explore')
    skipTour()
  }

  const features = [
    {
      icon: MessageCircle,
      title: 'AI Chat Assistant',
      description: 'Get instant help from our intelligent AI assistant'
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Monitor your AI usage with live dashboards'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Experience blazing-fast AI responses'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Join thousands of developers building with AI'
    }
  ]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 p-8 text-white">
              <button
                onClick={() => setIsVisible(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Sparkles className="w-10 h-10" />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl font-bold mb-4"
                >
                  Welcome to Scalix AI! 🚀
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-blue-100 leading-relaxed"
                >
                  Your journey to building amazing AI applications starts here.
                  Let us show you around and unlock the full potential of our platform.
                </motion.p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Features Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* What's New */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8 border border-green-200"
              >
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">✨ What's New</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Real-time analytics dashboard with live data</li>
                      <li>• Interactive AI chat assistant with multiple models</li>
                      <li>• Advanced model comparison and performance tracking</li>
                      <li>• Enhanced user experience with smooth animations</li>
                      <li>• Comprehensive API documentation and examples</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button
                  onClick={handleStartTour}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Take a Quick Tour
                </Button>

                <Button
                  onClick={handleExplore}
                  variant="outline"
                  className="px-8 py-4 text-lg font-semibold border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 rounded-xl transition-all duration-300"
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  Explore on My Own
                </Button>
              </motion.div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-center mt-6 text-sm text-gray-500"
              >
                <p>Need help? Check out our <a href="/docs" className="text-blue-600 hover:text-blue-700">documentation</a> or join our <a href="/community" className="text-blue-600 hover:text-blue-700">community</a>.</p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
