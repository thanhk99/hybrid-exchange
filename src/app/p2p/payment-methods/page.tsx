'use client';

import { useState, useEffect } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined, BankOutlined, WalletOutlined, MobileOutlined, CreditCardOutlined } from '@ant-design/icons';
import { PaymentMethod, PaymentMethodType } from '@/src/types/p2p';
import PaymentMethodService from '@/src/services/paymentMethod';
import { Modal } from 'antd';
import { Notification } from '@/src/components/common/Notification/Notification';
import ProtectedRoute from '@/src/components/common/ProtectedRoute/ProtectedRoute';
import styles from './page.module.css';

export default function PaymentMethodsPage() {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState<{
        type: 'success' | 'error' | 'warning' | 'info';
        message: string;
        isVisible: boolean;
    }>({
        type: 'info',
        message: '',
        isVisible: false
    });

    useEffect(() => {
        loadPaymentMethods();
    }, []);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({
            type,
            message,
            isVisible: true
        });
    };

    const closeNotification = () => {
        setNotification(prev => ({ ...prev, isVisible: false }));
    };

    const loadPaymentMethods = async () => {
        try {
            setLoading(true);
            const methods = await PaymentMethodService.getPaymentMethods();
            setPaymentMethods(methods);
        } catch (error) {
            showNotification('error', 'Không thể tải danh sách phương thức thanh toán');
        } finally {
            setLoading(false);
        }
    };

    const handleAddMethod = async (method: Partial<PaymentMethod>) => {
        try {
            await PaymentMethodService.addPaymentMethod(method);
            showNotification('success', 'Thêm phương thức thanh toán thành công');
            loadPaymentMethods();
            setShowAddModal(false);
        } catch (error: any) {
            showNotification('error', error.message || 'Thêm thất bại');
        }
    };

    const handleEditMethod = async (method: PaymentMethod) => {
        try {
            await PaymentMethodService.updatePaymentMethod(method.id, method);
            showNotification('success', 'Cập nhật thành công');
            loadPaymentMethods();
            setEditingMethod(null);
        } catch (error: any) {
            showNotification('error', error.message || 'Cập nhật thất bại');
        }
    };

    const handleDeleteMethod = (id: string) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa phương thức thanh toán này?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await PaymentMethodService.deletePaymentMethod(id);
                    showNotification('success', 'Đã xóa phương thức thanh toán');
                    loadPaymentMethods();
                } catch (error: any) {
                    showNotification('error', error.message || 'Xóa thất bại');
                }
            }
        });
    };

    const getMethodIcon = (type: string) => {
        switch (type) {
            case 'BANK_TRANSFER': return <BankOutlined />;
            case 'MOMO': return <WalletOutlined />;
            case 'ZALOPAY': return <MobileOutlined />;
            case 'VIETTEL_PAY': return <MobileOutlined />;
            default: return <CreditCardOutlined />;
        }
    };

    const getMethodColor = (type: string) => {
        switch (type) {
            case 'BANK_TRANSFER': return '#3b82f6'; // Blue
            case 'MOMO': return '#ec4899'; // Pink
            case 'ZALOPAY': return '#0ea5e9'; // Sky
            case 'VIETTEL_PAY': return '#ef4444'; // Red
            default: return '#64748b';
        }
    };

    const getMethodName = (type: string) => {
        const names: Record<string, string> = {
            'BANK_TRANSFER': 'Chuyển khoản ngân hàng',
            'MOMO': 'Momo',
            'ZALOPAY': 'ZaloPay',
            'VIETTEL_PAY': 'ViettelPay'
        };
        return names[type] || type;
    };

    return (
        <ProtectedRoute>
            <div className={styles.container}>
                <Notification
                    type={notification.type}
                    message={notification.message}
                    isVisible={notification.isVisible}
                    onClose={closeNotification}
                />

                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Phương thức thanh toán</h1>
                        <p className={styles.subtitle}>Quản lý tài khoản nhận tiền của bạn</p>
                    </div>
                    <button
                        className={styles.addButton}
                        onClick={() => setShowAddModal(true)}
                    >
                        <PlusOutlined /> Thêm mới
                    </button>
                </div>

                {loading ? (
                    <div className={styles.loading}>Đang tải...</div>
                ) : paymentMethods.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIconWrapper}>
                            <BankOutlined className={styles.emptyIcon} />
                        </div>
                        <h3 className={styles.emptyTitle}>Chưa có phương thức thanh toán</h3>
                        <p className={styles.emptyDesc}>Thêm tài khoản ngân hàng hoặc ví điện tử để bắt đầu giao dịch P2P</p>
                        <button
                            className={styles.primaryButton}
                            onClick={() => setShowAddModal(true)}
                        >
                            <PlusOutlined /> Thêm phương thức ngay
                        </button>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {paymentMethods.map(method => (
                            <div key={method.id} className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div
                                        className={styles.methodIcon}
                                        style={{ background: `${getMethodColor(method.type)}20`, color: getMethodColor(method.type) }}
                                    >
                                        {getMethodIcon(method.type)}
                                    </div>
                                    <div className={styles.methodType}>
                                        {getMethodName(method.type)}
                                    </div>
                                    <div className={styles.cardActions}>
                                        <button
                                            className={styles.iconButton}
                                            onClick={() => setEditingMethod(method)}
                                        >
                                            <EditOutlined />
                                        </button>
                                        <button
                                            className={`${styles.iconButton} ${styles.deleteAction}`}
                                            onClick={() => handleDeleteMethod(method.id)}
                                        >
                                            <DeleteOutlined />
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.cardBody}>
                                    <div className={styles.infoGroup}>
                                        <label>Tên chủ tài khoản</label>
                                        <div className={styles.infoValue}>{method.accountName}</div>
                                    </div>
                                    <div className={styles.infoGroup}>
                                        <label>{method.type === 'BANK_TRANSFER' ? 'Số tài khoản' : 'Số điện thoại'}</label>
                                        <div className={styles.infoValue}>{method.accountNumber}</div>
                                    </div>
                                    {method.bankName && (
                                        <div className={styles.infoGroup}>
                                            <label>Ngân hàng</label>
                                            <div className={styles.infoValue}>{method.bankName}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {(showAddModal || editingMethod) && (
                    <PaymentMethodModal
                        method={editingMethod}
                        onSave={editingMethod ? handleEditMethod : handleAddMethod}
                        onClose={() => {
                            setShowAddModal(false);
                            setEditingMethod(null);
                        }}
                    />
                )}
            </div>
        </ProtectedRoute>
    );
}

interface PaymentMethodModalProps {
    method: PaymentMethod | null;
    onSave: (method: any) => void;
    onClose: () => void;
}

function PaymentMethodModal({ method, onSave, onClose }: PaymentMethodModalProps) {
    const [type, setType] = useState<PaymentMethodType>((method?.type as PaymentMethodType) || 'BANK_TRANSFER');
    const [accountName, setAccountName] = useState(method?.accountName || '');
    const [accountNumber, setAccountNumber] = useState(method?.accountNumber || '');
    const [bankName, setBankName] = useState(method?.bankName || '');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const newMethod = {
                ...(method && { id: method.id }),
                type,
                accountName,
                accountNumber,
                ...(type === 'BANK_TRANSFER' && { bankName })
            };
            await onSave(newMethod);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>{method ? 'Chỉnh sửa' : 'Thêm'} phương thức thanh toán</h2>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Loại phương thức</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as PaymentMethodType)}
                            className={styles.select}
                        >
                            <option value="BANK_TRANSFER">Chuyển khoản ngân hàng</option>
                            <option value="MOMO">Momo</option>
                            <option value="ZALOPAY">ZaloPay</option>
                            <option value="VIETTEL_PAY">ViettelPay</option>
                        </select>
                    </div>

                    {type === 'BANK_TRANSFER' && (
                        <div className={styles.formGroup}>
                            <label>Tên ngân hàng</label>
                            <select
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                className={styles.select}
                                required
                            >
                                <option value="">Chọn ngân hàng</option>
                                {PaymentMethodService.getVietnameseBanks().map(bank => (
                                    <option key={bank.code} value={bank.shortName}>
                                        {bank.shortName} - {bank.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label>Tên chủ tài khoản</label>
                        <input
                            type="text"
                            value={accountName}
                            onChange={(e) => setAccountName(e.target.value)}
                            placeholder="Họ và tên in hoa không dấu"
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>{type === 'BANK_TRANSFER' ? 'Số tài khoản' : 'Số điện thoại'}</label>
                        <input
                            type="text"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            placeholder="Nhập số tài khoản/SĐT"
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.modalActions}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>Hủy</button>
                        <button type="submit" className={styles.submitBtn} disabled={submitting}>
                            {submitting ? 'Đang xử lý...' : (method ? 'Lưu thay đổi' : 'Thêm mới')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
