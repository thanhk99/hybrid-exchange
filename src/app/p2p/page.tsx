'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusOutlined, SearchOutlined, CheckOutlined, DownOutlined } from '@ant-design/icons';
import UserRating from '@/src/components/P2P/UserRating/UserRating';
import PaymentMethodBadge from '@/src/components/P2P/PaymentMethodBadge/PaymentMethodBadge';
import TradeModal from '@/src/components/P2P/TradeModal/TradeModal';
import { P2POrder, OrderType, PaymentMethodType } from '@/src/types/p2p';
import P2PService from '@/src/services/p2p';
import WalletService from '@/src/services/wallet';
import styles from './page.module.css';

export default function P2PMarketplace() {
    const router = useRouter();
    const [orderType, setOrderType] = useState<OrderType>('buy');
    const [currency, setCurrency] = useState('USDT');
    const [fiatCurrency, setFiatCurrency] = useState('VND');
    const [orders, setOrders] = useState<P2POrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<P2POrder | null>(null);
    const [showTradeModal, setShowTradeModal] = useState(false);
    const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<PaymentMethodType[]>([]);
    const [showPaymentFilter, setShowPaymentFilter] = useState(false);
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [sortBy, setSortBy] = useState('default');
    const [paymentSearchTerm, setPaymentSearchTerm] = useState('');

    const currencies = ['USDT', 'BTC', 'ETH', 'BNB'];
    const fiatCurrencies = ['VND'];
    const [currencyIcons, setCurrencyIcons] = useState<Record<string, string>>({});
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

    useEffect(() => {
        // Load currency icons
        const loadCurrencyIcons = async () => {
            const currenciesData = await WalletService.getCurrencies();
            const iconsMap: Record<string, string> = {};
            currenciesData.forEach(c => {
                iconsMap[c.symbol] = c.icon;
            });
            setCurrencyIcons(iconsMap);
        };
        loadCurrencyIcons();

        // Load payment methods
        const loadPaymentMethods = async () => {
            try {
                const methods = await P2PService.getPaymentMethods();
                setPaymentMethods(methods);
            } catch (error) {
                console.error('Failed to load payment methods:', error);
                setPaymentMethods([]);
            }
        };
        loadPaymentMethods();
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [orderType, currency, selectedPaymentMethods, sortBy]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            let data = await P2PService.getOrders({
                type: orderType === 'buy' ? 'sell' : 'buy',
                currency,
                paymentMethods: selectedPaymentMethods.length > 0 ? selectedPaymentMethods : undefined
            });

            // Apply sorting
            if (sortBy === 'price_asc') {
                data = data.sort((a, b) => a.price - b.price);
            } else if (sortBy === 'price_desc') {
                data = data.sort((a, b) => b.price - a.price);
            } else if (sortBy === 'completion_rate') {
                data = data.sort((a, b) => b.merchantCompletionRate - a.merchantCompletionRate);
            } else if (sortBy === 'trades') {
                data = data.sort((a, b) => b.merchantCompletedTrades - a.merchantCompletedTrades);
            }

            setOrders(data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTrade = (order: P2POrder) => {
        setSelectedOrder(order);
        setShowTradeModal(true);
    };

    const handleConfirmTrade = async (amount: number, paymentMethodId: string) => {
        if (!selectedOrder) return;

        try {
            const trade = await P2PService.createTrade(selectedOrder.id, amount);
            setShowTradeModal(false);
            router.push(`/p2p/trade/${trade.id}`);
        } catch (error) {
            console.error('Failed to create trade:', error);
            alert('Tạo giao dịch thất bại. Vui lòng thử lại.');
        }
    };

    const togglePaymentMethod = (method: PaymentMethodType) => {
        setSelectedPaymentMethods(prev =>
            prev.includes(method)
                ? prev.filter(m => m !== method)
                : [...prev, method]
        );
    };

    const formatAmount = (num: number) => {
        return new Intl.NumberFormat('vi-VN').format(num);
    };

    const filteredPaymentMethods = paymentMethods.filter(method =>
        method.name.toLowerCase().includes(paymentSearchTerm.toLowerCase())
    );

    const sortOptions = [
        { value: 'default', label: 'Được khuyến nghị' },
        { value: 'price_asc', label: 'Giá: tăng dần' },
        { value: 'price_desc', label: 'Giá: giảm dần' },
        { value: 'completion_rate', label: 'Tổng số lệnh đã hoàn tất' },
        { value: 'trades', label: 'Tổng tỷ lệ hoàn tất' }
    ];

    const getSelectedSortLabel = () => {
        return sortOptions.find(opt => opt.value === sortBy)?.label || 'Sắp xếp theo';
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.title}>P2P</h1>
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${orderType === 'buy' ? styles.tabActive : ''}`}
                            onClick={() => setOrderType('buy')}
                        >
                            Mua
                        </button>
                        <button
                            className={`${styles.tab} ${orderType === 'sell' ? styles.tabActive : ''}`}
                            onClick={() => setOrderType('sell')}
                        >
                            Bán
                        </button>
                    </div>
                </div>
                <button
                    className={styles.createButton}
                    onClick={() => router.push('/p2p/create')}
                >
                    <PlusOutlined /> Tạo quảng cáo
                </button>
            </div>

            <div className={styles.content}>
                {/* Filters Bar */}
                <div className={styles.filtersBar}>
                    <div className={styles.filterGroup}>
                        <div className={styles.currencySelect}>
                            {currencyIcons[currency] && (
                                <img src={currencyIcons[currency]} alt={currency} className={styles.currencyIcon} />
                            )}
                            <select
                                className={styles.select}
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                            >
                                {currencies.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <select
                            className={styles.select}
                            value={fiatCurrency}
                            onChange={(e) => setFiatCurrency(e.target.value)}
                        >
                            {fiatCurrencies.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>

                        <div className={styles.paymentFilterWrapper}>
                            <button
                                className={styles.paymentFilterButton}
                                onClick={() => setShowPaymentFilter(!showPaymentFilter)}
                            >
                                <span>
                                    {selectedPaymentMethods.length > 0
                                        ? `${selectedPaymentMethods.length} phương thức đã chọn`
                                        : 'Tất cả phương thức'}
                                </span>
                                <DownOutlined className={styles.dropdownIcon} />
                            </button>

                            {showPaymentFilter && (
                                <div className={styles.paymentDropdown}>
                                    <div className={styles.paymentSearch}>
                                        <SearchOutlined className={styles.searchIcon} />
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm"
                                            value={paymentSearchTerm}
                                            onChange={(e) => setPaymentSearchTerm(e.target.value)}
                                            className={styles.searchInput}
                                        />
                                    </div>
                                    <div className={styles.paymentList}>
                                        {filteredPaymentMethods.map(method => (
                                            <label key={method.id} className={styles.paymentItem}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPaymentMethods.includes(method.type)}
                                                    onChange={() => togglePaymentMethod(method.type)}
                                                    className={styles.checkbox}
                                                />
                                                <span className={styles.paymentItemIcon}>{method.icon}</span>
                                                <span className={styles.paymentItemName}>{method.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.sortGroup}>
                        <div className={styles.sortWrapper}>
                            <button
                                className={styles.sortButton}
                                onClick={() => setShowSortMenu(!showSortMenu)}
                            >
                                <span className={styles.sortLabel}>Sắp xếp theo</span>
                                <span className={styles.sortValue}>{getSelectedSortLabel()}</span>
                                <DownOutlined className={styles.dropdownIcon} />
                            </button>

                            {showSortMenu && (
                                <div className={styles.sortDropdown}>
                                    {sortOptions.map(option => (
                                        <button
                                            key={option.value}
                                            className={`${styles.sortOption} ${sortBy === option.value ? styles.sortOptionActive : ''}`}
                                            onClick={() => {
                                                setSortBy(option.value);
                                                setShowSortMenu(false);
                                            }}
                                        >
                                            <span>{option.label}</span>
                                            {sortBy === option.value && <CheckOutlined className={styles.checkIcon} />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.thMerchant}>Nhà quảng cáo</th>
                                <th className={styles.thPrice}>Đơn giá</th>
                                <th className={styles.thLimit}>Giới hạn/Khả dụng</th>
                                <th className={styles.thPayment}>Phương thức thanh toán</th>
                                <th className={styles.thAction}>Khối lượng</th>
                                <th className={styles.thAction}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className={styles.loading}>
                                        <div className={styles.spinner}></div>
                                        <p>Đang tải...</p>
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className={styles.empty}>
                                        Không tìm thấy đơn hàng
                                    </td>
                                </tr>
                            ) : (
                                orders.map(order => (
                                    <tr key={order.id} className={styles.row}>
                                        <td className={styles.tdMerchant}>
                                            <div className={styles.merchantInfo}>
                                                <div className={styles.merchantName}>
                                                    {order.merchantName}
                                                    {order.merchantCompletedTrades > 100 && (
                                                        <span className={styles.badge}>⭐ Ưu tú</span>
                                                    )}
                                                </div>
                                                <UserRating
                                                    rating={order.merchantRating}
                                                    completedTrades={order.merchantCompletedTrades}
                                                    completionRate={order.merchantCompletionRate}
                                                    size="small"
                                                />
                                            </div>
                                        </td>
                                        <td className={styles.tdPrice}>
                                            <div className={styles.price}>
                                                {formatAmount(order.price)} {order.fiatCurrency}
                                            </div>
                                        </td>
                                        <td className={styles.tdLimit}>
                                            <div className={styles.limit}>
                                                <div className={styles.limitRange}>
                                                    {formatAmount(order.minLimit)}-{formatAmount(order.maxLimit)} {order.fiatCurrency}
                                                </div>
                                                <div className={styles.available}>
                                                    Khả dụng {formatAmount(order.availableAmount)} {order.currency}
                                                </div>
                                            </div>
                                        </td>
                                        <td className={styles.tdPayment}>
                                            <div className={styles.paymentMethods}>
                                                {order.paymentMethods.slice(0, 2).map(method => (
                                                    <PaymentMethodBadge
                                                        key={method.id}
                                                        method={method}
                                                        size="small"
                                                    />
                                                ))}
                                                {order.paymentMethods.length > 2 && (
                                                    <span className={styles.morePayments}>
                                                        +{order.paymentMethods.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className={styles.tdVolume}>
                                            <div className={styles.volume}>
                                                {formatAmount(order.availableAmount)} {order.currency}
                                            </div>
                                        </td>
                                        <td className={styles.tdAction}>
                                            <button
                                                className={styles.tradeButton}
                                                onClick={() => handleTrade(order)}
                                            >
                                                {orderType === 'buy' ? 'Mua' : 'Bán'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Trade Modal */}
            {selectedOrder && (
                <TradeModal
                    order={selectedOrder}
                    isOpen={showTradeModal}
                    onClose={() => setShowTradeModal(false)}
                    onConfirm={handleConfirmTrade}
                />
            )}
        </div>
    );
}
