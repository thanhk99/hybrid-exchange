import P2PSidebar from '@/src/components/P2P/P2PSidebar/P2PSidebar';
import ProtectedRoute from '@/src/components/common/ProtectedRoute/ProtectedRoute';
import styles from './layout.module.css';

export default function P2PLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <div className={styles.p2pLayout}>
                <P2PSidebar />
                <div className={styles.p2pContent}>
                    {children}
                </div>
            </div>
        </ProtectedRoute>
    );
}
