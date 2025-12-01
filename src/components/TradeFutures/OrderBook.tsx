"use client";

import { useState } from 'react';
import styles from './OrderBook.module.css';

interface OrderBookProps {
    symbol: string;
}

interface OrderBookEntry {
    price: number;
    amount: number;
    total: number;
}

export default function OrderBook({ symbol }: OrderBookProps) {
    // Placeholder data - will be replaced with API/WebSocket data
    const [bids] = useState<OrderBookEntry[]>([
        { price: 96440.5, amount: 0.125, total: 12055.06 },
        { price: 96440.0, amount: 0.250, total: 24110.00 },
        { price: 96439.5, amount: 0.180, total: 17359.11 },
        { price: 96439.0, amount: 0.320, total: 30860.48 },
        { price: 96438.5, amount: 0.150, total: 14465.78 },
        { price: 96438.0, amount: 0.420, total: 40503.96 },
        { price: 96437.5, amount: 0.280, total: 27002.50 },
        { price: 96437.0, amount: 0.190, total: 18323.03 },
    ]);

    const [asks] = useState<OrderBookEntry[]>([
        { price: 96441.0, amount: 0.145, total: 13983.95 },
        { price: 96441.5, amount: 0.230, total: 22181.55 },
        { price: 96442.0, amount: 0.175, total: 16877.35 },
        { price: 96442.5, amount: 0.310, total: 29897.18 },
        { price: 96443.0, amount: 0.160, total: 15430.88 },
        { price: 96443.5, amount: 0.400, total: 38577.40 },
        { price: 96444.0, amount: 0.270, total: 26039.88 },
        { price: 96444.5, amount: 0.200, total: 19288.90 },
    ]);

    const formatPrice = (price: number) => price.toFixed(1);
    const formatAmount = (amount: number) => amount.toFixed(3);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>Sổ lệnh</h3>
            </div>

            {/* Asks (Sell orders) */}
            <div className={styles.orderList}>
                {asks.reverse().map((ask, idx) => (
                    <div key={`ask-${idx}`} className={styles.orderRow}>
                        <span className={`${styles.price} ${styles.ask}`}>{formatPrice(ask.price)}</span>
                        <span className={styles.amount}>{formatAmount(ask.amount)}</span>
                        <span className={styles.total}>{formatAmount(ask.total)}</span>
                        <div className={styles.depthBar} style={{ width: `${(ask.amount / 0.5) * 100}%`, background: 'rgba(246, 70, 93, 0.1)' }} />
                    </div>
                ))}
            </div>

            {/* Spread */}
            <div className={styles.spread}>
                <span className={styles.spreadPrice}>96,441.0</span>
                <span className={styles.spreadLabel}>≈ $96,441.0</span>
            </div>

            {/* Bids (Buy orders) */}
            <div className={styles.orderList}>
                {bids.map((bid, idx) => (
                    <div key={`bid-${idx}`} className={styles.orderRow}>
                        <span className={`${styles.price} ${styles.bid}`}>{formatPrice(bid.price)}</span>
                        <span className={styles.amount}>{formatAmount(bid.amount)}</span>
                        <span className={styles.total}>{formatAmount(bid.total)}</span>
                        <div className={styles.depthBar} style={{ width: `${(bid.amount / 0.5) * 100}%`, background: 'rgba(14, 203, 129, 0.1)' }} />
                    </div>
                ))}
            </div>
        </div>
    );
}
