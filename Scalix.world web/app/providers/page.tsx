'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import {
  Zap,
  DollarSign,
  Clock,
  Brain,
  Check,
  X,
  Star,
  TrendingUp,
  Award,
  Cpu,
  Globe,
  Shield,
  Code,
  MessageSquare,
  Image,
  Music,
  Calculator
} from 'lucide-react'

const providers = [
  {
    name: 'OpenAI',
    logo: '🤖',
    models: ['GPT-4', 'GPT-3.5 Turbo', 'GPT-4 Turbo', 'GPT-4 Vision'],
    strengths: ['Best code generation', 'Excellent reasoning', 'Multi-modal support'],
    weaknesses: ['Higher cost', 'Rate limits', 'API stability issues'],
    useCases: ['Code generation', 'Complex reasoning', 'Creative writing', 'Data analysis'],
    pricing: {
      input: '$0.01/1K tokens',
      output: '$0.03/1K tokens',
      context: '128K tokens'
    },
    performance: {
      speed: 85,
      accuracy: 95,
      creativity: 90
    },
    features: {
      streaming: true,
      functionCalling: true,
      vision: true,
      audio: false,
      embedding: true
    },
    tier: 'Pro'
  },
  {
    name: 'Anthropic',
    logo: '🧠',
    models: ['Claude 3 Opus', 'Claude 3 Sonnet', 'Claude 3 Haiku'],
    strengths: ['Safety & alignment', 'Long context', 'Consistent responses'],
    weaknesses: ['Slower than GPT-4', 'Limited multi-modal', 'Newer ecosystem'],
    useCases: ['Safety-critical apps', 'Long documents', 'Consistent output', 'Research'],
    pricing: {
      input: '$0.015/1K tokens',
      output: '$0.075/1K tokens',
      context: '200K tokens'
    },
    performance: {
      speed: 75,
      accuracy: 92,
      creativity: 85
    },
    features: {
      streaming: true,
      functionCalling: true,
      vision: false,
      audio: false,
      embedding: false
    },
    tier: 'Pro'
  },
  {
    name: 'Google',
    logo: '🌐',
    models: ['Gemini Pro', 'Gemini Flash', 'Gemini Vision'],
    strengths: ['Fast & efficient', 'Multi-modal', 'Google ecosystem'],
    weaknesses: ['Inconsistent quality', 'Limited context', 'Less creative'],
    useCases: ['Quick tasks', 'Image analysis', 'Google Workspace integration'],
    pricing: {
      input: '$0.0005/1K tokens',
      output: '$0.0015/1K tokens',
      context: '32K tokens'
    },
    performance: {
      speed: 95,
      accuracy: 88,
      creativity: 78
    },
    features: {
      streaming: true,
      functionCalling: true,
      vision: true,
      audio: false,
      embedding: true
    },
    tier: 'Free'
  },
  {
    name: 'Scalix Engine',
    logo: '⚡',
    models: ['Scalix Engine Pro', 'Scalix Engine Lite'],
    strengths: ['Optimized for coding', 'Lazy edits', 'Smart context', 'Local processing'],
    weaknesses: ['Limited general tasks', 'Requires Pro subscription'],
    useCases: ['Code generation', 'File editing', 'Project refactoring', 'Debugging'],
    pricing: {
      input: '$0.02/1K tokens',
      output: '$0.02/1K tokens',
      context: 'Unlimited'
    },
    performance: {
      speed: 90,
      accuracy: 96,
      creativity: 82
    },
    features: {
      streaming: true,
      functionCalling: true,
      vision: false,
      audio: false,
      embedding: true,
      lazyEdits: true,
      smartContext: true
    },
    tier: 'Pro'
  },
  {
    name: 'Ollama (Local)',
    logo: '🏠',
    models: ['Llama 2', 'Code Llama', 'Mistral', 'Phi'],
    strengths: ['Completely free', 'Privacy-focused', 'No API limits'],
    weaknesses: ['Requires local hardware', 'Variable quality', 'Setup complexity'],
    useCases: ['Offline development', 'Privacy-critical work', 'Learning AI'],
    pricing: {
      input: '$0.00',
      output: '$0.00',
      context: '4K-128K tokens'
    },
    performance: {
      speed: 70,
      accuracy: 75,
      creativity: 70
    },
    features: {
      streaming: true,
      functionCalling: false,
      vision: false,
      audio: false,
      embedding: false,
      local: true
    },
    tier: 'Free'
  },
  {
    name: 'Azure OpenAI',
    logo: '☁️',
    models: ['GPT-4', 'GPT-3.5 Turbo', 'GPT-4 Vision'],
    strengths: ['Enterprise security', '99.9% uptime', 'Custom deployments'],
    weaknesses: ['Higher cost', 'Complex setup', 'Vendor lock-in'],
    useCases: ['Enterprise applications', 'Compliance requirements', 'Large scale deployment'],
    pricing: {
      input: '$0.01/1K tokens',
      output: '$0.03/1K tokens',
      context: '128K tokens'
    },
    performance: {
      speed: 85,
      accuracy: 95,
      creativity: 90
    },
    features: {
      streaming: true,
      functionCalling: true,
      vision: true,
      audio: false,
      embedding: true,
      enterprise: true
    },
    tier: 'Enterprise'
  }
]

const useCases = [
  {
    name: 'Code Generation',
    icon: <Code className="w-5 h-5" />,
    description: 'Writing and modifying code',
    recommended: ['OpenAI', 'Scalix Engine', 'Anthropic']
  },
  {
    name: 'Chat & Conversation',
    icon: <MessageSquare className="w-5 h-5" />,
    description: 'General conversation and assistance',
    recommended: ['OpenAI', 'Anthropic', 'Google']
  },
  {
    name: 'Image Analysis',
    icon: <Image className="w-5 h-5" />,
    description: 'Understanding and describing images',
    recommended: ['OpenAI', 'Google']
  },
  {
    name: 'Data Analysis',
    icon: <Calculator className="w-5 h-5" />,
    description: 'Processing and analyzing data',
    recommended: ['OpenAI', 'Anthropic']
  },
  {
    name: 'Creative Writing',
    icon: <Award className="w-5 h-5" />,
    description: 'Content creation and storytelling',
    recommended: ['OpenAI', 'Anthropic', 'Google']
  }
]

export default function ProvidersPage() {
  const [selectedUseCase, setSelectedUseCase] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('performance')

  const filteredProviders = selectedUseCase
    ? providers.filter(provider =>
        useCases.find(uc => uc.name === selectedUseCase)?.recommended.includes(provider.name)
      )
    : providers

  const sortedProviders = [...filteredProviders].sort((a, b) => {
    switch (sortBy) {
      case 'cost':
        return parseFloat(a.pricing.input.slice(1)) - parseFloat(b.pricing.input.slice(1))
      case 'speed':
        return b.performance.speed - a.performance.speed
      case 'accuracy':
        return b.performance.accuracy - a.performance.accuracy
      default:
        return (b.performance.speed + b.performance.accuracy) / 2 - (a.performance.speed + a.performance.accuracy) / 2
    }
  })

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              AI Provider
              <span className="block text-primary-600">Comparison Hub</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Compare AI models, performance, pricing, and features across all supported providers.
              Find the perfect model for your use case.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#comparison">
                <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white">
                  Compare Providers
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg">
                  View Live Performance
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Use Case Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">Filter by Use Case</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedUseCase(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedUseCase === null
                  ? 'bg-primary-100 text-primary-800 border border-primary-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Use Cases
            </button>
            {useCases.map((useCase) => (
              <button
                key={useCase.name}
                onClick={() => setSelectedUseCase(useCase.name)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                  selectedUseCase === useCase.name
                    ? 'bg-primary-100 text-primary-800 border border-primary-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {useCase.icon}
                <span className="ml-2">{useCase.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Sort Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900">
            Provider Comparison {selectedUseCase && `- ${selectedUseCase}`}
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="performance">Overall Performance</option>
              <option value="speed">Speed</option>
              <option value="cost">Cost Efficiency</option>
              <option value="accuracy">Accuracy</option>
            </select>
          </div>
        </motion.div>

        {/* Provider Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="comparison">
          {sortedProviders.map((provider, index) => (
            <motion.div
              key={provider.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{provider.logo}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{provider.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        provider.tier === 'Free' ? 'bg-green-100 text-green-800' :
                        provider.tier === 'Pro' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {provider.tier}
                      </span>
                      <span className="text-sm text-gray-500">{provider.models.length} models</span>
                    </div>
                  </div>
                </div>
                <Star className="w-5 h-5 text-yellow-400" />
              </div>

              {/* Performance Metrics */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Performance</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{provider.performance.speed}</div>
                    <div className="text-xs text-gray-500">Speed</div>
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                      <div
                        className="bg-blue-500 h-1 rounded-full"
                        style={{ width: `${provider.performance.speed}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{provider.performance.accuracy}</div>
                    <div className="text-xs text-gray-500">Accuracy</div>
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                      <div
                        className="bg-green-500 h-1 rounded-full"
                        style={{ width: `${provider.performance.accuracy}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{provider.performance.creativity}</div>
                    <div className="text-xs text-gray-500">Creativity</div>
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                      <div
                        className="bg-purple-500 h-1 rounded-full"
                        style={{ width: `${provider.performance.creativity}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Pricing</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Input</div>
                    <div className="font-medium text-gray-900">{provider.pricing.input}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Output</div>
                    <div className="font-medium text-gray-900">{provider.pricing.output}</div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Context: {provider.pricing.context}
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Features</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center space-x-2">
                    {provider.features.streaming ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />}
                    <span className={provider.features.streaming ? 'text-gray-700' : 'text-gray-400'}>Streaming</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {provider.features.vision ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />}
                    <span className={provider.features.vision ? 'text-gray-700' : 'text-gray-400'}>Vision</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {provider.features.functionCalling ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />}
                    <span className={provider.features.functionCalling ? 'text-gray-700' : 'text-gray-400'}>Functions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {provider.features.local ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />}
                    <span className={provider.features.local ? 'text-gray-700' : 'text-gray-400'}>Local</span>
                  </div>
                </div>
              </div>

              {/* Strengths & Use Cases */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Best For:</h4>
                <div className="flex flex-wrap gap-1">
                  {provider.useCases.slice(0, 3).map((useCase) => (
                    <span key={useCase} className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full">
                      {useCase}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="flex space-x-2">
                <Button className="flex-1" variant="outline">
                  Learn More
                </Button>
                <Button
                  className={`flex-1 ${
                    provider.tier === 'Free'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-primary-600 hover:bg-primary-700 text-white'
                  }`}
                >
                  {provider.tier === 'Free' ? 'Use Free' : 'Upgrade to Pro'}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scalix Advantage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-8 text-white"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">The Scalix Advantage</h2>
            <p className="text-xl mb-6 opacity-90">
              Why choose Scalix over direct API access?
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <Shield className="w-12 h-12 mx-auto mb-3 opacity-90" />
                <h3 className="text-lg font-semibold mb-2">Unified Interface</h3>
                <p className="opacity-90">One API key, access to all providers with intelligent routing</p>
              </div>
              <div className="text-center">
                <Zap className="w-12 h-12 mx-auto mb-3 opacity-90" />
                <h3 className="text-lg font-semibold mb-2">Smart Optimization</h3>
                <p className="opacity-90">Automatic model selection based on your needs and budget</p>
              </div>
              <div className="text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-90" />
                <h3 className="text-lg font-semibold mb-2">Cost Savings</h3>
                <p className="opacity-90">Up to 30% cost reduction through intelligent provider switching</p>
              </div>
            </div>

            <div className="mt-8">
              <Link href="/pricing">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-50">
                  Get Started with Scalix
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

      </div>

      <Footer />
    </div>
  )
}
