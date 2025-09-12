import { NextRequest, NextResponse } from 'next/server'

// Mock user validation endpoint
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          message: 'No authorization token provided',
          error: 'UNAUTHORIZED'
        },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // In development mode, accept any token
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Development mode: Validating token')

      // Mock user data
      const mockUser = {
        id: 'dev-admin-001',
        email: 'admin@scalix.world',
        name: 'Scalix Admin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        plan: 'enterprise',
        createdAt: new Date('2024-01-01'),
      }

      return NextResponse.json({
        success: true,
        user: mockUser,
        message: 'Token validated successfully'
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
    console.error('Token validation API error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Token validation failed',
        error: 'VALIDATION_ERROR'
      },
      { status: 401 }
    )
  }
}
