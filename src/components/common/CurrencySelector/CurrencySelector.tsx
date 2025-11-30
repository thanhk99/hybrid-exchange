import React, { useEffect, useRef } from 'react';
import { DownOutlined } from '@ant-design/icons';
import CoinIcon from '../CoinIcon/CoinIcon';
import styles from './CurrencySelector.module.css';

// Support both Currency types
interface BaseCurrency {
    symbol: string;
    name: string;
    icon?: string;
}

// For Deposit/Withdraw/Transfer (from wallet service)
interface WalletCurrency extends BaseCurrency {
    id: string;
    networks?: any[];
}

// For Convert (from balance service)
// Extends WalletCurrency to ensure it has the id property
interface BalanceCurrency extends WalletCurrency {
    balance?: number;
    usdValue?: number;
}

type Currency = WalletCurrency | BalanceCurrency;

interface CurrencySelectorProps {
    currencies: Currency[];
    selectedCurrency: Currency | null;
    onSelect: (currency: Currency) => void;
    isOpen: boolean;
    onToggle: () => void;
    excludeSymbol?: string;
    showBalance?: boolean;
}

export default function CurrencySelector({
    currencies,
    selectedCurrency,
    onSelect,
    isOpen,
    onToggle,
    excludeSymbol,
    showBalance = false
}: CurrencySelectorProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredCurrencies = excludeSymbol
        ? currencies.filter(c => c.symbol !== excludeSymbol)
        : currencies;

    // Click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                if (isOpen) {
                    onToggle();
                }
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isOpen, onToggle]);

    // Helper to get balance from currency
    const getBalance = (currency: Currency): number | undefined => {
        return 'balance' in currency ? currency.balance : undefined;
    };

    return (
        <div className={styles.container} ref={containerRef}>
            <button
                className={styles.button}
                onClick={onToggle}
                type="button"
            >
                {selectedCurrency ? (
                    <>
                        <CoinIcon
                            symbol={selectedCurrency.symbol}
                            name={selectedCurrency.name}
                            size="small"
                            showName={false}
                        />
                        <span className={styles.selectedText}>{selectedCurrency.symbol}</span>
                    </>
                ) : (
                    <span className={styles.placeholder}>Chọn loại tiền...</span>
                )}
                <DownOutlined className={styles.arrow} />
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    {filteredCurrencies.map((currency) => (
                        <div
                            key={currency.symbol}
                            className={styles.item}
                            onClick={() => {
                                onSelect(currency);
                            }}
                        >
                            <CoinIcon
                                symbol={currency.symbol}
                                name={currency.name}
                                size="small"
                                showName={false}
                            />
                            <div className={styles.info}>
                                <span className={styles.symbol}>{currency.symbol}</span>
                                <span className={styles.name}>{currency.name}</span>
                            </div>
                            {showBalance && getBalance(currency) !== undefined && (
                                <span className={styles.balance}>{getBalance(currency)!.toLocaleString()}</span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
