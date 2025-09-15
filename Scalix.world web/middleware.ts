import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Admin routes removed - moved to internal admin app

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth',
  '/auth/signin',
  '/auth/signup',
  '/api/auth',
  '/api/auth/signin',
  '/api/auth/signup',
  '/api/auth/me',
  '/_next',
  '/favicon.ico',
  '/public',
]

// Environment variable to control access control
const ENABLE_ACCESS_CONTROL = process.env.ENABLE_ACCESS_CONTROL !== 'false'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes that don't need auth
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    publicRoutes.some(route => pathname.startsWith(route))
  ) {
    return NextResponse.next()
  }

  // If access control is disabled (for development), allow all access
  if (!ENABLE_ACCESS_CONTROL) {
    return NextResponse.next()
  }

  // Admin route protection removed - all admin functionality moved to internal admin app

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
