'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from './ui/Button'
import { Check, Star } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: '$19',
    period: 'per month',
    description: 'Perfect for individual developers',
    features: [
      'Up to 5,000 API calls/month',
      'Scalix Local AI models',
      'Real-time usage monitoring',
      'Basic load balancing',
      'Email support',
      '1 application',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Professional',
    price: '$79',
    period: 'per month',
    description: 'For growing applications',
    features: [
      'Up to 50,000 API calls/month',
      'Scalix Advanced AI models + custom models',
      'Advanced analytics dashboard',
      'Intelligent load balancing',
      'Priority support',
      '5 applications',
      'Webhook notifications',
    ],
    cta: 'Start Pro Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$299',
    period: 'per month',
    description: 'For large-scale applications',
    features: [
      'Unlimited API calls',
      'Scalix Enterprise AI models + custom models',
      'Custom analytics & reporting',
      'Advanced load balancing',
      'Dedicated support manager',
      'Unlimited applications',
      'Custom integrations',
      'SLA guarantees',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            API Subscription Plans
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your AI API subscription needs. Scale as your application grows.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-100 rounded-lg p-1 mb-8">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors relative ${
                billingCycle === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
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

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative bg-white rounded-2xl shadow-sm border p-8 ${
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

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.popular
                    ? 'bg-primary-600 hover:bg-primary-700 text-white'
                    : plan.name === 'Free'
                    ? 'bg-gray-900 hover:bg-gray-800 text-white'
                    : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300'
                }`}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* FAQ Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600">
            Have questions? Check out our{' '}
            <a href="/faq" className="text-primary-600 hover:text-primary-700 underline">
              frequently asked questions
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
