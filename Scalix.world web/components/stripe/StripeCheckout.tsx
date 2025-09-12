'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { STRIPE_PLANS, stripeConfig } from '@/lib/stripe'
import { loadStripe } from '@stripe/stripe-js'
import { CreditCard, Loader2 } from 'lucide-react'

// Initialize Stripe only if configured
const stripePromise = stripeConfig.isConfigured
  ? loadStripe(stripeConfig.publishableKey)
  : null

interface StripeCheckoutProps {
  planType: 'pro' | 'team'
  className?: string
  children?: React.ReactNode
  disabled?: boolean
}

export function StripeCheckout({
  planType,
  className,
  children,
  disabled = false
}: StripeCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const plan = STRIPE_PLANS[planType]
  const planName = plan.name
  const price = (plan.price / 100).toFixed(2)

  const handleCheckout = async () => {
    // Check if Stripe is configured
    if (!stripeConfig.isConfigured) {
      setError('Stripe is not configured. Please contact support or try again later.')
      return
    }

    if (!plan.priceId) {
      setError('This plan is not available for purchase at this time.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          planType,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create checkout session')
      }

      const { url } = await response.json()

      // Redirect to Stripe Checkout
      window.location.href = url

    } catch (err) {
      console.error('Checkout error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred during checkout')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={handleCheckout}
        disabled={disabled || isLoading}
        className={className}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            {children || `Upgrade to ${planName} - $${price}/month`}
          </>
        )}
      </Button>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

// Hook for managing customer portal
export function useCustomerPortal() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const openPortal = async () => {
    // Check if Stripe is configured
    if (!stripeConfig.isConfigured) {
      setError('Stripe is not configured. Please contact support or try again later.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create portal session')
      }

      const { url } = await response.json()

      // Redirect to Stripe Customer Portal
      window.location.href = url

    } catch (err) {
      console.error('Portal error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return { openPortal, isLoading, error }
}
