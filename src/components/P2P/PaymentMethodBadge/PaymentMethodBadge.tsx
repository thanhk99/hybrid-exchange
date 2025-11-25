import { PaymentMethod } from '@/src/types/p2p';
import styles from './PaymentMethodBadge.module.css';

interface PaymentMethodBadgeProps {
    method: PaymentMethod;
    size?: 'small' | 'medium' | 'large';
}

export default function PaymentMethodBadge({ method, size = 'medium' }: PaymentMethodBadgeProps) {
    return (
        <div className={`${styles.badge} ${styles[size]}`}>
            <span className={styles.name}>{method.name}</span>
        </div>
    );
}
