'use client';

import React, { useState, useEffect } from 'react';
import { SwapOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { FaSpinner } from 'react-icons/fa';
import { getAssetsOverview } from '@/src/services/balance';
import WalletService from '@/src/services/wallet';
import { Notification } from '../../common/Notification/Notification';
import CurrencySelector from '../../common/CurrencySelector/CurrencySelector';
import styles from './Convert.module.css';

interface Currency {
    id: string;
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
    const [isConverting, setIsConverting] = useState(false);

    const [notification, setNotification] = useState({
        isVisible: false,
        type: 'success' as 'success' | 'error' | 'info',
        title: '',
        message: ''
    });

    useEffect(() => {
        fetchAssets();

        // Auto-refresh prices every 30 seconds
        const interval = setInterval(() => {
            fetchAssets(true);
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (fromCurrency && toCurrency) {
            fetchExchangeRate();
        }
    }, [fromCurrency, toCurrency]);

    // Set default currencies only once when data is loaded and nothing is selected
    useEffect(() => {
        if (currencies.length > 0 && !fromCurrency && !toCurrency) {
            const btc = currencies.find(c => c.symbol === 'BTC');
            const usdt = currencies.find(c => c.symbol === 'USDT');

            setFromCurrency(btc || currencies[0]);
            setToCurrency(usdt || (currencies.length > 1 ? currencies[1] : currencies[0]));
        }
    }, [currencies, fromCurrency, toCurrency]);

    // Auto-refresh exchange rate every 10 seconds
    useEffect(() => {
        if (!fromCurrency || !toCurrency) return;

        const rateInterval = setInterval(() => {
            fetchExchangeRate();
        }, 10000); // Update every 10 seconds

        return () => clearInterval(rateInterval);
    }, [fromCurrency, toCurrency]);

    const fetchExchangeRate = async () => {
        try {
            const response = await WalletService.getExchangeRate(fromCurrency!.symbol, toCurrency!.symbol);
            // Handle both flat response (new API) and wrapped response (old/standard API)
            const rate = (response.data as any).rate || (response.data as any).data?.rate;

            if (rate) {
                setExchangeRate(rate);
            } else {
                if (fromCurrency!.usdValue > 0 && toCurrency!.usdValue > 0) {
                    const calculatedRate = fromCurrency!.usdValue / toCurrency!.usdValue;
                    setExchangeRate(calculatedRate);
                }
            }
        } catch (error) {
            console.error('Error fetching exchange rate:', error);
            if (fromCurrency!.usdValue > 0 && toCurrency!.usdValue > 0) {
                const rate = fromCurrency!.usdValue / toCurrency!.usdValue;
                setExchangeRate(rate);
            }
        }
    };

    useEffect(() => {
        if (fromAmount && fromCurrency && toCurrency) {
            const calculated = (parseFloat(fromAmount) * exchangeRate).toFixed(8);
            setToAmount(calculated);
        } else {
            setToAmount('');
        }
    }, [fromAmount, exchangeRate, fromCurrency, toCurrency]);

    const fetchAssets = async (isBackground = false) => {
        try {
            if (!isBackground) setLoading(true);
            const [currencyData, assetsData] = await Promise.all([
                WalletService.getCurrencies(),
                getAssetsOverview()
            ]);

            const mergedAssets: Currency[] = [];
            const fundingAssets = assetsData.funding?.assets || [];

            currencyData.forEach(currency => {
                const asset = fundingAssets.find((a: any) => a.currency === currency.symbol);
                mergedAssets.push({
                    id: currency.id,
                    symbol: currency.symbol,
                    name: currency.name,
                    balance: asset?.balance || 0,
                    usdValue: asset?.valueUsd || 0,
                    icon: currency.icon
                });
            });

            fundingAssets.forEach((asset: any) => {
                if (!mergedAssets.find(c => c.symbol === asset.currency)) {
                    mergedAssets.push({
                        id: asset.currency.toLowerCase(),
                        symbol: asset.currency,
                        name: asset.currency,
                        balance: asset.balance || 0,
                        usdValue: asset.valueUsd || 0,
                    });
                }
            });

            setCurrencies(mergedAssets);
        } catch (err) {
            console.error('Error fetching assets:', err);
        } finally {
            if (!isBackground) setLoading(false);
        }
    };

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

    const handleConvert = async () => {
        if (!fromCurrency || !toCurrency || !fromAmount) return;

        try {
            setIsConverting(true);
            const response = await WalletService.swap({
                fromCoin: fromCurrency.symbol,
                toCoin: toCurrency.symbol,
                amount: parseFloat(fromAmount)
            });

            if (response.status === 200 || response.status === 201) {
                showNotification('success', 'Thành công', `Đã chuyển đổi ${fromAmount} ${fromCurrency.symbol} sang ${response.data.data.receivedAmount} ${toCurrency.symbol}`);
                fetchAssets();
                setFromAmount('');
                setToAmount('');
            } else {
                throw new Error(response.data?.message || 'Chuyển đổi thất bại');
            }
        } catch (error: any) {
            console.error('Swap error:', error);
            showNotification('error', 'Lỗi', error.response?.data?.message || 'Có lỗi xảy ra khi chuyển đổi');
        } finally {
            setIsConverting(false);
        }
    };

    const showNotification = (type: 'success' | 'error' | 'info', title: string, message: string) => {
        setNotification({ isVisible: true, type, title, message });
    };

    if (loading) {
        return (
            <div className={styles.convertContainer}>
                <div className={styles.loadingState}>
                    <FaSpinner className={styles.spin} />
                    <p>Đang tải...</p>
                </div>
            </div>
        );
    }

    if (!fromCurrency || !toCurrency || currencies.length === 0) {
        return (
            <div className={styles.convertContainer}>
                <div className={styles.emptyState}>
                    <p>Không có tài sản để chuyển đổi</p>
                    <button onClick={() => router.push('/assets/deposit')}>Nạp tiền</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.convertContainer}>
            <Notification
                isVisible={notification.isVisible}
                type={notification.type}
                title={notification.title}
                message={notification.message}
                onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
            />

            <div className={styles.header}>
                <h1 className={styles.title}>Chuyển đổi</h1>
            </div>

            <div className={styles.content}>
                {/* Step 1: From Currency */}
                <div className={styles.stepContainer}>
                    <div className={`${styles.stepHeader} ${fromCurrency && fromAmount ? styles.stepCompleted : styles.stepActive}`}>
                        <div className={styles.stepBadge}>
                            {fromCurrency && fromAmount ? <CheckCircleOutlined /> : '1'}
                        </div>
                        <span className={styles.stepTitle}>Từ</span>
                    </div>

                    <div className={styles.stepContent}>
                        <div className={styles.currencyRow}>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="number"
                                    className={styles.input}
                                    placeholder="0.00"
                                    value={fromAmount}
                                    onChange={(e) => setFromAmount(e.target.value)}
                                />
                                <button className={styles.maxButton} onClick={handleMaxClick}>
                                    Tối đa
                                </button>
                            </div>
                            <div className={styles.selectorWrapper}>
                                <CurrencySelector
                                    currencies={currencies}
                                    selectedCurrency={fromCurrency}
                                    onSelect={(currency) => setFromCurrency(currency as Currency)}
                                    isOpen={showFromSelect}
                                    onToggle={() => setShowFromSelect(!showFromSelect)}
                                    excludeSymbol={toCurrency?.symbol}
                                    showBalance={true}
                                />
                            </div>
                        </div>
                        {fromCurrency && (
                            <div className={styles.balanceInfo}>
                                Số dư khả dụng: <strong>{fromCurrency.balance.toLocaleString()} {fromCurrency.symbol}</strong>
                            </div>
                        )}
                    </div>
                </div>

                {/* Swap Button */}
                {fromCurrency && toCurrency && (
                    <div className={styles.swapButtonWrapper}>
                        <button className={styles.swapButton} onClick={handleSwap}>
                            <SwapOutlined />
                        </button>
                    </div>
                )}

                {/* Step 2: To Currency */}
                {fromCurrency && (
                    <div className={styles.stepContainer}>
                        <div className={`${styles.stepHeader} ${toCurrency && toAmount ? styles.stepCompleted : styles.stepActive}`}>
                            <div className={styles.stepBadge}>
                                {toCurrency && toAmount ? <CheckCircleOutlined /> : '2'}
                            </div>
                            <span className={styles.stepTitle}>Sang</span>
                        </div>

                        <div className={styles.stepContent}>
                            <div className={styles.currencyRow}>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="number"
                                        className={styles.input}
                                        placeholder="0.00"
                                        value={toAmount}
                                        readOnly
                                    />
                                </div>
                                <div className={styles.selectorWrapper}>
                                    <CurrencySelector
                                        currencies={currencies}
                                        selectedCurrency={toCurrency}
                                        onSelect={(currency) => setToCurrency(currency as Currency)}
                                        isOpen={showToSelect}
                                        onToggle={() => setShowToSelect(!showToSelect)}
                                        excludeSymbol={fromCurrency?.symbol}
                                        showBalance={true}
                                    />
                                </div>
                            </div>
                            {toCurrency && (
                                <div className={styles.balanceInfo}>
                                    Số dư khả dụng: <strong>{toCurrency.balance.toLocaleString()} {toCurrency.symbol}</strong>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Exchange Rate */}
                {fromCurrency && toCurrency && (
                    <div className={styles.networkStats}>
                        <div className={styles.stat}>
                            <span className={styles.statLabel}>Tỷ giá:</span>
                            <span className={styles.statValue}>1 {fromCurrency.symbol} ≈ {exchangeRate.toLocaleString()} {toCurrency.symbol}</span>
                        </div>
                    </div>
                )}

                {/* Convert Button */}
                {fromCurrency && toCurrency && fromAmount && (
                    <button
                        className={styles.convertButton}
                        onClick={handleConvert}
                        disabled={isConverting}
                    >
                        {isConverting ? <FaSpinner className={styles.spin} /> : 'Chuyển đổi'}
                    </button>
                )}
            </div>
        </div>
    );
}
