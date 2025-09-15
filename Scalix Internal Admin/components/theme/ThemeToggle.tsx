'use client'

import React from 'react'
import { useTheme, Theme } from '@/lib/theme-context'
import { Button } from '@/components/ui/button'
import {
  Sun,
  Moon,
  Monitor,
  Palette
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  variant?: 'icon' | 'button' | 'full'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function ThemeToggle({ variant = 'icon', size = 'md', className }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme()

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-4 h-4" />
      case 'dark':
        return <Moon className="w-4 h-4" />
      case 'system':
        return <Monitor className="w-4 h-4" />
      default:
        return <Palette className="w-4 h-4" />
    }
  }

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light'
      case 'dark':
        return 'Dark'
      case 'system':
        return 'System'
      default:
        return 'Theme'
    }
  }

  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'icon'}
        onClick={toggleTheme}
        className={cn(
          "relative hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 active:scale-95",
          className
        )}
        title={`Current: ${getLabel()} | Click to cycle themes`}
      >
        <div className="relative">
          {getIcon()}
          <div className={cn(
            "absolute -top-1 -right-1 w-2 h-2 rounded-full border border-white dark:border-gray-900 transition-all duration-300",
            resolvedTheme === 'dark' ? 'bg-blue-500' : 'bg-yellow-500'
          )} />
        </div>
      </Button>
    )
  }

  if (variant === 'button') {
    return (
      <Button
        variant="outline"
        size={size === 'sm' ? 'sm' : 'default'}
        onClick={toggleTheme}
        className={cn(
          "flex items-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200",
          className
        )}
      >
        {getIcon()}
        <span className="hidden sm:inline">{getLabel()}</span>
        <div className={cn(
          "w-2 h-2 rounded-full transition-all duration-300",
          resolvedTheme === 'dark' ? 'bg-blue-500' : 'bg-yellow-500'
        )} />
      </Button>
    )
  }

  // Full variant with dropdown
  return (
    <div className={cn("relative", className)}>
      <Button
        variant="ghost"
        size={size === 'sm' ? 'sm' : 'default'}
        onClick={toggleTheme}
        className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
      >
        {getIcon()}
        <span>{getLabel()}</span>
        <div className={cn(
          "w-2 h-2 rounded-full transition-all duration-300",
          resolvedTheme === 'dark' ? 'bg-blue-500' : 'bg-yellow-500'
        )} />
      </Button>

      {/* Theme indicator */}
      <div className="absolute -top-1 -right-1">
        <div className={cn(
          "w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 shadow-sm transition-all duration-300",
          resolvedTheme === 'dark' ? 'bg-slate-800' : 'bg-yellow-400'
        )} />
      </div>
    </div>
  )
}

// Compact theme indicator for status bars
export function ThemeIndicator() {
  const { theme, resolvedTheme } = useTheme()

  return (
    <div className="flex items-center space-x-2 px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-full">
      <div className={cn(
        "w-2 h-2 rounded-full transition-all duration-300",
        resolvedTheme === 'dark' ? 'bg-blue-500' : 'bg-yellow-500'
      )} />
      <span className="text-xs font-medium text-gray-600 dark:text-gray-400 capitalize">
        {theme === 'system' ? `${resolvedTheme} (auto)` : theme}
      </span>
    </div>
  )
}

// Theme selector dropdown
export function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { value: 'light' as Theme, label: 'Light', icon: Sun, description: 'Always use light theme' },
    { value: 'dark' as Theme, label: 'Dark', icon: Moon, description: 'Always use dark theme' },
    { value: 'system' as Theme, label: 'System', icon: Monitor, description: 'Follow system preference' }
  ]

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Palette className="w-5 h-5 text-gray-600" />
        <h3 className="font-medium text-gray-900 dark:text-gray-100">Theme</h3>
      </div>

      <div className="space-y-2">
        {themes.map(({ value, label, icon: Icon, description }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={cn(
              "w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left",
              theme === value
                ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
                : "hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent"
            )}
          >
            <div className={cn(
              "p-2 rounded-lg transition-colors duration-200",
              theme === value
                ? "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
            )}>
              <Icon className="w-4 h-4" />
            </div>

            <div className="flex-1">
              <p className={cn(
                "font-medium transition-colors duration-200",
                theme === value
                  ? "text-blue-900 dark:text-blue-100"
                  : "text-gray-900 dark:text-gray-100"
              )}>
                {label}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {description}
              </p>
            </div>

            {theme === value && (
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
