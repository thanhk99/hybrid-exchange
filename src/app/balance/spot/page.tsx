'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Asset, ActionButton } from '@/src/types/balance';
import { getAssetsOverview } from '@/src/services/balance';
import BalanceHeader from '@/src/components/Balance/BalanceHeader/BalanceHeader';
import TotalBalanceCard from '@/src/components/Balance/TotalBalanceCard/TotalBalanceCard';
import AssetsList from '@/src/components/Balance/AssetsList/AssetsList';
import styles from './page.module.css';

export default function SpotWalletPage() {
    const router = useRouter();
    const [hideBalance, setHideBalance] = useState(false);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSpotData();
    }, []);

    const fetchSpotData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAssetsOverview();

            // Transform spot assets
            const spotAssets: Asset[] = [];
            if (data.spot?.assets && Array.isArray(data.spot.assets)) {
                data.spot.assets.forEach(asset => {
                    if (asset && asset.currency) {
                        spotAssets.push({
                            symbol: asset.currency,
                            name: asset.currency,
                            balance: (asset.balance || 0) + (asset.locked || 0), // Total
                            usdValue: asset.valueUsd || 0,
                            available: asset.balance || 0, // Available
                            locked: asset.locked || 0,
                        });
                    }
                });
            }

            setAssets(spotAssets);
            setTotalBalance(data.spot?.totalUsd || 0);
        } catch (err) {
            console.error('Error fetching spot data:', err);
            const errorMessage = err instanceof Error
                ? err.message
                : 'Không thể tải dữ liệu ví Spot';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const balanceActions: ActionButton[] = [
        { label: 'Giao dịch', onClick: () => router.push('/trade') },
        { label: 'Chuyển đổi', onClick: () => router.push('/assets/convert') },
        { label: 'Chuyển ví', onClick: () => router.push('/balance/transfer') },
    ];

    if (loading) {
        return (
            <div className={styles.walletPage}>
                <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <p>Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.walletPage}>
                <div className={styles.errorState}>
                    <p className={styles.errorMessage}>{error}</p>
                    <button className={styles.retryButton} onClick={fetchSpotData}>
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.walletPage}>
            <BalanceHeader
                title="Ví Spot"
                hideBalance={hideBalance}
                onToggleHide={() => setHideBalance(!hideBalance)}
                showBackButton={true}
            />

            <TotalBalanceCard
                totalBalance={totalBalance}
                hideBalance={hideBalance}
                label="Tổng số dư Spot"
                actions={balanceActions}
            />

            <AssetsList
                assets={assets}
                hideBalance={hideBalance}
                showDetailed={true}
            />
        </div>
    );
}
