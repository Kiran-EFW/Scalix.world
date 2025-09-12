'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import {
  ChevronDown,
  ChevronUp,
  RefreshCw,
  MoreHorizontal,
  GripVertical,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react'
import { useMobile } from './MobileProvider'

// Mobile-optimized Button Component
interface MobileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  fullWidth?: boolean
  haptic?: boolean
}

export function MobileButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  haptic = true,
  className = '',
  disabled,
  ...props
}: MobileButtonProps) {
  const { isTouchDevice, isMobile } = useMobile()

  const baseClasses = `
    relative inline-flex items-center justify-center rounded-lg font-medium
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:pointer-events-none
    ${fullWidth ? 'w-full' : ''}
    ${isTouchDevice ? 'active:scale-95' : ''}
  `

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-md',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 shadow-md',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-blue-500'
  }

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[40px]',
    md: 'px-4 py-3 text-sm min-h-[44px]',
    lg: 'px-6 py-4 text-base min-h-[48px]',
    xl: 'px-8 py-5 text-lg min-h-[52px]'
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Haptic feedback for mobile
    if (haptic && isMobile && 'vibrate' in navigator) {
      navigator.vibrate(10)
    }

    if (props.onClick && !loading && !disabled) {
      props.onClick(e)
    }
  }

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      whileTap={isTouchDevice ? { scale: 0.95 } : undefined}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
      )}
      {children}
    </motion.button>
  )
}

// Mobile Card Component with Swipe Actions
interface SwipeAction {
  icon: React.ReactNode
  label: string
  color: string
  onAction: () => void
}

interface MobileCardProps {
  children: React.ReactNode
  leftActions?: SwipeAction[]
  rightActions?: SwipeAction[]
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  draggable?: boolean
}

export function MobileCard({
  children,
  leftActions = [],
  rightActions = [],
  onSwipeLeft,
  onSwipeRight,
  draggable = true
}: MobileCardProps) {
  const { isTouchDevice } = useMobile()
  const [isDragging, setIsDragging] = useState(false)
  const x = useMotionValue(0)
  const cardRef = useRef<HTMLDivElement>(null)

  // Transform for action visibility
  const leftActionOpacity = useTransform(x, [0, 100], [0, 1])
  const rightActionOpacity = useTransform(x, [0, -100], [0, 1])
  const cardTransform = useTransform(x, (value) => `translateX(${value}px)`)

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 50
    const velocity = info.velocity.x

    if (Math.abs(info.offset.x) > threshold || Math.abs(velocity) > 500) {
      if (info.offset.x > 0 && leftActions.length > 0) {
        // Swipe right - show left actions
        x.set(80)
        onSwipeRight?.()
      } else if (info.offset.x < 0 && rightActions.length > 0) {
        // Swipe left - show right actions
        x.set(-80)
        onSwipeLeft?.()
      } else {
        x.set(0)
      }
    } else {
      x.set(0)
    }

    setIsDragging(false)
  }

  const resetPosition = () => {
    x.set(0)
  }

  if (!isTouchDevice) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        {children}
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden">
      {/* Left Actions */}
      {leftActions.length > 0 && (
        <motion.div
          className="absolute left-0 top-0 bottom-0 flex items-center bg-green-500"
          style={{ opacity: leftActionOpacity }}
        >
          {leftActions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                action.onAction()
                resetPosition()
              }}
              className="flex flex-col items-center justify-center w-20 h-full text-white"
            >
              {action.icon}
              <span className="text-xs mt-1">{action.label}</span>
            </button>
          ))}
        </motion.div>
      )}

      {/* Right Actions */}
      {rightActions.length > 0 && (
        <motion.div
          className="absolute right-0 top-0 bottom-0 flex items-center bg-red-500"
          style={{ opacity: rightActionOpacity }}
        >
          {rightActions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                action.onAction()
                resetPosition()
              }}
              className="flex flex-col items-center justify-center w-20 h-full text-white"
            >
              {action.icon}
              <span className="text-xs mt-1">{action.label}</span>
            </button>
          ))}
        </motion.div>
      )}

      {/* Main Card */}
      <motion.div
        ref={cardRef}
        drag={draggable ? "x" : false}
        dragConstraints={{ left: -80, right: 80 }}
        style={{ x: cardTransform }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        className={`
          bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700
          cursor-grab active:cursor-grabbing relative z-10
          ${isDragging ? 'shadow-lg' : ''}
        `}
        whileTap={{ scale: 0.98 }}
      >
        <div className="p-4">
          {children}
        </div>
      </motion.div>
    </div>
  )
}

// Mobile Accordion Component
interface MobileAccordionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  icon?: React.ReactNode
}

export function MobileAccordion({
  title,
  children,
  defaultOpen = false,
  icon
}: MobileAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className="flex items-center space-x-3">
          {icon && <div className="text-gray-500">{icon}</div>}
          <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </motion.div>
      </button>

      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700">
          {children}
        </div>
      </motion.div>
    </div>
  )
}

// Mobile Bottom Sheet Component
interface MobileBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  snapPoints?: number[]
  initialSnap?: number
}

export function MobileBottomSheet({
  isOpen,
  onClose,
  title,
  children,
  snapPoints = [0.3, 0.6, 1],
  initialSnap = 0
}: MobileBottomSheetProps) {
  const { isMobile } = useMobile()
  const [currentSnap, setCurrentSnap] = useState(initialSnap)
  const y = useMotionValue(0)

  if (!isMobile) return null

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 50
    const velocity = info.velocity.y

    if (info.offset.y > threshold || velocity > 500) {
      // Close sheet
      onClose()
    } else {
      // Snap to nearest point
      const currentY = y.get()
      const sheetHeight = window.innerHeight
      const snapHeights = snapPoints.map(point => sheetHeight * (1 - point))

      const nearestSnap = snapHeights.reduce((prev, curr) =>
        Math.abs(curr - currentY) < Math.abs(prev - currentY) ? curr : prev
      )

      y.set(nearestSnap)
    }
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: isOpen ? `${(1 - snapPoints[initialSnap]) * 100}%` : '100%' }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: window.innerHeight }}
        onDragEnd={handleDragEnd}
        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-xl shadow-xl z-50 safe-area-inset max-h-[90vh]"
      >
        {/* Handle */}
        <div className="flex justify-center py-3">
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>

        {/* Header */}
        {title && (
          <div className="px-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
              {title}
            </h3>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </motion.div>
    </>
  )
}

// Mobile Pull to Refresh Component
interface MobilePullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
  threshold?: number
  disabled?: boolean
}

export function MobilePullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  disabled = false
}: MobilePullToRefreshProps) {
  const { isTouchDevice } = useMobile()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isTouchDevice || disabled) return

    let startY = 0
    let isDragging = false

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY > 0) return // Only allow pull when at top
      startY = e.touches[0].clientY
      isDragging = true
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || isRefreshing) return

      const currentY = e.touches[0].clientY
      const deltaY = currentY - startY

      if (deltaY > 0) {
        e.preventDefault()
        setPullDistance(Math.min(deltaY * 0.5, threshold * 2))
      }
    }

    const handleTouchEnd = async () => {
      if (!isDragging) return

      if (pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true)
        setPullDistance(0)

        try {
          await onRefresh()
        } finally {
          setIsRefreshing(false)
        }
      } else {
        setPullDistance(0)
      }

      isDragging = false
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, { passive: false })
      container.addEventListener('touchmove', handleTouchMove, { passive: false })
      container.addEventListener('touchend', handleTouchEnd)

      return () => {
        container.removeEventListener('touchstart', handleTouchStart)
        container.removeEventListener('touchmove', handleTouchMove)
        container.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isTouchDevice, disabled, pullDistance, threshold, isRefreshing, onRefresh])

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {/* Pull Indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center py-4 bg-blue-500 text-white"
        style={{
          transform: `translateY(${pullDistance - 60}px)`,
          opacity: pullDistance / threshold
        }}
      >
        <motion.div
          animate={{ rotate: pullDistance >= threshold ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <RefreshCw className="w-5 h-5 mr-2" />
        </motion.div>
        <span className="text-sm font-medium">
          {isRefreshing ? 'Refreshing...' : pullDistance >= threshold ? 'Release to refresh' : 'Pull to refresh'}
        </span>
      </motion.div>

      {/* Content */}
      <motion.div
        style={{
          transform: `translateY(${Math.max(0, pullDistance - 60)}px)`
        }}
        className="transition-transform duration-200"
      >
        {children}
      </motion.div>
    </div>
  )
}

// Mobile Floating Action Button
interface MobileFABProps {
  icon: React.ReactNode
  onClick: () => void
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary'
}

export function MobileFAB({
  icon,
  onClick,
  position = 'bottom-right',
  size = 'md',
  variant = 'primary'
}: MobileFABProps) {
  const { isMobile } = useMobile()

  if (!isMobile) return null

  const positionClasses = {
    'bottom-right': 'bottom-20 right-4',
    'bottom-left': 'bottom-20 left-4',
    'top-right': 'top-20 right-4',
    'top-left': 'top-20 left-4'
  }

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  }

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 shadow-lg border border-gray-200'
  }

  return (
    <motion.button
      onClick={onClick}
      className={`
        fixed ${positionClasses[position]} ${sizeClasses[size]} ${variantClasses[variant]}
        rounded-full flex items-center justify-center transition-colors
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-30
        safe-area-inset
      `}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
    >
      {icon}
    </motion.button>
  )
}

// Mobile Search Component
interface MobileSearchProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onSearch?: (value: string) => void
  autoFocus?: boolean
}

export function MobileSearch({
  placeholder = 'Search...',
  value,
  onChange,
  onSearch,
  autoFocus = false
}: MobileSearchProps) {
  const { isMobile } = useMobile()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus && isMobile && inputRef.current) {
      // Delay to ensure component is mounted
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [autoFocus, isMobile])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(value)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full px-4 py-3 pl-12 pr-12 text-base border border-gray-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white
            ${isMobile ? 'font-size-16px' : ''} // Prevent zoom on iOS
          `}
          enterKeyHint="search"
          autoComplete="off"
        />

        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Clear Button */}
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </form>
  )
}
