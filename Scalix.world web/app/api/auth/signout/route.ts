import { NextRequest, NextResponse } from 'next/server'

// Mock signout endpoint
export async function POST(request: NextRequest) {
  try {
    // In development mode, just return success
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Development mode: User signed out')

      return NextResponse.json({
        success: true,
        message: 'Signed out successfully'
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
    console.error('Signout API error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Signout failed',
        error: 'INTERNAL_ERROR'
      },
      { status: 500 }
    )
  }
}
