import AssetsSidebar from '@/src/components/Assets/AssetsSidebar/AssetsSidebar';
import ProtectedRoute from '@/src/components/common/ProtectedRoute/ProtectedRoute';
import styles from './layout.module.css';

export default function AssetsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <div className={styles.assetsLayout}>
                <AssetsSidebar />
                <div className={styles.assetsContent}>
                    {children}
                </div>
            </div>
        </ProtectedRoute>
    );
}
