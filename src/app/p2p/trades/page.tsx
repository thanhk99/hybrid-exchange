'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StatusBadge from '@/src/components/P2P/StatusBadge/StatusBadge';
import PaymentMethodBadge from '@/src/components/P2P/PaymentMethodBadge/PaymentMethodBadge';
import { P2PTrade } from '@/src/types/p2p';
import P2PService from '@/src/services/p2p';
import styles from './page.module.css';

export default function TradesHistory() {
    const router = useRouter();
    const [trades, setTrades] = useState<P2PTrade[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'completed' | 'cancelled'>('all');

    useEffect(() => {
        loadTrades();
    }, []);

    const loadTrades = async () => {
        try {
            // Mock data - in real app, fetch from API
            const mockTrades: P2PTrade[] = [
                {
                    id: 'trade_1',
                    orderId: 'order_1',
                    order: {
                        id: 'order_1',
                        type: 'sell',
                        merchantId: 'user_1',
                        merchantName: 'CryptoTrader99',
                        merchantRating: 4.8,
                        merchantCompletedTrades: 1234,
                        merchantCompletionRate: 98.5,
                        currency: 'USDT',
                        fiatCurrency: 'VND',
                        price: 25350,
                        minLimit: 500000,
                        maxLimit: 50000000,
                        availableAmount: 10000,
                        paymentMethods: P2PService.getPaymentMethods().slice(0, 2),
                        status: 'active',
                        createdAt: new Date().toISOString()
                    },
                    buyerId: 'current_user',
                    buyerName: 'You',
                    sellerId: 'user_1',
                    sellerName: 'CryptoTrader99',
                    amount: 1000000,
                    cryptoAmount: 39.45,
                    totalPrice: 1000000,
                    paymentMethod: P2PService.getPaymentMethods()[0],
                    status: 'completed',
                    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                    expiresAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(),
                    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString()
                }
            ];
            setTrades(mockTrades);
        } catch (error) {
            console.error('Failed to load trades:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatAmount = (num: number) => {
        return new Intl.NumberFormat('vi-VN').format(num);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const filteredTrades = trades.filter(trade => {
        if (filter === 'all') return true;
        if (filter === 'completed') return trade.status === 'completed';
        if (filter === 'cancelled') return trade.status === 'cancelled';
        return true;
    });

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Lịch sử giao dịch P2P</h1>
            </div>

            {/* Filters */}
            <div className={styles.filters}>
                <button
                    className={`${styles.filterButton} ${filter === 'all' ? styles.filterButtonActive : ''}`}
                    onClick={() => setFilter('all')}
                >
                    Tất cả
                </button>
                <button
                    className={`${styles.filterButton} ${filter === 'completed' ? styles.filterButtonActive : ''}`}
                    onClick={() => setFilter('completed')}
                >
                    Hoàn thành
                </button>
                <button
                    className={`${styles.filterButton} ${filter === 'cancelled' ? styles.filterButtonActive : ''}`}
                    onClick={() => setFilter('cancelled')}
                >
                    Đã hủy
                </button>
            </div>

            {/* Trades Table */}
            <div className={styles.content}>
                {loading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Đang tải...</p>
                    </div>
                ) : filteredTrades.length === 0 ? (
                    <div className={styles.empty}>
                        <p>Không có giao dịch nào</p>
                    </div>
                ) : (
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Mã giao dịch</th>
                                    <th>Loại</th>
                                    <th>Tiền điện tử</th>
                                    <th>Số lượng</th>
                                    <th>Tổng tiền</th>
                                    <th>Phương thức</th>
                                    <th>Đối tác</th>
                                    <th>Trạng thái</th>
                                    <th>Thời gian</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTrades.map(trade => {
                                    const isBuyer = trade.buyerId === 'current_user';
                                    const counterparty = isBuyer ? trade.sellerName : trade.buyerName;

                                    return (
                                        <tr key={trade.id} className={styles.row}>
                                            <td className={styles.tdId}>
                                                #{trade.id.slice(0, 8)}
                                            </td>
                                            <td className={styles.tdType}>
                                                <span className={`${styles.typeBadge} ${isBuyer ? styles.typeBuy : styles.typeSell
                                                    }`}>
                                                    {isBuyer ? 'MUA' : 'BÁN'}
                                                </span>
                                            </td>
                                            <td className={styles.tdCrypto}>
                                                {trade.order.currency}
                                            </td>
                                            <td className={styles.tdAmount}>
                                                {formatAmount(trade.cryptoAmount)} {trade.order.currency}
                                            </td>
                                            <td className={styles.tdTotal}>
                                                {formatAmount(trade.totalPrice)} {trade.order.fiatCurrency}
                                            </td>
                                            <td className={styles.tdPayment}>
                                                <PaymentMethodBadge
                                                    method={trade.paymentMethod}
                                                    size="small"
                                                />
                                            </td>
                                            <td className={styles.tdCounterparty}>
                                                {counterparty}
                                            </td>
                                            <td className={styles.tdStatus}>
                                                <StatusBadge status={trade.status} size="small" />
                                            </td>
                                            <td className={styles.tdTime}>
                                                {formatDate(trade.createdAt)}
                                            </td>
                                            <td className={styles.tdAction}>
                                                <button
                                                    className={styles.viewButton}
                                                    onClick={() => router.push(`/p2p/trade/${trade.id}`)}
                                                >
                                                    Xem
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
