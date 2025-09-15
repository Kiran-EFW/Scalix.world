import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Admin routes that require authentication
const adminRoutes = [
  '/admin',
  '/admin/',
  '/api/admin',
  '/api/admin/',
]

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

  // Check if this is an admin route
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))

  if (isAdminRoute) {
    // Get the auth token from cookies or headers
    const token = request.cookies.get('scalix_auth_token')?.value ||
                  request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      // Redirect to signin with return URL
      const signinUrl = new URL('/auth/signin', request.url)
      signinUrl.searchParams.set('returnUrl', pathname)
      signinUrl.searchParams.set('error', 'Admin access required')
      return NextResponse.redirect(signinUrl)
    }

    // For now, we'll allow the request to proceed
    // In production, you'd validate the token with your auth service
    // For development, we'll trust the token exists
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.next()
    }

    // Production token validation would go here
    // This is where you'd call your auth service to validate the token
    // and check if the user has admin permissions

    try {
      // TODO: Implement proper token validation
      // const decoded = jwt.verify(token, process.env.JWT_SECRET!)
      // if (!decoded || !decoded.isAdmin) {
      //   return NextResponse.redirect(new URL('/auth/signin?error=Insufficient permissions', request.url))
      // }
    } catch (error) {
      return NextResponse.redirect(new URL('/auth/signin?error=Invalid token', request.url))
    }
  }

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
