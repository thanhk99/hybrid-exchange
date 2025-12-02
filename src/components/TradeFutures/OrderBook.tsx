"use client";

import { useState, useEffect, useRef } from 'react';
import styles from './OrderBook.module.css';
import FuturesService from '@/src/services/futures';
import { StompClient } from '@/src/services/socket';

interface OrderBookProps {
    symbol: string;
}

interface OrderBookEntry {
    price: number;
    amount: number;
    total: number;
}

export default function OrderBook({ symbol }: OrderBookProps) {
    const [bids, setBids] = useState<OrderBookEntry[]>([]);
    const [asks, setAsks] = useState<OrderBookEntry[]>([]);
    const stompClientRef = useRef<StompClient | null>(null);
    const isConnectedRef = useRef(false);

    // Normalize symbol for API call
    const normalizedSymbol = symbol.replace(/-/g, '').toUpperCase();

    useEffect(() => {
        fetchOrderBook();
        connectWebSocket();

        return () => {
            if (stompClientRef.current && isConnectedRef.current) {
                stompClientRef.current.disconnect();
                isConnectedRef.current = false;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [normalizedSymbol]);

    const fetchOrderBook = async () => {
        try {
            console.log('Fetching order book for:', normalizedSymbol);
            const response = await FuturesService.getOrderBook(normalizedSymbol);
            console.log('Order book response:', response.data);
            // The backend returns the order book directly in response.data
            const data = response.data.data;
            if (data && data.bids && data.asks) {
                console.log('Order book data:', data);
                processOrderBookData(data.bids, data.asks);
            } else {
                console.warn('Order book payload missing bids/asks');
            }
        } catch (e) {
            console.error('Failed to fetch order book', e);
        }
    };

    const processOrderBookData = (bidsData: [string, string][], asksData: [string, string][]) => {
        // Process bids (buy orders) - sorted descending by price
        const processedBids: OrderBookEntry[] = [];
        let bidTotal = 0;
        bidsData.slice(0, 15).forEach(([price, amount]) => {
            const priceNum = parseFloat(price);
            const amountNum = parseFloat(amount);
            bidTotal += amountNum;
            processedBids.push({
                price: priceNum,
                amount: amountNum,
                total: bidTotal
            });
        });

        // Process asks (sell orders) - sorted ascending by price
        const processedAsks: OrderBookEntry[] = [];
        let askTotal = 0;
        asksData.slice(0, 15).forEach(([price, amount]) => {
            const priceNum = parseFloat(price);
            const amountNum = parseFloat(amount);
            askTotal += amountNum;
            processedAsks.push({
                price: priceNum,
                amount: amountNum,
                total: askTotal
            });
        });

        setBids(processedBids);
        setAsks(processedAsks);
    };

    const connectWebSocket = () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
        const wsBase = apiUrl.replace(/^http/, 'ws');
        const finalWsUrl = `${wsBase}/ws/websocket`;

        const client = new StompClient(finalWsUrl);
        client.connect(() => {
            isConnectedRef.current = true;
            // Subscribe to order book updates
            client.subscribe(`/topic/futures/orderbook/${normalizedSymbol.toLowerCase()}`, (msg) => {
                if (msg && msg.bids && msg.asks) {
                    processOrderBookData(msg.bids, msg.asks);
                }
            });
        });
        stompClientRef.current = client;
    };

    const formatPrice = (price: number) => price.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    const formatAmount = (amount: number) => amount.toFixed(4);

    // Calculate spread
    const bestBid = bids.length > 0 ? bids[0].price : 0;
    const bestAsk = asks.length > 0 ? asks[0].price : 0;
    const spread = bestAsk - bestBid;
    const spreadPercent = bestBid > 0 ? ((spread / bestBid) * 100).toFixed(3) : '0.000';

    // Find max amount for depth bar calculation
    const maxBidAmount = Math.max(...bids.map(b => b.amount), 0.001);
    const maxAskAmount = Math.max(...asks.map(a => a.amount), 0.001);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>Sổ lệnh</h3>
            </div>

            {/* Column Headers */}
            <div className={styles.columnHeaders}>
                <span>Giá</span>
                <span>Số lượng</span>
                <span>Tổng</span>
            </div>

            {/* Asks (Sell orders) - displayed in reverse order */}
            <div className={styles.orderList}>
                {[...asks].reverse().map((ask, idx) => (
                    <div key={`ask-${idx}`} className={styles.orderRow}>
                        <span className={`${styles.price} ${styles.ask}`}>{formatPrice(ask.price)}</span>
                        <span className={styles.amount}>{formatAmount(ask.amount)}</span>
                        <span className={styles.total}>{formatAmount(ask.total)}</span>
                        <div
                            className={styles.depthBar}
                            style={{
                                width: `${(ask.amount / maxAskAmount) * 100}%`,
                                background: 'rgba(246, 70, 93, 0.1)'
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Spread */}
            <div className={styles.spread}>
                <span className={styles.spreadPrice}>{formatPrice(bestAsk)}</span>
                <span className={styles.spreadLabel}>Spread: {spread.toFixed(2)} ({spreadPercent}%)</span>
            </div>

            {/* Bids (Buy orders) */}
            <div className={styles.orderList}>
                {bids.map((bid, idx) => (
                    <div key={`bid-${idx}`} className={styles.orderRow}>
                        <span className={`${styles.price} ${styles.bid}`}>{formatPrice(bid.price)}</span>
                        <span className={styles.amount}>{formatAmount(bid.amount)}</span>
                        <span className={styles.total}>{formatAmount(bid.total)}</span>
                        <div
                            className={styles.depthBar}
                            style={{
                                width: `${(bid.amount / maxBidAmount) * 100}%`,
                                background: 'rgba(14, 203, 129, 0.1)'
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
