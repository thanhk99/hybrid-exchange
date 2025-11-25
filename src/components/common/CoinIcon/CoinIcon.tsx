import React from 'react';
import Image from 'next/image';
import { getCoinIcon } from '@/src/utils/coinHelpers';
import styles from './CoinIcon.module.css';

interface CoinIconProps {
    symbol: string;
    name: string;
    size?: 'small' | 'medium' | 'large';
    showName?: boolean;
}

export default function CoinIcon({ symbol, name, size = 'medium', showName = true }: CoinIconProps) {
    const sizeMap = {
        small: 24,
        medium: 32,
        large: 40,
    };

    const iconSize = sizeMap[size];

    return (
        <div className={styles.coinIcon}>
            <div className={styles.icon} style={{ width: iconSize, height: iconSize }}>
                <Image
                    src={getCoinIcon(symbol)}
                    alt={name}
                    width={iconSize}
                    height={iconSize}
                />
            </div>
            {showName && (
                <div className={styles.details}>
                    <div className={styles.symbol}>{symbol}</div>
                    <div className={styles.name}>{name}</div>
                </div>
            )}
        </div>
    );
}
