'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import {
  CreditCard,
  DollarSign,
  Calendar,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Receipt,
  Settings,
  ExternalLink,
  Loader2
} from 'lucide-react'
import { StripeCheckout, useCustomerPortal } from '@/components/stripe/StripeCheckout'
import { STRIPE_PLANS } from '@/lib/stripe'

interface Invoice {
  id: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'overdue'
  description: string
  downloadUrl: string
  number: string
  period: string
}

interface BillingInfo {
  currentPlan: string
  billingCycle: string
  nextBillingDate: string
  paymentMethod: string
  usageThisMonth: number
  monthlyLimit: number
  subscriptionId?: string
  status: 'active' | 'canceled' | 'past_due'
}

interface SubscriptionDetails {
  id: string
  status: string
  current_period_start: number
  current_period_end: number
  cancel_at_period_end: boolean
  items: {
    price: {
      id: string
      unit_amount: number
      currency: string
    }
    quantity: number
  }[]
}

const mockInvoices: Invoice[] = [
  {
    id: 'INV-2025-001',
    number: 'INV-2025-001',
    date: '2025-09-01',
    period: 'Sep 1 - Sep 30, 2025',
    amount: 45.80,
    status: 'paid',
    description: 'September 2025 - GPT-4 Usage & Subscription',
    downloadUrl: '#'
  },
  {
    id: 'INV-2025-002',
    number: 'INV-2025-002',
    date: '2025-08-01',
    period: 'Aug 1 - Aug 31, 2025',
    amount: 38.20,
    status: 'paid',
    description: 'August 2025 - Claude 3 Opus Usage & Subscription',
    downloadUrl: '#'
  },
  {
    id: 'INV-2025-003',
    number: 'INV-2025-003',
    date: '2025-07-01',
    period: 'Jul 1 - Jul 31, 2025',
    amount: 32.45,
    status: 'paid',
    description: 'July 2025 - Gemini Pro Usage & Subscription',
    downloadUrl: '#'
  },
  {
    id: 'INV-2025-004',
    number: 'INV-2025-004',
    date: '2025-06-01',
    period: 'Jun 1 - Jun 30, 2025',
    amount: 28.90,
    status: 'paid',
    description: 'June 2025 - GPT-4 Usage & Subscription',
    downloadUrl: '#'
  },
]

const mockBillingInfo: BillingInfo = {
  currentPlan: 'Pro Plan',
  billingCycle: 'Monthly',
  nextBillingDate: '2025-10-01',
  paymentMethod: '•••• •••• •••• 4242',
  usageThisMonth: 15680,
  monthlyLimit: 10000,
  subscriptionId: 'sub_mock_1234567890',
  status: 'active'
}

const mockSubscriptionDetails: SubscriptionDetails = {
  id: 'sub_mock_1234567890',
  status: 'active',
  current_period_start: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
  current_period_end: Date.now() + 30 * 24 * 60 * 60 * 1000,   // 30 days from now
  cancel_at_period_end: false,
  items: [
    {
      price: {
        id: 'price_pro_monthly',
        unit_amount: 2999,
        currency: 'usd'
      },
      quantity: 1
    }
  ]
}

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'payment' | 'subscription'>('overview')
  const [customerData, setCustomerData] = useState<any>(null)
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(true)
  const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionDetails | null>(mockSubscriptionDetails)
  const [isCanceling, setIsCanceling] = useState(false)
  const [isReactivating, setIsReactivating] = useState(false)
  const { openPortal, isLoading: isPortalLoading, error: portalError } = useCustomerPortal()

  // Check for success/cancel query parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('success') === 'true') {
      // Handle successful payment
      console.log('Payment successful!')
      // You could show a success message here
    } else if (urlParams.get('canceled') === 'true') {
      // Handle canceled payment
      console.log('Payment canceled')
      // You could show a cancellation message here
    }
  }, [])

  // Fetch customer data from Stripe
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await fetch('/api/stripe/customer')
        if (response.ok) {
          const data = await response.json()
          setCustomerData(data)
        }
      } catch (error) {
        console.error('Error fetching customer data:', error)
      } finally {
        setIsLoadingCustomer(false)
      }
    }

    fetchCustomerData()
  }, [])

  const usagePercentage = (mockBillingInfo.usageThisMonth / mockBillingInfo.monthlyLimit) * 100
  const isNearLimit = usagePercentage > 80

  // Determine current plan from customer data or use mock data
  const currentPlan = customerData?.subscription?.plan_name || mockBillingInfo.currentPlan
  const isProPlan = currentPlan?.toLowerCase().includes('pro') || customerData?.subscription

  // Subscription management functions
  const handleCancelSubscription = async () => {
    if (!subscriptionDetails?.id) return

    setIsCanceling(true)
    try {
      const response = await fetch('/api/stripe/subscription/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: subscriptionDetails.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to cancel subscription')
      }

      const data = await response.json()
      setSubscriptionDetails(prev => prev ? { ...prev, cancel_at_period_end: true } : null)
      alert('Subscription will be canceled at the end of the current billing period.')
    } catch (error) {
      console.error('Error canceling subscription:', error)
      alert('Failed to cancel subscription. Please try again.')
    } finally {
      setIsCanceling(false)
    }
  }

  const handleReactivateSubscription = async () => {
    if (!subscriptionDetails?.id) return

    setIsReactivating(true)
    try {
      const response = await fetch('/api/stripe/subscription/reactivate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: subscriptionDetails.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to reactivate subscription')
      }

      const data = await response.json()
      setSubscriptionDetails(prev => prev ? { ...prev, cancel_at_period_end: false } : null)
      alert('Subscription reactivated successfully!')
    } catch (error) {
      console.error('Error reactivating subscription:', error)
      alert('Failed to reactivate subscription. Please try again.')
    } finally {
      setIsReactivating(false)
    }
  }

  const handleDownloadInvoice = async (invoiceId: string, invoiceNumber: string) => {
    try {
      console.log('Downloading invoice:', invoiceId, invoiceNumber)

      // Call our invoice download API
      const response = await fetch(`/api/stripe/download-invoice?invoice_id=${invoiceId}`)

      if (!response.ok) {
        throw new Error('Failed to generate invoice')
      }

      // Get the HTML content
      const invoiceHTML = await response.text()

      // Create a blob with the HTML content
      const blob = new Blob([invoiceHTML], { type: 'text/html' })

      // Create download link
      const url = URL.createObjectURL(blob)
      const element = document.createElement('a')
      element.href = url
      element.download = `invoice-${invoiceNumber}.html`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)

      // Clean up
      URL.revokeObjectURL(url)

      console.log('Invoice downloaded successfully')
    } catch (error) {
      console.error('Error downloading invoice:', error)
      alert('Failed to download invoice. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
          <p className="text-gray-600 mt-2">Manage your subscription, payment methods, and billing history</p>
        </div>
        <div className="flex items-center space-x-3">
          {customerData?.customer && (
            <Button
              variant="outline"
              onClick={openPortal}
              disabled={isPortalLoading}
              className="flex items-center"
            >
              {isPortalLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <ExternalLink className="w-4 h-4 mr-2" />
              )}
              Manage Subscription
            </Button>
          )}
          {!isProPlan && (
            <StripeCheckout
              planType="pro"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Upgrade to Pro
            </StripeCheckout>
          )}
          <Button variant="outline" className="flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Plan Settings
          </Button>
        </div>
      </motion.div>

      {/* Current Plan Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Current Plan</h2>
            <p className="text-gray-600">Your active subscription details</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {isLoadingCustomer ? (
                <div className="animate-pulse bg-gray-200 h-6 w-24 rounded"></div>
              ) : (
                currentPlan
              )}
            </div>
            <div className="text-sm text-gray-600">
              {customerData?.subscription ? 'Monthly billing' : 'Free plan'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Cost</p>
              <p className="text-lg font-semibold text-gray-900">$29.99</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Next Billing</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(mockBillingInfo.nextBillingDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Payment Method</p>
              <p className="text-lg font-semibold text-gray-900">{mockBillingInfo.paymentMethod}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Usage & Limits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Monthly Usage</h2>
            <p className="text-gray-600">Track your API usage this month</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {mockBillingInfo.usageThisMonth.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">
              of {mockBillingInfo.monthlyLimit.toLocaleString()} requests
            </div>
          </div>
        </div>

        {/* Usage Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Usage this month</span>
            <span>{usagePercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                isNearLimit ? 'bg-orange-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>
          {isNearLimit && (
            <div className="flex items-center mt-2 text-orange-600 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              You're approaching your monthly limit
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Button variant="outline">View Detailed Usage</Button>
          {isNearLimit && !isProPlan && (
            <StripeCheckout
              planType="pro"
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Upgrade Plan
            </StripeCheckout>
          )}
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="border-b border-gray-200">
          <nav className="flex">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'subscription', label: 'Subscription' },
              { id: 'invoices', label: 'Invoices' },
              { id: 'payment', label: 'Payment Methods' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'subscription' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Subscription Management</h3>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={openPortal}
                    disabled={isPortalLoading}
                    className="flex items-center"
                  >
                    {isPortalLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <ExternalLink className="w-4 h-4 mr-2" />
                    )}
                    Manage in Stripe
                  </Button>
                </div>
              </div>

              {/* Subscription Status */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Current Subscription</h4>
                    <p className="text-sm text-gray-600">
                      {subscriptionDetails?.status === 'active' ? 'Active' :
                       subscriptionDetails?.status === 'canceled' ? 'Canceled' :
                       subscriptionDetails?.status === 'past_due' ? 'Past Due' : 'Unknown'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {subscriptionDetails?.items[0]?.price?.unit_amount ?
                        `$${(subscriptionDetails.items[0].price.unit_amount / 100).toFixed(2)}` :
                        '$29.99'}
                    </div>
                    <div className="text-sm text-gray-600">per month</div>
                  </div>
                </div>

                {/* Billing Period */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current Period</p>
                    <p className="text-sm text-gray-900">
                      {subscriptionDetails ?
                        `${new Date(subscriptionDetails.current_period_start).toLocaleDateString()} - ${new Date(subscriptionDetails.current_period_end).toLocaleDateString()}` :
                        'N/A'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Next Billing Date</p>
                    <p className="text-sm text-gray-900">
                      {subscriptionDetails ?
                        new Date(subscriptionDetails.current_period_end).toLocaleDateString() :
                        mockBillingInfo.nextBillingDate
                      }
                    </p>
                  </div>
                </div>

                {/* Cancellation Notice */}
                {subscriptionDetails?.cancel_at_period_end && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-red-800">
                          Subscription will be canceled
                        </p>
                        <p className="text-sm text-red-600">
                          Your subscription will end on {new Date(subscriptionDetails.current_period_end).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Subscription Actions */}
                <div className="flex items-center space-x-4">
                  {!subscriptionDetails?.cancel_at_period_end ? (
                    <Button
                      variant="outline"
                      onClick={handleCancelSubscription}
                      disabled={isCanceling}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      {isCanceling ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Canceling...
                        </>
                      ) : (
                        'Cancel Subscription'
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleReactivateSubscription}
                      disabled={isReactivating}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isReactivating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Reactivating...
                        </>
                      ) : (
                        'Reactivate Subscription'
                      )}
                    </Button>
                  )}

                  <StripeCheckout
                    planType="team"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Upgrade to Team
                  </StripeCheckout>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Billing Summary</h3>
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Month</span>
                      <span className="font-semibold">$45.80</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Month</span>
                      <span className="font-semibold">$38.20</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-900 font-medium">Change</span>
                      <span className="font-semibold text-green-600">+19.9%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Payment Status</h3>
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Auto-payment</span>
                      <span className="text-green-600 font-semibold">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Next charge</span>
                      <span className="font-semibold">
                        {new Date(mockBillingInfo.nextBillingDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Amount</span>
                      <span className="font-semibold">$29.99</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Invoice History</h3>
                <Button variant="outline" className="flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
              </div>

              <div className="space-y-3">
                {mockInvoices.map((invoice) => (
                  <motion.div
                    key={invoice.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Receipt className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{invoice.number}</p>
                        <p className="text-sm text-gray-600">{invoice.description}</p>
                        <p className="text-xs text-gray-500">
                          {invoice.period} • {new Date(invoice.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        invoice.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : invoice.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {invoice.status === 'paid' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {invoice.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                        {invoice.status === 'overdue' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${invoice.amount.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">USD</p>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadInvoice(invoice.id, invoice.number)}
                        className="flex items-center"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        PDF
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
                <Button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-sm">VISA</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                      <p className="text-sm text-gray-600">Expires 12/25</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-green-600 text-sm font-medium">Default</span>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Billing Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      defaultValue="123 Main Street"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      defaultValue="San Francisco"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      defaultValue="CA"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      defaultValue="94105"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Button>Save Changes</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
