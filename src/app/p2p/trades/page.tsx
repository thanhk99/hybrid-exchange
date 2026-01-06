'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StatusBadge from '@/src/components/P2P/StatusBadge/StatusBadge';
import PaymentMethodBadge from '@/src/components/P2P/PaymentMethodBadge/PaymentMethodBadge';
import { P2PTrade, OrderType } from '@/src/types/p2p';
import P2PService from '@/src/services/p2p';
import ProtectedRoute from '@/src/components/common/ProtectedRoute/ProtectedRoute';
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
            const history = await P2PService.getUserHistory();

            // Map history to P2PTrade format
            const mappedTrades: P2PTrade[] = history.map((item: any) => ({
                id: item.id,
                orderId: item.adId?.toString() || '',
                order: {
                    id: item.adId?.toString() || '',
                    type: item.type?.toLowerCase() as OrderType,
                    merchantId: 'merchant',
                    merchantName: item.counterparty || 'Unknown',
                    merchantRating: 0,
                    merchantCompletedTrades: 0,
                    merchantCompletionRate: 0,
                    currency: item.asset,
                    fiatCurrency: item.fiatCurrency,
                    price: item.fiatAmount / item.cryptoAmount,
                    minLimit: 0,
                    maxLimit: 0,
                    availableAmount: 0,
                    paymentMethods: [item.paymentMethod],
                    status: 'active',
                    createdAt: item.createdAt
                },
                buyerId: item.type === 'BUY' ? 'current_user' : item.counterparty,
                buyerName: item.type === 'BUY' ? 'You' : item.counterparty,
                sellerId: item.type === 'SELL' ? 'current_user' : item.counterparty,
                sellerName: item.type === 'SELL' ? 'You' : item.counterparty,
                amount: item.fiatAmount,
                cryptoAmount: item.cryptoAmount,
                totalPrice: item.fiatAmount,
                paymentMethod: item.paymentMethod,
                status: item.status,
                createdAt: item.createdAt,
                expiresAt: item.createdAt, // Not provided by API
                completedAt: item.completedAt
            }));

            setTrades(mappedTrades);
        } catch (error) {
            console.error('Failed to load trades:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatAmount = (num: number) => new Intl.NumberFormat('vi-VN').format(num);
    const formatDate = (dateString: string) => new Date(dateString).toLocaleString('vi-VN');

    const filteredTrades = trades.filter(trade => {
        if (filter === 'all') return true;
        if (filter === 'completed') return trade.status === 'completed';
        if (filter === 'cancelled') return trade.status === 'cancelled';
        return true;
    });

    return (
        <ProtectedRoute>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Lịch sử giao dịch P2P</h1>
                </div>
                <div className={styles.filters}>
                    <button className={`${styles.filterButton} ${filter === 'all' ? styles.filterButtonActive : ''}`} onClick={() => setFilter('all')}>Tất cả</button>
                    <button className={`${styles.filterButton} ${filter === 'completed' ? styles.filterButtonActive : ''}`} onClick={() => setFilter('completed')}>Hoàn thành</button>
                    <button className={`${styles.filterButton} ${filter === 'cancelled' ? styles.filterButtonActive : ''}`} onClick={() => setFilter('cancelled')}>Đã hủy</button>
                </div>
                <div className={styles.content}>
                    {loading ? (
                        <div className={styles.loading}>
                            <div className={styles.spinner} />
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
                                                <td className={styles.tdId}>#{trade.id.slice(0, 8)}</td>
                                                <td className={styles.tdType}>
                                                    <span className={`${styles.typeBadge} ${isBuyer ? styles.typeBuy : styles.typeSell}`}>
                                                        {isBuyer ? 'MUA' : 'BÁN'}
                                                    </span>
                                                </td>
                                                <td className={styles.tdCrypto}>{trade.order.currency}</td>
                                                <td className={styles.tdAmount}>{formatAmount(trade.cryptoAmount)} {trade.order.currency}</td>
                                                <td className={styles.tdTotal}>{formatAmount(trade.totalPrice)} {trade.order.fiatCurrency}</td>
                                                <td className={styles.tdPayment}>
                                                    <PaymentMethodBadge method={trade.paymentMethod} size="small" />
                                                </td>
                                                <td className={styles.tdCounterparty}>{counterparty}</td>
                                                <td className={styles.tdStatus}>
                                                    <StatusBadge status={trade.status} size="small" />
                                                </td>
                                                <td className={styles.tdTime}>{formatDate(trade.createdAt)}</td>
                                                <td className={styles.tdAction}>
                                                    <button className={styles.viewButton} onClick={() => router.push(`/p2p/trade/${trade.id}`)}>
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
        </ProtectedRoute>
    );
}
