import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

// Check if Stripe keys are available
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

// Initialize Stripe only if secret key is available and not a mock key
let stripe: Stripe | null = null
if (stripeSecretKey && 
    stripeSecretKey !== 'sk_test_...' && 
    !stripeSecretKey.includes('...') &&
    !stripeSecretKey.includes('development_mock_key')) {
  stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2025-08-27.basil' as any,
    typescript: true,
  })
}

// Stripe configuration with fallbacks
export const stripeConfig = {
  publishableKey: stripePublishableKey || '',
  secretKey: stripeSecretKey || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  isConfigured: !!(stripe && stripePublishableKey),
}

// Plan configurations
export const STRIPE_PLANS = {
  free: {
    priceId: process.env.STRIPE_FREE_PRICE_ID || '',
    name: 'Free',
    price: 0,
    tokens: 100,
  },
  pro: {
    priceId: process.env.STRIPE_PRO_PRICE_ID || '',
    name: 'Pro',
    price: 2999, // $29.99 in cents
    tokens: 10000,
  },
  team: {
    priceId: process.env.STRIPE_TEAM_PRICE_ID || '',
    name: 'Team',
    price: 9999, // $99.99 in cents
    tokens: 50000,
  },
}

// Helper function to create or retrieve customer
export async function createOrRetrieveCustomer(email: string, name?: string) {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please check your environment variables.')
  }

  try {
    // Check if customer already exists
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    })

    if (existingCustomers.data.length > 0) {
      return existingCustomers.data[0]
    }

    // Create new customer
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        source: 'scalix-web',
      },
    })

    return customer
  } catch (error) {
    console.error('Error creating/retrieving customer:', error)
    throw error
  }
}

// Helper function to create checkout session
export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string,
  metadata?: Record<string, string>
) {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please check your environment variables.')
  }

  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
      allow_promotion_codes: true,
    })

    return session
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

// Helper function to create customer portal session
export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string
) {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please check your environment variables.')
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })

    return session
  } catch (error) {
    console.error('Error creating customer portal session:', error)
    throw error
  }
}

// Helper function to get customer subscription status
export async function getCustomerSubscription(customerId: string) {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please check your environment variables.')
  }

  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    })

    if (subscriptions.data.length > 0) {
      const subscription = subscriptions.data[0]
      const product = await stripe.products.retrieve(
        subscription.items.data[0].price.product as string
      )

      return {
        id: subscription.id,
        status: subscription.status,
        current_period_end: subscription.current_period_end as number,
        plan_name: product.name,
        price_id: subscription.items.data[0].price.id,
      }
    }

    return null
  } catch (error) {
    console.error('Error getting customer subscription:', error)
    throw error
  }
}

// Helper function to cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please check your environment variables.')
  }

  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })

    return subscription
  } catch (error) {
    console.error('Error canceling subscription:', error)
    throw error
  }
}

// Helper function to reactivate subscription
export async function reactivateSubscription(subscriptionId: string) {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please check your environment variables.')
  }

  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    })

    return subscription
  } catch (error) {
    console.error('Error reactivating subscription:', error)
    throw error
  }
}

export { stripe }
