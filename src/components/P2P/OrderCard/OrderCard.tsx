import { P2POrder } from '@/src/types/p2p';
import UserRating from '../UserRating/UserRating';
import PaymentMethodBadge from '../PaymentMethodBadge/PaymentMethodBadge';
import PriceDisplay from '../PriceDisplay/PriceDisplay';
import styles from './OrderCard.module.css';

interface OrderCardProps {
    order: P2POrder;
    onTrade: (orderId: string) => void;
}

export default function OrderCard({ order, onTrade }: OrderCardProps) {
    const formatAmount = (num: number) => {
        return new Intl.NumberFormat('vi-VN').format(num);
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.merchant}>
                    <span className={styles.merchantName}>{order.merchantName}</span>
                    <UserRating
                        rating={order.merchantRating}
                        completedTrades={order.merchantCompletedTrades}
                        completionRate={order.merchantCompletionRate}
                        size="small"
                    />
                </div>
            </div>

            <div className={styles.body}>
                <div className={styles.priceSection}>
                    <div className={styles.priceLabel}>Giá</div>
                    <PriceDisplay
                        amount={order.price}
                        currency={order.fiatCurrency}
                        highlight
                        size="large"
                    />
                </div>

                <div className={styles.details}>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Số lượng</span>
                        <span className={styles.detailValue}>
                            {formatAmount(order.availableAmount)} {order.currency}
                        </span>
                    </div>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Giới hạn</span>
                        <span className={styles.detailValue}>
                            {formatAmount(order.minLimit)} - {formatAmount(order.maxLimit)} {order.fiatCurrency}
                        </span>
                    </div>
                </div>

                <div className={styles.paymentMethods}>
                    {order.paymentMethods.slice(0, 3).map(method => (
                        <PaymentMethodBadge key={method.id} method={method} size="small" />
                    ))}
                    {order.paymentMethods.length > 3 && (
                        <span className={styles.morePayments}>+{order.paymentMethods.length - 3}</span>
                    )}
                </div>
            </div>

            <div className={styles.footer}>
                <button
                    className={styles.tradeButton}
                    onClick={() => onTrade(order.id)}
                >
                    {order.type === 'buy' ? 'Bán' : 'Mua'} {order.currency}
                </button>
            </div>
        </div>
    );
}
