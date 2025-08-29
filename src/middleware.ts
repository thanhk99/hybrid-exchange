import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Define protected routes
  const protectedRoutes = ['/account', '/balance'];
  const authRoutes = ['/login', '/register'];
  
  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // Get authentication status from cookies or headers
  // Note: Since we're using Redux Persist with localStorage, we need to handle this on client side
  // This middleware is mainly for additional security and can redirect based on URL patterns
  
  // For now, let the client-side ProtectedRoute handle the authentication logic
  // This middleware can be enhanced later to work with server-side session management
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|imgs).*)',
  ],
};