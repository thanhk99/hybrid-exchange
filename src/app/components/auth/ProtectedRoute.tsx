"use client";

import { useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { RootState } from '../../store/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const router = useRouter();
  const pathname = usePathname();

  // Define protected routes - routes that require authentication
  const protectedRoutes = [
    '/account',
    '/balance',
  ];

  // Define public routes - routes that should redirect to dashboard if already logged in
  const authRoutes = [
    '/login',
    '/register',
  ];

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  useEffect(() => {
    // If user is not authenticated and trying to access protected route
    if (!isAuthenticated && isProtectedRoute) {
      router.push('/login');
      return;
    }

    // If user is authenticated and trying to access auth routes, redirect to dashboard
    if (isAuthenticated && isAuthRoute) {
      router.push('/account/overview');
      return;
    }
  }, [isAuthenticated, pathname, router, isProtectedRoute, isAuthRoute]);

  // Show loading or redirect for protected routes when not authenticated
  if (!isAuthenticated && isProtectedRoute) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang chuyển hướng đến trang đăng nhập...</p>
        </div>
      </div>
    );
  }

  // Show loading for auth routes when authenticated
  if (isAuthenticated && isAuthRoute) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang chuyển hướng...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;