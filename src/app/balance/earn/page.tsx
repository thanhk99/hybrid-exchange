'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EyeOutlined, EyeInvisibleOutlined, LeftOutlined } from '@ant-design/icons';
import CoinIcon from '@/src/components/common/CoinIcon/CoinIcon';
import styles from './page.module.css';

interface Asset {
    symbol: string;
    name: string;
    balance: number;
    usdValue: number;
    available: number;
    locked: number;
}

export default function FundingWalletPage() {
    const router = useRouter();
    const [hideBalance, setHideBalance] = useState(false);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [totalBalance, setTotalBalance] = useState(0);

    useEffect(() => {
        const mockAssets: Asset[] = [
            { symbol: 'BTC', name: 'Bitcoin', balance: 0.5234, usdValue: 23456.78, available: 0.5234, locked: 0 },
            { symbol: 'ETH', name: 'Ethereum', balance: 5.234, usdValue: 12345.67, available: 5.234, locked: 0 },
            { symbol: 'USDT', name: 'Tether', balance: 10000, usdValue: 10000, available: 9500, locked: 500 },
        ];
        setAssets(mockAssets);
        setTotalBalance(mockAssets.reduce((sum, asset) => sum + asset.usdValue, 0));
    }, []);

    const formatBalance = (value: number) => {
        return hideBalance ? '****' : value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 });
    };

    return (
        <div className={styles.walletPage}>
            <button className={styles.backButton} onClick={() => router.back()}>
                <LeftOutlined /> Quay lại
            </button>

            <div className={styles.header}>
                <h1 className={styles.pageTitle}>Ví Earn</h1>
                <button className={styles.hideButton} onClick={() => setHideBalance(!hideBalance)}>
                    {hideBalance ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </button>
            </div>

            <div className={styles.balanceCard}>
                <div className={styles.balanceLabel}>Tổng số dư Earn</div>
                <div className={styles.balanceAmount}>${formatBalance(totalBalance)}</div>
                <div className={styles.balanceActions}>
                    <button className={styles.actionButton} onClick={() => router.push('/assets/deposit')}>
                        Nạp tiền
                    </button>
                    <button className={styles.actionButton} onClick={() => router.push('/assets/withdraw')}>
                        Rút tiền
                    </button>
                    <button className={styles.actionButton} onClick={() => router.push('/balance/transfer')}>
                        Chuyển ví
                    </button>
                </div>
            </div>

            <div className={styles.assetsSection}>
                <h2>Danh sách tài sản</h2>
                <div className={styles.assetsList}>
                    {assets.map((asset) => (
                        <div key={asset.symbol} className={styles.assetRow}>
                            <CoinIcon symbol={asset.symbol} name={asset.name} />
                            <div className={styles.assetBalances}>
                                <div className={styles.balanceItem}>
                                    <span className={styles.label}>Khả dụng:</span>
                                    <span className={styles.value}>{formatBalance(asset.available)}</span>
                                </div>
                                <div className={styles.balanceItem}>
                                    <span className={styles.label}>Đóng băng:</span>
                                    <span className={styles.value}>{formatBalance(asset.locked)}</span>
                                </div>
                                <div className={styles.balanceItem}>
                                    <span className={styles.label}>Tổng:</span>
                                    <span className={styles.value}>{formatBalance(asset.balance)}</span>
                                </div>
                            </div>
                            <div className={styles.assetActions}>
                                <button className={styles.actionLink}>Nạp</button>
                                <button className={styles.actionLink}>Rút</button>
                                <button className={styles.actionLink}>Chuyển</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
