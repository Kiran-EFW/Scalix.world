import { NextRequest, NextResponse } from 'next/server'
import { errorLogger, ErrorSeverity, ErrorCategory } from '@/lib/errorLogger'

// GET /api/errors - Get error logs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const limit = parseInt(searchParams.get('limit') || '50')
    const severity = searchParams.get('severity') as ErrorSeverity

    switch (action) {
      case 'logs':
        const errorLogs = await errorLogger.getErrorLogs(limit, severity)
        return NextResponse.json({
          success: true,
          data: errorLogs
        })

      case 'stats':
        const stats = await errorLogger.getErrorStats()
        return NextResponse.json({
          success: true,
          data: stats
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use "logs" or "stats"'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Error in /api/errors GET:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch error data'
    }, { status: 500 })
  }
}

// POST /api/errors - Log new error or resolve existing error
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'log':
        const errorData = await request.json()
        const { message, severity, category, details } = errorData

        if (!message) {
          return NextResponse.json({
            success: false,
            error: 'Error message is required'
          }, { status: 400 })
        }

        const errorId = await errorLogger.logError({
          message,
          severity: severity || ErrorSeverity.MEDIUM,
          category: category || ErrorCategory.SYSTEM,
          details,
          userId: 'admin', // In production, get from auth context
          sessionId: 'session_' + Date.now(),
          userAgent: request.headers.get('user-agent') || 'Unknown',
          url: request.headers.get('referer') || 'Unknown'
        })

        return NextResponse.json({
          success: true,
          data: { errorId },
          message: 'Error logged successfully'
        })

      case 'resolve':
        const { errorId: resolveErrorId, resolvedBy } = await request.json()

        if (!resolveErrorId || !resolvedBy) {
          return NextResponse.json({
            success: false,
            error: 'Error ID and resolvedBy are required'
          }, { status: 400 })
        }

        const resolved = await errorLogger.resolveError(resolveErrorId, resolvedBy)

        if (resolved) {
          return NextResponse.json({
            success: true,
            message: 'Error resolved successfully'
          })
        } else {
          return NextResponse.json({
            success: false,
            error: 'Error not found or already resolved'
          }, { status: 404 })
        }

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use "log" or "resolve"'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Error in /api/errors POST:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process error request'
    }, { status: 500 })
  }
}
