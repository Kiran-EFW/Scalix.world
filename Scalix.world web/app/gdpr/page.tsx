'use client'

import { motion } from 'framer-motion'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Shield, UserCheck, Database, Lock, Mail, FileText, AlertTriangle, CheckCircle } from 'lucide-react'

const gdprPrinciples = [
  {
    icon: <UserCheck className="w-6 h-6" />,
    title: 'Lawfulness, Fairness, and Transparency',
    description: 'We process personal data lawfully, fairly, and transparently.',
    details: [
      'Clear privacy notices and policies',
      'Transparent data processing practices',
      'Lawful basis for all data processing',
      'User-friendly privacy controls'
    ]
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: 'Purpose Limitation',
    description: 'We collect data for specified, explicit, and legitimate purposes.',
    details: [
      'Defined purposes for data collection',
      'No unnecessary data collection',
      'Regular purpose limitation reviews',
      'Data minimization practices'
    ]
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: 'Data Minimization',
    description: 'We limit data collection to what is necessary for our services.',
    details: [
      'Minimal data collection approach',
      'Anonymized data where possible',
      'Regular data cleanup procedures',
      'Purpose-specific data retention'
    ]
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: 'Accuracy',
    description: 'We keep personal data accurate and up to date.',
    details: [
      'Data accuracy verification processes',
      'User ability to update their data',
      'Regular data quality checks',
      'Outdated data removal procedures'
    ]
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Storage Limitation',
    description: 'We retain data only as long as necessary.',
    details: [
      'Defined retention periods',
      'Automatic data deletion procedures',
      'Regular retention policy reviews',
      'User-initiated data deletion'
    ]
  },
  {
    icon: <AlertTriangle className="w-6 h-6" />,
    title: 'Integrity and Confidentiality',
    description: 'We protect data against unauthorized access and breaches.',
    details: [
      'End-to-end encryption',
      'Access control mechanisms',
      'Regular security audits',
      'Breach notification procedures'
    ]
  }
]

const userRights = [
  {
    title: 'Right to Information',
    description: 'You have the right to be informed about how we process your personal data.',
    icon: <FileText className="w-5 h-5" />
  },
  {
    title: 'Right of Access',
    description: 'You can request access to your personal data and information about how it\'s processed.',
    icon: <Database className="w-5 h-5" />
  },
  {
    title: 'Right to Rectification',
    description: 'You can have your personal data rectified if it\'s inaccurate or incomplete.',
    icon: <CheckCircle className="w-5 h-5" />
  },
  {
    title: 'Right to Erasure',
    description: 'You can request deletion of your personal data in certain circumstances.',
    icon: <AlertTriangle className="w-5 h-5" />
  },
  {
    title: 'Right to Data Portability',
    description: 'You can receive your personal data in a structured, commonly used format.',
    icon: <FileText className="w-5 h-5" />
  },
  {
    title: 'Right to Object',
    description: 'You can object to processing of your personal data in certain situations.',
    icon: <Shield className="w-5 h-5" />
  },
  {
    title: 'Right to Restriction',
    description: 'You can request restriction of processing of your personal data.',
    icon: <Lock className="w-5 h-5" />
  },
  {
    title: 'Right to Complain',
    description: 'You have the right to lodge a complaint with supervisory authorities.',
    icon: <Mail className="w-5 h-5" />
  }
]

export default function GDPRPage() {
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
            <Shield className="w-16 h-16 mx-auto mb-6 text-primary-600" />
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              GDPR
              <span className="block text-primary-600">Compliance</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Scalix is fully committed to GDPR compliance. Learn about our data protection
              practices and your rights under the General Data Protection Regulation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white">
                Download Privacy Policy
              </Button>
              <Button variant="outline" size="lg">
                Exercise Your Rights
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* GDPR Principles */}
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
              GDPR Principles
            </h2>
            <p className="text-xl text-gray-600">
              Our commitment to the six core principles of GDPR
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {gdprPrinciples.map((principle, index) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
              >
                <div className="flex items-center mb-4">
                  <div className="text-primary-600 mr-4">
                    {principle.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{principle.title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{principle.description}</p>
                <ul className="space-y-2">
                  {principle.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{detail}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Rights */}
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
              Your GDPR Rights
            </h2>
            <p className="text-xl text-gray-600">
              You have comprehensive rights regarding your personal data
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userRights.map((right, index) => (
              <motion.div
                key={right.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center mb-3">
                  <div className="text-primary-600 mr-3">
                    {right.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{right.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{right.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Processing */}
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
              How We Process Data
            </h2>
            <p className="text-xl text-gray-600">
              Transparency in our data processing activities
            </p>
          </motion.div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Account Data</h3>
              <p className="text-gray-600 mb-4">
                <strong>Purpose:</strong> To provide and manage your Scalix account
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Legal Basis:</strong> Contractual necessity (Article 6(1)(b) GDPR)
              </p>
              <p className="text-gray-600">
                <strong>Retention:</strong> As long as your account is active, plus 3 years after account deletion
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Usage Analytics</h3>
              <p className="text-gray-600 mb-4">
                <strong>Purpose:</strong> To improve our services and user experience
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Legal Basis:</strong> Legitimate interests (Article 6(1)(f) GDPR)
              </p>
              <p className="text-gray-600">
                <strong>Retention:</strong> 2 years for aggregated analytics, 90 days for detailed logs
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Communication Data</h3>
              <p className="text-gray-600 mb-4">
                <strong>Purpose:</strong> To respond to your inquiries and provide support
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Legal Basis:</strong> Legitimate interests (Article 6(1)(f) GDPR)
              </p>
              <p className="text-gray-600">
                <strong>Retention:</strong> 3 years for support communications
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Data Protection Officer */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Contact Our Data Protection Officer
            </h2>
            <p className="text-xl text-gray-600">
              Our dedicated DPO is here to help with any GDPR-related questions or requests
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Data Protection Officer</h3>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Email:</strong> dpo@scalix.world</p>
                  <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                  <p><strong>Address:</strong> 123 AI Street, Tech City, TC 12345</p>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Response Times</h3>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Access Requests:</strong> Within 30 days</p>
                  <p><strong>Rectification:</strong> Within 30 days</p>
                  <p><strong>Erasure:</strong> Within 30 days</p>
                  <p><strong>General Inquiries:</strong> Within 48 hours</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Need to Exercise Your Rights?</h4>
              <p className="text-gray-600 mb-4">
                You can submit GDPR requests through our secure portal or by contacting our DPO directly.
                All requests are processed within the legally required timeframes.
              </p>
              <Button className="bg-primary-600 hover:bg-primary-700 text-white">
                Submit GDPR Request
              </Button>
            </div>
          </motion.div>
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
            <FileText className="w-12 h-12 mx-auto mb-6 text-white" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Questions About GDPR?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Have questions about how we handle your data or need to exercise your GDPR rights?
              We're here to help ensure your data protection rights are respected.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-50">
                  Contact Our DPO
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                Read Full Privacy Policy
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
