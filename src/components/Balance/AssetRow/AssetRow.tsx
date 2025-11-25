"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Asset } from '@/src/types/balance';
import CoinIcon from '@/src/components/common/CoinIcon/CoinIcon';
import styles from './AssetRow.module.css';

interface AssetRowProps {
    asset: Asset;
    hideBalance: boolean;
    showDetailed?: boolean;
    actions?: string[];
    onClick?: () => void;
}

export default function AssetRow({
    asset,
    hideBalance,
    showDetailed = false,
    onClick
}: AssetRowProps) {
    const router = useRouter();

    const formatCrypto = (value: number) => {
        return hideBalance ? '****' : value.toLocaleString('en-US', {
            minimumFractionDigits: 4,
            maximumFractionDigits: 8
        });
    };

    const formatBalance = (value: number) => {
        return hideBalance ? '****' : value.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    return (
        <div className={styles.assetRow} onClick={onClick}>
            <div className={styles.assetInfo}>
                <CoinIcon symbol={asset.symbol} name={asset.name} />
            </div>

            {showDetailed && asset.available !== undefined && asset.locked !== undefined ? (
                <div className={styles.assetBalances}>
                    <div className={styles.balanceItem}>
                        <span className={styles.label}>Khả dụng:</span>
                        <span className={styles.value}>{formatCrypto(asset.available)}</span>
                    </div>
                    <div className={styles.balanceItem}>
                        <span className={styles.label}>Đóng băng:</span>
                        <span className={styles.value}>{formatCrypto(asset.locked)}</span>
                    </div>
                    <div className={styles.balanceItem}>
                        <span className={styles.label}>Tổng:</span>
                        <span className={styles.value}>{formatCrypto(asset.balance)}</span>
                    </div>
                </div>
            ) : (
                <div className={styles.assetBalance}>
                    <div className={styles.cryptoBalance}>{formatCrypto(asset.balance)}</div>
                    <div className={styles.usdBalance}>${formatBalance(asset.usdValue)}</div>
                </div>
            )}

            {asset.change24h !== undefined && !showDetailed && (
                <div className={styles.assetChange}>
                    <span className={asset.change24h >= 0 ? styles.positive : styles.negative}>
                        {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                    </span>
                </div>
            )}
        </div>
    );
}
