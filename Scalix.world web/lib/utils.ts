import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Glass morphism utility
export function glassEffect(opacity = 0.1, blur = 10) {
  return `backdrop-blur-${blur} bg-white/10 border border-white/20`
}

// Responsive breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

// Animation variants for Framer Motion
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

export const fadeInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6 }
}

export const fadeInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6 }
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 }
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Super admin credentials for development
export const SUPER_ADMIN = {
  email: 'admin@scalix.world',
  password: 'admin123',
  name: 'Super Admin',
  role: 'super_admin'
}

// Development helpers
export const isDevelopment = process.env.NODE_ENV === 'development'

export const logDev = (message: string, data?: any) => {
  if (isDevelopment) {
    console.log(`🔧 [DEV] ${message}`, data)
  }
}
