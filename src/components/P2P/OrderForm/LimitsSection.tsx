import styles from './LimitsSection.module.css';

interface LimitsSectionProps {
    minLimit: string;
    maxLimit: string;
    fiatCurrency: string;
    onMinLimitChange: (value: string) => void;
    onMaxLimitChange: (value: string) => void;
}

export default function LimitsSection({
    minLimit,
    maxLimit,
    fiatCurrency,
    onMinLimitChange,
    onMaxLimitChange
}: LimitsSectionProps) {
    return (
        <div className={styles.container}>
            <label className={styles.label}>Giới hạn giao dịch</label>
            <div className={styles.row}>
                <div className={styles.field}>
                    <label className={styles.fieldLabel}>Tối thiểu</label>
                    <div className={styles.inputGroup}>
                        <input
                            type="number"
                            className={styles.input}
                            placeholder="0"
                            value={minLimit}
                            onChange={(e) => onMinLimitChange(e.target.value)}
                            required
                        />
                        <span className={styles.suffix}>{fiatCurrency}</span>
                    </div>
                </div>
                <div className={styles.field}>
                    <label className={styles.fieldLabel}>Tối đa</label>
                    <div className={styles.inputGroup}>
                        <input
                            type="number"
                            className={styles.input}
                            placeholder="0"
                            value={maxLimit}
                            onChange={(e) => onMaxLimitChange(e.target.value)}
                            required
                        />
                        <span className={styles.suffix}>{fiatCurrency}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
