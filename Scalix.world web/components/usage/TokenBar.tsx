'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  MessageSquare,
  Code,
  Bot,
  AlignLeft,
  ExternalLink,
  Info
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface TokenUsageData {
  totalTokens: number
  messageHistoryTokens: number
  codebaseTokens: number
  mentionedAppsTokens: number
  systemPromptTokens: number
  inputTokens: number
  contextWindow: number
}

interface TokenBarProps {
  usageData: TokenUsageData | null
  isProEnabled?: boolean
  isSmartContextEnabled?: boolean
  className?: string
}

export function TokenBar({
  usageData,
  isProEnabled = false,
  isSmartContextEnabled = false,
  className
}: TokenBarProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  if (!usageData) {
    return (
      <Card className={cn("glass", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-center text-sm text-gray-400">
            <Info className="w-4 h-4 mr-2" />
            No token usage data available
          </div>
        </CardContent>
      </Card>
    )
  }

  const {
    totalTokens,
    messageHistoryTokens,
    codebaseTokens,
    mentionedAppsTokens,
    systemPromptTokens,
    inputTokens,
    contextWindow,
  } = usageData

  const percentUsed = Math.min((totalTokens / contextWindow) * 100, 100)

  // Calculate widths for each token type
  const messageHistoryPercent = (messageHistoryTokens / contextWindow) * 100
  const codebasePercent = (codebaseTokens / contextWindow) * 100
  const mentionedAppsPercent = (mentionedAppsTokens / contextWindow) * 100
  const systemPromptPercent = (systemPromptTokens / contextWindow) * 100
  const inputPercent = (inputTokens / contextWindow) * 100

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Main Token Display */}
      <Card className="glass">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium text-white">Token Usage</span>
            </div>
            <Badge
              variant="secondary"
              className={cn(
                "text-xs",
                percentUsed >= 90
                  ? "bg-red-500/20 text-red-300"
                  : percentUsed >= 70
                  ? "bg-yellow-500/20 text-yellow-300"
                  : "bg-green-500/20 text-green-300"
              )}
            >
              {Math.round(percentUsed)}% used
            </Badge>
          </div>

          {/* Token Count */}
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span>{totalTokens.toLocaleString()} tokens</span>
            <span>
              {Math.round(percentUsed)}% of {(contextWindow / 1000).toFixed(0)}K limit
            </span>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              {/* Message history tokens */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(messageHistoryPercent, 100)}%` }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="h-full bg-blue-500 float-left"
              />
              {/* Codebase tokens */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(codebasePercent, 100)}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-full bg-green-500 float-left"
              />
              {/* Mentioned apps tokens */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(mentionedAppsPercent, 100)}%` }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="h-full bg-orange-500 float-left"
              />
              {/* System prompt tokens */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(systemPromptPercent, 100)}%` }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="h-full bg-purple-500 float-left"
              />
              {/* Input tokens */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(inputPercent, 100)}%` }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="h-full bg-yellow-500 float-left"
              />
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-2 mt-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-gray-400">Messages</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-gray-400">Codebase</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span className="text-gray-400">Apps</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span className="text-gray-400">System</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span className="text-gray-400">Input</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Breakdown Tooltip */}
      <Card
        className={cn(
          "glass transition-all duration-300",
          showTooltip ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        <CardContent className="p-4">
          <h4 className="text-sm font-medium text-white mb-3 flex items-center">
            <Info className="w-4 h-4 mr-2" />
            Token Usage Breakdown
          </h4>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">Message History</span>
              </div>
              <span className="text-white font-medium">
                {messageHistoryTokens.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Codebase</span>
              </div>
              <span className="text-white font-medium">
                {codebaseTokens.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-orange-400" />
                <span className="text-gray-300">Mentioned Apps</span>
              </div>
              <span className="text-white font-medium">
                {mentionedAppsTokens.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-400" />
                <span className="text-gray-300">System Prompt</span>
              </div>
              <span className="text-white font-medium">
                {systemPromptTokens.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <AlignLeft className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-300">Current Input</span>
              </div>
              <span className="text-white font-medium">
                {inputTokens.toLocaleString()}
              </span>
            </div>

            <div className="border-t border-white/10 pt-2 mt-3">
              <div className="flex items-center justify-between text-sm font-medium">
                <span className="text-white">Total</span>
                <span className="text-white">
                  {totalTokens.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pro Features Promotion */}
      {(!isProEnabled || !isSmartContextEnabled) && (
        <Card className="glass border-primary-500/30">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Bot className="w-5 h-5 text-primary-400" />
                <span className="text-sm font-medium text-primary-300">
                  Optimize Your Tokens
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-3">
                {isProEnabled
                  ? "Enable Smart Context to reduce token usage by up to 80%"
                  : "Upgrade to Pro for advanced token optimization features"
                }
              </p>
              <button
                onClick={() => {
                  if (isProEnabled) {
                    // Navigate to settings
                    window.location.href = '/dashboard/settings'
                  } else {
                    // Navigate to pricing
                    window.location.href = '/pricing'
                  }
                }}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
              >
                {isProEnabled ? 'Enable Smart Context' : 'Upgrade to Pro'}
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
