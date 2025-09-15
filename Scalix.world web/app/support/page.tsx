'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { HelpCircle, Book, MessageSquare, Users, Search, FileText, Video, Github, ExternalLink } from 'lucide-react'

const supportCategories = [
  {
    icon: <HelpCircle className="w-6 h-6" />,
    title: 'Getting Started',
    description: 'New to Scalix? Start here with installation and basic setup guides.',
    articles: [
      'Installing Scalix',
      'First AI Project Setup',
      'Basic Configuration',
      'Troubleshooting Installation'
    ],
    color: 'bg-blue-500'
  },
  {
    icon: <Book className="w-6 h-6" />,
    title: 'Documentation',
    description: 'Comprehensive guides and API references for all Scalix features.',
    articles: [
      'AI Model Integration',
      'API Key Management',
      'Local vs Cloud Processing',
      'Security Best Practices'
    ],
    color: 'bg-green-500'
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: 'Community Support',
    description: 'Connect with other developers and get help from the community.',
    articles: [
      'Community Forums',
      'Discord Server',
      'GitHub Discussions',
      'Stack Overflow'
    ],
    color: 'bg-purple-500'
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: 'Troubleshooting',
    description: 'Common issues and their solutions.',
    articles: [
      'Connection Problems',
      'AI Model Issues',
      'Performance Optimization',
      'Error Messages'
    ],
    color: 'bg-orange-500'
  }
]

const quickLinks = [
  {
    title: 'Submit a Bug Report',
    description: 'Found a bug? Help us fix it by reporting the issue.',
    icon: <Github className="w-5 h-5" />,
    href: 'https://github.com/scalix-world/scalix/issues',
    external: true
  },
  {
    title: 'Feature Request',
    description: 'Suggest new features or improvements.',
    icon: <FileText className="w-5 h-5" />,
    href: 'https://github.com/scalix-world/scalix/discussions',
    external: true
  },
  {
    title: 'Live Chat Support',
    description: 'Chat with our support team (business hours).',
    icon: <MessageSquare className="w-5 h-5" />,
    href: '/contact',
    external: false
  },
  {
    title: 'Video Tutorials',
    description: 'Step-by-step video guides for common tasks.',
    icon: <Video className="w-5 h-5" />,
    href: '#',
    external: false
  }
]

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <HelpCircle className="w-16 h-16 mx-auto mb-6 text-primary-600" />
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Support
              <span className="block text-primary-600">Center</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Find answers, get help, and connect with the Scalix community.
              We're here to ensure your success with AI development.
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white">
                Browse Documentation
              </Button>
              <Button variant="outline" size="lg">
                Contact Support
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Support Categories */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-xl text-gray-600">
              Find the help you need organized by topic
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${category.color}`}>
                  <div className="text-white">
                    {category.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{category.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{category.description}</p>

                <div className="space-y-2 mb-4">
                  {category.articles.slice(0, 3).map((article, articleIndex) => (
                    <div key={articleIndex} className="text-sm text-gray-700 hover:text-primary-600 cursor-pointer transition-colors">
                      • {article}
                    </div>
                  ))}
                  {category.articles.length > 3 && (
                    <div className="text-sm text-primary-600 font-medium cursor-pointer">
                      +{category.articles.length - 3} more articles
                    </div>
                  )}
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  View All
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <p className="text-xl text-gray-600">
              Common support actions and resources
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="text-primary-600 mr-3">
                    {link.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{link.title}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">{link.description}</p>
                <Link href={link.href}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full group"
                  >
                    {link.external ? 'Open External' : 'Go to Page'}
                    {link.external && <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Popular Articles
            </h2>
            <p className="text-xl text-gray-600">
              Most viewed help articles and guides
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                title: 'How to Connect Your Own AI API Keys',
                category: 'Setup',
                readTime: '5 min read',
                views: '2.3k'
              },
              {
                title: 'Troubleshooting: AI Model Connection Issues',
                category: 'Troubleshooting',
                readTime: '3 min read',
                views: '1.8k'
              },
              {
                title: 'Performance Optimization Guide',
                category: 'Best Practices',
                readTime: '8 min read',
                views: '1.5k'
              },
              {
                title: 'Local vs Cloud Processing: Which to Choose?',
                category: 'Architecture',
                readTime: '6 min read',
                views: '1.2k'
              },
              {
                title: 'Security Best Practices for AI Development',
                category: 'Security',
                readTime: '10 min read',
                views: '950'
              }
            ].map((article, index) => (
              <motion.div
                key={article.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
                      {article.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {article.category}
                      </span>
                      <span>{article.readTime}</span>
                      <span>{article.views} views</span>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    →
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <MessageSquare className="w-12 h-12 mx-auto mb-6 text-white" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Still Need Help?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help.
              Contact us directly for personalized assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-50">
                  Contact Support
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                Join Community
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
