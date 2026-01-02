"use client";

import React from 'react';
import { ActionButton } from '@/src/types/balance';
import styles from './TotalBalanceCard.module.css';

interface TotalBalanceCardProps {
    totalBalance: number;
    hideBalance: boolean;
    label?: string;
    actions?: ActionButton[];
}

export default function TotalBalanceCard({
    totalBalance,
    hideBalance,
    label = "Tổng số dư ước tính",
    actions = []
}: TotalBalanceCardProps) {
    const formatBalance = (value: number) => {
        return hideBalance ? '****' : value.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    return (
        <div className={styles.balanceCard}>
            <div className={styles.balanceHeader}>
                <span className={styles.balanceLabel}>{label}</span>
            </div>
            <div className={styles.balanceAmount}>
                <span className={styles.currency}>$</span>
                <span className={styles.amount}>{formatBalance(totalBalance)}</span>
                <span className={styles.btcValue}>≈ {(totalBalance / 95000).toFixed(4)} BTC</span>
            </div>
            {actions.length > 0 && (
                <div className={styles.balanceActions}>
                    {actions.map((action, index) => (
                        <button
                            key={index}
                            className={`${styles.actionButton} ${index === 0 ? styles.primary : ''}`}
                            onClick={action.onClick}
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
