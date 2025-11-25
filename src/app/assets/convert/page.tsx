'use client';

import React, { useState, useEffect } from 'react';
import { SwapOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { getAssetsOverview } from '@/src/services/balance';
import WalletService from '@/src/services/wallet';
import styles from './page.module.css';

interface Currency {
    symbol: string;
    name: string;
    balance: number;
    usdValue: number;
    icon?: string;
}

export default function ConvertPage() {
    const router = useRouter();
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [loading, setLoading] = useState(true);
    const [fromCurrency, setFromCurrency] = useState<Currency | null>(null);
    const [toCurrency, setToCurrency] = useState<Currency | null>(null);
    const [fromAmount, setFromAmount] = useState('');
    const [toAmount, setToAmount] = useState('');
    const [exchangeRate, setExchangeRate] = useState(1);
    const [showFromSelect, setShowFromSelect] = useState(false);
    const [showToSelect, setShowToSelect] = useState(false);

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        try {
            setLoading(true);
            const [currencyData, assetsData] = await Promise.all([
                WalletService.getCurrencies(),
                getAssetsOverview()
            ]);

            // Combine metadata from WalletService with balances from API
            const mergedAssets: Currency[] = [];
            const spotAssets = assetsData.spot?.assets || [];

            // Use currencyData as the base to ensure we have metadata (name, icon)
            currencyData.forEach(currency => {
                // Find matching asset in spot wallet
                const asset = spotAssets.find((a: any) => a.currency === currency.symbol);

                // Only include if we have metadata AND (balance > 0 OR it's a supported currency)
                // For convert, we might want to show all supported currencies in dropdowns
                mergedAssets.push({
                    symbol: currency.symbol,
                    name: currency.name,
                    balance: asset?.balance || 0,
                    usdValue: asset?.valueUsd || 0,
                    icon: currency.icon
                });
            });

            // If there are assets in API that are not in WalletService (unlikely but possible), add them too
            spotAssets.forEach((asset: any) => {
                if (!mergedAssets.find(c => c.symbol === asset.currency)) {
                    mergedAssets.push({
                        symbol: asset.currency,
                        name: asset.currency, // Fallback to symbol if name unknown
                        balance: asset.balance || 0,
                        usdValue: asset.valueUsd || 0,
                    });
                }
            });

            setCurrencies(mergedAssets);

            // Set default currencies if available
            if (mergedAssets.length > 0) {
                // Try to find BTC and USDT for defaults
                const btc = mergedAssets.find(c => c.symbol === 'BTC');
                const usdt = mergedAssets.find(c => c.symbol === 'USDT');

                setFromCurrency(btc || mergedAssets[0]);
                setToCurrency(usdt || (mergedAssets.length > 1 ? mergedAssets[1] : mergedAssets[0]));
            }
        } catch (err) {
            console.error('Error fetching assets:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (fromCurrency && toCurrency && fromCurrency.balance > 0) {
            // Calculate exchange rate based on USD values
            const rate = fromCurrency.usdValue / toCurrency.usdValue * (fromCurrency.balance / toCurrency.balance);
            setExchangeRate(rate);
        }
    }, [fromCurrency, toCurrency]);

    useEffect(() => {
        if (fromAmount && fromCurrency && toCurrency) {
            const calculated = (parseFloat(fromAmount) * exchangeRate).toFixed(8);
            setToAmount(calculated);
        } else {
            setToAmount('');
        }
    }, [fromAmount, exchangeRate, fromCurrency, toCurrency]);

    const handleSwap = () => {
        const temp = fromCurrency;
        setFromCurrency(toCurrency);
        setToCurrency(temp);
        setFromAmount('');
        setToAmount('');
    };

    const handleMaxClick = () => {
        if (fromCurrency) {
            setFromAmount(fromCurrency.balance.toString());
        }
    };

    const handleConvert = () => {
        if (!fromCurrency || !toCurrency || !fromAmount) return;
        // TODO: Call API to convert
        alert(`Chuyển đổi ${fromAmount} ${fromCurrency.symbol} sang ${toAmount} ${toCurrency.symbol}`);
    };

    if (loading) {
        return (
            <div className={styles.convertPage}>
                <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <p>Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (!fromCurrency || !toCurrency || currencies.length === 0) {
        return (
            <div className={styles.convertPage}>
                <div className={styles.emptyState}>
                    <p>Không có tài sản để chuyển đổi</p>
                    <button onClick={() => router.push('/assets/deposit')}>Nạp tiền</button>
                </div>
            </div>
        );
    }

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
                            {fromCurrency.icon ? (
                                <img src={fromCurrency.icon} alt={fromCurrency.symbol} className={styles.currencyIcon} width={24} height={24} />
                            ) : (
                                <div className={styles.currencyIcon} style={{ background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                                    {fromCurrency.symbol[0]}
                                </div>
                            )}
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
                                    {currency.icon ? (
                                        <img src={currency.icon} alt={currency.symbol} className={styles.optionIcon} width={24} height={24} />
                                    ) : (
                                        <div className={styles.optionIcon} style={{ background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                                            {currency.symbol[0]}
                                        </div>
                                    )}
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
                            {toCurrency.icon ? (
                                <img src={toCurrency.icon} alt={toCurrency.symbol} className={styles.currencyIcon} width={24} height={24} />
                            ) : (
                                <div className={styles.currencyIcon} style={{ background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                                    {toCurrency.symbol[0]}
                                </div>
                            )}
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
                                    {currency.icon ? (
                                        <img src={currency.icon} alt={currency.symbol} className={styles.optionIcon} width={24} height={24} />
                                    ) : (
                                        <div className={styles.optionIcon} style={{ background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                                            {currency.symbol[0]}
                                        </div>
                                    )}
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
