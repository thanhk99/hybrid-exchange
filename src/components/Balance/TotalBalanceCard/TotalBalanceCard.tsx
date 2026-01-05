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
        <div className={styles.container}>
            <div className={styles.bankCard}>
                <div className={styles.cardOverlay}></div>
                <div className={styles.cardContent}>
                    <div className={styles.cardHeader}>
                        <div className={styles.chip}>
                            <div className={styles.chipLine}></div>
                            <div className={styles.chipLine}></div>
                            <div className={styles.chipLine}></div>
                            <div className={styles.chipLine}></div>
                        </div>
                        <div className={styles.cardLogo}>
                            <img src="/imgs/Logo-VIX.svg" alt="VIX" />
                            <span>VIX CARD</span>
                        </div>
                    </div>

                    <div className={styles.balanceSection}>
                        <div className={styles.label}>{label}</div>
                        <div className={styles.balanceRow}>
                            <span className={styles.currencySymbol}>$</span>
                            <span className={styles.balanceValue}>{formatBalance(totalBalance)}</span>
                        </div>
                        <div className={styles.btcValue}>≈ {(totalBalance / 95000).toFixed(4)} BTC</div>
                    </div>

                    <div className={styles.cardFooter}>
                        <div className={styles.cardNumber}>
                            <span>••••</span>
                            <span>••••</span>
                            <span>••••</span>
                            <span className={styles.lastDigits}>8888</span>
                        </div>
                        <div className={styles.cardHolder}>
                            <div className={styles.holderLabel}>MEMBER</div>
                            <div className={styles.holderName}>PREMIUM USER</div>
                        </div>
                    </div>
                </div>
            </div>

            {actions.length > 0 && (
                <div className={styles.actionsGrid}>
                    {actions.map((action, index) => (
                        <button
                            key={index}
                            className={styles.actionButton}
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
