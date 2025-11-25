"use client";

import React from 'react';
import { EyeOutlined, EyeInvisibleOutlined, LeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import styles from './BalanceHeader.module.css';

interface BalanceHeaderProps {
    title: string;
    hideBalance: boolean;
    onToggleHide: () => void;
    showBackButton?: boolean;
}

export default function BalanceHeader({
    title,
    hideBalance,
    onToggleHide,
    showBackButton = false
}: BalanceHeaderProps) {
    const router = useRouter();

    return (
        <div className={styles.headerContainer}>
            {showBackButton && (
                <button className={styles.backButton} onClick={() => router.back()}>
                    <LeftOutlined /> Quay lại
                </button>
            )}
            <div className={styles.header}>
                <h1 className={styles.pageTitle}>{title}</h1>
                <button className={styles.hideButton} onClick={onToggleHide}>
                    {hideBalance ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </button>
            </div>
        </div>
    );
}
