'use client';

import { useState, useEffect } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined, BankOutlined, WalletOutlined, MobileOutlined, CreditCardOutlined } from '@ant-design/icons';
import { PaymentMethod } from '@/src/types/p2p';
import styles from './page.module.css';

export default function PaymentMethodsPage() {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);

    useEffect(() => {
        loadPaymentMethods();
    }, []);

    const loadPaymentMethods = async () => {
        const saved = localStorage.getItem('userPaymentMethods');
        if (saved) {
            setPaymentMethods(JSON.parse(saved));
        }
    };

    const savePaymentMethods = (methods: PaymentMethod[]) => {
        localStorage.setItem('userPaymentMethods', JSON.stringify(methods));
        setPaymentMethods(methods);
    };

    const handleAddMethod = (method: PaymentMethod) => {
        const newMethods = [...paymentMethods, { ...method, id: `pm_${Date.now()}` }];
        savePaymentMethods(newMethods);
        setShowAddModal(false);
    };

    const handleEditMethod = (method: PaymentMethod) => {
        const newMethods = paymentMethods.map(pm => pm.id === method.id ? method : pm);
        savePaymentMethods(newMethods);
        setEditingMethod(null);
    };

    const handleDeleteMethod = (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa phương thức thanh toán này?')) return;
        const newMethods = paymentMethods.filter(pm => pm.id !== id);
        savePaymentMethods(newMethods);
    };

    const getMethodIcon = (type: string) => {
        switch (type) {
            case 'bank_transfer': return <BankOutlined />;
            case 'momo': return <WalletOutlined />;
            case 'zalopay': return <MobileOutlined />;
            case 'viettel_pay': return <MobileOutlined />;
            default: return <CreditCardOutlined />;
        }
    };

    const getMethodColor = (type: string) => {
        switch (type) {
            case 'bank_transfer': return '#3b82f6'; // Blue
            case 'momo': return '#ec4899'; // Pink
            case 'zalopay': return '#0ea5e9'; // Sky
            case 'viettel_pay': return '#ef4444'; // Red
            default: return '#64748b';
        }
    };

    const getMethodName = (type: string) => {
        const names: Record<string, string> = {
            'bank_transfer': 'Chuyển khoản ngân hàng',
            'momo': 'Momo',
            'zalopay': 'ZaloPay',
            'viettel_pay': 'ViettelPay'
        };
        return names[type] || type;
    };

    return (
        <div className={styles.container}>
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

            {paymentMethods.length === 0 ? (
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
                                    <label>{method.type === 'bank_transfer' ? 'Số tài khoản' : 'Số điện thoại'}</label>
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
    );
}

interface PaymentMethodModalProps {
    method: PaymentMethod | null;
    onSave: (method: PaymentMethod) => void;
    onClose: () => void;
}

function PaymentMethodModal({ method, onSave, onClose }: PaymentMethodModalProps) {
    const [type, setType] = useState<'bank_transfer' | 'momo' | 'zalopay' | 'viettel_pay'>(method?.type || 'bank_transfer');
    const [accountName, setAccountName] = useState(method?.accountName || '');
    const [accountNumber, setAccountNumber] = useState(method?.accountNumber || '');
    const [bankName, setBankName] = useState(method?.bankName || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newMethod: PaymentMethod = {
            id: method?.id || '',
            type: type as any,
            name: '', // Will be set by helper
            icon: '', // Will be set by helper
            accountName,
            accountNumber,
            ...(type === 'bank_transfer' && { bankName })
        };
        onSave(newMethod);
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
                            onChange={(e) => setType(e.target.value as 'bank_transfer' | 'momo' | 'zalopay' | 'viettel_pay')}
                            className={styles.select}
                        >
                            <option value="bank_transfer">Chuyển khoản ngân hàng</option>
                            <option value="momo">Momo</option>
                            <option value="zalopay">ZaloPay</option>
                            <option value="viettel_pay">ViettelPay</option>
                        </select>
                    </div>

                    {type === 'bank_transfer' && (
                        <div className={styles.formGroup}>
                            <label>Tên ngân hàng</label>
                            <input
                                type="text"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                placeholder="VD: Vietcombank"
                                className={styles.input}
                                required
                            />
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
                        <label>{type === 'bank_transfer' ? 'Số tài khoản' : 'Số điện thoại'}</label>
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
                        <button type="submit" className={styles.submitBtn}>
                            {method ? 'Lưu thay đổi' : 'Thêm mới'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
