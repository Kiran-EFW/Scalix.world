'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import {
  Check,
  X,
  Star,
  Shield,
  Zap,
  DollarSign,
  Lock,
  Globe,
  Cpu,
  Code,
  Users,
  TrendingUp,
  Award,
  ArrowRight
} from 'lucide-react'

const competitors = [
  {
    name: 'Lovable',
    logo: '💖',
    tagline: 'AI-powered web development',
    pricing: '$29/month',
    strengths: ['Fast prototyping', 'Modern UI components', 'Good for MVPs'],
    weaknesses: ['Cloud-only', 'Limited customization', 'Vendor lock-in'],
    target: 'Indie developers, startups'
  },
  {
    name: 'v0',
    logo: '🎨',
    tagline: 'AI-generated UI components',
    pricing: '$20/month',
    strengths: ['Beautiful components', 'Fast generation', 'Design-focused'],
    weaknesses: ['Limited to UI only', 'Cloud dependency', 'Expensive for complex apps'],
    target: 'Designers, frontend devs'
  },
  {
    name: 'Bolt',
    logo: '⚡',
    tagline: 'AI web app builder',
    pricing: '$29/month',
    strengths: ['Full-stack generation', 'Modern stack', 'Quick deployment'],
    weaknesses: ['Cloud-only', 'Limited local development', 'Black box AI'],
    target: 'Full-stack developers'
  }
]

const comparisonData = [
  {
    feature: 'Local-First Architecture',
    description: 'Run everything on your machine',
    scalix: true,
    lovable: false,
    v0: false,
    bolt: false
  },
  {
    feature: 'Privacy & Data Control',
    description: 'Your code never leaves your machine',
    scalix: true,
    lovable: false,
    v0: false,
    bolt: false
  },
  {
    feature: 'Multi-Provider AI Support',
    description: 'OpenAI, Anthropic, Google, Ollama, etc.',
    scalix: true,
    lovable: true,
    v0: true,
    bolt: true
  },
  {
    feature: 'Bring Your Own Keys',
    description: 'Use your own API keys and contracts',
    scalix: true,
    lovable: false,
    v0: false,
    bolt: false
  },
  {
    feature: 'Cost Transparency',
    description: 'See exactly what you pay for',
    scalix: true,
    lovable: false,
    v0: false,
    bolt: false
  },
  {
    feature: 'Advanced AI Features',
    description: 'Lazy edits, smart context, custom models',
    scalix: true,
    lovable: false,
    v0: false,
    bolt: false
  },
  {
    feature: 'Offline Development',
    description: 'Work without internet connection',
    scalix: true,
    lovable: false,
    v0: false,
    bolt: false
  },
  {
    feature: 'Open Source',
    description: 'Transparent and community-driven',
    scalix: true,
    lovable: false,
    v0: false,
    bolt: false
  },
  {
    feature: 'Enterprise Features',
    description: 'SSO, audit logs, compliance',
    scalix: true,
    lovable: false,
    v0: false,
    bolt: false
  },
  {
    feature: 'Free Tier Available',
    description: 'Start building without paying',
    scalix: true,
    lovable: false,
    v0: false,
    bolt: false
  }
]

const testimonials = [
  {
    name: 'Sarah Chen',
    company: 'TechCorp',
    content: 'Switched from Lovable because Scalix gives us complete control over our data and costs. The local-first approach was a game-changer for our compliance requirements.',
    previous: 'Lovable',
    savings: '$450/month'
  },
  {
    name: 'Mike Rodriguez',
    company: 'StartupXYZ',
    content: 'v0 was great for UI, but Scalix handles our entire stack. The multi-provider support and cost transparency saved us thousands.',
    previous: 'v0',
    savings: '$680/month'
  },
  {
    name: 'Emma Thompson',
    company: 'InnovateLab',
    content: 'Bolt was too restrictive with its cloud-only approach. Scalix\'s local development and advanced AI features are exactly what we needed.',
    previous: 'Bolt',
    savings: '$320/month'
  }
]

const caseStudies = [
  {
    company: 'SecureBank',
    challenge: 'Needed AI development platform that meets banking compliance requirements',
    solution: 'Scalix local-first architecture keeps all data on-premise',
    results: ['100% data privacy', 'Reduced costs by 60%', 'Faster development cycles'],
    competitor: 'Lovable'
  },
  {
    company: 'GlobalTech',
    challenge: 'Multi-region development with cost optimization',
    solution: 'Scalix multi-provider support with intelligent routing',
    results: ['45% cost reduction', 'Global performance', 'Provider flexibility'],
    competitor: 'v0'
  },
  {
    company: 'DevCorp',
    challenge: 'Enterprise-grade AI development with audit trails',
    solution: 'Scalix Pro with advanced analytics and compliance features',
    results: ['SOC 2 compliance', 'Full audit trails', 'Team collaboration'],
    competitor: 'Bolt'
  }
]

export default function ComparePage() {
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null)

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
              How Scalix Compares to
              <span className="block text-primary-600">Other AI Platforms</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              See why developers are switching to Scalix for better privacy, cost control, and advanced AI features.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#comparison">
                <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white">
                  View Comparison
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg">
                  See Pricing
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Competitor Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {competitors.map((competitor, index) => (
            <motion.div
              key={competitor.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{competitor.logo}</div>
                <h3 className="text-xl font-bold text-gray-900">{competitor.name}</h3>
                <p className="text-gray-600 text-sm">{competitor.tagline}</p>
                <p className="text-lg font-semibold text-primary-600 mt-2">{competitor.pricing}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900 text-sm mb-2">Strengths:</h4>
                  <ul className="space-y-1">
                    {competitor.strengths.map((strength, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-center">
                        <Check className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 text-sm mb-2">Limitations:</h4>
                  <ul className="space-y-1">
                    {competitor.weaknesses.map((weakness, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-center">
                        <X className="w-3 h-3 text-red-500 mr-2 flex-shrink-0" />
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">Target: {competitor.target}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scalix Advantages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-8 text-white mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Why Developers Choose Scalix</h2>
            <p className="text-xl opacity-90">The unique advantages that set Scalix apart</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto mb-3 opacity-90" />
              <h3 className="text-lg font-semibold mb-2">Privacy First</h3>
              <p className="opacity-90">Your code and conversations never leave your machine</p>
            </div>
            <div className="text-center">
              <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-90" />
              <h3 className="text-lg font-semibold mb-2">Cost Transparency</h3>
              <p className="opacity-90">See exactly what you pay for with your own API keys</p>
            </div>
            <div className="text-center">
              <Zap className="w-12 h-12 mx-auto mb-3 opacity-90" />
              <h3 className="text-lg font-semibold mb-2">Advanced AI</h3>
              <p className="opacity-90">Proprietary features like lazy edits and smart context</p>
            </div>
            <div className="text-center">
              <Lock className="w-12 h-12 mx-auto mb-3 opacity-90" />
              <h3 className="text-lg font-semibold mb-2">No Vendor Lock-in</h3>
              <p className="opacity-90">Switch providers anytime with your existing contracts</p>
            </div>
            <div className="text-center">
              <Globe className="w-12 h-12 mx-auto mb-3 opacity-90" />
              <h3 className="text-lg font-semibold mb-2">Multi-Platform</h3>
              <p className="opacity-90">Windows, macOS, Linux with consistent experience</p>
            </div>
            <div className="text-center">
              <Award className="w-12 h-12 mx-auto mb-3 opacity-90" />
              <h3 className="text-lg font-semibold mb-2">Open Source</h3>
              <p className="opacity-90">Transparent, community-driven development</p>
            </div>
          </div>
        </motion.div>

        {/* Feature Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-16"
          id="comparison"
        >
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Feature Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-semibold text-gray-900">Feature</th>
                  <th className="text-center p-4 font-semibold text-gray-900">Scalix</th>
                  <th className="text-center p-4 font-semibold text-gray-900">Lovable</th>
                  <th className="text-center p-4 font-semibold text-gray-900">v0</th>
                  <th className="text-center p-4 font-semibold text-gray-900">Bolt</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{item.feature}</div>
                      <div className="text-sm text-gray-600">{item.description}</div>
                    </td>
                    <td className="p-4 text-center">
                      {item.scalix ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {item.lovable ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {item.v0 ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {item.bolt ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Developers Are Saying</h2>
            <p className="text-xl text-gray-600">Real stories from developers who switched to Scalix</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-200 rounded-xl p-6"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.company}</div>
                    <div className="text-xs text-primary-600 font-medium">
                      Switched from {testimonial.previous} • Saved {testimonial.savings}/month
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  "{testimonial.content}"
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Case Studies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">How companies benefited from switching to Scalix</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.company}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-200 rounded-xl p-6"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                    <TrendingUp className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{study.company}</h3>
                    <div className="text-xs text-primary-600">vs {study.competitor}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 text-sm mb-2">Challenge:</h4>
                  <p className="text-gray-600 text-sm">{study.challenge}</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 text-sm mb-2">Scalix Solution:</h4>
                  <p className="text-gray-600 text-sm">{study.solution}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 text-sm mb-2">Results:</h4>
                  <ul className="space-y-1">
                    {study.results.map((result, idx) => (
                      <li key={idx} className="text-sm text-green-700 flex items-center">
                        <Check className="w-3 h-3 mr-2" />
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-primary-600 rounded-2xl p-8 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Switch to Scalix?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Experience the difference with better privacy, cost control, and advanced AI features.
            Join thousands of developers who have made the switch.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-50">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/features">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                Explore Features
              </Button>
            </Link>
          </div>

          <div className="mt-6 text-primary-200 text-sm">
            ✨ 14-day free trial • No credit card required • Easy migration
          </div>
        </motion.div>

      </div>

      <Footer />
    </div>
  )
}
