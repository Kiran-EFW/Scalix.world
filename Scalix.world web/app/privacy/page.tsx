'use client'

import { motion } from 'framer-motion'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Shield, Lock, Eye, Database, Users, Mail, Cookie, AlertTriangle } from 'lucide-react'

const sections = [
  {
    icon: Database,
    title: 'Information We Collect',
    content: [
      'Account information (name, email, company details)',
      'Usage data and analytics (how you use our platform)',
      'Technical information (device info, browser type, IP address)',
      'AI model interactions and generated content metadata',
      'Communication preferences and feedback'
    ]
  },
  {
    icon: Lock,
    title: 'How We Protect Your Data',
    content: [
      'End-to-end encryption for all data transmission',
      'Local-first architecture keeps your data on your devices',
      'Regular security audits and penetration testing',
      'Multi-factor authentication for account access',
      'Zero-knowledge architecture for sensitive operations'
    ]
  },
  {
    icon: Eye,
    title: 'Data Usage & Processing',
    content: [
      'Processing AI requests locally on your infrastructure',
      'Generating usage analytics and performance metrics',
      'Providing customer support and technical assistance',
      'Improving our services and developing new features',
      'Complying with legal obligations and regulatory requirements'
    ]
  },
  {
    icon: Users,
    title: 'Data Sharing & Third Parties',
    content: [
      'We do not sell or rent your personal information',
      'Limited sharing with service providers for essential functions',
      'Aggregated, anonymized data for analytics and research',
      'Legal compliance when required by law',
      'Your explicit consent for any additional sharing'
    ]
  }
]

const dataRights = [
  {
    title: 'Access Your Data',
    description: 'Request a copy of all personal data we have about you',
    action: 'Data Access Request'
  },
  {
    title: 'Correct Your Data',
    description: 'Update or correct any inaccurate or incomplete information',
    action: 'Data Correction Request'
  },
  {
    title: 'Delete Your Data',
    description: 'Request complete removal of your personal data from our systems',
    action: 'Data Deletion Request'
  },
  {
    title: 'Data Portability',
    description: 'Receive your data in a portable, machine-readable format',
    action: 'Data Export Request'
  }
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-purple-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-primary-600" />
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Your privacy is our priority. Learn how we collect, use, and protect your data
              while you build AI applications with Scalix.
            </p>
            <p className="text-sm text-gray-500">
              Last updated: January 15, 2025
            </p>
          </motion.div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-blue-50 border border-blue-200 rounded-xl p-8 mb-16"
          >
            <div className="flex items-start space-x-4">
              <Lock className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Privacy-First by Design
                </h3>
                <p className="text-blue-800">
                  Scalix is built with privacy at its core. Unlike traditional AI platforms that send your data
                  to remote servers, Scalix processes everything locally on your infrastructure. This means
                  your AI interactions, prompts, and generated content never leave your environment.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Privacy Principles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 rounded-xl p-6"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <section.icon className="w-6 h-6 text-primary-600" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      {section.title}
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {section.content.map((item, idx) => (
                      <li key={idx} className="text-gray-600 flex items-start">
                        <span className="text-primary-600 mr-2 mt-1.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Data Rights Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Your Data Rights
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              You have complete control over your data. Under GDPR and CCPA, you have the right to:
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {dataRights.map((right, index) => (
              <motion.div
                key={right.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {right.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {right.description}
                </p>
                <Button variant="outline" size="sm">
                  {right.action}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Privacy Policy */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="prose prose-lg max-w-none"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Detailed Privacy Policy</h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">1. Information Collection</h3>
                <p className="text-gray-600 mb-4">
                  We collect information you provide directly to us, such as when you create an account,
                  use our services, or contact us for support. This includes:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Name, email address, and company information</li>
                  <li>Usage data and interaction patterns with our platform</li>
                  <li>Technical information about your device and browser</li>
                  <li>Feedback and communication preferences</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">2. Local Processing</h3>
                <p className="text-gray-600 mb-4">
                  Unlike traditional AI platforms, Scalix processes all AI requests locally on your
                  infrastructure. This means:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Your prompts and AI-generated content never leave your environment</li>
                  <li>No data transmission to external AI service providers</li>
                  <li>Complete control over your data and privacy</li>
                  <li>Reduced latency and improved performance</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">3. Cookies & Analytics</h3>
                <div className="flex items-start space-x-4 mb-4">
                  <Cookie className="w-6 h-6 text-primary-600 mt-1" />
                  <div>
                    <p className="text-gray-600 mb-2">
                      We use cookies and similar technologies to enhance your experience and analyze usage patterns.
                    </p>
                    <p className="text-gray-600">
                      You can control cookie preferences through your browser settings. Essential cookies
                      required for platform functionality cannot be disabled.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Retention</h3>
                <p className="text-gray-600 mb-4">
                  We retain your personal information only as long as necessary to provide our services
                  and comply with legal obligations:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Account data: Retained while your account is active</li>
                  <li>Usage analytics: Anonymized after 24 months</li>
                  <li>Support communications: Retained for 3 years</li>
                  <li>Legal compliance data: Retained as required by law</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">5. International Data Transfers</h3>
                <p className="text-gray-600">
                  Since Scalix operates locally on your infrastructure, most data processing occurs
                  within your geographical location. Any minimal data transfers to our core services
                  are protected by appropriate safeguards and comply with international privacy standards.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">6. Children's Privacy</h3>
                <p className="text-gray-600">
                  Our services are not intended for children under 13 years of age. We do not knowingly
                  collect personal information from children under 13. If you are a parent or guardian
                  and believe your child has provided us with personal information, please contact us.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">7. Changes to This Policy</h3>
                <p className="text-gray-600">
                  We may update this privacy policy from time to time. We will notify you of any changes
                  by posting the new policy on this page and updating the "Last updated" date. Your continued
                  use of our services after any changes constitutes acceptance of the updated policy.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Mail className="w-12 h-12 text-white mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Questions About Your Privacy?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Our privacy team is here to help. Contact us with any questions about
              how we handle your data or to exercise your privacy rights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-primary-600 hover:bg-gray-50">
                Contact Privacy Team
              </Button>
              <Link href="/support">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
                  Visit Support Center
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
