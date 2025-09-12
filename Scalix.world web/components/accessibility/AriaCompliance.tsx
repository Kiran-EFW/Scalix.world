'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, Info } from 'lucide-react'

interface AriaComplianceProps {
  children: React.ReactNode
  enableAudit?: boolean
}

interface AriaIssue {
  id: string
  type: 'error' | 'warning' | 'info'
  element: string
  message: string
  suggestion: string
  selector?: string
}

export function AriaCompliance({ children, enableAudit = false }: AriaComplianceProps) {
  const [ariaIssues, setAriaIssues] = useState<AriaIssue[]>([])
  const [isAuditing, setIsAuditing] = useState(false)
  const [auditResults, setAuditResults] = useState<{ passed: number; failed: number; total: number } | null>(null)

  // ARIA audit function
  const runAriaAudit = () => {
    setIsAuditing(true)
    const issues: AriaIssue[] = []

    // Check for missing alt text on images
    const images = document.querySelectorAll('img')
    images.forEach((img, index) => {
      if (!img.getAttribute('alt') && !img.getAttribute('aria-label')) {
        issues.push({
          id: `img-${index}`,
          type: 'error',
          element: 'img',
          message: 'Image missing alt text or aria-label',
          suggestion: 'Add alt="" for decorative images or descriptive alt text for meaningful images',
          selector: `img:nth-of-type(${index + 1})`
        })
      }
    })

    // Check buttons for accessibility
    const buttons = document.querySelectorAll('button')
    buttons.forEach((button, index) => {
      if (!button.getAttribute('aria-label') && !button.textContent?.trim()) {
        const iconOnly = button.querySelector('svg, [class*="icon"]')
        if (iconOnly) {
          issues.push({
            id: `btn-${index}`,
            type: 'warning',
            element: 'button',
            message: 'Icon-only button missing aria-label',
            suggestion: 'Add aria-label describing the button action',
            selector: `button:nth-of-type(${index + 1})`
          })
        }
      }
    })

    // Check form inputs
    const inputs = document.querySelectorAll('input, select, textarea')
    inputs.forEach((input, index) => {
      const label = input.getAttribute('aria-label') || input.getAttribute('aria-labelledby')
      const associatedLabel = document.querySelector(`label[for="${input.id}"]`)

      if (!label && !associatedLabel) {
        issues.push({
          id: `input-${index}`,
          type: 'error',
          element: input.tagName.toLowerCase(),
          message: 'Form input missing label or aria-label',
          suggestion: 'Add a label element or aria-label attribute',
          selector: `${input.tagName.toLowerCase()}:nth-of-type(${index + 1})`
        })
      }
    })

    // Check for proper heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    let lastLevel = 0
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1))
      if (level - lastLevel > 1 && lastLevel !== 0) {
        issues.push({
          id: `heading-${index}`,
          type: 'warning',
          element: heading.tagName.toLowerCase(),
          message: 'Skipped heading level',
          suggestion: 'Ensure proper heading hierarchy (h1 → h2 → h3, etc.)',
          selector: `${heading.tagName.toLowerCase()}:nth-of-type(${index + 1})`
        })
      }
      lastLevel = level
    })

    // Check for missing main landmark
    if (!document.querySelector('main, [role="main"]')) {
      issues.push({
        id: 'main-landmark',
        type: 'error',
        element: 'main',
        message: 'Missing main landmark',
        suggestion: 'Add <main> element or element with role="main"'
      })
    }

    // Check for focus management in modals
    const modals = document.querySelectorAll('[role="dialog"], [aria-modal="true"]')
    modals.forEach((modal, index) => {
      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusableElements.length === 0) {
        issues.push({
          id: `modal-${index}`,
          type: 'warning',
          element: 'modal',
          message: 'Modal has no focusable elements',
          suggestion: 'Ensure modals contain at least one focusable element',
          selector: `[role="dialog"]:nth-of-type(${index + 1})`
        })
      }
    })

    setAriaIssues(issues)
    setAuditResults({
      passed: document.querySelectorAll('*').length - issues.length,
      failed: issues.length,
      total: document.querySelectorAll('*').length
    })
    setIsAuditing(false)
  }

  useEffect(() => {
    if (enableAudit) {
      // Run audit on component mount and periodically
      runAriaAudit()
      const interval = setInterval(runAriaAudit, 30000) // Every 30 seconds
      return () => clearInterval(interval)
    }
  }, [enableAudit])

  return (
    <>
      {/* ARIA Audit Panel (only in development) */}
      {enableAudit && process.env.NODE_ENV === 'development' && (
        <motion.div
          initial={{ opacity: 0, x: -300 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed top-4 left-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              ARIA Audit
            </h3>
            <button
              onClick={runAriaAudit}
              disabled={isAuditing}
              className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              {isAuditing ? 'Auditing...' : 'Refresh'}
            </button>
          </div>

          {auditResults && (
            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Passed: {auditResults.passed}</span>
                <span className="text-red-600">Failed: {auditResults.failed}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${(auditResults.passed / auditResults.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {ariaIssues.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {ariaIssues.slice(0, 5).map((issue) => (
                <div
                  key={issue.id}
                  className={`p-2 rounded text-xs border ${
                    issue.type === 'error'
                      ? 'bg-red-50 border-red-200 text-red-800'
                      : issue.type === 'warning'
                      ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                      : 'bg-blue-50 border-blue-200 text-blue-800'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {issue.type === 'error' && <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />}
                    {issue.type === 'warning' && <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />}
                    {issue.type === 'info' && <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />}
                    <div>
                      <div className="font-medium">{issue.element}</div>
                      <div>{issue.message}</div>
                      <div className="text-gray-600 mt-1">{issue.suggestion}</div>
                    </div>
                  </div>
                </div>
              ))}
              {ariaIssues.length > 5 && (
                <div className="text-xs text-gray-500 text-center py-1">
                  +{ariaIssues.length - 5} more issues
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* Screen reader announcements */}
      <div className="sr-only">
        <div aria-live="polite" aria-atomic="true" id="aria-announcements"></div>
        <div aria-live="assertive" aria-atomic="true" id="aria-errors"></div>
        <div aria-live="polite" aria-atomic="true" id="aria-status"></div>
      </div>

      {/* High contrast mode detection and styles */}
      <style jsx global>{`
        @media (prefers-contrast: high) {
          * {
            border: 1px solid;
          }

          button, [role="button"] {
            border: 2px solid;
            background: white !important;
            color: black !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Ensure sufficient color contrast */
        .text-gray-600 {
          color: #374151 !important;
        }

        .text-gray-500 {
          color: #6b7280 !important;
        }

        /* Focus management for modals */
        [role="dialog"][aria-modal="true"] {
          isolation: isolate;
        }

        [role="dialog"][aria-modal="true"] ~ * {
          display: none;
        }
      `}</style>

      {children}
    </>
  )
}

// Utility functions for ARIA announcements
export const announceToScreenReader = (
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
) => {
  const announcementDiv = document.getElementById(
    priority === 'assertive' ? 'aria-errors' : 'aria-announcements'
  )
  if (announcementDiv) {
    announcementDiv.textContent = message
    // Clear after announcement
    setTimeout(() => {
      announcementDiv.textContent = ''
    }, 1000)
  }
}

export const announceStatus = (message: string) => {
  const statusDiv = document.getElementById('aria-status')
  if (statusDiv) {
    statusDiv.textContent = message
  }
}
