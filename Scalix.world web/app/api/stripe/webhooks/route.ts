import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe, stripeConfig } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please check your environment variables.' },
        { status: 503 }
      )
    }
    const body = await request.text()
    const sig = headers().get('stripe-signature')

    let event

    try {
      event = stripe.webhooks.constructEvent(body, sig!, stripeConfig.webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        console.log('Checkout session completed:', session.id)
        // Update user subscription status in your database
        // await updateUserSubscription(session.customer, session.subscription)
        break

      case 'invoice.payment_succeeded':
        const invoice = event.data.object
        console.log('Invoice payment succeeded:', invoice.id)
        // Handle successful payment
        // await handlePaymentSuccess(invoice.customer, invoice.subscription)
        break

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object
        console.log('Invoice payment failed:', failedInvoice.id)
        // Handle failed payment
        // await handlePaymentFailure(failedInvoice.customer, failedInvoice.subscription)
        break

      case 'customer.subscription.updated':
        const subscription = event.data.object
        console.log('Subscription updated:', subscription.id)
        // Update subscription status
        // await updateSubscriptionStatus(subscription.customer, subscription)
        break

      case 'customer.subscription.deleted':
        const canceledSubscription = event.data.object
        console.log('Subscription canceled:', canceledSubscription.id)
        // Handle subscription cancellation
        // await handleSubscriptionCancellation(canceledSubscription.customer)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
