'use client';

import React, { useState, useEffect } from 'react';
import { SwapOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface Currency {
    symbol: string;
    name: string;
    balance: number;
    usdValue: number;
}

export default function ConvertPage() {
    const router = useRouter();
    const [fromCurrency, setFromCurrency] = useState<Currency>({ symbol: 'BTC', name: 'Bitcoin', balance: 0.5234, usdValue: 23456.78 });
    const [toCurrency, setToCurrency] = useState<Currency>({ symbol: 'USDT', name: 'Tether', balance: 10000, usdValue: 10000 });
    const [fromAmount, setFromAmount] = useState('');
    const [toAmount, setToAmount] = useState('');
    const [exchangeRate, setExchangeRate] = useState(44800.50);
    const [showFromSelect, setShowFromSelect] = useState(false);
    const [showToSelect, setShowToSelect] = useState(false);

    const currencies: Currency[] = [
        { symbol: 'BTC', name: 'Bitcoin', balance: 0.5234, usdValue: 23456.78 },
        { symbol: 'ETH', name: 'Ethereum', balance: 5.234, usdValue: 12345.67 },
        { symbol: 'USDT', name: 'Tether', balance: 10000, usdValue: 10000 },
        { symbol: 'BNB', name: 'BNB', balance: 12.5, usdValue: 3456.78 },
        { symbol: 'SOL', name: 'Solana', balance: 45.2, usdValue: 5678.90 },
    ];

    useEffect(() => {
        if (fromAmount) {
            const calculated = (parseFloat(fromAmount) * exchangeRate).toFixed(2);
            setToAmount(calculated);
        } else {
            setToAmount('');
        }
    }, [fromAmount, exchangeRate]);

    const handleSwap = () => {
        const temp = fromCurrency;
        setFromCurrency(toCurrency);
        setToCurrency(temp);
        setFromAmount('');
        setToAmount('');
    };

    const handleMaxClick = () => {
        setFromAmount(fromCurrency.balance.toString());
    };

    const handleConvert = () => {
        // TODO: Call API to convert
        alert(`Chuyển đổi ${fromAmount} ${fromCurrency.symbol} sang ${toAmount} ${toCurrency.symbol}`);
    };

    return (
        <div className={styles.convertPage}>
            <div className={styles.header}>
                <h1 className={styles.pageTitle}>Chuyển đổi</h1>
                <p className={styles.pageSubtitle}>Chuyển đổi nhanh giữa các loại tiền điện tử</p>
            </div>

            <div className={styles.convertCard}>
                {/* From Section */}
                <div className={styles.currencySection}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.label}>Từ</span>
                        <span className={styles.balance}>
                            Khả dụng: {fromCurrency.balance.toLocaleString()} {fromCurrency.symbol}
                        </span>
                    </div>
                    <div className={styles.inputRow}>
                        <button
                            className={styles.currencyButton}
                            onClick={() => setShowFromSelect(!showFromSelect)}
                        >
                            <span className={styles.currencyIcon}>{fromCurrency.symbol[0]}</span>
                            <div className={styles.currencyInfo}>
                                <div className={styles.currencySymbol}>{fromCurrency.symbol}</div>
                                <div className={styles.currencyName}>{fromCurrency.name}</div>
                            </div>
                            <span className={styles.arrow}>▼</span>
                        </button>
                        <div className={styles.inputWrapper}>
                            <input
                                type="number"
                                className={styles.amountInput}
                                value={fromAmount}
                                onChange={(e) => setFromAmount(e.target.value)}
                                placeholder="0.00"
                            />
                            <button className={styles.maxButton} onClick={handleMaxClick}>
                                MAX
                            </button>
                        </div>
                    </div>
                    {showFromSelect && (
                        <div className={styles.currencyDropdown}>
                            {currencies.filter(c => c.symbol !== toCurrency.symbol).map((currency) => (
                                <div
                                    key={currency.symbol}
                                    className={styles.currencyOption}
                                    onClick={() => {
                                        setFromCurrency(currency);
                                        setShowFromSelect(false);
                                    }}
                                >
                                    <span className={styles.optionIcon}>{currency.symbol[0]}</span>
                                    <div className={styles.optionInfo}>
                                        <div className={styles.optionSymbol}>{currency.symbol}</div>
                                        <div className={styles.optionName}>{currency.name}</div>
                                    </div>
                                    <div className={styles.optionBalance}>{currency.balance.toLocaleString()}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Swap Button */}
                <div className={styles.swapButtonWrapper}>
                    <button className={styles.swapButton} onClick={handleSwap}>
                        <SwapOutlined />
                    </button>
                </div>

                {/* To Section */}
                <div className={styles.currencySection}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.label}>Sang</span>
                        <span className={styles.balance}>
                            Khả dụng: {toCurrency.balance.toLocaleString()} {toCurrency.symbol}
                        </span>
                    </div>
                    <div className={styles.inputRow}>
                        <button
                            className={styles.currencyButton}
                            onClick={() => setShowToSelect(!showToSelect)}
                        >
                            <span className={styles.currencyIcon}>{toCurrency.symbol[0]}</span>
                            <div className={styles.currencyInfo}>
                                <div className={styles.currencySymbol}>{toCurrency.symbol}</div>
                                <div className={styles.currencyName}>{toCurrency.name}</div>
                            </div>
                            <span className={styles.arrow}>▼</span>
                        </button>
                        <div className={styles.inputWrapper}>
                            <input
                                type="number"
                                className={styles.amountInput}
                                value={toAmount}
                                readOnly
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    {showToSelect && (
                        <div className={styles.currencyDropdown}>
                            {currencies.filter(c => c.symbol !== fromCurrency.symbol).map((currency) => (
                                <div
                                    key={currency.symbol}
                                    className={styles.currencyOption}
                                    onClick={() => {
                                        setToCurrency(currency);
                                        setShowToSelect(false);
                                    }}
                                >
                                    <span className={styles.optionIcon}>{currency.symbol[0]}</span>
                                    <div className={styles.optionInfo}>
                                        <div className={styles.optionSymbol}>{currency.symbol}</div>
                                        <div className={styles.optionName}>{currency.name}</div>
                                    </div>
                                    <div className={styles.optionBalance}>{currency.balance.toLocaleString()}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Exchange Rate */}
                <div className={styles.rateInfo}>
                    <InfoCircleOutlined />
                    <span>Tỷ giá: 1 {fromCurrency.symbol} = {exchangeRate.toLocaleString()} {toCurrency.symbol}</span>
                </div>

                {/* Convert Button */}
                <button
                    className={styles.convertButton}
                    onClick={handleConvert}
                    disabled={!fromAmount || parseFloat(fromAmount) <= 0}
                >
                    Chuyển đổi
                </button>
            </div>

            {/* Info Card */}
            <div className={styles.infoCard}>
                <h3>Lưu ý</h3>
                <ul>
                    <li>Giao dịch chuyển đổi được thực hiện ngay lập tức</li>
                    <li>Tỷ giá được cập nhật theo thời gian thực</li>
                    <li>Không có phí giao dịch cho chuyển đổi</li>
                    <li>Số dư sau khi chuyển đổi sẽ được cập nhật vào ví Spot</li>
                </ul>
            </div>
        </div>
    );
}
