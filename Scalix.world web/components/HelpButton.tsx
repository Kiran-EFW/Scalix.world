'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { useOnboarding } from '@/components/onboarding/OnboardingProvider'
import {
  HelpCircle,
  Play,
  RefreshCw,
  BookOpen,
  MessageCircle,
  X,
  Sparkles,
  Settings
} from 'lucide-react'

export function HelpButton() {
  const { startTour, resetTour, isCompleted } = useOnboarding()
  const [isOpen, setIsOpen] = useState(false)

  const helpOptions = [
    {
      icon: Play,
      title: 'Take Tour',
      description: 'Guided tour of Scalix features',
      action: () => {
        startTour()
        setIsOpen(false)
      },
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: RefreshCw,
      title: 'Reset Tour',
      description: 'Start the tour from beginning',
      action: () => {
        resetTour()
        setIsOpen(false)
      },
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      icon: BookOpen,
      title: 'Documentation',
      description: 'Read detailed guides',
      action: () => {
        window.open('/docs', '_blank')
        setIsOpen(false)
      },
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      icon: MessageCircle,
      title: 'AI Assistant',
      description: 'Get instant help from AI',
      action: () => {
        // Trigger AI chat
        const aiChatButton = document.querySelector('[data-onboarding="ai-chat"] button')
        if (aiChatButton) {
          (aiChatButton as HTMLButtonElement).click()
        }
        setIsOpen(false)
      },
      color: 'bg-cyan-500 hover:bg-cyan-600'
    }
  ]

  return (
    <>
      {/* Help Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-6 z-40 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Help and support"
        data-help-trigger
      >
        <HelpCircle className="w-6 h-6" />
      </motion.button>

      {/* Help Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-32 right-6 z-40 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 min-w-[280px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Help & Support</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {helpOptions.map((option, index) => (
                <motion.button
                  key={option.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={option.action}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl text-white transition-all duration-200 ${option.color} hover:shadow-lg transform hover:scale-105`}
                >
                  <option.icon className="w-5 h-5 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-medium text-sm">{option.title}</div>
                    <div className="text-xs opacity-90">{option.description}</div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Need more help?</span>
                <a
                  href="/community"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Join Community
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
