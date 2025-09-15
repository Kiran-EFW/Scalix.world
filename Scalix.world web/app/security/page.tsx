'use client'

import { motion } from 'framer-motion'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Shield, Lock, Eye, Database, Key, AlertTriangle, CheckCircle, FileText } from 'lucide-react'

const securityFeatures = [
  {
    icon: <Lock className="w-6 h-6" />,
    title: 'End-to-End Encryption',
    description: 'All data is encrypted in transit and at rest using industry-standard encryption protocols.',
    details: [
      'TLS 1.3 encryption for all network communications',
      'AES-256 encryption for stored data',
      'Secure key management and rotation',
      'Zero-knowledge architecture options'
    ]
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: 'Local-First Architecture',
    description: 'Your AI models and conversations stay on your local machine by default.',
    details: [
      'No mandatory cloud data storage',
      'Local AI processing capabilities',
      'Control over data sharing preferences',
      'Offline functionality for core features'
    ]
  },
  {
    icon: <Key className="w-6 h-6" />,
    title: 'API Key Security',
    description: 'Secure management and usage of your AI provider API keys.',
    details: [
      'Encrypted key storage',
      'Never stored on our servers',
      'Secure key validation and rotation',
      'Granular access controls'
    ]
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: 'Privacy by Design',
    description: 'Privacy is built into every aspect of our platform.',
    details: [
      'Minimal data collection principles',
      'Transparent data usage policies',
      'User-controlled data sharing',
      'Regular privacy audits and assessments'
    ]
  }
]

const certifications = [
  {
    title: 'SOC 2 Type II',
    description: 'Security, availability, and confidentiality of customer data',
    status: 'In Progress'
  },
  {
    title: 'GDPR Compliant',
    description: 'European data protection regulation compliance',
    status: 'Compliant'
  },
  {
    title: 'ISO 27001',
    description: 'Information security management systems',
    status: 'In Progress'
  },
  {
    title: 'Privacy Shield',
    description: 'EU-US data transfer framework',
    status: 'Compliant'
  }
]

const securityPractices = [
  {
    title: 'Regular Security Audits',
    description: 'Third-party security assessments conducted quarterly',
    icon: <Shield className="w-5 h-5" />
  },
  {
    title: 'Bug Bounty Program',
    description: 'Reward security researchers for responsible disclosure',
    icon: <AlertTriangle className="w-5 h-5" />
  },
  {
    title: 'Open Source Security',
    description: 'Transparent codebase with community security reviews',
    icon: <FileText className="w-5 h-5" />
  },
  {
    title: 'Incident Response',
    description: '24/7 monitoring and rapid incident response capabilities',
    icon: <CheckCircle className="w-5 h-5" />
  }
]

export default function SecurityPage() {
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
              Security &
              <span className="block text-primary-600">Privacy</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Your data security and privacy are our top priorities. Learn about our
              comprehensive security measures and privacy-first approach.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white">
                Download Security Overview
              </Button>
              <Button variant="outline" size="lg">
                Contact Security Team
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Security Features */}
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
              Security by Design
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive security measures built into every layer of Scalix
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
              >
                <div className="flex items-center mb-4">
                  <div className="text-primary-600 mr-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{detail}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
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
              Certifications & Compliance
            </h2>
            <p className="text-xl text-gray-600">
              Industry-standard security certifications and compliance frameworks
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">{cert.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{cert.description}</p>
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                  cert.status === 'Compliant'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {cert.status}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Practices */}
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
              Security Practices
            </h2>
            <p className="text-xl text-gray-600">
              Our ongoing commitment to security excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityPractices.map((practice, index) => (
              <motion.div
                key={practice.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center"
              >
                <div className="flex justify-center mb-4 text-primary-600">
                  {practice.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{practice.title}</h3>
                <p className="text-gray-600 text-sm">{practice.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Handling */}
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
              How We Handle Your Data
            </h2>
            <p className="text-xl text-gray-600">
              Transparency in our data practices and user controls
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
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Local Processing (Default)</h3>
              <p className="text-gray-600 mb-6">
                By default, all AI processing happens on your local machine. Your prompts,
                responses, and AI models never leave your device.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-green-800 font-medium">Zero data sent to our servers</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Cloud Features (Optional)</h3>
              <p className="text-gray-600 mb-6">
                When you choose to use cloud features, we only collect the minimum data necessary
                to provide the service, and you have full control over what gets shared.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Usage analytics (anonymized)</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Error reporting (optional)</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Feature usage preferences</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Privacy Controls</h3>
              <p className="text-gray-600 mb-6">
                You have complete control over your privacy settings and data sharing preferences.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Data Collection</h4>
                  <p className="text-sm text-gray-600">Opt-in only for optional features</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Data Deletion</h4>
                  <p className="text-sm text-gray-600">Request deletion anytime</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Data Export</h4>
                  <p className="text-sm text-gray-600">Export your data in standard formats</p>
                </div>
              </div>
            </motion.div>
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
            <Lock className="w-12 h-12 mx-auto mb-6 text-white" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Security Questions?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Have questions about our security practices or need to discuss enterprise security requirements?
              Our security team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-50">
                  Contact Security Team
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                View Security Docs
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
