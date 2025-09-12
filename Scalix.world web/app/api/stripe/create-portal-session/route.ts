import { NextRequest, NextResponse } from 'next/server'
import { createOrRetrieveCustomer, createCustomerPortalSession, stripeConfig } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripeConfig.isConfigured) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please check your environment variables.' },
        { status: 503 }
      )
    }
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

    // Create or retrieve customer
    const customer = await createOrRetrieveCustomer(mockUser.email, mockUser.name)

    // Create customer portal session
    const portalSession = await createCustomerPortalSession(
      customer.id,
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`
    )

    return NextResponse.json({
      url: portalSession.url
    })

  } catch (error) {
    console.error('Error creating portal session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
