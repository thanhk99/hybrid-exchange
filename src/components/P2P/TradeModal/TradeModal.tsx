'use client';

import { useState, useEffect } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { P2POrder, PaymentMethod } from '@/src/types/p2p';
import PaymentMethodBadge from '../PaymentMethodBadge/PaymentMethodBadge';
import PaymentMethodService from '@/src/services/paymentMethod';
import styles from './TradeModal.module.css';

interface TradeModalProps {
    order: P2POrder;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (amount: number, paymentMethodId: string) => void;
}

export default function TradeModal({ order, isOpen, onClose, onConfirm }: TradeModalProps) {
    const [fiatAmount, setFiatAmount] = useState('');
    const [cryptoAmount, setCryptoAmount] = useState('0.00');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(
        order.paymentMethods && order.paymentMethods.length > 0 ? order.paymentMethods[0] : null
    );
    const [myPaymentMethods, setMyPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isLoadingMethods, setIsLoadingMethods] = useState(false);
    const [error, setError] = useState('');

    const isBuying = order.type === 'sell'; // User is buying if order is sell type

    useEffect(() => {
        console.log('TradeModal - Order changed:', order);

        if (isBuying) {
            // BUYING: Select from Maker's payment methods
            if (order.paymentMethods && order.paymentMethods.length > 0) {
                const currentMethodStillValid = selectedPaymentMethod && order.paymentMethods.find(pm => pm.id === selectedPaymentMethod.id);
                if (!currentMethodStillValid) {
                    setSelectedPaymentMethod(order.paymentMethods[0]);
                }
            } else {
                setSelectedPaymentMethod(null);
            }
        } else {
            // SELLING: Fetch my payment methods
            if (isOpen) {
                setIsLoadingMethods(true);
                PaymentMethodService.getPaymentMethods()
                    .then(methods => {
                        console.log('Fetched my payment methods:', methods);
                        setMyPaymentMethods(methods);

                        // Filter methods that match order's accepted types
                        const validMethods = methods.filter(myPm =>
                            order.paymentMethods.some(orderPm => orderPm.type === myPm.type)
                        );

                        // Auto-select first available account if not set
                        if (validMethods.length > 0) {
                            setSelectedPaymentMethod(validMethods[0]);
                        } else {
                            setSelectedPaymentMethod(null);
                        }
                    })
                    .catch(err => console.error('Failed to fetch payment methods', err))
                    .finally(() => setIsLoadingMethods(false));
            }
        }
    }, [order, isOpen, isBuying]);

    useEffect(() => {
        if (fiatAmount) {
            const amount = parseFloat(fiatAmount);
            if (!isNaN(amount)) {
                const crypto = amount / order.price;
                setCryptoAmount(crypto.toFixed(8));

                // Validate amount
                if (amount < order.minLimit) {
                    setError(`Số tiền tối thiểu: ${order.minLimit.toLocaleString('vi-VN')} ${order.fiatCurrency}`);
                } else if (amount > order.maxLimit) {
                    setError(`Số tiền tối đa: ${order.maxLimit.toLocaleString('vi-VN')} ${order.fiatCurrency}`);
                } else if (crypto > order.availableAmount) {
                    setError(`Số lượng ${order.currency} không đủ`);
                } else {
                    setError('');
                }
            }
        } else {
            setCryptoAmount('0.00');
            setError('');
        }
    }, [fiatAmount, order]);

    const handleConfirm = () => {
        const amount = parseFloat(fiatAmount);
        const crypto = parseFloat(cryptoAmount);

        if (!amount || isNaN(amount)) {
            setError('Vui lòng nhập số tiền');
            return;
        }

        if (!selectedPaymentMethod) {
            setError('Vui lòng chọn phương thức thanh toán');
            return;
        }

        if (error) {
            return;
        }

        // Send crypto amount to server as requested
        onConfirm(crypto, selectedPaymentMethod.id);
    };

    if (!isOpen) return null;



    // Filter valid methods for display when selling
    const validMyMethods = !isBuying ? myPaymentMethods.filter(myPm =>
        order.paymentMethods.some(orderPm => orderPm.type === myPm.type)
    ) : [];

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <div className={styles.merchantName}>
                            {isBuying ? `Mua ${order.currency} từ ${order.merchantName}` : `Bán ${order.currency} cho ${order.merchantName}`}
                        </div>
                        <div className={styles.verified}>✓ ID đã xác minh</div>
                    </div>
                    <button className={styles.closeButton} onClick={onClose}>
                        <CloseOutlined />
                    </button>
                </div>

                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <div className={styles.statLabel}>Các lệnh đã hoàn tất</div>
                        <div className={styles.statValue}>{order.merchantCompletedTrades.toLocaleString('vi-VN')}</div>
                    </div>
                    <div className={styles.stat}>
                        <div className={styles.statLabel}>Tỷ lệ hoàn tất</div>
                        <div className={styles.statValue}>{order.merchantCompletionRate.toFixed(2)}%</div>
                    </div>
                    <div className={styles.stat}>
                        <div className={styles.statLabel}>Cửa số thanh toán</div>
                        <div className={styles.statValue}>10 phút</div>
                    </div>
                    <div className={styles.stat}>
                        <div className={styles.statLabel}>Tên</div>
                        <div className={styles.statValue}>V**</div>
                    </div>
                </div>

                <div className={styles.terms}>
                    <div className={styles.termsTitle}>Điều khoản giao dịch</div>
                    <div className={styles.termsContent}>
                        {order.terms || 'Hãy đảm bảo tên bạn trong tài khoản thanh toán giống với tên tài khoản OKX của bạn. Bạn có thể liên hệ với tôi nếu gặp bất kỳ sự cố nào trước khi đưa ra khiếu nại. Khi ...'}
                        {order.terms && order.terms.length > 100 && (
                            <span className={styles.readMore}> Hiển thị thêm</span>
                        )}
                    </div>
                </div>

                <div className={styles.form}>
                    <div className={styles.field}>
                        <label className={styles.label}>
                            {isBuying ? 'Bạn thanh toán (VND)' : 'Bạn nhận được (VND)'}
                        </label>
                        <div className={styles.inputGroup}>
                            <input
                                type="number"
                                className={styles.input}
                                placeholder="0,00"
                                value={fiatAmount}
                                onChange={(e) => setFiatAmount(e.target.value)}
                                step="0.01"
                            />
                            <span className={styles.currency}>{order.fiatCurrency}</span>
                        </div>
                        <div className={styles.hint}>
                            Giới hạn lệnh: {order.minLimit.toLocaleString('vi-VN')} - {order.maxLimit.toLocaleString('vi-VN')} {order.fiatCurrency}
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>
                            {isBuying ? 'Bạn nhận (Crypto)' : 'Bạn bán (Crypto)'}
                        </label>
                        <div className={styles.inputGroup}>
                            <input
                                type="text"
                                className={styles.input}
                                value={cryptoAmount}
                                readOnly
                            />
                            <span className={styles.currency}>{order.currency}</span>
                        </div>
                        <div className={styles.hint}>
                            {parseFloat(cryptoAmount).toFixed(2)} {order.currency} khả dụng
                        </div>
                    </div>

                    {/* Payment Methods Selection */}
                    <div className={styles.field}>
                        <label className={styles.label}>
                            {isBuying ? 'Phương thức thanh toán của người bán' : 'Nhận tiền qua tài khoản'}
                        </label>

                        {!isBuying && (
                            <div className={styles.sellerSelection}>
                                <label className={styles.subLabel}>Chọn tài khoản nhận tiền của bạn</label>
                                <div className={styles.paymentMethods}>
                                    {isLoadingMethods ? (
                                        <div className={styles.loadingText}>Đang tải...</div>
                                    ) : validMyMethods.length > 0 ? (
                                        validMyMethods.map((method) => (
                                            <button
                                                key={method.id}
                                                type="button"
                                                className={`${styles.paymentMethod} ${selectedPaymentMethod?.id === method.id ? styles.paymentMethodActive : ''}`}
                                                onClick={() => setSelectedPaymentMethod(method)}
                                            >
                                                <div className={styles.accountInfo}>
                                                    <div className={styles.bankName}>{method.bankName || method.name}</div>
                                                    <div className={styles.accountNumber}>{method.accountNumber}</div>
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className={styles.error}>
                                            Bạn chưa có tài khoản phù hợp với quảng cáo này.
                                            (Người mua chấp nhận: {order.paymentMethods.map(pm => pm.name).join(', ')})
                                            Vui lòng thêm mới trong Profile.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className={styles.error}>{error}</div>
                    )}

                    <div className={styles.notice}>
                        Một số phương thức thanh toán nhất định có thể áp dụng phí và có các điều kiện gốc khác nhau theo quy định của nhà cung cấp dịch vụ thanh toán. Ngoài ra còn có các rủi ro năng độc khác để hiện qua <span className={styles.link}>nhận</span>.
                    </div>

                    <button
                        className={styles.confirmButton}
                        onClick={handleConfirm}
                        disabled={!!error || !fiatAmount || !selectedPaymentMethod}
                    >
                        {isBuying ? 'Mua' : 'Bán'} {order.currency} với mức phí bằng 0
                    </button>
                </div>
            </div>
        </div>
    );

}
