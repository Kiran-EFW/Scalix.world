'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Sparkles, Zap, Brain, Bot, Crown } from 'lucide-react'

interface ProSuccessDialogProps {
  isOpen: boolean
  onClose: () => void
  planName?: string
}

export function ProSuccessDialog({
  isOpen,
  onClose,
  planName = 'Pro'
}: ProSuccessDialogProps) {
  const features = [
    {
      icon: Bot,
      title: 'Premium AI Models',
      description: 'Access to GPT-4, Claude, and other leading models'
    },
    {
      icon: Brain,
      title: 'Smart Context',
      description: 'Intelligent code analysis and token optimization'
    },
    {
      icon: Zap,
      title: 'Turbo Edits',
      description: 'Faster file operations with optimized processing'
    },
    {
      icon: Crown,
      title: 'Priority Support',
      description: 'Direct access to our development team'
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg glass">
        <DialogHeader>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center mb-4"
          >
            <div className="relative">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </motion.div>
            </div>
          </motion.div>

          <DialogTitle className="text-center text-2xl text-white">
            Welcome to Scalix {planName}!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center"
          >
            <p className="text-gray-300 mb-2">
              Congratulations! Your Scalix {planName} subscription is now active.
            </p>
            <p className="text-sm text-gray-400">
              You now have access to all premium features and enhanced AI capabilities.
            </p>
          </motion.div>

          {/* Plan Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center"
          >
            <Badge className="bg-primary-500/20 text-primary-300 border-primary-400/30 px-4 py-2 text-sm">
              <Crown className="w-4 h-4 mr-2" />
              {planName} Plan Active
            </Badge>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid grid-cols-1 gap-3"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              >
                <Card className="glass border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center">
                          <feature.icon className="w-4 h-4 text-primary-400" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-white mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {feature.description}
                        </p>
                      </div>
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <Card className="glass border-blue-500/30 bg-blue-500/5">
              <CardContent className="p-4">
                <div className="text-center">
                  <h4 className="text-sm font-medium text-blue-300 mb-2">
                    What's Next?
                  </h4>
                  <p className="text-xs text-blue-400/80 mb-3">
                    Click the Pro button in your dashboard to configure your new features and start optimizing your AI workflow.
                  </p>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      onClose()
                      // Could navigate to dashboard or settings
                      window.location.href = '/dashboard'
                    }}
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <DialogFooter className="flex justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <Button
              onClick={onClose}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Get Started
            </Button>
          </motion.div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
