'use client'

import { motion } from 'framer-motion'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

const features = [
  {
    icon: '🚀',
    title: 'Local First Architecture',
    description: 'Run everything on your machine. No vendor lock-in, no data sent to external servers.',
    details: [
      'Complete data privacy and security',
      'Zero network dependency for core functionality',
      'Offline-first design for uninterrupted workflow',
      'Full control over your development environment'
    ],
    useCase: 'Perfect for sensitive projects, compliance requirements, or offline development environments.'
  },
  {
    icon: '🛠️',
    title: 'Bring Your Own Keys',
    description: 'Use your own AI API keys. Full control over your data and costs.',
    details: [
      'Connect to Scalix AI models or bring your own API keys',
      'Pay only for what you use directly to providers',
      'No hidden fees or markup on API costs',
      'Switch providers anytime without platform changes'
    ],
    useCase: 'Ideal for enterprises with existing AI provider contracts or cost optimization strategies.'
  },
  {
    icon: '⚡',
    title: 'Lightning Fast Performance',
    description: 'Optimized for speed with local processing and smart caching.',
    details: [
      'Local AI model inference for instant responses',
      'Intelligent caching of frequently used patterns',
      'Parallel processing for multiple tasks',
      'Minimal latency compared to cloud-based solutions'
    ],
    useCase: 'Essential for real-time applications, rapid prototyping, and high-frequency AI interactions.'
  },
  {
    icon: '🔒',
    title: 'Privacy & Security First',
    description: 'Your code and conversations stay private on your local machine.',
    details: [
      'End-to-end encryption for all data',
      'No telemetry or usage tracking',
      'SOC 2 compliant architecture',
      'GDPR and CCPA compliant by design'
    ],
    useCase: 'Critical for healthcare, finance, legal, and other regulated industries.'
  },
  {
    icon: '🌐',
    title: 'Cross Platform Compatibility',
    description: 'Works on Windows, macOS, and Linux. Download and run anywhere.',
    details: [
      'Native desktop applications for all major platforms',
      'Consistent experience across operating systems',
      'Automatic updates and version management',
      'Container support for deployment flexibility'
    ],
    useCase: 'Great for distributed teams, remote work, and multi-environment development.'
  },
  {
    icon: '🎯',
    title: 'Advanced AI Integration',
    description: 'Latest AI models with advanced reasoning and code generation.',
    details: [
      'Support for Scalix AI models and local models',
      'Advanced prompt engineering and context management',
      'Multi-modal AI capabilities (text, code, images)',
      'Custom model fine-tuning support'
    ],
    useCase: 'Perfect for complex AI applications, research projects, and cutting-edge development.'
  },
  {
    icon: '🔧',
    title: 'Developer-Friendly Tools',
    description: 'Comprehensive toolkit for modern AI development workflows.',
    details: [
      'Integrated development environment',
      'Version control integration',
      'API testing and debugging tools',
      'Performance monitoring and analytics'
    ],
    useCase: 'Designed for both individual developers and development teams.'
  },
  {
    icon: '📊',
    title: 'Analytics & Insights',
    description: 'Track usage, performance, and optimize your AI applications.',
    details: [
      'Real-time usage analytics',
      'Performance metrics and bottlenecks',
      'Cost tracking and optimization',
      'A/B testing capabilities'
    ],
    useCase: 'Essential for optimizing AI applications and understanding usage patterns.'
  }
]

const stats = [
  { value: '10K+', label: 'AI Tokens Saved Monthly' },
  { value: '99.9%', label: 'Local Processing Uptime' },
  { value: '50+', label: 'Built-in AI Models' },
  { value: '24/7', label: 'Offline Availability' },
  { value: '0', label: 'Data Sent to External Servers' },
  { value: '∞', label: 'Platform Freedom' }
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-purple-50">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Powerful Features for
              <span className="block text-primary-600">Modern AI Development</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover why thousands of developers choose Scalix for their AI-powered applications.
              Built for privacy, performance, and productivity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing">
                <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white">
                  Start Building Free
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline" size="lg">
                  View Documentation
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-primary-600 mb-2">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Features */}
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
              Everything You Need to Build AI Apps
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive features designed to accelerate your AI development workflow
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Benefits:</h4>
                  <ul className="space-y-2">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-primary-50 rounded-lg p-4">
                  <h4 className="font-semibold text-primary-900 mb-2">Perfect For:</h4>
                  <p className="text-primary-700">{feature.useCase}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Experience These Features?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of developers building the future of AI applications with Scalix.
              Start building locally, for free, today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-50">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                  View Documentation
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
