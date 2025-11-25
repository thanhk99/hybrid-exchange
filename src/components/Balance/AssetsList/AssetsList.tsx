"use client";

import React from 'react';
import { Asset } from '@/src/types/balance';
import AssetRow from '../AssetRow/AssetRow';
import styles from './AssetsList.module.css';

interface AssetsListProps {
    assets: Asset[];
    hideBalance: boolean;
    showFilters?: boolean;
    walletType?: 'all' | 'funding' | 'spot' | 'earn';
    showDetailed?: boolean;
    onAssetClick?: (asset: Asset) => void;
}

export default function AssetsList({
    assets,
    hideBalance,
    showFilters = false,
    walletType = 'all',
    showDetailed = false,
    onAssetClick
}: AssetsListProps) {
    const [activeFilter, setActiveFilter] = React.useState(walletType);

    return (
        <div className={styles.assetsSection}>
            <div className={styles.sectionHeader}>
                <h2>Danh sách tài sản</h2>
                {showFilters && (
                    <div className={styles.filterButtons}>
                        <button
                            className={`${styles.filterButton} ${activeFilter === 'all' ? styles.active : ''}`}
                            onClick={() => setActiveFilter('all')}
                        >
                            Tất cả
                        </button>
                        <button
                            className={`${styles.filterButton} ${activeFilter === 'funding' ? styles.active : ''}`}
                            onClick={() => setActiveFilter('funding')}
                        >
                            Funding
                        </button>
                        <button
                            className={`${styles.filterButton} ${activeFilter === 'spot' ? styles.active : ''}`}
                            onClick={() => setActiveFilter('spot')}
                        >
                            Spot
                        </button>
                        <button
                            className={`${styles.filterButton} ${activeFilter === 'earn' ? styles.active : ''}`}
                            onClick={() => setActiveFilter('earn')}
                        >
                            Earn
                        </button>
                    </div>
                )}
            </div>

            <div className={styles.assetsList}>
                {assets.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>Chưa có tài sản nào</p>
                    </div>
                ) : (
                    assets.map((asset) => (
                        <AssetRow
                            key={asset.symbol}
                            asset={asset}
                            hideBalance={hideBalance}
                            showDetailed={showDetailed}
                            onClick={onAssetClick ? () => onAssetClick(asset) : undefined}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
