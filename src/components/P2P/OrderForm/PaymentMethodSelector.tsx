import styles from './PaymentMethodSelector.module.css';

interface PaymentMethodSelectorProps {
    selectedTypes: string[];
    onToggle: (type: string) => void;
    currency: string;
}

const PAYMENT_TYPES = [
    { type: 'bank_transfer', name: 'Chuyển khoản ngân hàng' },
    { type: 'momo', name: 'Momo' },
    { type: 'zalopay', name: 'ZaloPay' },
    { type: 'viettel_pay', name: 'ViettelPay' },
    { type: 'vnpay', name: 'VNPay' },
    { type: 'shopee_pay', name: 'ShopeePay' }
];

export default function PaymentMethodSelector({
    selectedTypes,
    onToggle,
    currency
}: PaymentMethodSelectorProps) {
    return (
        <div className={styles.container}>
            <label className={styles.label}>
                Phương thức thanh toán
                <span className={styles.required}>*</span>
            </label>
            <div className={styles.grid}>
                {PAYMENT_TYPES.map(({ type, name }) => (
                    <label
                        key={type}
                        className={`${styles.option} ${selectedTypes.includes(type) ? styles.active : ''}`}
                    >
                        <input
                            type="checkbox"
                            checked={selectedTypes.includes(type)}
                            onChange={() => onToggle(type)}
                            className={styles.checkbox}
                        />
                        <div className={styles.details}>
                            <div className={styles.name}>{name}</div>
                        </div>
                    </label>
                ))}
            </div>
            <div className={styles.hint}>
                Chọn các phương thức thanh toán mà bạn chấp nhận khi mua {currency}
            </div>
        </div>
    );
}
