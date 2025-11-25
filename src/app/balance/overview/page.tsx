'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAssetsOverview } from '@/src/services/balance';
import { Asset, ActionButton } from '@/src/types/balance';
import BalanceHeader from '@/src/components/Balance/BalanceHeader/BalanceHeader';
import TotalBalanceCard from '@/src/components/Balance/TotalBalanceCard/TotalBalanceCard';
import WalletCard from '@/src/components/Balance/WalletCard/WalletCard';
import AssetsList from '@/src/components/Balance/AssetsList/AssetsList';
import styles from './page.module.css';

export default function BalanceOverviewPage() {
    const router = useRouter();
    const [hideBalance, setHideBalance] = useState(false);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const [fundingTotal, setFundingTotal] = useState(0);
    const [spotTotal, setSpotTotal] = useState(0);
    const [earnTotal, setEarnTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchBalanceData();
    }, []);

    const fetchBalanceData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAssetsOverview();

            // Check if data structure is valid
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid response format');
            }

            // Transform API response to Asset format
            const allAssets: Asset[] = [];

            // Add funding assets with null checks
            if (data.funding?.assets && Array.isArray(data.funding.assets)) {
                data.funding.assets.forEach(asset => {
                    if (asset && asset.currency) {
                        allAssets.push({
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

            // Add spot assets with null checks
            if (data.spot?.assets && Array.isArray(data.spot.assets)) {
                data.spot.assets.forEach(asset => {
                    if (asset && asset.currency) {
                        const existingAsset = allAssets.find(a => a.symbol === asset.currency);
                        if (existingAsset) {
                            existingAsset.balance += asset.balance || 0;
                            existingAsset.usdValue += asset.valueUsd || 0;
                        } else {
                            allAssets.push({
                                symbol: asset.currency,
                                name: asset.currency,
                                balance: asset.balance || 0,
                                usdValue: asset.valueUsd || 0,
                                available: (asset.balance || 0) - (asset.locked || 0),
                                locked: asset.locked || 0,
                            });
                        }
                    }
                });
            }

            setAssets(allAssets);
            setTotalBalance(data.totalAssetUsd || 0);
            setFundingTotal(data.funding?.totalUsd || 0);
            setSpotTotal(data.spot?.totalUsd || 0);
            setEarnTotal(data.earn?.totalUsd || 0);
        } catch (err) {
            console.error('Error fetching balance data:', err);
            const errorMessage = err instanceof Error
                ? err.message
                : 'Không thể tải dữ liệu số dư';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const balanceActions: ActionButton[] = [
        { label: 'Nạp tiền', onClick: () => router.push('/assets/deposit') },
        { label: 'Rút tiền', onClick: () => router.push('/assets/withdraw') },
        { label: 'Chuyển đổi', onClick: () => router.push('/assets/convert') },
        { label: 'Chuyển tiền', onClick: () => router.push('/assets/transfer') },
    ];

    if (loading) {
        return (
            <div className={styles.balancePage}>
                <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <p>Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.balancePage}>
                <div className={styles.errorState}>
                    <p className={styles.errorMessage}>{error}</p>
                    <button className={styles.retryButton} onClick={fetchBalanceData}>
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.balancePage}>
            <BalanceHeader
                title="Tổng quan số dư"
                hideBalance={hideBalance}
                onToggleHide={() => setHideBalance(!hideBalance)}
            />

            <TotalBalanceCard
                totalBalance={totalBalance}
                hideBalance={hideBalance}
                actions={balanceActions}
            />

            {/* Wallet Cards */}
            <div className={styles.walletsGrid}>
                <WalletCard
                    title="Ví Funding"
                    balance={fundingTotal}
                    description="Ví chính để nạp, rút và chuyển tiền"
                    hideBalance={hideBalance}
                    onClick={() => router.push('/balance/funding')}
                />
                <WalletCard
                    title="Ví Spot"
                    balance={spotTotal}
                    description="Giao dịch spot và chuyển đổi crypto"
                    hideBalance={hideBalance}
                    onClick={() => router.push('/balance/spot')}
                />
                <WalletCard
                    title="Ví Earn"
                    balance={earnTotal}
                    description="Kiếm lợi nhuận từ tiền gửi và staking"
                    hideBalance={hideBalance}
                    onClick={() => router.push('/balance/earn')}
                />
            </div>

            <AssetsList
                assets={assets}
                hideBalance={hideBalance}
                showFilters={true}
            />
        </div>
    );
}
