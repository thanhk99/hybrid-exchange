"use client";

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect, ComponentType } from 'react';
import { RootState } from '../../store/store';

interface WithAuthOptions {
  redirectTo?: string;
  requireAuth?: boolean;
}

const withAuth = <P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithAuthOptions = {}
) => {
  const { redirectTo = '/login', requireAuth = true } = options;

  const AuthenticatedComponent = (props: P) => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const router = useRouter();

    useEffect(() => {
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo);
      } else if (!requireAuth && isAuthenticated) {
        // Redirect authenticated users away from auth pages
        router.push('/account/overview');
      }
    }, [isAuthenticated, router]);

    // Show loading while redirecting
    if (requireAuth && !isAuthenticated) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang xác thực...</p>
          </div>
        </div>
      );
    }

    if (!requireAuth && isAuthenticated) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang chuyển hướng...</p>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;

  return AuthenticatedComponent;
};

export default withAuth;