'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Asset, ActionButton } from '@/src/types/balance';
import { getAssetsOverview } from '@/src/services/balance';
import BalanceHeader from '@/src/components/Balance/BalanceHeader/BalanceHeader';
import TotalBalanceCard from '@/src/components/Balance/TotalBalanceCard/TotalBalanceCard';
import AssetsList from '@/src/components/Balance/AssetsList/AssetsList';
import styles from './page.module.css';

export default function EarnWalletPage() {
    const router = useRouter();
    const [hideBalance, setHideBalance] = useState(false);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchEarnData();
    }, []);

    const fetchEarnData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAssetsOverview();

            // Transform earn assets
            const earnAssets: Asset[] = [];
            if (data.earn?.assets && Array.isArray(data.earn.assets)) {
                data.earn.assets.forEach((asset: { currency: string; balance: number; valueUsd: number; locked: number }) => {
                    if (asset && asset.currency) {
                        earnAssets.push({
                            symbol: asset.currency,
                            name: asset.currency,
                            balance: asset.balance || 0,
                            usdValue: asset.valueUsd || 0,
                            available: (asset.balance || 0) - (asset.locked || 0),
                            locked: asset.locked || 0,
                        });
                    }
                });
            }

            setAssets(earnAssets);
            setTotalBalance(data.earn?.totalUsd || 0);
        } catch (err) {
            console.error('Error fetching earn data:', err);
            const errorMessage = err instanceof Error
                ? err.message
                : 'Không thể tải dữ liệu ví Earn';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const balanceActions: ActionButton[] = [
        { label: 'Gửi tiết kiệm', onClick: () => router.push('/earn/savings') },
        { label: 'Staking', onClick: () => router.push('/earn/staking') },
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
                    <button className={styles.retryButton} onClick={fetchEarnData}>
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.walletPage}>
            <BalanceHeader
                title="Ví Earn"
                hideBalance={hideBalance}
                onToggleHide={() => setHideBalance(!hideBalance)}
                showBackButton={true}
            />

            <TotalBalanceCard
                totalBalance={totalBalance}
                hideBalance={hideBalance}
                label="Tổng số dư Earn"
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
