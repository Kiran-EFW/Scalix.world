'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Sparkles,
  Info,
  Zap,
  Brain,
  Settings,
  ExternalLink
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserSettings {
  enableScalixPro?: boolean
  enableProLazyEditsMode?: boolean
  enableProSmartFilesContextMode?: boolean
  proSmartContextOption?: 'balanced' | undefined
}

interface ProModeSelectorProps {
  settings: UserSettings | null
  onSettingsChange: (updates: Partial<UserSettings>) => void
  hasProKey?: boolean
  className?: string
}

export function ProModeSelector({
  settings,
  onSettingsChange,
  hasProKey = false,
  className
}: ProModeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleProEnabled = () => {
    onSettingsChange({
      enableScalixPro: !settings?.enableScalixPro,
    })
  }

  const toggleLazyEdits = () => {
    onSettingsChange({
      enableProLazyEditsMode: !settings?.enableProLazyEditsMode,
    })
  }

  const handleSmartContextChange = (value: 'off' | 'conservative' | 'balanced') => {
    if (value === 'off') {
      onSettingsChange({
        enableProSmartFilesContextMode: false,
        proSmartContextOption: undefined,
      })
    } else if (value === 'conservative') {
      onSettingsChange({
        enableProSmartFilesContextMode: true,
        proSmartContextOption: undefined,
      })
    } else if (value === 'balanced') {
      onSettingsChange({
        enableProSmartFilesContextMode: true,
        proSmartContextOption: 'balanced',
      })
    }
  }

  const isProEnabled = settings?.enableScalixPro && hasProKey
  const canUseProFeatures = hasProKey && Boolean(settings?.enableScalixPro)

  // Determine current Smart Context value
  const getCurrentSmartContextValue = (): 'off' | 'conservative' | 'balanced' => {
    if (!settings?.enableProSmartFilesContextMode) return 'off'
    if (settings?.proSmartContextOption === 'balanced') return 'balanced'
    return 'conservative'
  }

  const currentSmartContextValue = getCurrentSmartContextValue()

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "flex items-center gap-2 border-primary/50 hover:bg-primary/10 font-medium shadow-sm shadow-primary/10 transition-all hover:shadow-md hover:shadow-primary/15",
              hasProKey && settings?.enableScalixPro && "bg-primary/10 border-primary/60"
            )}
          >
            <Sparkles className={cn(
              "w-4 h-4",
              hasProKey && settings?.enableScalixPro ? "text-primary-400" : "text-primary-600"
            )} />
            <span className="text-primary-600 dark:text-primary-400 font-medium text-sm">
              Pro
            </span>
            {hasProKey && settings?.enableScalixPro && (
              <Badge variant="secondary" className="bg-primary-500/20 text-primary-300 text-xs px-1.5 py-0.5">
                Active
              </Badge>
            )}
          </Button>
        </motion.div>
      </PopoverTrigger>

      <PopoverContent className="w-80 glass border-primary/20" align="end">
        <div className="space-y-4">
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-400" />
              <h4 className="font-semibold text-white">Scalix Pro Settings</h4>
            </div>
            <div className="h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent" />
          </div>

          {/* Pro Key Status */}
          {!hasProKey && (
            <Card className="glass border-yellow-500/30 bg-yellow-500/5">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-medium text-yellow-300">
                      Pro Features Unlocked
                    </span>
                  </div>
                  <p className="text-xs text-yellow-400/80 mb-3">
                    Get access to advanced AI models and optimization features
                  </p>
                  <Button
                    size="sm"
                    className="w-full bg-primary-600 hover:bg-primary-700"
                    onClick={() => window.location.href = '/pricing'}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pro Settings */}
          <div className="space-y-4">
            {/* Enable Pro */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <label className={cn(
                  "text-sm font-medium",
                  !hasProKey ? "text-gray-400" : "text-white"
                )}>
                  Enable Scalix Pro
                </label>
                <p className="text-xs text-gray-400">
                  Use Scalix Pro AI credits for enhanced features
                </p>
              </div>
              <Switch
                checked={Boolean(settings?.enableScalixPro)}
                onCheckedChange={toggleProEnabled}
                disabled={!hasProKey}
              />
            </div>

            {/* Lazy Edits Mode */}
            <motion.div
              initial={{ opacity: 0.5 }}
              animate={{ opacity: canUseProFeatures ? 1 : 0.5 }}
              className="flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Zap className={cn(
                    "w-4 h-4",
                    canUseProFeatures ? "text-yellow-400" : "text-gray-400"
                  )} />
                  <label className={cn(
                    "text-sm font-medium",
                    canUseProFeatures ? "text-white" : "text-gray-400"
                  )}>
                    Turbo Edits
                  </label>
                </div>
                <p className="text-xs text-gray-400">
                  Faster file updates using optimized models
                </p>
              </div>
              <Switch
                checked={Boolean(settings?.enableProLazyEditsMode)}
                onCheckedChange={toggleLazyEdits}
                disabled={!canUseProFeatures}
              />
            </motion.div>

            {/* Smart Context */}
            <motion.div
              initial={{ opacity: 0.5 }}
              animate={{ opacity: canUseProFeatures ? 1 : 0.5 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2">
                <Brain className={cn(
                  "w-4 h-4",
                  canUseProFeatures ? "text-blue-400" : "text-gray-400"
                )} />
                <label className={cn(
                  "text-sm font-medium",
                  canUseProFeatures ? "text-white" : "text-gray-400"
                )}>
                  Smart Context
                </label>
              </div>
              <p className="text-xs text-gray-400">
                Optimize token usage by intelligently selecting relevant code
              </p>

              {/* Context Mode Selector */}
              <div className="flex gap-1 p-1 bg-gray-800/50 rounded-lg">
                {[
                  { value: 'off', label: 'Off', desc: 'Use full codebase' },
                  { value: 'conservative', label: 'Conservative', desc: 'Smart selection' },
                  { value: 'balanced', label: 'Balanced', desc: 'Optimized balance' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSmartContextChange(option.value as any)}
                    disabled={!canUseProFeatures}
                    className={cn(
                      "flex-1 px-3 py-2 rounded-md text-xs transition-all",
                      currentSmartContextValue === option.value
                        ? "bg-primary-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-700/50",
                      !canUseProFeatures && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs opacity-75">{option.desc}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          {canUseProFeatures && (
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <Settings className="w-3 h-3" />
                <span>All Pro features are now active</span>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
