"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import TokenService from '@/src/services/token';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    // Get auth state from Redux
    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);

    useEffect(() => {
        const checkAuth = () => {
            // Check if user has a valid token
            const hasToken = TokenService.isLogin();

            // If not authenticated and no token, redirect to login
            if (!isAuthenticated && !hasToken) {
                // Store current path for redirect after login
                const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
                router.push(loginUrl);
            } else {
                setIsChecking(false);
            }
        };

        checkAuth();
    }, [isAuthenticated, pathname, router]);

    // Show loading state while checking authentication
    if (isChecking) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                fontSize: '1.2rem',
                color: '#666'
            }}>
                Đang kiểm tra xác thực...
            </div>
        );
    }

    // Render children if authenticated
    return <>{children}</>;
}
