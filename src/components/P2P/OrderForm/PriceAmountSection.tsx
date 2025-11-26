import styles from './PriceAmountSection.module.css';

interface PriceAmountSectionProps {
    price: string;
    amount: string;
    currency: string;
    fiatCurrency: string;
    onPriceChange: (price: string) => void;
    onAmountChange: (amount: string) => void;
}

export default function PriceAmountSection({
    price,
    amount,
    currency,
    fiatCurrency,
    onPriceChange,
    onAmountChange
}: PriceAmountSectionProps) {
    return (
        <div className={styles.container}>
            <label className={styles.label}>Giá và số lượng</label>
            <div className={styles.row}>
                <div className={styles.field}>
                    <label className={styles.fieldLabel}>Đơn giá</label>
                    <div className={styles.inputGroup}>
                        <input
                            type="number"
                            className={styles.input}
                            placeholder="0.00"
                            value={price}
                            onChange={(e) => onPriceChange(e.target.value)}
                            required
                        />
                        <span className={styles.suffix}>{fiatCurrency}</span>
                    </div>
                </div>
                <div className={styles.field}>
                    <label className={styles.fieldLabel}>Số lượng</label>
                    <div className={styles.inputGroup}>
                        <input
                            type="number"
                            className={styles.input}
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => onAmountChange(e.target.value)}
                            required
                        />
                        <span className={styles.suffix}>{currency}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
