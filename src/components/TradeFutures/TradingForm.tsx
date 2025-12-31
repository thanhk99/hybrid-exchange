"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './TradingForm.module.css';
import FuturesService from '@/src/services/futures';
import { FuturesOrderRequest } from '@/src/types/futures';
import { Notification } from '@/src/components/common/Notification/Notification';
import { getAssetsOverview } from '@/src/services/balance';
import TokenService from '@/src/services/token';
import { useFuturesMarket } from '@/src/contexts/FuturesMarketContext';
import { LockOutlined, InfoCircleOutlined, SwapOutlined } from '@ant-design/icons';

interface TradingFormProps {
    symbol: string;
}

export default function TradingForm({ symbol }: TradingFormProps) {
    const { marketData, error, selectedPrice } = useFuturesMarket();

    useEffect(() => {
        if (selectedPrice !== null) {
            setPrice(selectedPrice.toString());
        }
    }, [selectedPrice]);

    useEffect(() => {
        if (marketData && !price && orderType === 'limit') {
            setPrice(marketData.lastPrice.toString());
        }
    }, [marketData]);

    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
    const [side, setSide] = useState<'buy' | 'sell'>('buy');
    const [leverage, setLeverage] = useState(10);
    const [price, setPrice] = useState('');
    const [amount, setAmount] = useState('');
    const [balance, setBalance] = useState({ usdt: 0, coin: 0 });
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({
        type: 'info' as 'success' | 'error' | 'info' | 'warning',
        message: '',
        isVisible: false
    });

    useEffect(() => {
        // Check authentication status
        const checkAuth = () => {
            const token = TokenService.getAccessToken();
            setIsAuthenticated(!!token);
        };

        checkAuth();
        checkAuth();
        fetchBalance();
        // fetchPrice(); // Removed redundant call
    }, [symbol]);

    // fetchPrice removed


    const fetchBalance = async () => {
        const token = TokenService.getAccessToken();
        if (!token) {
            setBalance({ usdt: 0, coin: 0 });
            return;
        }

        try {
            const data = await getAssetsOverview();

            // USDT Balance from Futures wallet
            const futuresAsset = (data as any).futures?.asset;
            const usdtBalance = futuresAsset?.availableBalance || futuresAsset?.balance || 0;
            const coinSymbol = symbol.split('-')[0];
            let coinBalance = 0;
            if (data.spot?.assets && Array.isArray(data.spot.assets)) {
                const asset = data.spot.assets.find((a: any) => a.currency === coinSymbol);
                if (asset) {
                    coinBalance = asset.balance || 0;
                }
            }

            setBalance({ usdt: usdtBalance, coin: coinBalance });
        } catch (e) {
            console.error('Failed to fetch balance in TradingForm', e);
        }
    };

    const showNotification = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
        setNotification({ type, message, isVisible: true });
    };

    const closeNotification = () => {
        setNotification(prev => ({ ...prev, isVisible: false }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || parseFloat(amount) <= 0) {
            showNotification('error', 'Vui lòng nhập số lượng hợp lệ');
            return;
        }

        if (orderType === 'limit' && (!price || parseFloat(price) <= 0)) {
            showNotification('error', 'Vui lòng nhập giá hợp lệ');
            return;
        }

        setLoading(true);
        try {
            const orderData: FuturesOrderRequest = {
                symbol,
                side: side === 'buy' ? 'BUY' : 'SELL',
                positionSide: side === 'buy' ? 'LONG' : 'SHORT',
                type: orderType === 'limit' ? 'LIMIT' : 'MARKET',
                quantity: parseFloat(amount),
                leverage,
                price: orderType === 'limit' ? parseFloat(price) : undefined
            };

            await FuturesService.placeFuturesOrder(orderData);
            showNotification('success', 'Đặt lệnh thành công');

            // Reset form (optional, keep leverage/price)
            setAmount('');
            fetchBalance(); // Refresh balance after order
        } catch (error: any) {
            console.error('Order placement failed:', error);
            showNotification('error', error.response?.data?.message || 'Đặt lệnh thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <Notification
                type={notification.type}
                message={notification.message}
                isVisible={notification.isVisible}
                onClose={closeNotification}
            />

            <div className={styles.header}>
                <h3 className={styles.title}>Đặt lệnh</h3>
            </div>

            {/* Login Prompt for Unauthenticated Users */}
            {!isAuthenticated ? (
                <div className={styles.loginPrompt}>
                    <div className={styles.loginIcon}>
                        <LockOutlined />
                    </div>
                    <h4 className={styles.loginTitle}>Đăng nhập để giao dịch</h4>
                    <p className={styles.loginMessage}>
                        Bạn cần đăng nhập để thực hiện giao dịch futures
                    </p>
                    <button
                        className={styles.loginButton}
                        onClick={() => {
                            const currentPath = window.location.pathname;
                            router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
                        }}
                    >
                        Đăng nhập ngay
                    </button>
                    <p className={styles.registerPrompt}>
                        Chưa có tài khoản?{' '}
                        <span
                            className={styles.registerLink}
                            onClick={() => {
                                const currentPath = window.location.pathname;
                                router.push(`/register?redirect=${encodeURIComponent(currentPath)}`);
                            }}
                        >
                            Đăng ký
                        </span>
                    </p>
                </div>
            ) : (
                <>
                    {/* Leverage Selector */}
                    <div className={styles.leverageSection}>
                        <label className={styles.label}>Đòn bẩy</label>
                        <div className={styles.leverageControl}>
                            <button
                                className={styles.leverageBtn}
                                onClick={() => setLeverage(Math.max(1, leverage - 1))}
                            >
                                -
                            </button>
                            <span className={styles.leverageValue}>{leverage}x</span>
                            <button
                                className={styles.leverageBtn}
                                onClick={() => setLeverage(Math.min(125, leverage + 1))}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Side Tabs */}
                    <div className={styles.sideTabs}>
                        <button
                            className={`${styles.sideTab} ${side === 'buy' ? styles.buyActive : ''}`}
                            onClick={() => setSide('buy')}
                        >
                            Mua/Long
                        </button>
                        <button
                            className={`${styles.sideTab} ${side === 'sell' ? styles.sellActive : ''}`}
                            onClick={() => setSide('sell')}
                        >
                            Bán/Short
                        </button>
                    </div>

                    {/* Order Type */}
                    <div className={styles.orderTypeTabs}>
                        <button
                            className={`${styles.orderTypeTab} ${orderType === 'limit' ? styles.active : ''}`}
                            onClick={() => setOrderType('limit')}
                        >
                            Giới hạn
                        </button>
                        <button
                            className={`${styles.orderTypeTab} ${orderType === 'market' ? styles.active : ''}`}
                            onClick={() => setOrderType('market')}
                        >
                            Thị trường
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {/* Price Input (only for limit orders) */}
                        {orderType === 'limit' && (
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Giá</label>
                                <input
                                    type="text"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className={styles.input}
                                    placeholder="0.0"
                                />
                                <span className={styles.inputSuffix}>USDT</span>
                            </div>
                        )}

                        {/* Amount Input */}
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Số lượng</label>
                            <input
                                type="text"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className={styles.input}
                                placeholder="0.0"
                            />
                            <span className={styles.inputSuffix}>{symbol.split('-')[0]}</span>
                        </div>

                        {/* Percentage Buttons */}
                        <div className={styles.percentageButtons}>
                            {[25, 50, 75, 100].map(pct => (
                                <button
                                    key={pct}
                                    type="button"
                                    className={styles.percentageBtn}
                                    onClick={() => {/* Calculate and set amount based on balance */ }}
                                >
                                    {pct}%
                                </button>
                            ))}
                        </div>

                        {/* Available Balance */}
                        <div className={styles.balanceInfo}>
                            <span className={styles.balanceLabel}>Số dư khả dụng:</span>
                            <span className={styles.balanceValue}>
                                {side === 'buy'
                                    ? `${balance.usdt.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT`
                                    : `${balance.coin.toLocaleString('en-US', { minimumFractionDigits: 6 })} ${symbol.split('-')[0]}`
                                }
                            </span>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`${styles.submitBtn} ${side === 'buy' ? styles.buyBtn : styles.sellBtn}`}
                        >
                            {loading ? 'Đang xử lý...' : (side === 'buy' ? 'Mua/Long' : 'Bán/Short')}
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}
