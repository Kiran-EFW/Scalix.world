'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import {
  Zap,
  Brain,
  Shield,
  Rocket,
  Code,
  FileText,
  Database,
  Globe,
  Cpu,
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle,
  Star,
  TrendingUp,
  Users,
  Clock,
  Target,
  Lightbulb
} from 'lucide-react'

const proFeatures = [
  {
    name: 'Scalix Engine',
    icon: <Brain className="w-8 h-8" />,
    tagline: 'Advanced AI Processing with Lazy Edits',
    description: 'Our proprietary AI engine optimized specifically for code generation and editing, featuring intelligent lazy edits that only modify what\'s necessary.',
    benefits: [
      '30% faster code generation',
      'Intelligent context awareness',
      'Lazy edits - minimal file changes',
      'Advanced reasoning capabilities',
      'Multi-file project understanding'
    ],
    demo: {
      title: 'Smart Code Refactoring',
      description: 'Watch how Scalix Engine intelligently refactors complex codebases with minimal changes.',
      video: '/api/placeholder/600/400'
    },
    metrics: {
      speed: '+40%',
      accuracy: '+25%',
      costSavings: '-20%'
    }
  },
  {
    name: 'Scalix Gateway',
    icon: <Globe className="w-8 h-8" />,
    tagline: 'Intelligent API Routing & Optimization',
    description: 'Smart routing system that automatically selects the best AI model for your specific use case, balancing cost, speed, and quality.',
    benefits: [
      'Automatic model selection',
      'Cost optimization across providers',
      'Load balancing and failover',
      'Real-time performance monitoring',
      'Dynamic rate limit management'
    ],
    demo: {
      title: 'Intelligent Model Routing',
      description: 'See how Gateway automatically routes requests to the optimal AI model based on complexity and cost.',
      video: '/api/placeholder/600/400'
    },
    metrics: {
      efficiency: '+35%',
      costReduction: '-25%',
      uptime: '99.9%'
    }
  },
  {
    name: 'Smart Context',
    icon: <Target className="w-8 h-8" />,
    tagline: 'Intelligent File Selection & Context Management',
    description: 'Advanced algorithms that automatically identify and include only the most relevant files for your AI requests, improving accuracy and reducing costs.',
    benefits: [
      'Automatic file relevance scoring',
      'Context size optimization',
      'Dependency analysis',
      'Project structure understanding',
      'Dynamic context updates'
    ],
    demo: {
      title: 'Context Intelligence',
      description: 'Experience how Smart Context automatically identifies relevant files for complex refactoring tasks.',
      video: '/api/placeholder/600/400'
    },
    metrics: {
      relevance: '+50%',
      contextEfficiency: '+60%',
      accuracy: '+30%'
    }
  },
  {
    name: 'Advanced Analytics',
    icon: <TrendingUp className="w-8 h-8" />,
    tagline: 'Comprehensive Usage & Performance Insights',
    description: 'Deep analytics into your AI usage patterns, costs, performance metrics, and optimization opportunities.',
    benefits: [
      'Real-time usage monitoring',
      'Cost breakdown by project/model',
      'Performance trend analysis',
      'Optimization recommendations',
      'Team collaboration insights'
    ],
    demo: {
      title: 'Analytics Dashboard',
      description: 'Explore comprehensive analytics showing usage patterns, costs, and performance insights.',
      video: '/api/placeholder/600/400'
    },
    metrics: {
      visibility: '+100%',
      optimization: '+40%',
      insights: 'Real-time'
    }
  }
]

const pricingPlans = [
  {
    name: 'Pro',
    price: '$29',
    period: 'per month',
    description: 'Perfect for individual developers and small teams',
    features: [
      'Scalix Engine access',
      'Scalix Gateway routing',
      'Smart Context (unlimited)',
      'Advanced Analytics',
      '10,000 AI tokens/month',
      'Priority support',
      'All AI providers',
      'API access'
    ],
    popular: true,
    buttonText: 'Start Pro Trial'
  },
  {
    name: 'Team',
    price: '$99',
    period: 'per month',
    description: 'For growing teams and organizations',
    features: [
      'Everything in Pro',
      'Team collaboration tools',
      'Admin dashboard',
      'Custom integrations',
      '50,000 AI tokens/month',
      'Dedicated support manager',
      'Advanced security',
      'Audit logs',
      '5 team members included'
    ],
    popular: false,
    buttonText: 'Start Team Trial'
  }
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Senior Developer at TechCorp',
    avatar: 'SC',
    content: 'Scalix Engine\'s lazy edits feature saved us hundreds of hours. The AI understands our codebase better than any other tool we\'ve tried.',
    metrics: '40% faster development, 60% fewer bugs'
  },
  {
    name: 'Mike Rodriguez',
    role: 'CTO at StartupXYZ',
    avatar: 'MR',
    content: 'The Gateway\'s automatic model selection has reduced our AI costs by 35% while maintaining high quality. It\'s like having an AI expert managing our requests.',
    metrics: '$2,500 monthly savings, 99.9% uptime'
  },
  {
    name: 'Emma Thompson',
    role: 'Lead Engineer at InnovateLab',
    avatar: 'ET',
    content: 'Smart Context is a game-changer. It automatically finds the right files, saving us time and improving code quality significantly.',
    metrics: '50% faster code reviews, 25% better accuracy'
  }
]

export default function ProPage() {
  const [selectedFeature, setSelectedFeature] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

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
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 border border-primary-200 text-primary-700 text-sm font-medium mb-6">
              <Star className="w-4 h-4 mr-2" />
              Scalix Pro - Advanced AI Development
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Unlock the Power of
              <span className="block text-primary-600">Scalix Pro</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Experience advanced AI features designed specifically for professional developers.
              From intelligent code generation to automated optimization.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#features">
                <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white">
                  Explore Pro Features
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg">
                  View Pricing
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white" id="features">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Advanced AI Features for Professionals
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Proprietary technology that sets Scalix apart from other AI development platforms
            </p>
          </motion.div>

          {/* Feature Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {proFeatures.map((feature, index) => (
              <button
                key={feature.name}
                onClick={() => setSelectedFeature(index)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedFeature === index
                    ? 'bg-primary-100 text-primary-800 border border-primary-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {feature.name}
              </button>
            ))}
          </div>

          {/* Selected Feature Detail */}
          <motion.div
            key={selectedFeature}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
          >
            <div className="md:flex">
              <div className="md:w-1/2 p-8">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-primary-100 rounded-lg text-primary-600 mr-4">
                    {proFeatures[selectedFeature].icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {proFeatures[selectedFeature].name}
                    </h3>
                    <p className="text-primary-600 font-medium">
                      {proFeatures[selectedFeature].tagline}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {proFeatures[selectedFeature].description}
                </p>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Benefits:</h4>
                  <ul className="space-y-2">
                    {proFeatures[selectedFeature].benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Performance Metrics */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Performance Impact:</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(proFeatures[selectedFeature].metrics).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-lg font-bold text-primary-600">{value}</div>
                        <div className="text-xs text-gray-500 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:w-1/2 bg-gray-50 p-8 flex flex-col justify-center">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {proFeatures[selectedFeature].demo.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4">
                    {proFeatures[selectedFeature].demo.description}
                  </p>

                  <div className="aspect-video bg-gradient-to-br from-primary-400 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center text-white">
                      <Play className="w-12 h-12 mx-auto mb-2 opacity-80" />
                      <p className="text-sm opacity-90">Interactive Demo</p>
                    </div>
                  </div>

                  <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white">
                    Watch Demo
                    <Play className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Pro Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start with Pro and unlock all advanced features, or go with Team for collaboration tools
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-white rounded-2xl shadow-lg border p-8 ${
                  plan.popular
                    ? 'border-primary-500 ring-2 ring-primary-500/20'
                    : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">/{plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/pricing">
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'bg-primary-600 hover:bg-primary-700 text-white'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Pro Users Are Saying
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from developers using Scalix Pro features
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">
                  "{testimonial.content}"
                </p>

                <div className="bg-primary-50 rounded-lg p-3">
                  <div className="text-sm font-medium text-primary-900">
                    Results: {testimonial.metrics}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Supercharge Your Development?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of professional developers using Scalix Pro to build better software faster.
              Experience the difference advanced AI features make.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-50">
                  Start Pro Trial
                  <Rocket className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                  View Documentation
                </Button>
              </Link>
            </div>

            <div className="mt-8 text-primary-200 text-sm">
              ✨ 14-day free trial • No credit card required • Cancel anytime
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
