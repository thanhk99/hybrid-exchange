import { OrderStatus, TradeStatus } from '@/src/types/p2p';
import styles from './StatusBadge.module.css';

interface StatusBadgeProps {
    status: OrderStatus | TradeStatus;
    size?: 'small' | 'medium';
}

export default function StatusBadge({ status, size = 'medium' }: StatusBadgeProps) {
    const getStatusText = () => {
        const statusMap: Record<string, string> = {
            active: 'Đang hoạt động',
            completed: 'Hoàn thành',
            cancelled: 'Đã hủy',
            pending: 'Chờ thanh toán',
            paid: 'Đã thanh toán',
            confirmed: 'Đã xác nhận',
            disputed: 'Tranh chấp'
        };
        return statusMap[status] || status;
    };

    const getStatusColor = () => {
        if (status === 'active' || status === 'pending') return 'warning';
        if (status === 'completed' || status === 'confirmed') return 'success';
        if (status === 'cancelled' || status === 'disputed') return 'error';
        if (status === 'paid') return 'info';
        return 'default';
    };

    return (
        <span className={`${styles.badge} ${styles[getStatusColor()]} ${styles[size]}`}>
            {getStatusText()}
        </span>
    );
}
