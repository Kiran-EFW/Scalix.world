'use client'

import { motion } from 'framer-motion'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Download, CheckCircle, Star, Users, Zap, Shield, Monitor, Apple, Cpu } from 'lucide-react'

const downloadOptions = [
  {
    platform: 'Windows',
    icon: <Monitor className="w-8 h-8" />,
    version: 'v0.21.0',
    size: '245 MB',
    requirements: 'Windows 10+',
    downloadUrl: '#',
    checksum: 'a1b2c3d4e5f6...'
  },
  {
    platform: 'macOS',
    icon: <Apple className="w-8 h-8" />,
    version: 'v0.21.0',
    size: '198 MB',
    requirements: 'macOS 10.15+',
    downloadUrl: '#',
    checksum: 'f6e5d4c3b2a1...'
  },
  {
    platform: 'Linux',
    icon: <Cpu className="w-8 h-8" />,
    version: 'v0.21.0',
    size: '212 MB',
    requirements: 'Ubuntu 18.04+ / CentOS 7+',
    downloadUrl: '#',
    checksum: '1a2b3c4d5e6f...'
  }
]

const features = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Secure & Private',
    description: 'All data stays on your machine. No cloud dependencies for core functionality.'
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Lightning Fast',
    description: 'Local AI processing means instant responses and no network latency.'
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Community Driven',
    description: 'Free, open-source software built by developers for developers.'
  }
]

export default function DownloadPage() {
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
            <Download className="w-16 h-16 mx-auto mb-6 text-primary-600" />
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Download
              <span className="block text-primary-600">Scalix</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Get started with Scalix today. Download the desktop application for Windows, macOS, or Linux.
              Free, open-source, and ready to use.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white">
                <Download className="w-5 h-5 mr-2" />
                Download for Windows
              </Button>
              <Button variant="outline" size="lg">
                View All Downloads
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Free & Open Source
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                No Registration Required
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Offline First
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Download Options */}
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
              Choose Your Platform
            </h2>
            <p className="text-xl text-gray-600">
              Scalix works on Windows, macOS, and Linux
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {downloadOptions.map((option, index) => (
              <motion.div
                key={option.platform}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center"
              >
                <div className="flex justify-center mb-4 text-primary-600">
                  {option.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{option.platform}</h3>
                <p className="text-gray-600 mb-4">{option.version}</p>

                <div className="space-y-2 text-sm text-gray-600 mb-6">
                  <div><strong>Size:</strong> {option.size}</div>
                  <div><strong>Requirements:</strong> {option.requirements}</div>
                </div>

                <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white mb-4">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>

                <details className="text-left">
                  <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                    Show checksum
                  </summary>
                  <code className="text-xs bg-gray-100 p-2 rounded mt-2 block">
                    SHA256: {option.checksum}
                  </code>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
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
              Why Choose Scalix?
            </h2>
            <p className="text-xl text-gray-600">
              Built for developers who value privacy, performance, and control
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"
              >
                <div className="flex justify-center mb-4 text-primary-600">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* System Requirements */}
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
              System Requirements
            </h2>
            <p className="text-xl text-gray-600">
              Minimum requirements to run Scalix smoothly
            </p>
          </motion.div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Minimum Requirements</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• 4GB RAM</li>
                  <li>• 2GB free disk space</li>
                  <li>• 64-bit processor</li>
                  <li>• Internet connection for AI features</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• 8GB RAM or more</li>
                  <li>• 5GB free disk space</li>
                  <li>• SSD storage</li>
                  <li>• Stable internet connection</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
