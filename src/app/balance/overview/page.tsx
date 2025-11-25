'use client';

import React, { useState, useEffect } from 'react';
import { getAssetsOverview } from '@/src/services/assets';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import CoinIcon from '@/src/components/common/CoinIcon/CoinIcon';
import styles from './page.module.css';

interface Asset {
    symbol: string;
    name: string;
    balance: number;
    usdValue: number;
    change24h: number;
}

export default function BalanceOverviewPage() {
    const router = useRouter();
    const [hideBalance, setHideBalance] = useState(false);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const [fundingTotal, setFundingTotal] = useState(0);
    const [spotTotal, setSpotTotal] = useState(0);
    const [earnTotal, setEarnTotal] = useState(0);


    const formatBalance = (value: number) => {
        return hideBalance ? '****' : value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const formatCrypto = (value: number) => {
        return hideBalance ? '****' : value.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 8 });
    };

    return (
        <div className={styles.balancePage}>
            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.pageTitle}>Tổng quan số dư</h1>
                <button className={styles.hideButton} onClick={() => setHideBalance(!hideBalance)}>
                    {hideBalance ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </button>
            </div>

            {/* Total Balance Card */}
            <div className={styles.balanceCard}>
                <div className={styles.balanceHeader}>
                    <span className={styles.balanceLabel}>Tổng số dư ước tính</span>
                </div>
                <div className={styles.balanceAmount}>
                    <span className={styles.currency}>$</span>
                    <span className={styles.amount}>{formatBalance(totalBalance)}</span>
                </div>
                <div className={styles.balanceActions}>
                    <button className={styles.actionButton} onClick={() => router.push('/assets/deposit')}>
                        Nạp tiền
                    </button>
                    <button className={styles.actionButton} onClick={() => router.push('/assets/withdraw')}>
                        Rút tiền
                    </button>
                    <button className={styles.actionButton} onClick={() => router.push('/assets/convert')}>
                        Chuyển đổi
                    </button>
                    <button className={styles.actionButton} onClick={() => router.push('/assets/transfer')}>
                        Chuyển tiền
                    </button>
                </div>
            </div>

            {/* Wallet Cards */}
            <div className={styles.walletsGrid}>
                <div className={styles.walletCard} onClick={() => router.push('/balance/funding')}>
                    <div className={styles.walletHeader}>
                        <h3>Ví Funding</h3>
                        <span className={styles.arrow}>→</span>
                    </div>
                    <div className={styles.walletBalance}>${formatBalance(fundingTotal)}</div>
                    <div className={styles.walletDescription}>Ví chính để nạp, rút và chuyển tiền</div>
                </div>

                <div className={styles.walletCard} onClick={() => router.push('/balance/spot')}>
                    <div className={styles.walletHeader}>
                        <h3>Ví Spot</h3>
                        <span className={styles.arrow}>→</span>
                    </div>
                    <div className={styles.walletBalance}>${formatBalance(spotTotal)}</div>
                    <div className={styles.walletDescription}>Giao dịch spot và chuyển đổi crypto</div>
                </div>

                <div className={styles.walletCard} onClick={() => router.push('/balance/earn')}>
                    <div className={styles.walletHeader}>
                        <h3>Ví Earn</h3>
                        <span className={styles.arrow}>→</span>
                    </div>
                    <div className={styles.walletBalance}>${formatBalance(earnTotal)}</div>
                    <div className={styles.walletDescription}>Kiếm lợi nhuận từ tiền gửi và staking</div>
                </div>
            </div>

            {/* Assets List */}
            <div className={styles.assetsSection}>
                <div className={styles.sectionHeader}>
                    <h2>Danh sách tài sản</h2>
                    <div className={styles.filterButtons}>
                        <button className={styles.filterButton}>Tất cả</button>
                        <button className={styles.filterButton}>Funding</button>
                        <button className={styles.filterButton}>Spot</button>
                        <button className={styles.filterButton}>Earn</button>
                    </div>
                </div>

                <div className={styles.assetsList}>
                    {assets.map((asset) => (
                        <div key={asset.symbol} className={styles.assetRow}>
                            <div className={styles.assetInfo}>
                                <CoinIcon symbol={asset.symbol} name={asset.name} />
                            </div>
                            <div className={styles.assetBalance}>
                                <div className={styles.cryptoBalance}>{formatCrypto(asset.balance)}</div>
                                <div className={styles.usdBalance}>${formatBalance(asset.usdValue)}</div>
                            </div>
                            <div className={styles.assetChange}>
                                <span className={asset.change24h >= 0 ? styles.positive : styles.negative}>
                                    {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                                </span>
                            </div>
                            <div className={styles.assetActions}>
                                <button className={styles.actionLink} onClick={() => router.push('/assets/deposit')}>
                                    Nạp
                                </button>
                                <button className={styles.actionLink} onClick={() => router.push('/assets/withdraw')}>
                                    Rút
                                </button>
                                <button className={styles.actionLink} onClick={() => router.push('/balance/transfer')}>
                                    Chuyển
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
