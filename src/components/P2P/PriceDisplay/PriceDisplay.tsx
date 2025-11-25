import styles from './PriceDisplay.module.css';

interface PriceDisplayProps {
    amount: number;
    currency: string;
    highlight?: boolean;
    size?: 'small' | 'medium' | 'large';
}

export default function PriceDisplay({ amount, currency, highlight = false, size = 'medium' }: PriceDisplayProps) {
    const formatAmount = (num: number) => {
        return new Intl.NumberFormat('vi-VN').format(num);
    };

    return (
        <div className={`${styles.price} ${highlight ? styles.highlight : ''} ${styles[size]}`}>
            <span className={styles.amount}>{formatAmount(amount)}</span>
            <span className={styles.currency}>{currency}</span>
        </div>
    );
}
