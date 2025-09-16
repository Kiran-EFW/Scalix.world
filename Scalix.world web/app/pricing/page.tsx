'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { Check, Star, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { StripeCheckout } from '@/components/stripe/StripeCheckout'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started with AI development',
    features: [
      'Up to 100 AI tokens/month',
      'Scalix Local AI models',
      'Local processing only',
      'Community support',
      '1 active project',
      'Basic analytics',
    ],
    limitations: [
      'Limited to local AI models',
      'No cloud API key integration',
      'Community support only',
    ],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: 'per month',
    description: 'For serious developers building AI applications',
    features: [
      'Up to 10,000 AI tokens/month',
      'Scalix Advanced AI models',
      'Bring your own API keys',
      'Advanced local processing',
      'Priority email support',
      'Unlimited projects',
      'Team collaboration (up to 3 members)',
      'Advanced analytics & insights',
      'Custom model fine-tuning',
      'API access',
    ],
    limitations: [],
    cta: 'Start Pro Trial',
    popular: true,
  },
  {
    name: 'Team',
    price: '$99',
    period: 'per month',
    description: 'For development teams and organizations',
    features: [
      'Up to 50,000 AI tokens/month',
      'Everything in Pro',
      'Advanced team management',
      'Admin dashboard & controls',
      'Custom integrations',
      'Dedicated support manager',
      '5 team members included',
      'Advanced security features',
      'Audit logs & compliance',
      'Custom deployment options',
      'Priority feature requests',
    ],
    limitations: [],
    cta: 'Start Team Trial',
    popular: false,
  },
]

const faqs = [
  {
    question: 'What are AI tokens and how are they counted?',
    answer: 'AI tokens represent the computational units used by AI models. Each token roughly corresponds to 4 characters of text. We count both input and output tokens. For example, a short question might use 10-20 tokens, while a detailed response could use 100-500 tokens.'
  },
  {
    question: 'Can I upgrade or downgrade my plan anytime?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any charges. If you downgrade, you\'ll retain your current plan benefits until the next billing cycle.'
  },
  {
    question: 'What happens if I exceed my token limit?',
    answer: 'If you exceed your monthly token limit, your requests will be queued and processed at a reduced rate. You\'ll receive notifications when you\'re approaching your limit, and you can upgrade your plan anytime to increase your limit.'
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 30-day money-back guarantee for all paid plans. If you\'re not satisfied with your subscription, contact our support team within 30 days of your initial payment for a full refund.'
  },
  {
    question: 'Can I use my own AI API keys?',
    answer: 'Yes! With Pro and Team plans, you can bring your own API keys for external AI providers if needed. However, Scalix is designed to work primarily with local AI models for maximum privacy and control.'
  },
  {
    question: 'What\'s included in team collaboration?',
    answer: 'Team collaboration includes shared projects, real-time editing, comment threads, version control integration, and team management tools. You can invite team members, assign roles, and collaborate on AI-powered development projects.'
  },
  {
    question: 'Is there a free trial for paid plans?',
    answer: 'Yes! Both Pro and Team plans come with a 14-day free trial. You can explore all features without any commitment. Your credit card information is only required if you choose to continue after the trial period.'
  },
  {
    question: 'What kind of support do you offer?',
    answer: 'Free plan users get community support through our forums. Pro users receive priority email support with 24-hour response times. Team users get dedicated support managers and priority phone support when needed.'
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Absolutely! You can cancel your subscription at any time. You\'ll continue to have access to your plan features until the end of your current billing period. No cancellation fees or penalties.'
  },
  {
    question: 'Do you offer custom enterprise plans?',
    answer: 'Yes! For larger organizations or specific requirements, we offer custom enterprise plans. Contact our sales team to discuss your needs and get a tailored solution.'
  }
]

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

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
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Choose Your
              <span className="block text-primary-600">Scalix Plan</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Start free and scale as you grow. Transparent pricing with no hidden fees.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-white rounded-lg p-1 mb-8 shadow-sm border border-gray-200">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-colors relative ${
                  billingCycle === 'yearly'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative bg-white rounded-2xl shadow-lg border p-8 ${
                  plan.popular
                    ? 'border-primary-500 ring-2 ring-primary-500/20'
                    : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-4xl font-bold text-gray-900">
                      {billingCycle === 'yearly' && plan.price !== '$0'
                        ? `$${Math.round(parseInt(plan.price.slice(1)) * 12 * 0.8)}`
                        : plan.price
                      }
                    </span>
                    {plan.price !== '$0' && (
                      <span className="text-gray-600 ml-2">
                        /{billingCycle === 'yearly' ? 'year' : plan.period}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.limitations.length > 0 && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Limitations:</h4>
                    <ul className="space-y-1">
                      {plan.limitations.map((limitation, limitIndex) => (
                        <li key={limitIndex} className="text-sm text-gray-600">
                          • {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {plan.name === 'Free' ? (
                  <Link href="/auth/signin">
                    <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                      {plan.cta}
                    </Button>
                  </Link>
                ) : plan.name === 'Pro' ? (
                  <StripeCheckout
                    planType="pro"
                    className={`w-full ${
                      plan.popular
                        ? 'bg-primary-600 hover:bg-primary-700 text-white'
                        : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300'
                    }`}
                  >
                    {plan.cta}
                  </StripeCheckout>
                ) : plan.name === 'Team' ? (
                  <StripeCheckout
                    planType="team"
                    className={`w-full ${
                      plan.popular
                        ? 'bg-primary-600 hover:bg-primary-700 text-white'
                        : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300'
                    }`}
                  >
                    {plan.cta}
                  </StripeCheckout>
                ) : (
                  <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                    {plan.cta}
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
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
              Feature Comparison
            </h2>
            <p className="text-xl text-gray-600">
              See exactly what's included in each plan
            </p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm border border-gray-200">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-6 font-semibold text-gray-900">Features</th>
                  <th className="text-center p-6 font-semibold text-gray-900">Free</th>
                  <th className="text-center p-6 font-semibold text-gray-900">Pro</th>
                  <th className="text-center p-6 font-semibold text-gray-900">Team</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['AI Tokens per Month', '100', '10,000', '50,000'],
                  ['AI Models', 'Basic Local', 'Premium + Local', 'All Models'],
                  ['API Key Integration', 'No', 'Yes', 'Yes'],
                  ['Projects', '1', 'Unlimited', 'Unlimited'],
                  ['Team Members', '1', '3', '5'],
                  ['Support', 'Community', 'Priority Email', 'Dedicated Manager'],
                  ['Analytics', 'Basic', 'Advanced', 'Enterprise'],
                  ['Custom Integrations', 'No', 'No', 'Yes'],
                ].map((row, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="p-6 font-medium text-gray-900">{row[0]}</td>
                    <td className="p-6 text-center text-gray-700">{row[1]}</td>
                    <td className="p-6 text-center text-gray-700">{row[2]}</td>
                    <td className="p-6 text-center text-gray-700">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
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
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about Scalix pricing and plans
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {faq.question}
                    </h3>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
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
              Ready to Get Started?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of developers building AI applications with Scalix.
              Start with our free plan and upgrade anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signin">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-50">
                  Start Free Trial
                </Button>
              </Link>
              <StripeCheckout
                planType="pro"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 text-lg"
              >
                Start Pro Trial
              </StripeCheckout>
              <Link href="/features">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                  View Features
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
