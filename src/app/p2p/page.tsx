'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusOutlined, SearchOutlined, CheckOutlined, DownOutlined, ReloadOutlined, SafetyCertificateOutlined, ThunderboltOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import TradeModal from '@/src/components/P2P/TradeModal/TradeModal';
import { P2POrder, OrderType, PaymentMethodType } from '@/src/types/p2p';
import P2PService from '@/src/services/p2p';
import WalletService from '@/src/services/wallet';
import styles from './page.module.css';
import { useUser } from '@/src/contexts/UserContext';

export default function P2PMarketplace() {
    const router = useRouter();
    const { user } = useUser();
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
    const [amount, setAmount] = useState('');

    const [currencies, setCurrencies] = useState<string[]>([]);
    const fiatCurrencies = ['VND'];
    const [currencyIcons, setCurrencyIcons] = useState<Record<string, string>>({});
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

    useEffect(() => {
        // Load currencies and icons from WalletService
        const loadCurrencies = async () => {
            try {
                const currenciesData = await WalletService.getCurrencies();

                // Set available currencies for dropdown
                setCurrencies(currenciesData.map(c => c.symbol));

                // Set icons map
                const iconsMap: Record<string, string> = {};
                currenciesData.forEach(c => {
                    if (c.icon) {
                        iconsMap[c.symbol] = c.icon;
                    }
                });
                setCurrencyIcons(iconsMap);
            } catch (error) {
                console.error("Failed to fetch currencies", error);
                // Fallback if needed, or leave empty
            }
        };
        loadCurrencies();

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
    }, [orderType, currency, selectedPaymentMethods, sortBy, user]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            // Fetch public orders
            const publicOrdersPromise = P2PService.getOrders({
                type: orderType === 'buy' ? 'sell' : 'buy',
                currency,
                paymentMethods: selectedPaymentMethods.length > 0 ? selectedPaymentMethods : undefined
            });

            // Fetch user's own orders if logged in, but handle errors gracefully
            const userOrdersPromise = user
                ? P2PService.getUserOrders().catch(err => {
                    console.warn('Failed to fetch user orders (likely session expired), ignoring:', err);
                    return [];
                })
                : Promise.resolve([]);

            const [publicOrders, userOrders] = await Promise.all([publicOrdersPromise, userOrdersPromise]);

            const targetType = orderType === 'buy' ? 'sell' : 'buy';

            const relevantUserOrders = (userOrders as P2POrder[]).filter(order =>
                order.status === 'active' &&
                order.type === targetType &&
                order.currency === currency &&
                (selectedPaymentMethods.length === 0 ||
                    order.paymentMethods.some(pm => selectedPaymentMethods.includes(pm.type)))
            );

            const publicOrderIds = new Set(publicOrders.map(o => o.id));
            const uniqueUserOrders = relevantUserOrders.filter(o => !publicOrderIds.has(o.id));

            let data = [...uniqueUserOrders, ...publicOrders];

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
        (method.name || '').toLowerCase().includes(paymentSearchTerm.toLowerCase())
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

    const getPaymentColor = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('ngân hàng') || lowerName.includes('bank')) return '#f3ba2f';
        if (lowerName.includes('momo')) return '#d82d8b';
        if (lowerName.includes('zalopay')) return '#0068ff';
        return '#848e9c';
    };

    return (
        <div className={styles.container}>
            <div className={styles.topHeader}>
                <div className={styles.headerTitleSection}>
                    <h1 className={styles.mainTitle}>P2P</h1>
                    <div className={styles.orderTypeTabs}>
                        <button
                            className={`${styles.orderTypeTab} ${orderType === 'buy' ? styles.orderTypeTabActive : ''}`}
                            onClick={() => setOrderType('buy')}
                        >
                            Mua
                        </button>
                        <button
                            className={`${styles.orderTypeTab} ${orderType === 'sell' ? styles.orderTypeTabActive : ''}`}
                            onClick={() => setOrderType('sell')}
                        >
                            Bán
                        </button>
                    </div>
                </div>
                <button
                    className={styles.createAdButton}
                    onClick={() => router.push('/p2p/create')}
                >
                    <PlusOutlined /> Tạo quảng cáo
                </button>
            </div>

            <div className={styles.content}>
                {/* Filters Bar */}
                <div className={styles.filtersBar}>
                    <div className={styles.filterGroup}>
                        <div className={styles.assetSelector}>
                            <div className={styles.currencySelect}>
                                {currencyIcons[currency] && (
                                    <img src={currencyIcons[currency]} alt={currency} className={styles.currencyIcon} />
                                )}
                                <select
                                    className={styles.assetSelect}
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                >
                                    {currencies.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                                <DownOutlined className={styles.selectArrow} />
                            </div>

                            <div className={styles.fiatSelectWrapper}>
                                <select
                                    className={styles.fiatSelect}
                                    value={fiatCurrency}
                                    onChange={(e) => setFiatCurrency(e.target.value)}
                                >
                                    {fiatCurrencies.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                                <DownOutlined className={styles.selectArrow} />
                            </div>
                        </div>

                        <div className={styles.amountInputWrapper}>
                            <input
                                type="text"
                                placeholder="Nhập số tiền"
                                className={styles.amountInput}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            <span className={styles.amountUnit}>{fiatCurrency}</span>
                        </div>

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

                        <button className={styles.refreshButton} onClick={fetchOrders}>
                            <ReloadOutlined />
                        </button>
                    </div>

                    <div className={styles.sortGroup}>
                        <div className={styles.sortWrapper}>
                            <button
                                className={styles.sortButton}
                                onClick={() => setShowSortMenu(!showSortMenu)}
                            >
                                <span className={styles.sortLabelText}>Sắp xếp theo</span>
                                <span className={styles.sortCurrentValue}>{getSelectedSortLabel()}</span>
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
                    <table className={styles.adsTable}>
                        <thead>
                            <tr>
                                <th className={styles.thAdMerchant}>Nhà quảng cáo</th>
                                <th className={styles.thAdPrice}>Đơn giá <span className={styles.unit}>{fiatCurrency}</span></th>
                                <th className={styles.thAdLimit}>Giới hạn/Khả dụng</th>
                                <th className={styles.thAdPayment}>Phương thức thanh toán</th>
                                <th className={styles.thAdAction}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className={styles.loadingCell}>
                                        <div className={styles.loadingSpinner}></div>
                                        <p>Đang tải dữ liệu...</p>
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className={styles.emptyCell}>
                                        Không tìm thấy quảng cáo phù hợp
                                    </td>
                                </tr>
                            ) : (
                                orders.map(order => (
                                    <tr key={order.id} className={styles.adRow}>
                                        <td className={styles.tdAdMerchant}>
                                            <div className={styles.merchantCell}>
                                                <div className={styles.merchantIconWrapper}>
                                                    {order.merchantName.charAt(0).toUpperCase()}
                                                </div>
                                                <div className={styles.merchantDetail}>
                                                    <div className={styles.merchantMainName}>
                                                        {order.merchantName}
                                                        {order.merchantCompletedTrades > 100 && (
                                                            <CheckOutlined className={styles.verifiedIcon} />
                                                        )}
                                                    </div>
                                                    <div className={styles.merchantStats}>
                                                        <span>{order.merchantCompletedTrades} lệnh</span>
                                                        <span className={styles.divider}>|</span>
                                                        <span>{order.merchantCompletionRate.toFixed(1)}% hoàn tất</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={styles.tdAdPrice}>
                                            <div className={styles.priceCell}>
                                                <span className={styles.priceAmount}>{formatAmount(order.price)}</span>
                                                <span className={styles.priceUnit}>{order.fiatCurrency}</span>
                                            </div>
                                        </td>
                                        <td className={styles.tdAdLimit}>
                                            <div className={styles.limitCell}>
                                                <div className={styles.limitRow}>
                                                    <span className={styles.limitLabel}>Khả dụng</span>
                                                    <span className={styles.limitValue}>{formatAmount(order.availableAmount)} {order.currency}</span>
                                                </div>
                                                <div className={styles.limitRow}>
                                                    <span className={styles.limitLabel}>Giới hạn</span>
                                                    <span className={styles.limitValue}>{formatAmount(order.minLimit)} - {formatAmount(order.maxLimit)} {order.fiatCurrency}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={styles.tdAdPayment}>
                                            <div className={styles.paymentCell}>
                                                {order.paymentMethods.map(method => (
                                                    <div key={method.id} className={styles.paymentMethodItem}>
                                                        <span className={styles.paymentIndicator} style={{ backgroundColor: getPaymentColor(method.name || '') }}></span>
                                                        <span className={styles.paymentName}>{method.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className={styles.tdAdAction}>
                                            <button
                                                className={`${styles.actionBtn} ${orderType === 'buy' ? styles.buyBtn : styles.sellBtn}`}
                                                onClick={() => handleTrade(order)}
                                                disabled={user?.uid === order.merchantId}
                                            >
                                                {user?.uid === order.merchantId
                                                    ? 'Của bạn'
                                                    : `${orderType === 'buy' ? 'Mua' : 'Bán'} ${order.currency}`}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    <div className={styles.paginationSection}>
                        <span className={styles.paginationInfo}>Hiển thị 1-{orders.length} trên 140 kết quả</span>
                        <div className={styles.paginationControls}>
                            <button className={styles.pageBtn} disabled>&lt;</button>
                            <button className={`${styles.pageBtn} ${styles.pageActive}`}>1</button>
                            <button className={styles.pageBtn}>2</button>
                            <button className={styles.pageBtn}>3</button>
                            <span className={styles.pageDots}>...</span>
                            <button className={styles.pageBtn}>&gt;</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Features */}
            <div className={styles.footerFeatures}>
                <div className={styles.featureCard}>
                    <div className={styles.featureIcon}><SafetyCertificateOutlined /></div>
                    <div className={styles.featureContent}>
                        <h3>Giao dịch an toàn</h3>
                        <p>Tài sản P2P được giữ trong tài khoản ký quỹ của chúng tôi trong quá trình giao dịch để đảm bảo an toàn.</p>
                    </div>
                </div>
                <div className={styles.featureCard}>
                    <div className={styles.featureIcon}><ThunderboltOutlined /></div>
                    <div className={styles.featureContent}>
                        <h3>Thanh toán nhanh chóng</h3>
                        <h3>Hỗ trợ hơn 100 phương thức thanh toán và chuyển khoản ngân hàng địa phương tức thì.</h3>
                    </div>
                </div>
                <div className={styles.featureCard}>
                    <div className={styles.featureIcon}><CustomerServiceOutlined /></div>
                    <div className={styles.featureContent}>
                        <h3>Hỗ trợ 24/7</h3>
                        <p>Đội ngũ hỗ trợ khách hàng của chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc của bạn bất cứ lúc nào.</p>
                    </div>
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
