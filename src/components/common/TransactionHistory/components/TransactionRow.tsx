import React from 'react';
import { Transaction } from '@/src/services/wallet';

interface TransactionRowProps {
    transaction: Transaction;
    styles: any;
}

export default function TransactionRow({ transaction, styles }: TransactionRowProps) {
    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'deposit':
                return 'Nạp tiền';
            case 'withdraw':
                return 'Rút tiền';
            case 'transfer':
                return 'Chuyển tiền';
            default:
                return 'Giao dịch';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'completed':
                return 'Hoàn thành';
            case 'pending':
                return 'Đang xử lý';
            case 'failed':
                return 'Thất bại';
            default:
                return status;
        }
    };

    const getStatusClass = (status: string) => {
        const baseClass = styles.status;
        const statusClass = styles[`status${status.charAt(0).toUpperCase() + status.slice(1)}`];
        return `${baseClass} ${statusClass}`;
    };

    return (
        <div className={styles.historyRow}>
            <div className={styles.historyInfo}>
                <div className={styles.historyType}>
                    {getTypeLabel(transaction.type)}
                </div>
                <div className={styles.historyDetails}>
                    {transaction.recipient && <span>Đến: {transaction.recipient}</span>}
                    {transaction.address && <span>Địa chỉ: {transaction.address}</span>}
                    {transaction.network && <span>• {transaction.network}</span>}
                </div>
                <div className={styles.historyDate}>
                    {new Date(transaction.date).toLocaleString('vi-VN')}
                </div>
            </div>
            <div className={styles.historyAmount}>
                <div className={styles.amount}>
                    {transaction.amount} {transaction.currency}
                </div>
                <div className={getStatusClass(transaction.status)}>
                    {getStatusLabel(transaction.status)}
                </div>
            </div>
        </div>
    );
}
