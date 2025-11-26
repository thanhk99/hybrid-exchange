import { OrderType } from '@/src/types/p2p';
import styles from './OrderTypeSelector.module.css';

interface OrderTypeSelectorProps {
    value: OrderType;
    onChange: (type: OrderType) => void;
}

export default function OrderTypeSelector({ value, onChange }: OrderTypeSelectorProps) {
    return (
        <div className={styles.container}>
            <label className={styles.label}>Loại quảng cáo</label>
            <div className={styles.buttons}>
                <button
                    type="button"
                    className={`${styles.button} ${value === 'buy' ? styles.active : ''}`}
                    onClick={() => onChange('buy')}
                >
                    Mua
                </button>
                <button
                    type="button"
                    className={`${styles.button} ${value === 'sell' ? styles.active : ''}`}
                    onClick={() => onChange('sell')}
                >
                    Bán
                </button>
            </div>
        </div>
    );
}
