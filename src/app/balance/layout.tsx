import BalanceSidebar from '@/src/components/Balance/BalanceSidebar/BalanceSidebar';
import ProtectedRoute from '@/src/components/common/ProtectedRoute/ProtectedRoute';
import styles from './layout.module.css';
import './theme.css';

export default function BalanceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <div className={styles.balanceLayout}>
                <BalanceSidebar />
                <div className={styles.balanceContent}>
                    {children}
                </div>
            </div>
        </ProtectedRoute>
    );
}
