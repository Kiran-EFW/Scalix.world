'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export type DeviceType = 'mobile' | 'tablet' | 'desktop'
export type Orientation = 'portrait' | 'landscape'
export type TouchCapability = 'touch' | 'hybrid' | 'mouse'

interface DeviceInfo {
  type: DeviceType
  orientation: Orientation
  touchCapability: TouchCapability
  screenWidth: number
  screenHeight: number
  isOnline: boolean
  prefersReducedMotion: boolean
  prefersDarkMode: boolean
  pixelRatio: number
}

interface MobileContextType {
  device: DeviceInfo
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isLandscape: boolean
  isPortrait: boolean
  isTouchDevice: boolean
  isOnline: boolean
  updateDeviceInfo: () => void
}

const MobileContext = createContext<MobileContextType | undefined>(undefined)

export const useMobile = () => {
  const context = useContext(MobileContext)
  if (!context) {
    throw new Error('useMobile must be used within a MobileProvider')
  }
  return context
}

interface MobileProviderProps {
  children: React.ReactNode
  breakpoints?: {
    mobile: number
    tablet: number
    desktop: number
  }
}

const defaultBreakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1024
}

export function MobileProvider({
  children,
  breakpoints = defaultBreakpoints
}: MobileProviderProps) {
  const [device, setDevice] = useState<DeviceInfo>({
    type: 'desktop',
    orientation: 'landscape',
    touchCapability: 'mouse',
    screenWidth: 1920,
    screenHeight: 1080,
    isOnline: true,
    prefersReducedMotion: false,
    prefersDarkMode: false,
    pixelRatio: 1
  })

  const updateDeviceInfo = () => {
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight

    // Determine device type
    let type: DeviceType = 'desktop'
    if (screenWidth < breakpoints.mobile) {
      type = 'mobile'
    } else if (screenWidth < breakpoints.tablet) {
      type = 'tablet'
    }

    // Determine orientation
    const orientation: Orientation = screenWidth > screenHeight ? 'landscape' : 'portrait'

    // Determine touch capability
    let touchCapability: TouchCapability = 'mouse'
    if ('ontouchstart' in window) {
      touchCapability = 'touch'
    } else if (window.navigator.maxTouchPoints > 0) {
      touchCapability = 'hybrid'
    }

    // Check user preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches

    setDevice({
      type,
      orientation,
      touchCapability,
      screenWidth,
      screenHeight,
      isOnline: navigator.onLine,
      prefersReducedMotion,
      prefersDarkMode,
      pixelRatio: window.devicePixelRatio || 1
    })
  }

  useEffect(() => {
    // Initial update
    updateDeviceInfo()

    // Event listeners
    const handleResize = () => updateDeviceInfo()
    const handleOrientationChange = () => updateDeviceInfo()
    const handleOnline = () => setDevice(prev => ({ ...prev, isOnline: true }))
    const handleOffline = () => setDevice(prev => ({ ...prev, isOnline: false }))

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleOrientationChange)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Listen for preference changes
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')

    reducedMotionQuery.addEventListener('change', updateDeviceInfo)
    darkModeQuery.addEventListener('change', updateDeviceInfo)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleOrientationChange)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      reducedMotionQuery.removeEventListener('change', updateDeviceInfo)
      darkModeQuery.removeEventListener('change', updateDeviceInfo)
    }
  }, [breakpoints.mobile, breakpoints.tablet, breakpoints.desktop])

  const value: MobileContextType = {
    device,
    isMobile: device.type === 'mobile',
    isTablet: device.type === 'tablet',
    isDesktop: device.type === 'desktop',
    isLandscape: device.orientation === 'landscape',
    isPortrait: device.orientation === 'portrait',
    isTouchDevice: device.touchCapability !== 'mouse',
    isOnline: device.isOnline,
    updateDeviceInfo
  }

  return (
    <MobileContext.Provider value={value}>
      {children}
    </MobileContext.Provider>
  )
}

// Mobile-optimized viewport meta tag
export function MobileViewport() {
  return (
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
    />
  )
}

// Mobile-specific styles and utilities
export const mobileStyles = `
  /* Touch-friendly interactions */
  @media (max-width: 768px) {
    /* Increase touch targets */
    button, [role="button"], a, input, select, textarea {
      min-height: 44px;
      min-width: 44px;
    }

    /* Improve text readability */
    body {
      font-size: 16px;
      line-height: 1.5;
    }

    /* Better spacing for touch */
    .touch-spacing > * + * {
      margin-top: 1rem;
    }

    /* Hide scrollbars but keep functionality */
    ::-webkit-scrollbar {
      display: none;
    }

    /* Custom scroll behavior */
    * {
      -webkit-overflow-scrolling: touch;
    }
  }

  /* Tablet optimizations */
  @media (min-width: 769px) and (max-width: 1024px) {
    /* Medium touch targets */
    button, [role="button"], a, input, select, textarea {
      min-height: 40px;
      min-width: 40px;
    }
  }

  /* Landscape mobile optimizations */
  @media (max-width: 768px) and (orientation: landscape) {
    /* Adjust layouts for landscape */
    .mobile-landscape {
      flex-direction: row !important;
    }
  }

  /* Safe area support for notched devices */
  .safe-area-inset {
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
  }

  /* Prevent zoom on input focus */
  @media screen and (max-width: 768px) {
    input, select, textarea {
      font-size: 16px !important;
    }
  }
`

// Utility hook for mobile-specific behavior
export function useMobileBehavior() {
  const { device, isMobile, isTouchDevice } = useMobile()

  return {
    // Touch-specific behavior
    enableTouchFeedback: isTouchDevice,
    useLongPress: isTouchDevice,

    // Mobile-specific styling
    touchClass: isTouchDevice ? 'touch-device' : '',
    mobileClass: isMobile ? 'mobile-device' : '',

    // Gesture support
    enableSwipe: isMobile,
    enablePinch: isMobile,

    // Performance optimizations
    reduceMotion: device.prefersReducedMotion,
    lowPowerMode: device.type === 'mobile' && device.pixelRatio > 2,

    // Layout adjustments
    compactLayout: isMobile,
    singleColumn: isMobile && device.orientation === 'portrait'
  }
}
