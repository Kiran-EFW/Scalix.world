import { NextRequest, NextResponse } from 'next/server'

// Mock signup endpoint for development
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // In development mode, accept any credentials
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Development mode: Creating new user account')

      // Mock successful account creation
      const mockUser = {
        id: 'dev-admin-001',
        email: email || 'admin@scalix.world',
        name: email?.split('@')[0] || 'Scalix Admin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        plan: 'enterprise',
        createdAt: new Date(),
      }

      const mockToken = 'dev-admin-token-2025'

      return NextResponse.json({
        success: true,
        user: mockUser,
        token: mockToken,
        message: 'Development account created successfully'
      })
    }

    // For production, return a proper error
    return NextResponse.json(
      {
        success: false,
        message: 'Authentication service not available. Please use development mode.',
        error: 'SERVICE_UNAVAILABLE'
      },
      { status: 503 }
    )

  } catch (error) {
    console.error('Signup API error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid request format',
        error: 'BAD_REQUEST'
      },
      { status: 400 }
    )
  }
}
