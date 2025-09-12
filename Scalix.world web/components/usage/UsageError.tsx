'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import {
  AlertTriangle,
  Zap,
  ExternalLink,
  X,
  CreditCard,
  Info
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface UsageErrorProps {
  error: string
  onDismiss?: () => void
  className?: string
}

export function UsageError({ error, onDismiss, className }: UsageErrorProps) {
  const getErrorType = (errorMessage: string) => {
    if (errorMessage.includes('LiteLLM Virtual Key expected') ||
        errorMessage.includes('Pro key') ||
        errorMessage.includes('subscription')) {
      return 'pro_required'
    }
    if (errorMessage.includes('ExceededBudget') ||
        errorMessage.includes('limit exceeded') ||
        errorMessage.includes('quota')) {
      return 'budget_exceeded'
    }
    if (errorMessage.includes('rate limit') ||
        errorMessage.includes('too many requests')) {
      return 'rate_limit'
    }
    return 'general'
  }

  const errorType = getErrorType(error)

  const getErrorConfig = () => {
    switch (errorType) {
      case 'pro_required':
        return {
          icon: CreditCard,
          title: 'Pro Features Required',
          message: 'Upgrade to Scalix Pro to access premium AI models and advanced features.',
          actionText: 'Upgrade to Pro',
          actionUrl: '/pricing',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/30',
          iconColor: 'text-blue-400'
        }
      case 'budget_exceeded':
        return {
          icon: Zap,
          title: 'Usage Limit Exceeded',
          message: 'You\'ve reached your monthly AI token limit. Upgrade to continue using premium features.',
          actionText: 'Upgrade Plan',
          actionUrl: '/pricing',
          bgColor: 'bg-orange-500/10',
          borderColor: 'border-orange-500/30',
          iconColor: 'text-orange-400'
        }
      case 'rate_limit':
        return {
          icon: AlertTriangle,
          title: 'Rate Limit Exceeded',
          message: 'Too many requests. Please wait a moment before trying again.',
          actionText: 'Try Again',
          actionUrl: null,
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/30',
          iconColor: 'text-yellow-400'
        }
      default:
        return {
          icon: Info,
          title: 'Usage Error',
          message: error,
          actionText: null,
          actionUrl: null,
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
          iconColor: 'text-red-400'
        }
    }
  }

  const config = getErrorConfig()
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={cn("", className)}
    >
      <Card className={cn("glass", config.bgColor, config.borderColor)}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", config.bgColor)}>
                  <Icon className={cn("w-4 h-4", config.iconColor)} />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white mb-1">
                  {config.title}
                </h4>
                <p className="text-sm text-gray-300 mb-3">
                  {config.message}
                </p>

                {config.actionText && config.actionUrl && (
                  <Button
                    size="sm"
                    className="bg-primary-600 hover:bg-primary-700 text-white"
                    onClick={() => window.location.href = config.actionUrl!}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {config.actionText}
                  </Button>
                )}

                {/* Additional context for specific errors */}
                {errorType === 'budget_exceeded' && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>Need more tokens immediately?</span>
                      <Badge variant="secondary" className="bg-gray-500/20 text-gray-300">
                        Contact Support
                      </Badge>
                    </div>
                  </div>
                )}

                {errorType === 'pro_required' && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="text-xs text-gray-400">
                      Pro features include access to GPT-4, Claude, advanced token optimization,
                      and priority support.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {onDismiss && (
              <button
                onClick={onDismiss}
                className="flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
