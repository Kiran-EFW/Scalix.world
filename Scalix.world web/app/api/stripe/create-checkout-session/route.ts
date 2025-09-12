import { NextRequest, NextResponse } from 'next/server'
import { createOrRetrieveCustomer, createCheckoutSession, STRIPE_PLANS, stripeConfig } from '@/lib/stripe'
import { getServerSession } from 'next-auth'

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripeConfig.isConfigured) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please check your environment variables.' },
        { status: 503 }
      )
    }

    const { priceId, planType } = await request.json()

    // Get user session (you'll need to implement authentication)
    // const session = await getServerSession()
    // if (!session?.user?.email) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // For now, using mock user data - replace with real session data
    const mockUser = {
      email: 'admin@scalix.world',
      name: 'Scalix Admin'
    }

    // Validate price ID
    const validPriceIds = Object.values(STRIPE_PLANS).map(plan => plan.priceId).filter(Boolean)
    if (!validPriceIds.includes(priceId)) {
      return NextResponse.json({ error: 'Invalid price ID' }, { status: 400 })
    }

    // Create or retrieve customer
    const customer = await createOrRetrieveCustomer(mockUser.email, mockUser.name)

    // Create checkout session
    const session = await createCheckoutSession(
      customer.id,
      priceId,
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=true`,
      {
        user_email: mockUser.email,
        plan_type: planType
      }
    )

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    })

  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
