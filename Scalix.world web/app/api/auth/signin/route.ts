import { NextRequest, NextResponse } from 'next/server'

// Mock authentication endpoint for development
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // In development mode, accept any credentials
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Development mode: Accepting signin credentials')

      // Mock successful authentication
      const mockUser = {
        id: 'dev-admin-001',
        email: email || 'admin@scalix.world',
        name: email?.split('@')[0] || 'Scalix Admin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        plan: 'enterprise',
        createdAt: new Date('2024-01-01'),
      }

      const mockToken = 'dev-admin-token-2025'

      return NextResponse.json({
        success: true,
        user: mockUser,
        token: mockToken,
        message: 'Development authentication successful'
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
    console.error('Signin API error:', error)
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
