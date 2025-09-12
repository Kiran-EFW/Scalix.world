'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { KeyboardNavigation } from './KeyboardNavigation'
import { AriaCompliance } from './AriaCompliance'

interface AccessibilityContextType {
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void
  announceStatus: (message: string) => void
  focusElement: (selector: string) => void
  trapFocus: (container: HTMLElement) => () => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}

interface AccessibilityProviderProps {
  children: ReactNode
  enableAriaAudit?: boolean
  enableKeyboardNav?: boolean
}

// Utility functions for accessibility
const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcementDiv = document.getElementById(
    priority === 'assertive' ? 'aria-errors' : 'aria-announcements'
  )
  if (announcementDiv) {
    announcementDiv.textContent = message
    setTimeout(() => {
      announcementDiv.textContent = ''
    }, 1000)
  }
}

const announceStatus = (message: string) => {
  const statusDiv = document.getElementById('aria-status')
  if (statusDiv) {
    statusDiv.textContent = message
  }
}

const focusElement = (selector: string) => {
  const element = document.querySelector(selector) as HTMLElement
  if (element) {
    element.focus()
    // Scroll into view if needed
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

const trapFocus = (container: HTMLElement) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  const firstElement = focusableElements[0] as HTMLElement
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }
  }

  container.addEventListener('keydown', handleKeyDown)

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown)
  }
}

export function AccessibilityProvider({
  children,
  enableAriaAudit = process.env.NODE_ENV === 'development',
  enableKeyboardNav = true
}: AccessibilityProviderProps) {
  const value: AccessibilityContextType = {
    announceToScreenReader,
    announceStatus,
    focusElement,
    trapFocus,
  }

  return (
    <AccessibilityContext.Provider value={value}>
      <AriaCompliance enableAudit={enableAriaAudit}>
        {enableKeyboardNav ? (
          <KeyboardNavigation>
            {children}
          </KeyboardNavigation>
        ) : (
          children
        )}
      </AriaCompliance>
    </AccessibilityContext.Provider>
  )
}

// Higher-order component for accessible components
export function withAccessibility<P extends object>(
  Component: React.ComponentType<P>
) {
  return function AccessibleComponent(props: P) {
    const accessibility = useAccessibility()
    return <Component {...props} accessibility={accessibility} />
  }
}

// Hook for managing ARIA attributes dynamically
export function useAriaAttributes(
  initialAttributes: Record<string, string> = {}
) {
  const [attributes, setAttributes] = React.useState(initialAttributes)

  const updateAttribute = React.useCallback((key: string, value: string) => {
    setAttributes(prev => ({ ...prev, [key]: value }))
  }, [])

  const removeAttribute = React.useCallback((key: string) => {
    setAttributes(prev => {
      const newAttrs = { ...prev }
      delete newAttrs[key]
      return newAttrs
    })
  }, [])

  const setAttributesBatch = React.useCallback((newAttributes: Record<string, string>) => {
    setAttributes(newAttributes)
  }, [])

  return {
    attributes,
    updateAttribute,
    removeAttribute,
    setAttributesBatch,
    ariaProps: Object.fromEntries(
      Object.entries(attributes).map(([key, value]) => [`aria-${key}`, value])
    )
  }
}

// Utility component for accessible buttons
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export function AccessibleButton({
  children,
  loading = false,
  variant = 'primary',
  size = 'md',
  disabled,
  'aria-label': ariaLabel,
  ...props
}: AccessibleButtonProps) {
  const { announceToScreenReader } = useAccessibility()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      e.preventDefault()
      return
    }

    if (props.onClick) {
      props.onClick(e)
    }

    // Announce button action to screen readers
    if (ariaLabel) {
      announceToScreenReader(`Activated ${ariaLabel}`)
    }
  }

  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500"
  }

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  }

  return (
    <button
      {...props}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${props.className || ''}`}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  )
}

// Accessible Modal component
interface AccessibleModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function AccessibleModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}: AccessibleModalProps) {
  const { trapFocus, announceToScreenReader } = useAccessibility()
  const modalRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (isOpen && modalRef.current) {
      // Trap focus within modal
      const cleanup = trapFocus(modalRef.current)

      // Focus first focusable element
      const firstFocusable = modalRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement
      if (firstFocusable) {
        firstFocusable.focus()
      }

      // Announce modal opening
      announceToScreenReader(`Opened ${title} dialog`, 'assertive')

      return cleanup
    }
  }, [isOpen, trapFocus, announceToScreenReader, title])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onKeyDown={handleKeyDown}
    >
      <div
        ref={modalRef}
        className={`w-full ${sizeClasses[size]} bg-white rounded-lg shadow-xl`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

// Accessible Form Field component
interface AccessibleFormFieldProps {
  label: string
  id: string
  error?: string
  required?: boolean
  helpText?: string
  children: ReactNode
}

export function AccessibleFormField({
  label,
  id,
  error,
  required = false,
  helpText,
  children
}: AccessibleFormFieldProps) {
  const errorId = `${id}-error`
  const helpId = `${id}-help`

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>

      <div>
        {React.cloneElement(children as React.ReactElement, {
          id,
          'aria-describedby': error ? errorId : helpText ? helpId : undefined,
          'aria-invalid': error ? 'true' : undefined,
          'aria-required': required,
        })}
      </div>

      {error && (
        <p
          id={errorId}
          className="text-sm text-red-600"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}

      {helpText && !error && (
        <p
          id={helpId}
          className="text-sm text-gray-500"
        >
          {helpText}
        </p>
      )}
    </div>
  )
}
