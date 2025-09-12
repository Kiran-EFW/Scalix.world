import React from 'react'
import { OnboardingStep } from './OnboardingProvider'
import { MessageCircle, BarChart3, Zap, Rocket, Sparkles } from 'lucide-react'

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Scalix AI',
    description: 'Your AI development platform',
    target: '[data-onboarding="hero"]',
    placement: 'bottom',
    content: (
      <div className="space-y-3">
        <p className="text-sm">
          Welcome to <strong>Scalix AI</strong> - the most advanced platform for building AI applications locally and at scale.
        </p>
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-800">
            🎯 <strong>What you'll discover:</strong>
          </p>
          <ul className="text-sm text-blue-700 mt-2 space-y-1">
            <li>• Real-time AI chat with multiple models</li>
            <li>• Live analytics dashboard</li>
            <li>• Advanced model comparison tools</li>
            <li>• Enterprise-grade performance</li>
          </ul>
        </div>
      </div>
    ),
    showSkip: true,
    showPrevious: false
  },
  {
    id: 'ai-chat',
    title: 'AI Chat Assistant',
    description: 'Your intelligent coding companion',
    target: '[data-onboarding="ai-chat"]',
    placement: 'left',
    content: (
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          <span className="font-medium">AI Chat Assistant</span>
        </div>
        <p className="text-sm">
          Get instant help from our intelligent AI assistant powered by GPT-4, Claude, and other leading models.
        </p>
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-green-800 mb-2">💡 Try asking:</p>
          <ul className="text-sm text-green-700 space-y-1">
            <li>"Create a React dashboard component"</li>
            <li>"Help me optimize this API"</li>
            <li>"Explain this algorithm"</li>
          </ul>
        </div>
        <p className="text-xs text-gray-600">
          The chat assistant is always available and provides context-aware responses.
        </p>
      </div>
    ),
    showSkip: true
  },
  {
    id: 'dashboard',
    title: 'Analytics Dashboard',
    description: 'Real-time insights into your AI usage',
    target: '[data-onboarding="dashboard"]',
    placement: 'top',
    content: (
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          <span className="font-medium">Analytics Dashboard</span>
        </div>
        <p className="text-sm">
          Monitor your AI usage with our comprehensive real-time analytics dashboard.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 p-2 rounded text-center">
            <div className="text-lg font-bold text-blue-600">15,420</div>
            <div className="text-xs text-blue-700">Total Users</div>
          </div>
          <div className="bg-green-50 p-2 rounded text-center">
            <div className="text-lg font-bold text-green-600">99.9%</div>
            <div className="text-xs text-green-700">Uptime</div>
          </div>
        </div>
        <p className="text-xs text-gray-600">
          Track performance, costs, and usage patterns in real-time.
        </p>
      </div>
    ),
    showSkip: true
  },
  {
    id: 'performance',
    title: 'Lightning Fast Performance',
    description: 'Enterprise-grade speed and reliability',
    target: '[data-onboarding="performance"]',
    placement: 'right',
    content: (
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-yellow-600" />
          <span className="font-medium">Performance Metrics</span>
        </div>
        <p className="text-sm">
          Experience enterprise-grade performance with sub-100ms response times and 99.9% uptime.
        </p>
        <div className="bg-yellow-50 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-yellow-800">Response Time</span>
            <span className="text-sm font-bold text-yellow-700">95ms</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-yellow-800">Uptime</span>
            <span className="text-sm font-bold text-yellow-700">99.9%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-yellow-800">Active Users</span>
            <span className="text-sm font-bold text-yellow-700">8,920</span>
          </div>
        </div>
      </div>
    ),
    showSkip: true
  },
  {
    id: 'get-started',
    title: 'Ready to Build!',
    description: 'Start your AI development journey',
    target: '[data-onboarding="get-started"]',
    placement: 'top',
    content: (
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Rocket className="w-5 h-5 text-green-600" />
          <span className="font-medium">You're All Set!</span>
        </div>
        <p className="text-sm">
          You've explored the key features of Scalix AI. Now you're ready to start building amazing AI applications!
        </p>
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg border border-green-200">
          <p className="text-sm font-medium text-green-800 mb-2">🚀 Next Steps:</p>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Try the AI chat assistant</li>
            <li>• Explore the analytics dashboard</li>
            <li>• Check out our documentation</li>
            <li>• Join our developer community</li>
          </ul>
        </div>
        <p className="text-xs text-gray-600">
          Remember, you can always restart this tour from your profile settings.
        </p>
      </div>
    ),
    showSkip: false,
    showPrevious: true
  }
]

export const QUICK_TOUR_STEPS: OnboardingStep[] = [
  {
    id: 'quick-welcome',
    title: 'Quick Tour',
    description: 'Essential features in 60 seconds',
    target: 'body',
    placement: 'top',
    content: (
      <div className="space-y-3">
        <p className="text-sm">
          Let's quickly show you the most important features of Scalix AI.
        </p>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <MessageCircle className="w-3 h-3 text-blue-600" />
            <span>AI Chat</span>
          </div>
          <div className="flex items-center space-x-1">
            <BarChart3 className="w-3 h-3 text-purple-600" />
            <span>Analytics</span>
          </div>
          <div className="flex items-center space-x-1">
            <Zap className="w-3 h-3 text-green-600" />
            <span>Performance</span>
          </div>
        </div>
      </div>
    ),
    showSkip: true,
    showPrevious: false
  },
  {
    id: 'quick-chat',
    title: 'AI Assistant',
    description: 'Click to chat with AI',
    target: '[data-onboarding="ai-chat"]',
    placement: 'left',
    content: (
      <div className="space-y-2">
        <p className="text-sm font-medium">💬 AI Chat Assistant</p>
        <p className="text-sm">
          Click here anytime to get instant help from our AI assistant powered by GPT-4 and Claude.
        </p>
      </div>
    ),
    showSkip: true
  },
  {
    id: 'quick-dashboard',
    title: 'Analytics Dashboard',
    description: 'Monitor your AI usage',
    target: '[data-onboarding="dashboard"]',
    placement: 'top',
    content: (
      <div className="space-y-2">
        <p className="text-sm font-medium">📊 Real-Time Analytics</p>
        <p className="text-sm">
          View live analytics, track costs, and monitor performance in real-time.
        </p>
      </div>
    ),
    showSkip: true
  },
  {
    id: 'quick-done',
    title: 'You\'re Ready!',
    description: 'Start building with AI',
    target: '[data-onboarding="get-started"]',
    placement: 'top',
    content: (
      <div className="space-y-2">
        <p className="text-sm font-medium">🎉 Welcome to Scalix AI!</p>
        <p className="text-sm">
          You're all set to start building amazing AI applications. Explore, experiment, and create!
        </p>
        <div className="flex items-center space-x-1 text-xs text-green-600">
          <Sparkles className="w-3 h-3" />
          <span>Happy building! 🚀</span>
        </div>
      </div>
    ),
    showSkip: false,
    showPrevious: true
  }
]
