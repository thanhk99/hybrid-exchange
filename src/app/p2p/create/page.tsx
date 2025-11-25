'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftOutlined, InfoCircleOutlined } from '@ant-design/icons';
import P2PHeader from '@/src/components/P2P/P2PHeader/P2PHeader';
import CurrencySelector from '@/src/components/P2P/CurrencySelector/CurrencySelector';
import PaymentMethodBadge from '@/src/components/P2P/PaymentMethodBadge/PaymentMethodBadge';
import { OrderType, PaymentMethod } from '@/src/types/p2p';
import P2PService from '@/src/services/p2p';
import styles from './page.module.css';

export default function CreateP2POrder() {
    const router = useRouter();
    const [orderType, setOrderType] = useState<OrderType>('sell');
    const [currency, setCurrency] = useState('USDT');
    const [fiatCurrency, setFiatCurrency] = useState('VND');
    const [price, setPrice] = useState('');
    const [amount, setAmount] = useState('');
    const [minLimit, setMinLimit] = useState('');
    const [maxLimit, setMaxLimit] = useState('');
    const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<PaymentMethod[]>([]);
    const [terms, setTerms] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currencies = ['USDT', 'BTC', 'ETH', 'BNB'];
    const fiatCurrencies = ['VND'];
    const paymentMethods = P2PService.getPaymentMethods();

    const togglePaymentMethod = (method: PaymentMethod) => {
        setSelectedPaymentMethods(prev =>
            prev.find(m => m.id === method.id)
                ? prev.filter(m => m.id !== method.id)
                : [...prev, method]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedPaymentMethods.length === 0) {
            alert('Vui lòng chọn ít nhất một phương thức thanh toán');
            return;
        }

        // Validate amounts
        const priceNum = parseFloat(price);
        const amountNum = parseFloat(amount);
        const minLimitNum = parseFloat(minLimit);
        const maxLimitNum = parseFloat(maxLimit);

        if (minLimitNum > maxLimitNum) {
            alert('Giới hạn tối thiểu không được lớn hơn giới hạn tối đa');
            return;
        }

        if (orderType === 'sell' && amountNum <= 0) {
            alert('Số lượng phải lớn hơn 0');
            return;
        }

        setIsSubmitting(true);
        try {
            await P2PService.createOrder({
                type: orderType,
                currency,
                fiatCurrency,
                price: priceNum,
                availableAmount: amountNum,
                minLimit: minLimitNum,
                maxLimit: maxLimitNum,
                paymentMethods: selectedPaymentMethods,
                terms
            });

            alert('Tạo quảng cáo thành công!');
            router.push('/p2p');
        } catch (error: any) {
            console.error('Failed to create order:', error);

            let errorMsg = 'Tạo quảng cáo thất bại';

            if (error.message.includes('409') || error.message.includes('trùng lập')) {
                errorMsg = 'Quảng cáo này bị trùng lặp. Vui lòng thay đổi giá hoặc phương thức thanh toán.';
            } else if (error.message.includes('không đủ') || error.message.includes('balance')) {
                errorMsg = 'Số dư trong ví Funding của bạn không đủ. Vui lòng nạp thêm tiền.';
            } else if (error.message.includes('không có loại tiền')) {
                errorMsg = `Ví Funding của bạn không có ${currency}. Vui lòng nạp tiền trước.`;
            } else if (error.message.includes('403') || error.message.includes('quyền')) {
                errorMsg = 'Bạn không có quyền tạo quảng cáo. Vui lòng đăng nhập lại hoặc liên hệ hỗ trợ.';
            } else if (error.message) {
                errorMsg = error.message;
            }

            alert(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <P2PHeader
                title="Tạo quảng cáo P2P"
                subtitle="Đăng quảng cáo mua hoặc bán tiền điện tử"
                actions={
                    <button
                        className={styles.backButton}
                        onClick={() => router.push('/p2p')}
                    >
                        <ArrowLeftOutlined /> Quay lại
                    </button>
                }
            />

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.card}>
                    {/* Order Type */}
                    <div className={styles.section}>
                        <label className={styles.sectionLabel}>Loại quảng cáo</label>
                        <div className={styles.typeButtons}>
                            <button
                                type="button"
                                className={`${styles.typeButton} ${orderType === 'buy' ? styles.typeButtonActive : ''}`}
                                onClick={() => setOrderType('buy')}
                            >
                                Mua
                            </button>
                            <button
                                type="button"
                                className={`${styles.typeButton} ${orderType === 'sell' ? styles.typeButtonActive : ''}`}
                                onClick={() => setOrderType('sell')}
                            >
                                Bán
                            </button>
                        </div>
                    </div>

                    {/* Currency Selection */}
                    <div className={styles.section}>
                        <label className={styles.sectionLabel}>Tiền điện tử</label>
                        <div className={styles.row}>
                            <CurrencySelector
                                value={currency}
                                onChange={setCurrency}
                                currencies={currencies}
                                label="Tiền điện tử"
                            />
                            <CurrencySelector
                                value={fiatCurrency}
                                onChange={setFiatCurrency}
                                currencies={fiatCurrencies}
                                label="Tiền tệ"
                            />
                        </div>
                    </div>

                    {/* Price & Amount */}
                    <div className={styles.section}>
                        <label className={styles.sectionLabel}>Giá và số lượng</label>
                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label className={styles.label}>Đơn giá</label>
                                <div className={styles.inputGroup}>
                                    <input
                                        type="number"
                                        className={styles.input}
                                        placeholder="0.00"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                    />
                                    <span className={styles.inputSuffix}>{fiatCurrency}</span>
                                </div>
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>Số lượng</label>
                                <div className={styles.inputGroup}>
                                    <input
                                        type="number"
                                        className={styles.input}
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                    />
                                    <span className={styles.inputSuffix}>{currency}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Limits */}
                    <div className={styles.section}>
                        <label className={styles.sectionLabel}>Giới hạn giao dịch</label>
                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label className={styles.label}>Tối thiểu</label>
                                <div className={styles.inputGroup}>
                                    <input
                                        type="number"
                                        className={styles.input}
                                        placeholder="0.00"
                                        value={minLimit}
                                        onChange={(e) => setMinLimit(e.target.value)}
                                        required
                                    />
                                    <span className={styles.inputSuffix}>{fiatCurrency}</span>
                                </div>
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>Tối đa</label>
                                <div className={styles.inputGroup}>
                                    <input
                                        type="number"
                                        className={styles.input}
                                        placeholder="0.00"
                                        value={maxLimit}
                                        onChange={(e) => setMaxLimit(e.target.value)}
                                        required
                                    />
                                    <span className={styles.inputSuffix}>{fiatCurrency}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className={styles.section}>
                        <label className={styles.sectionLabel}>
                            Phương thức thanh toán
                            <span className={styles.required}>*</span>
                        </label>
                        <div className={styles.paymentGrid}>
                            {paymentMethods.map(method => (
                                <label
                                    key={method.id}
                                    className={`${styles.paymentOption} ${selectedPaymentMethods.find(m => m.id === method.id)
                                            ? styles.paymentOptionActive
                                            : ''
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={!!selectedPaymentMethods.find(m => m.id === method.id)}
                                        onChange={() => togglePaymentMethod(method)}
                                        className={styles.checkbox}
                                    />
                                    <PaymentMethodBadge method={method} size="small" />
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Terms */}
                    <div className={styles.section}>
                        <label className={styles.sectionLabel}>Điều khoản (Tùy chọn)</label>
                        <textarea
                            className={styles.textarea}
                            placeholder="Nhập điều khoản giao dịch của bạn..."
                            value={terms}
                            onChange={(e) => setTerms(e.target.value)}
                            rows={4}
                        />
                    </div>

                    {/* Info Box */}
                    <div className={styles.infoBox}>
                        <InfoCircleOutlined className={styles.infoIcon} />
                        <div className={styles.infoText}>
                            <p><strong>Lưu ý:</strong></p>
                            <ul>
                                <li>Quảng cáo sẽ được hiển thị công khai sau khi tạo</li>
                                <li>Bạn có thể chỉnh sửa hoặc xóa quảng cáo bất kỳ lúc nào</li>
                                <li>Đảm bảo bạn có đủ số dư để thực hiện giao dịch</li>
                            </ul>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Đang tạo...' : 'Tạo quảng cáo'}
                    </button>
                </div>
            </form>
        </div>
    );
}
