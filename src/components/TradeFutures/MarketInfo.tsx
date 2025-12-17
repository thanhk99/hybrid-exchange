"use client";

"use client";

import { useState, useEffect, useRef } from 'react';
import { BarChartOutlined, EditOutlined, SettingOutlined } from '@ant-design/icons';
import styles from './MarketInfo.module.css';
import FuturesService from '@/src/services/futures'; // Can be removed if not used elsewhere, but maybe keep for type
// import { StompClient } from '@/src/services/socket'; // Removed
import { FuturesCoin } from '@/src/types/futures';
import { getAssetsOverview } from '@/src/services/balance';
import { useFuturesMarket } from '@/src/contexts/FuturesMarketContext';

interface MarketInfoProps {
    symbol: string;
}

export default function MarketInfo({ symbol }: MarketInfoProps) {
    const { marketData } = useFuturesMarket();
    // const [marketData, setMarketData] = useState<FuturesCoin | null>(null); // From context
    const [balance, setBalance] = useState<number>(0);
    const [countdown, setCountdown] = useState<string>('--:--:--');
    // const stompClientRef = useRef<StompClient | null>(null);
    // const isConnectedRef = useRef(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Normalize symbol for comparison (remove hyphens, uppercase)
    const normalizedSymbol = symbol.replace(/-/g, '').toUpperCase();

    useEffect(() => {
        // fetchInitialData(); // Handled by context
        fetchBalance();
        // connectWebSocket(); // Handled by context
        startCountdown();

        return () => {
            // Cleanup handled by context and below
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [normalizedSymbol]);

    // fetchInitialData removed


    const fetchBalance = async () => {
        try {
            const data = await getAssetsOverview();
            // Futures wallet has 'asset' (singular), not 'assets' (plural)
            const futuresAsset = (data as any).futures?.asset;
            // Use availableBalance for trading
            const availableBalance = futuresAsset?.availableBalance || futuresAsset?.balance || 0;
            setBalance(availableBalance);
        } catch (e) {
        }
    };

    const startCountdown = () => {
        // Funding every 8 hours: 00:00, 08:00, 16:00 UTC
        // Calculate next funding time
        const updateTimer = () => {
            const now = new Date();
            const nowUtc = now.getTime() + now.getTimezoneOffset() * 60000;

            // 8 hours in ms
            const interval = 8 * 60 * 60 * 1000;
            const nextFunding = Math.ceil(nowUtc / interval) * interval;
            const diff = nextFunding - nowUtc;

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setCountdown(
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            );
        };

        updateTimer();
        timerRef.current = setInterval(updateTimer, 1000);
    };

    // connectWebSocket and handleMarketUpdate removed


    const formatPrice = (price?: number) => {
        if (price === undefined || price === null) return '-';
        return price.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
    };

    const formatVolume = (vol?: number) => {
        if (vol === undefined || vol === null) return '-';
        if (vol >= 1e9) return `$${(vol / 1e9).toFixed(2)}B`;
        if (vol >= 1e6) return `$${(vol / 1e6).toFixed(2)}M`;
        return `$${vol.toLocaleString()}`;
    };

    const priceChange = marketData?.priceChange24h ?? 0;
    const isPositive = priceChange >= 0;

    // Derived values with fallbacks
    const openInterest = marketData?.openInterest || (marketData?.volume24h ? marketData.volume24h * 0.8 : 0);
    const fundingRate = marketData?.fundingRate ?? 0;

    return (
        <div className={styles.container}>
            <div className={styles.symbolSection}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h1 className={styles.symbol}>{symbol}</h1>
                    <span className={styles.badge}>Vĩnh cửu</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginLeft: '12px', color: '#8c8c8c', fontSize: '16px' }}>
                    <BarChartOutlined style={{ cursor: 'pointer' }} />
                    <EditOutlined style={{ cursor: 'pointer' }} />
                    <SettingOutlined style={{ cursor: 'pointer' }} />
                </div>
            </div>

            <div className={styles.priceSection}>
                <div className={styles.mainPrice}>
                    <span className={styles.price}>{formatPrice(marketData?.lastPrice || marketData?.markPrice)}</span>
                    <span className={isPositive ? styles.positive : styles.negative}>
                        {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
                    </span>
                </div>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Cao 24h</span>
                    <span className={styles.statValue}>{formatPrice(marketData?.high24h)}</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Thấp 24h</span>
                    <span className={styles.statValue}>{formatPrice(marketData?.low24h)}</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Khối lượng 24h</span>
                    <span className={styles.statValue}>{formatVolume(marketData?.volume24h)}</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Lãi suất funding / Đếm ngược</span>
                    <span className={styles.statValue}>
                        <span className={fundingRate >= 0 ? styles.positive : styles.negative}>
                            {(fundingRate * 100).toFixed(4)}%
                        </span>
                        {' / '}
                        <span>{countdown}</span>
                    </span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Hợp đồng mở</span>
                    <span className={styles.statValue}>{formatVolume(openInterest)}</span>
                </div>

                {/* Futures Balance Display */}
                <div className={styles.statItem} style={{ borderLeft: '1px solid #f0f0f0', paddingLeft: '24px' }}>
                    <span className={styles.statLabel}>Ví Futures (USDT)</span>
                    <span className={styles.statValue}>{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
            </div>
        </div>
    );
}
