import React from 'react';
import { Transaction } from '@/src/services/wallet';
import TruncatedText from '../../TruncatedText/TruncatedText';

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
                    {transaction.recipient && (
                        <span>
                            Đến: <TruncatedText text={transaction.recipient} startLength={6} endLength={6} />
                        </span>
                    )}
                    {transaction.address && (
                        <span>
                            Địa chỉ: <TruncatedText text={transaction.address} startLength={6} endLength={6} />
                        </span>
                    )}
                    {transaction.network && <span>• {transaction.network}</span>}
                    {transaction.txHash && (
                        <span>
                            • TxID: <TruncatedText text={transaction.txHash} startLength={6} endLength={6} />
                        </span>
                    )}
                    {transaction.fee !== undefined && (
                        <span> • Phí: {transaction.fee} {transaction.currency}</span>
                    )}
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
