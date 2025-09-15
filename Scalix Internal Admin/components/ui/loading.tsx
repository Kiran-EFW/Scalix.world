import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'spinner' | 'dots' | 'pulse'
  className?: string
  text?: string
}

export function Loading({
  size = 'md',
  variant = 'spinner',
  className,
  text
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const renderSpinner = () => (
    <Loader2 className={cn(
      "animate-spin text-red-600",
      sizeClasses[size],
      className
    )} />
  )

  const renderDots = () => (
    <div className={cn("flex space-x-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "bg-red-600 rounded-full animate-pulse",
            size === 'sm' && "w-2 h-2",
            size === 'md' && "w-3 h-3",
            size === 'lg' && "w-4 h-4",
            size === 'xl' && "w-6 h-6"
          )}
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  )

  const renderPulse = () => (
    <div className={cn(
      "bg-red-600 rounded-full animate-pulse",
      sizeClasses[size],
      className
    )} />
  )

  const renderLoading = () => {
    switch (variant) {
      case 'dots':
        return renderDots()
      case 'pulse':
        return renderPulse()
      default:
        return renderSpinner()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      {renderLoading()}
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">{text}</p>
      )}
    </div>
  )
}

// Page-level loading component
interface PageLoadingProps {
  text?: string
  className?: string
}

export function PageLoading({ text = "Loading...", className }: PageLoadingProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-[400px] space-y-4",
      className
    )}>
      <div className="relative">
        <div className="w-16 h-16 border-4 border-red-200 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-red-600 rounded-full animate-spin border-t-transparent"></div>
      </div>
      <p className="text-lg font-medium text-gray-700 animate-pulse">{text}</p>
    </div>
  )
}

// Skeleton loading component
interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200 rounded",
        className
      )}
    />
  )
}

// Table skeleton
interface TableSkeletonProps {
  rows?: number
  columns?: number
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-6 flex-1" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

// Card skeleton
interface CardSkeletonProps {
  lines?: number
}

export function CardSkeleton({ lines = 3 }: CardSkeletonProps) {
  return (
    <div className="p-6 border border-gray-200 rounded-lg">
      <Skeleton className="h-6 w-3/4 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  )
}
