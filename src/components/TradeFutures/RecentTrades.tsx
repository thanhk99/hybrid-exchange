"use client";

import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { StompClient } from '@/src/services/socket';
import { formatTopicSymbol } from '@/src/utils/coinHelpers';
import { HistoryOutlined } from '@ant-design/icons';
import styles from './RecentTrades.module.css';

interface Trade {
    symbol: string;
    price: number;
    quantity: number;
    side: 'BUY' | 'SELL';
    timestamp: number;
}

interface RecentTradesProps {
    symbol: string;
}

export default function RecentTrades({ symbol }: RecentTradesProps) {
    const [trades, setTrades] = useState<Trade[]>([]);
    const stompClientRef = useRef<StompClient | null>(null);
    const isConnectedRef = useRef(false);

    useEffect(() => {
        connectWebSocket();

        return () => {
            if (stompClientRef.current && isConnectedRef.current) {
                stompClientRef.current.disconnect();
                isConnectedRef.current = false;
            }
        };
    }, [symbol]);

    const connectWebSocket = () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
        const wsBase = apiUrl.replace(/^http/, 'ws');
        const finalWsUrl = `${wsBase}/ws/websocket`;

        const client = new StompClient(finalWsUrl);
        client.connect(() => {
            isConnectedRef.current = true;

            // Topic format: /topic/spot/trades/{SYMBOL-WITH-DASH}
            const topicSymbol = formatTopicSymbol(symbol);
            const topic = `/topic/spot/trades/${topicSymbol}`;

            console.log(`Subscribing to trades topic: ${topic}`);

            client.subscribe(topic, (msg: Trade | Trade[]) => {
                const newTrades = Array.isArray(msg) ? msg : [msg];

                setTrades(prev => {
                    // Combine and keep only the latest 50 trades
                    const combined = [...newTrades, ...prev].slice(0, 50);
                    return combined;
                });
            });
        });
        stompClientRef.current = client;
    };

    const formatPrice = (price: number) => {
        return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const formatAmount = (amount: number) => {
        return amount.toFixed(4);
    };

    const formatTime = (timestamp: number) => {
        return format(new Date(timestamp), 'HH:mm:ss');
    };

    return (
        <div className={styles.recentTrades}>
            <h3 className={styles.title}>
                <HistoryOutlined style={{ marginRight: '8px' }} />
                Giao dịch gần đây
            </h3>

            <div className={styles.headerRow}>
                <span className={styles.price}>Giá</span>
                <span className={styles.amount}>Số lượng</span>
                <span className={styles.time}>Thời gian</span>
            </div>

            <div className={styles.tradeList}>
                {trades.map((trade, idx) => (
                    <div key={`${trade.timestamp}-${idx}`} className={styles.tradeRow}>
                        <span className={`${styles.price} ${trade.side === 'BUY' ? styles.buy : styles.sell}`}>
                            {formatPrice(trade.price)}
                        </span>
                        <span className={styles.amount}>{formatAmount(trade.quantity)}</span>
                        <span className={styles.time}>{formatTime(trade.timestamp)}</span>
                    </div>
                ))}
                {trades.length === 0 && (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#848e9c', fontSize: '12px' }}>
                        Đang chờ dữ liệu...
                    </div>
                )}
            </div>
        </div>
    );
}
