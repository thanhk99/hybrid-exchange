import React from 'react';
import styles from './PriceRangeChart.module.css';

interface PriceRangeChartProps {
    low: number;
    high: number;
    current: number;
}

export default function PriceRangeChart({ low, high, current }: PriceRangeChartProps) {
    // Calculate the position of current price as a percentage
    const range = high - low;
    const position = range > 0 ? ((current - low) / range) * 100 : 50;

    // Format price for display
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 6
        }).format(price);
    };

    return (
        <div className={styles.container}>
            <div className={styles.priceLabels}>
                <span className={styles.lowPrice}>{formatPrice(low)}</span>
                <span className={styles.highPrice}>{formatPrice(high)}</span>
            </div>
            <div className={styles.barContainer}>
                <div className={styles.bar}>
                    <div
                        className={styles.marker}
                        style={{ left: `${position}%` }}
                    >
                        <div className={styles.triangle}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
