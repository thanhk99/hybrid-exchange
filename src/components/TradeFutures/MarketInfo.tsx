"use client";

import { useState } from 'react';
import styles from './MarketInfo.module.css';

interface MarketInfoProps {
    symbol: string;
}

export default function MarketInfo({ symbol }: MarketInfoProps) {
    // Placeholder data - will be replaced with API data
    const [marketData] = useState({
        lastPrice: 96441.0,
        priceChange24h: 2.34,
        high24h: 97500.0,
        low24h: 94200.0,
        volume24h: 2847500000,
        fundingRate: 0.0001,
        nextFundingTime: '4h 23m',
        openInterest: 1250000000,
    });

    const formatPrice = (price: number) => price.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    const formatVolume = (vol: number) => {
        if (vol >= 1e9) return `$${(vol / 1e9).toFixed(2)}B`;
        if (vol >= 1e6) return `$${(vol / 1e6).toFixed(2)}M`;
        return `$${vol.toLocaleString()}`;
    };

    return (
        <div className={styles.container}>
            <div className={styles.symbolSection}>
                <h1 className={styles.symbol}>{symbol}</h1>
                <span className={styles.badge}>Vĩnh cửu</span>
            </div>

            <div className={styles.priceSection}>
                <div className={styles.mainPrice}>
                    <span className={styles.price}>{formatPrice(marketData.lastPrice)}</span>
                    <span className={marketData.priceChange24h >= 0 ? styles.positive : styles.negative}>
                        {marketData.priceChange24h >= 0 ? '+' : ''}{marketData.priceChange24h.toFixed(2)}%
                    </span>
                </div>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Cao 24h</span>
                    <span className={styles.statValue}>{formatPrice(marketData.high24h)}</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Thấp 24h</span>
                    <span className={styles.statValue}>{formatPrice(marketData.low24h)}</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Khối lượng 24h</span>
                    <span className={styles.statValue}>{formatVolume(marketData.volume24h)}</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Lãi suất Funding</span>
                    <span className={`${styles.statValue} ${marketData.fundingRate >= 0 ? styles.positive : styles.negative}`}>
                        {(marketData.fundingRate * 100).toFixed(4)}%
                    </span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Funding tiếp theo</span>
                    <span className={styles.statValue}>{marketData.nextFundingTime}</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Hợp đồng mở</span>
                    <span className={styles.statValue}>{formatVolume(marketData.openInterest)}</span>
                </div>
            </div>
        </div>
    );
}
