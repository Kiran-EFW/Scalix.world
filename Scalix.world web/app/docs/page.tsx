'use client'

import { motion } from 'framer-motion'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Book, Code, Play, Settings, Users, Zap, Search, ArrowRight } from 'lucide-react'

const docSections = [
  {
    icon: <Play className="w-6 h-6" />,
    title: 'Getting Started',
    description: 'Quick start guide to get Scalix up and running on your machine',
    items: [
      'Installation & Setup',
      'First AI Project',
      'Basic Configuration',
      'Troubleshooting'
    ],
    color: 'bg-blue-500',
    href: '/docs/getting-started'
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: 'API Reference',
    description: 'Complete API documentation for integrating with Scalix',
    items: [
      'REST API Endpoints',
      'Authentication',
      'Rate Limits',
      'Error Handling'
    ],
    color: 'bg-green-500',
    href: '/dashboard/api-keys'
  },
  {
    icon: <Settings className="w-6 h-6" />,
    title: 'Configuration',
    description: 'Advanced configuration options and customization',
    items: [
      'Environment Setup',
      'Model Configuration',
      'Security Settings',
      'Performance Tuning'
    ],
    color: 'bg-purple-500',
    href: '/docs/configuration'
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'AI Models',
    description: 'Guide to using different AI models and providers',
    items: [
      'Supported Models',
      'Model Selection',
      'Custom Models',
      'Performance Comparison'
    ],
    color: 'bg-yellow-500',
    href: '/docs/models'
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Team Collaboration',
    description: 'Working with teams and sharing projects',
    items: [
      'Team Setup',
      'Project Sharing',
      'Access Control',
      'Collaboration Tools'
    ],
    color: 'bg-red-500',
    href: '/docs/collaboration'
  },
  {
    icon: <Book className="w-6 h-6" />,
    title: 'Best Practices',
    description: 'Tips and best practices for optimal AI development',
    items: [
      'Prompt Engineering',
      'Cost Optimization',
      'Security Guidelines',
      'Performance Tips'
    ],
    color: 'bg-indigo-500',
    href: '/docs/best-practices'
  }
]

const quickLinks = [
  { title: 'Get API Key', href: '/dashboard/api-keys', description: 'Generate and manage your Scalix API keys' },
  { title: 'Installation Guide', href: '/docs/installation', description: 'Step-by-step installation instructions' },
  { title: 'API Quick Start', href: '/docs/api-quickstart', description: 'Get started with the Scalix API' },
  { title: 'Troubleshooting', href: '/docs/troubleshooting', description: 'Common issues and solutions' },
  { title: 'Changelog', href: '/docs/changelog', description: 'Latest updates and changes' },
  { title: 'Community Forums', href: '/community', description: 'Get help from the community' },
  { title: 'Support Center', href: '/support', description: 'Contact our support team' }
]

const tutorials = [
  {
    title: 'Building Your First AI Chatbot',
    description: 'Learn how to create a conversational AI assistant using Scalix',
    difficulty: 'Beginner',
    duration: '15 min',
    href: '/docs/tutorials/chatbot'
  },
  {
    title: 'Integrating Multiple AI Models',
    description: 'Combine different AI models for better performance',
    difficulty: 'Intermediate',
    duration: '25 min',
    href: '/docs/tutorials/multi-model'
  },
  {
    title: 'Local AI Model Fine-tuning',
    description: 'Customize AI models for your specific use case',
    difficulty: 'Advanced',
    duration: '45 min',
    href: '/docs/tutorials/fine-tuning'
  },
  {
    title: 'Building a Code Review Assistant',
    description: 'Create an AI-powered code review tool',
    difficulty: 'Intermediate',
    duration: '30 min',
    href: '/docs/tutorials/code-review'
  }
]

export default function DocsPage() {
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
              Scalix Documentation
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Everything you need to know about building AI applications with Scalix.
              From getting started to advanced integrations.
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documentation..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/docs/getting-started">
                <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/dashboard/api-keys">
                <Button variant="outline" size="lg">
                  Get API Key
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Documentation Sections */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Documentation Sections
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our comprehensive documentation organized by topic
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {docSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className={`inline-flex p-3 rounded-lg ${section.color} text-white mb-4`}>
                  {section.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {section.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {section.description}
                </p>
                <ul className="space-y-1 mb-6">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm text-gray-500 flex items-center">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href={section.href}>
                  <Button variant="outline" className="w-full">
                    Explore {section.title}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tutorials Section */}
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
              Hands-on Tutorials
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn by doing with our step-by-step tutorials
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tutorials.map((tutorial, index) => (
              <motion.div
                key={tutorial.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {tutorial.title}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {tutorial.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tutorial.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                      tutorial.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {tutorial.difficulty}
                    </span>
                    <span className="text-sm text-gray-500">
                      {tutorial.duration}
                    </span>
                  </div>
                  <Link href={tutorial.href}>
                    <Button variant="outline" size="sm">
                      Start Tutorial
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Quick Links
            </h2>
            <p className="text-xl text-gray-600">
              Jump to the most frequently accessed documentation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Link href={link.href}>
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-primary-300 transition-all duration-200">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {link.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {link.description}
                    </p>
                    <div className="flex items-center text-primary-600 text-sm font-medium">
                      Read more
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </Link>
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
              Can't Find What You're Looking For?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Our documentation is constantly evolving. Get help from our community or contact support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/community">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-50">
                  Join Community
                </Button>
              </Link>
              <Link href="/support">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                  Contact Support
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
