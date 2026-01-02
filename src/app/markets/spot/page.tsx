"use client";

import MarketTable from '@/src/components/Markets/MarketTable';
import styles from './page.module.css';

export default function SpotPage() {
    return (
        <div className={styles.container}>
            <MarketTable />
        </div>
    );
}
