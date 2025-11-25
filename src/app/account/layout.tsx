import React from 'react';
import AccountSidebar from '@/src/components/common/AccountSidebar/AccountSidebar';
import styles from './layout.module.css';

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.accountLayout}>
            <AccountSidebar />
            <div className={styles.accountContent}>
                {children}
            </div>
        </div>
    );
}
