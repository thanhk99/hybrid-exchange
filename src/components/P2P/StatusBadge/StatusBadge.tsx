import { OrderStatus, TradeStatus } from '@/src/types/p2p';
import styles from './StatusBadge.module.css';

interface StatusBadgeProps {
    status: OrderStatus | TradeStatus;
    size?: 'small' | 'medium';
}

export default function StatusBadge({ status, size = 'medium' }: StatusBadgeProps) {
    const getStatusText = () => {
        const statusMap: Record<string, string> = {
            // Frontend status
            active: 'Đang hoạt động',
            completed: 'Hoàn thành',
            cancelled: 'Đã hủy',
            pending: 'Chờ thanh toán',
            paid: 'Đã thanh toán',
            confirmed: 'Đã xác nhận',
            disputed: 'Tranh chấp',
            // Backend enum status (UPPERCASE)
            ORDER_PLACED: 'Đã đặt lệnh',
            AWAITING_PAYMENT: 'Chờ thanh toán',
            PAYMENT_SENT: 'Đã thanh toán',
            AWAITING_RELEASE: 'Chờ giải phóng',
            COMPLETED: 'Hoàn thành',
            CANCELLED: 'Đã hủy',
            DISPUTE_OPENED: 'Tranh chấp',
            // Backend enum status (lowercase snake_case - actual API format)
            order_placed: 'Đã đặt lệnh',
            awaiting_payment: 'Chờ thanh toán',
            payment_sent: 'Đã thanh toán',
            awaiting_release: 'Chờ giải phóng',
            dispute_opened: 'Tranh chấp'
        };
        return statusMap[status] || status;
    };

    const getStatusColor = () => {
        if (status === 'active' || status === 'pending' || status === 'ORDER_PLACED' || status === 'AWAITING_PAYMENT' || status === 'order_placed' || status === 'awaiting_payment') return 'warning';
        if (status === 'completed' || status === 'confirmed' || status === 'COMPLETED') return 'success';
        if (status === 'cancelled' || status === 'disputed' || status === 'CANCELLED' || status === 'DISPUTE_OPENED' || status === 'dispute_opened') return 'error';
        if (status === 'paid' || status === 'PAYMENT_SENT' || status === 'AWAITING_RELEASE' || status === 'payment_sent' || status === 'awaiting_release') return 'info';
        return 'default';
    };

    return (
        <span className={`${styles.badge} ${styles[getStatusColor()]} ${styles[size]}`}>
            {getStatusText()}
        </span>
    );
}
