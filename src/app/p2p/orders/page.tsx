'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ProtectedRoute from '@/src/components/common/ProtectedRoute/ProtectedRoute';
import P2PHeader from '@/src/components/P2P/P2PHeader/P2PHeader';
import StatusBadge from '@/src/components/P2P/StatusBadge/StatusBadge';
import PaymentMethodBadge from '@/src/components/P2P/PaymentMethodBadge/PaymentMethodBadge';
import { EditAdModal, EditAdData } from '@/src/components/P2P/EditAdModal/EditAdModal';
import { ConfirmModal } from '@/src/components/common/ConfirmModal/ConfirmModal';
import { P2POrder, UserP2PStats } from '@/src/types/p2p';
import P2PService from '@/src/services/p2p';
import styles from './page.module.css';

export default function MyOrders() {
    const router = useRouter();
    const [orders, setOrders] = useState<P2POrder[]>([]);
    const [stats, setStats] = useState<UserP2PStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

    // Modal states
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedAd, setSelectedAd] = useState<P2POrder | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [ordersData, statsData] = await Promise.all([
                P2PService.getUserOrders(),
                P2PService.getUserStats()
            ]);
            setOrders(ordersData);
            setStats(statsData);
        } catch (error) {
            console.error('Failed to load orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (ad: P2POrder) => {
        setSelectedAd(ad);
        setEditModalOpen(true);
    };

    const handleDeleteClick = (ad: P2POrder) => {
        setSelectedAd(ad);
        setDeleteModalOpen(true);
    };

    const handleEditAd = async (data: EditAdData) => {
        if (!selectedAd) return;

        try {
            await P2PService.updateAd(selectedAd.id, data);
            alert('Đã cập nhật quảng cáo thành công!');
            await loadData();
        } catch (error: any) {
            console.error('Failed to update ad:', error);
            throw error; // Re-throw to let modal handle it
        }
    };

    const handleDeleteAd = async () => {
        if (!selectedAd) return;

        try {
            await P2PService.cancelAd(selectedAd.id);
            alert('Đã xóa quảng cáo thành công!');
            await loadData();
        } catch (error: any) {
            console.error('Failed to delete ad:', error);
            alert('Không thể xóa quảng cáo. Vui lòng thử lại.');
        }
    };

    const formatAmount = (num: number) => {
        return new Intl.NumberFormat('vi-VN').format(num);
    };

    const filteredOrders = orders.filter(order =>
        activeTab === 'active' ? order.status === 'active' : order.status !== 'active'
    );

    return (
        <ProtectedRoute>
            <div className={styles.container}>
                <P2PHeader
                    title="Quảng cáo của tôi"
                    subtitle="Quản lý các quảng cáo P2P của bạn"
                    actions={
                        <button
                            className={styles.createButton}
                            onClick={() => router.push('/p2p/create')}
                        >
                            <PlusOutlined /> Tạo quảng cáo
                        </button>
                    }
                />

                {/* Stats Cards */}
                {stats && (
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statLabel}>Tổng giao dịch</div>
                            <div className={styles.statValue}>{stats.totalTrades}</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statLabel}>Hoàn thành</div>
                            <div className={styles.statValue}>{stats.completedTrades}</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statLabel}>Tỷ lệ hoàn thành</div>
                            <div className={styles.statValue}>{stats.completionRate.toFixed(1)}%</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statLabel}>Đánh giá</div>
                            <div className={styles.statValue}>⭐ {stats.rating.toFixed(1)}</div>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'active' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('active')}
                    >
                        Đang hoạt động ({orders.filter(o => o.status === 'active').length})
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'completed' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('completed')}
                    >
                        Đã hoàn thành ({orders.filter(o => o.status !== 'active').length})
                    </button>
                </div>

                {/* Orders List */}
                <div className={styles.content}>
                    {loading ? (
                        <div className={styles.loading}>
                            <div className={styles.spinner}></div>
                            <p>Đang tải...</p>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className={styles.empty}>
                            <p>Không có quảng cáo nào</p>
                            <button
                                className={styles.createButton}
                                onClick={() => router.push('/p2p/create')}
                            >
                                <PlusOutlined /> Tạo quảng cáo đầu tiên
                            </button>
                        </div>
                    ) : (
                        <div className={styles.ordersList}>
                            {filteredOrders.map(order => (
                                <div key={order.id} className={styles.orderCard}>
                                    <div className={styles.orderHeader}>
                                        <div className={styles.orderType}>
                                            <span className={`${styles.typeBadge} ${order.type === 'buy' ? styles.typeBuy : styles.typeSell
                                                }`}>
                                                {order.type === 'buy' ? 'MUA' : 'BÁN'}
                                            </span>
                                            <span className={styles.currency}>{order.currency}</span>
                                        </div>
                                        <StatusBadge status={order.status} />
                                    </div>

                                    <div className={styles.orderBody}>
                                        <div className={styles.orderRow}>
                                            <span className={styles.orderLabel}>Đơn giá</span>
                                            <span className={styles.orderValue}>
                                                {formatAmount(order.price)} {order.fiatCurrency}
                                            </span>
                                        </div>
                                        <div className={styles.orderRow}>
                                            <span className={styles.orderLabel}>Số lượng</span>
                                            <span className={styles.orderValue}>
                                                {formatAmount(order.availableAmount)} {order.currency}
                                            </span>
                                        </div>
                                        <div className={styles.orderRow}>
                                            <span className={styles.orderLabel}>Giới hạn</span>
                                            <span className={styles.orderValue}>
                                                {formatAmount(order.minLimit)} - {formatAmount(order.maxLimit)} {order.fiatCurrency}
                                            </span>
                                        </div>
                                        <div className={styles.orderRow}>
                                            <span className={styles.orderLabel}>Phương thức</span>
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
                                        </div>
                                    </div>

                                    {order.status === 'active' && (
                                        <div className={styles.orderActions}>
                                            <button
                                                className={styles.editButton}
                                                onClick={() => handleEditClick(order)}
                                            >
                                                <EditOutlined /> Chỉnh sửa
                                            </button>
                                            <button
                                                className={styles.deleteButton}
                                                onClick={() => handleDeleteClick(order)}
                                            >
                                                <DeleteOutlined /> Xóa
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Modals */}
                <EditAdModal
                    isOpen={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    onSave={handleEditAd}
                    ad={selectedAd}
                />

                <ConfirmModal
                    isOpen={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={handleDeleteAd}
                    title="Xác nhận xóa quảng cáo"
                    content={
                        <div>
                            <p>Bạn có chắc chắn muốn xóa quảng cáo này?</p>
                            {selectedAd?.type === 'sell' && (
                                <p style={{ marginTop: '8px', color: '#fbbf24' }}>
                                    Lưu ý: Số tiền còn lại sẽ được mở khóa.
                                </p>
                            )}
                        </div>
                    }
                    confirmText="Xóa"
                    cancelText="Hủy"
                    isDanger={true}
                />
            </div>
        </ProtectedRoute>
    );
}
