"use client";

import { useState, useEffect, useRef } from 'react';
import { BarChartOutlined, EditOutlined, SettingOutlined, InfoCircleOutlined } from '@ant-design/icons';
import styles from './MarketInfo.module.css';
import FuturesService from '@/src/services/futures';
import { FuturesCoin } from '@/src/types/futures';
import { getAssetsOverview } from '@/src/services/balance';
import { useMarket } from '@/src/contexts/MarketContext';
import TokenService from '@/src/services/token';

interface MarketInfoProps {
    symbol: string;
    isSpot?: boolean;
}

export default function MarketInfo({ symbol, isSpot = false }: MarketInfoProps) {
    const market = useMarket();
    const marketData = market.marketData;
    const isFutures = market.marketType === 'futures';

    // Map MarketCoin to FuturesCoin-like structure for spot
    const normalizedMarketData = market.marketType === 'spot' && marketData ? {
        ...marketData,
        lastPrice: (marketData as any).currentPrice,
        markPrice: (marketData as any).currentPrice,
    } : marketData;
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
        const token = TokenService.getAccessToken();
        if (!token) {
            setBalance(0);
            return;
        }

        try {
            const data = await getAssetsOverview();
            if (isSpot) {
                // USDT Balance from Spot wallet
                const spotAsset = (data as any).spot?.assets?.find((a: any) => a.currency === 'USDT');
                const availableBalance = spotAsset?.availableBalance || spotAsset?.balance || 0;
                setBalance(availableBalance);
            } else {
                // USDT Balance from Futures wallet
                const futuresAsset = (data as any).futures?.asset;
                const availableBalance = futuresAsset?.availableBalance || futuresAsset?.balance || 0;
                setBalance(availableBalance);
            }
        } catch (e) {
            console.error('Failed to fetch balance in MarketInfo', e);
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

    const priceChange = (normalizedMarketData as any)?.priceChange24h ?? 0;
    const isPositive = priceChange >= 0;

    // Derived values with fallbacks (only for futures)
    const openInterest = isFutures ? ((normalizedMarketData as any)?.openInterest || ((normalizedMarketData as any)?.volume24h ? (normalizedMarketData as any).volume24h * 0.8 : 0)) : 0;
    const fundingRate = isFutures ? ((normalizedMarketData as any)?.fundingRate ?? 0) : 0;

    return (
        <div className={styles.container}>
            <div className={styles.symbolSection}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h1 className={styles.symbol}>{symbol}</h1>
                    {isFutures && <span className={styles.badge}>Vĩnh cửu</span>}
                </div>
            </div>

            <div className={styles.priceSection}>
                <div className={styles.mainPrice}>
                    <span className={styles.price}>{formatPrice((normalizedMarketData as any)?.lastPrice || (normalizedMarketData as any)?.markPrice)}</span>
                    <span className={isPositive ? styles.positive : styles.negative}>
                        {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
                    </span>
                </div>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Cao 24h</span>
                    <span className={styles.statValue}>{formatPrice((normalizedMarketData as any)?.high24h)}</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Thấp 24h</span>
                    <span className={styles.statValue}>{formatPrice((normalizedMarketData as any)?.low24h)}</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Khối lượng 24h</span>
                    <span className={styles.statValue}>{formatVolume((normalizedMarketData as any)?.volume24h)}</span>
                </div>
                {isFutures && (
                    <>
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
                    </>
                )}

                {/* Futures Balance Display */}
                <div className={styles.statItem} style={{ borderLeft: '1px solid #f0f0f0', paddingLeft: '24px' }}>
                    <span className={styles.statLabel}>{isSpot ? 'Ví Spot (USDT)' : 'Ví Futures (USDT)'}</span>
                    <span className={styles.statValue}>{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
            </div>
        </div>
    );
}
