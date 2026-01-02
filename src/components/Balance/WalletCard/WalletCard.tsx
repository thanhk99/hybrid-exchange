"use client";

import React from 'react';
import styles from './WalletCard.module.css';

interface WalletCardProps {
    title: string;
    balance: number;
    description: string;
    hideBalance: boolean;
    onClick: () => void;
    icon?: React.ReactNode;
}

export default function WalletCard({
    title,
    balance,
    description,
    hideBalance,
    onClick,
    icon
}: WalletCardProps) {
    const formatBalance = (value: number) => {
        return hideBalance ? '****' : value.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    return (
        <div className={styles.walletCard} onClick={onClick}>
            <div className={styles.walletHeader}>
                <div className={styles.titleWithIcon}>
                    {icon && <div className={styles.walletIcon}>{icon}</div>}
                    <h3>{title}</h3>
                </div>
                <span className={styles.arrow}>→</span>
            </div>
            <div className={styles.walletBalance}>${formatBalance(balance)}</div>
            <div className={styles.walletDescription}>{description}</div>
        </div>
    );
}
