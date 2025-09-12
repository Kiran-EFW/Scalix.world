'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { useOnboarding } from './OnboardingProvider'
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'

export function OnboardingTooltip() {
  const { currentStep, steps, isActive, nextStep, previousStep, skipTour, completeTour } = useOnboarding()
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const step = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1

  useEffect(() => {
    if (!isActive || !step) {
      setIsVisible(false)
      return
    }

    const updatePosition = () => {
      const targetElement = document.querySelector(step.target)
      if (!targetElement || !tooltipRef.current) return

      const rect = targetElement.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      let top = 0
      let left = 0

      switch (step.placement) {
        case 'top':
          top = rect.top - tooltipRect.height - 10
          left = rect.left + rect.width / 2 - tooltipRect.width / 2
          break
        case 'bottom':
          top = rect.bottom + 10
          left = rect.left + rect.width / 2 - tooltipRect.width / 2
          break
        case 'left':
          top = rect.top + rect.height / 2 - tooltipRect.height / 2
          left = rect.left - tooltipRect.width - 10
          break
        case 'right':
          top = rect.top + rect.height / 2 - tooltipRect.height / 2
          left = rect.right + 10
          break
      }

      // Ensure tooltip stays within viewport
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      left = Math.max(10, Math.min(left, viewportWidth - tooltipRect.width - 10))
      top = Math.max(10, Math.min(top, viewportHeight - tooltipRect.height - 10))

      setPosition({ top, left })
      setIsVisible(true)
    }

    // Small delay to ensure DOM is ready
    setTimeout(updatePosition, 100)

    const handleResize = () => updatePosition()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [isActive, step, currentStep])

  if (!isActive || !step) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 pointer-events-none"
          />

          {/* Tooltip */}
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed z-50 max-w-sm"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
          >
            {/* Arrow */}
            <div
              className={`absolute w-4 h-4 transform rotate-45 bg-white border-l border-t border-gray-200 ${
                step.placement === 'top' ? 'bottom-[-8px] left-1/2 -translate-x-1/2' :
                step.placement === 'bottom' ? 'top-[-8px] left-1/2 -translate-x-1/2' :
                step.placement === 'left' ? 'right-[-8px] top-1/2 -translate-y-1/2' :
                'left-[-8px] top-1/2 -translate-y-1/2'
              }`}
            />

            {/* Content */}
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</p>
                  </div>
                </div>
                <button
                  onClick={skipTour}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="mb-6">
                <div className="text-gray-700 leading-relaxed">
                  {step.content}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <span>Progress</span>
                  <span>{currentStep + 1} / {steps.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {step.showPrevious !== false && currentStep > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={previousStep}
                      className="flex items-center"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </Button>
                  )}

                  {step.showSkip !== false && (
                    <button
                      onClick={skipTour}
                      className="text-sm text-gray-500 hover:text-gray-700 transition-colors px-3 py-2"
                    >
                      Skip tour
                    </button>
                  )}
                </div>

                <Button
                  onClick={isLastStep ? completeTour : nextStep}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                >
                  {isLastStep ? (
                    <>
                      Get Started
                      <Sparkles className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
