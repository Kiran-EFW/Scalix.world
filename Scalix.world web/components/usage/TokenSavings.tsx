'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TokenSavingsProps {
  originalTokens: number
  optimizedTokens: number
  className?: string
  showAnimation?: boolean
}

export function TokenSavings({
  originalTokens,
  optimizedTokens,
  className,
  showAnimation = true
}: TokenSavingsProps) {
  const tokensSaved = originalTokens - optimizedTokens
  const percentageSaved = Math.round((tokensSaved / originalTokens) * 100)

  // Don't show if savings are minimal or negative
  if (tokensSaved <= 0 || percentageSaved < 5) {
    return null
  }

  return (
    <motion.div
      initial={showAnimation ? { opacity: 0, y: 10 } : {}}
      animate={showAnimation ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.3 }}
      className={cn("", className)}
    >
      <Card className="glass border-green-500/30 bg-green-500/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-green-500/20 rounded-lg">
                <Zap className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-green-300">
                    Smart Context Active
                  </span>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-300 text-xs">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    {percentageSaved}% saved
                  </Badge>
                </div>
                <p className="text-xs text-green-400/80">
                  Reduced token usage by {tokensSaved.toLocaleString()} tokens
                </p>
              </div>
            </div>

            {/* Progress visualization */}
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <div className="text-xs text-gray-400">
                  {optimizedTokens.toLocaleString()}
                </div>
                <div className="text-xs text-green-400">
                  -{tokensSaved.toLocaleString()}
                </div>
              </div>

              {/* Mini progress bar */}
              <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-green-500 to-green-400"
                />
              </div>
            </div>
          </div>

          {/* Additional info */}
          <div className="mt-3 pt-3 border-t border-green-500/20">
            <p className="text-xs text-gray-400">
              Smart Context analyzes your codebase and includes only the most relevant files,
              significantly reducing token usage while maintaining AI accuracy.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
