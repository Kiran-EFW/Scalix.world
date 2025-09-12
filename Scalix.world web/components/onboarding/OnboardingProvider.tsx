'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface OnboardingStep {
  id: string
  title: string
  description: string
  target: string // CSS selector
  placement: 'top' | 'bottom' | 'left' | 'right'
  content: ReactNode
  showSkip?: boolean
  showPrevious?: boolean
}

interface OnboardingContextType {
  currentStep: number
  steps: OnboardingStep[]
  isActive: boolean
  isCompleted: boolean
  startTour: () => void
  nextStep: () => void
  previousStep: () => void
  skipTour: () => void
  completeTour: () => void
  resetTour: () => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export const useOnboarding = () => {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}

interface OnboardingProviderProps {
  children: ReactNode
  steps: OnboardingStep[]
}

export function OnboardingProvider({ children, steps }: OnboardingProviderProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  // Check if user has completed onboarding before
  useEffect(() => {
    const completed = localStorage.getItem('scalix-onboarding-completed')
    if (completed === 'true') {
      setIsCompleted(true)
    }
  }, [])

  const startTour = () => {
    setIsActive(true)
    setCurrentStep(0)
    setIsCompleted(false)
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeTour()
    }
  }

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipTour = () => {
    setIsActive(false)
    setIsCompleted(true)
    localStorage.setItem('scalix-onboarding-completed', 'true')
  }

  const completeTour = () => {
    setIsActive(false)
    setIsCompleted(true)
    localStorage.setItem('scalix-onboarding-completed', 'true')
  }

  const resetTour = () => {
    setCurrentStep(0)
    setIsActive(false)
    setIsCompleted(false)
    localStorage.removeItem('scalix-onboarding-completed')
  }

  const value: OnboardingContextType = {
    currentStep,
    steps,
    isActive,
    isCompleted,
    startTour,
    nextStep,
    previousStep,
    skipTour,
    completeTour,
    resetTour,
  }

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  )
}
