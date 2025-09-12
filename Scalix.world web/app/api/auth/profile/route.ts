import { NextRequest, NextResponse } from 'next/server'

// Mock profile endpoint
export async function PATCH(request: NextRequest) {
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

    const updates = await request.json()

    // In development mode, accept any updates
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Development mode: Updating user profile')

      // Mock updated user data
      const mockUser = {
        id: 'dev-admin-001',
        email: updates.email || 'admin@scalix.world',
        name: updates.name || 'Scalix Admin',
        avatar: updates.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        plan: 'enterprise',
        createdAt: new Date('2024-01-01'),
      }

      return NextResponse.json({
        success: true,
        user: mockUser,
        message: 'Profile updated successfully'
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
    console.error('Profile API error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Profile update failed',
        error: 'INTERNAL_ERROR'
      },
      { status: 500 }
    )
  }
}
