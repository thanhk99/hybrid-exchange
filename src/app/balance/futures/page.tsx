'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Asset, ActionButton } from '@/src/types/balance';
import { getAssetsOverview } from '@/src/services/balance';
import BalanceHeader from '@/src/components/Balance/BalanceHeader/BalanceHeader';
import TotalBalanceCard from '@/src/components/Balance/TotalBalanceCard/TotalBalanceCard';
import AssetsList from '@/src/components/Balance/AssetsList/AssetsList';
import styles from './page.module.css';

export default function FuturesWalletPage() {
    const router = useRouter();
    const [hideBalance, setHideBalance] = useState(false);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchFuturesData();
    }, []);

    const fetchFuturesData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAssetsOverview();

            // Transform futures assets
            const futuresAssets: Asset[] = [];
            if (data.futures?.asset) {
                const asset = data.futures.asset;
                futuresAssets.push({
                    symbol: asset.currency,
                    name: asset.currency,
                    balance: asset.totalValue || 0,
                    usdValue: asset.valueUsd || 0,
                    available: asset.availableBalance || 0,
                    locked: asset.lockedBalance || 0,
                });
            }

            setAssets(futuresAssets);
            setTotalBalance(data.futures?.totalUsd || 0);
        } catch (err) {
            console.error('Error fetching futures data:', err);
            const errorMessage = err instanceof Error
                ? err.message
                : 'Không thể tải dữ liệu ví Futures';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const balanceActions: ActionButton[] = [
        { label: 'Giao dịch Futures', onClick: () => router.push('/futures') },
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
                    <button className={styles.retryButton} onClick={fetchFuturesData}>
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.walletPage}>
            <BalanceHeader
                title="Ví Futures"
                hideBalance={hideBalance}
                onToggleHide={() => setHideBalance(!hideBalance)}
                showBackButton={true}
            />

            <TotalBalanceCard
                totalBalance={totalBalance}
                hideBalance={hideBalance}
                label="Tổng số dư Futures"
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
