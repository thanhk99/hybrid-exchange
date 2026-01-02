"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import FuturesService from '@/src/services/futures';
import { StompClient } from '@/src/services/socket';
import { FuturesCoin } from '@/src/types/futures';
import styles from './FuturesTable.module.css';


export default function FuturesTable() {
    const router = useRouter();
    const [coins, setCoins] = useState<FuturesCoin[]>([]);
    const [loading, setLoading] = useState(true);
    const stompClientRef = useRef<StompClient | null>(null);
    const isConnectedRef = useRef(false);

    useEffect(() => {
        fetchInitialData();
        connectWebSocket();
        return () => {
            if (stompClientRef.current && isConnectedRef.current) {
                stompClientRef.current.disconnect();
                isConnectedRef.current = false;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchInitialData = async () => {
        try {
            const response = await FuturesService.getFuturesCoins();
            if (response.data && response.data.data) {
                const sortedData = response.data.data.sort((a, b) => b.markPrice - a.markPrice);
                setCoins(sortedData);
            }
        } catch (e) {
            console.error('Failed to fetch futures coins', e);
        } finally {
            setLoading(false);
        }
    };

    const connectWebSocket = () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
        const wsBase = apiUrl.replace(/^http/, 'ws');
        const finalWsUrl = `${wsBase}/ws/websocket`;
        console.log('Connecting to Futures WebSocket at:', finalWsUrl);
        const client = new StompClient(finalWsUrl);
        client.connect(() => {
            console.log('Connected to Futures WebSocket');
            isConnectedRef.current = true;
            client.subscribe('/topic/spot-prices', (msg) => handleMarketUpdate(msg));
        });
        stompClientRef.current = client;
    };

    const handleMarketUpdate = (updates: any) => {
        // Check if updates is an array (bulk update) or single object
        const updateArray = Array.isArray(updates) ? updates : [updates];

        setCoins(prev => {
            const newCoins = [...prev];
            let hasChanges = false;

            updateArray.forEach(update => {
                const normalizedUpdateSymbol = update.symbol.replace(/[\/-]/g, '').toUpperCase();
                const idx = newCoins.findIndex(c => c.symbol.replace(/[\/-]/g, '').toUpperCase() === normalizedUpdateSymbol);
                if (idx !== -1) {
                    const oldCoin = newCoins[idx];

                    // Map new field names from documentation
                    const markPrice = update.price ? Number(update.price) : oldCoin.markPrice;
                    const lastPrice = update.price ? Number(update.price) : oldCoin.lastPrice;
                    const priceChange24h = update.changePercent ? Number(update.changePercent) : oldCoin.priceChange24h;

                    if (
                        oldCoin.markPrice !== markPrice ||
                        oldCoin.lastPrice !== lastPrice ||
                        oldCoin.priceChange24h !== priceChange24h
                    ) {
                        newCoins[idx] = {
                            ...oldCoin,
                            ...update,
                            markPrice,
                            lastPrice,
                            priceChange24h,
                        };
                        hasChanges = true;
                    }
                }
            });

            if (hasChanges) {
                return newCoins.sort((a, b) => b.markPrice - a.markPrice);
            }
            return prev;
        });
    };

    const handleRowClick = (coin: FuturesCoin) => {
        // Navigate to trading page for this futures contract
        router.push(`/trade-futures/${coin.symbol.toLowerCase()}`);
    };

    const formatPrice = (price?: number | null) =>
        price === undefined || price === null
            ? '-'
            : new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 }).format(price);

    const formatPercent = (p?: number | null) => {
        if (p === undefined || p === null) return '-';
        const sign = p > 0 ? '+' : '';
        return `${sign}${p.toFixed(2)}%`;
    };

    const formatFundingRate = (rate?: number | null) => {
        if (rate === undefined || rate === null) return '-';
        const percent = rate * 100;
        return `${percent.toFixed(4)}%`;
    };

    const formatVolume = (vol?: number | null) => {
        if (!vol) return '-';
        if (vol >= 1e9) return `${(vol / 1e9).toFixed(2)} T`;
        if (vol >= 1e6) return `${(vol / 1e6).toFixed(2)} Tr`;
        return new Intl.NumberFormat('en-US').format(vol);
    };

    const formatCurrency = (val?: number | null) => {
        if (!val) return '-';
        if (val >= 1e12) return `$${(val / 1e12).toFixed(2)} NT`; // Nghìn Tỷ
        if (val >= 1e9) return `$${(val / 1e9).toFixed(2)} T`;
        if (val >= 1e6) return `$${(val / 1e6).toFixed(2)} Tr`;
        return `$${new Intl.NumberFormat('en-US').format(val)}`;
    };

    if (loading) {
        return <div className={styles.container}>Loading...</div>;
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Futures Markets</h2>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Tên</th>
                                <th>Giá</th>
                                <th>Thay đổi</th>
                                <th>Phạm vi 24h</th>
                                <th>Vốn hoá thị trường</th>
                                <th>Lãi suất funding</th>
                                <th>Khối lượng 24h</th>
                                <th>Giá trị 24h</th>
                                <th>Hợp đồng mở</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coins.map(coin => {
                                // Mock/Derived values for UI if missing
                                const marketCap = coin.marketCap || coin.markPrice * 19000000; // Mock cap
                                const volume = coin.volume24h || 0;
                                const value24h = coin.turnover24h || volume * coin.markPrice;
                                const openInterest = coin.openInterest || value24h * 0.8;
                                const high24h = coin.high24h || coin.markPrice * 1.02;
                                const low24h = coin.low24h || coin.markPrice * 0.98;
                                const rangePercent = ((coin.markPrice - low24h) / (high24h - low24h)) * 100;

                                return (
                                    <tr key={coin.symbol} onClick={() => handleRowClick(coin)}>
                                        <td>
                                            <div className={styles.coinInfo}>
                                                {coin.logoUrl && (
                                                    <img src={coin.logoUrl} alt={coin.symbol} className={styles.coinLogo} onError={e => { e.currentTarget.style.display = 'none'; }} />
                                                )}
                                                <div className={styles.symbolWrapper}>
                                                    <div className={styles.symbol}>{coin.symbol}</div>
                                                    <div className={styles.badge}>Vĩnh cửu</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={styles.price}>{formatPrice(coin.markPrice)}</td>
                                        <td className={Number(coin.priceChange24h) >= 0 ? styles.positive : styles.negative}>
                                            {formatPercent(coin.priceChange24h)}
                                        </td>
                                        <td>
                                            <div className={styles.rangeBarContainer}>
                                                <div className={styles.rangeBar}>
                                                    <div
                                                        className={styles.rangeProgress}
                                                        style={{
                                                            width: '4px',
                                                            left: `${Math.max(0, Math.min(100, rangePercent))}%`
                                                        }}
                                                    />
                                                </div>
                                                <div className={styles.rangeLabels}>
                                                    <span>{formatPrice(low24h)}</span>
                                                    <span>{formatPrice(high24h)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{formatCurrency(marketCap)}</td>
                                        <td className={Number(coin.fundingRate) >= 0 ? styles.positive : styles.negative}>
                                            {formatFundingRate(coin.fundingRate)}
                                        </td>
                                        <td>
                                            <div>{formatVolume(volume)}</div>
                                            <div className={styles.secondaryText}>USDT</div>
                                        </td>
                                        <td>{formatCurrency(value24h)}</td>
                                        <td>{formatCurrency(openInterest)} USDT</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
