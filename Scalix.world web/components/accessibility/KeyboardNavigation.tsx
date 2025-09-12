'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface KeyboardNavigationProps {
  children: React.ReactNode
}

export function KeyboardNavigation({ children }: KeyboardNavigationProps) {
  const [isSkipLinksVisible, setIsSkipLinksVisible] = useState(false)
  const [currentFocusIndex, setCurrentFocusIndex] = useState(-1)
  const [focusableElements, setFocusableElements] = useState<HTMLElement[]>([])

  // Skip links for screen readers and keyboard users
  const skipLinks = [
    { href: '#main-content', label: 'Skip to main content' },
    { href: '#navigation', label: 'Skip to navigation' },
    { href: '#dashboard', label: 'Skip to dashboard' },
    { href: '#ai-chat', label: 'Skip to AI chat' },
    { href: '#footer', label: 'Skip to footer' }
  ]

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Show skip links on Tab key press
      if (event.key === 'Tab') {
        setIsSkipLinksVisible(true)
        // Auto-hide skip links after 3 seconds
        setTimeout(() => setIsSkipLinksVisible(false), 3000)
      }

      // Tab navigation with arrow keys for focus management
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault()
        const elements = document.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>
        const focusableArray = Array.from(elements)

        if (focusableArray.length > 0) {
          const nextIndex = currentFocusIndex < focusableArray.length - 1
            ? currentFocusIndex + 1
            : 0
          focusableArray[nextIndex].focus()
          setCurrentFocusIndex(nextIndex)
        }
      }

      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault()
        const elements = document.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>
        const focusableArray = Array.from(elements)

        if (focusableArray.length > 0) {
          const nextIndex = currentFocusIndex > 0
            ? currentFocusIndex - 1
            : focusableArray.length - 1
          focusableArray[nextIndex].focus()
          setCurrentFocusIndex(nextIndex)
        }
      }

      // Escape key handling
      if (event.key === 'Escape') {
        // Close modals, dropdowns, etc.
        const activeModal = document.querySelector('[role="dialog"][aria-modal="true"]')
        const activeDropdown = document.querySelector('[aria-expanded="true"]')

        if (activeModal) {
          const closeButton = activeModal.querySelector('[aria-label="Close"]') as HTMLElement
          if (closeButton) closeButton.click()
        } else if (activeDropdown) {
          const trigger = activeDropdown.previousElementSibling as HTMLElement
          if (trigger) trigger.click()
        }
      }

      // Ctrl/Cmd + / for help
      if ((event.ctrlKey || event.metaKey) && event.key === '/') {
        event.preventDefault()
        const helpButton = document.querySelector('[data-help-trigger]') as HTMLElement
        if (helpButton) helpButton.click()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [currentFocusIndex])

  // Update focusable elements on DOM changes
  useEffect(() => {
    const updateFocusableElements = () => {
      const elements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>
      setFocusableElements(Array.from(elements))
    }

    updateFocusableElements()

    const observer = new MutationObserver(updateFocusableElements)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['tabindex', 'disabled', 'aria-hidden']
    })

    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* Skip Links */}
      <AnimatePresence>
        {isSkipLinksVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="flex items-center justify-center space-x-6">
                {skipLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-white hover:text-blue-200 underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 px-2 py-1 rounded"
                    onClick={() => setIsSkipLinksVisible(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard shortcuts info */}
      <div className="sr-only" aria-live="polite" id="keyboard-info">
        Use Tab to navigate, Arrow keys for directional navigation, Escape to close dialogs, Ctrl+/ for help.
      </div>

      {/* Focus indicator styles */}
      <style jsx global>{`
        *:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        *:focus:not(:focus-visible) {
          outline: none;
        }

        *:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        .focus-ring {
          @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
        }
      `}</style>

      {children}
    </>
  )
}
