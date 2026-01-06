import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = ['/balance', '/assets', '/account'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the current path is a protected route
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // Get the refresh token from cookies (since access token is now memory-only)
    const refreshToken = request.cookies.get('refreshToken')?.value;

    // If trying to access a protected route without a valid session (refresh token)
    if (isProtectedRoute && !refreshToken) {
        // Store the intended destination to redirect back after login
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // If logged in (has refresh token) and trying to access login/register, redirect to home
    if (refreshToken && (pathname === '/login' || pathname === '/register')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Allow the request to proceed
    return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|imgs|.*\\..*|public).*)',
    ],
};
