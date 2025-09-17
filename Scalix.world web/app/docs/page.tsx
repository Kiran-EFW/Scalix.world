'use client'

import { motion } from 'framer-motion'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { ContentSection, TutorialContentSection } from '@/components/ui/ContentSection'
import Link from 'next/link'
import { Search, ArrowRight } from 'lucide-react'
import { ContentManager } from '@/lib/content'

const quickLinks = [
  { title: 'Get API Key', href: '/dashboard/api-keys', description: 'Generate and manage your Scalix API keys' },
  { title: 'Installation Guide', href: '/docs/installation', description: 'Step-by-step installation instructions' },
  { title: 'API Quick Start', href: '/docs/api-quickstart', description: 'Get started with the Scalix API' },
  { title: 'Troubleshooting', href: '/docs/troubleshooting', description: 'Common issues and solutions' },
  { title: 'Changelog', href: '/docs/changelog', description: 'Latest updates and changes' },
  { title: 'Community Forums', href: '/community', description: 'Get help from the community' },
  { title: 'Support Center', href: '/support', description: 'Contact our support team' }
]

// Content is now managed through the ContentManager

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
      {(() => {
        // Combine all docs sections into one display section
        const gettingStartedSection = ContentManager.getSection('docs.gettingStarted')
        const apiReferenceSection = ContentManager.getSection('docs.apiReference')

        if (gettingStartedSection && apiReferenceSection) {
          const combinedSection = {
            id: 'documentation-sections',
            title: 'Documentation Sections',
            description: 'Explore our comprehensive documentation organized by topic',
            tiles: [...gettingStartedSection.tiles, ...apiReferenceSection.tiles],
            layout: 'grid' as const
          }

          return (
            <ContentSection
              section={combinedSection}
              variant="featured"
              showViewAll={true}
              viewAllHref="/docs/all"
            />
          )
        }
        return null
      })()}

      {/* Tutorials Section */}
      {(() => {
        const beginnerTutorials = ContentManager.getSection('tutorials.beginner')
        return beginnerTutorials ? (
          <TutorialContentSection
            section={beginnerTutorials}
            showViewAll={true}
            viewAllHref="/tutorials"
          />
        ) : null
      })()}

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
