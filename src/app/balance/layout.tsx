import BalanceSidebar from '@/src/components/Balance/BalanceSidebar/BalanceSidebar';
import styles from './layout.module.css';

export default function BalanceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.balanceLayout}>
            <BalanceSidebar />
            <div className={styles.balanceContent}>
                {children}
            </div>
        </div>
    );
}
