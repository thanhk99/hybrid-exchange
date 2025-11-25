import React from 'react';
import AccountSidebar from '@/src/components/common/AccountSidebar/AccountSidebar';
import ProtectedRoute from '@/src/components/common/ProtectedRoute/ProtectedRoute';
import styles from './layout.module.css';

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <div className={styles.accountLayout}>
                <AccountSidebar />
                <div className={styles.accountContent}>
                    {children}
                </div>
            </div>
        </ProtectedRoute>
    );
}
