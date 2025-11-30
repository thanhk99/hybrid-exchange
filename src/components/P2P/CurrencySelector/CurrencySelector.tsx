'use client';

import { useEffect, useState } from 'react';
import WalletService from '@/src/services/wallet';
import styles from './CurrencySelector.module.css';

interface CurrencySelectorProps {
    value: string;
    onChange: (currency: string) => void;
    currencies: string[];
    label?: string;
    showIcon?: boolean;
}

export default function CurrencySelector({ value, onChange, currencies, label, showIcon = true }: CurrencySelectorProps) {
    const [currencyIcons, setCurrencyIcons] = useState<Record<string, string>>({});

    useEffect(() => {
        if (showIcon) {
            const loadCurrencyIcons = async () => {
                const currenciesData = await WalletService.getCurrencies();
                const iconsMap: Record<string, string> = {};
                currenciesData.forEach(c => {
                    iconsMap[c.symbol] = c.icon || '';
                });
                setCurrencyIcons(iconsMap);
            };
            loadCurrencyIcons();
        }
    }, [showIcon]);

    return (
        <div className={styles.container}>
            {label && <label className={styles.label}>{label}</label>}
            <div className={styles.selectWrapper}>
                {showIcon && currencyIcons[value] && (
                    <img
                        src={currencyIcons[value]}
                        alt={value}
                        className={styles.icon}
                    />
                )}
                <select
                    className={`${styles.select} ${showIcon && currencyIcons[value] ? styles.selectWithIcon : ''}`}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                >
                    {currencies.map(currency => (
                        <option key={currency} value={currency}>
                            {currency}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
