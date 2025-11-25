import AssetsSidebar from '@/src/components/Assets/AssetsSidebar/AssetsSidebar';
import styles from './layout.module.css';

export default function AssetsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.assetsLayout}>
            <AssetsSidebar />
            <div className={styles.assetsContent}>
                {children}
            </div>
        </div>
    );
}
