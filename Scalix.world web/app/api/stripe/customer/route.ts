import { NextRequest, NextResponse } from 'next/server'
import { createOrRetrieveCustomer, getCustomerSubscription } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  try {
    // Check if we're in development mode with mock Stripe keys
    const isDevelopmentMode = process.env.NODE_ENV === 'development' && 
                             process.env.STRIPE_SECRET_KEY?.includes('development_mock_key')

    if (isDevelopmentMode) {
      // Return mock data for development
      return NextResponse.json({
        customer: {
          id: 'cus_development_mock',
          email: 'admin@scalix.world',
          name: 'Scalix Admin'
        },
        subscription: {
          id: 'sub_development_mock',
          status: 'active',
          current_period_end: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days from now
          plan_name: 'Pro Plan',
          price_id: 'price_development_pro'
        }
      })
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

    // Get subscription status
    const subscription = await getCustomerSubscription(customer.id)

    return NextResponse.json({
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
      },
      subscription: subscription || null
    })

  } catch (error) {
    console.error('Error getting customer data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
