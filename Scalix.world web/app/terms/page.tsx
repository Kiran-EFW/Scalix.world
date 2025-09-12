'use client'

import { motion } from 'framer-motion'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { FileText, Scale, Shield, AlertTriangle, Mail } from 'lucide-react'

const termsSections = [
  {
    icon: FileText,
    title: 'Acceptance of Terms',
    content: [
      'By accessing and using Scalix, you accept and agree to be bound by the terms and provision of this agreement.',
      'If you do not agree to abide by the above, please do not use this service.',
      'These terms apply to all visitors, users, and others who access or use our service.'
    ]
  },
  {
    icon: Shield,
    title: 'User Responsibilities',
    content: [
      'You are responsible for maintaining the confidentiality of your account credentials',
      'You must use the service in accordance with applicable laws and regulations',
      'You agree not to use the service for any unlawful or prohibited activities',
      'You are responsible for all activities that occur under your account'
    ]
  },
  {
    icon: Scale,
    title: 'Service Availability',
    content: [
      'We strive to provide continuous service but do not guarantee uninterrupted availability',
      'We reserve the right to modify, suspend, or discontinue the service at any time',
      'We will provide reasonable notice for planned maintenance or service changes',
      'Service availability may be affected by factors beyond our control'
    ]
  }
]

const keyTerms = [
  {
    title: 'Intellectual Property',
    content: 'All content, features, and functionality of Scalix are owned by us and are protected by copyright, trademark, and other intellectual property laws.'
  },
  {
    title: 'Data Ownership',
    content: 'You retain ownership of all data you input into Scalix. We do not claim ownership of your content, prompts, or generated outputs.'
  },
  {
    title: 'Limitation of Liability',
    content: 'Scalix is provided "as is" without warranties. We shall not be liable for any indirect, incidental, or consequential damages.'
  },
  {
    title: 'Indemnification',
    content: 'You agree to indemnify and hold us harmless from any claims arising from your use of the service or violation of these terms.'
  }
]

export default function TermsPage() {
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
              <FileText className="w-10 h-10 text-primary-600" />
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Please read these terms carefully before using Scalix. By using our service,
              you agree to be bound by these terms and conditions.
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
            className="bg-green-50 border border-green-200 rounded-xl p-8 mb-16"
          >
            <div className="flex items-start space-x-4">
              <AlertTriangle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  Important Notice
                </h3>
                <p className="text-green-800">
                  These terms govern your use of Scalix and our related services. By using our platform,
                  you agree to these terms. If you disagree with any part of these terms, you should not use our service.
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
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Terms Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {termsSections.map((section, index) => (
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

      {/* Detailed Terms */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="prose prose-lg max-w-none"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Complete Terms of Service</h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h3>
                <p className="text-gray-600 mb-4">
                  By accessing or using Scalix, you agree to be bound by these Terms of Service ("Terms").
                  If you disagree with any part of these terms, then you may not access the service.
                </p>
                <p className="text-gray-600">
                  These Terms apply to all visitors, users, and others who access or use our service.
                  By using Scalix, you represent that you are at least 18 years old and have the legal
                  capacity to enter into these Terms.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h3>
                <p className="text-gray-600 mb-4">
                  Scalix is a local-first AI development platform that enables developers to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Build AI applications with local processing</li>
                  <li>Integrate multiple AI models securely</li>
                  <li>Deploy applications without vendor lock-in</li>
                  <li>Manage AI subscriptions and billing</li>
                  <li>Access comprehensive development tools</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h3>
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Account Requirements</h4>
                  <ul className="list-disc pl-6 text-gray-600 space-y-1">
                    <li>You must provide accurate and complete information when creating an account</li>
                    <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                    <li>You must immediately notify us of any unauthorized use of your account</li>
                    <li>You may not transfer or share your account with others</li>
                    <li>We reserve the right to terminate accounts that violate these terms</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">4. Acceptable Use Policy</h3>
                <p className="text-gray-600 mb-4">
                  You agree not to use Scalix for any unlawful purposes or to conduct any unlawful activity,
                  including but not limited to:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-900 mb-2">Prohibited Activities</h4>
                    <ul className="text-red-800 text-sm space-y-1">
                      <li>• Creating harmful or malicious content</li>
                      <li>• Violating intellectual property rights</li>
                      <li>• Attempting to breach security measures</li>
                      <li>• Distributing malware or viruses</li>
                      <li>• Conducting fraudulent activities</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2">Permitted Uses</h4>
                    <ul className="text-green-800 text-sm space-y-1">
                      <li>• Developing AI applications</li>
                      <li>• Research and experimentation</li>
                      <li>• Educational purposes</li>
                      <li>• Commercial development</li>
                      <li>• Personal productivity tools</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">5. Intellectual Property</h3>
                <p className="text-gray-600 mb-4">
                  The Scalix service and its original content, features, and functionality are and will remain
                  the exclusive property of Scalix and its licensors. The service is protected by copyright,
                  trademark, and other laws.
                </p>
                <p className="text-gray-600">
                  You retain ownership of all content, data, and materials you create or upload to Scalix.
                  By using our service, you grant us a limited license to process and store your content
                  solely for the purpose of providing the service.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">6. Privacy and Data Protection</h3>
                <p className="text-gray-600 mb-4">
                  Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect
                  your information. Key points include:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Local-first processing keeps your data on your infrastructure</li>
                  <li>We do not sell or share your personal information</li>
                  <li>You have full control over your data and can request deletion at any time</li>
                  <li>We implement industry-standard security measures to protect your data</li>
                </ul>
                <div className="mt-4">
                  <Link href="/privacy">
                    <Button variant="outline">
                      Read Our Privacy Policy
                    </Button>
                  </Link>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">7. Payment Terms</h3>
                <p className="text-gray-600 mb-4">
                  For paid services, the following terms apply:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>All fees are non-refundable unless otherwise specified</li>
                  <li>Subscription fees are billed in advance on a recurring basis</li>
                  <li>You are responsible for all applicable taxes</li>
                  <li>We may change pricing with 30 days notice</li>
                  <li>Late payments may result in service suspension</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">8. Service Availability</h3>
                <p className="text-gray-600 mb-4">
                  We strive to provide reliable service but cannot guarantee:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Uninterrupted or error-free service availability</li>
                  <li>That the service will meet your specific requirements</li>
                  <li>That the service will be available at all times</li>
                  <li>That all features will function as expected</li>
                </ul>
                <p className="text-gray-600">
                  We reserve the right to modify, suspend, or discontinue the service at any time
                  with reasonable notice when possible.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h3>
                <p className="text-gray-600 mb-4">
                  In no event shall Scalix, its directors, employees, partners, agents, suppliers, or
                  affiliates be liable for any indirect, incidental, special, consequential, or punitive
                  damages, including without limitation, loss of profits, data, use, goodwill, or other
                  intangible losses, resulting from:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Your use or inability to use the service</li>
                  <li>Any unauthorized access to or use of our servers</li>
                  <li>Any interruption or cessation of transmission to or from the service</li>
                  <li>Any bugs, viruses, trojan horses, or the like</li>
                  <li>Any errors or omissions in any content</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">10. Termination</h3>
                <p className="text-gray-600 mb-4">
                  We may terminate or suspend your account immediately, without prior notice or liability,
                  for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
                <p className="text-gray-600">
                  Upon termination, your right to use the service will cease immediately. If you wish
                  to terminate your account, you may simply discontinue using the service.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">11. Governing Law</h3>
                <p className="text-gray-600">
                  These Terms shall be interpreted and governed by the laws of the jurisdiction in which
                  Scalix operates, without regard to its conflict of law provisions. Our failure to enforce
                  any right or provision of these Terms will not be considered a waiver of those rights.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to Terms</h3>
                <p className="text-gray-600 mb-4">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
                  If a revision is material, we will try to provide at least 30 days notice prior to any new
                  terms taking effect.
                </p>
                <p className="text-gray-600">
                  What constitutes a material change will be determined at our sole discretion. By continuing
                  to access or use our service after those revisions become effective, you agree to be bound
                  by the revised terms.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h3>
                <p className="text-gray-600 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-gray-800"><strong>Email:</strong> legal@scalix.world</p>
                  <p className="text-gray-800"><strong>Address:</strong> [Company Address]</p>
                  <p className="text-gray-800"><strong>Phone:</strong> [Contact Number]</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Terms Summary */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Key Terms Summary
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Here are the most important points from our complete terms:
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {keyTerms.map((term, index) => (
              <motion.div
                key={term.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {term.title}
                </h3>
                <p className="text-gray-600">
                  {term.content}
                </p>
              </motion.div>
            ))}
          </div>
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
              Questions About These Terms?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Our legal team is here to help clarify any questions you might have
              about our terms of service or how they apply to your use of Scalix.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-primary-600 hover:bg-gray-50">
                Contact Legal Team
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
